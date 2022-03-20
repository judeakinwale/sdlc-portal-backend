const { verify } = require("jsonwebtoken");
const Staff = require("../models/Staff");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["access-token"];
    if (!token) {
      return res.status(401).json({
        message: "You need to be logged in to perform this action.",
      });
    }

    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "You are not authorized. Token is invalid." });
      }
      const { staff } = decoded;
      req.user = staff._id; //tokenize the user's id
      next();
    });
  } catch {
    ({ message }) => {
      res.status(500).json({ msg: message });
    };
  }
};

const verifyTokenAdmin = async (req, res, next) => {
  try {
    const token = req.headers["access-token"];
    if (!token) {
      return res.status(401).json({
        message: "You need to be logged in to perform this action.",
      });
    }

    verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "You are not authorized. Token is invalid." });
      }
      const { staff } = decoded;
      const decodedId = staff._id
      
      const findStaff = await Staff.findById(decodedId)

      if (findStaff.role !== "Admin") {
        return res.status(403).json({
          message: "You are not authorized to perform this action.",
        });
      }
      req.user = staff._id; //tokenize the user's id
      next();
    });
  } catch {
    ({ message }) => {
      res.status(500).json({ msg: message });
    };
  }
};

const verifyTokenHR = async (req, res, next) => {
  try {
    const token = req.headers["access-token"];
    if (!token) {
      return res.status(401).json({
        message: "You need to be logged in to perform this action.",
      });
    }

    verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "You are not authorized. Token is invalid." });
      }
      const { staff } = decoded;
      const decodedId = staff._id
      
      const findStaff = await Staff.findById(decodedId)

      if (findStaff.role !== "HR") {
        return res.status(403).json({
          message: "You are not authorized to perform this action.",
        });
      }
      req.user = staff._id; //tokenize the user's id
      next();
    });
  } catch {
    ({ message }) => {
      res.status(500).json({ msg: message });
    };
  }
};

module.exports = { verifyToken, verifyTokenAdmin, verifyTokenHR };
