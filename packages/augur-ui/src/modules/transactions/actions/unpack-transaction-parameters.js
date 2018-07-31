export default function (tx) {
  const { params } = tx.data
  if (!params) return null
  const { inputs = [] } = tx.data
  const numInputs = inputs.length
  const unfixedParams = params.constructor === Array ? params.slice() : [params]
  const unpacked = {}
  unpacked.type = tx.type
  for (let i = 0; i < numInputs; ++i) {
    unpacked[inputs[i]] = unfixedParams[i]
  }
  return unpacked
}
