
const Order = require("../models/Order");
const Product = require("../models/product");

// Place Order
exports.placeOrder = async (req, res) => {
    try {
        const { items, address } = req.body;

        if (!items?.length || !address?.trim()) {
            return res.status(400).json({ message: "Items and address are required" });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product || product.stock < item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    message: `Invalid product or insufficient stock`
                });
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Reduce product stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            address
        });

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product", "name image price")
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
