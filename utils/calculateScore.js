const asyncHandler = require("../middleware/async");
const Gate = require("../models/Gate");
const Item = require("../models/Item");
const Phase = require("../models/Phase");
const Prefix = require("../models/Prefix");
const Response = require("../models/Response")


exports.allPhaseQPS = {} // likely to break


exports.phaseQPS = asyncHandler(async initiative => {
  const phases = await Phase.find({initiative: initiative.id});
  const prefixes = await Prefix.find()
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

      phase_gate = await Gate.findById(phase.gate)
      const phase_criteria = phase_gate.criteria

      let phase_score = 0

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

        let criterion_score = 0
        max_score = phase_responses.length * max_prefix_score

        for (const[key, response] of Object.entries(phase_responses)) {
          criterion_score  += response.prefix.score
        }

        if (max_score == 0) {
          phase_score += 0
        } else {
          phase_score += (criterion_score / max_score) * criterion.percentage
        }
      }

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
    }
    this.allPhaseQPS = phase_result // likely to break
    return phase_result

  } catch (err) {
    phase_result = false
    return phase_result
  }
  
});
