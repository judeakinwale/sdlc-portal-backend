const mongoose = require('mongoose')

/**
 * "Entrance criteria", 
 * "High level objecjectives", 
 * "Exit criteria",
 */
const Criterion = new mongoose.Schema({
  initiativeType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    // required: [true, "Please select an Initiative Type"],
  },
  gate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
    required: [true, "Please select a Gate"],
  },
  title: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
});

Criterion.pre("remove", async function (next) {
  console.log("Deleting Criteria Items ...".brightblue);
  await this.model("Item").deleteMany({criterion: this._id});
  console.log("Criteria Items Deleted".bgRed);
  next();
});

// Reverse Populate with Virtuals
Criterion.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "criterion",
  justOne: false,
});

module.exports = mongoose.model("Criterion", Criterion);