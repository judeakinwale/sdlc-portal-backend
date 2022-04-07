const mongoose = require('mongoose');

const Phase = new mongoose.Schema({
  initiative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Initiative",
    required: true,
  },
  initiativeType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    required: true,
  },
  gate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
    required: true,
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