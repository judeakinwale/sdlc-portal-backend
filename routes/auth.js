const router = require("express").Router();
// const upload = require("../config/multersetup");
const {
  postUserDetails,
  getUser,
  updateUser,
  // uploadDp,
  getAllStaff,
  deleteStaff,
  // uploadDocuments,
  // getUserDP,
} = require("../controllers/auth");
const {
  verifyToken,
  verifyTokenAdmin,
} = require("../middlewares/auth");

router.post("/", postUserDetails); //register a new user
router.get("/", verifyToken, getUser); //get authenticated user
router.patch("/", verifyToken, updateUser); //update a user

// router.patch("/userdp", verifyToken, upload.single("profilePic"), uploadDp);
// router.get("/photo", verifyToken, getUserDP); //get staff profile picture

// router.patch(
//   "/documents",
//   verifyToken,
//   upload.array("documents", 5),
//   uploadDocuments
// ); //upload documents

//Admin routes
router.get("/allstaff", verifyTokenAdmin, getAllStaff); //get all staff"
router.delete("/:id", verifyTokenAdmin, deleteStaff); //delete a user

module.exports = router;
