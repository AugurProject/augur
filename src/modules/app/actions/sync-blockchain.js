import { augur } from 'services/augurjs'
import { updateBlockchain } from 'modules/app/actions/update-blockchain'

export const syncBlockchain = () => (dispatch) => {
  augur.api.Controller.getTimestamp((err, augurTimestamp) => {
    if (err) console.error(err)
    dispatch(updateBlockchain({
      currentBlockNumber: parseInt(augur.rpc.getCurrentBlock().number, 16),
      currentBlockTimestamp: parseInt(augur.rpc.getCurrentBlock().timestamp, 16),
      currentAugurTimestamp: parseInt(augurTimestamp, 10),
    }))
  })
}
