const Music = require("../models/music");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllMusics = async (req, res) => {
  const musics = await Music.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ musics, count: musics.length });
};

const getMusic = async (req, res) => {
  const {
    user: { userId },
    params: { id: musicId },
  } = req;

  const music = await Music.findOne({
    _id: musicId,
    createdBy: userId,
  });
  if (!music) {
    throw new NotFoundError(`no music with the id ${musicId}`);
  }
  res.status(StatusCodes.OK).json({ music });
};

const createMusic = async (req, res) => {
  req.body.createdBy = req.user.userId;
  if (req.body.ranking && (req.body.ranking < 1 || req.body.ranking > 5)) {
    throw new BadRequestError("Ranking must be between 1 and 5");
  }
  const music = await Music.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Music created successfully", music });
};
const updateMusic = async (req, res) => {
  const {
    body: { singer, song, ranking },
    user: { userId },
    params: { id: musicId },
  } = req;
  if (singer === "" || song === "") {
    throw new BadRequestError("singer or song fields cannot be empty");
  }
  const music = await Music.findByIdAndUpdate(
    { _id: musicId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!music) {
    throw new NotFoundError(`not music with id  ${musicId}`);
  }
  if (ranking !== undefined && (ranking < 1 || ranking > 5)) {
    throw new BadRequestError("Ranking must be between 1 and 5");
  }
  res.status(StatusCodes.OK).json({ music });
};

const deleteMusic = async (req, res) => {
  const {
    user: { userId },
    params: { id: musicId },
  } = req;
  const music = await Music.findByIdAndDelete({
    _id: musicId,
    createdBy: userId,
  });
  if (!music) {
    throw new NotFoundError(`not music with id  ${musicId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Music deleted successfully" });
};

module.exports = {
  getAllMusics,
  getMusic,
  createMusic,
  updateMusic,
  deleteMusic,
};
