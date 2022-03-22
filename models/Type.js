const mongoose = require('mongoose')

const Type = new mongoose.Schema({
  title: {
    type: String,
  },
  gates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
  }],
  // count: {
  //   type: Number,
  // },
})

module.exports = mongoose.model("Type", Type);