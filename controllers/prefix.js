const asyncHandler = require("../middleware/async")
const Prefix = require("../models/Prefix")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


// @desc    Create Prefix
// @route  POST /api/v1/prefix
// @access   Private
exports.createPrefix = asyncHandler(async (req, res, next) => {
  const existingPrefix = await Prefix.find({prefix: req.body.prefix})
  if (existingPrefix.length > 0) {
    return new ErrorResponseJSON(res, "This prefix already exists, update it instead!", 400)
  }

  const prefix = await Prefix.create(req.body)
  if (!prefix) {
    return new ErrorResponseJSON(res, "Prefix not created!", 404)
  }
  return new SuccessResponseJSON(res, prefix, 201)
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
  const prefix = await Prefix.findById(req.params.id)
  if (!prefix) {
    return new ErrorResponseJSON(res, "Prefix not found!", 404)
  }
  return new SuccessResponseJSON(res, prefix)
})


// @desc    Update Prefix
// @route  PATCH /api/v1/prefix/:id
// @access   Private
exports.updatePrefix = asyncHandler(async (req, res, next) => {
  const prefix = await Prefix.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!prefix) {
    return new ErrorResponseJSON(res, "Prefix not updated!", 404)
  }
  return new SuccessResponseJSON(res, prefix)
})


// @desc    Delete Prefix
// @route  DELETE /api/v1/prefix/:id
// @access   Private
exports.deletePrefix = asyncHandler(async (req, res, next) => {
  const prefix = await Prefix.findByIdAndDelete(req.params.id)
  if (!prefix) {
    return new ErrorResponseJSON(res, "Prefix not found!", 404)
  }
  return new SuccessResponseJSON(res, prefix)
})
