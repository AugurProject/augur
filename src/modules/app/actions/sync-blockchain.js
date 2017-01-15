import { rpc } from '../../../services/augurjs';
import { updateBlockchain } from '../../app/actions/update-blockchain';

export const syncFromBlockchain = () => dispatch => rpc.blockNumber((blockNumber) => {
  if (!blockNumber || blockNumber.error) {
    return console.error('rpc.blockNumber:', blockNumber);
  }
  dispatch(updateBlockchain({ currentBlockNumber: parseInt(blockNumber, 16) }));
  rpc.getBlock(blockNumber, false, (block) => {
    if (!block || block.error) {
      return console.error('rpc.getBlock:', block);
    }
    dispatch(updateBlockchain({
      currentBlockTimestamp: parseInt(block.timestamp, 16),
      currentBlockMillisSinceEpoch: Date.now()
    }));
  });
});

export const syncFromRPC = () => dispatch => dispatch(updateBlockchain({
  currentBlockNumber: rpc.block.number,
  currentBlockTimestamp: parseInt(rpc.block.timestamp, 16),
  currentBlockMillisSinceEpoch: Date.now()
}));

export const syncBlockchain = () => (dispatch) => {
  if (rpc.block && rpc.block.number != null) {
    dispatch(syncFromRPC());
  } else {
    dispatch(syncFromBlockchain());
  }
};
