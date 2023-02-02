const router = require("express").Router();
const Prefix = require("../models/Prefix");
const {createPrefix, getAllPrefixs, getPrefix, updatePrefix, deletePrefix} = require("../controllers/prefix");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createPrefix); // create a prefix
router.get("/", advancedResults(Prefix), getAllPrefixs); // get all prefixes
router.get("/:id", getPrefix); // get prefix details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updatePrefix); // update prefix details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deletePrefix); // delete prefix by id

module.exports = router;
