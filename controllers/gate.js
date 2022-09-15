const asyncHandler = require("../middleware/async")
const Gate = require("../models/Gate")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


exports.populateGate = {path: "initiativeType criteria"}


// @desc    Create Gate
// @route  POST /api/v1/gate
// @access   Private
exports.createGate = asyncHandler(async (req, res, next) => {
  const existingGateTitle = await Gate.find({title: req.body.title, initiativeType: req.body.initiativeType})

  if (existingGateTitle.length > 0) {
    return new ErrorResponseJSON(res, "This gate already exists, update it instead!", 400)
  }

  const gate = await Gate.create(req.body)
  if (!gate) {
    return new ErrorResponseJSON(res, "Gate not created!", 400)
  }
  return new SuccessResponseJSON(res, gate, 201)
})


// @desc    Get all Gates
// @route  GET /api/v1/gate
// @access   Private
exports.getAllGates = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Gate
// @route  GET /api/v1/gate/:id
// @access   Private
exports.getGate = asyncHandler(async (req, res, next) => {
  const gate = await Gate.findById(req.params.id).populate('initiativeType')
  if (!gate) {
    return new ErrorResponseJSON(res, "Gate not found!", 404)
  }
  return new SuccessResponseJSON(res, gate)
})


// @desc    Update Gate
// @route  PATCH /api/v1/gate/:id
// @access   Private
exports.updateGate = asyncHandler(async (req, res, next) => {
  const gate = await Gate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!gate) {
    return new ErrorResponseJSON(res, "Gate not updated!", 404)
  }
  return new SuccessResponseJSON(res, gate)
})


// @desc    Delete Gate
// @route  DELETE /api/v1/gate/:id
// @access   Private
exports.deleteGate = asyncHandler(async (req, res, next) => {
  const gate = await Gate.findByIdAndDelete(req.params.id)
  if (!gate) {
    return new ErrorResponseJSON(res, "Gate not found!", 404)
  }
  return new SuccessResponseJSON(res, gate)
})
