const router = require("express").Router();
const {getInitiativesByStatus, allInitiativesByStatus, allInitiativesByType, updateSchema} = require("../controllers/log");
const {verifyToken, authorize} = require("../middleware/auth");


router.get("/initiative/status/me", verifyToken, getInitiativesByStatus); // get initiatives by status for authenticated user
router.get("/initiative/status", allInitiativesByStatus); // get initiatives by status
router.get("/initiative/type", allInitiativesByType); // get initiatives by type
router.get("/update", updateSchema); // get initiatives by type

module.exports = router;
