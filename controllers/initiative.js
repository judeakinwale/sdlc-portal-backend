const asyncHandler = require("../middleware/async")
const Initiative = require("../models/Initiative")
const Gate = require("../models/Gate")
const Phase = require("../models/Phase")
const Type = require("../models/Type")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")
const {createOrUpdateInitiative} = require("../utils/initiativeUtils")
const {phaseQPS, conformanceStatus} = require("../utils/calculateScore")


exports.populateInitiative = {path: "qualityAssuranceEngineer type qualityStageGate deliveryPhase phase status phases reponses"}


// @desc    Create Initiative
// @route  POST /api/v1/initiative
// @access   Private
exports.createInitiative = asyncHandler(async (req, res, next) => {
  // Create or update initiative
  const initiative = await createOrUpdateInitiative(req, res)

  // Test calculating the QPS score
  const tempQPS = await phaseQPS(initiative)

  // Get Conformance Status
  const status = await conformanceStatus(initiative)

  await initiative.save()
  
  if (!initiative) {
    return new ErrorResponseJSON(res, "Initiative not created!", 404)
  }
  res.status(200).json({
    success: true,
    data: initiative,
    phase_dict: tempQPS,
    status: status,
  })
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
  const initiative = await Initiative.findById(req.params.id).populate(this.populateInitiative)

  if (!initiative) {
    return new ErrorResponseJSON(res, "Initiative not found!", 404)
  }
  return new SuccessResponseJSON(res, initiative)
})


// @desc    Update Initiative
// @route  PATCH /api/v1/Initiative/:id
// @access   Private
exports.updateInitiative = asyncHandler(async (req, res, next) => {
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
})


// @desc    Delete Initiative
// @route  DELETE /api/v1/Initiative/:id
// @access   Private
exports.deleteInitiative = asyncHandler(async (req, res, next) => {
  const initiative = await Initiative.findByIdAndDelete(req.params.id)
  if (!initiative) {
    return new ErrorResponseJSON(res, "Initiative not found!", 404)
  }
  return new SuccessResponseJSON(res, initiative)
})


// To Be Depreciated
// @desc    Get Initiative Phases
// @route  GET /api/v1/Initiative/:initiative_id/phases
// @access   Private
exports.getInitiativePhases = asyncHandler(async (req, res, next) => {
  const phases = await Phase.find({initiative:req.params.initiative_id}).populate(
    'initiative initiativeType gate status responses'
  )
  if (phases.length < 1) {
    return new ErrorResponseJSON(res, "Initiative Phases not found!", 404)
  }
  return new SuccessResponseJSON(res, phases)
})
