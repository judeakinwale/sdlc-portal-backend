const mongoose = require('mongoose')

const Prefix = new mongoose.Schema({
  prefix: {
    type: String,
  },
  description: {
    type: String,
  },
  score: {
    type: Number,
  },
})

module.exports = mongoose.model("Prefix", Prefix);