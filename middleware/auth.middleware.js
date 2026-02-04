const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        status: false,
        message: "Access denied. Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded; // { id, role, teacherId }

    next();
  } catch (err) {
    return res.status(401).send({
      status: false,
      message: "Invalid or expired token",
    });
  }
};



