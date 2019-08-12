import {
  INVALID_OUTCOME
} from "modules/create-market/constants";
import isAddress from "modules/auth/helpers/is-address";
import { createBigNumber } from "utils/create-big-number";
import { ZERO } from "./constants";

export function isFilledString(value, readable, message) {
  if (value && value.trim().length > 0 && value !== "") return "";
  return message ? message : readable + " is required";
}

export function isMaxLength(value, maxLength) {
  return maxLength && value.length > maxLength;
}

export function isFilledNumber(value, readable, message) {
  if (value !== null && value !== "" && value !== "-") return "";
  return message ? message : readable + " is required";
}

export function isBetween(value, readable, min, max) {
  if (createBigNumber(value).gt(createBigNumber(max))) {
    return readable + " must be less than " + max;
  } else if (createBigNumber(value).lt(createBigNumber(min))) {
    return readable + " must be more than " + min;
  }
  return "";
}

export function isLessThan(value, readable, target, message) {
  if (target !== null && createBigNumber(value).gte(createBigNumber(target))) {
    return message ? message : 'Must be less than ' + target;
  }
  return "";
}

export function dividedBy(value, readable, min, max) {
  const range = createBigNumber(max).minus(createBigNumber(min));
  if (range.mod(value).eq(ZERO)) {
    return "";
  }
  return `Price range needs to be divisible by ${readable.toLowerCase()}`;
}

export function isMoreThan(value, readable, target) {
  if (target !== null && createBigNumber(value).lte(createBigNumber(target))) {
    return 'Max can\'t be lower than min';
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

export function moreThanDecimals(value, decimals) {
  if (Math.floor(value) === value) return "";

  const decimalsValue = value.toString().includes(".") ? value.toString().split(".")[1].length : 0;
  if (decimalsValue > decimals) return "Can't enter more than " + decimals + " decimal points";
  return "";
}

export function checkAddress(value) {
  if (!isAddress(value)) return "Enter a valid address";
  return "";
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
    if (errors.filter(error => error !== "").length > 0) return errors;
    return "";
  }
}

export function isPositive(value) {
  if (value && value < 0) return "Can't enter negative number";
  return "";
}
