const mongoose = require('mongoose');
const Criterion = require("./Criterion")

/**
 * Initiative Types with relevant Gates:
  • For Business solutions
  (Gate 1 – Planning, Gate 2 - Analysis, Gate 3 -Design & Prototyping, Gate 4 -Build, Gate 5 – Testing, Gate 6 - Deployment)
  • For Infrastructure
  (Gate 1 – Elicitation, Gate 2 Planning, Gate 3 – Define requirements, Gate 4 – Design & Lab set up, Gate 5 – Deployment, Gate 6 – Testing & Acceptance)
  • For Security
  (Gate 1 – Elicitation, Gate 2 Planning, Gate 3 – Define requirements, Gate 4 – Design & Lab set up, Gate 5 – Deployment, Gate 6 – Testing & Acceptance)
  • For Data & AI
  (Gate 1 – Initiation, Gate 2 Planning, Gate 3 – Implementation, Gate 4 – Closure)
  • For Cloud
  (Gate 1 – Initiation, Gate 2 Planning, Gate 3 – Implementation, Gate 4 – Closure)
 */
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