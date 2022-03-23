const asyncHandler = require("../middleware/async")
const Initiative = require("../models/Initiative")
const {ErrorResponseJSON} = require("../utils/errorResponse")
const {phaseQPS} = require("../utils/calculateScore")


// @desc    Create Initiative
// @route  POST /api/v1/initiative
// @access   Private
exports.createInitiative = asyncHandler(async (req, res, next) => {
  try {
    const existingInitiativeTitle = await Initiative.find({title: req.body.title})

    if (existingInitiativeTitle.length > 0) {
      return next(new ErrorResponseJSON(res, "This initiative already exists, update it instead!", 400))
    }

    const initiative = await Initiative.create(req.body)
    // Test calculating the QPS score
    const tempQPS = phaseQPS(initiative)
    console.log("Temp QPS Score: " + tempQPS)

    if (!initiative) {
      return next(new ErrorResponseJSON(res, "Initiative not created!", 404))
    }
    res.status(200).json({
      success: true,
      data: initiative,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Get all Initiatives
// @route  GET /api/v1/initiative
// @access   Private
exports.getAllInitiatives = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Initiative
// @route  GET /api/v1/Initiative/:id
// @access   Private
exports.getInitiative = asyncHandler(async (req, res, next) => {
  try {
    const initiative = await Initiative.findById(req.params.id).populate(
      'qualityAssuranceEngineer type qualityStageGate deliveryPhase phase'
    )
    // console.log("Initiative's Phase QPS Score: " + initiative.phase.score)

    if (!initiative) {
      return next(new ErrorResponseJSON(res, "Initiative not found!", 404))
    }
    res.status(200).json({
      success: true,
      data: initiative,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Update Initiative
// @route  PATCH /api/v1/Initiative/:id
// @access   Private
exports.updateInitiative = asyncHandler(async (req, res, next) => {
  try {
    const initiative = await Initiative.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!initiative) {
      return next(new ErrorResponseJSON(res, "Initiative not updated!", 404))
    }
    res.status(200).json({
      success: true,
      data: initiative,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Delete Initiative
// @route  DELETE /api/v1/Initiative/:id
// @access   Private
exports.deleteInitiative = asyncHandler(async (req, res, next) => {
  try {
    const initiative = await Initiative.findByIdAndDelete(req.params.id)
    
    if (!initiative) {
      return next(new ErrorResponseJSON(res, "Initiative not found!", 404))
    }
    res.status(200).json({
      success: true,
      data: initiative,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})

// module.exports = {
//   createInitiative,
//   getAllInitiatives,
//   getInitiative,
//   updateInitiative,
//   deleteInitiative
// }