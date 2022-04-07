const asyncHandler = require("../middleware/async")
const Gate = require("../models/Gate")
const {ErrorResponseJSON} = require("../utils/errorResponse")


// @desc    Create Gate
// @route  POST /api/v1/gate
// @access   Private
exports.createGate = asyncHandler(async (req, res, next) => {
  try {
    const existingGateTitle = await Gate.find({title: req.body.title, initiativeType: req.body.initiativeType})

    if (existingGateTitle.length > 0) {
      return next(new ErrorResponseJSON(res, "This gate already exists, update it instead!", 400))
    }

    const gate = await Gate.create(req.body)

    if (!gate) {
      return next(new ErrorResponseJSON(res, "Gate not created!", 404))
    }
    res.status(200).json({
      success: true,
      data: gate,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Get all Gates
// @route  GET /api/v1/gate
// @access   Private
exports.getAllGates = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Gate
// @route  GET /api/v1/gate/:id
// @access   Private
exports.getGate = asyncHandler(async (req, res, next) => {
  try {
    const gate = await Gate.findById(req.params.id).populate('initiativeType')

    if (!gate) {
      return next(new ErrorResponseJSON(res, "Gate not found!", 404))
    }
    res.status(200).json({
      success: true,
      data: gate,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Update Gate
// @route  PATCH /api/v1/gate/:id
// @access   Private
exports.updateGate = asyncHandler(async (req, res, next) => {
  try {
    const gate = await Gate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!gate) {
      return next(new ErrorResponseJSON(res, "Gate not updated!", 404))
    }
    res.status(200).json({
      success: true,
      data: gate,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Delete Gate
// @route  DELETE /api/v1/gate/:id
// @access   Private
exports.deleteGate = asyncHandler(async (req, res, next) => {
  try {
    const gate = await Gate.findByIdAndDelete(req.params.id)
    
    if (!gate) {
      return next(new ErrorResponseJSON(res, "Gate not found!", 404))
    }
    res.status(200).json({
      success: true,
      data: gate,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})
