// app.js (assuming this is where your main application code is)

const express = require("express");
const mongoose = require("mongoose");
const { Restaurant, Cuisine } = require("./cuisineModel");

const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://venu:CHINNU@cluster0.dt57vkn.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB CONNECTED");
}).catch((err) => {
  console.log(err);
});

app.post("/admin/add", async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      pictures,
      title,
      subtitle,
      availability,
      cuisines,
    } = req.body;

    const cuisineDocs = await Cuisine.create(cuisines);
    const cuisineIds = cuisineDocs.map((cuisine) => cuisine._id);

    const newRestaurant = new Restaurant({
      name,
      address,
      phone,
      pictures,
      title,
      subtitle,
      availability,
      cuisines: cuisineIds,
    });

    await newRestaurant.save();

    res.status(201).json({ message: "Restaurant added successfully", restaurant: newRestaurant });
  } catch (error) {
    res.status(400).json({ message: "Failed to add restaurant", error: error.message });
  }
});



app.put("/admin/restaurants/:restaurantId/cuisines/:cuisineId", async (req, res) => {
    try {
      const { restaurantId, cuisineId } = req.params;
      const updatedCuisineData = req.body;
  
      // Find the restaurant by its ID
      const restaurant = await Restaurant.findById(restaurantId);
  
      // Find the cuisine within the restaurant's cuisines array using its ID
      const cuisine = restaurant.cuisines.find((cuisine) => cuisine._id.equals(cuisineId));
  
      if (cuisine) {
        // Update the cuisine data with the new data
        cuisine.name = updatedCuisineData.name || cuisine.name;
        cuisine.description = updatedCuisineData.description || cuisine.description;
        cuisine.vegNonVegCategory = updatedCuisineData.vegNonVegCategory || cuisine.vegNonVegCategory;
        cuisine.picsForDish = updatedCuisineData.picsForDish || cuisine.picsForDish;
        cuisine.ingredients = updatedCuisineData.ingredients || cuisine.ingredients;
  
        await restaurant.save();
  
        res.status(200).json({ message: "Dish updated successfully", cuisine });
      } else {
        res.status(404).json({ error: "Dish not found in the restaurant" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update dish" });
    }
  });


  app.delete("/admin/restaurants/:restaurantId/cuisines/:cuisineId", async (req, res) => {
    try {
      const { restaurantId, cuisineId } = req.params;
  
      // Find the restaurant by its ID
      const restaurant = await Restaurant.findById(restaurantId);
  
      // Find the index of the cuisine within the restaurant's cuisines array using its ID
      const cuisineIndex = restaurant.cuisines.findIndex((cuisine) => cuisine._id.equals(cuisineId));
  
      if (cuisineIndex !== -1) {
        // Remove the cuisine from the restaurant's cuisines array
        restaurant.cuisines.splice(cuisineIndex, 1);
  
        await restaurant.save();
  
        res.status(200).json({ message: "Dish deleted successfully" });
      } else {
        res.status(404).json({ error: "Dish not found in the restaurant" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete dish" });
    }
  });
  
  // DELETE endpoint for deleting a restaurant completely
  app.delete("/admin/restaurants/:restaurantId", async (req, res) => {
    try {
      const { restaurantId } = req.params;
  
      // Find and delete the restaurant by its ID
      const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);
  
      if (deletedRestaurant) {
        res.status(200).json({ message: "Restaurant deleted successfully" });
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete restaurant" });
    }
  });

  app.get("/restaurants", async (req, res) => {
    try {
      const { name } = req.query;
  
      // Find restaurants that match the search query (name)
      const restaurants = await Restaurant.find({ name: { $regex: name, $options: "i" } });
  
      res.status(200).json({ restaurants });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });
  
  // GET endpoint for viewing dishes available in a restaurant
  app.get("/restaurants/:restaurantId/dishes", async (req, res) => {
    try {
      const { restaurantId } = req.params;
  
      // Find the restaurant by its ID
      const restaurant = await Restaurant.findById(restaurantId).populate("cuisines");
  
      if (restaurant) {
        res.status(200).json({ dishes: restaurant.cuisines });
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dishes" });
    }
  });
  
app.listen(3000, () => {
  console.log("Server Running!!!");
});
