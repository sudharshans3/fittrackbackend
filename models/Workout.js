const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  type: {
    type: String,
    required: true
  },
  exercise: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    required: false
  },
  reps: {
    type: Number,
    required: false
  },
  duration: {
    type: Number,
    required: false
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);
