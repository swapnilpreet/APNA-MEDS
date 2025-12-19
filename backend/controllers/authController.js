import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utills/generateToken.js";
import { sendEmail } from "../utills/sendEmail.js";
import crypto from "crypto";

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid Email");
  }
  if(!user.isVerified){
    res.status(401);
    throw new Error("Please verify your email before logging in.");
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid Password.");
  }

  res.status(200).json({
    status: true,
    message: "Login successful!",
    token: generateToken(user._id),
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists.");
  }
  const verificationToken=crypto.randomBytes(32).toString("hex");
  const newUser=await User.create({name,email,password,verificationToken,isVerified: false});
  if(!newUser){
    res.status(400);
    throw new Error("Invalid user data provided.");
  }
  const verifyUrl=`${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  const htmlContent=`
    <h2>Welcome,${name}!</h2>
    <p>Click the link below to verify your email and activate your account</p>
    <a href="${verifyUrl}" target="_blank">Verify Email</a>
    <p>If you did not register, please ignore this email.</p>
  `;
  try {
    await sendEmail(email,"Verify your email address", htmlContent);
  } catch (emailError) {
    res.status(500);
    throw new Error("User created, but failed to send verification email.");
  }
   return res.status(201).json({
    status: true,
    message: "Registration successful. Please verify your email before logging in.",
  });
});

const changepassword = asyncHandler(async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  if (!oldPassword || !newPassword){
    res.status(400);
    throw new Error("Please provide both old and new passwords.");
  }
  const user = await User.findById(req.user._id);
  if (user && (await user.matchPassword(oldPassword))){
    user.password = newPassword;
    const updatedUser=await user.save();
    res.status(200).json({
      message:"Password updated successfully!",
      data:{
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  }else if(!user){
    res.status(404);
    throw new Error("User not found.");
  }else{
    res.status(401);
    throw new Error("Invalid old password. Please try again.");
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification token.");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({
    status: true,
    message: "Email verified successfully! You can now log in.",
  });
});

export { loginUser, registerUser, changepassword ,verifyEmail};
