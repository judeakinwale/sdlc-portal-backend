const asyncHandler = require("../middleware/async")
const Initiative = require("../models/Initiative")
const Status = require("../models/Status")
const Type = require("../models/Type")
const {ErrorResponseJSON} = require("../utils/errorResponse")
const { filterQuerysetByQuerysetInstances } = require("../utils/updateDetails")


// @desc    Get Initiatives By Status
// @route  GET /api/v1/log/initiative/status/me
// @access   Private
exports.getInitiativesByStatus = asyncHandler(async (req, res, next) => {
  try {
    query = {
      qualityAssuranceEngineer: req.user,
    }
    const logs = await filterQuerysetByQuerysetInstances(req, Initiative, Status, query, "status")

    res.status(200).json({
      success: true,
      data: logs,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Get Initiatives By Status
// @route  GET /api/v1/log/initiative/status/
// @access   Private
exports.allInitiativesByStatus = asyncHandler(async (req, res, next) => {
  try {
    const logs = await filterQuerysetByQuerysetInstances(req, Initiative, Status, {}, "status")

    res.status(200).json({
      success: true,
      data: logs,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// @desc    Get Initiatives By Type
// @route  GET /api/v1/log/initiative/type/
// @access   Private
exports.allInitiativesByType = asyncHandler(async (req, res, next) => {
  try {
    const logs = await filterQuerysetByQuerysetInstances(req, Initiative, Type, {}, "type")

    res.status(200).json({
      success: true,
      data: logs,
    })
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
})


// // @desc    Get Initiative
// // @route  GET /api/v1/log/initiative/:id
// // @access   Private
// exports.getInitiative = asyncHandler(async (req, res, next) => {
//   try {
//     const logs = await Initiative.findById(req.params.id)

//     if (!logs) {
//       return new ErrorResponseJSON(res, "Initiative not found!", 404)
//     }
//     res.status(200).json({
//       success: true,
//       data: logs,
//     })
//   } catch (err) {
//     return new ErrorResponseJSON(res, err.message, 500)
//   }
// })

