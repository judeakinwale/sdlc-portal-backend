const router = require('express').Router()
const Initiative = require("../models/Initiative")
const {
  createInitiative,
  getAllInitiatives,
  getInitiative,
  updateInitiative,
  deleteInitiative
} = require("../controllers/initiative")
const { verifyToken } = require("../middleware/auth");
const advancedResults = require('../middleware/advancedResults');


router.post("/", verifyToken, createInitiative); // create a initiative
router.get("/", advancedResults(Initiative), getAllInitiatives); // get all initiatives
router.get("/:id", verifyToken, getInitiative); // get initiative details by id
router.patch("/:id", verifyToken, updateInitiative); // update initiative details by id
router.delete("/:id", verifyToken, deleteInitiative); // delete initiative by id

module.exports = router;