// const { catchError } = require("../utils/errorHandler");
const { Sequelize,Op } = require("sequelize");
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

  /* CREATE */
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
      } = req.body;

      if (
        !Class || !name || !fathername || !email || !phone ||
        !dob || !institute || !state || !city || !pincode || !Status
      ) {
        return res.status(400).send({
          status: false,
          message: "All fields are mandatory",
        });
      }

      const newStudent = await req.studentModel.create({
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
      });

      res.status(201).send({
        status: true,
        message: "Student Created Successfully!",
        data: newStudent,
      });
    } catch (err) {
      catchError(res, err, "Failed to create student");
    }
  },

  /* UPDATE */
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

  /* DELETE */
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
        meta : {totalStudents}
      });
    } catch (err) {
      catchError(res, err, "Failed to fetch pie chart data");
    }
  },


  // last one this.month
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
      const found = result.find(r => r.day === key);

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
    console.error(err);
    catchError(res, err, "Failed to fetch line chart data");
  }
},


// getDashboardDetails
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
                totalTeachers

                
            },
            });
        } catch (err) {
            catchError(res, err, "Failed to get Data");
        }
        },



};

module.exports = StudentController;
