const asyncHandler = require("../middleware/async")
const Criterion = require("../models/Criterion")
const {ErrorResponseJSON} = require("../utils/errorResponse")


// @desc    Create Criterion
// @route  POST /api/v1/criterion
// @access   Private
exports.createCriterion = asyncHandler(async (req, res, next) => {
  try {
    const existingCriterionTitle = await Criterion.find({title: req.body.title})

    if (existingCriterionTitle.length > 0) {
      return next(new ErrorResponseJSON(res, "This criterion already exists, update it instead!", 400))
    }

    const criterion = await Criterion.create(req.body)

    if (!criterion) {
      return next(new ErrorResponseJSON(res, "Criterion not created!", 404))
    }
    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Get all Criteria
// @route   GET /api/v1/criterion
// @access   Public
exports.getAllCriteria = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Criterion
// @route  GET /api/v1/criterion/:id
// @access   Private
exports.getCriterion = asyncHandler(async (req, res, next) => {
  try {
    const criterion = await Criterion.findById(req.params.id).populate('items')

    if (!criterion) {
      return next(new ErrorResponseJSON(res, "Criterion not found!", 404))
    }
    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Update Criterion
// @route  PATCH /api/v1/criterion/:id
// @access   Private
exports.updateCriterion = asyncHandler(async (req, res, next) => {
  try {
    const criterion = await Criterion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!criterion) {
      return next(new ErrorResponseJSON(res, "Criterion not updated!", 404))
    }
    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})


// @desc    Delete Criterion
// @route  DELETE /api/v1/criterion/:id
// @access   Private
exports.deleteCriterion = asyncHandler(async (req, res, next) => {
  try {
    const criterion = await Criterion.findByIdAndDelete(req.params.id)
    if (!criterion) {
      return next(new ErrorResponseJSON(res, "Criterion not found!", 404))
    }
    
    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
})
