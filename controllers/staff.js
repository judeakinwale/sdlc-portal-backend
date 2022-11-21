/* eslint-disable no-unused-vars */
const asyncHandler = require("../middleware/async")
const Staff = require("../models/Staff")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


exports.populateStaff = {path: "manager responses"}


// @desc    Get all Staffs
// @route  GET /api/v1/staff
// @access   Private
exports.getAllStaffs = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
})


// @desc    Get Staff
// @route  GET /api/v1/staff/:id
// @access   Private
exports.getStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id)
  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not found!", 404)
  }
  return new SuccessResponseJSON(res, staff)
})


// @desc    Update Staff
// @route  UPDATE /api/v1/staff/:id
// @access   Private
exports.updateStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not updated!", 404)
  }
  await staff.save()
  return new SuccessResponseJSON(res, staff)
})


// @desc    Delete Staff
// @route  DELETE /api/v1/staff
// @access   Private
exports.deleteStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findByIdAndDelete(req.params.id)
  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not found!", 404)
  }
  await staff.save()
  return new SuccessResponseJSON(res, staff)
})
