const router = require("express").Router();
const Staff = require("../models/Staff");
const upload = require("../config/multersetup");
const {
  postUserDetails,
  getUser,
  updateUser,
  getAllStaff,
  getStaff,
  updateStaff,
  deleteStaff,
  uploadDocuments,
  getUserDP,
  logout,
  // updateRelations,
} = require("../controllers/auth");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", postUserDetails); //register a new user
router.get("/", verifyToken, getUser); //get authenticated user
router.patch("/", verifyToken, updateUser); //update authenticated user
router.post("/logout", logout); //log out authenticated user
router.post("/photo", verifyToken, getUserDP); //get authenticated staff's profile picture
router.patch("/documents", verifyToken, upload.array("documents", 5), uploadDocuments); //upload documents
//Administrative / Setup
// router.get("/all", verifyToken, authorize("HR", "Admin", "Manager"), advancedResults(Staff), getAllStaff); //get all staff
router.get("/all", advancedResults(Staff), getAllStaff); //get all staff //TODO: Delete this line
// router.get("/db/update", updateRelations); // update database relations // depreciated
router.get("/:id", verifyToken, authorize("HR", "Admin", "Manager"), getStaff); //get a user
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updateStaff); //update a user
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deleteStaff); //delete a user

module.exports = router;
