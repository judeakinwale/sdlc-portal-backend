const router = require('express').Router()
const {
  createCriterion,
  getAllCriteria,
  getCriterion,
  updateCriterion,
  deleteCriterion
} = require("../controllers/criterion")
const { verifyToken } = require("../middlewares/auth")

router.post("/", verifyToken, createCriterion); // create a criterion
router.get("/", getAllCriteria); // get all criteria
router.get("/:id", verifyToken, getCriterion); // get criterion details by id
router.patch("/:id", verifyToken, updateCriterion); // update criterion details by id
router.delete("/:id", verifyToken, deleteCriterion); // delete criterion by id

module.exports = router;