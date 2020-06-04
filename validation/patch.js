const isEmpty = require("./is-empty");

module.exports = function validatePatchInput(data) {
  let errors = {};

  if (data.document === undefined) {
    errors.document = "Document is required";
  }

  if (data.patch === undefined) {
    errors.patch = "Patch is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
