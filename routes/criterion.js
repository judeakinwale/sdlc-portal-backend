const router = require("express").Router();
const Criterion = require("../models/Criterion");
const {
  createCriterion,
  getAllCriteria,
  getCriterion,
  updateCriterion,
  deleteCriterion,
  populateCriterion,
} = require("../controllers/criterion");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createCriterion); // create a criterion
router.get("/", advancedResults(Criterion, populateCriterion), getAllCriteria); // get all criteria
router.get("/:id", getCriterion); // get criterion details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updateCriterion); // update criterion details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deleteCriterion); // delete criterion by id

module.exports = router;
