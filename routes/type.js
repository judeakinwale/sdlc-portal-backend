const router = require("express").Router();
const Type = require("../models/Type");
const {createType, getAllTypes, getType, updateType, deleteType} = require("../controllers/type");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createType); // create a type
router.get("/", advancedResults(Type), getAllTypes); // get all types
router.get("/:id", verifyToken, getType); // get type details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updateType); // update type details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deleteType); // delete type by id

module.exports = router;
