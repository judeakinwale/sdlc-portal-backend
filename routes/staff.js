const router = require("express").Router();
const Staff = require("../models/Staff");
const {getAllStaffs, getStaff, updateStaff, deleteStaff, populateStaff} = require("../controllers/staff");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.get("/", advancedResults(Staff, populateStaff), getAllStaffs); // get all staffs
router.get("/:id", getStaff); // get staff details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updateStaff); // update staff details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deleteStaff); // delete staff by id

module.exports = router;
