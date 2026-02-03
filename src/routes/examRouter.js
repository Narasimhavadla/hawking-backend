const express = require('express')

const router = express.Router()

const examScheduleController = require('../controllers/examController');
const { verifyToken } = require('../../middleware/auth.middleware');
const { allowRoles } = require("../../middleware/roleMiddleware");



// router.get('/exam-schedule/count',examScheduleController.getExamCount)
router.get(
  "/teacher/:teacherId/dashboard",verifyToken,
  allowRoles("admin", "teacher","superadmin"),

  examScheduleController.getTeacherDashboardStats
);

router.get(
  "/teacher/:teacherId/students-pie",verifyToken,
  allowRoles("admin", "teacher","superadmin"),
  examScheduleController.getTeacherStudentsPie
);


router.get('/exam-schedule',verifyToken,
  allowRoles("admin", "teacher","superadmin"),
  examScheduleController.getExamSchedule)

router.get('/exam-schedule/:id',verifyToken,
  allowRoles("admin", "teacher","superadmin"),
  examScheduleController.getExamScheduleById)

router.post('/exam-schedule',verifyToken,
  allowRoles("admin", "superadmin"),
  examScheduleController.createExamSchedule)

router.put('/exam-schedule/:id',verifyToken,
  allowRoles("admin", "superadmin"),
  examScheduleController.updateExamSchedule)

router.delete('/exam-schedule/:id',verifyToken,
  allowRoles("admin", "superadmin"),
  examScheduleController.deleteExamSchedule)

// router.get("/testimonials/public", examScheduleController.getPublishedTestimonials);



module.exports = router