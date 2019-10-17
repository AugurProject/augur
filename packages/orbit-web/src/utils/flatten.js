'use strict'

export function flatten (arr) {
  return arr.reduce((acc, val) => acc.concat(val), [])
}

export function flattenDeep (arr) {
  return arr.reduce(
    (acc, val) => (val instanceof Array ? acc.concat(flattenDeep(val)) : acc.concat(val)),
    []
  )
}
