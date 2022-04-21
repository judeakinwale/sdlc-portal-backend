const asyncHandler = require("../middleware/async")
const Criterion = require("../models/Criterion")
const {ErrorResponseJSON} = require("../utils/errorResponse")
const {updateAllSchema} = require("../utils/updateDetails")


// @desc    Create Criterion
// @route  POST /api/v1/criterion
// @access   Private
exports.createCriterion = asyncHandler(async (req, res, next) => {
  try {
    const existingCriterion = await Criterion.find({title: req.body.title, gate: req.body.gate})

    if (existingCriterion.length > 0) {
      return new ErrorResponseJSON(res, "This criterion already exists, update it instead!", 400)
    }

    const gateCriteria = await Criterion.find({gate: req.body.gate})
    let totalPercentage = 0

    for (const [key, criterion] of Object.entries(gateCriteria)) {
      totalPercentage += criterion.percentage
    }
    totalPercentage += req.body.percentage

    if (totalPercentage > 100) {
      return new ErrorResponseJSON(res, "Total percentage for the criteria in the gate exceeeds 100!", 400)
    }

    const criterion = await Criterion.create(req.body)

    if (!criterion) {
      return new ErrorResponseJSON(res, "Criterion not created!", 404)
    }
    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Get all Criteria
// @route   GET /api/v1/criterion
// @access   Public
exports.getAllCriteria = asyncHandler(async (req, res, next) => {
  await updateAllSchema()
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Criterion
// @route  GET /api/v1/criterion/:id
// @access   Private
exports.getCriterion = asyncHandler(async (req, res, next) => {
  try {
    await updateAllSchema()
    const criterion = await Criterion.findById(req.params.id).populate('gate items')

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
})


// @desc    Update Criterion
// @route  PATCH /api/v1/criterion/:id
// @access   Private
exports.updateCriterion = asyncHandler(async (req, res, next) => {
  try {
    const existingCriterion = await Criterion.findById(req.params.id)
    const gateCriteria = await Criterion.find({gate: existingCriterion.gate})

    try {
      let totalPercentage = 0

      for (const [key, criterion] of Object.entries(gateCriteria)) {
        totalPercentage += criterion.percentage
      }
      totalPercentage -= existingCriterion.percentage
      totalPercentage += req.body.percentage
      console.log(totalPercentage)

      if (totalPercentage > 100) {
        return new ErrorResponseJSON(res, "Total percentage for the criteria in the gate exceeeds 100!", 400)
      }
    } catch (err) {
      // console.log(err.message)
    }
    
    const criterion = await Criterion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!criterion) {
      return new ErrorResponseJSON(res, "Criterion not updated!", 404)
    }
    res.status(200).json({
      success: true,
      data: criterion,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Delete Criterion
// @route  DELETE /api/v1/criterion/:id
// @access   Private
exports.deleteCriterion = asyncHandler(async (req, res, next) => {
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
})
