import { rpc } from '../../../services/augurjs';
import { updateBlockchain } from '../../app/actions/update-blockchain';

export const syncBlockchain = () => dispatch => dispatch(updateBlockchain({
  currentBlockNumber: parseInt(rpc.getCurrentBlock().number, 16),
  currentBlockTimestamp: parseInt(rpc.getCurrentBlock().timestamp, 16),
  currentBlockMillisSinceEpoch: Date.now()
}));
