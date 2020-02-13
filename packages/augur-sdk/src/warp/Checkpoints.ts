import { Block } from 'ethers/providers';
import { Provider } from '..';

const SECONDS_IN_A_DAY = 86400;
const GUESS_ON_NUMBER_OF_BLOCKS_PER_DAY = 5760;

export class Checkpoints {
  constructor(private provider: Provider) {}

  async calculateBoundaryByNumber(begin: number, end: number) {
    return this.calculateBoundary(
      await this.provider.getBlock(begin),
      await this.provider.getBlock(end)
    );
  }

  async calculateBoundary(
    beginBlock: Block,
    endBlock: Block
  ): Promise<[Block, Block]> {
    if (this.isSameDay(beginBlock, endBlock)) {
      endBlock = await this.provider.getBlock(
        endBlock.number + GUESS_ON_NUMBER_OF_BLOCKS_PER_DAY
      );
    }

    // Handle the case where we grabbed a block that doesn't exist yet.
    if(!endBlock) {
      endBlock = await this.provider.getBlock('latest');
    }

    const middleBlockNumber =
      Math.floor((endBlock.number - beginBlock.number) / 2) + beginBlock.number;

    const middleBlock = await this.provider.getBlock(middleBlockNumber);

    const [newBeginBlock, newEndBlock] = this.compareTimestampDay(
      beginBlock,
      middleBlock,
      endBlock
    );

    if (newEndBlock.number - newBeginBlock.number > 1) {
      return this.calculateBoundary(newBeginBlock, newEndBlock);
    }

    return [newBeginBlock, newEndBlock];
  }

  compareTimestampDay(begin: Block, middle: Block, end: Block): [Block, Block] {
    const beginDayNumber = Math.floor(begin.timestamp / SECONDS_IN_A_DAY);
    const middleDayNumber = Math.floor(middle.timestamp / SECONDS_IN_A_DAY);
    const endDayNumber = Math.floor(end.timestamp / SECONDS_IN_A_DAY);

    if (beginDayNumber === middleDayNumber) return [middle, end];
    if (middleDayNumber <= endDayNumber) return [begin, middle];

    // This should only happen if we are passed a middle block that isn't really in the middle.
    return [begin, end];
  }

  async isSameDayByNumber(begin: number, end: number): Promise<boolean> {
    return this.isSameDay(
      await this.provider.getBlock(begin),
      await this.provider.getBlock(end)
    );
  }

  isSameDay(begin: Block, end: Block) {
    return (
      Math.floor(begin.timestamp / SECONDS_IN_A_DAY) ===
      Math.floor(end.timestamp / SECONDS_IN_A_DAY)
    );
  }
}
