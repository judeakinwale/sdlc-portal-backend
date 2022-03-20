const mongoose = require('mongoose');

const Gate = new mongoose.Schema({
  order: {
    type: Number,
  },
  title: {
    type: String,
  },
  criteria: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Criterion",
  }],
  violations: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
  },
  issues: {
    type: String,
  },
  documents: {
    type: String,
  },
})

module.exports = mongoose.model("Gate", Gate);