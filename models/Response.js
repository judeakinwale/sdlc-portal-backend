const mongoose = require('mongoose')


const Response = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  initiative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Initiative",
    required: true,
  },
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
    // required: true,
  },
  gate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
    // required: true,
  },
  criterion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Criterion",
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  prefix: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prefix",
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

module.exports = mongoose.model("Response", Response);