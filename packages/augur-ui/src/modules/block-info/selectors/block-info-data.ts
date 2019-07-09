import { createSelector } from "reselect";
import { selectBlockchainState } from "store/select-state";
import { formatNumber, formatPercent } from "utils/format-number";
import { createBigNumber } from "utils/create-big-number";

import { ZERO } from "modules/common/constants";

export interface BlockchainState {
  highestBlockBn: number;
  lastProcessedBlockBn: number;
}

export const selectBlockInfoData = createSelector(
  selectBlockchainState,
  (blockchainState: any) => {
    if (blockchainState) {
      const { currentBlockNumber, lastProcessedBlock, percentBehindCurrent, blocksBehindCurrent } = blockchainState;
      const highestBlockBn = createBigNumber(currentBlockNumber || 0);
      const lastProcessedBlockBn = createBigNumber(lastProcessedBlock);
      const blocksBehind = formatNumber(blocksBehindCurrent).roundedFormatted;

      const fullPercent = formatPercent(percentBehindCurrent,
        { decimals: 2, decimalsRounded: 2 }
      );
      const percent = fullPercent.formattedValue;

      return {
        percent,
        blocksBehind,
        highestBlockBn,
        lastProcessedBlockBn
      };
    }
    return null;
  }
);
