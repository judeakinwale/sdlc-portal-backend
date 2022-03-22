const mongoose = require('mongoose');

const Phase = new mongoose.Schema({
  initiative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Initiative",
  },
  initiativeType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
  },
  gate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
  },
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
  createdAt: {
    type: Date,
    default: Date.now()
  },
})

module.exports = mongoose.model("Phase", Phase);