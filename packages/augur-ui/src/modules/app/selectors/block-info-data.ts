import { createSelector } from 'reselect';
import { selectBlockchainState } from 'appStore/select-state';
import { formatNumber, formatPercent } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import { Blockchain } from 'modules/types';

export const selectBlockInfoData = createSelector(
  selectBlockchainState,
  (blockchainState: Blockchain) => {
    if (blockchainState) {
      const {
        currentBlockNumber,
        lastSyncedBlockNumber,
        percentSynced,
        blocksBehindCurrent,
      } = blockchainState;
      const highestBlockBn = createBigNumber(currentBlockNumber || 0);
      const lastProcessedBlockBn = createBigNumber(lastSyncedBlockNumber || 0);
      const blocksBehind = blocksBehindCurrent !== 0 ? formatNumber(blocksBehindCurrent, {
        blankZero: true,
      }).roundedFormatted : "0"

      const fullPercent = formatPercent(percentSynced, {
        decimals: 2,
        decimalsRounded: 2,
      });
      const percent = fullPercent.formattedValue;

      return {
        percent,
        blocksBehind,
        highestBlockBn,
        lastProcessedBlockBn,
      };
    }
    return null;
  }
);
