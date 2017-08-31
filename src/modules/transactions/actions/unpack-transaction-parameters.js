export default function (tx) {
  const params = tx.data.params
  if (!params) return null
  const inputs = tx.data.inputs
  const numInputs = inputs.length
  const unfixedParams = params.constructor === Array ? params.slice() : [params]
  const unpacked = {}
  for (let i = 0; i < numInputs; ++i) {
    unpacked[inputs[i]] = unfixedParams[i]
  }
  return unpacked
}
