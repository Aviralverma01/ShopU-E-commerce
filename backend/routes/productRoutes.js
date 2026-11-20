
const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
    getProducts,
    getProduct,
    addProduct
} = require("../controllers/productController");

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProduct);

// Add new product
router.post("/", protect, adminOnly, addProduct);

module.exports = router;
