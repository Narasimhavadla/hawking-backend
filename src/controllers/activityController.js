const jwt = require("jsonwebtoken");

exports.logout = async (req, res) => {
  try {
    let userId;

    /* ===== TOKEN FROM HEADER ===== */
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    /* ===== TOKEN FROM BODY (Beacon fallback) ===== */
    if (!userId && req.body.token) {
      const decoded = jwt.verify(
        req.body.token,
        process.env.JWT_SECRET
      );
      userId = decoded.id;
    }

    const { activityId } = req.body;

    if (!activityId || !userId) {
      return res.status(400).json({
        status: false,
        message: "Activity ID required",
      });
    }

    const activity = await req.UserActivity.findOne({
      where: {
        id: activityId,
        userId,
        status: "ACTIVE",
      },
    });

    if (!activity) {
      return res.json({
        status: true,
        message: "Already logged out",
      });
    }

    const logoutTime = new Date();
    const durationMinutes = Math.floor(
      (logoutTime - activity.loginTime) / 60000
    );

    await activity.update({
      logoutTime,
      durationMinutes,
      status: "LOGGED_OUT",
    });

    res.json({
      status: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("LOGOUT ERROR 👉", err);
    res.status(500).json({
      status: false,
      message: "Logout failed",
    });
  }
};



exports.getUserActivities = async (req, res) => {
  const data = await req.UserActivity.findAll({
    attributes: [
      "id",
      "userId",
      "username",
      "role",
      "loginTime",
      "logoutTime",
      "status",
      "durationMinutes",
    ],
    order: [["loginTime", "DESC"]],
  });

  res.json({ status: true, data });
};

