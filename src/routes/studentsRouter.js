// const express = require("express");
// const router = express.Router();

// const studentController = require("../controllers/studentsController");

// /* ================= CHARTS & DASHBOARD ================= */
// /* PIE CHART — MUST BE ABOVE :id ROUTE */
// router.get("/student-pie", studentController.getStudentsPieChart);

// /* LINE CHART */
// router.get("/student-line", studentController.getStudentsLastMonth);

// /* DASHBOARD DATA */
// router.get("/dashboard-data", studentController.getDashboardDetails);

// /* ================= BULK OPERATIONS ================= */
// router.post("/student/bulk", studentController.createStudentsBulk);

// /* ================= SINGLE OPERATIONS ================= */
// router.get("/student", studentController.getStudents);
// router.get("/student/:id", studentController.getStudent);
// router.post("/student", studentController.createStudents);
// router.put("/student/:id", studentController.updateStudent);
// router.delete("/student/:id", studentController.deleteStudent);

// module.exports = router;


const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentsController");
const { verifyToken } = require("../../middleware/auth.middleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

/* ================= CHARTS & DASHBOARD ================= */
router.get("/student-pie", verifyToken,
    allowRoles("admin" ,"superadmin"),
     studentController.getStudentsPieChart);

router.get("/student-line", verifyToken,
    allowRoles("admin" ,"superadmin"),
    studentController.getStudentsLastMonth);

router.get("/dashboard-data", verifyToken,
    allowRoles("admin" ,"superadmin"),
     studentController.getDashboardDetails);

/* ================= BULK OPERATIONS ================= */
router.post(
  "/student/bulk",
  verifyToken,
  allowRoles("admin", "teacher","superadmin"),
  studentController.createStudentsBulk
);

/* ================= SINGLE OPERATIONS ================= */
router.get("/student", verifyToken, studentController.getStudents);
router.get("/student/:id", verifyToken, studentController.getStudent);

router.post(
  "/student",
  verifyToken,
  allowRoles("admin", "teacher","superadmin"),
  studentController.createStudents
);

router.put(
  "/student/:id",
  verifyToken,
  allowRoles("admin", "teacher","superadmin"),
  studentController.updateStudent
);

router.delete(
  "/student/:id",
  verifyToken,
  allowRoles("admin","superadmin"),
  studentController.deleteStudent
);

module.exports = router;
