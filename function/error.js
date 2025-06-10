function errorStatus(message, status) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function errorReturn(res, error) {
  if (!error.statusCode) {
    console.error(error);
    error.statusCode = 500;
    error.message = "sever error";
  }
  return res.render("errorPage", { error });
}

export default {
  errorStatus,
  errorReturn,
};
