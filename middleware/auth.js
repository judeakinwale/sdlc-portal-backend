const { verify } = require("jsonwebtoken");
const Staff = require("../models/Staff");
const {ErrorResponseJSON} = require("../utils/errorResponse")


exports.verifyToken = async (req, res, next) => {
  try {
    console.log(req.headers.authorization.split(" ")[0] == "Bearer")
    console.log(req.headers.authorization.startsWith("Bearer"))
    // const token = req.headers["access-token"];
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
      // req.headers.authorization.split(" ")[0] == "Bearer"
    ) {
      console.log("has auth header")
      token = req.headers.authorization.split(" ")[1]
      console.log(token)
    } else if (req.cookies.token) {
      console.log("token found in cookies")
      token = req.cookies.token
    }

    // console.log("code continued")
    if (!token) {
      return next(new ErrorResponseJSON(res, "You need to be logged in to perform this action.", 401))
      // return res.status(401).json({
      //   message: "You need to be logged in to perform this action.",
      // });
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
      // console.log("Token found")
      // console.log("decoded token: \n")
      const decoded = verify(token, process.env.JWT_SECRET);
      // console.log(decoded.staff)
      req.staff = decoded.staff
      // console.log("Request staff: " + req.staff.fullname)
      req.user = await Staff.findById(decoded.staff._id);
      // console.log("Request user: " + req.user)
  
      next();
    } catch (err) {
      return next(new ErrorResponseJSON(res, " Token is invalid.", 401));
    }

  } catch (err) {
    console.log("Verification code broke with error: " + err)
    return next(new ErrorResponseJSON(res, "Not authorized to access this route", 401))
    // ({ message }) => {
    //   res.status(500).json({ msg: message });
    // };
  }
};

// Grant access to specific roles
// exports.authorize = (...roles) => {
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


// const verifyTokenAdmin = async (req, res, next) => {
//   try {
//     // const token = req.headers["access-token"];
//     // let token
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startswith("Bearer")
//     ) {
//       const token = req.headers.authorization.split(" ")[1]
//     } else if (req.cookies.token) {
//       const token = req.cookies.token
//     }

//     if (!token) {
//       return res.status(401).json({
//         message: "You need to be logged in to perform this action.",
//       });
//     }

//     verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//       if (err) {
//         return res
//           .status(403)
//           .json({ message: "You are not authorized. Token is invalid." });
//       }
//       const { staff } = decoded;
//       const decodedId = staff._id
      
//       const findStaff = await Staff.findById(decodedId)

//       if (findStaff.role !== "Admin") {
//         return res.status(403).json({
//           message: "You are not authorized to perform this action.",
//         });
//       }
//       req.user = staff._id; //tokenize the user's id
//       next();
//     });
//   } catch {
//     ({ message }) => {
//       res.status(500).json({ msg: message });
//     };
//   }
// };

// const verifyTokenHR = async (req, res, next) => {
//   try {
//     // const token = req.headers["access-token"];
//     // let token
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startswith("Bearer")
//     ) {
//       const token = req.headers.authorization.split(" ")[1]
//     } else if (req.cookies.token) {
//       const token = req.cookies.token
//     }
//     console.log("started")
//     if (!token) {
//       return res.status(401).json({
//         message: "You need to be logged in to perform this action.",
//       });
//     }

//     verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//       if (err) {
//         return res
//           .status(403)
//           .json({ message: "You are not authorized. Token is invalid." });
//       }
//       const { staff } = decoded;
//       const decodedId = staff._id
      
//       const findStaff = await Staff.findById(decodedId)

//       if (findStaff.role !== "HR") {
//         return res.status(403).json({
//           message: "You are not authorized to perform this action.",
//         });
//       }
//       req.user = staff._id; //tokenize the user's id
//       next();
//     });
//   } catch {
//     ({ message }) => {
//       res.status(500).json({ msg: message });
//     };
//   }
// };

// module.exports = { 
//   // verifyToken, 
//   verifyTokenAdmin, 
//   verifyTokenHR 
// };
