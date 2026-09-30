const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(
    "Unhandled server error:",
    err
  );

  const statusCode =
    res.statusCode &&
    res.statusCode !== 200
      ? res.statusCode
      : 500;

  return res.status(statusCode).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
};

module.exports =
  errorMiddleware;