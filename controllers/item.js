const Item = require("../models/Item")
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create a item
const createItem = async (req, res) => {
  try {
    let { body } = req

    const existingItemTitle = await Item.find({title: body.title})

    if (existingItemTitle.length > 0) {
      return new ErrorResponseJSON(res, "This item already exists, update it instead!", 400)
    }

    const item = await Item.create(body)

    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get all items
const getAllItems = async (req, res) => {
  try {
    const item = await Item.find().populate('prefix')

    if (!item || item.length < 1) {
      return new ErrorResponseJSON(res, "Items not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Get a item's details
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('prefix')

    if (!item) {
      return new ErrorResponseJSON(res, "Item not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Upadate a item's details
const updateItem = async (req, res) => {
  try {
    const { body } = req

    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

// Delete a item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id)
    if (!item) {
      return new ErrorResponseJSON(res, "Item not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
}

module.exports = {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem
}