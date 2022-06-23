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
})

module.exports = mongoose.model("Status", Status);