import { isEmpty } from "lodash";

// Checks if passed in value is populated
// @params {Any} value - passed in value
// @returns boolean - returns true if value is populated, otherwise, returns false
export default function isPopulated(value) {
  if (typeof value === "boolean") return value;
  return value !== "" && !isEmpty(value);
}
