const VALIDATION_TYPE_REQUIRE = "REQUIRE";
const VALIDATION_TYPE_MIN_LENGTH = "MIN_LENGTH";
const VALIDATION_TYPE_MAX_LENGTH = "MAX_LENGTH";
const VALIDATION_TYPE_PASSWORD = "PASSWORD";
const VALIDATION_TYPE_EMAIL = "EMAIL";

export const require = () => ({ type: VALIDATION_TYPE_REQUIRE });
export const minLength = () => ({ type: VALIDATION_TYPE_MIN_LENGTH });
export const maxLength = () => ({ type: VALIDATION_TYPE_MAX_LENGTH });
export const email = () => ({ type: VALIDATION_TYPE_EMAIL });
export const passowrd = () => ({ type: VALIDATION_TYPE_PASSWORD });

export const validate = (value, validators) => {
  let isValid = true;

  for (let validator of validators) {
    if (validator.type === VALIDATION_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length >= 1;
    }

    if (validator.type === VALIDATION_TYPE_MIN_LENGTH) {
      isValid = isValid && value.trim().length >= 5;
    }

    if (validator.type === VALIDATION_TYPE_MAX_LENGTH) {
      isValid = isValid && value.trim().length <= 30;
    }

    if (validator.type === VALIDATION_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }

    if (validator.type === VALIDATION_TYPE_PASSWORD) {
      isValid =
        isValid &&
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(value);
    }
  }

  return isValid;
};
