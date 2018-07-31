import { augur } from 'services/augurjs'
import { clearCategories, updateCategories } from 'modules/categories/actions/update-categories'
import logError from 'utils/log-error'

const loadCategories = (callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  if (!universe.id) return callback(null)
  augur.markets.getCategories({ universe: universe.id }, (err, categories) => {
    if (err) return callback(err)
    if (categories == null) return callback(null)
    if (Object.keys(categories).length) {
      dispatch(clearCategories())
      dispatch(updateCategories(categories))
    }
    callback(null, categories)
  })
}

export default loadCategories
