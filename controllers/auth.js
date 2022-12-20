/* eslint-disable no-unused-vars */
const asyncHandler = require("../middleware/async")
const Staff = require("../models/Staff");
const Photo = require("../models/Photo")
const fs = require("fs");
const axios = require("axios");
const generateToken = require("../helpers/generateToken");
const {ErrorResponseJSON, SuccessResponseJSON} = require("../utils/errorResponse")


// @desc    Register new user / login existing user and send token
// @route  GET /api/v1/auth/logout
// @access   Private
exports.postUserDetails = asyncHandler(async (req, res, next) => {
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

  // try {
  //   const photo = await axios(photoConfig); //get user data from active directory
  //   const avatar = new Buffer.from(photo.data, "binary").toString("base64");
  // } catch (err) {
  //   return res.status(401).json({ success: false, msg: "Invalid login details, try again later" });
  // }

  try {
    let photo = undefined
    let avatar = undefined
    try {
      photo = await axios(photoConfig); //get user data from active directory
      avatar = new Buffer.from(photo.data, "binary").toString("base64");
    } catch (err) {
      console.log(err.message)
    }
    console.log(1)

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
      if (avatar && !checkStaff.photo || checkStaff.photo.image != avatar) {
        const staffPhoto = new Photo({image: avatar});
        await staffPhoto.save()

        checkStaff.photo = staffPhoto.id;
        await checkStaff.save();
      }
      console.log(2)
      const token = generateToken({ staff: checkStaff }); //generate token
      return res.status(201).cookie("token", token).json({
        success: true,
        token,
        role: checkStaff.role,
        _id: checkStaff._id,
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
      role: newStaff.role,
      _id: newStaff._id,
      // data: newStaff,
    });
  } catch (err) {
    // console.log('err response:', err.response.data)
    if (err.response.status === 401) {
      // return res.status(401).json({ success: false, msg: err.response.data });
      return res.status(401).json({ success: false, msg: "Invalid authentication details, try again later." });
    }
    return res.status(500).json({ success: false, msg: err.message });
  }
});


// @desc    Get authenticated user details
// @route  GET /api/v1/auth/
// @access   Private
exports.getUser = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findById(req.user._id).populate("manager")
    return new SuccessResponseJSON(res, staff)
});


// @desc    Update authenticated user
// @route  PATCH /api/v1/auth/
// @access   Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) {
      return new ErrorResponseJSON(res, "Staff not found", 400)
    }
  await staff.save()
  return new SuccessResponseJSON(res, staff)
});


// @desc    Get Authenticated User's Profile Picture (using access token)
// @route  POST /api/v1/auth/photo
// @access   Private
exports.getUserDP = asyncHandler(async (req, res, next) => {
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
    
    const checkStaff = await Staff.findById(req.user._id).populate("photo");

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
    return new ErrorResponseJSON(res, err.message, 500)
  }
});


// @desc    Upload Documents for Authenticated User
// @route  PATCH /api/v1/auth/documents
// @access   Private
exports.uploadDocuments = asyncHandler(async (req, res, next) => {
    const { files, user } = req;

    if (!files || files.size <= 0) {
      return new ErrorResponseJSON(res, "No file was provided", 400)
    }

    const staff = await Staff.findByIdAndUpdate(req.user._id, { files: files }, {
      new: true,
      runValidators: true
    });
    if (!staff) {
      return new ErrorResponseJSON(res, "Staff not found!", 404)
    }
    return new SuccessResponseJSON(res, staff)
});


// @desc    Get all staff
// @route  GET /api/v1/auth/all
// @access   Private
exports.getAllStaff = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults)
});


// @desc    Get user
// @route  GET /api/v1/auth/:id
// @access   Private
exports.getStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not found!", 404)
  }
  return new SuccessResponseJSON(res, staff)
});


// @desc    Update user
// @route  PATCH /api/v1/auth/:id
// @access   Private
exports.updateStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not updated!", 404)
  }
  return new SuccessResponseJSON(res, staff)
});


// @desc    Delete user
// @route  DELETE /api/v1/auth/:id
// @access   Private
exports.deleteStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);
  if (!staff) {
    return new ErrorResponseJSON(res, "Staff not found!", 404)
  }
  return new SuccessResponseJSON(res)
});


// @desc    Get user photo
// @route  GET /api/v1/auth/photo/:id
// @access   Private
exports.getPhoto = asyncHandler(async (req, res, next) => {
  const photo = await Photo.findById(req.params.id);
  if (!photo) {
    return new ErrorResponseJSON(res, "Photo not found", 404)
  }
  return new SuccessResponseJSON(res, photo)
});


// @desc    Log user out / clear cookie
// @route  POST /api/v1/auth/logout
// @access   Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return new SuccessResponseJSON(res)
});


// Depreciated
// @desc    Update database relations
// @route  POST /api/v1/auth/update
// @access   Private
exports.updateRelations = asyncHandler(async (req, res, next) => {
  // await updateAllSchema()
  return new SuccessResponseJSON(res)
});
