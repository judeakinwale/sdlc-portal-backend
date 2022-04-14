const asyncHandler = require("../middleware/async")
const Response = require("../models/Response")
const {ErrorResponseJSON} = require("../utils/errorResponse")


// @desc    Create Response
// @route  POST /api/v1/response
// @access   Private
exports.createResponse = asyncHandler(async (req, res, next) => {
  try {
    const existingResponse = await Response.find({
      staff: req.body.staff,
      initiative: req.body.initiative,
      phase: req.body.phase,
      criterion: req.body.criterion,
      item: req.body.item,
    })

    if (existingResponse.length > 0) {
      return next(new ErrorResponseJSON(res, "This response already exists, update it instead!", 400))
    }
    // Update related phase's status
    const related_phase = await Phase.findById(req.body.phase) 
    if (related_phase.status != "Completed" && related_phase.status != "Started") {
      related_phase.status = "Started"
      await related_phase.save()
    }

    const response = await Response.create(req.body)

    if (!response) {
      return next(new ErrorResponseJSON(res, "Response not created!", 404))
    }
    res.status(200).json({
      success: true,
      data: response,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Get all Responses
// @route  GET /api/v1/response
// @access   Private
exports.getAllResponses = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Response
// @route  GET /api/v1/response/:id
// @access   Private
exports.getResponse = asyncHandler(async (req, res, next) => {
  try {
    const response = await Response.findById(req.params.id).populate('criteria')

    if (!response) {
      return next(new ErrorResponseJSON(res, "Response not found!", 404))
    }
    res.status(200).json({
      success: true,
      data: response,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Update Response
// @route  PATCH /api/v1/response/:id
// @access   Private
exports.updateResponse = asyncHandler(async (req, res, next) => {
  try {
    const response = await Response.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!response) {
      return next(new ErrorResponseJSON(res, "Response not updated!", 404))
    }
    res.status(200).json({
      success: true,
      data: response,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Delete Response
// @route  DELETE /api/v1/response/:id
// @access   Private
exports.deleteResponse = asyncHandler(async (req, res, next) => {
  try {
    const response = await Response.findByIdAndDelete(req.params.id)
    
    if (!response) {
      return next(new ErrorResponseJSON(res, "Response not found!", 404))
    }
    res.status(200).json({
      success: true,
      data: response,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})
