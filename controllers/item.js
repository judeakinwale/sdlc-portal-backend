/* eslint-disable no-unused-vars */
const asyncHandler = require("../middleware/async")
const Criterion = require("../models/Criterion")
const Gate = require("../models/Gate")
const Item = require("../models/Item")
const { checkTotalItemScore } = require("../utils/calculateScore")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")
const { updateAllSchema, reverseUpdateAllSchema } = require("../utils/updateDetails")


// exports.populateItem = {path: "criterion initiativeType gate"}
exports.populateItem = {path: ""}


// @desc    Create Criterion Item
// @route  POST /api/v1/item
// @access   Private
exports.createItem = asyncHandler(async (req, res, next) => {
  const existingItem = await Item.find({criterion: req.body.criterion, title: req.body.title})

  if (existingItem.length > 0) {
    return new ErrorResponseJSON(res, "This item already exists, update it instead!", 400)
  }

  const criterion = await Criterion.findById(req.body.criterion)
  req.body.gate = criterion.gate
  req.body.initiativeType = criterion.initiativeType

  const totalScore = await checkTotalItemScore(req.body.gate, req.body.score)
  if (totalScore > 100) {
    console.log("total score: ", totalScore)
    return new ErrorResponseJSON(res, `Total score for the items in the phase exceeeds 100 by ${totalScore - 100}!: ${totalScore} `, 400)
  }
  
  // const gate = await Gate.findById(req.body.gate)
  // req.body.initiativeType = gate.initiativeType

  const item = await Item.create(req.body)
  if (!item) {
    return new ErrorResponseJSON(res, "Item not created!", 404)
  }
  return new SuccessResponseJSON(res, item, 201)
})


// @desc    Get all Criterion Items
// @route  GET /api/v1/item
// @access   Public
exports.getAllItems = asyncHandler(async (req, res, next) => {
  // updateAllSchema()
  // // reverseUpdateAllSchema()
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Criterion Item
// @route  GET /api/v1/item/:id
// @access   Private
exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate(this.populateItem)
  if (!item) {
    return new ErrorResponseJSON(res, "Item not found!", 404)
  }
  return new SuccessResponseJSON(res, item)
})


// @desc    Update Criterion Item
// @route  PATCH /api/v1/item/:id
// @access   Private
exports.updateItem = asyncHandler(async (req, res, next) => {
  
  const existingItem = await Item.findById(req.params.id)
  req.body.gate = existingItem.gate
  req.body.previousScore = existingItem.score

  if ("criterion" in req.body) {
    const criterion = await Criterion.findById(req.body.criterion)
    req.body.gate = criterion.gate
    req.body.initiativeType = criterion.initiativeType
  }

  const totalScore = await checkTotalItemScore(req.body.gate, req.body.score, req.body.previousScore)
  if (totalScore > 100) {
    console.log("total score: ", totalScore)
    return new ErrorResponseJSON(res, `Total score for the items in the phase exceeeds 100 by ${totalScore - 100}!: ${totalScore} `, 400)
  }


  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!item) {
    return new ErrorResponseJSON(res, "Item not updated!", 404)
  }

  await item.save()
  return new SuccessResponseJSON(res, item)
})


// @desc    Delete Criterion Item
// @route  DELETE /api/v1/item
// @access   Private
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.id)
  if (!item) {
    return new ErrorResponseJSON(res, "Item not found!", 404)
  }
  // await item.save()
  return new SuccessResponseJSON(res, item)
})


// @desc    Delete All Items
// @route  DELETE /api/v1/item/:id
// @access   Private
exports.  deleteAllItems = asyncHandler(async (req, res, next) => {
  const item = await Item.deleteMany()
  console.log("All items deleted".bgRed)
  // await item.save()
  return new SuccessResponseJSON(res, item)
})