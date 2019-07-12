export function isFilledString(value) {
  return value === "string" && !value.trim().length;
}

export function isMaxLength(value, maxLength) {
  return maxLength && value.length > maxLength;
}

export function isFilledNumber(value, readable) {
  if (value !== "") return "";
  return readable + " is required";
}

export function isBetween(value, readable, min, max) {
  if (value > max) {
    return readable + " must be less than " + max;
  } else if (value < min) {
    return readable + " must be more than " + min;
  }
  
  return "";
}
