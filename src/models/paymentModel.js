const { DataTypes } = require("sequelize");

const Payment = (sequelize) => {
  return sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      examId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      examName : {
        type : DataTypes.STRING,
        allowNull :false
      },

      razorpay_order_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      razorpay_payment_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      razorpay_signature: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      invoiceNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      discountApplied: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },

      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "payments",
      timestamps: true,
    }
  );
};

module.exports = Payment;
