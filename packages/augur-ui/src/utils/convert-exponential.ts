export default function convertExponentialToDecimal(
  exponentialNumber: string | number,
): string {
  if (!exponentialNumber) return String(exponentialNumber);
  // got from davidjs blog
  // sanity check - is it exponential number
  const str = exponentialNumber && exponentialNumber.toString();
  if (str.indexOf("e") !== -1) {
    const split = str.split("-");
    if (split.length === 0) return str;
    const exponent = parseInt(split[1], 10);
    const result =
      typeof exponentialNumber === "string"
        ? parseFloat(exponentialNumber).toFixed(exponent)
        : exponentialNumber.toFixed(exponent);
    return result;
  }
  return str;
}
