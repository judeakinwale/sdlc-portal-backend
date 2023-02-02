const router = require("express").Router();
const Phase = require("../models/Phase");
const {createPhase, getAllPhases, getPhase, updatePhase, deletePhase, populatePhase, deleteAllPhases} = require("../controllers/phase");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createPhase); // create a phase
router.get("/", advancedResults(Phase, populatePhase), getAllPhases); // get all phases
router.get("/:id", getPhase); // get phase details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updatePhase); // update phase details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deletePhase); // delete phase by id
router.delete("/delete/all/phases", verifyToken, authorize("HR", "Admin"), deleteAllPhases); // delete response by id

module.exports = router;
