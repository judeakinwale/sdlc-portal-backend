const router = require("express").Router();
const Response = require("../models/Response");
const {
  createResponse,
  getAllResponses,
  getResponse,
  updateResponse,
  deleteResponse,
  deleteAllResponses,
  populateResponse,
} = require("../controllers/response");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager", "Engineer"), createResponse); // create a response
router.get("/", advancedResults(Response, populateResponse), getAllResponses); // get all responses
router.get("/:id", verifyToken, getResponse); // get response details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager", "Engineer"), updateResponse); // update response details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager", "Engineer"), deleteResponse); // delete response by id
router.delete("/delete/all/responses", verifyToken, authorize("HR", "Admin"), deleteAllResponses); // delete response by id

module.exports = router;
