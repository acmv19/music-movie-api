const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong. try again :s",
  };

  if (err.name === "validationError") {
    console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors).map((item) =>
      item.message.join(",")
    );
    customError = 400;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `duplicate value for ${Object.keys(
      err.keyValue
    )} :O... please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.msg = `no item found with id ${err.value}`;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
