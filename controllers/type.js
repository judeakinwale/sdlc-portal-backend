const asyncHandler = require("../middleware/async")
const Type = require("../models/Type")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


exports.popoulateType = {path: "gates phases"}


// @desc    Create Initiative Type
// @route  POST /api/v1/type
// @access   Private
exports.createType = asyncHandler(async (req, res, next) => {
  const existingTypeTitle = await Type.find({title: req.body.title})
  if (existingTypeTitle.length > 0) {
    return new ErrorResponseJSON(res, "This type already exists, update it instead!", 400)
  }

  const type = await Type.create(req.body)
  if (!type) {
    return new ErrorResponseJSON(res, "Type not created!", 404)
  }
  return new SuccessResponseJSON(res, type, 201)
})


// @desc    Get all Initiative Types
// @route  GET /api/v1/type
// @access   Private
exports.getAllTypes = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Initiative Type
// @route  GET /api/v1/type/:id
// @access   Private
exports.getType = asyncHandler(async (req, res, next) => {
    const type = await Type.findById(req.params.id)
    if (!type) {
      return new ErrorResponseJSON(res, "Type not found!", 404)
    }
    return new SuccessResponseJSON(res, type)
})


// @desc    Update Initiative Type
// @route  UPDATE /api/v1/type/:id
// @access   Private
exports.updateType = asyncHandler(async (req, res, next) => {
    const type = await Type.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!type) {
      return new ErrorResponseJSON(res, "Type not updated!", 404)
    }
    return new SuccessResponseJSON(res, type)
})


// @desc    Delete Initiative Type
// @route  DELETE /api/v1/type
// @access   Private
exports.deleteType = asyncHandler(async (req, res, next) => {
    const type = await Type.findByIdAndDelete(req.params.id)
    if (!type) {
      return new ErrorResponseJSON(res, "Type not found!", 404)
    }
    return new SuccessResponseJSON(res, type)
})
