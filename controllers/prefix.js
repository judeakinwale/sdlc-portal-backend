const Prefix = require("../models/Prefix")
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create a prefix
const createPrefix = async (req, res) => {
  try {
    let { body } = req

    const existingPrefixTitle = await Prefix.find({title: body.title})

    if (existingPrefixTitle.length > 0) {
      return new ErrorResponseJSON(res, "This prefix already exists, update it instead!", 400)
    }

    const prefix = await Prefix.create(body)

    res.status(200).json({
      success: true,
      data: prefix,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get all prefixs
const getAllPrefixs = async (req, res) => {
  try {
    const prefix = await Prefix.find().populate('gates')

    if (!prefix || prefix.length < 1) {
      return new ErrorResponseJSON(res, "Prefixs not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: prefix,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get a prefix's details
const getPrefix = async (req, res) => {
  try {
    const prefix = await Prefix.findById(req.params.id).populate('gates')

    if (!prefix) {
      return new ErrorResponseJSON(res, "Prefix not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: prefix,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Upadate a prefix's details
const updatePrefix = async (req, res) => {
  try {
    const { body } = req

    const prefix = await Prefix.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: prefix,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Delete a prefix
const deletePrefix = async (req, res) => {
  try {
    const prefix = await Prefix.findByIdAndDelete(req.params.id)
    if (!prefix) {
      return new ErrorResponseJSON(res, "Prefix not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: prefix,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

module.exports = {
  createPrefix,
  getAllPrefixs,
  getPrefix,
  updatePrefix,
  deletePrefix
}