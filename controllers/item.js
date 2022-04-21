const asyncHandler = require("../middleware/async")
const Item = require("../models/Item")
const {ErrorResponseJSON} = require("../utils/errorResponse")


// @desc    Create Criterion Item
// @route  POST /api/v1/item
// @access   Private
exports.createItem = asyncHandler(async (req, res, next) => {
  try {
    const existingItem = await Item.find({criterion: req.body.criterion, title: req.body.title})

    if (existingItem.length > 0) {
      return new ErrorResponseJSON(res, "This item already exists, update it instead!", 400)
    }

    const item = await Item.create(req.body)

    if (!item) {
      return new ErrorResponseJSON(res, "Item not created!", 404)
    }
    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
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
try {
    const item = await Item.findById(req.params.id).populate('criterion')

    if (!item) {
      return new ErrorResponseJSON(res, "Item not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Update Criterion Item
// @route  PATCH /api/v1/item/:id
// @access   Private
exports.updateItem = asyncHandler(async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!item) {
      return new ErrorResponseJSON(res, "Item not updated!", 404)
    }
    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Delete Criterion Item
// @route  DELETE /api/v1/item
// @access   Private
exports.deleteItem = asyncHandler(async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id)
    
    if (!item) {
      return new ErrorResponseJSON(res, "Item not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})
