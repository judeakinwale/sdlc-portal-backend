const asyncHandler = require("../middleware/async")
const Initiative = require("../models/Initiative")
const Gate = require("../models/Gate")
const Phase = require("../models/Phase")
const Type = require("../models/Type")
const {ErrorResponseJSON} = require("../utils/errorResponse")
const {createOrUpdateInitiative, baseUpdateInitiative} = require("../utils/initiativeUtils")
const {phaseQPS} = require("../utils/calculateScore")
const {updateAllSchema} = require("../utils/updateDetails")


// @desc    Create Initiative
// @route  POST /api/v1/initiative
// @access   Private
exports.createInitiative = asyncHandler(async (req, res, next) => {
  try {
    await updateAllSchema()

    // const {user, body} = req
    // const existingInitiative = await Initiative.findOne({title: body.title})

    // // if (existingInitiative.length > 0) {
    // //   return new ErrorResponseJSON(res, "This initiative already exists, update it instead!", 400)
    // // }

    // body.requesterName = req.user.fullname
    // body.requesterEmail = req.user.email

    // let qualityStageGate
    // let deliveryPhase
    
    // if ("qualityStageGate" in body && "deliveryPhase" in body) {
    //   qualityStageGate = await Gate.findById(body.qualityStageGate)
    //   deliveryPhase = await Gate.findById(body.deliveryPhase)
    // } 
    // const phase = await Gate.findById(body.phase)
    // // // // // console.log(phase)
    
    // let initiative
    // if (existingInitiative) {
    //   initiative = await Initiative.findByIdAndUpdate(existingInitiative.id, req.body, {
    //     new: true,
    //     runValidators: true,
    //   })
    //   // console.log("updated initiative")
    //   // // // // console.log(initiative)
    // } else {
    //   initiative = await Initiative.create(req.body)
    //   // console.log("created initiative")
    // }
    
    // // console.log("initiative:")
    // // console.log(await initiative._id)
    // const initiativeType = await Type.findById(body.type)
    // // console.log("Type:")
    // // console.log(await initiativeType._id)

    // // create phases for all gates of the selected initiative type
    // for (const [key, gate] of Object.entries(initiativeType.gates)) {
    //   // console.log(`gate - ${key}`)
    //   // console.log(gate._id)
    //   // console.log("\n\n")
    //   // const relatedPhase = await Phase.create({initiative: initiative.id, initiativeType: initiativeType.id, gate: gate.id, order: gate.order})
    //   try {
    //     await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: gate._id, order: gate.order})
    //   } catch (err) {
    //     await Phase.create({initiative: initiative._id, initiativeType: initiativeType._id, gate: gate._id, order: gate.order})
    //   }
    // }

    // /** 
    //   * Fill values for
    //   * - qualityStageGate
    //   * - qualityStageGateDetails
    //   * - deliveryPhase    
    //   * - deliveryPhaseDetails
    //   * - phase
    //   * - phaseDetails
    //   * using available data.
    // */
    // const relatedPhases = await Phase.find({initiative: initiative._id, initiativeType: initiativeType._id}).sort("order").populate("gate")
    // // console.log("relatedPhases:")
    // // console.log(relatedPhases.length)

    // // TODO: Get quality stage gate details (violations: true, status: "Undetermined")
    // let qualityStageGateDetails
    // for (const [key, phase] of Object.entries(relatedPhases)) {
    //   // console.log(`Phase -${key}`)
    //   // console.log(phase._id)
      
    //   if (phase.has_violation == true && phase.status == "Undetermined") {
    //     qualityStageGateDetails = await Phase.findById(phase._id)
    //     break
    //   }
    // }
    // // console.log("qualityStageGateDetails:")
    // // console.log(qualityStageGateDetails)

    // // TODO: Update quality stage gate based off the above (gate id)
    // if (!qualityStageGateDetails) {
    //   qualityStageGate = await Gate.findOne({initiativeType: initiativeType._id, order:1})
    //   qualityStageGateDetails = await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: qualityStageGate._id})
    // }
    // // console.log("updated qualityStageGateDetails:")
    // // console.log(qualityStageGateDetails._id)

    // qualityStageGate = await Gate.findById(qualityStageGateDetails.gate)
    // // console.log("qualityStageGate:")
    // // console.log(qualityStageGate._id)
    
    // // TODO: Repeat the two actions above for delivery phase (violations: false, status: "Started")
    // let deliveryPhaseDetails
    // for (const [key, phase] of Object.entries(relatedPhases)) {
    //   let deliveryPhaseDetailsID = phase._id
    //   if (phase.status == "Started") {
    //     deliveryPhaseDetails = await Phase.findById(deliveryPhaseDetailsID)
    //     break
    //   }
    // }
    // // console.log("deliveryPhaseDetails:")
    // // console.log(deliveryPhaseDetails)

    // if (!deliveryPhaseDetails) {
    //   deliveryPhase = await Gate.findOne({initiativeType: initiativeType._id, order:1})
    //   deliveryPhaseDetails = await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: qualityStageGate._id})
    // }
    // // console.log("updated deliveryPhaseDetails:")
    // // console.log(deliveryPhaseDetails._id)

    // deliveryPhase = await Gate.findById(deliveryPhaseDetails.gate)
    // // console.log("deliveryPhase:")
    // // console.log(deliveryPhase._id)

    // // TODO: get phase details
    // let phaseDetails = await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: body.phase})
    //   // .populate("gate")
    // // console.log("phaseDetails:")
    // // console.log(phaseDetails._id)

    // initiative.qualityStageGate = qualityStageGate
    // initiative.qualityStageGateDetails = qualityStageGateDetails
    // initiative.deliveryPhase = deliveryPhase
    // initiative.deliveryPhaseDetails = deliveryPhaseDetails
    // initiative.phaseDetails = phaseDetails

    // await initiative.save()
    // // console.log("final initiative:")
    // // console.log(initiative._id)

    // Create or update initiative
    const initiative = await createOrUpdateInitiative(req, res)
    console.log("[`__initiative__`]: " + initiative)

    // Test calculating the QPS score
    // TODO: Make phase results an external array
    const tempQPS = await phaseQPS(initiative)
    console.log("Temp QPS Score: " + await tempQPS[0].score)

    await initiative.save()
    
    if (!initiative) {
      return new ErrorResponseJSON(res, "Initiative not created!", 404)
    }
    res.status(200).json({
      success: true,
      data: initiative,
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

    // // Test calculating the QPS score
    // const tempQPS = phaseQPS(initiative)
    // console.log("Temp QPS Score: " + tempQPS)
    // // console.log("Initiative's Phase QPS Score: " + initiative.phase.score)

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
    // const initiative = await Initiative.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // })

    // Create or update initiative
    const initiative = await baseUpdateInitiative(req, res)
    console.log("[`__initiative__`]: " + initiative)

    // Test calculating the QPS score
    // TODO: Make phase results an external array
    const tempQPS = await phaseQPS(initiative)
    console.log("Temp QPS Score: " + await tempQPS[0].score)

    await initiative.save()

    if (!initiative) {
      return new ErrorResponseJSON(res, "Initiative not updated!", 404)
    }
    res.status(200).json({
      success: true,
      data: initiative,
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

// module.exports = {
//   createInitiative,
//   getAllInitiatives,
//   getInitiative,
//   updateInitiative,
//   deleteInitiative
// }