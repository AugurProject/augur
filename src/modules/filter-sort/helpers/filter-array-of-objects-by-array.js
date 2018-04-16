import { compose } from 'redux'
import { isEmpty, lt, identity, intersection, property } from 'lodash/fp'

export const filterArrayByArrayPredicate = (propertyToFilterOn, arrayToFilterBy) => {
  if (isEmpty(propertyToFilterOn) || isEmpty(arrayToFilterBy)) return identity

  return compose(
    lt(0),
    property('length'),
    intersection(arrayToFilterBy),
    property(propertyToFilterOn),
  )
}
