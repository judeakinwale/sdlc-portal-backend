const router = require('express').Router()
const Item = require("../models/Item")
const {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem
} = require("../controllers/item")
const { verifyToken } = require("../middleware/auth");
const advancedResults = require('../middleware/advancedResults');

router.post("/", verifyToken, createItem); // create a item
router.get("/", advancedResults(Item), getAllItems); // get all items
router.get("/:id", verifyToken, getItem); // get item details by id
router.patch("/:id", verifyToken, updateItem); // update item details by id
router.delete("/:id", verifyToken, deleteItem); // delete item by id

module.exports = router;