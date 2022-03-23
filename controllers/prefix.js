const asyncHandler = require("../middleware/async")
const Prefix = require("../models/Prefix")
const {ErrorResponseJSON} = require("../utils/errorResponse")


// @desc    Create Prefix
// @route  POST /api/v1/prefix
// @access   Private
exports.createPrefix = asyncHandler(async (req, res, next) => {
  try {
    const existingPrefixTitle = await Prefix.find({title: req.body.title})

    if (existingPrefixTitle.length > 0) {
      return next(new ErrorResponseJSON(res, "This prefix already exists, update it instead!", 400))
    }

    const prefix = await Prefix.create(req.body)

    if (!prefix) {
      return next(new ErrorResponseJSON(res, "Prefix not created!", 404))
    }
    res.status(200).json({
      success: true,
      data: prefix,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Get all Prefixes
// @route  GET /api/v1/prefix
// @access   Private
exports.getAllPrefixs = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Prefix
// @route  GET /api/v1/prefix/:id
// @access   Private
exports.getPrefix = asyncHandler(async (req, res, next) => {
  try {
    const prefix = await Prefix.findById(req.params.id).populate('gates')

    if (!prefix) {
      return next(new ErrorResponseJSON(res, "Prefix not found!", 404))
    }
    res.status(200).json({
      success: true,
      data: prefix,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Update Prefix
// @route  PATCH /api/v1/prefix/:id
// @access   Private
exports.updatePrefix = asyncHandler(async (req, res, next) => {
  try {
    const prefix = await Prefix.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!prefix) {
      return next(new ErrorResponseJSON(res, "Prefix not updated!", 404))
    }
    res.status(200).json({
      success: true,
      data: prefix,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Delete Prefix
// @route  DELETE /api/v1/prefix/:id
// @access   Private
exports.deletePrefix = asyncHandler(async (req, res, next) => {
  try {
    const prefix = await Prefix.findByIdAndDelete(req.params.id)
    
    if (!prefix) {
      return next(new ErrorResponseJSON(res, "Prefix not found!", 404))
    }
    res.status(200).json({
      success: true,
      data: prefix,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})
