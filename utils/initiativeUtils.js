const asyncHandler = require("../middleware/async");
const Gate = require("../models/Gate");
const Initiative = require("../models/Initiative")
const Phase = require("../models/Phase");
const Type = require("../models/Type")
const {ErrorResponseJSON} = require("../utils/errorResponse")

exports.createOrUpdateInitiative = asyncHandler(async (req, res) => {
  const {user, body} = req

  let existingInitiative
  let initiativeType

  if (req.params.id) {
    existingInitiative = await Initiative.findById(req.params.id)
    initiativeType = await Type.findById(existingInitiative.type)
  } else {
    existingInitiative = await Initiative.findOne({title: body.title})
    initiativeType = await Type.findById(body.type)
    body.requesterName = req.user.fullname
    body.requesterEmail = req.user.email
  }

  let qualityStageGate
  let deliveryPhase
  if ("qualityStageGate" in body && "deliveryPhase" in body) {
    deliveryPhase = await Gate.findById(body.deliveryPhase)
    qualityStageGate = await Gate.findById(body.qualityStageGate)
  } 

  if (!("qualityAssuranceEngineer" in body)) {
    body.qualityAssuranceEngineer = req.user
  }

  let phase
  try {
    if ("phase" in body) {
      phase = await Gate.findById(body.phase)
    } else if (req.params.id) {
      phase = await Gate.findById(existingInitiative.phase)
      console.log(phase)
    } else {
      phase = await Gate.findOne({initiativeType: initiativeType._id, order:1})
      body.phase = phase
    }
  } catch (err) {
    console.log(`Error getting Phase: ${err} `)
    return new ErrorResponseJSON(res, "Error getting phase!", 400)
  }
  
  let initiative
  if (existingInitiative) {
    initiative = await Initiative.findByIdAndUpdate(existingInitiative.id, req.body, {
      new: true,
      runValidators: true,
    })
  } else {
    if (req.params.id) {
      return new ErrorResponseJSON(res, "Existing Initiative not found!", 404)
    } else {
      initiative = await Initiative.create(req.body)
    }
  }

  // create phases for all gates of the selected initiative type
  for (const [key, gate] of Object.entries(initiativeType.gates)) {
    try {
      const foundPhase = await Phase.findOne({
        initiative: initiative._id,
        initiativeType: initiativeType._id,
        gate: gate._id,
        order: gate.order
      })
      if (!foundPhase ) {
        const createdPhase = await Phase.create({
          initiative: initiative._id,
          initiativeType: initiativeType._id,
          gate: gate._id,
          order: gate.order
        })
      }
    } catch (err) {
      console.log("Phase not found")
    }
  }

  const relatedPhases = await Phase.find({initiative: initiative._id}).sort("order").populate("gate")

  // Get quality stage gate details (violations: true, status: "Undetermined")
  let qualityStageGateDetails
  for (const [key, phase] of Object.entries(relatedPhases)) {
    
    if (phase.has_violation == true && phase.status == "Undetermined") {
      qualityStageGateDetails = await Phase.findById(phase._id)
      break
    }
  }

  // Update quality stage gate based off the above (gate id)
  if (!qualityStageGateDetails) {
    qualityStageGate = await Gate.findOne({initiativeType: initiativeType._id, order:1})
    qualityStageGateDetails = await Phase.findOne({
      initiative: initiative._id,
      initiativeType: initiativeType._id,
      gate: qualityStageGate._id
    })
  }

  qualityStageGate = await Gate.findById(qualityStageGateDetails.gate)
  
  // Repeat the two actions above for delivery phase (violations: false, status: "Started")
  let deliveryPhaseDetails
  for (const [key, phase] of Object.entries(relatedPhases)) {
    let deliveryPhaseDetailsID = phase._id
    if (phase.status == "Started") {
      deliveryPhaseDetails = await Phase.findById(deliveryPhaseDetailsID)
      break
    }
  }

  if (!deliveryPhaseDetails) {
    deliveryPhase = await Gate.findOne({initiativeType: initiativeType._id, order:1})
    deliveryPhaseDetails = await Phase.findOne({
      initiative: initiative._id,
      initiativeType: initiativeType._id,
      gate: qualityStageGate._id
    })
  }

  deliveryPhase = await Gate.findById(deliveryPhaseDetails.gate)

  // get phase details
  let phaseDetails = await Phase.findOne({
    initiative: initiative._id,
    initiativeType: initiativeType._id,
    gate: body.phase
  }).populate("gate")

  initiative.qualityStageGate = qualityStageGate
  initiative.qualityStageGateDetails = qualityStageGateDetails
  initiative.deliveryPhase = deliveryPhase
  initiative.deliveryPhaseDetails = deliveryPhaseDetails
  initiative.phaseDetails = phaseDetails

  await initiative.save()

  return initiative
})
