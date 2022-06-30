const asyncHandler = require("../middleware/async")
const Status = require("../models/Status")
const {titleCase} = require("../utils/updateDetails")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


// exports.populateStatus = {path: "phases initiatives"}


// @desc    Create Status
// @route  POST /api/v1/status
// @access   Private
exports.createStatus = asyncHandler(async (req, res, next) => {
  req.body.title = titleCase(req.body.title)
  const existingStatus = await Status.find({title: req.body.title})

  if (existingStatus.length > 0) {
    return new ErrorResponseJSON(res, "This status already exists, update it instead!", 400)
  }

  const status = await Status.create(req.body)
  if (!status) {
    return new ErrorResponseJSON(res, "Status not created!", 404)
  }
  return new SuccessResponseJSON(res, status, 201)
})


// @desc    Get all Statuses
// @route  GET /api/v1/status
// @access   Private
exports.getAllStatuss = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Status
// @route  GET /api/v1/status/:id
// @access   Private
exports.getStatus = asyncHandler(async (req, res, next) => {
  const status = await Status.findById(req.params.id)
  if (!status) {
    return new ErrorResponseJSON(res, "Status not found!", 404)
  }
  return new SuccessResponseJSON(res, status)
})


// @desc    Update Status
// @route  PATCH /api/v1/status/:id
// @access   Private
exports.updateStatus = asyncHandler(async (req, res, next) => {
  const status = await Status.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!status) {
    return new ErrorResponseJSON(res, "Status not updated!", 404)
  }
  return new SuccessResponseJSON(res, status)
})


// @desc    Delete Status
// @route  DELETE /api/v1/status/:id
// @access   Private
exports.deleteStatus = asyncHandler(async (req, res, next) => {
  const status = await Status.findByIdAndDelete(req.params.id)
  if (!status) {
    return new ErrorResponseJSON(res, "Status not found!", 404)
  }
  return new SuccessResponseJSON(res, status)
})
