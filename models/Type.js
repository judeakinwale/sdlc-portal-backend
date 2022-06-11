const mongoose = require('mongoose')
const Gate = require('./Gate')

/**
 * Intiative Types:
  • For Business solutions
  • For Infrastructure
  • For Security
  • For Data & AI
  • For Cloud
 */
const Type = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"]
  },
  gates: {
    type: Array,
  },
})

Type.pre("save", async function () {
  this.gates = await this.getGates()
})

Type.methods.getGates = async function() {
  const gates = await Gate.find({initiativeType: this.id})
  return gates
}

module.exports = mongoose.model("Type", Type);