
const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

// Place a new order
router.post("/", protect, placeOrder);

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

module.exports = router;
