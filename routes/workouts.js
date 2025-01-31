const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Error fetching workouts' });
  }
});

// Get workout statistics
router.get('/stats', async (req, res) => {
  try {
    // Get all workouts
    const workouts = await Workout.find();
    
    // Calculate total calories burned
    const totalCalories = workouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
    
    // Calculate total workouts
    const totalWorkouts = workouts.length;
    
    // Calculate average calories per workout
    const avgCalories = totalWorkouts > 0 ? totalCalories / totalWorkouts : 0;
    
    // Calculate workout distribution by type
    const workoutDistribution = workouts.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + 1;
      return acc;
    }, {});

    // Calculate weekly progress (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyWorkouts = workouts.filter(w => new Date(w.date) >= sevenDaysAgo);
    const weeklyProgress = weeklyWorkouts.reduce((acc, workout) => {
      const date = new Date(workout.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (workout.caloriesBurned || 0);
      return acc;
    }, {});

    // Calculate stats by workout type
    const statsByType = workouts.reduce((acc, workout) => {
      if (!acc[workout.type]) {
        acc[workout.type] = {
          totalCalories: 0,
          count: 0,
          avgCalories: 0
        };
      }
      acc[workout.type].totalCalories += (workout.caloriesBurned || 0);
      acc[workout.type].count += 1;
      acc[workout.type].avgCalories = acc[workout.type].totalCalories / acc[workout.type].count;
      return acc;
    }, {});

    res.json({
      totalCalories,
      totalWorkouts,
      avgCalories,
      workoutDistribution,
      weeklyProgress,
      statsByType
    });
  } catch (error) {
    console.error('Error fetching workout statistics:', error);
    res.status(500).json({ message: 'Error fetching workout statistics' });
  }
});

// Add a new workout
router.post('/', async (req, res) => {
  try {
    const { day, type, exercise, sets, reps, duration, caloriesBurned } = req.body;

    // Validate required fields
    if (!day || !type || !exercise) {
      return res.status(400).json({ message: 'Please provide day, type, and exercise' });
    }

    const workout = new Workout({
      day,
      type,
      exercise,
      sets: sets || null,
      reps: reps || null,
      duration: duration || null,
      caloriesBurned: caloriesBurned || 0,
      date: new Date()
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error('Error adding workout:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error adding workout' });
  }
});

// Reset dashboard stats
router.post('/reset', async (req, res) => {
  try {
    // We don't actually delete the workouts, we just mark them as reset
    await Workout.updateMany({}, { $set: { isReset: true } });
    res.status(200).json({ message: 'Dashboard reset successfully' });
  } catch (error) {
    console.error('Error resetting dashboard:', error);
    res.status(500).json({ message: 'Error resetting dashboard' });
  }
});

// Delete a workout
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await workout.deleteOne();
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Error deleting workout' });
  }
});

module.exports = router;
