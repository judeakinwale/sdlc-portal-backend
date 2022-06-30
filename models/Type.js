const mongoose = require('mongoose')

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
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

Type.pre("remove", async function (next) {
  console.log("Deleting Gates ...".brightblue);
  await this.model("Gate").deleteMany({initiativeType: this._id});
  console.log("Gates Deleted".bgRed);
  next();
});

// Reverse Populate with Virtuals
Type.virtual("gates", {
  ref: "Gate",
  localField: "_id",
  foreignField: "initiativeType",
  justOne: false,
});

Type.virtual("phases", {
  ref: "Phase",
  localField: "_id",
  foreignField: "initiativeType",
  justOne: false,
});

module.exports = mongoose.model("Type", Type);