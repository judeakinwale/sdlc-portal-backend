const router = require('express').Router()
const Phase = require("../models/Phase")
const {
  createPhase,
  getAllPhases,
  getPhase,
  updatePhase,
  deletePhase
} = require("../controllers/phase")
const { verifyToken } = require("../middleware/auth")
const advancedResults = require("../middleware/advancedResults")

router.post("/", verifyToken, createPhase); // create a phase
router.get("/", advancedResults(Phase), getAllPhases); // get all phases
router.get("/:id", verifyToken, getPhase); // get phase details by id
router.patch("/:id", verifyToken, updatePhase); // update phase details by id
router.delete("/:id", verifyToken, deletePhase); // delete phase by id

module.exports = router;