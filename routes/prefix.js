const router = require('express').Router()
const {
  createPrefix,
  getAllPrefixs,
  getPrefix,
  updatePrefix,
  deletePrefix
} = require("../controllers/prefix")
const { verifyToken } = require("../middlewares/auth")

router.post("/", verifyToken, createPrefix); // create a prefix
router.get("/", getAllPrefixs); // get all prefixes
router.get("/:id", verifyToken, getPrefix); // get prefix details by id
router.patch("/:id", verifyToken, updatePrefix); // update prefix details by id
router.delete("/:id", verifyToken, deletePrefix); // delete prefix by id

module.exports = router;