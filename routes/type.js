const router = require('express').Router()
const Type = require('../models/Type');
const {
  createType,
  getAllTypes,
  getType,
  updateType,
  deleteType
} = require("../controllers/type");
const { verifyToken } = require("../middleware/auth");
const advancedResults = require('../middleware/advancedResults');

router.post("/", verifyToken, createType); // create a type
router.get("/", advancedResults(Type), getAllTypes); // get all types
router.get("/:id", verifyToken, getType); // get type details by id
router.patch("/:id", verifyToken, updateType); // update type details by id
router.delete("/:id", verifyToken, deleteType); // delete type by id

module.exports = router;