const asyncHandler = require("../middleware/async")
const Initiative = require("../models/Initiative")
const Phase = require("../models/Phase")
const Response = require("../models/Response")
const { phaseQPS } = require("../utils/calculateScore")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


exports.populateResponse = {path: "staff initiative phase gate criterion item prefix"}


// @desc    Create Response
// @route  POST /api/v1/response
// @access   Private
exports.createResponse = asyncHandler(async (req, res, next) => {
  const {user, body} = req
  req.body.staff = req.user._id

  if (!("phase" in body) && "gate" in body) {
    const getPhase  = await Phase.findOne(initiative=req.body.initiative, gate=req.body.gate)
    req.body.phase = getPhase.id
  }

  const existingResponse = await Response.find({
    staff: req.body.staff,
    initiative: req.body.initiative,
    phase: req.body.phase,
    criterion: req.body.criterion,
    item: req.body.item,
  })
  if (existingResponse.length > 0) {
    return new ErrorResponseJSON(res, "This response already exists, update it instead!", 400)
  }

  // Update related phase's status
  const related_phase = await Phase.findById(req.body.phase)

  if (related_phase.status != "Completed" && related_phase.status != "Started") {
    related_phase.status = "Started"
    await related_phase.save()
  }

  const response = await Response.create(req.body)
  if (!response) {
    return new ErrorResponseJSON(res, "Response not created!", 404)
  }

  const initiative = await Initiative.findById(response.initiative)
  await phaseQPS(initiative)

  return new SuccessResponseJSON(res, response, 201)
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
  const response = await Response.findById(req.params.id).populate(this.populateResponse)
  if (!response) {
    return new ErrorResponseJSON(res, "Response not found!", 404)
  }
  return new SuccessResponseJSON(res, response)
})


// @desc    Update Response
// @route  PATCH /api/v1/response/:id
// @access   Private
exports.updateResponse = asyncHandler(async (req, res, next) => {
  const response = await Response.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!response) {
    return new ErrorResponseJSON(res, "Response not updated!", 404)
  }

  const initiative = await Initiative.findById(response.initiative)
  await phaseQPS(initiative)

  return new SuccessResponseJSON(res, response)
})


// @desc    Delete Response
// @route  DELETE /api/v1/response/:id
// @access   Private
exports.deleteResponse = asyncHandler(async (req, res, next) => {
  const response = await Response.findByIdAndDelete(req.params.id)
  if (!response) {
    return new ErrorResponseJSON(res, "Response not found!", 404)
  }
  return new SuccessResponseJSON(res, response)
})
