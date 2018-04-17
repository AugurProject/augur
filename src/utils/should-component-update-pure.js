export default function (nextProps, nextState) {
  return isShallowUnEqual(nextProps, this.props) || isShallowUnEqual(nextState, this.state)
}

export function shouldComponentUpdateLog(nextProps, nextState) {
  return isShallowUnEqual(nextProps, this.props, true) || isShallowUnEqual(nextState, this.state, true)
}

export function shouldComponentUpdateOnStateChangeOnly(nextProps, nextState) {
  return isShallowUnEqual(nextState, this.state)
}

function isShallowUnEqual(obj1, obj2, log) {
  // both arguments reference the same object
  if (obj1 === obj2) {
    return false
  }

  // arguments are either not objects or undefined/null
  if (typeof obj1 !== 'object' || obj1 == null || typeof obj2 !== 'object' || obj2 == null) {
    return true
  }

  const keysA = Object.keys(obj1)
  const keysB = Object.keys(obj2)
  const keysALen = keysA.length

  // keys don't match
  if (keysALen !== keysB.length) {
    return true
  }

  for (let i = 0; i < keysALen; i++) {
    // actual values are different + not functions
    if (obj1[keysA[i]] !== obj2[keysA[i]] && typeof obj1[keysA[i]] !== 'function') {
      log && console.log('------->', keysA[i], obj1[keysA[i]], obj2[keysA[i]])
      return true
    }
  }

  // nothing needs to be updated
  return false
}
