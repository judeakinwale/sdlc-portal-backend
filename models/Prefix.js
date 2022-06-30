const mongoose = require('mongoose')


const Prefix = new mongoose.Schema({
  prefix: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  score: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model("Prefix", Prefix);