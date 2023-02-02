const router = require("express").Router();
const Gate = require("../models/Gate");
const {createGate, getAllGates, getGate, updateGate, deleteGate, populateGate} = require("../controllers/gate");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createGate); // create a gate
router.get("/", advancedResults(Gate, populateGate), getAllGates); // get all gates
router.get("/:id", getGate); // get gate details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updateGate); // update gate details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deleteGate); // delete gate by id

module.exports = router;
