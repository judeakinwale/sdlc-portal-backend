const mongoose = require('mongoose')

const Criterion = new mongoose.Schema({
  title: {
    type: String,
  },
  percentage: {
    type: Number,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  }],
})

module.exports = mongoose.model("Criterion", Criterion);