"use strict";

export const waitNextBlock = async (numBlocks: number = 1) => {
  const blockchainInfo = await page.evaluate(() =>
    window.integrationHelpers.getCurrentBlock()
  );
  const blockNumber: number = blockchainInfo.currentBlockNumber;
  const blockNumberPlus: number = blockNumber + numBlocks;
  let newBlockNumber: number = blockNumber;

  while (newBlockNumber < blockNumberPlus) {
    const nextblockchainInfo = await page.evaluate(() =>
      window.integrationHelpers.getCurrentBlock()
    );
    newBlockNumber = nextblockchainInfo.currentBlockNumber;
  }
};
