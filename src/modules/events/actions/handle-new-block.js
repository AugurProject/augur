import { syncBlockchain } from 'modules/app/actions/sync-blockchain'
import syncUniverse from 'modules/universe/actions/sync-universe'
import { updateAssets } from 'modules/auth/actions/update-assets'

export const handleNewBlock = block => (dispatch) => {
  dispatch(syncBlockchain())
  dispatch(syncUniverse())
  dispatch(updateAssets())
}
