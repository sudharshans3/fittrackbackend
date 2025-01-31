const express = require('express');
const router = express.Router();

// Import the food data
const foods = [
  {
    name: "Chicken Breast",
    protein: 31,
    servingSize: "100g",
    category: "Poultry",
    calories: 165
  },
  {
    name: "Salmon",
    protein: 25,
    servingSize: "100g",
    category: "Fish",
    calories: 208
  },
  {
    name: "Greek Yogurt",
    protein: 10,
    servingSize: "100g",
    category: "Dairy",
    calories: 59
  },
  // ... add all other foods here
];

// Get all foods
router.get('/', (req, res) => {
  try {
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get foods by category
router.get('/category/:category', (req, res) => {
  try {
    const category = req.params.category;
    const filteredFoods = foods.filter(food => 
      food.category.toLowerCase() === category.toLowerCase()
    );
    res.json(filteredFoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
