const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// Get daily stats
router.get('/', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const stats = await Workout.aggregate([
            {
                $match: {
                    date: { $gte: today }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCalories: { $sum: "$caloriesBurned" },
                    workoutCount: { $sum: 1 },
                    avgCalories: { $avg: "$caloriesBurned" }
                }
            }
        ]);

        res.json(stats[0] || { totalCalories: 0, workoutCount: 0, avgCalories: 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
