import { Block, BlockTag } from 'ethers/providers';
import { ContractEvents } from './ContractEvents';
import { NetworkId } from '@augurproject/artifacts';
import { Filter, Log, LogValues, Provider } from '..';
import { Abi } from 'ethereum';
import { JSONRPCRequestPayload } from 'ethereum-types';

function makeProviderMock(opts?: any): Provider {
  const networkId = opts.networkId || '4';
  const logs = opts.logs || [];
  const blockNumber = opts.blockNumber || 0;
  const eventTopic = opts.eventTopic || 'xyz';
  const logValues = opts.logValues || [];
  const balance = opts.balance || '1';
  const block = opts.block || null;

  return {
    disconnect: (()=>{}),
    getNetworkId: (): Promise<NetworkId> => Promise.resolve(networkId),
    getLogs: (filter: Filter): Promise<Log[]> => Promise.resolve(logs),
    getBlockNumber: (): Promise<number> => Promise.resolve(blockNumber),
    getBlock: (blockHashOrBlockNumber: BlockTag | string): Promise<Block> => Promise.resolve(block),
    storeAbiData: (abi: Abi, contractName: string): void => { },
    getEventTopic: (contractName: string, eventName: string): string => eventTopic,
    encodeContractFunction: (contractName: string, functionName: string, funcParams: any[]): string => '0x0',
    parseLogValues: (contractName: string, log: Log): LogValues => logValues,
    getBalance: (address: string) => balance,
    sendAsync: (payload: JSONRPCRequestPayload) => Promise.resolve(null)
  };
}

test('get event topics', async () => {
  const eventTopic = 'foobarington';
  const provider = makeProviderMock({ eventTopic });

  const contractEvents = new ContractEvents(provider, '0x0', '0x0', '0x0');
  const topics = await contractEvents.getEventTopics('foobar');

  expect(topics).toEqual([eventTopic]);
});
