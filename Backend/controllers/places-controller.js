const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require('../models/user');

const getPlacesById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).exec();
  } catch (err) {
    return next(new HttpError("Retrieving place failed", 500));
  }

  if (!place || place.length === 0) {
    return next(new HttpError("No place with provided place ID", 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(new HttpError("Retrieving place failed", 500));
  }

  if (!places || places.length === 0) {
    return next(new HttpError("No place with provided user ID", 404));
  }

  res.json({
    places: places.map(place => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input"), 422);
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "https://picsum.photos/200/300",
    creator
  });

  let user;
  try {
    user = await User.findById(creator, "-password");
  } catch (err) {
    return next(new HttpError("Getting users in creating place failed", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user with provided ID", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session: sess});
    user.places.push(createdPlace);
    await user.save({session: sess});
    sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Creating place failed", 500));
  }

  res.status(201).json(createdPlace);
};

const updatePlace = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input"), 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId).exec();
  } catch (err) {
    return next(new HttpError("Retrieving place failed, could not update places", 500));
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    return next(new HttpError("Updating place failed", 500));
  }
  res.status(200).json({ place: updatedPlace.toObject({getters: true}) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let deletedPlace;
  try {
    deletedPlace = await Place.findById(placeId).populate('creator');
  } catch (err) {
    return next(new HttpError("Retrieving place failed, could not delete places", 500));
  }

  if (!deletedPlace) {
    return next(new HttpError("No place found, could not delete places", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await deletedPlace.remove({session: sess});
    deletedPlace.creator.places.pull(deletedPlace);
    await deletedPlace.creator.save({session: sess});
    sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Deleting place failed", 500));
  }
  res.status(200).json({ message: "Place deleted." });
};

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
