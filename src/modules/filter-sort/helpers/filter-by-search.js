import parseStringToArray from 'modules/routes/helpers/parse-string-to-array'
import getValue from 'utils/get-value'

// NOTE --  Currently `keys` can accomodate target's of type string and array
// If ANY match is found, the item is included in the returned array
export const filterBySearch = (search, keys) => (items) => {
  if (search == null || search === '') return null

  const searchArray = parseStringToArray(decodeURIComponent(search))

  const checkStringMatch = (value, search) => value.toLowerCase().indexOf(search.toLowerCase()) !== -1

  const checkArrayMatch = (item, keys, search) => { // Accomodates n-1 key's value of either array or object && final key's value of type string or array
    let parentValue = getValue(item, keys.reduce((p, key, i) => i + 1 !== keys.length ? `${p}${i !== 0 ? '.' : ''}${key}` : p, '')) // eslint-disable-line no-confusing-arrow
    if (!parentValue && keys.length === 1) parentValue = getValue(item, keys[0])

    if (parentValue === null) return false

    if (Array.isArray(parentValue) && parentValue.length && keys.length !== 1) {
      return parentValue.some(value => (value[keys[keys.length - 1]] || '').toLowerCase().indexOf(search) !== -1)
    } else if (Array.isArray(parentValue) && parentValue.length && keys.length === 1) {
      return parentValue.some(value => (value || '').toLowerCase().indexOf(search) !== -1)
    } else if (typeof parentValue === 'object' && Object.keys(parentValue).length) {
      return (parentValue[keys[keys.length - 1]] || '').toLowerCase().indexOf(search) !== -1
    }

    return false
  }

  const matchedItems = items.reduce((p, item, i) => {
    const matchedSearch = searchArray.some(search =>
      keys.some((key) => {
        if (typeof key === 'string') return checkStringMatch((item[key] || ''), search)

        return checkArrayMatch(item, key, search)
      }))

    if (matchedSearch) {
      return [...p, items[i].id]
    }

    return p
  }, [])

  return matchedItems
}
