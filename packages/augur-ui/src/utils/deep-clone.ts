export default function<T>(value: Object): T {
  return JSON.parse(JSON.stringify(value));
}
