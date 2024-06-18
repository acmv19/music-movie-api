const express = require("express");
const router = express.Router();

const {
  getAllMusics,
  getMusic,
  createMusic,
  updateMusic,
  deleteMusic,
} = require("../controllers/music");

router.route("/").post(createMusic).get(getAllMusics);
router.route("/:id").get(getMusic).delete(deleteMusic).patch(updateMusic);

module.exports = router;
