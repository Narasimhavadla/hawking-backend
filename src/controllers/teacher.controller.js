const bcrypt = require("bcrypt");
const sendTeacherCredentials = require("../utils/sendEmail");
const  {generateReferralCode } = require("../utils/generateReferralCode");
const teacherModel = require('../models/teacher.model')
const teacherReferralModel = require('../models/teacherReferral.model')


const DEFAULT_PASSWORD = "welcome@123";


const TeacherController = {


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
      refferCode, // optional entered code
    } = req.body;

    // 1️⃣ Create teacher
    const teacher = await req.teacherModel.create({
      name,
      email,
      school,
      qualification,
      phone,
      teachingType,
      upiId,
      teachingFrom,
      teachingTo,
      role: "teacher",

    });

    // 2️⃣ Create teacher's OWN referral code
    const myReferralCode = generateReferralCode();

    await req.teacherReferralModel.create({
      referralCode: myReferralCode,
      referrerTeacherId: teacher.id,
      status : "Unused"
    });

    // 3️⃣ If teacher used someone else's referral code
  // 3️⃣ If teacher used someone else's referral code
      if (refferCode) {
        const baseReferral = await req.teacherReferralModel.findOne({
          where: {
            referralCode: refferCode,
            referredTeacherId: null, // OWNER ROW ONLY
          },
        });

        if (!baseReferral) {
          return res.status(400).json({
            status: false,
            message: "Invalid referral code",
          });
        }

        await req.teacherReferralModel.create({
          referralCode: refferCode,
          referrerTeacherId: baseReferral.referrerTeacherId,
          referredTeacherId: teacher.id,
          status: "Used",
          usedAt: new Date(),
          cashbackAmount: 0, // ✅ default
        });
      }


    // 4️⃣ Create login user
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await req.userModel.create({
      username: email,
      password: hashedPassword,
      role: "teacher",
    });

    // 5️⃣ Send credentials
    await sendTeacherCredentials({
      toEmail: email,
      name,
      username: email,
      password: DEFAULT_PASSWORD,
    });

    res.status(201).json({
      status: true,
      message: "Teacher registered successfully",
      referralCode: myReferralCode,
      data : teacher
    });


  } catch (error) {

      if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
              status: false,
              message: "Email already exists",
            });
          }

    res.status(500).json({ status: false, message: error.message });
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
  const transaction = await req.sequelize.transaction();

  try {
    // 1️⃣ Find teacher
    const teacher = await req.teacherModel.findByPk(req.params.id, {
      transaction,
    });

    if (!teacher) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: "Teacher not found",
      });
    }

    // 2️⃣ Delete user linked to teacher (by email)
    await req.userModel.destroy({
      where: { username: teacher.email },
      transaction,
    });

    // 3️⃣ Delete teacher
    await req.teacherModel.destroy({
      where: { id: teacher.id },
      transaction,
    });

    await transaction.commit();

    res.status(200).json({
      status: true,
      message: "Teacher and user deleted successfully",
    });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
},

};

module.exports = TeacherController;
