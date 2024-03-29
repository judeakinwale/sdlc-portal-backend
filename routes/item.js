const router = require("express").Router();
const Item = require("../models/Item");
const {createItem, getAllItems, getItem, updateItem, deleteItem, populateItem, deleteAllItems} = require("../controllers/item");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, authorize("HR", "Admin", "Manager"), createItem); // create a item
router.get("/", advancedResults(Item, populateItem), getAllItems); // get all items
router.get("/:id", getItem); // get item details by id
router.patch("/:id", verifyToken, authorize("HR", "Admin", "Manager"), updateItem); // update item details by id
router.delete("/:id", verifyToken, authorize("HR", "Admin", "Manager"), deleteItem); // delete item by id
router.delete("/delete/all/items", verifyToken, authorize("HR", "Admin"), deleteAllItems); // delete response by id

module.exports = router;
