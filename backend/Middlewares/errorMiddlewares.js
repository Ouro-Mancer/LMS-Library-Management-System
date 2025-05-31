class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// export const login = (req, res, next)=>{}

export const errorMiddlewares = (err, req, res, next) => {
  // err.message = err.message || 500;
  console.log("ERROR:" , err);


  // Ensure err.message is a valid string
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500; // Default to 500 if undefined

  if (err.code === 11000) {
    const statusCode = 400;
    const message = `Duplicate Field Value Enter`;
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "JsonWebTokenError") {
    const statusCode = 400;
    const message = `Json Web Token is Invalid. Try Again`;
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "TokenExpiredError") {
    const statusCode = 400;
    const message = `Json Web Token is Expired. Try Again`;
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "CastError") {
    const statusCode = 400;
    const message = `Resource Not Found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, statusCode);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join("")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
