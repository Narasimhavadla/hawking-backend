const bcrypt = require("bcrypt");
const sendTeacherCredentials = require("../utils/sendEmail");

const DEFAULT_PASSWORD = "welcome@123";


const TeacherController = {

        // createTeacher: async (req, res) => {
        // try {
        //     const teacher = await req.teacherModel.create(req.body);

        //     res.status(201).json({
        //     status: true,
        //     message: "Teacher registered successfully",
        //     data: teacher,
        //     });

        // } catch (error) {


        //     // 🔐 Duplicate email handling
        //     if (error.name === "SequelizeUniqueConstraintError") {
        //     return res.status(409).json({
        //         status: false,
        //         message: "Email already exists",
                
        //     });
        //     }

        //     res.status(500).json({
        //     status: false,
        //     message: "Internal server error",
        //     error: error.message, 
        //     });
        // }
        // },



        createTeacher: async (req, res) => {
            try {
              const {
                name,
                email,
                school,
                qualification,
                phone,
                teachingType,
                upiId,
                teachingFrom,
                teachingTo,
              } = req.body;


              const teacher = await req.teacherModel.create({
                name,
                email,
                school,
                qualification,
                phone,
                teachingType,
                upiId,
                teachingFrom: teachingFrom,
                teachingTo: teachingTo,
                role: "teacher",
              });
              // 2️⃣ Create User (Teacher Login)
              const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

              await req.userModel.create({
                username: email,
                password: hashedPassword,
                role: "teacher",
              });
              // 3️⃣ Send Email
              await sendTeacherCredentials({
                toEmail: email,
                name,
                username: email,
                password: DEFAULT_PASSWORD,
              });

              res.status(201).json({
                status: true,
                message: "Teacher registered & credentials sent via email",
                data: teacher,
              });
              } catch (error) {

                  if (error.name === "SequelizeUniqueConstraintError") {
                    return res.status(409).json({
                      status: false,
                      message: "Email already exists",
                    });
                  }
                    res.status(500).json({
                    status: false,
                    message: "Internal server error",
                    error: error.message,
                  });
                }
              },






        getAllTeachers: async (req, res) => {
            try {
            const teachers = await req.teacherModel.findAll({
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({
                status: true,
                data: teachers,
                meta : {totalTeachers : teachers.length}
            });
            } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
            }
        },
        // getTeachersCount: async (req, res) => {
        //         try {
        //             // Efficient way to get total count
        //             const totalTeachers = await req.teacherModel.count();

        //             res.status(200).json({
        //                 status: true,
        //                 meta: { totalTeachers }
        //             });
        //         } catch (error) {
        //             res.status(500).json({
        //                 status: false,
        //                 message: error.message,
        //             });
        //         }
        //     },


  // ✅ READ ONE
  
  getTeacherById: async (req, res) => {
    try {
      const teacher = await req.teacherModel.findByPk(req.params.id);

      if (!teacher) {
        return res.status(404).json({
          status: false,
          message: "Teacher not found",
        });
      }

      res.status(200).json({
        status: true,
        data: teacher,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  // ✅ UPDATE
  updateTeacher: async (req, res) => {
    try {
      const [updated] = await req.teacherModel.update(req.body, {
        where: { id: req.params.id },
      });

      if (!updated) {
        return res.status(404).json({
          status: false,
          message: "Teacher not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Teacher updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  // ✅ DELETE
  deleteTeacher: async (req, res) => {
    try {
      const deleted = await req.teacherModel.destroy({
        where: { id: req.params.id },
      });

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Teacher not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Teacher deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
};

module.exports = TeacherController;
