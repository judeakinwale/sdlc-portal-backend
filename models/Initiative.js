const mongoose = require('mongoose')

const Initiative = new mongoose.Schema({
  title: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Planned", "Pre-Analysis", "Active", "On-hold", "Cancelled", "PO Hold", "Undetermined", "Shelf-Ready", "Operational", "Agile", "Deployed"]
  },
  qualityAssuranceEngineer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  qualityStageGate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
  },
  deliveryPhase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
  },
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
  },
  risks: {
    type: String,
  },
  session: {
    type: Date,
    default: Date.now()
  },
  requesterName: {
    type: String,
  },
  requesterEmail: {
    type: String,
  },
})

module.exports = mongoose.model("Initiative", Initiative);