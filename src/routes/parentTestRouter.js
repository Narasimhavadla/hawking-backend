const express = require("express");
const router = express.Router();
const { verifyToken } = require('../../middleware/auth.middleware');
const { allowRoles } = require("../../middleware/roleMiddleware");

const ParentTestinoial = require("../controllers/parentTest");

/* ---------- FIXED ROUTES FIRST ---------- */
router.get(
  "/parent-testinomials/published",

  ParentTestinoial.getPublishedParentTestimonials
);

/* ---------- CRUD ROUTES ---------- */
router.get("/parent-testinomials",verifyToken,
  allowRoles("admin","superadmin"),
  ParentTestinoial.getParentTestinomials);

router.post("/parent-testinomials",verifyToken,
  ParentTestinoial.createTestinomial);

router.patch(
  "/parent-testinomials/:id/toggle",verifyToken,
  allowRoles("admin","superadmin"),
  ParentTestinoial.toggleParentTestimonialPublish
);

router.get("/parent-testinomials/:id",verifyToken, ParentTestinoial.getParentTestById);

router.put("/parent-testinomials/:id",verifyToken,
  allowRoles("admin","superadmin"),
   ParentTestinoial.updateParentTestinomial);

router.delete("/parent-testinomials/:id",verifyToken,
  allowRoles("admin","superadmin"),
  ParentTestinoial.deleteTestinomial);

module.exports = router;
