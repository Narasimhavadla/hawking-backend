// routes/studentTestRoutes.js
const express = require("express");
const router = express.Router();

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
  StudentController.toggleStudentTestimonialPublish
);

router.get("/student-testinomials/:id", StudentController.getStudTestById);
router.put("/student-testinomials/:id", StudentController.updateStuTest);
router.delete("/student-testinomials/:id", StudentController.deleteStuTestinomial);

module.exports = router;
