const { TeacherReferral, teacherModel } = require("../models");
const { Op } = require("sequelize");

/**
 * ADMIN: Get all referrals
 */
exports.getAllReferrals = async (req, res) => {
  try {
    const referrals = await TeacherReferral.findAll({
      where: {
        referredTeacherId: { [Op.ne]: null }, // ONLY USAGES
      },
      include: [
        { model: teacherModel, as: "referrer", attributes: ["id", "name"] },
        { model: teacherModel, as: "referred", attributes: ["id", "name"] },
      ],
      order: [["usedAt", "DESC"]],
    });

    // count per referrer
    const countMap = {};
    referrals.forEach((r) => {
      countMap[r.referrerTeacherId] =
        (countMap[r.referrerTeacherId] || 0) + 1;
    });

    const formatted = referrals.map((r) => ({
      referrerId: r.referrerTeacherId,
      referrerName: r.referrer?.name,
      referredName: r.referred?.name,
      referralCode: r.referralCode,
      usedAt: r.usedAt,
      cashbackAmount: r.cashbackAmount,
      status: r.status,
      referralCount: countMap[r.referrerTeacherId],
    }));

    res.json({ status: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};



/**
 * TEACHER: Referral summary
 */
exports.getTeacherReferralSummary = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const referrals = await TeacherReferral.findAll({
      where: {
        referrerTeacherId: teacherId,
        referredTeacherId: { [Op.ne]: null },
      },
    });

    res.json({
      status: true,
      data: {
        referralCode:
          referrals[0]?.referralCode ||
          (
            await TeacherReferral.findOne({
              where: {
                referrerTeacherId: teacherId,
                referredTeacherId: null,
              },
            })
          )?.referralCode ||
          null,
        totalReferrals: referrals.length,
        totalCashback: referrals.reduce(
          (sum, r) => sum + (r.cashbackAmount || 0),
          0
        ),
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};


/**
 * USE REFERRAL CODE (after payment success)
 */
exports.useReferralCode = async (req, res) => {
  try {
    const { referralCode, referredTeacherId } = req.body;

    // Find the ORIGINAL referrer
    const baseReferral = await TeacherReferral.findOne({
      where: { referralCode },
    });

    if (!baseReferral) {
      return res.status(400).json({
        status: false,
        message: "Invalid referral code",
      });
    }

    // Create NEW referral usage record
    await TeacherReferral.create({
      referralCode,
      referrerTeacherId: baseReferral.referrerTeacherId,
      referredTeacherId,
      status: "Used",
      usedAt: new Date(),
      cashbackAmount: 500, // example
    });

    res.json({
      status: true,
      message: "Referral applied successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
