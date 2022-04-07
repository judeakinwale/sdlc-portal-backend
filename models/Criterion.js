const mongoose = require('mongoose')
const Item = require("./Item")

const Criterion = new mongoose.Schema({
  gate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gate",
    required: true,
  },
  title: {
    type: String,
    enum: ["Entrance criteria", "High level objecjectives", "Exit criteria"],
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  // items: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Item",
  // }],
  items: {
    type: Array,
  },
})

Criterion.pre("save", async function () {
  this.items = await this.getCriterionItems()
})

Criterion.methods.getCriterionItems = async function() {
  const items = await Item.find({criterion: this.id})
  return items
}

module.exports = mongoose.model("Criterion", Criterion);