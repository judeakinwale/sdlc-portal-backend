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
  criteria: {
    type: Array,
  },
})

Gate.pre("save", async function () {
  this.criteria = await this.getCriteria()
})

Gate.methods.getCriteria = async function() {
  const criteria = await Criterion.find({gate: this.id})
  return criteria
}

module.exports = mongoose.model("Gate", Gate);