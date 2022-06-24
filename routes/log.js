const router = require("express").Router();
const {getInitiativesByStatus, allInitiativesByStatus, allInitiativesByType} = require("../controllers/log");
const {verifyToken, authorize} = require("../middleware/auth");


router.get("/initiative/status/me", verifyToken, getInitiativesByStatus); // get initiatives by status for authenticated user
router.get("/initiative/status/", allInitiativesByStatus); // get initiatives by status
router.get("/initiative/type/", allInitiativesByType); // get initiatives by type

// router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createType); // create a type
// router.get("/", advancedResults(Type), getAllTypes); // get all types
// router.get("/:id", verifyToken, getType); // get type details by id
// router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updateType); // update type details by id
// router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deleteType); // delete type by id

module.exports = router;
