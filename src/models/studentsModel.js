const { DataTypes } = require('sequelize');

const createStudent = (sequelize) => {
  return sequelize.define(
    'students',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Class: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fathername : {
        type : DataTypes.STRING,
        allowNull : false
      },
      email : {
        type : DataTypes.STRING,
        allowNull : false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      altphone : {
        type : DataTypes.STRING,
        allowNull : true
      },
      dob : {
        type : DataTypes.DATE,
        allowNull : false
      },
      institute : {
        type : DataTypes.STRING,
        allowNull : false
      },
      state : {
        type : DataTypes.STRING,
        allowNull : false
      },
      city : {
        type : DataTypes.STRING,
        allowNull : false
      },
      pincode : {
        type : DataTypes.STRING,
        allowNull : false
      },
      Status : {
        type : DataTypes.STRING,
        allowNull : false
      },
      examId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

    },
    {
      timestamps: true,
    }
  );
};

module.exports = createStudent;
