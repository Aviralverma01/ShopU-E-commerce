
// =====================================
// TASK ONE - ONLINE PRODUCT IMPORTER
// =====================================

require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/product");

const API_URL = "https://dummyjson.com/products?limit=0";

// Demo-only price multiplier for your ₹ display.
// This is NOT a live currency exchange rate.
const DEMO_PRICE_MULTIPLIER = 90;

// =====================================
// IMPORT PRODUCTS
// =====================================

async function importProducts() {

    try {

        // Connect to your own MongoDB database
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from your .env file.");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully");

        // Fetch products from DummyJSON
        console.log("Fetching online products...");

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.products) || data.products.length === 0) {
            throw new Error("No products received from the API.");
        }

        // Convert online products to our Product schema
        const operations = data.products.map(item => {

            const category = item.category
                ? item.category
                    .split("-")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "General";

            return {
                updateOne: {
                    filter: { name: item.title },

                    update: {
                        $set: {
                            name: item.title,
                            description: item.description || "Sample product",
                            price: Math.round(item.price * DEMO_PRICE_MULTIPLIER),
                            category: category,
                            image: item.thumbnail || item.images?.[0] || "",
                            stock: Number(item.stock) || 0,
                            rating: Number(item.rating) || 0
                        }
                    },

                    upsert: true
                }
            };

        });

        // Insert new products or update matching names
        const result = await Product.bulkWrite(operations);

        console.log("--------------------------------");
        console.log("PRODUCT IMPORT COMPLETED");
        console.log("Products received:", data.products.length);
        console.log("New products added:", result.upsertedCount);
        console.log("Existing products updated:", result.modifiedCount);
        console.log("--------------------------------");

    } catch (error) {

        console.error("Import Failed:", error.message);
        process.exitCode = 1;

    } finally {

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log("MongoDB connection closed.");
        }

    }
}

// Start importer
importProducts();
