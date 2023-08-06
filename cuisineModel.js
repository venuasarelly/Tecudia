// restaurant.model.js
const mongoose = require("mongoose");

const cuisineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  vegNonVeg: { type: String, enum: ["veg", "nonveg"], required: true },
  pics: [{ type: String, required: true }],
  ingredients: [{ type: String, required: true }],
  // Add more fields as needed for each cuisine
});

const Cuisine = mongoose.model("Cuisine", cuisineSchema);

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  pictures: [{ type: String, required: true }],
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  availability: { type: Boolean, required: true },
  cuisines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cuisine" }],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = { Restaurant, Cuisine };

