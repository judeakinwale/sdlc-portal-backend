/* eslint-disable no-unused-vars */
const asyncHandler = require("../middleware/async")
const Phase = require("../models/Phase")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


exports.populatePhase = {path: "initiative initiativeType gate status responses"}


// @desc    Create Phase
// @route  POST /api/v1/phase
// @access   Private
exports.createPhase = asyncHandler(async (req, res, next) => {
  const existingPhase = await Phase.find({
    initiative: req.body.initiative,
    initiativeType: req.body.initiativeType,
    gate: req.body.gate,
  })
  if (existingPhase.length > 0) {
    return new ErrorResponseJSON(res, "This phase already exists, update it instead!", 400)
  }

  const phase = await Phase.create(req.body)
  if (!phase) {
    return new ErrorResponseJSON(res, "Phase not created!", 404)
  }
  return new SuccessResponseJSON(res, phase, 201)
})


// @desc    Get all Phases
// @route  GET /api/v1/phase
// @access   Private
exports.getAllPhases = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Phase
// @route  GET /api/v1/phase/:id
// @access   Private
exports.getPhase = asyncHandler(async (req, res, next) => {
  const phase = await Phase.findById(req.params.id).populate(this.populatePhase)
  if (!phase) {
    return new ErrorResponseJSON(res, "Phase not found!", 404)
  }
  return new SuccessResponseJSON(res, phase)
})


// @desc    Update Phase
// @route  PATCH /api/v1/phase/:id
// @access   Private
exports.updatePhase = asyncHandler(async (req, res, next) => {
  const phase = await Phase.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!phase) {
    return new ErrorResponseJSON(res, "Phase not updated!", 404)
  }
  await phase.save()
  return new SuccessResponseJSON(res, phase)
})


// @desc    Delete Phase
// @route  DELETE /api/v1/phase/:id
// @access   Private
exports.deletePhase = asyncHandler(async (req, res, next) => {
  const phase = await Phase.findByIdAndDelete(req.params.id)
  if (!phase) {
    return new ErrorResponseJSON(res, "Phase not found!", 404)
  }
  await phase.save()
  return new SuccessResponseJSON(res, phase)
})
