import { MarketCreated } from '@augurproject/sdk-lite/build/events';
import { Block } from 'ethers/providers';
import { Provider } from '..';

/*
 * What needs to happen:
 * On bulks sync:
 * 1. On empty db we need to identify WarpSync markets and populate checkpoints
 * 2.
 * 2. On full db.
 * On warp sync:
 * 1.
 * */

type MarketWithEndTime = Pick<MarketCreated, 'blockNumber' | 'endTime'>;

export class Checkpoints {
  constructor(private provider: Provider) {}

  async calculateBoundaryByMarkets(
    firstMarket: MarketWithEndTime,
    secondMarket: MarketWithEndTime
  ) {
    return;
  }

  /**
   * @description Given a timestamp
   * @param {number} timestamp
   * @param {Block} beginBlock
   * @param {Block} endBlock
   * @returns {Promise<[Block, Block]>}
   */
  async calculateBoundary(
    timestamp: number,
    beginBlock?: Block,
    endBlock?: Block
  ): Promise<[Block, Block]> {
    if (!beginBlock) beginBlock = await this.provider.getBlock(0);
    if (!endBlock) endBlock = await this.provider.getBlock('latest');

    if (timestamp >= endBlock.timestamp || timestamp < beginBlock.timestamp)
      throw new Error('timestamp outside of provided block range');

    const middleBlockNumber =
      Math.floor((endBlock.number - beginBlock.number) / 2) + beginBlock.number;

    const middleBlock = await this.provider.getBlock(middleBlockNumber);

    const [newBeginBlock, newEndBlock] = this.compareTimestamp(
      timestamp,
      beginBlock,
      middleBlock,
      endBlock
    );

    if (newEndBlock.number - newBeginBlock.number > 1) {
      return this.calculateBoundary(timestamp, newBeginBlock, newEndBlock);
    }

    return [newBeginBlock, newEndBlock];
  }

  compareTimestamp(
    timestamp: number,
    begin: Block,
    middle: Block,
    end: Block
  ): [Block, Block] {
    if (middle.timestamp <= timestamp) return [middle, end];
    if (timestamp < middle.timestamp) return [begin, middle];

    // This should only happen if we are passed a middle block that isn't really in the middle.
    return [begin, end];
  }

  isValidBlockRangeForTimeStamp(timestamp: number, begin: Block, end: Block) {
    return begin.timestamp <= timestamp && end.timestamp > timestamp;
  }
}
