// // routes/order.routes.js

// const router = require("express").Router();
// const controller = require("../controllers/booksOrderController");

// /* Create Order + Razorpay */
// router.post("/create", controller.createOrder);

// /* Verify Payment */
// router.post("/verify", controller.verifyPayment);

// module.exports = router;

const { verifyToken } = require( "../../middleware/auth.middleware");

const { allowRoles } = require("../../middleware/roleMiddleware");

const express = require("express");
const router = express.Router();
const controller = require("../controllers/booksOrderController");

/* PAYMENTS */
router.post("/create", controller.createOrder);
router.post("/verify", controller.verifyPayment);

/* CRUD */
router.get("/admin/all",
    verifyToken,
    allowRoles("admin","superadmin"),
     controller.getAllBookOrders);


router.get("/:id",
       verifyToken,
    allowRoles("admin","superadmin"),
     controller.getBookOrderById);

router.put("/:id", 
       verifyToken,
    allowRoles("admin","superadmin"),
    controller.updateBookOrder);

router.delete("/:id",    verifyToken,
    allowRoles("admin","superadmin"),
    controller.deleteBookOrder);

router.delete("/",   verifyToken,
    allowRoles("admin","superadmin"),
     controller.deleteAllBookOrders);

module.exports = router;

