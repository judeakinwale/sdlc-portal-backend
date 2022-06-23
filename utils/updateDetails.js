const asyncHandler = require("../middleware/async")
const Gate = require("../models/Gate")
const Type = require("../models/Type")
const Criterion = require("../models/Criterion")

/**
 * Update the related parameters for all models
 * Also using model schema post save
 */

exports.updateAllSchema = asyncHandler( async () => {
  
  const criteria = await Criterion.find()
  for (const [key, criterion] of Object.entries(criteria)) {
    let instance = await Criterion.findById(criterion.id)
    instance.save()
  }
  const gates = await Gate.find()
  for (const [key, gate] of Object.entries(gates)) {
    let instance = await Gate.findById(gate.id)
    instance.save()
  }
  const types = await Type.find()
  for (const [key, type] of Object.entries(types)) {
    let instance = await Type.findById(type.id)
    instance.save()
  }
  console.log("schema updated")
  return true
})

// Convert strings to title case
exports.titleCase = str => {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}
