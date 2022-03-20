const Gate = require("../models/Gate")
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create a gate
const createGate = async (req, res) => {
  try {
    let { body } = req

    const existingGateTitle = await Gate.find({title: body.title})

    if (existingGateTitle.length > 0) {
      return new ErrorResponseJSON(res, "This gate already exists, update it instead!", 400)
    }

    const gate = await Gate.create(body)

    res.status(200).json({
      success: true,
      data: gate,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get all gates
const getAllGates = async (req, res) => {
  try {
    const gate = await Gate.find().populate('criteria')

    if (!gate || gate.length < 1) {
      return new ErrorResponseJSON(res, "Gates not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: gate,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get a gate's details
const getGate = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id).populate('criteria')

    if (!gate) {
      return new ErrorResponseJSON(res, "Gate not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: gate,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Upadate a gate's details
const updateGate = async (req, res) => {
  try {
    const { body } = req

    const gate = await Gate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: gate,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Delete a gate
const deleteGate = async (req, res) => {
  try {
    const gate = await Gate.findByIdAndDelete(req.params.id)
    if (!gate) {
      return new ErrorResponseJSON(res, "Gate not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: gate,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

module.exports = {
  createGate,
  getAllGates,
  getGate,
  updateGate,
  deleteGate
}