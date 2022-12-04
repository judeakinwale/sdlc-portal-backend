const asyncHandler = require("../middleware/async");
// const { init } = require("../models/Criterion");
const Criterion = require("../models/Criterion");
const Gate = require("../models/Gate");
const Item = require("../models/Item");
const Phase = require("../models/Phase");
const Prefix = require("../models/Prefix");
const Response = require("../models/Response");
const Status = require("../models/Status");
const { ErrorResponse } = require("./errorResponse");
const { essentialStatuses } = require("./initiativeUtils");


//// exports.allPhaseQPS = {} // likely to break
// exports.conformanceStatus = async initiative => {
//   /**
//    * RAG : "Red", "Amber", "Green"
//    */
//   const phases = await Phase.find({initiative: initiative._id});
//   let initiative_score = 0
//   let passScore = initiative.passScore || 70
//   // count = 0
//   for (const [key, phase] of Object.entries(phases)) {
//     initiative_score += phase.score
//     // if (phase.score != 0) count += 1  
//   }
//   let conformanceStatus = "Red"
//   if (initiative_score >= passScore) {
//     conformanceStatus = "Green"
//   } else if (initiative_score >= 50) {
//     conformanceStatus = "Amber"
//   } 
//   initiative.score = initiative_score
//   initiative.conformanceStatus = conformanceStatus
//   await initiative.save()

//   return conformanceStatus
// }

// exports.phaseQPS = async initiative => {
//   const phases = await Phase.find({initiative: initiative._id}).populate("status");
//   const prefixes = await Prefix.find()
//   let passScore = initiative.passScore
//   let phase_result = []
//   let phase_criteria_item_length = 0
//   let phase_responses_length = 0
//   let totalPhaseCriteriaScores = []

//   try {
//     let max_prefix_score = Math.max.apply(Math,prefixes.map(function(o){return o.score;}))

//     let index = 0
//     for (const [key, phase] of Object.entries(phases)) {

//       phase_result[index] = {}
//       phase_result[index].initiative = phase.initiative
//       phase_result[index].initiativeType = phase.initiativeType
//       phase_result[index].gate = phase.gate
//       phase_result[index].order = phase.order

//       let phase_gate = await Gate.findById(phase.gate)
//       // const phase_criteria = phase_gate.criteria
//       const phase_criteria = await Criterion.find({gate: phase_gate._id})
//       // console.log("phase_gate; ", phase_gate)
//       // console.log("phase_criteria; ", phase_criteria)

//       let phase_score = 0
//       let phase_criteria_score = []

//       for (const [key, criterion] of Object.entries(phase_criteria)) {

//         let criterion_item = await Item.find({criterion: criterion._id})
//         let criterion_item_length = criterion_item.length
//         phase_criteria_item_length += criterion_item_length

//         const phase_responses = await Response.find({
//           initiative: phase.initiative,
//           // phase: phase._id,
//           criterion: criterion._id
//         }).populate("criterion item prefix")
//         console.log(
//           phase.initiative,
//           phase._id,
//           criterion._id,
//         )

//         console.log("phase_responses: ", phase_responses)

//         phase_responses_length += phase_responses.length

//         // console.log(`\nphase_responses_length: ${phase_responses_length},\nphase_criteria_item_length: ${phase_criteria_item_length}`)

//         let criterion_score = 0
//         // max_score = phase_responses.length * max_prefix_score
//         let max_score = criterion_item.length * max_prefix_score

//         for (const[key, response] of Object.entries(phase_responses)) {
//           criterion_score  += response.prefix.score
//         }
//         console.log("criterion_score:", criterion_score)
//         if (max_score == 0) {
//           phase_score += 0
//         } else {

//           let criterion_id = criterion._id
//           let weighted_criterion_score = (criterion_score / max_score) * criterion.percentage
//           phase_criteria_score.push({
//             criterion: criterion_id, 
//             unweightedScore: (criterion_score / max_score), 
//             score: weighted_criterion_score,
//           })
//           console.log("phase_criteria_score: ", phase_criteria_score)

//           console.log("phase_score - pre: ", phase_score)
//           phase_score += (criterion_score / max_score) * criterion.percentage
//           console.log("phase_score - post: ", phase_score)

//           // totalPhaseCriteriaScores = [...totalPhaseCriteriaScores, phase_criteria_score]
//           totalPhaseCriteriaScores.push({
//             criterion: criterion_id, 
//             unweightedScore: (criterion_score / max_score), 
//             score: weighted_criterion_score,
//           })
//           console.log("totalPhaseCriteriaScores: ", totalPhaseCriteriaScores)
//         }
//       }

//       phase_result[index].score = phase_score
//       phase.score = phase_score
//       phase.criteriaScores = phase_criteria_score
      
//       // console.log(`\nphase_responses_length: ${phase_responses_length},\nphase_criteria_item_length: ${phase_criteria_item_length}`)


//       // Create statuses
//       // get or create a pending status object
//       const pendingStatus = await Status.findOneAndUpdate({title: 'Pending'}, {}, {
//         upsert: true,
//         new: true,
//         runValidators: true,
//       })
//       // get or create a undetermined status object
//       const undeterminedStatus = await Status.findOneAndUpdate({title: 'Undetermined'}, {}, {
//         upsert: true,
//         new: true,
//         runValidators: true,
//       })
//       // get or create a started status object
//       const startedStatus = await Status.findOneAndUpdate({title: 'Started'}, {}, {
//         upsert: true,
//         new: true,
//         runValidators: true,
//       })
//       // get or create a completed status object
//       const completedStatus = await Status.findOneAndUpdate({title: 'Completed'}, {}, {
//         upsert: true,
//         new: true,
//         runValidators: true,
//       })
//       // console.log("statuses : ", pendingStatus, undeterminedStatus, startedStatus, completedStatus, "\n")
    
    

//       // if (phase_responses_length == phase_criteria_item_length) {
//       //   phase.status.title = "Completed"
//       // } else if (phase_responses_length == 0) {
//       //   phase.status.title = "Pending"
//       // } else {
//       //   phase.status.title = "Started"
//       // }

//       if (phase_responses_length == phase_criteria_item_length) {
//         phase.status = completedStatus._id
//       } else if (phase_responses_length == 0) {
//         phase.status = pendingStatus._id
//       } else {
//         phase.status = startedStatus._id
//       }
      
//       // if (phase.status.title == "Started" && phase_score < passScore ) {
//       //   phase.has_violation = true
//       //   // phase.status.title = "Undetermined"
//       // } else if (phase.status.title == "Completed" && phase_score < passScore) {
//       //   phase.has_violation = true
//       //   phase.status.title = "Undetermined"
//       // } else {
//       //   phase.has_violation = false
//       // }

//       if (phase.status.title == "Started" && phase_score < passScore ) {
//         phase.has_violation = true
//         // phase.status = undeterminedStatus._id
//       } else if (phase.status.title == "Completed" && phase_score < passScore) {
//         phase.has_violation = true
//         phase.status = undeterminedStatus._id
//       } else {
//         phase.has_violation = false
//       }
      
//       await phase.save()
//       // await phase.update()
//     }

//     for (const [key, phase] of Object.entries(phases)) {
//       phase.criteriaScores = totalPhaseCriteriaScores
//       await phase.save()
//     }
//     // this.allPhaseQPS = phase_result // likely to break
//     return phase_result

//   } catch (err) {
//     console.error(err)
//     phase_result = false
//     return phase_result
//   }
  
// };



/**
 * @summary get the maximum prefix score
 * @returns {number} max prefix score
 */
exports.maxPrefixScore = async () => {
  const prefixes = await Prefix.find()
  // const maxScore = Math.max.apply(Math, prefixes.map(p => p.score))
  const maxScore = Math.max(prefixes.map(p => p.score))
  return maxScore
}


/**
 * @summary get Status for a phase using the score and passscore
 * @param {number} score 
 * @param {Initiative} initiative 
 * @returns {string} "Red" || "Amber" || "Green"
 */
exports.ragStatus = (score, passScore = 70) => {
  if (score >= passScore) return "Green"
  if (score >= 50) return "Amber"
  return "Red"
}

/**
 * @summary set an initiatives conformance status
 * @param {Initiative} initiative 
 * @returns {number, string, object} {score, status = "Red" || "Amber" || "Green", initiative}
 */
exports.conformanceStatus = async initiative => {
  const phases = await Phase.find({initiative: initiative._id});

  const score = phases.reduce((prev, curr) => (prev + (Number(curr.score || 0) / phases.length)), 0)
  const status = this.ragStatus(score, initiative.passScore)
  console.log("score, status:", score, status)
  
  initiative.score = score
  initiative.conformanceStatus = status
  await initiative.save()

  return {score, status, initiative}
}

/**
 * @summary calculate criteria item response score. Is run when a response is created or modified
 * @param {Response} response 
 * @returns {number} score
 */
exports.getResponseScore = (response, maxPrefixScore) => {
  if (!maxPrefixScore) maxPrefixScore = this.maxPrefixScore()
  const responsePrefixScore = response?.prefix?.score
  const maxScore = response?.item?.maxScore

  const score = (responsePrefixScore / maxPrefixScore) * maxScore
  return score
}


/**
 * @summary check if phase has violations
 * @param {Phase} phase 
 * @param {Response} responses 
 * @returns {bool}
 */
exports.checkPhaseViolations = async(phase, responses = undefined) => {
  if (!responses) responses = await Response.find({phase: phase._id}).populate("prefix")
  const foundResp = responses.find(resp => resp.prefix.score == 0)
  if (foundResp) return true
  return false
}

/**
 * @summary calculate the score for each phase
 * @param {string} initiativeId 
 * @param {Phase} phase 
 * @param {Response[]} responses 
 * @returns {number} score
 */
exports.calculatePhaseScore = async (initiativeId, phase, responses = undefined) => {
  if (!(phase.initiative == initiativeId)) throw new ErrorResponse("Invalid initiative or phase: Phase score cannot be calculated", 400)
  if (!responses) responses = await Response.find({initiative: initiativeId, phase: phase._id}).populate("prefix")
  const score = responses.reduce((prev, curr) => (prev + Number(curr?.score || 0)), 0)
  return score
}

/**
 * @summary set the status of a phase using its violation status and score
 * @param {Phase} phase 
 * @returns {Status}
 */
exports.setPhaseStatus = async (phase) => {
  const {Started, Pending, Completed, Undetermined} = await essentialStatuses()
  if (!phase.has_violation && phase.score >= phase.passScore) return Completed._id
  if (!phase.has_violation && phase.score == 0) return Pending._id
  if (!phase.has_violation && phase.score < phase.passScore) return Started._id
  if (phase.has_violation && phase.score < phase.passScore) return Undetermined._id
}

/**
 * @summary calculate and set the phase score, conformance status, status and violation status for all phases in the initiative
 * @param {Initiative} initiative 
 * @returns {Initiative} updatedInitiative 
 */
exports.initiativePhaseQPS = async (initiative) => {
  const phases = await Phase.find({initiative: initiative._id}).populate("status");
  // make forEach operation async
  await new Promise.all(
    phases.forEach( async (phase) => {
      phase.score = await this.calculatePhaseScore(initiative._id, phase)
      phase.conformanceStatus = this.ragStatus(phase.score, phase.passScore)
      phase.has_violation = await this.checkPhaseViolations(phase)
      phase.status = await this.setPhaseStatus()
      await phase.save()
    })
  )

  // update initiative conformance status
  const {initiative: updatedInitiative} = await this.conformanceStatus(initiative)
  return updatedInitiative
}


exports.phaseQPS = async initiative => {
  try {
    const responses = await this.initiativePhaseQPS(initiative)
    return responses
  } catch (err) {
    throw new ErrorResponse(`Error updating QPS scores: ${err}`, 405)
  }
};

/**
 * @summary endsure the total score for all items (criteria items) in a gate is 100
 * @param {string} gateid 
 * @param {number} score 
 * @param {number} previousScore 
 * @returns {number} totalScore 
 */
exports.checkTotalItemScore = async(gateid, score, previousScore = 0) => {
  const relatedItems = await Item.find({initiative: gateid})
  let totalScore = 0

  for (const [key, item] of Object.entries(relatedItems)) {
    totalScore += item.score
  }    
  totalScore -= previousScore
  totalScore += Number(score)

  return totalScore
}
