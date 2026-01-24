const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentsController");

/* PIE CHART — MUST BE ABOVE :id ROUTE */
router.get("/student-pie", studentController.getStudentsPieChart);
/* LINE CHART */
router.get("/student-line", studentController.getStudentsLastMonth);

router.get("/dashboard-data", studentController.getDashboardDetails);


router.get("/student", studentController.getStudents);
router.get("/student/:id", studentController.getStudent);
router.post("/student", studentController.createStudents);
router.put("/student/:id", studentController.updateStudent);
router.delete("/student/:id", studentController.deleteStudent);

module.exports = router;
