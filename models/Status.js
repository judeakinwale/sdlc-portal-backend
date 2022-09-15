const mongoose = require('mongoose')

/**
 * "Planned"
 * "Pre-Analysis"
 * "Active"
 * "On-hold"
 * "Cancelled"
 * "PO Hold"
 * "Undetermined"
 * "Shelf-Ready"
 * "Operational"
 * "Agile"
 * "Deployed"
 * "Pending"
 * "Started"
 * "Undetermined"
 * "Completed"
 */
const Status = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"]
  },
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

// Reverse Populate with Virtuals
Status.virtual("initiatives", {
  ref: "Initiative",
  localField: "_id",
  foreignField: "status",
  justOne: false,
});

Status.virtual("phases", {
  ref: "Phase",
  localField: "_id",
  foreignField: "status",
  justOne: false,
});


module.exports = mongoose.model("Status", Status);