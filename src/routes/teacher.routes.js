const express = require("express");
const router = express.Router();

const TeacherController = require("../controllers/teacher.controller");

// CREATE
router.post("/teachers", TeacherController.createTeacher);
// router.get("/teachers/count", TeacherController.getTeachersCount);


// READ
router.get("/teachers", TeacherController.getAllTeachers);
router.get("/teachers/:id", TeacherController.getTeacherById);




// UPDATE
router.put("/teachers/:id", TeacherController.updateTeacher);

// DELETE
router.delete("/teachers/:id", TeacherController.deleteTeacher);

module.exports = router;
