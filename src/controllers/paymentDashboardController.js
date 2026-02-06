const { Op } = require("sequelize");

exports.getPaymentsDashboard = async (req, res) => {
  try {
    const Payment = req.Payment;
    const Teacher = req.teacherModel;
    const Exam = req.examModel;
    const Student = req.studentModel;

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const payments = await Payment.findAll({
      include: [
        {
          model: Teacher,
          as: "teacher",
          attributes: ["name", "school"],
          required: false,
        },
        {
          model: Exam,
          as: "exam",
          attributes: ["examName"],
          required: false,
        },
        {
          model: Student,
          as: "student",
          attributes: ["name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = payments.map((p) => ({
      id: p.id,
      teacher: p.teacher?.name || "student",
      school: p.teacher?.school || "-",
      exam:
        p.exam?.examName ||
        p.examName ||
        "Student Registration",
      students: p.studentId ? 1 : "-",
      amount: p.amount,
      date: p.createdAt,
      status:
        p.status === "SUCCESS"
          ? "Success"
          : p.status === "PENDING"
          ? "Pending"
          : "Failed",
    }));

    const monthlyRevenue = payments
      .filter(
        (p) =>
          p.status === "SUCCESS" &&
          new Date(p.createdAt) >= startOfMonth &&
          new Date(p.createdAt) <= endOfMonth
      )
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      payments: formatted,
      monthlyRevenue,
      totalPayments: payments.length,
    });
  } 
  catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
