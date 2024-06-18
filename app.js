require("dotenv").config();
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

//connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
//router
const authRouter = require("./routes/auth");
const MusicRouter = require("./routes/music");
const MovieRouter = require("./routes/movie");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 min
    max: 100, // limit each IP to 100 request per window
  })
);
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());
//app.use(rateLimiter())

/*app.get("/", (req, res) => {
  res.send("music api");
});*/
app.use(express.static("public"));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/music", authenticateUser, MusicRouter);
app.use("/api/v1/movie", authenticateUser, MovieRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
