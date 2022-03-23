const mongoose = require('mongoose');

const Gate = new mongoose.Schema({
  initiativeType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    required: true,
  },
  order: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  criteria: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Criterion",
  }],
  // violations: {
  //   type: Boolean,
  //   default: false,
  // },
  // score: {
  //   type: Number,
  // },
  // issues: {
  //   type: String,
  // },
  // documents: {
  //   type: String,
  // },
})

module.exports = mongoose.model("Gate", Gate);