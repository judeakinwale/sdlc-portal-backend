const asyncHandler = require("../middleware/async")
const Staff = require("../models/Staff");
const Photo = require("../models/Photo")
// const Calibration = require("../models/Calibration")
// const cloudinary = require("cloudinary").v2;
// const cloudinarySetup = require("../config/cloudinarysetup");
const fs = require("fs");
const axios = require("axios");
const generateToken = require("../helpers/generateToken");
// const dotenv = require("dotenv").config();
// const { strToBase64 } = require("../utils/generic");
// const open = require("open");
const {ErrorResponseJSON} = require("../utils/errorResponse")
const {updateAllSchema} = require("../utils/updateDetails")


//Register new users and send a token
// @desc    Register new user / login existing user and send token
// @route  GET /api/v1/auth/logout
// @access   Private
exports.postUserDetails = async (req, res, next) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res
      .status(400)
      .json({ success: false, msg: "No access token provided" });
  }
  const config = {
    method: "get",
    url: "https://graph.microsoft.com/v1.0/me",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const photoConfig = {
  method: "get",
  url: "https://graph.microsoft.com/v1.0/me/photo/$value",
  headers: {
  Authorization: `Bearer ${accessToken}`,
  },
  responseType: "arraybuffer",
  };

  const photo = await axios(photoConfig); //get user data from active directory
  const avatar = new Buffer.from(photo.data, "binary").toString("base64");

  try {
    const { data } = await axios(config); //get user data from active directory

    const checkEmail = data.mail.split("@"); //split the email address
    if (
      checkEmail[1] !== "lotusbetaanalytics.com" ||
      !checkEmail.includes("lotusbetaanalytics.com") //check if the email address has lotusbetaanalytics.com domain
    ) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }
    const { mail, displayName } = data;

    const checkStaff = await Staff.findOne({ email: mail }).populate("photo"); //check if there is a staff with the email in the db
    if (checkStaff) {
      if (!checkStaff.photo || checkStaff.photo.image != avatar) {
        const staffPhoto = new Photo({image: avatar});
        await staffPhoto.save()

        checkStaff.photo = staffPhoto.id;
        await checkStaff.save();
      }
      const token = generateToken({ staff: checkStaff }); //generate token
      return res.status(201).cookie("token", token).json({
        success: true,
        token,
      });
    }

    const staffPhoto = new Photo({image: avatar});
    await staffPhoto.save()

    const newStaff = new Staff({ email: mail, fullname: displayName, photo: staffPhoto.id });
    // const newStaff = new Staff({ email: mail, fullname: displayName});
    await newStaff.save(); //add new user to the db

    const token = generateToken({ staff: newStaff }); //generate token
    return res.status(200).cookie("token", token).json({
      success: true,
      msg: "Staff successfuly added",
      token,
      data: newStaff,
    });
  } catch (err) {
    if (err.response.status === 401) {
      return res.status(401).json({ success: false, msg: err.response.data });
    }
    return res.status(500).json({ success: false, msg: err.message });
  }
};


// @desc    Get authenticated user details
// @route  GET /api/v1/auth/logout
// @access   Private
exports.getUser = asyncHandler(async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.user).populate("manager")

    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
});


// @desc    Update authenticated user
// @route  PATCH /api/v1/auth/
// @access   Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true,
    });

    if (!staff) {
      return next(new ErrorResponseJSON(res, "Staff not found", 400))
    }
    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
});


// // @desc    Upload Profile Picture
// // @route  PATCH /api/v1/auth/photo
// // @access   Private
// exports.uploadDp = async (req, res, next) => {
//   try {
//     const { file, user } = req;

//     const imageSizeLimit = 5 * 1024 * 1024; // 5Mb

//     if (!file || file.size <= 0) {
//       return res.status(400).json({
//         success: false,
//         msg: "Avatar field is required",
//       });
//     }

//     if (file.size >= imageSizeLimit) {
//       return res.status(400).json({
//         success: false,
//         msg: `Uploaded image size limit is ${imageSizeLimit / 1024 / 1024}Mb`,
//       });
//     }

//     //check if the file is an image
//     if (!file.mimetype.startsWith("image")) {
//       fs.unlinkSync(file.path); //delete the file from memory if it's not an image

//       return res.status(400).json({
//         success: false,
//         msg: "Uploaded file is not an image",
//       });
//     }

//     // // upload file to cloud storage
//     // await cloudinarySetup();
//     // const uploadedImage = await cloudinary.uploader.upload(file.path, {
//     //   eager: [
//     //     { height: 100, width: 100, crop: "fill" },
//     //     { height: 150, width: 150, crop: "fill" },
//     //   ],
//     // });

//     // if (!uploadedImage) {
//     //   return res.status(500).json({
//     //     success: false,
//     //     msg: "Something went wrong",
//     //   });
//     // }

//     //convert the image to base64
//     const base64Image = strToBase64(uploadedImage.eager[0].url);

//     await Staff.findByIdAndUpdate(
//       user,
//       {
//         photo: base64Image,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     return res.status(200).json({
//       success: true,
//       photo: base64Image,
//     });
//   } catch (err) {
//     return next(new ErrorResponseJSON(res, err.message, 500))
//   }
// };


// @desc    Get Authenticated User's Profile Picture
// @route  GET /api/v1/auth/photo
// @access   Private
exports.getUserDP = async (req, res, next) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res
      .status(400)
      .json({ success: false, msg: "No access token provided" });
  }
  const config = {
    method: "get",
    url: "https://graph.microsoft.com/v1.0/me/photo/$value",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const photoConfig = {
    method: "get",
    url: "https://graph.microsoft.com/v1.0/me/photo/$value",
    headers: {
    Authorization: `Bearer ${accessToken}`,
    },
    responseType: "arraybuffer",
  };

  try {
    const { data } = await axios(config);

    const photo = await axios(photoConfig); //get user data from active directory
    const avatar = new Buffer.from(photo.data, "binary").toString("base64");
    
    const checkStaff = await Staff.findById(req.user).populate("photo");

    if (!checkStaff.photo || checkStaff.photo.image != avatar) {
      const staffPhoto = new Photo({image: avatar});
      await staffPhoto.save()

      checkStaff.photo = staffPhoto.id;
      await checkStaff.save();
    }
    return res.status(200).json({
      success: true,
      photo: avatar,
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
};


// @desc    Upload Documents for Authenticated User
// @route  PATCH /api/v1/auth/documents
// @access   Private
exports.uploadDocuments = async (req, res, next) => {
  try {
    const { files, user } = req;

    if (!files || files.size <= 0) {
      return next(new ErrorResponseJSON(res, "No file was provided", 400))
    }

    const currentUser = await Staff.findByIdAndUpdate(req.user, { files: files }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: currentUser
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
};


// @desc    Get all staff
// @route  GET /api/v1/auth/all
// @access   Private
exports.getAllStaff = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
});


// @desc    Delete user
// @route  DELETE /api/v1/auth/:id
// @access   Private
exports.deleteStaff = asyncHandler(async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return next(new ErrorResponseJSON(res, "Staff not found", 404))
    }
    // const allStaff = await Staff.find().lean().populate("role");

    return res.status(200).json({
      success: true,
      // msg: "Staff deleted",
      // data: allStaff,
      data: {}
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
});


// @desc    Get user photo
// @route  GET /api/v1/auth/photo/:id
// @access   Private
exports.getPhoto = asyncHandler(async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return next(new ErrorResponseJSON(res, "Photo not found", 404))
    }
    return res.status(200).json({
      success: true,
      data: photo,
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
});


// @desc    Log user out / clear cookie
// @route  POST /api/v1/auth/logout
// @access   Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Update database relations
// @route  POST /api/v1/auth/update
// @access   Private
exports.updateRelations = asyncHandler(async (req, res, next) => {
  try {
    await updateAllSchema()
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500))
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
