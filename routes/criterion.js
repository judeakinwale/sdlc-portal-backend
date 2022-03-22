const router = require('express').Router()
const Criterion = require("../models/Criterion")
const {
  createCriterion,
  getAllCriteria,
  getCriterion,
  updateCriterion,
  deleteCriterion
} = require("../controllers/criterion")
const { verifyToken } = require("../middleware/auth")
const advancedResults = require("../middleware/advancedResults")

router.post("/", verifyToken, createCriterion); // create a criterion
router.get("/", advancedResults(Criterion), getAllCriteria); // get all criteria
// router.get("/", getAllCriteria); // get all criteria
router.get("/:id", verifyToken, getCriterion); // get criterion details by id
router.patch("/:id", verifyToken, updateCriterion); // update criterion details by id
router.delete("/:id", verifyToken, deleteCriterion); // delete criterion by id

module.exports = router;