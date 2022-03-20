const router = require('express').Router()
const {
  createInitiative,
  getAllInitiatives,
  getInitiative,
  updateInitiative,
  deleteInitiative
} = require("../controllers/initiative")
const { verifyToken } = require("../middlewares/auth")

router.post("/", verifyToken, createInitiative); // create a initiative
router.get("/", getAllInitiatives); // get all initiatives
router.get("/:id", verifyToken, getInitiative); // get initiative details by id
router.patch("/:id", verifyToken, updateInitiative); // update initiative details by id
router.delete("/:id", verifyToken, deleteInitiative); // delete initiative by id

module.exports = router;