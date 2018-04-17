import memoize from 'memoizee'
import { createSelectorCreator } from 'reselect'

export const createBigCacheSelector = cacheSize => (
  createSelectorCreator(memoize, { max: cacheSize, async: true })
)
