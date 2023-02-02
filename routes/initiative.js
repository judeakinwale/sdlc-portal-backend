const router = require("express").Router();
const Initiative = require("../models/Initiative");
const {
  createInitiative,
  getAllInitiatives,
  getInitiative,
  updateInitiative,
  deleteInitiative,
  getInitiativePhases,
  populateInitiative,
} = require("../controllers/initiative");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createInitiative); // create a initiative
router.get("/", advancedResults(Initiative, populateInitiative), getAllInitiatives); // get all initiatives
router.get("/:id", getInitiative); // get initiative details by id
// router.get("/:id", getInitiative); // get initiative details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager", "Engineer"), updateInitiative); // update initiative details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deleteInitiative); // delete initiative by id
router.get("/:id/phases", verifyToken, getInitiativePhases); // get initiative phases by initiative id

module.exports = router;
