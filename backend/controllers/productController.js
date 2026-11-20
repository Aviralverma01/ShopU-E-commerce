
const Product = require("../models/product");

// Get All Products
exports.getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Invalid product ID" });
    }
};

// Add Product
exports.addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Product added successfully",
            product
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
