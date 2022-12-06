const mongoose = require('mongoose');


const Phase = new mongoose.Schema({
  initiative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Initiative",
    required: true,
  },
  initiativeType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    required: true,
  },
  gate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  has_violation: {
    type: Boolean,
    default: false,
  },
  // // criteria_scores: {
  // //   type: [mongoose.Schema.Types.ObjectId]: {
  // //     criterion: mongoose.Schema.Types.ObjectId,
  // //     unweightedScore: Number,
  // //     score: Number,
  // //   },
  // // },
  // criteria_scores: {
  //   type: Map<mongoose.Schema.Types.ObjectId, {
  //     criterion: mongoose.Schema.Types.ObjectId,
  //     unweightedScore: Number,
  //     score: Number,
  //   }>
  // },
  criteriaScores: [{
      criterion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Criterion",
      },
      unweightedScore: {
        type: Number,
        default: 0,
      },
      score: {
        type: Number,
        default: 0,
      },
    }],
  score: {
    type: Number,
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
  issues: {
    type: String,
  },
  documents: {
    type: String,
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

Phase.pre("remove", async function (next) {
  console.log("Deleting Responses ...".brightblue);
  await this.model("Response").deleteMany({phase: this._id});
  console.log("Responses Deleted".bgRed);
  next();
});

// Reverse Populate with Virtuals
Phase.virtual("responses", {
  ref: "Response",
  localField: "_id",
  foreignField: "phase",
  justOne: false,
});

module.exports = mongoose.model("Phase", Phase);