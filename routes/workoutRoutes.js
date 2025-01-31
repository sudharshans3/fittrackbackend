const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// Get all workouts
router.get('/', async (req, res) => {
    try {
        const workouts = await Workout.find().sort({ date: -1 });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new workout
router.post('/', async (req, res) => {
    try {
        const workout = new Workout({
            type: req.body.type,
            exercises: req.body.exercises,
            caloriesBurned: req.body.caloriesBurned,
            date: req.body.date || new Date()
        });

        const newWorkout = await workout.save();
        res.status(201).json(newWorkout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
