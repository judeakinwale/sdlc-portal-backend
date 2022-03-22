const router = require('express').Router()
const {
  createType,
  getAllTypes,
  getType,
  updateType,
  deleteType
} = require("../controllers/type")
const { verifyToken } = require("../middleware/auth")

router.post("/", verifyToken, createType); // create a type
router.get("/", getAllTypes); // get all types
router.get("/:id", verifyToken, getType); // get type details by id
router.patch("/:id", verifyToken, updateType); // update type details by id
router.delete("/:id", verifyToken, deleteType); // delete type by id

module.exports = router;