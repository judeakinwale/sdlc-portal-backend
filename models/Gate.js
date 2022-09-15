const mongoose = require('mongoose');

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
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

Gate.pre("remove", async function (next) {
  console.log("Deleting Criteria ...".brightblue);
  await this.model("Criterion").deleteMany({gate: this._id});
  console.log("Criteria Deleted".bgRed);
  next();
});

// Reverse Populate with Virtuals
Gate.virtual("criteria", {
  ref: "Criterion",
  localField: "_id",
  foreignField: "gate",
  justOne: false,
});

module.exports = mongoose.model("Gate", Gate);