const { Sequelize, Op } = require("sequelize");
const { catchError } = require("../utils/errorHandler");

const StudentController = {
  /* GET ALL */
  getStudents: async (req, res) => {
    try {
      const students = await req.studentModel.findAll();
      res.status(200).send({
        status: true,
        message: "Successfully fetched!",
        data: students,
        meta: { totalStudents: students.length },
      });
    } catch (err) {
      catchError(res, err, "Failed to fetch students");
    }
  },

  /* GET BY ID */
  getStudent: async (req, res) => {
    try {
      const student = await req.studentModel.findByPk(req.params.id);

      if (!student) {
        return res.status(404).send({
          status: false,
          message: "Student not found",
        });
      }

      res.status(200).send({
        status: true,
        message: "Student fetched successfully",
        data: student,
      });
    } catch (err) {
      catchError(res, err, "Failed to get student");
    }
  },

  /* CREATE SINGLE STUDENT */
createStudents: async (req, res) => {
  try {
    const {
      Class,
      name,
      fathername,
      email,
      phone,
      altphone,
      dob,
      institute,
      state,
      city,
      pincode,
      Status,
      examId,
      teacherId,
    } = req.body;

    // ✅ Mandatory validation
    if (
      !Class ||
      !name ||
      !fathername ||
      !email ||
      !phone ||
      !dob ||
      !institute ||
      !state ||
      !city ||
      !pincode
    ) {
      return res.status(400).send({
        status: false,
        message: "All fields are mandatory",
      });
    }

    // ✅ Phone validation
    if (!/^\d{10}$/.test(String(phone))) {
      return res.status(400).send({
        status: false,
        message: "Phone must be 10 digits",
      });
    }

    // ✅ Date validation
    const parsedDob = new Date(dob);
    if (isNaN(parsedDob)) {
      return res.status(400).send({
        status: false,
        message: "Invalid DOB format",
      });
    }

    const newStudent = await req.studentModel.create({
      Class,
      name,
      fathername,
      email,
      phone: String(phone),
      altphone: altphone ? String(altphone) : null,
      dob: parsedDob,
      institute,
      state,
      city,
      pincode: String(pincode),
      Status: Status || "pending",
      examId: examId || 0,
      teacherId: teacherId || 0,
    });

    // ✅ RESPONSE with X if teacherId missing
    const responseData = {
      ...newStudent.toJSON(),
      teacherId: newStudent.teacherId ? newStudent.teacherId : "0",
    };

    res.status(201).send({
      status: true,
      message: "Student Created Successfully!",
      data: responseData,
    });
  } catch (err) {
    console.error(err); // 👈 VERY IMPORTANT
    catchError(res, err, "Failed to create student");
  }
},



  /* UPDATE STUDENT */
  updateStudent: async (req, res) => {
    try {
      const {
        Class,
        name,
        fathername,
        email,
        phone,
        altphone,
        dob,
        institute,
        state,
        city,
        pincode,
        Status,
      } = req.body;

      const student = await req.studentModel.findByPk(req.params.id);

      if (!student) {
        return res.status(404).send({
          status: false,
          message: "Student not found",
        });
      }

      const updatedStudent = await student.update({
        Class: Class ?? student.Class,
        name: name ?? student.name,
        fathername: fathername ?? student.fathername,
        email: email ?? student.email,
        phone: phone ?? student.phone,
        altphone: altphone ?? student.altphone,
        dob: dob ? new Date(dob) : student.dob,
        institute: institute ?? student.institute,
        state: state ?? student.state,
        city: city ?? student.city,
        pincode: pincode ?? student.pincode,
        Status: Status ?? student.Status,
      });

      res.status(200).send({
        status: true,
        message: "Student Updated Successfully",
        data: updatedStudent,
      });
    } catch (err) {
      catchError(res, err, "Failed to update student");
    }
  },

  /* DELETE STUDENT */
  deleteStudent: async (req, res) => {
    try {
      const student = await req.studentModel.findByPk(req.params.id);

      if (!student) {
        return res.status(404).send({
          status: false,
          message: "Student not found",
        });
      }

      const deletedData = { ...student.dataValues };
      await student.destroy();

      res.status(200).send({
        status: true,
        message: "Student Deleted Successfully",
        data: deletedData,
      });
    } catch (err) {
      catchError(res, err, "Failed to delete student");
    }
  },

  /* PIE CHART DATA */
  getStudentsPieChart: async (req, res) => {
    try {
      const result = await req.studentModel.findAll({
        attributes: [
          ["Class", "name"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "value"],
        ],
        group: ["Class"],
        raw: true,
      });

      const allClasses = [
        "Class-4",
        "Class-5",
        "Class-6",
        "Class-7",
        "Class-8",
        "Class-9",
      ];

      const formattedData = allClasses.map((cls) => {
        const found = result.find((r) => r.name === cls);
        return {
          name: cls,
          value: found ? Number(found.value) : 0,
        };
      });

      const totalStudents = formattedData.reduce(
        (sum, item) => sum + item.value,
        0
      );

      res.status(200).send({
        status: true,
        message: "Students distribution by class",
        data: formattedData,
        meta: { totalStudents },
      });
    } catch (err) {
      catchError(res, err, "Failed to fetch pie chart data");
    }
  },

  /* LINE CHART - LAST 30 DAYS */
  getStudentsLastMonth: async (req, res) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 29);

      const result = await req.studentModel.findAll({
        attributes: [
          [Sequelize.fn("DATE", Sequelize.col("createdAt")), "day"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "students"],
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
        order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
        raw: true,
      });

      const data = [];
      for (let i = 0; i < 30; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);

        const key = d.toISOString().slice(0, 10);
        const found = result.find((r) => r.day === key);

        data.push({
          day: d.getDate(),
          students: found ? Number(found.students) : 0,
        });
      }

      res.status(200).send({
        status: true,
        data,
      });
    } catch (err) {
      catchError(res, err, "Failed to fetch line chart data");
    }
  },

  /* DASHBOARD DETAILS */
  getDashboardDetails: async (req, res) => {
    try {
      const examScheudle = await req.examModel.findAll();
      const totalExams = examScheudle.length;

      const activeExams = await req.examModel.count({
        where: { status: "active" },
      });

      const inactiveExams = await req.examModel.count({
        where: { status: "inactive" },
      });

      const students = await req.studentModel.findAll();
      const totalTeachers = await req.teacherModel.count();

      res.status(200).send({
        status: true,
        message: "Successfully fetched",
        meta: {
          total_examSchedule: totalExams,
          activeExams,
          inactiveExams,
          totalStudents: students.length,
          totalTeachers,
        },
      });
    } catch (err) {
      catchError(res, err, "Failed to get Dashboard Data");
    }
  },

  
  /* BULK CREATE STUDENTS */
createStudentsBulk: async (req, res) => {
  const transaction = await req.studentModel.sequelize.transaction();

  try {
    const { examId, teacherId, students } = req.body;

    if (!examId) {
      return res.status(400).send({
        status: false,
        message: "Exam ID is required",
      });
    }

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).send({
        status: false,
        message: "Students array is required",
      });
    }

    const validatedStudents = [];
    const errors = [];

    for (let i = 0; i < students.length; i++) {
      const s = students[i];

      if (
        !s.Class ||
        !s.name ||
        !s.fathername ||
        !s.email ||
        !s.phone ||
        !s.dob ||
        !s.institute ||
        !s.state ||
        !s.city ||
        !s.pincode
      ) {
        errors.push(`Row ${i + 1}: Missing required fields`);
        continue;
      }

      if (!/^\d{10}$/.test(String(s.phone))) {
        errors.push(`Row ${i + 1}: Phone must be 10 digits`);
        continue;
      }

      validatedStudents.push({
        Class: s.Class,
        name: s.name,
        fathername: s.fathername,
        email: s.email,
        phone: String(s.phone),
        altphone: s.altphone ? String(s.altphone) : null,
        dob: new Date(s.dob),
        institute: s.institute,
        state: s.state,
        city: s.city,
        pincode: Number(s.pincode), // ✅ FIX
        Status: s.Status || "pending",
        examId: examId,
        teacherId: teacherId || null, // ✅ SAFE
      });
    }

    if (errors.length > 0) {
      await transaction.rollback();
      return res.status(400).send({
        status: false,
        message: "Validation failed",
        errors,
      });
    }

    const created = await req.studentModel.bulkCreate(
      validatedStudents,
      { transaction }
    );

    await transaction.commit();

    res.status(201).send({
      status: true,
      message: "Students registered successfully",
      meta: {
        totalInserted: created.length,
      },
      data: created,
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err); // 👈 IMPORTANT FOR DEBUG
    catchError(res, err, "Failed to bulk register students");
  }
},



};

module.exports = StudentController;
