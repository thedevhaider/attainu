const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateThumbnailInput(data) {
  let errors = {};

  data.url = !isEmpty(data.url) ? data.url : "";

  if (Validator.isEmpty(data.url)) {
    errors.url = "Image url is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
