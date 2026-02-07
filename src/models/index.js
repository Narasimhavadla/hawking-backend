const sequelize = require('../config/db');

const createUserModel = require('./studentsModel')
const createUserModels = require('./userModel')
const parentTest = require('../models/parentTestModel')
const studentTestModel = require('../models/studentTestModel')
const examModels = require('../models/exam')
const teacherModels = require('./teacher.model')
const paymentModel = require('./paymentModel');
const teacherReferralModel = require("./teacherReferral.model");
const createUserActivityModel = require("./userActivity.model")
const createBooks = require("./books.model");
const createBookOrder = require("./booksOrder")
const createWallPost = require("./wallPost.modal")




const studentModel = createUserModel(sequelize);
const userModel = createUserModels(sequelize);
const parentTestModel = parentTest(sequelize)
const stuTestModel = studentTestModel(sequelize)
const examModel = examModels(sequelize)
const teacherModel = teacherModels(sequelize)
const Payment = paymentModel(sequelize)
const TeacherReferral = teacherReferralModel(sequelize);
const UserActivity = createUserActivityModel(sequelize);
const booksModel = createBooks(sequelize);
const booksOrderModel = createBookOrder(sequelize);
const wallPostModel = createWallPost(sequelize);



TeacherReferral.belongsTo(teacherModel, {
  foreignKey: "referrerTeacherId",
  as: "referrer",
});

TeacherReferral.belongsTo(teacherModel, {
  foreignKey: "referredTeacherId",
  as: "referred",
});

// // Payment relations
// Payment.belongsTo(teacherModel, { foreignKey: "id" });
// teacherModel.hasMany(Payment, { foreignKey: "teacherId" });

// Payment.belongsTo(examModel, { foreignKey: "examId" });
// examModel.hasMany(Payment, { foreignKey: "examId" });

// Payment.belongsTo(studentModel, { foreignKey: "id" });
// studentModel.hasMany(Payment, { foreignKey: "studentId" });

// ================= PAYMENT RELATIONS ================= //

// Teacher ↔ Payment
Payment.belongsTo(teacherModel, {
  foreignKey: "teacherId",
  as: "teacher",
});

teacherModel.hasMany(Payment, {
  foreignKey: "teacherId",
  as: "payments",
});

// Student ↔ Payment
Payment.belongsTo(studentModel, {
  foreignKey: "studentId",
  as: "student",
});

studentModel.hasMany(Payment, {
  foreignKey: "studentId",
  as: "payments",
});

// Exam ↔ Payment
Payment.belongsTo(examModel, {
  foreignKey: "examId",
  as: "exam",
});

examModel.hasMany(Payment, {
  foreignKey: "examId",
  as: "payments",
});


// BooksOrders -> Book
booksOrderModel.belongsTo(booksModel, {
  foreignKey: "bookId",
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
    UserActivity,
    booksModel,
    booksOrderModel,
    wallPostModel

}