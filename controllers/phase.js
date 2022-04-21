const asyncHandler = require("../middleware/async")
const Phase = require("../models/Phase")
const {ErrorResponseJSON} = require("../utils/errorResponse")


// @desc    Create Phase
// @route  POST /api/v1/phase
// @access   Private
exports.createPhase = asyncHandler(async (req, res, next) => {
  try {
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
    res.status(200).json({
      success: true,
      data: phase,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
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
  try {
    const phase = await Phase.findById(req.params.id).populate("initiative initiativeType gate")

    if (!phase) {
      return new ErrorResponseJSON(res, "Phase not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: phase,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Update Phase
// @route  PATCH /api/v1/phase/:id
// @access   Private
exports.updatePhase = asyncHandler(async (req, res, next) => {
  try {
    const phase = await Phase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!phase) {
      return new ErrorResponseJSON(res, "Phase not updated!", 404)
    }
    res.status(200).json({
      success: true,
      data: phase,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Delete Phase
// @route  DELETE /api/v1/phase/:id
// @access   Private
exports.deletePhase = asyncHandler(async (req, res, next) => {
  try {
    const phase = await Phase.findByIdAndDelete(req.params.id)
    
    if (!phase) {
      return new ErrorResponseJSON(res, "Phase not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: phase,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})
