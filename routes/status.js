const router = require("express").Router();
const Status = require("../models/Status");
const {createStatus, getAllStatuss, getStatus, updateStatus, deleteStatus} = require("../controllers/status");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createStatus); // create a status
router.get("/", advancedResults(Status), getAllStatuss); // get all statuses
router.get("/:id", verifyToken, getStatus); // get status details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updateStatus); // update status details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deleteStatus); // delete status by id

module.exports = router;
