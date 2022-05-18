const users = require("../models/userModel");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { catchAsync } = require("../errorHandling");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const { checkJWTCookie, getJWTUser } = require("./cookieController");
const { sendEmailVerification } = require("./emailController");
const saltRounds = 10;
exports.newPicture = [];

const getUsableUserPictureHandler = (user) => {
  if (user.profilePicture) {
    user.profilePicture = `${process.env.BACKEND_URL}/${process.env.PROFILE_PICTURE_URL}/${user.profilePicture}`;
  }
  return user;
};

const getUsableUserPicture = (userList) => {
  let finalUser;
  if (userList === null) {
    return [];
  }
  if (!userList.length) {
    finalUser = getUsableUserPictureHandler(userList);
  } else {
    finalUser = userList.map((user) => getUsableUserPictureHandler(user));
  }
  return finalUser;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  if (checkJWTCookie(req, res)) {
    const userValid = getJWTUser(req, res);
    if (userValid.length > 0) {
      if (userValid[1] === 1) {
        const userList = await users.find();
        const finalUser = getUsableUserPicture(userList);
        res.status(200).json({
          error: "success",
          data: finalUser,
        });
      } else {
        res.status(400).json({
          error: "You are not authorized",
        });
      }
    } else {
      res.status(400).json({
        error: "You are not authorized",
      });
    }
  } else {
    res.status(400).json({
      error: "You are not authorized",
    });
  }
}, "An error occured while getting users");

exports.getUser = catchAsync(async (req, res, next) => {
  const userID = req.params.id;
  if (checkJWTCookie(req, res)) {
    const user = await users
      .findById(userID, "userRole userName userEmail balance profilePicture")
      .exec();
    user.profilePicture = `${process.env.BACKEND_URL}/${process.env.PROFILE_PICTURE_URL}/${user.profilePicture}`;

    res.status(200).json({
      error: "success",
      data: user,
    });
  } else {
    res.status(400).json({
      error: "You are not authorized",
    });
  }
}, "An Error Occured when getting user");

const checkSameEmail = async (email) => {
  try {
    const user = await users.findOne({ userEmail: email });
    if (user === null) {
      return 0;
    } else {
      return -1;
    }
  } catch (e) {
    return undefined;
  }
};
const validateCreateUserData = (data) => {
  let isValid = true;
  const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!data.userName || data.userName.length < 6) {
    isValid = false;
  }
  if (!data.userEmail || validEmail.test(data.userEmail) === false) {
    isValid = false;
  }
  if (!data.password || data.password.length < 6) {
    isValid = false;
  }
  return isValid;
};

exports.createUser = catchAsync(async (req, res, next) => {
  let isValid = validateCreateUserData(req.body);
  if (isValid) {
    let userValid = await checkSameEmail(req.body.useremail);
    if (userValid !== undefined && userValid === 0) {
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      } catch (e) {
        res.status(400).json({
          error: "Something went wrong!",
        });
      }
      const token = jwt.sign(
        {
          userName: req.body.userName,
          userEmail: req.body.userEmail,
        },
        process.env.JWT_SECRET
      );
      const user = await users.create({
        userRole: 0,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        password: hashedPassword,
        balance: 0,
        profilePicture: process.env.DEFAULT_PROFILE_PICTURE,
        confirmationCode: token,
      });
      sendEmailVerification({
        email: req.body.userEmail,
        confirmationCode: token,
      });
      res.status(200).json({
        error: "success",
      });
    } else {
      res.status(400).json({
        error: "Failed to create user",
      });
    }
  } else {
    res.status(400).json({
      error: "Failed to create user",
    });
  }
}, "Error when creating user");
const deletePicture = (oldPicture) => {
  fs.unlink(`${process.env.PROFILE_PICTURE_URL}/${oldPicture}`, (err) => {
    if (err) {
      console.log(`failed to delete ${oldPicture}`);
    }
  });
};

exports.changeProfilePic = catchAsync(async (req, res, next) => {
  const user = await users.findById(req.params.id);
  if (user.profilePicture === process.env.DEFAULT_PROFILE_PICTURE) {
    await users.findByIdAndUpdate(req.params.id, {
      profilePicture: this.newPicture[0].location,
    });
  } else {
    await users.findByIdAndUpdate(req.params.id, {
      profilePicture: this.newPicture[0].location,
    });
    deletePicture(user.profilePicture);
  }
  setTimeout(() => {
    this.newPicture.splice(0, this.newPicture.length);
  }, 2500);
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await users.findById(req.params.id, "profilePicture");
  if (user.profilePicture !== process.env.DEFAULT_PROFILE_PICTURE) {
    deletePicture(user.profilePicture);
  }
  await users.deleteOne({ _id: req.params.id });
  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.changeUserName = catchAsync(async (req, res, next) => {
  await users.findByIdAndUpdate(req.body.body.id, {
    userName: req.body.body.newName,
  });

  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.changeUserPassword = catchAsync(async (req, res, next) => {
  const user = await users.findById(req.body.body.id);
  const isValid = await bcrypt.compare(
    req.body.body.oldPassword,
    user.password
  );

  if (isValid) {
    let hashedPassword = await bcrypt.hash(
      req.body.body.newPassword,
      saltRounds
    );
    await users.findByIdAndUpdate(req.body.body.id, {
      password: hashedPassword,
    });
    res.status(200).json({
      error: "success",
    });
  } else {
    res.status(400).json({
      error: "Invalid",
    });
  }
}, "Something went wrong");

exports.changeUserEmail = catchAsync(async (req, res, next) => {
  await users.findByIdAndUpdate(req.body.body.id, {
    userEmail: req.body.body.newEmail,
  });

  res.status(200).json({
    error: "success",
  });
}, "Something went wrong");

exports.activeUser = catchAsync(async (req, res, next) => {
  if (req.params.id !== "-1") {
    const user = await users.find({
      confirmationCode: req.params.id,
    });
    if (user.length > 0) {
      await users.updateOne(
        { confirmationCode: req.params.id },
        { accountStatus: "Active", confirmationCode: "-1" }
      );
      res.status(200).json({
        error: "Success",
      });
    } else {
      res.status(400).json({
        error: "Invalid ID",
      });
    }
  } else {
    res.status(400).json({
      error: "Invalid ID",
    });
  }
}, "Something went wrong");

exports.verifyAccount = catchAsync(async (req, res, next) => {
  const user = await users.findOneAndUpdate(
    { confirmationCode: req.params.code },
    { confirmationCode: "-1", accountStatus: "Active" }
  );
  if (user) {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/404`);
  }
});

exports.checkUserSessionExpired = catchAsync(async (req, res, next) => {
  if (checkJWTCookie(req, res)) {
    res.status(200).json({
      error: "Success",
    });
  } else {
    res.status(400).json({
      error: "error",
    });
  }
});
