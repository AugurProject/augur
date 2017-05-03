import { rpc } from 'services/augurjs';
import { updateBlockchain } from 'modules/app/actions/update-blockchain';

export const syncBlockchain = () => dispatch => dispatch(updateBlockchain({
  currentBlockNumber: rpc.block.number,
  currentBlockTimestamp: parseInt(rpc.block.timestamp, 16),
  currentBlockMillisSinceEpoch: Date.now()
}));
