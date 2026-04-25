const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const User = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { id: User._id, role: User.role },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    User: {
      id: User._id,
      username: User.username,
      email: User.email,
      role: User.role,
    },
  });
};

const getUser = async (req, res) => {
  const userId = req.user.id;
  const user = await userModel.findById(userId).select("-password");
  res.status(200).json({ User: user });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    message: "User logged in successfully",
    User: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { register, loginUser, logoutUser, getUser };
