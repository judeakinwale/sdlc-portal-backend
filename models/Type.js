const mongoose = require('mongoose')
const Gate = require('./Gate')

const Type = new mongoose.Schema({
  title: {
    type: String,
  },
  // gates: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Gate",
  // }],
  gates: {
    type: Array,
  },
  // count: {
  //   type: Number,
  // },
})

Type.pre("save", async function () {
  this.gates = await this.getGates()
})

Type.methods.getGates = async function() {
  const gates = await Gate.find({initiativeType: this.id})
  return gates
}

module.exports = mongoose.model("Type", Type);