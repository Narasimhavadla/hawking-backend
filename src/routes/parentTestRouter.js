const express = require("express");
const router = express.Router();

const ParentTestinoial = require("../controllers/parentTest");

/* ---------- FIXED ROUTES FIRST ---------- */
router.get(
  "/parent-testinomials/published",
  ParentTestinoial.getPublishedParentTestimonials
);

/* ---------- CRUD ROUTES ---------- */
router.get("/parent-testinomials", ParentTestinoial.getParentTestinomials);
router.post("/parent-testinomials", ParentTestinoial.createTestinomial);

router.patch(
  "/parent-testinomials/:id/toggle",
  ParentTestinoial.toggleParentTestimonialPublish
);

router.get("/parent-testinomials/:id", ParentTestinoial.getParentTestById);
router.put("/parent-testinomials/:id", ParentTestinoial.updateParentTestinomial);
router.delete("/parent-testinomials/:id", ParentTestinoial.deleteTestinomial);

module.exports = router;
