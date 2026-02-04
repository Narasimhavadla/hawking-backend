const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserActivity = sequelize.define(
    "UserActivity",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      loginTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      logoutTime: {
        type: DataTypes.DATE,
      },

      durationMinutes: {
        type: DataTypes.INTEGER,
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "LOGGED_OUT"),
        defaultValue: "ACTIVE",
      },

    //   ipAddress: {
    //     type: DataTypes.STRING,
    //   },

    //   userAgent: {
    //     type: DataTypes.STRING,
    //   },
    },
    {
      tableName: "user_activities",
      timestamps: true,
    }
  );

  return UserActivity;
};
