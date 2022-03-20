const Criterion = require("../models/Criterion")
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create a criterion
const createCriterion = async (req, res) => {
  try {
    let { body } = req

    const existingCriterionTitle = await Criterion.find({title: body.title})

    if (existingCriterionTitle.length > 0) {
      return new ErrorResponseJSON(res, "This criterion already exists, update it instead!", 400)
    }

    const criterion = await Criterion.create(body)

    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get all criterions
const getAllCriteria = async (req, res) => {
  try {
    const criterion = await Criterion.find().populate('items')

    if (!criterion || criterion.length < 1) {
      return new ErrorResponseJSON(res, "Criterions not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get a criterion's details
const getCriterion = async (req, res) => {
  try {
    const criterion = await Criterion.findById(req.params.id).populate('items')

    if (!criterion) {
      return new ErrorResponseJSON(res, "Criterion not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Upadate a criterion's details
const updateCriterion = async (req, res) => {
  try {
    const { body } = req

    const criterion = await Criterion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Delete a criterion
const deleteCriterion = async (req, res) => {
  try {
    const criterion = await Criterion.findByIdAndDelete(req.params.id)
    if (!criterion) {
      return new ErrorResponseJSON(res, "Criterion not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

module.exports = {
  createCriterion,
  getAllCriteria,
  getCriterion,
  updateCriterion,
  deleteCriterion
}