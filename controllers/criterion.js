/* eslint-disable no-unused-vars */
const asyncHandler = require("../middleware/async")
const Criterion = require("../models/Criterion")
const Gate = require("../models/Gate")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


exports.populateCriterion = {path: "gate items initiativeType"}


// @desc    Create Criterion
// @route  POST /api/v1/criterion
// @access   Private
exports.createCriterion = asyncHandler(async (req, res, next) => {
  const existingCriterion = await Criterion.find({title: req.body.title, gate: req.body.gate})

  if (existingCriterion.length > 0) {
    return new ErrorResponseJSON(res, "This criterion already exists, update it instead!", 400)
  }

  const gate = await Gate.findById(req.body.gate)
  req.body.initiativeType = gate.initiativeType

  const gateCriteria = await Criterion.find({gate: req.body.gate})
  let totalPercentage = 0

  for (const [key, criterion] of Object.entries(gateCriteria)) {
    totalPercentage += criterion.percentage
  }
  totalPercentage += Number(req.body.percentage)

  if (totalPercentage > 100) {
    console.log("total percentage, gate criteria length: ", totalPercentage, gateCriteria.length)
    return new ErrorResponseJSON(res, "Total percentage for the criteria in the gate exceeeds 100!", 400)
  }

  const criterion = await Criterion.create(req.body)
  if (!criterion) {
    return new ErrorResponseJSON(res, "Criterion not created!", 404)
  }
  return new SuccessResponseJSON(res, criterion, 201)
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
  const criterion = await Criterion.findById(req.params.id).populate(this.populateCriterionDetails)
  if (!criterion) {
    return new ErrorResponseJSON(res, "Criterion not found!", 404)
  }
  return new SuccessResponseJSON(res, criterion)
})


// @desc    Update Criterion
// @route  PATCH /api/v1/criterion/:id
// @access   Private
exports.updateCriterion = asyncHandler(async (req, res, next) => {
    const existingCriterion = await Criterion.findById(req.params.id)
  const gateCriteria = await Criterion.find({gate: existingCriterion.gate})

  try {
    let totalPercentage = 0

    for (const [key, criterion] of Object.entries(gateCriteria)) {
      totalPercentage += criterion.percentage
    }
    totalPercentage -= existingCriterion.percentage
    totalPercentage += Number(req.body.percentage)
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
  await criterion.save()
  return new SuccessResponseJSON(res, criterion)
})


// @desc    Delete Criterion
// @route  DELETE /api/v1/criterion/:id
// @access   Private
exports.deleteCriterion = asyncHandler(async (req, res, next) => {
  const criterion = await Criterion.findByIdAndDelete(req.params.id)
  if (!criterion) {
    return new ErrorResponseJSON(res, "Criterion not found!", 404)
  }
  // await criterion.save()
  return new SuccessResponseJSON(res, criterion)
})
