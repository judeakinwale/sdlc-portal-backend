const router = require('express').Router()
const Gate = require("../models/Gate")
const {
  createGate,
  getAllGates,
  getGate,
  updateGate,
  deleteGate
} = require("../controllers/gate")
const { verifyToken } = require("../middleware/auth")
const advancedResults = require("../middleware/advancedResults")

router.post("/", verifyToken, createGate); // create a gate
router.get("/", advancedResults(Gate), getAllGates); // get all gates
router.get("/:id", verifyToken, getGate); // get gate details by id
router.patch("/:id", verifyToken, updateGate); // update gate details by id
router.delete("/:id", verifyToken, deleteGate); // delete gate by id

module.exports = router;