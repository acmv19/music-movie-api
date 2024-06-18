const Music = require("../models/music");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllMusics = async (req, res) => {
  const musics = await Music.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ musics, count: musics.length });
  //res.send("get all music");
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
  //res.send("get one of the music");
};
const createMusic = async (req, res) => {
  // res.send("create a music");
  //res.json(req.user);
  //res.json(req.body);
  req.body.createdBy = req.user.userId;
  const music = await Music.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Movie created successfully", music });
};
const updateMusic = async (req, res) => {
  const {
    body: { singer, song },
    user: { userId },
    params: { id: musicId },
  } = req;
  if (singer === "" || song === "") {
    throw new BadRequestError("singer or  song fields cannot be empty");
  }
  const music = await Music.findByIdAndUpdate(
    { _id: musicId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!music) {
    throw new NotFoundError(`not music with id  ${musicId}`);
  }
  res.status(StatusCodes.OK).json({ music });
  //res.send("update music");
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
  //res.status(StatusCodes.OK)
  //res.send("delete music");
};

module.exports = {
  getAllMusics,
  getMusic,
  createMusic,
  updateMusic,
  deleteMusic,
};
