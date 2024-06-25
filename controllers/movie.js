const Movie = require("../models/movie");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllMovies = async (req, res) => {
  const movies = await Movie.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ movies, count: movies.length });
};
const getMovie = async (req, res) => {
  const {
    user: { userId },
    params: { id: movieId },
  } = req;

  const movie = await Movie.findOne({
    _id: movieId,
    createdBy: userId,
  });
  if (!movie) {
    throw new NotFoundError(`no movie with the id ${movieId}`);
  }
  res.status(StatusCodes.OK).json({ movie });
};
const createMovie = async (req, res) => {
  req.body.createdBy = req.user.userId;
  if (req.body.ranking && (req.body.ranking < 1 || req.body.ranking > 5)) {
    throw new BadRequestError("Ranking must be between 1 and 5");
  }
  const movie = await Movie.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Movie created successfully", movie });
};
const updateMovie = async (req, res) => {
  const {
    body: { director, title, ranking },
    user: { userId },
    params: { id: movieId },
  } = req;
  if (director === "" || title === "") {
    throw new BadRequestError(
      "director or  title movie fields cannot be empty"
    );
  }
  const movie = await Movie.findByIdAndUpdate(
    { _id: movieId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!movie) {
    throw new NotFoundError(`not movie with id  ${movieId}`);
  }
  if (ranking !== undefined && (ranking < 1 || ranking > 5)) {
    throw new BadRequestError("Ranking must be between 1 and 5");
  }
  res.status(StatusCodes.OK).json({ movie });
};
const deleteMovie = async (req, res) => {
  const {
    user: { userId },
    params: { id: movieId },
  } = req;
  const movie = await Movie.findByIdAndDelete({
    _id: movieId,
    createdBy: userId,
  });
  if (!movie) {
    throw new NotFoundError(`not movie with id  ${movieId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Movie deleted successfully" });
};

module.exports = {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};
