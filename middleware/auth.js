const { verify } = require("jsonwebtoken");
// const jwt = require("jsonwebtoken")
const Staff = require("../models/Staff");
const {ErrorResponseJSON} = require("../utils/errorResponse")

  
exports.verifyToken = async (req, res, next) => {
  try {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return next(new ErrorResponseJSON(res, "You need to be logged in to perform this action.", 401))
    }

    // verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //   if (err) {
    //     return res
    //       .status(403)
    //       .json({ message: "You are not authorized. Token is invalid." });
    //   }
    //   const { staff } = decoded;
    //   req.user = staff._id; //tokenize the user's id
    //   next();      
    // });

    try {
      // Verify token
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const decoded = verify(token, process.env.JWT_SECRET);
      // staff is returned when verifying the token
      req.staff = decoded.staff
      // the same as req.staff
      req.user = await Staff.findById(decoded.staff._id);
  
      next();
    } catch (err) {
      return next(new ErrorResponseJSON(res, " Token is invalid.", 401));
    }
  } catch (err) {
    return next(new ErrorResponseJSON(res, "Not authorized to access this route", 401))
  }
};


// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponseJSON(res, `User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
}
