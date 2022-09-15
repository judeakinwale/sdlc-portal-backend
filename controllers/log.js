const asyncHandler = require("../middleware/async")
const Initiative = require("../models/Initiative")
const Status = require("../models/Status")
const Type = require("../models/Type")
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")
const {filterQuerysetByQuerysetInstances} = require("../utils/updateDetails")


// @desc    Get Initiatives By Status
// @route  GET /api/v1/log/initiative/status/me
// @access   Private
exports.getInitiativesByStatus = asyncHandler(async (req, res, next) => {
  query = {
    qualityAssuranceEngineer: req.user,
  }
  const logs = await filterQuerysetByQuerysetInstances(req, Initiative, Status, query, "status")
  return new SuccessResponseJSON(res, logs)
})


// @desc    Get Initiatives By Status
// @route  GET /api/v1/log/initiative/status/
// @access   Private
exports.allInitiativesByStatus = asyncHandler(async (req, res, next) => {
  const logs = await filterQuerysetByQuerysetInstances(req, Initiative, Status, {}, "status")
  return new SuccessResponseJSON(res, logs)
})


// @desc    Get Initiatives By Type
// @route  GET /api/v1/log/initiative/type/
// @access   Private
exports.allInitiativesByType = asyncHandler(async (req, res, next) => {
  const logs = await filterQuerysetByQuerysetInstances(req, Initiative, Type, {}, "type")
  return new SuccessResponseJSON(res, logs)
})


// @desc    Get Initiative
// @route  GET /api/v1/log/initiative/:id
// @access   Private
exports.getInitiative = asyncHandler(async (req, res, next) => {
  const logs = await Initiative.findById(req.params.id)
  return new SuccessResponseJSON(res, logs)
})

