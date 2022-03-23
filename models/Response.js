const mongoose = require('mongoose')

const Response = new mongoose.Schema({
  // title: {
  //   type: String,
  //   required: true,
  // },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  initiative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Initiative",
  },
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
    required: true,
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
})

module.exports = mongoose.model("Response", Response);