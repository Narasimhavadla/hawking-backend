// routes/studentTestRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require('../../middleware/auth.middleware');
const { allowRoles } = require("../../middleware/roleMiddleware");

const StudentController = require("../controllers/studentTestContoller");

/* ---------- FIXED ROUTES FIRST ---------- */
router.get(
  "/student-testinomials/published",
  StudentController.getPublishedStudentTestimonials
);

/* ---------- CRUD ROUTES ---------- */
router.get("/student-testinomials", StudentController.getStudetnTests);
router.post("/student-testinomials", StudentController.createStuTestnomial);

router.patch(
  "/student-testinomials/:id/toggle",
  verifyToken,
  allowRoles("admin","superadmin"),
  StudentController.toggleStudentTestimonialPublish
);

router.get("/student-testinomials/:id", StudentController.getStudTestById);
router.put("/student-testinomials/:id", StudentController.updateStuTest);
router.delete("/student-testinomials/:id",
  verifyToken,
  allowRoles("admin","superadmin"),
  StudentController.deleteStuTestinomial);

module.exports = router;
