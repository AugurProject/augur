import { Block, Log, FilterOptions } from 'ethereumjs-blockstream';
import * as _ from 'lodash';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { BlockAndLogStreamerDependencies, ExtendedLog } from './index';
import { JsonRpcProvider } from 'ethers/providers';

export class EthersProviderBlockStreamAdapter
  implements BlockAndLogStreamerDependencies<ExtendedLog, Block> {
  constructor(private provider: EthersProvider) {}

  private onNewBlock(reconcileNewBlock: (block: Block) => Promise<void>) {
    return async (blockNumber: string) => {
      const block = await this.getBlockByHashOrTag(blockNumber);
      if (block) {
        await reconcileNewBlock(block);
      }
    };
  }

  startPollingForBlocks = (
    reconcileNewBlock: (block: Block) => Promise<void>
  ) => {
    // This event only emits the block number. We need to find the block details.
    this.provider.on('block', this.onNewBlock(reconcileNewBlock));
  };

  getBlockByNumber = async (hashOrTag: string): Promise<Block> => {
    return this.getBlockByHashOrTag(hashOrTag);
  };
  getBlockByHash = async (hashOrTag: string): Promise<Block> => {
    return this.getBlockByHashOrTag(hashOrTag);
  };

  getBlockByHashOrTag = async (hashOrTag: string): Promise<Block> => {
    const block = await this.provider.getBlock(hashOrTag, false);
    return {
      number: '0x' + block.number.toString(16),
      hash: block.hash,
      parentHash: block.parentHash,
    };
  };

  getLogs = async (filterOptions: FilterOptions): Promise<ExtendedLog[]> => {
    const logs = await this.provider.getLogs({
      ...filterOptions,
      topics: _.compact(filterOptions.topics),
    });

    return _.map(logs, log => ({
      ...log,
      logIndex: (log.logIndex || '0').toString(),
      blockNumber: (log.blockNumber || '0').toString(),
      blockHash: log.blockHash || '0',
    }));
  };
}

export async function createAdapter(
  httpAddress: string
): Promise<BlockAndLogStreamerDependencies<Log, Block>> {
  const ethersProvider = new EthersProvider(
    new JsonRpcProvider(httpAddress),
    5,
    50,
    10
  );
  return new EthersProviderBlockStreamAdapter(ethersProvider);
}
