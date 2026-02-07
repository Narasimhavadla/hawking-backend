const { DataTypes } = require("sequelize");

const createWallPost = (sequelize) => {
  return sequelize.define(
    "WallPost",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      content: {
        type: DataTypes.TEXT, // better for long content
        allowNull: false,
      },

      image: {
        type: DataTypes.STRING, // image URL / path
        allowNull: true,
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // active/inactive
      },

      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // only one true
      },
    },
    {
      tableName: "wall_posts",
      timestamps: true,
    }
  );
};

module.exports = createWallPost;
