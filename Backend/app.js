const express = require("express");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ ErrorMessage: error.message || "An unknown error occurred." });
});

mongoose
  .connect('mongodb+srv://admin-andyhu831:Birthda0831@@cluster0.vgqhs.mongodb.net/places?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
