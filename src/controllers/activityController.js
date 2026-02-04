exports.logout = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { activityId } = req.body;

    if (!activityId) {
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
      return res.status(400).json({
        status: false,
        message: "Session already closed or not found",
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

