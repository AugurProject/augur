// This is the same signature as a typical node.js style callback.
export default function(err: Error | string | object | null, result?: any): void {
  if (err != null) {
    console.error(err);
    if (result != null) console.log(result);
  }
}
