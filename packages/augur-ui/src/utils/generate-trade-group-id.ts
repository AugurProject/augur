import * as uuid from 'uuid';
import { ethers } from 'ethers';

export function generateTradeGroupId() {
  return ethers.utils.formatBytes32String(
    uuid
      .v4()
      .toString()
      .substring(1, 32)
  );
}
