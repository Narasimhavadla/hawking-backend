const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TeacherReferral = sequelize.define(
    "TeacherReferral",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      referralCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      referrerTeacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      referredTeacherId: {
        type: DataTypes.INTEGER,
        allowNull: true, // filled after registration
      },

      status: {
        type: DataTypes.ENUM("Unused", "Pending", "Used"),
        // defaultValue: "Unused",
      },

      cashbackAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "teacher_referrals",
      timestamps: true,
    }
  );

  return TeacherReferral;
};
