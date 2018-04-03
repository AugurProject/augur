import logError from 'utils/log-error'
import { BigNumber } from 'bignumber.js'

export const createBigNumber = (...args) => {
  let newBigNumber
  try {
    newBigNumber = new BigNumber(...args)
  } catch (e) {
    logError('Error instantiating WrappedBigNumber', e)
  }

  return newBigNumber
}

// Note this is exported from here.
export { default as BigNumber } from 'bignumber.js'
