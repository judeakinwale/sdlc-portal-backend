const asyncHandler = require('../middleware/async')
const Gate = require('../models/Gate')
const Initiative = require('../models/Initiative')
const Phase = require('../models/Phase')
const Status = require('../models/Status')
const Type = require('../models/Type')
const {ErrorResponseJSON, SuccessResponseJSON} = require('../utils/errorResponse')
const { updatePhaseData } = require('./calculateScore')


exports.populateInitiative = {path: "qualityAssuranceEngineer type qualityStageGate deliveryPhase phase status phases responses"}


exports.createOrUpdateInitiativeDepreciated = asyncHandler(async (req, res) => {
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

exports.ensureValidInitiativeDepreciated  = async (initiative) => {
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
    console.error(`${error.message}`.red)
    throw new Error(`Invalid Initiative: ${error.message}`)
  }
}


/**
 * @summary get or create related phases for initiative
 * @param {Initiative} initiative 
 * @param {{String: Status}} essentialStatuses 
 * @returns 
 */
exports.relatedPhases = async (initiative, essentialStatuses) => {
  if (!initiative._id) throw new Error("Invalid Initiative: has no Id!")
  if (!initiative.type) throw new Error("Invalid Initiative: has no type!")
  const initiativeTypeId = initiative.type._id ? initiative.type._id : initiative.type

  // const relatedPhase = await Phase.find(initiative.phase)
  const relatedGates = await Gate.find({initiativeType: initiativeTypeId})
  // console.log('relatedGates', relatedGates.map((r) => r._id), "\n")

  const relatedPhases = []
  await Promise.all(await relatedGates.map(async (gate) => {
    const filterPayload = {
      initiative: initiative._id,
      initiativeType: initiativeTypeId,
      gate: gate._id,
    }
    const updatePayload = {
      passScore: initiative.passScore,
      order: gate.order,
      score: 0,
      has_violation: true,
      status: essentialStatuses.Pending._id,
    }
    const getOrCreatePhase = await Phase.findOneAndUpdate(filterPayload, updatePayload, {
      upsert: true,
      new: true,
      runValidators: true,
    })

    await updatePhaseData(getOrCreatePhase)

    // console.log('initiative phases (gates) being created', getOrCreatePhase._id, "\n")
    relatedPhases.push(getOrCreatePhase)
  }))
  // console.log('relatedPhases', relatedPhases, "\n")
  console.log('relatedPhases', relatedPhases.map((r) => r._id), "\n")
  return relatedPhases
}

/**
 * @summary set the Quality Stage Gate and it's details
 * @param {Initiative} initiative 
 * @param {{String: Status}} essentialStatuses 
 * @returns 
 */
exports.setQualityStageGateAndQualityStageGateDetails = async (initiative, essentialStatuses) => {
  const populatePhase = 'gate status'
  let QSGDetails
  try {
    QSGDetails = await Phase.findOne({
      initiative: initiative._id, 
      has_violation: true, 
      // $or: [{status: essentialStatuses.Undetermined._id}, {status: essentialStatuses.Pending._id}], 
      // status: essentialStatuses.Undetermined._id
    }).sort('order').populate(populatePhase)
    if (!QSGDetails) throw new Error("Doesn't exist")
  } catch(err) {
    console.log("Quality Stage Gate details and Quality Stage Gate not found: ", err.message, ". Using default values", "\n")
    QSGDetails = await Phase.findOne({
      initiative: initiative._id,
      order: 1, 
    }).sort('-order').populate(populatePhase)
  }
  await updatePhaseData(QSGDetails);

  const QSG = await Gate.findById(QSGDetails.gate)
  console.log({QSGDetails})
  console.log("qualityStageGateDetails, qualityStageGate : ", QSGDetails._id, QSG._id, "\n")
  return {QSG, QSGDetails}
}

/**
 * @summary set the Delivery Phase and it's details
 * @param {Initiative} initiative 
 * @param {{String: Status}} essentialStatuses 
 * @returns 
 */
exports.setDeliveryPhaseAndDeliveryPhaseDetails = async (initiative, essentialStatuses) => {
  const populatePhase = 'gate status'
  let deliveryPhaseDetails
  try {
    deliveryPhaseDetails = await Phase.findOne({
      initiative: initiative._id, 
      has_violation: false,
      conformanceStatus: "Green",
      // $or: [{status: essentialStatuses.Started._id}, {status: essentialStatuses.Completed._id}], 
      // status: essentialStatuses.Started._id,
    }).sort('-order').populate(populatePhase)
    if (!deliveryPhaseDetails) throw new Error("Doesn't exist")
  } catch(err) {
    console.log("Delivery Phase details and Delivery Phase not found: ", err.message, ". Using default values", "\n")
    deliveryPhaseDetails = await Phase.findOne({
      initiative: initiative._id,
      order: 1, 
    }).sort('order').populate(populatePhase)
  }
  await updatePhaseData(deliveryPhaseDetails);

  const deliveryPhase = await Gate.findById(deliveryPhaseDetails.gate)
  console.log({deliveryPhaseDetails})
  console.log("qualityStageGateDetails, qualityStageGate : ", deliveryPhaseDetails._id, deliveryPhase._id, "\n")
  return {deliveryPhase, deliveryPhaseDetails}
}

/**
 * @summary set the Phase and it's details
 * @param {Initiative} initiative 
 * @param {{String: Status}} essentialStatuses 
 * @returns 
 */
exports.setPhaseAndPhaseDetails = async (initiative, essentialStatuses) => {
  const populatePhase = 'gate status'
  let phaseDetails
  let phaseId
  // let phase = initiative.phase
  try {
    if (!initiative.phase) throw new Error("Initiative.phase not found")
    phaseId = initiative.phase._id ? initiative.phase._id : initiative.phase
    phaseDetails = await Phase.findOne({
      initiative: initiative._id, 
      gate: phaseId,
    }).sort('order').populate(populatePhase)
    if (!phaseDetails) throw new Error("Doesn't exist")
  } catch(err) {
    console.log("Phase details and Phase not found: ", err.message, ". Using default values", "\n")
    // phaseId = phaseDetails.gate
    phaseDetails = await Phase.findOne({
      initiative: initiative._id,
      order: 1, 
    }).sort('order').populate(populatePhase)
  }
  await updatePhaseData(phaseDetails);

  const phase = await Gate.findById(phaseDetails.gate)
  console.log("phaseDetails, phase : ", phaseDetails._id, phase._id, "\n")
  return {phase, phaseDetails}
}

// get or create statuses
exports.essentialStatuses = async () => {
  const getOrCreateStatus = async (title) => {
    const status = await Status.findOneAndUpdate({title}, {}, {
      upsert: true,
      new: true,
      runValidators: true,
    })
    return status
  }
  return {
    'Pending': await getOrCreateStatus('Pending'),
    'Undetermined': await getOrCreateStatus('Undetermined'),
    'Started': await getOrCreateStatus('Started'),
    'Completed': await getOrCreateStatus('Completed'),
  }
}


// validate initiative
exports.ensureValidInitiative = async (initiative) => {
  const startTime = Date.now()
  const essentialStatuses = await this.essentialStatuses()

  try {
    // get related phases
    const relatedPhases = await this.relatedPhases(initiative, essentialStatuses)
  
    // set quality stage gate and quality stage gate details
    const { QSG, QSGDetails } = await this.setQualityStageGateAndQualityStageGateDetails(initiative, essentialStatuses)

    // set delivery phase and delivery phase details
    const { deliveryPhase, deliveryPhaseDetails } = await this.setDeliveryPhaseAndDeliveryPhaseDetails(initiative, essentialStatuses)
    
    // set phase and phase details
    const { phase, phaseDetails } = await this.setPhaseAndPhaseDetails(initiative, essentialStatuses)
  
    // update the initiative
    initiative.serialNumber = initiative.serialNumber || await this.generateQASerialNumber()
    initiative.qualityStageGate = QSG
    initiative.qualityStageGateDetails = QSGDetails
    initiative.deliveryPhase = deliveryPhase
    initiative.deliveryPhaseDetails = deliveryPhaseDetails
    initiative.phase = phase
    initiative.phaseDetails = phaseDetails

    // initiative.qualityStageGate = QSG._id
    // initiative.qualityStageGateDetails = QSGDetails._id
    // initiative.deliveryPhase = deliveryPhase._id
    // initiative.deliveryPhaseDetails = deliveryPhaseDetails._id
    // initiative.phaseDetails = phaseDetails._id
    // initiative.phase = phase._id

    await initiative.save()
    console.log("initiative (final - valid) : ", initiative._id, initiative.conformanceStatus, "\n")
  
    const endTime = Date.now()
    console.log(`validating initiative took ${(endTime - startTime) / 1000} seconds`)
    return initiative
  } catch (error) {
    console.error(`${error.message}`.red)
    throw new Error(`Invalid Initiative: ${error.message}`)
  }  
}


exports.createOrUpdateInitiative = asyncHandler(async (req, res) => {
  try {
    const body = {...req.body, requesterName: req.user.fullname, requesterEmail: req.user.email}
    const essentialStatuses = await this.essentialStatuses()
    
    // console.log("body (payload) : ", body, "\n"),,
    
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
    console.log("initiative (initial) : ", initiative._id, "\n")
  

    // get related phases
    const relatedPhases = await this.relatedPhases(initiative, essentialStatuses)
  
    // set quality stage gate and quality stage gate details
    const { QSG, QSGDetails } = await this.setQualityStageGateAndQualityStageGateDetails(initiative, essentialStatuses)

    // set delivery phase and delivery phase details
    const { deliveryPhase, deliveryPhaseDetails } = await this.setDeliveryPhaseAndDeliveryPhaseDetails(initiative, essentialStatuses)
    
    // set phase and phase details
    const { phase, phaseDetails } = await this.setPhaseAndPhaseDetails(initiative, essentialStatuses)

    // update the initiative
    initiative.serialNumber = initiative.serialNumber || await this.generateQASerialNumber()
    initiative.qualityStageGate = QSG._id
    initiative.qualityStageGateDetails = QSGDetails._id
    initiative.deliveryPhase = deliveryPhase._id
    initiative.deliveryPhaseDetails = deliveryPhaseDetails._id
    initiative.phaseDetails = phaseDetails._id
    initiative.phase = phase._id
  
    await initiative.save()
    console.log("initiative (final) : ", initiative._id, "\n")
  
    return initiative
  } catch(err) {
    throw new ErrorResponseJSON(res, err.message, 500)
  }
  
})
