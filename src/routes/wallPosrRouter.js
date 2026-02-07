const express = require("express");
const router = express.Router();

const wallPostController = require("../controllers/wallPosts.controller");
// const { verifyToken } = require("../../middleware/auth.middleware");
// const { allowRoles } = require("../../middleware/roleMiddleware");

router.get(
  "/wall-posts",
//   verifyToken,
//   allowRoles("admin", "superadmin"),
  wallPostController.getWallPosts
);

router.get(
  "/wall-posts/published",
  wallPostController.getPublishedWallPost
);

router.post(
  "/wall-posts",
//   verifyToken,
//   allowRoles("admin", "superadmin"),
  wallPostController.createWallPost
);

router.put(
  "/wall-posts/:id/publish",
//   verifyToken,
//   allowRoles("admin", "superadmin"),
  wallPostController.publishWallPost
);

router.put(
  "/wall-posts/:id/unpublish",
//   verifyToken,
//   allowRoles("admin", "superadmin"),
  wallPostController.unpublishWallPost
);


router.delete(
  "/wall-posts/:id",
//   verifyToken,
//   allowRoles("admin", "superadmin"),
  wallPostController.deleteWallPost
);

module.exports = router;
