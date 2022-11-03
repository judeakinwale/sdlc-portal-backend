const asyncHandler = require("../middleware/async");
const Gate = require("../models/Gate");
const Item = require("../models/Item");
const Phase = require("../models/Phase");
const Prefix = require("../models/Prefix");
const Response = require("../models/Response")


// exports.allPhaseQPS = {} // likely to break
exports.conformanceStatus = async initiative => {
  /**
   * RAG : "Red", "Amber", "Green"
   */
  const phases = await Phase.find({initiative: initiative._id});
  let initiative_score = 0
  let passScore = initiative.passScore || 70
  // count = 0
  for (const [key, phase] of Object.entries(phases)) {
    initiative_score += phase.score
    // if (phase.score != 0) count += 1  
  }
  let conformanceStatus = "Red"
  if (initiative_score >= passScore) {
    conformanceStatus = "Green"
  } else if (initiative_score >= 50) {
    conformanceStatus = "Amber"
  } 
  initiative.score = initiative_score
  initiative.conformanceStatus = conformanceStatus
  await initiative.save()

  return conformanceStatus
}

exports.phaseQPS = async initiative => {
  const phases = await Phase.find({initiative: initiative._id}).populate("status");
  const prefixes = await Prefix.find()
  let passScore = initiative.passScore
  let phase_result = []
  let phase_criteria_item_length = 0
  let phase_responses_length = 0

  try {
    let max_prefix_score = Math.max.apply(Math,prefixes.map(function(o){return o.score;}))

    let index = 0
    for (const [key, phase] of Object.entries(phases)) {

      phase_result[index] = {}
      phase_result[index].initiative = phase.initiative
      phase_result[index].initiativeType = phase.initiativeType
      phase_result[index].gate = phase.gate
      phase_result[index].order = phase.order

      let phase_gate = await Gate.findById(phase.gate)
      const phase_criteria = phase_gate.criteria

      let phase_score = 0
      let phase_criteria_score = []

      for (const [key, criterion] of Object.entries(phase_criteria)) {

        let criterion_item = await Item.find({criterion: criterion._id})
        let criterion_item_length = criterion_item.length
        phase_criteria_item_length += criterion_item_length

        const phase_responses = await Response.find({
          initiative: phase.initiative,
          phase: phase._id,
          criterion: criterion._id
        }).populate("criterion item prefix")

        phase_responses_length += phase_responses.length

        // console.log(`\nphase_responses_length: ${phase_responses_length},\nphase_criteria_item_length: ${phase_criteria_item_length}`)

        let criterion_score = 0
        // max_score = phase_responses.length * max_prefix_score
        let max_score = criterion_item.length * max_prefix_score

        for (const[key, response] of Object.entries(phase_responses)) {
          criterion_score  += response.prefix.score
        }

        if (max_score == 0) {
          phase_score += 0
        } else {

          let criterion_id = criterion._id
          let weighted_criterion_score = (criterion_score / max_score) * criterion.percentage
          phase_criteria_score.push({
            criterion: criterion_id, 
            unweightedScore: (criterion_score / max_score), 
            score: weighted_criterion_score,
          })

          phase_score += (criterion_score / max_score) * criterion.percentage
        }
      }

      phase_result[index].score = phase_score
      phase.score = phase_score
      phase.criteria_scores = phase_criteria_score
      
      // console.log(`\nphase_responses_length: ${phase_responses_length},\nphase_criteria_item_length: ${phase_criteria_item_length}`)

      if (phase_responses_length == phase_criteria_item_length) {
        phase.status.title = "Completed"
      } else if (phase_responses_length == 0) {
        phase.status.title = "Pending"
      } else {
        phase.status.title = "Started"
      }
      
      if (phase.status.title == "Started" && phase_score < passScore ) {
        phase.has_violation = true
        // phase.status.title = "Undetermined"
      } else if (phase.status.title == "Completed" && phase_score < passScore) {
        phase.has_violation = true
        phase.status.title = "Undetermined"
      } else {
        phase.has_violation = false
      }
      
      await phase.save()
    }
    // this.allPhaseQPS = phase_result // likely to break
    return phase_result

  } catch (err) {
    phase_result = false
    return phase_result
  }
  
};
