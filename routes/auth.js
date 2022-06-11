const router = require("express").Router();
const Staff = require("../models/Staff");
const upload = require("../config/multersetup");
const {
  postUserDetails,
  getUser,
  updateUser,
  getAllStaff,
  deleteStaff,
  uploadDocuments,
  getUserDP,
  logout,
  updateRelations,
} = require("../controllers/auth");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", postUserDetails); //register a new user
router.get("/", verifyToken, getUser); //get authenticated user
router.patch("/", verifyToken, updateUser); //update authenticated user
router.post("/logout", logout); //log out authenticated user
router.post("/photo", verifyToken, getUserDP); //get staff profile picture
router.patch("/documents", verifyToken, upload.array("documents", 5), uploadDocuments); //upload documents
//Administrative / Setup
router.get("/all", advancedResults(Staff), getAllStaff); //get all staff"
router.get("/db/update", updateRelations); // update database relations
router.delete("/:id", verifyToken, authorize("HR", "Admin"), deleteStaff); //delete a user

module.exports = router;
