const sequelize = require('sequelize')
const {DataTypes} = require('sequelize')

const createExam = (sequelize) =>{
    return sequelize.define(
        "Exam",{
            id: {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true
            },
            name : {
                type : DataTypes.STRING,
                allowNull : false,
                
            },
            year : {
                type : DataTypes.INTEGER,
                allowNull : false
            },
            status: {
                type: DataTypes.STRING, 
                allowNull: false,
            },
            lastRegistrationDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            onlineExamDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            onlineExamResultDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            onlineLiveInterviewDate: {
                type: DataTypes.DATE,
                allowNull: true, // interview may not exist for all exams
            },
            finalResultDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2), // good for money
                allowNull: false,
            },
             examFormat: {
                type: DataTypes.STRING, // e.g. "online", "offline", "hybrid"
                allowNull: true,
            },
        },
        {
            tableName: 'exams',
            timestamps: true,
        }
    )
}

module.exports = createExam;