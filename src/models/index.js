const sequelize = require('../config/db');

const createUserModel = require('./studentsModel')
const createUserModels = require('./userModel')
const parentTest = require('../models/parentTestModel')
const studentTestModel = require('../models/studentTestModel')
const examModels = require('../models/exam')
const teacherModels = require('./teacher.model')
const paymentModel = require('./paymentModel');
const teacherReferralModel = require("./teacherReferral.model");


const studentModel = createUserModel(sequelize);
const userModel = createUserModels(sequelize);
const parentTestModel = parentTest(sequelize)
const stuTestModel = studentTestModel(sequelize)
const examModel = examModels(sequelize)
const teacherModel = teacherModels(sequelize)
const Payment = paymentModel(sequelize)
const TeacherReferral = teacherReferralModel(sequelize);

TeacherReferral.belongsTo(teacherModel, {
  foreignKey: "referrerTeacherId",
  as: "referrer",
});

TeacherReferral.belongsTo(teacherModel, {
  foreignKey: "referredTeacherId",
  as: "referred",
});




const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      console.log("🛠 DB synced (alter mode)");
    } else {
      await sequelize.sync();
      console.log("✅ DB synced");
    }
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }
};



module.exports = {
    studentModel,
    initDb,
    userModel,
    parentTestModel,
    stuTestModel,
    examModel,
    teacherModel,
    Payment,
    TeacherReferral,

}