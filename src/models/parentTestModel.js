const {DataTypes} = require('sequelize')


const createParentTest = (sequelize) =>{
    return sequelize.define(
        "ParentTest",{
            id: {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true
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
            },
            isPublished: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            }

        },
        {
            timestamps : true
        }
    )
}

module.exports = createParentTest;