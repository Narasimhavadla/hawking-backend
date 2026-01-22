const sequelize = require('../config/db');

const createUserModel = require('./studentsModel')
const createUserModels = require('./userModel')
const parentTest = require('../models/parentTestModel')
const studentTestModel = require('../models/studentTestModel')
const examModels = require('../models/exam')

const studentModel = createUserModel(sequelize);
const userModel = createUserModels(sequelize);
const parentTestModel = parentTest(sequelize)
const stuTestModel = studentTestModel(sequelize)
const examModel = examModels(sequelize)



const initDb = async () => {
  await sequelize.authenticate();
  console.log("✅ DB connected");
  await sequelize.sync();
  console.log("✅ Models synced");
};


module.exports = {
    studentModel,
    initDb,
    userModel,
    parentTestModel,
    stuTestModel,
    examModel,
}