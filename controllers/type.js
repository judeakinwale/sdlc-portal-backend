const Type = require("../models/Type")
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create a type
const createType = async (req, res) => {
  try {
    let { body } = req

    const existingTypeTitle = await Type.find({title: body.title})

    if (existingTypeTitle.length > 0) {
      return new ErrorResponseJSON(res, "This type already exists, update it instead!", 400)
    }

    const type = await Type.create(body)

    res.status(200).json({
      success: true,
      data: type,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get all types
const getAllTypes = async (req, res) => {
  try {
    const type = await Type.find().populate('gates')

    if (!type || type.length < 1) {
      return new ErrorResponseJSON(res, "Types not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: type,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get a type's details
const getType = async (req, res) => {
  try {
    const type = await Type.findById(req.params.id).populate('gates')

    if (!type) {
      return new ErrorResponseJSON(res, "Type not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: type,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Upadate a type's details
const updateType = async (req, res) => {
  try {
    const { body } = req

    const type = await Type.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: type,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Delete a type
const deleteType = async (req, res) => {
  try {
    const type = await Type.findByIdAndDelete(req.params.id)
    if (!type) {
      return new ErrorResponseJSON(res, "Type not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: type,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

module.exports = {
  createType,
  getAllTypes,
  getType,
  updateType,
  deleteType
}