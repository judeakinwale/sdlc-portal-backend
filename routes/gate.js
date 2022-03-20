const router = require('express').Router()
const {
  createGate,
  getAllGates,
  getGate,
  updateGate,
  deleteGate
} = require("../controllers/gate")
const { verifyToken } = require("../middlewares/auth")

router.post("/", verifyToken, createGate); // create a gate
router.get("/", getAllGates); // get all gates
router.get("/:id", verifyToken, getGate); // get gate details by id
router.patch("/:id", verifyToken, updateGate); // update gate details by id
router.delete("/:id", verifyToken, deleteGate); // delete gate by id

module.exports = router;