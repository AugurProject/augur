"use strict";

export const waitNextBlock = async () => {
  const blockchainInfo = await page.evaluate(() => window.integrationHelpers.getCurrentBlock());
  const blockNumber = blockchainInfo.currentBlockNumber
  let stillWaiting = true
  while (stillWaiting) {
    const nextblockchainInfo = await page.evaluate(() => window.integrationHelpers.getCurrentBlock());
    stillWaiting = nextblockchainInfo.currentBlockNumber > blockNumber + 1
  }
};
