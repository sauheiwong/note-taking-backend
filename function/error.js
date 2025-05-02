function errorStatus(message, status) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function errorReturn(res, error) {
  if (!error.statusCode) {
    console.error(error);
    error.statusCode = 500;
    return res.status(error.statusCode).json({ error: "sever error" });
  }
  return res.status(error.statusCode).json({ error: error.message });
}

export default {
  errorStatus,
  errorReturn,
};
