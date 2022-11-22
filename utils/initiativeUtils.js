const asyncHandler = require('../middleware/async')
const Gate = require('../models/Gate')
const Initiative = require('../models/Initiative')
const Phase = require('../models/Phase')
const Status = require('../models/Status')
const Type = require('../models/Type')
const {ErrorResponseJSON, SuccessResponseJSON} = require('../utils/errorResponse')


exports.populateInitiative = {path: "qualityAssuranceEngineer type qualityStageGate deliveryPhase phase status phases responses"}


exports.createOrUpdateInitiative = asyncHandler(async (req, res) => {
  try {
    const authUser = req.user
    const body = {...req.body}
  
    // update a copy of the request body
    // if (!body.serialNumber) body.serialNumber = await this.generateQASerialNumber()
    // body.serialNumber = body.serialNumber || await this.generateQASerialNumber()
    body.requesterName = authUser.fullname
    body.requesterEmail = authUser.email
  
    console.log("body (payload) : ", body, "\n")
  
  
    // Create statuses
    // get or create a pending status object
    const pendingStatus = await Status.findOneAndUpdate({title: 'Pending'}, {}, {
      upsert: true,
      new: true,
      runValidators: true,
    })
    // get or create a undetermined status object
    const undeterminedStatus = await Status.findOneAndUpdate({title: 'Undetermined'}, {}, {
      upsert: true,
      new: true,
      runValidators: true,
    })
    // get or create a started status object
    const startedStatus = await Status.findOneAndUpdate({title: 'Started'}, {}, {
      upsert: true,
      new: true,
      runValidators: true,
    })
    // get or create a completed status object
    const completedStatus = await Status.findOneAndUpdate({title: 'Completed'}, {}, {
      upsert: true,
      new: true,
      runValidators: true,
    })
    // console.log("statuses : ", pendingStatus, undeterminedStatus, startedStatus, completedStatus, "\n")
  
  
    // try getting or creating an initiative type
    let initiative
    try {
      if (req.params.id) {
        initiative = await Initiative.findByIdAndUpdate(req.params.id, body, {
          new: true,
          runValidators: true,
        }).populate(this.populateInitiative)
      } else {
        initiative = await Initiative.findOneAndUpdate({title: body.title}, body, {
          upsert: true,
          new: true,
          runValidators: true,
        }).populate(this.populateInitiative)
      }
    } catch(err) {
      console.log("Error getting or creating Initiatives: ", err.message, "\n")
    }
    console.log("initiative (initial) : ", initiative, "\n")
  
  
    // get or create phases for the gates of the initiative type
    const initiativeType =  initiative.type

    let relatedGates = initiativeType.gates
    if (!relatedGates || relatedGates.length < 1) {
      relatedGates = await Gate.find({initiativeType: initiativeType._id})
    }

    // const gates = await initiativeType.gates.map(async (gate) => {
    const gates = await relatedGates.map(async (gate) => {
      const payload = {
        initiative: initiative._id,
        initiativeType: initiativeType._id,
        gate: gate._id,
        order: gate.order,
      }
      const getOrCreatePhase = await Phase.findOneAndUpdate(payload, {status: pendingStatus._id}, {
        upsert: true,
        new: true,
        runValidators: true,
      })
      // console.log('initiative phases (gates) being created', getOrCreatePhase, "\n")
    })
    // console.log("initiativeType, gates : ", initiativeType, gates, "\n")
  
  
    // get related phases (gate details) for getting phase, quality stage gate and delivery phase
    const relatedPhases = await Phase.find({initiative: initiative._id}).sort('order').populate('gate status')
    // console.log("relatedPhases : ", relatedPhases, "\n")
  
  
    // set quality stage gate and quality stage gate details
    let qualityStageGateDetails
    let qualityStageGate
    try {
      qualityStageGateDetails = await Phase.findOne({
        initiative: initiative._id, 
        has_violation: true, 
        status: undeterminedStatus._id
      }).sort('order').populate('gate status')
      qualityStageGate = await Gate.findById(qualityStageGate.gate)
    } catch(err) {
      console.log("Quality Stage Gate details and Quality Stage Gate not found: ", err.message, ". Using default values", "\n")
      qualityStageGateDetails = await Phase.findOne({
        initiative: initiative._id,
        order: 1, 
      }).sort('order').populate('gate status')
      qualityStageGate = await Gate.findById(qualityStageGateDetails.gate)
    }
    // console.log("qualityStageGateDetails, qualityStageGate : ", qualityStageGateDetails, qualityStageGate, "\n")
  
  
    // set delivery phase and delivery phase details
    let deliveryPhaseDetails
    let deliveryPhase
    try {   
      deliveryPhaseDetails = await Phase.findOne({
        initiative: initiative._id, 
        $or: [{status: startedStatus._id}, {status: completedStatus._id}], 
        has_violation: false
      }).sort('order').populate('gate status')
      deliveryPhase = await Gate.findById(deliveryPhase.gate)
    } catch(err) {
      console.log("Delivery Phase details and Delivery Phase not found: ", err.message, ". Using default values", "\n")
      deliveryPhaseDetails = await Phase.findOne({
        initiative: initiative._id,
        order: 1, 
      }).sort('order').populate('gate status')
      deliveryPhase = await Gate.findById(deliveryPhaseDetails.gate)
    }
    // console.log("deliveryPhaseDetails, deliveryPhase : ", deliveryPhaseDetails, deliveryPhase, "\n")
  
  
    // set phase and phase details
    let phaseDetails
    let phase
    try {   
      phase = initiative.phase
      phaseDetails = await Phase.findOne({
        initiative: initiative._id, 
        gate: phase._id
        // $or: [{status: startedStatus._id}, {status: completedStatus._id}], 
        // has_violation: true
      }).sort('order').populate('gate status')
    } catch(err) {
      console.log("Phase details and Phase not found: ", err.message, ". Using default values", "\n")
      phaseDetails = await Phase.findOne({
        initiative: initiative._id,
        order: 1, 
      }).sort('order').populate('gate status')
      phase = await Gate.findById(phaseDetails.gate)
    }
    // console.log("phaseDetails, phase : ", phaseDetails, phase, "\n")
  
  
    // update the initiative
    initiative.serialNumber = initiative.serialNumber || await this.generateQASerialNumber()
    initiative.qualityStageGate = qualityStageGate
    initiative.qualityStageGateDetails = qualityStageGateDetails
    initiative.deliveryPhase = deliveryPhase
    initiative.deliveryPhaseDetails = deliveryPhaseDetails
    initiative.phase = phase
    initiative.phaseDetails = phaseDetails
  
    await initiative.save()
    console.log("initiative (final) : ", initiative, "\n")
  
    return initiative
  } catch(err) {
    throw new ErrorResponseJSON(res, err.message, 500)
  }
  
})


// exports.createOrUpdateInitiativeDepreciated = asyncHandler(async (req, res) => {
//   const {user, body} = req

//   if (!req.body.serialNumber) {
//     req.body.serialNumber = await this.generateQASerialNumber()
//   }

//   let existingInitiative
//   let initiativeType

//   if (req.params.id) {
//     existingInitiative = await Initiative.findById(req.params.id)
//     initiativeType = await Type.findById(existingInitiative.type)
//   } else {
//     existingInitiative = await Initiative.findOne({title: body.title})
//     initiativeType = await Type.findById(body.type)
//     console.log('resolved body.type', initiativeType, body.type)
//     body.requesterName = req.user.fullname
//     body.requesterEmail = req.user.email
//   }

//   let qualityStageGate
//   let deliveryPhase
//   if ('qualityStageGate' in body && 'deliveryPhase' in body) {
//     deliveryPhase = await Gate.findById(body.deliveryPhase)
//     qualityStageGate = await Gate.findById(body.qualityStageGate)
//   }

//   // // TODO: Comment code below if QA Manager is to assign a QA Engineer
//   // if (!("qualityAssuranceEngineer" in body)) {
//   //   body.qualityAssuranceEngineer = req.user
//   // }

//   let phase
//   try {
//     if ('phase' in body) {
//       phase = await Gate.findById(body.phase)
//     } else if (req.params.id) {
//       phase = await Gate.findById(existingInitiative.phase)
//       // console.log(phase)
//     } else {
//       phase = await Gate.findOne({initiativeType: initiativeType._id, order: 1})
//       body.phase = phase
//     }
//   } catch (err) {
//     console.log(`Error getting Phase: ${err} `)
//     return new ErrorResponseJSON(res, 'Error getting phase!', 400)
//   }

//   let initiative
//   if (existingInitiative) {
//     initiative = await Initiative.findByIdAndUpdate(existingInitiative.id, req.body, {
//       new: true,
//       runValidators: true,
//     })
//   } else {
//     if (req.params.id) {
//       return new ErrorResponseJSON(res, 'Existing Initiative not found!', 404)
//     } else {
//       initiative = await Initiative.create(req.body)
//     }
//   }

//   // create phases for all gates of the selected initiative type
//   for (const [key, gate] of Object.entries(initiativeType.gates)) {
//     try {


//       // const foundPhase = await Phase.findOne({
//       //   initiative: initiative._id,
//       //   initiativeType: initiativeType._id,
//       //   gate: gate._id,
//       //   order: gate.order
//       // })
//       // if (!foundPhase ) {
//       //   const getOrCreatePendingStatus = await Status.findOneAndUpdate({title: "Pending"}, {}, {upsert: true})
//       //   console.log(getOrCreatePendingStatus)
//       //   const createdPhase = await Phase.create({
//       //     initiative: initiative._id,
//       //     initiativeType: initiativeType._id,
//       //     gate: gate._id,
//       //     order: gate.order,
//       //     status: getOrCreatePendingStatus._id,
//       //   })
//       //   console.log("in try catch block", createdPhase)
//       // }

//       const payload = {
//         initiative: initiative._id,
//         initiativeType: initiativeType._id,
//         gate: gate._id,
//         order: gate.order,
//       }
//       const getOrCreatePendingStatus = await Status.findOneAndUpdate(
//         {title: 'Pending'},
//         {},
//         {upsert: true, new: true, runValidators: true}
//       )
//       console.log(getOrCreatePendingStatus)

//       const getOrCreatePhase = await Phase.findOneAndUpdate(
//         payload,
//         {status: getOrCreatePendingStatus._id},
//         {upsert: true, new: true, runValidators: true}
//       )
//       console.log('in try catch block', getOrCreatePhase)

//     } catch (err) {
//       console.log('Phase not found: ', err)

//       const getOrCreatePendingStatus = await Status.findOneAndUpdate({title: 'Pending'}, {}, {upsert: true})
//       console.log(getOrCreatePendingStatus)
//       const createdPhase = await Phase.create({
//         initiative: initiative._id,
//         initiativeType: initiativeType._id,
//         gate: gate._id,
//         order: gate.order,
//         status: getOrCreatePendingStatus._id,
//       })
//       console.log(createdPhase)
//     }
//   }

//   const relatedPhases = await Phase.find({initiative: initiative._id}).sort('order').populate('gate status')
//   console.log('related phases after try catch: block', relatedPhases)

//   // Get quality stage gate details (violations: true, status: "Undetermined")
//   let qualityStageGateDetails
//   for (const [key, phase] of Object.entries(relatedPhases)) {
//     if (phase.has_violation == true && phase.status.title == 'Undetermined') {
//       qualityStageGateDetails = await Phase.findById(phase._id)
//       break
//     }
//   }

//   // Update quality stage gate based off the above (gate id)
//   if (!qualityStageGateDetails) {
//     console.log("creating QSG details from QSG")
//     qualityStageGate = await Gate.findOne({initiativeType: initiativeType._id, order: 1})
//     console.log("found QSG: ", qualityStageGate)
//     qualityStageGateDetails = await Phase.findOne({
//       initiative: initiative._id,
//       initiativeType: initiativeType._id,
//       gate: qualityStageGate._id,
//     })
//     console.log("found QSG details: ", qualityStageGateDetails)

//   }

//   qualityStageGate = await Gate.findById(qualityStageGateDetails.gate)

//   // Repeat the two actions above for delivery phase (violations: false, status: "Started")
//   let deliveryPhaseDetails
//   for (const [key, phase] of Object.entries(relatedPhases)) {
//     let deliveryPhaseDetailsID = phase._id
//     if (phase.status.title == 'Started' || (phase.status.title == 'Completed' && !phase.has_violation)) {
//       deliveryPhaseDetails = await Phase.findById(deliveryPhaseDetailsID)
//       break
//     }
//   }

//   if (!deliveryPhaseDetails) {
//     deliveryPhase = await Gate.findOne({initiativeType: initiativeType._id, order: 1})
//     deliveryPhaseDetails = await Phase.findOne({
//       initiative: initiative._id,
//       initiativeType: initiativeType._id,
//       gate: qualityStageGate._id,
//     })
//   }

//   deliveryPhase = await Gate.findById(deliveryPhaseDetails.gate)

//   // get phase details
//   let phaseDetails = await Phase.findOne({
//     initiative: initiative._id,
//     initiativeType: initiativeType._id,
//     gate: body.phase,
//   }).populate('gate')

//   if (!phaseDetails) {
//     phaseDetails = await Phase.findOne({
//       initiative: initiative._id,
//       initiativeType: initiativeType._id,
//       gate: initiative.phase,
//     }).populate('gate')
//   }

//   initiative.qualityStageGate = qualityStageGate
//   initiative.qualityStageGateDetails = qualityStageGateDetails
//   initiative.deliveryPhase = deliveryPhase
//   initiative.deliveryPhaseDetails = deliveryPhaseDetails
//   initiative.phaseDetails = phaseDetails

//   await initiative.save()

//   return initiative
// })

exports.generateQASerialNumber = async (prefix = 'LBAN', padding = 4, sep = ' ', startNum = 1) => {
  let numStr = startNum.toString().padStart(padding, '0')
  let serial = `${prefix}${sep}${numStr}`
  try {
    const initiative = await Initiative.findOne().sort('-serialNumber')
    let maxSerial = initiative.serialNumber
    let oldNum = parseInt(maxSerial.split(prefix)[1])
    let newNumStr = (oldNum + 1).toString().padStart(padding, '0')
    serial = `${prefix}${sep}${newNumStr}`
  } catch (err) {
    console.log(
      `There was an error generating a serial number, default serial number - ${serial} used.\n`,
      `Error: ${err.message}`
    )
  }
  return serial
}

exports.ensureValidInitiative  = async (initiative) => {
  const startTime = Date.now()
  // Create statuses
  // get or create a pending status object
  const pendingStatus = await Status.findOneAndUpdate({title: 'Pending'}, {}, {
    upsert: true,
    new: true,
    runValidators: true,
  })
  // get or create a undetermined status object
  const undeterminedStatus = await Status.findOneAndUpdate({title: 'Undetermined'}, {}, {
    upsert: true,
    new: true,
    runValidators: true,
  })
  // get or create a started status object
  const startedStatus = await Status.findOneAndUpdate({title: 'Started'}, {}, {
    upsert: true,
    new: true,
    runValidators: true,
  })
  // get or create a completed status object
  const completedStatus = await Status.findOneAndUpdate({title: 'Completed'}, {}, {
    upsert: true,
    new: true,
    runValidators: true,
  })

  try {
    // get or create phases for the gates of the initiative type
    const initiativeType =  initiative.type

    let relatedGates = initiativeType.gates
    if (!relatedGates || relatedGates.length < 1) {
      relatedGates = await Gate.find({initiativeType: initiativeType._id})
    }
    
    // const gates = await initiativeType.gates.map(async (gate) => {
    const gates = await relatedGates.map(async (gate) => {
      const payload = {
        initiative: initiative._id,
        initiativeType: initiativeType._id,
        gate: gate._id,
        order: gate.order,
      }
      const getOrCreatePhase = await Phase.findOneAndUpdate(payload, {status: pendingStatus._id}, {
        upsert: true,
        new: true,
        runValidators: true,
      })
      // console.log('initiative phases (gates) being created', getOrCreatePhase, "\n")
    })
    // console.log("initiativeType, gates : ", initiativeType, gates, "\n")
  
  
    // get related phases (gate details) for getting phase, quality stage gate and delivery phase
    const relatedPhases = await Phase.find({initiative: initiative._id}).sort('order').populate('gate status')
    // console.log("relatedPhases : ", relatedPhases, "\n")
  
  
    // set quality stage gate and quality stage gate details
    let qualityStageGateDetails
    let qualityStageGate
    try {
      qualityStageGateDetails = await Phase.findOne({
        initiative: initiative._id, 
        has_violation: true, 
        status: undeterminedStatus._id
      }).sort('order').populate('gate status')
      qualityStageGate = await Gate.findById(qualityStageGateDetails.gate)
    } catch(err) {
      console.log("Quality Stage Gate details and Quality Stage Gate not found: ", err.message, ". Using default values", "\n")
      qualityStageGateDetails = await Phase.findOne({
        initiative: initiative._id,
        order: 1, 
      }).sort('order').populate('gate status')
      qualityStageGate = await Gate.findById(qualityStageGateDetails.gate)
    }
    console.log("qualityStageGateDetails, qualityStageGate : ", qualityStageGateDetails._id, qualityStageGate._id, "\n")
  
  
    // set delivery phase and delivery phase details
    let deliveryPhaseDetails
    let deliveryPhase
    try {
      // const startedDeliveryPhaseDetails = await Phase.findOne({
      //   initiative: initiative._id, 
      //   status: startedStatus._id, 
      //   has_violation: false
      // }).sort('order').populate('gate status')   

      // const completedDeliveryPhaseDetails = await Phase.findOne({
      //   initiative: initiative._id, 
      //   status: completedStatus._id, 
      //   has_violation: false
      // }).sort('order').populate('gate status')
      // console.log("startedDeliveryPhaseDetails, completedDeliveryPhaseDetails: ", startedDeliveryPhaseDetails, completedDeliveryPhaseDetails)
      // deliveryPhaseDetails = startedDeliveryPhaseDetails || completedDeliveryPhaseDetails

      deliveryPhaseDetails = await Phase.findOne({
        initiative: initiative._id, 
        $or: [{status: startedStatus._id}, {status: completedStatus._id}], 
        has_violation: false
      }).sort('order').populate('gate status')
      console.log("deliveryPhaseDetails : ", deliveryPhaseDetails._id, "\n")
      deliveryPhase = await Gate.findById(deliveryPhaseDetails.gate)
    } catch(err) {
      console.log("Delivery Phase details and Delivery Phase not found: ", err.message, ". Using default values", "\n")
      deliveryPhaseDetails = await Phase.findOne({
        initiative: initiative._id,
        order: 1, 
      }).sort('order').populate('gate status')
      deliveryPhase = await Gate.findById(deliveryPhaseDetails.gate)
    }
    console.log("deliveryPhaseDetails, deliveryPhase : ", deliveryPhaseDetails._id, deliveryPhase._id, "\n")
  
  
    // set phase and phase details
    let phaseDetails
    let phase
    try {   
      phase = initiative.phase
      phaseDetails = await Phase.findOne({
        initiative: initiative._id, 
        gate: phase._id
        // $or: [{status: startedStatus._id}, {status: completedStatus._id}], 
        // has_violation: true
      }).sort('order').populate('gate status')
    } catch(err) {
      console.log("Phase details and Phase not found: ", err.message, ". Using default values", "\n")
      phaseDetails = await Phase.findOne({
        initiative: initiative._id,
        order: 1, 
      }).sort('order').populate('gate status')
      phase = await Gate.findById(phaseDetails.gate)
    }
    console.log("phaseDetails, phase : ", phaseDetails._id, phase._id, "\n")
  
  
    // update the initiative
    initiative.serialNumber = initiative.serialNumber || await this.generateQASerialNumber()
    initiative.qualityStageGate = qualityStageGate
    initiative.qualityStageGateDetails = qualityStageGateDetails
    initiative.deliveryPhase = deliveryPhase
    initiative.deliveryPhaseDetails = deliveryPhaseDetails
    initiative.phase = phase
    initiative.phaseDetails = phaseDetails
  
    await initiative.save()
    console.log("initiative (final - valid) : ", initiative._id, initiative.conformanceStatus, "\n")
  
    const endTime = Date.now()
    console.log(`validating initiative took ${(endTime - startTime) / 1000} seconds`)
    return initiative
  } catch (error) {
    console.err(`${error.message}`.red)
    throw new Error(`Invalid Initiative: ${error.message}`)
  }
}
