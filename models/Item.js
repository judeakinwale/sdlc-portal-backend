const mongoose = require('mongoose')

const Item = new mongoose.Schema({
  title: {
    type: String,
  },
  prefix: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prefix",
  },
})

module.exports = mongoose.model("Item", Item);