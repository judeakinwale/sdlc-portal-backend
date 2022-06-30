const router = require("express").Router();
const Phase = require("../models/Phase");
const {createPhase, getAllPhases, getPhase, updatePhase, deletePhase, populatePhase} = require("../controllers/phase");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createPhase); // create a phase
router.get("/", advancedResults(Phase, populatePhase), getAllPhases); // get all phases
router.get("/:id", verifyToken, getPhase); // get phase details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updatePhase); // update phase details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deletePhase); // delete phase by id

module.exports = router;
