const asyncHandler = require("../middleware/async");
const Gate = require("../models/Gate");
const Item = require("../models/Item");
// const Initiative = require("../models/Initiative")
const Phase = require("../models/Phase");
const Prefix = require("../models/Prefix");
const Response = require("../models/Response")

exports.phaseQPS = asyncHandler(async initiative => {
  const phases = await Phase.find({initiative: initiative.id});
  const prefixes = await Prefix.find()
  let phase_result = []
  let phase_criteria_item_length = 0
  let phase_responses_length = 0

  try {
    let max_prefix_score = Math.max.apply(Math,prefixes.map(function(o){return o.score;}))
    // console.log("max_prefix_score:")
    // console.log(max_prefix_score)

    let index = 0
    for (const [key, phase] of Object.entries(phases)) {
      // console.log("initial phase:")
      // console.log(key + ": " + phase);

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

      // console.log("updated phase_result:")
      // console.log(phase_result)

      phase_gate = await Gate.findById(phase.gate)
        // .populate("criteria")
      // console.log(`phase.gate: ${phase_gate._id}`)

      const phase_criteria = phase_gate.criteria
      // console.log(`phase_criteria: \n${phase_gate.criteria}`)

      let phase_score = 0

      for (const [key, criterion] of Object.entries(phase_criteria)) {
        // console.log("phase_criterion:")
        // console.log(key + ": " + criterion._id);

        let criterion_item = await Item.find({criterion: criterion._id})
        let criterion_item_length = criterion_item.length
        phase_criteria_item_length += criterion_item_length
        // console.log("criterion_item_length:")
        // console.log(criterion_item_length)

        const phase_responses = await Response.find({
          initiative: phase.initiative,
          phase: phase._id,
          criterion: criterion._id
        }).populate("criterion item prefix")

        // console.log("phase_responses:")
        // console.log(phase_responses)
        
        phase_responses_length += phase_responses.length
        // console.log("phase_responses_length for " + key + ":")
        // console.log(phase_responses.length)

        let criterion_score = 0
        max_score = phase_responses.length * max_prefix_score
        // console.log("phase max_score:")
        // console.log(max_score)

        for (const[key, response] of Object.entries(phase_responses)) {
          // console.log("response score:")
          // console.log(key + ": " + response.prefix.score);
          criterion_score  += response.prefix.score
        }

        if (max_score == 0) {
          phase_score += 0
        } else {
          phase_score += (criterion_score / max_score) * criterion.percentage
        }

      }

      // console.log("final phase_responses_length:")
      // console.log(phase_responses_length)

      // console.log("final phase_criteria_item_length:")
      // console.log(phase_criteria_item_length)

      
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

      // console.log("final phase:")
      // console.log(key + ": " + phase);

    }
    // console.log("phase_result:")
    // console.log(phase_result)

    return phase_result

  } catch (err) {
    // console.log("There was an error calculating scores:")
    // console.log(err.message)

    // console.log("final phase_result:")
    // console.log(phase_result)

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
