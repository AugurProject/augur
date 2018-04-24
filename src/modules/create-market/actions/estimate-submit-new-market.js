import logError from 'utils/log-error'
// import noop from 'utils/noop'
import { augur } from 'services/augurjs'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
// import { buildCreateMarket } from 'modules/create-market/helpers/build-create-market'

export const estimateSubmitNewMarket = (newMarket, callback = logError) => (dispatch, getState) => {
  // const { universe, loginAccount, contractAddresses } = getState()
  // const { createMarket, formattedNewMarket } = buildCreateMarket(newMarket, true, universe, loginAccount, contractAddresses)

  let gasPrice
  switch (newMarket.type) {
    case CATEGORICAL:
      gasPrice = augur.constants.CREATE_CATEGORICAL_MARKET_GAS
      break
    case SCALAR:
      gasPrice = augur.constants.CREATE_SCALAR_MARKET_GAS
      break
    case BINARY:
    default:
      gasPrice = augur.constants.CREATE_BINARY_MARKET_GAS
  }

  callback(null, gasPrice)

  /** Punting on this until after MVP
  createMarket({
    ...formattedNewMarket,
    meta: loginAccount.meta,
    onSent: res => noop,
    onSuccess: (gasCost) => {
      callback(null, gasCost)
    },
    onFailed: (err) => {
      callback(err)
    },
  })
   */
}
