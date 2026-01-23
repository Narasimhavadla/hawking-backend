const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Teacher = sequelize.define(
    "Teacher",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      school: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      qualification: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone : {
        type :DataTypes.STRING,
        allowNull : false
      },

      teachingType: {
        type: DataTypes.STRING,
        allowNull: true, // Online / Offline / Both
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      upiId: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      teachingFrom: {
        type: DataTypes.STRING,
        allowNull: true, // Class 1, Class 5, etc
      },

      teachingTo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "teachers",
      timestamps: true,
    }
  );

  return Teacher;
};
