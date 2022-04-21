const mongoose = require('mongoose')

const Item = new mongoose.Schema({
  criterion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Criterion",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("Item", Item);