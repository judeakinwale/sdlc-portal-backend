const Initiative = require("../models/Initiative")
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create a initiative
const createInitiative = async (req, res) => {
  try {
    let { body } = req

    const existingInitiativeTitle = await Initiative.find({title: body.title})

    if (existingInitiativeTitle.length > 0) {
      return new ErrorResponseJSON(res, "This initiative already exists, update it instead!", 400)
    }

    const initiative = await Initiative.create(body)

    res.status(200).json({
      success: true,
      data: initiative,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get all initiatives
const getAllInitiatives = async (req, res) => {
  try {
    const initiative = await Initiative.find().populate(
      'qualityAssuranceEngineer department qualityStageGate deliveryPhase phase'
    )

    if (!initiative || initiative.length < 1) {
      return new ErrorResponseJSON(res, "Initiatives not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: initiative,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get a initiative's details
const getInitiative = async (req, res) => {
  try {
    const initiative = await Initiative.findById(req.params.id).populate(
      'qualityAssuranceEngineer department qualityStageGate deliveryPhase phase'
    )

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
}

// Upadate a initiative's details
const updateInitiative = async (req, res) => {
  try {
    const { body } = req

    const initiative = await Initiative.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: initiative,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Delete a initiative
const deleteInitiative = async (req, res) => {
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
}

module.exports = {
  createInitiative,
  getAllInitiatives,
  getInitiative,
  updateInitiative,
  deleteInitiative
}