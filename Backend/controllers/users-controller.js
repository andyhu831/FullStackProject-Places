const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Getting users failed", 500));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Please enter an username", 401));
  }
  const { name, username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    return next(new HttpError("Signing up failed", 500));
  }

  if (existingUser) {
    return next(new HttpError("User exists", 422));
  }
  const createdUser = new User({
    name,
    username,
    password,
    image: "https://picsum.photos/200/300",
    places: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Signup failed", 500));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ username: username });
  } catch (err) {
    return next(new HttpError("Login failed", 500));
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Invalid credentials", 401));
  }

  res.json({
    message: "Logged in",
    user: identifiedUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
