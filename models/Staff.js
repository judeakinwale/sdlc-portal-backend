const mongoose = require("mongoose");


const Staff = new mongoose.Schema({
  fullname: {
    type: String,
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  state: {
    type: String,
  },
  mobile: {
    type: String,
  },
  cug: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please add Email"],
    unique: true,
  },
  department: {
    type: String,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  code: {
    type: String,
  },
  position: {
    type: String,
  },
  role: {
    type: String,
    enum: ["HR", "Admin", "Manager", "Engineer", "Staff", "Team Lead"],
    default: "Staff",
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  files: {
    type: Array,
  },
  location: {
    type: String,
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: "Photo",
  },
  emergencyContactName: {
    type: String,
  },
  emergencyContactEmail: {
    type: String,
  },
  emergencyContactState: {
    type: String,
  },
  emergencyContactPhone: {
    type: String,
  },
  emergencyContactRelationship: {
    type: String,
  },
  emergencyContactAddress: {
    type: String,
  },
  calibrate: {
    type: Boolean,
    default: false,
  },
  resumptionDate: { type: String },
  bank: { type: String },
  accountName: { type: String },
  accountNumber: { type: String },
  nin: { type: String },
  bvn: { type: String },
  description: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

Staff.pre("remove", async function (next) {
  console.log("Deleting Responses ...".brightblue);
  await this.model("Response").deleteMany({phase: this._id});
  console.log("Responses Deleted".bgRed);
  next();
});

// Reverse Populate with Virtuals
Staff.virtual("responses", {
  ref: "Response",
  localField: "_id",
  foreignField: "phase",
  justOne: false,
});

module.exports = mongoose.model("Staff", Staff);
