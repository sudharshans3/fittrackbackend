const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');

// Get all meals
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find().sort({ day: 1, mealType: 1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new meal
router.post('/', async (req, res) => {
  const meal = new Meal({
    day: req.body.day,
    mealType: req.body.mealType,
    food: req.body.food,
    calories: req.body.calories,
    protein: req.body.protein,
    carbs: req.body.carbs,
    fats: req.body.fats
  });

  try {
    const newMeal = await meal.save();
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a meal
router.delete('/:id', async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get meal statistics
router.get('/stats', async (req, res) => {
  try {
    const meals = await Meal.find();
    
    // Calculate total calories and macros for each day
    const dailyStats = meals.reduce((acc, meal) => {
      const day = meal.day;
      if (!acc[day]) {
        acc[day] = {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
          mealCount: 0
        };
      }
      
      acc[day].totalCalories += meal.calories;
      acc[day].totalProtein += meal.protein;
      acc[day].totalCarbs += meal.carbs;
      acc[day].totalFats += meal.fats;
      acc[day].mealCount += 1;
      
      return acc;
    }, {});

    res.json(dailyStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
