const mongoose = require("mongoose");


const Photo = new mongoose.Schema({
  image: {
    type: String,
    default: "user.png",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Photo", Photo);
