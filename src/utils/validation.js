const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("User name is not filled correctly");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid....");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not Strong....");
  }
};

const validateEditProfileData = (req) => {
  const isEditAllowedFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    isEditAllowedFields.includes(field)
  );
  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData
};
