const mongoose = require('mongoose');
const Criterion = require("./Criterion")

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
  // criteria: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Criterion",
  // }],
  criteria: {
    type: Array,
  },
  // // violations: {
  // //   type: Boolean,
  // //   default: false,
  // // },
  // // score: {
  // //   type: Number,
  // // },
  // // issues: {
  // //   type: String,
  // // },
  // // documents: {
  // //   type: String,
  // // },
})

Gate.pre("save", async function () {
  this.criteria = await this.getCriteria()
  // console.log(`\n\n\n${this}\n${this.criteria}`)
})

Gate.methods.getCriteria = async function() {
  const criteria = await Criterion.find({gate: this.id})
  // console.log(criteria.length)
  return criteria
}

module.exports = mongoose.model("Gate", Gate);