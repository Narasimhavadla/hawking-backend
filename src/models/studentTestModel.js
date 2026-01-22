const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')


const createStudentTestinomial = (sequelize) =>{
    return sequelize.define(
        "studenttest",{
            id : {
                type : DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey : true
            },
            name : {
                type : DataTypes.STRING,
                allowNull : false
            },
            content : {
                type : DataTypes.STRING,
                allowNull : false
            },
            rating : {
                type : DataTypes.INTEGER,
                allowNull : false
            }
        }
    )
}

module.exports = createStudentTestinomial;