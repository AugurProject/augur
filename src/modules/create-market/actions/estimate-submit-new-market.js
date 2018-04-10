import logError from 'utils/log-error'
import noop from 'utils/noop'
import { augur } from 'services/augurjs'
import { buildCreateMarket } from 'modules/create-market/helpers/build-create-market'

export const estimateSubmitNewMarket = (newMarket, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount, contractAddresses } = getState()
  const { createMarket, formattedNewMarket } = buildCreateMarket(newMarket, true, universe, loginAccount, contractAddresses)
  console.log(formattedNewMarket)
  console.log(createMarket.toString())
  augur.rpc.setDebugOptions({ broadcast: true, tx: true })
  createMarket({
    ...formattedNewMarket,
    meta: loginAccount.meta,
    onSent: res => noop,
    onSuccess: (gasCost) => {
      augur.rpc.setDebugOptions({ broadcast: false, tx: false })
      callback(null, gasCost)
    },
    onFailed: (err) => {
      augur.rpc.setDebugOptions({ broadcast: false, tx: false })
      callback(err)
    },
  })
}
