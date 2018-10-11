// get the precision of the number, the length to the right of the decimal
export default function getPrecision(value, defaultValue) {
  if (!value) return defaultValue;
  const values = value.toString().split(".");
  if (values.length === 1) return 0; // no decimal
  return values[1].length;
}
