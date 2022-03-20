const { sign } = require("jsonwebtoken");

const generateToken = (staff) => {
  return sign(staff, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = generateToken;
