/* eslint-disable no-unused-vars */
const asyncHandler = require("../middleware/async")
const Criterion = require("../models/Criterion")
const Gate = require("../models/Gate")
const Item = require("../models/Item")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


exports.populateItem = {path: "criterion initiativeType gate"}


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