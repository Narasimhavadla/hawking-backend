const express = require("express");
const router = express.Router();

const booksController = require(
  "../controllers/booksController"
);

const uploadBooks = require(
  "../../middleware/uploadBooks"
);

const { verifyToken } = require(
  "../../middleware/auth.middleware"
);
const { allowRoles } = require(
  "../../middleware/roleMiddleware"
);

/* ================= ROUTES ================= */

router.get(
  "/books",
  
  booksController.getBooks
);

router.get(
  "/books/:id",
  verifyToken,
  allowRoles("admin", "teacher", "superadmin"),
  booksController.getBookById
);

router.post(
  "/books",
  verifyToken,
  allowRoles("admin", "superadmin"),
  uploadBooks.single("image"),
  booksController.createBook
);


router.put(
  "/books/:id",
  verifyToken,
  allowRoles("admin", "superadmin"),
  uploadBooks.single("image"),
  booksController.updateBook
);

router.delete(
  "/books/:id",
  verifyToken,
  allowRoles("admin", "superadmin"),
  booksController.deleteBook
);

module.exports = router;
