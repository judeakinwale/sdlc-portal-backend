const mongoose = require('mongoose')

const Criterion = new mongoose.Schema({
  gate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  }],
})

module.exports = mongoose.model("Criterion", Criterion);