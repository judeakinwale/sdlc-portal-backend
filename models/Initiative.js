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
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
  },
  qualityStageGate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
  },
  deliveryPhase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
  },
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
  },
  risks: {
    type: String,
  },
  session: {
    type: Date,
    default: Date.now()
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
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