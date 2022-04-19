const asyncHandler = require("../middleware/async");
const Gate = require("../models/Gate");
const Item = require("../models/Item");
const Initiative = require("../models/Initiative")
const Phase = require("../models/Phase");
const Prefix = require("../models/Prefix");
const Response = require("../models/Response")
const Type = require("../models/Type")
const {ErrorResponseJSON} = require("../utils/errorResponse")

exports.createOrUpdateInitiative = asyncHandler(async (req, res) => {
  
  const {user, body} = req
  const existingInitiative = await Initiative.findOne({title: body.title})

  // if (existingInitiative.length > 0) {
  //   return new ErrorResponseJSON(res, "This initiative already exists, update it instead!", 400)
  // }

  body.requesterName = req.user.fullname
  body.requesterEmail = req.user.email

  let qualityStageGate
  let deliveryPhase
  
  if ("qualityStageGate" in body && "deliveryPhase" in body) {
    deliveryPhase = await Gate.findById(body.deliveryPhase)
    qualityStageGate = await Gate.findById(body.qualityStageGate)
  } 
  const phase = await Gate.findById(body.phase)
  // // // // console.log(phase)
  
  let initiative
  if (existingInitiative) {
    initiative = await Initiative.findByIdAndUpdate(existingInitiative.id, req.body, {
      new: true,
      runValidators: true,
    })
    // console.log("updated initiative")
    // // // // console.log(initiative)
  } else {
    initiative = await Initiative.create(req.body)
    // console.log("created initiative")
  }
  
  // console.log("initiative:")
  // console.log(await initiative._id)
  const initiativeType = await Type.findById(body.type)
  // console.log("Type:")
  // console.log(await initiativeType._id)

  // create phases for all gates of the selected initiative type
  for (const [key, gate] of Object.entries(initiativeType.gates)) {
    // console.log(`gate - ${key}`)
    // console.log(gate._id)
    // console.log("\n\n")
    // const relatedPhase = await Phase.create({initiative: initiative.id, initiativeType: initiativeType.id, gate: gate.id, order: gate.order})
    try {
      await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: gate._id, order: gate.order})
    } catch (err) {
      await Phase.create({initiative: initiative._id, initiativeType: initiativeType._id, gate: gate._id, order: gate.order})
    }
  }

  /** 
    * Fill values for
    * - qualityStageGate
    * - qualityStageGateDetails
    * - deliveryPhase    
    * - deliveryPhaseDetails
    * - phase
    * - phaseDetails
    * using available data.
  */
  const relatedPhases = await Phase.find({initiative: initiative._id, initiativeType: initiativeType._id}).sort("order").populate("gate")
  // console.log("relatedPhases:")
  // console.log(relatedPhases.length)

  // TODO: Get quality stage gate details (violations: true, status: "Undetermined")
  let qualityStageGateDetails
  for (const [key, phase] of Object.entries(relatedPhases)) {
    // console.log(`Phase -${key}`)
    // console.log(phase._id)
    
    if (phase.has_violation == true && phase.status == "Undetermined") {
      qualityStageGateDetails = await Phase.findById(phase._id)
      break
    }
  }
  // console.log("qualityStageGateDetails:")
  // console.log(qualityStageGateDetails)

  // TODO: Update quality stage gate based off the above (gate id)
  if (!qualityStageGateDetails) {
    qualityStageGate = await Gate.findOne({initiativeType: initiativeType._id, order:1})
    qualityStageGateDetails = await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: qualityStageGate._id})
  }
  // console.log("updated qualityStageGateDetails:")
  // console.log(qualityStageGateDetails._id)

  qualityStageGate = await Gate.findById(qualityStageGateDetails.gate)
  // console.log("qualityStageGate:")
  // console.log(qualityStageGate._id)
  
  // TODO: Repeat the two actions above for delivery phase (violations: false, status: "Started")
  let deliveryPhaseDetails
  for (const [key, phase] of Object.entries(relatedPhases)) {
    let deliveryPhaseDetailsID = phase._id
    if (phase.status == "Started") {
      deliveryPhaseDetails = await Phase.findById(deliveryPhaseDetailsID)
      break
    }
  }
  // console.log("deliveryPhaseDetails:")
  // console.log(deliveryPhaseDetails)

  if (!deliveryPhaseDetails) {
    deliveryPhase = await Gate.findOne({initiativeType: initiativeType._id, order:1})
    deliveryPhaseDetails = await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: qualityStageGate._id})
  }
  // console.log("updated deliveryPhaseDetails:")
  // console.log(deliveryPhaseDetails._id)

  deliveryPhase = await Gate.findById(deliveryPhaseDetails.gate)
  // console.log("deliveryPhase:")
  // console.log(deliveryPhase._id)

  // TODO: get phase details
  let phaseDetails = await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: body.phase})
    // .populate("gate")
  // console.log("phaseDetails:")
  // console.log(phaseDetails._id)

  initiative.qualityStageGate = qualityStageGate
  initiative.qualityStageGateDetails = qualityStageGateDetails
  initiative.deliveryPhase = deliveryPhase
  initiative.deliveryPhaseDetails = deliveryPhaseDetails
  initiative.phaseDetails = phaseDetails

  await initiative.save()
  // console.log("final initiative:")
  // console.log(initiative._id)

  return initiative
})

exports.baseUpdateInitiative = asyncHandler(async (req, res) => {
  
  const {user, body} = req
  const existingInitiative = await Initiative.findById(req.params.id)

  // if (existingInitiative.length > 0) {
  //   return new ErrorResponseJSON(res, "This initiative already exists, update it instead!", 400)
  // }

  body.requesterName = req.user.fullname
  body.requesterEmail = req.user.email

  let qualityStageGate
  let deliveryPhase
  
  if ("qualityStageGate" in body && "deliveryPhase" in body) {
    deliveryPhase = await Gate.findById(body.deliveryPhase)
    qualityStageGate = await Gate.findById(body.qualityStageGate)
  } 

  let phase
  if ("phase" in body) {
    phase = await Gate.findById(body.phase)
  } else {
    phase = await Gate.findById(existingInitiative.phase)
  }
  // // // // console.log(phase)
  
  let initiative
  if (existingInitiative) {
    initiative = await Initiative.findByIdAndUpdate(existingInitiative.id, req.body, {
      new: true,
      runValidators: true,
    })
    // console.log("updated initiative")
    // // // // console.log(initiative)
  } else {
    // initiative = await Initiative.create(req.body)
    // console.log("created initiative")
    return new ErrorResponseJSON(res, "Existing Initiative not found!", 404)
  }
  
  // console.log("initiative:")
  // console.log(await initiative._id)
  const initiativeType = await Type.findById(existingInitiative.type)
  // console.log("Type:")
  // console.log(await initiativeType._id)

  // create phases for all gates of the selected initiative type
  for (const [key, gate] of Object.entries(initiativeType.gates)) {
    // console.log(`gate - ${key}`)
    // console.log(gate._id)
    // console.log("\n\n")
    // const relatedPhase = await Phase.create({initiative: initiative.id, initiativeType: initiativeType.id, gate: gate.id, order: gate.order})
    try {
      await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: gate._id, order: gate.order})
    } catch (err) {
      await Phase.create({initiative: initiative._id, initiativeType: initiativeType._id, gate: gate._id, order: gate.order})
    }
  }

  /** 
    * Fill values for
    * - qualityStageGate
    * - qualityStageGateDetails
    * - deliveryPhase    
    * - deliveryPhaseDetails
    * - phase
    * - phaseDetails
    * using available data.
  */
  const relatedPhases = await Phase.find({initiative: initiative._id, initiativeType: initiativeType._id}).sort("order").populate("gate")
  // console.log("relatedPhases:")
  // console.log(relatedPhases.length)

  // TODO: Get quality stage gate details (violations: true, status: "Undetermined")
  let qualityStageGateDetails
  for (const [key, phase] of Object.entries(relatedPhases)) {
    // console.log(`Phase -${key}`)
    // console.log(phase._id)
    
    if (phase.has_violation == true && phase.status == "Undetermined") {
      qualityStageGateDetails = await Phase.findById(phase._id)
      break
    }
  }
  // console.log("qualityStageGateDetails:")
  // console.log(qualityStageGateDetails)

  // TODO: Update quality stage gate based off the above (gate id)
  if (!qualityStageGateDetails) {
    qualityStageGate = await Gate.findOne({initiativeType: initiativeType._id, order:1})
    qualityStageGateDetails = await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: qualityStageGate._id})
  }
  // console.log("updated qualityStageGateDetails:")
  // console.log(qualityStageGateDetails._id)

  qualityStageGate = await Gate.findById(qualityStageGateDetails.gate)
  // console.log("qualityStageGate:")
  // console.log(qualityStageGate._id)
  
  // TODO: Repeat the two actions above for delivery phase (violations: false, status: "Started")
  let deliveryPhaseDetails
  for (const [key, phase] of Object.entries(relatedPhases)) {
    let deliveryPhaseDetailsID = phase._id
    if (phase.status == "Started") {
      deliveryPhaseDetails = await Phase.findById(deliveryPhaseDetailsID)
      break
    }
  }
  // console.log("deliveryPhaseDetails:")
  // console.log(deliveryPhaseDetails)

  if (!deliveryPhaseDetails) {
    deliveryPhase = await Gate.findOne({initiativeType: initiativeType._id, order:1})
    deliveryPhaseDetails = await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: qualityStageGate._id})
  }
  // console.log("updated deliveryPhaseDetails:")
  // console.log(deliveryPhaseDetails._id)

  deliveryPhase = await Gate.findById(deliveryPhaseDetails.gate)
  // console.log("deliveryPhase:")
  // console.log(deliveryPhase._id)

  // TODO: get phase details
  let phaseDetails = await Phase.findOne({initiative: initiative._id, initiativeType: initiativeType._id, gate: body.phase})
    // .populate("gate")
  // console.log("phaseDetails:")
  // console.log(phaseDetails._id)

  initiative.qualityStageGate = qualityStageGate
  initiative.qualityStageGateDetails = qualityStageGateDetails
  initiative.deliveryPhase = deliveryPhase
  initiative.deliveryPhaseDetails = deliveryPhaseDetails
  initiative.phaseDetails = phaseDetails

  await initiative.save()
  // console.log("final initiative:")
  // console.log(initiative._id)

  return initiative
})

exports.CalculatephaseQPS = asyncHandler(async initiative => {
  const phases = await Phase.find({initiative: initiative.id});
  const prefixes = await Prefix.find()
  let phase_result = []
  let phase_criteria_item_length = 0
  let phase_responses_length = 0

  try {
    let max_prefix_score = Math.max.apply(Math,prefixes.map(function(o){return o.score;}))
    console.log("max_prefix_score:")
    console.log(max_prefix_score)

    let index = 0
    for (const [key, phase] of Object.entries(phases)) {
      console.log("initial phase:")
      console.log(key + ": " + phase);

      phase_result[index] = {}
      phase_result[index].initiative = phase.initiative
      phase_result[index].initiativeType = phase.initiativeType
      phase_result[index].gate = phase.gate
      phase_result[index].order = phase.order

      // phase_item = {
      //   initiative: phase.initiative,
      //   initiativeType: phase.initiativeType,
      //   gate: phase.gate,
      //   order: phase.order,
      // }

      // phase_result[index].score = phase.score

      console.log("updated phase_result:")
      console.log(phase_result)

      phase_gate = await Gate.findById(phase.gate)
        // .populate("criteria")
      console.log(`phase.gate: ${phase_gate._id}`)

      const phase_criteria = phase_gate.criteria
      console.log(`phase_criteria: \n${phase_gate.criteria}`)

      let phase_score = 0

      for (const [key, criterion] of Object.entries(phase_criteria)) {
        console.log("phase_criterion:")
        console.log(key + ": " + criterion._id);

        let criterion_item = await Item.find({criterion: criterion._id})
        let criterion_item_length = criterion_item.length
        phase_criteria_item_length += criterion_item_length
        console.log("criterion_item_length:")
        console.log(criterion_item_length)

        const phase_responses = await Response.find({
          initiative: phase.initiative,
          phase: phase._id,
          criterion: criterion._id
        }).populate("criterion item prefix")

        console.log("phase_responses:")
        console.log(phase_responses)
        
        phase_responses_length += phase_responses.length
        console.log("phase_responses_length for " + key + ":")
        console.log(phase_responses.length)

        let criterion_score = 0
        max_score = phase_responses.length * max_prefix_score
        console.log("phase max_score:")
        console.log(max_score)

        for (const[key, response] of Object.entries(phase_responses)) {
          console.log("response score:")
          console.log(key + ": " + response.prefix.score);
          criterion_score  += response.prefix.score
        }

        if (max_score == 0) {
          phase_score += 0
        } else {
          phase_score += (criterion_score / max_score) * criterion.percentage
        }

      }

      console.log("final phase_responses_length:")
      console.log(phase_responses_length)

      console.log("final phase_criteria_item_length:")
      console.log(phase_criteria_item_length)

      
      phase_result[index].score = phase_score
      
      phase.score = phase_score
      
      if (phase_responses_length == phase_criteria_item_length) {
        phase.status = "Completed"
      } else if (phase_responses_length == 0) {
        phase.status = "Pending"
      } else {
        phase.status = "Started"
      }
      
      if (phase.status == "Started" && phase_score < 50) {
        phase.has_violation = true
      } else {
        phase.has_violation = false
      }
      
      await phase.save()

      console.log("final phase:")
      console.log(key + ": " + phase);

    }
    console.log("phase_result:")
    console.log(phase_result)

    return phase_result

  } catch (err) {
    console.log("There was an error calculating scores:")
    console.log(err.message)

    console.log("final phase_result:")
    console.log(phase_result)

    phase_result = false
    return phase_result
  }
  
});

// TODO: create an object with all the details for a response and to get each result, filter the original object

// export phaseQPS = asyncHandler(async(initiative) => {
//   const phases = await Phase.find({initiative: initiative.id})

//   for (const [key, phase] of Object.entries(phases)) {
//     console.log(key + ": " + phase)
//   }
// })
