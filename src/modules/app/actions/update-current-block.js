import * as AugurJS from '../../../services/augurjs';

import { updateBlockchain } from '../../app/actions/update-blockchain';

export function updateCurrentBlock() {
	return function(dispatch, getState) {
		AugurJS.loadCurrentBlock(blockNum => {
			dispatch(updateBlockchain(blockNum));
		});
	};
}