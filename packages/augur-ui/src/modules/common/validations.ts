import { 
  INVALID_OUTCOME
} from "modules/create-market/constants";

export function isFilledString(value, readable, message) {
  if (value.trim().length > 0 && value !== "") return "";
  return message ? message : readable + " is required";
}

export function isMaxLength(value, maxLength) {
  return maxLength && value.length > maxLength;
}

export function isFilledNumber(value, readable, message) {
  if (value && value !== "") return "";
  return message ? message : readable + " is required";
}

export function isBetween(value, readable, min, max) {
  if (value > max) {
    return readable + " must be less than " + max;
  } else if (value < min) {
    return readable + " must be more than " + min;
  }
  return "";
}

export function checkCategoriesArray(value) {
  let errors = ["", "", ""];
  if (value[0] === "") {
    errors[0] = "Enter a category";
  }
  if (value[1] === "") {
    errors[1] = "Enter a sub-category";
  }

  if (errors[0] !== "" || errors[1] !== "") {
    return errors;
  } else {
    return "";
  }
}

export function checkOutcomesArray(value) {
  const validOutcomes = value.filter(outcome => outcome && outcome !== "");
  if (validOutcomes.length < 2) {
    if (!validOutcomes.length) {
      return ["Enter an outcome", "Enter an outcome"];
    } else if (validOutcomes.length === 1 && (!value[0] || value[0] === "")) {
      return ["Enter an outcome"];
    } else {
      return ["", "Enter an outcome"];
    }
  } else {
    const errors = Array(value.length).fill("");
    const invalid = value.findIndex(outcome => outcome.toLowerCase() === INVALID_OUTCOME.toLowerCase());
    if (invalid !== -1) errors[invalid] = ["Can't enter \"Market is Invalid\" as an outcome"];

    let dupes = {};
    value.forEach((outcome,index) => {
      dupes[outcome] = dupes[outcome] || [];
      dupes[outcome].push(index);
    });  
    Object.keys(dupes).map(key => {
      if (dupes[key].length > 1) {
        errors[dupes[key][dupes[key].length - 1]] = "Can't enter a duplicate outcome";
      }
    })
    if (errors.filter(error => error !== "").length > 1) return errors;
    return "";
  }
}
