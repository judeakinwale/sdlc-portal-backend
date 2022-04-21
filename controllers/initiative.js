const asyncHandler = require("../middleware/async")
const Initiative = require("../models/Initiative")
const Gate = require("../models/Gate")
const Phase = require("../models/Phase")
const Type = require("../models/Type")
const {ErrorResponseJSON} = require("../utils/errorResponse")
const {createOrUpdateInitiative} = require("../utils/initiativeUtils")
const {phaseQPS} = require("../utils/calculateScore")
const {updateAllSchema} = require("../utils/updateDetails")


// @desc    Create Initiative
// @route  POST /api/v1/initiative
// @access   Private
exports.createInitiative = asyncHandler(async (req, res, next) => {
  try {
    await updateAllSchema()

    // Create or update initiative
    const initiative = await createOrUpdateInitiative(req, res)

    // Test calculating the QPS score
    const tempQPS = await phaseQPS(initiative)

    await initiative.save()
    
    if (!initiative) {
      return new ErrorResponseJSON(res, "Initiative not created!", 404)
    }
    res.status(200).json({
      success: true,
      data: initiative,
      phase_dict: tempQPS,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Get all Initiatives
// @route  GET /api/v1/initiative
// @access   Private
exports.getAllInitiatives = asyncHandler(async (req, res, next) => {
  await updateAllSchema()
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Initiative
// @route  GET /api/v1/Initiative/:id
// @access   Private
exports.getInitiative = asyncHandler(async (req, res, next) => {
  try {
    await updateAllSchema()

    const initiative = await Initiative.findById(req.params.id).populate(
      'qualityAssuranceEngineer type qualityStageGate deliveryPhase phase'
    )

    if (!initiative) {
      return new ErrorResponseJSON(res, "Initiative not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: initiative,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Update Initiative
// @route  PATCH /api/v1/Initiative/:id
// @access   Private
exports.updateInitiative = asyncHandler(async (req, res, next) => {
  try {
    await updateAllSchema()

    // Create or update initiative
    const initiative = await createOrUpdateInitiative(req, res)

    // Test calculating the QPS score
    const tempQPS = await phaseQPS(initiative)

    await initiative.save()

    if (!initiative) {
      return new ErrorResponseJSON(res, "Initiative not updated!", 404)
    }
    res.status(200).json({
      success: true,
      data: initiative,
      phase_dict: tempQPS,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Delete Initiative
// @route  DELETE /api/v1/Initiative/:id
// @access   Private
exports.deleteInitiative = asyncHandler(async (req, res, next) => {
  try {
    const initiative = await Initiative.findByIdAndDelete(req.params.id)
    
    if (!initiative) {
      return new ErrorResponseJSON(res, "Initiative not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: initiative,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Get Initiative Phases
// @route  GET /api/v1/Initiative/:id/phases
// @access   Private
exports.getInitiativePhases = asyncHandler(async (req, res, next) => {
  try {
    await updateAllSchema()
    const phases = await Phase.find({initiative:req.params.id}).populate(
      'initiative initiativeType gate'
    )

    if (phases.length < 1) {
      return new ErrorResponseJSON(res, "Initiative Phases not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: phases,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})

// module.exports = {
//   createInitiative,
//   getAllInitiatives,
//   getInitiative,
//   updateInitiative,
//   deleteInitiative
// }