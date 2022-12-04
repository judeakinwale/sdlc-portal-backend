const mongoose = require('mongoose')


const Item = new mongoose.Schema({
  initiativeType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    // required: [true, "Please select an Initiative Type"],
  },
  gate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
    // required: [true, "Please select a Gate"],
  },
  criterion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Criterion",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model("Item", Item);