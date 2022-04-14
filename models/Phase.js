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
  order: {
    type: Number,
    required: true,
  },
  has_violation: {
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
  status: {
    type: String,
    enum: ["Pending", "Started", "Undetermined", "Completed"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
})

module.exports = mongoose.model("Phase", Phase);