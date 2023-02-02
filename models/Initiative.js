const mongoose = require('mongoose')


const Initiative = new mongoose.Schema({
  // QA Serial Number
  serialNumber: {
    type: String,
    required: [true, "Please enter a serial number"],
    unique: true,
  },
  title: {
    type: String,
    required: [true, "Please enter a title"]
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
    required: [true, "Select a status"],
  },
  qualityAssuranceEngineer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: [true, "Select a Quality Assurance Engineer"]
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    required: [true, "Select an Initiative Type"]
  },
  qualityStageGate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
  },
  qualityStageGateDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
  },
  deliveryPhase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
  },
  deliveryPhaseDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
  },
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
  },
  phaseDetails: {
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
  passScore: {
    type: Number,
    default: 70
  },
  conformanceStatus: {
    type: String,
    enum: ["Red", "Amber", "Green"],
    default: "Red",
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
},
{
  // toJSON: {virtuals: true},
  // toObject: {virtuals: true},
});

Initiative.pre("remove", async function (next) {
  console.log("Deleting Phases ...".brightblue);
  await this.model("Phase").deleteMany({initiative: this._id});
  console.log("Phases Deleted".bgRed);

  console.log("Deleting Responses ...".brightblue);
  await this.model("Response").deleteMany({initiative: this._id});
  console.log("Responses Deleted".bgRed);
  next();
});

// Reverse Populate with Virtuals
Initiative.virtual("phases", {
  ref: "Phase",
  localField: "_id",
  foreignField: "initiative",
  justOne: false,
});

Initiative.virtual("responses", {
  ref: "Response",
  localField: "_id",
  foreignField: "initiative",
  justOne: false,
});

module.exports = mongoose.model("Initiative", Initiative);