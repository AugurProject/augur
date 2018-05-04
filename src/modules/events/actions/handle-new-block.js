import { syncBlockchain } from 'modules/app/actions/sync-blockchain'
import syncUniverse from 'modules/universe/actions/sync-universe'
import { updateEtherBalance } from 'modules/auth/actions/update-ether-balance'

export const handleNewBlock = block => (dispatch) => {
  dispatch(syncBlockchain())
  dispatch(syncUniverse())
  dispatch(updateEtherBalance())
}
