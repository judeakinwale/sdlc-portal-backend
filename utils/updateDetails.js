const asyncHandler = require("../middleware/async")
// const Gate = require("../models/Gate")
// const Type = require("../models/Type")
// const Criterion = require("../models/Criterion")
const {populateInitiative} = require("../controllers/initiative")
// const Criterion = require("../models/Criterion")
// const Item = require("../models/Item")
// const Gate = require("../models/Gate")


/**
 * Update the related parameters for all models
 * Also using model schema post save
 */
// // Depreciated
// exports.updateAllSchema = async () => {
  
//   const criteria = await Criterion.find()
//   for (const [key, criterion] of Object.entries(criteria)) {
//     let instance = await Criterion.findById(criterion.id)
//     instance.save()
//   }
//   const gates = await Gate.find()
//   for (const [key, gate] of Object.entries(gates)) {
//     let instance = await Gate.findById(gate.id)
//     instance.save()
//   }
//   const types = await Type.find()
//   for (const [key, type] of Object.entries(types)) {
//     let instance = await Type.findById(type.id)
//     instance.save()
//   }
//   console.log("schema updated")
//   return true
// }


// // update criteria and criteria items with initiative type and gate
// exports.updateModelSchema = async (type = 'criterion') => {
//   // if (type == "criterion") {
//     const criteria = await Criterion.find()
//     console.log(`criteria length ${criteria.length}`)
//     for (const [key, criterion] of Object.entries(criteria)) {
//       let instance = await Criterion.findById(criterion.id)
//       let gate = await Gate.findById(instance.gate)
//       instance.initiativeType = gate.initiativeType
//       await instance.save()
//       console.log(`criterion instance with id ${instance._id} updated, key ${key}`)
//     }
//   // } else if (type == "item") {
//     const items = await Item.find()
//     console.log(`criteria items length ${items.length}`)
//     items.forEach(async (item, index) => {
//       let criterion  = await Criterion.findById(item.criterion)
//       if (!criterion) criterion = await Criterion.findOne().sort("-_id")
//       item.initiativeType = criterion.initiativeType
//       item.gate = criterion.gate
//       await item.save()
//       console.log(`criteria item instance with id ${item._id} updated, key ${index}`)
//     });
//   // } else (
//   //   console.log(`invalid model type: ${type}`)
//   // )
//  console.log(`criteria and criteria items: ${type}`)
// }


// Convert strings to title case
exports.titleCase = str => {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

// Filter model1 queryset by instances of model2
exports.filterQuerysetByQuerysetInstances = async (req, model1, model2, query = {}, _type = "status", populate = populateInitiative) => {
  const payload = {}
  const queryset2 = await model2.find()

  for (const [key, instance1] of Object.entries(queryset2)) {
    if (_type == "type") query.type = instance1._id
    if (_type == "status") query.status = instance1._id

    const queryset1 = await model1.find({...query}).find({...req.query}).populate(populate)
    payload[`${instance1.title}`] = queryset1
  }
  return payload
}

