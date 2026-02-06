const { DataTypes } = require("sequelize");

const createBooks = (sequelize) => {
  return sequelize.define(
    "Books",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bookName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING, // store image path / filename
        allowNull: true,
      },
    },
    {
      tableName: "books",
      timestamps: true,
    } 
  );
};

module.exports = createBooks;
