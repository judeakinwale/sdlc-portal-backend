const router = require('express').Router()
const Prefix = require('../models/Prefix');
const {
  createPrefix,
  getAllPrefixs,
  getPrefix,
  updatePrefix,
  deletePrefix
} = require("../controllers/prefix");
const { verifyToken } = require("../middleware/auth");
const advancedResults = require('../middleware/advancedResults');

router.post("/", verifyToken, createPrefix); // create a prefix
router.get("/", advancedResults(Prefix), getAllPrefixs); // get all prefixes
router.get("/:id", verifyToken, getPrefix); // get prefix details by id
router.patch("/:id", verifyToken, updatePrefix); // update prefix details by id
router.delete("/:id", verifyToken, deletePrefix); // delete prefix by id

module.exports = router;