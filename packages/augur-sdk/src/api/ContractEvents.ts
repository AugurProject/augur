import { abi } from '@augurproject/artifacts';
import { Log, ParsedLog } from '@augurproject/types';
import { ContractAddresses, ParaDeploys } from '@augurproject/utils';
import { Abi } from 'ethereum';
import { Provider } from '..';


type EmittingContractAddresses = Pick<ContractAddresses, 'Augur' | 'AugurTrading' | 'ShareToken'>;

export class ContractEvents {
  private readonly eventNameToContractName = {
    'TransferSingle': 'ShareToken',
    'TransferBatch': 'ShareToken',
    'OrderEvent': 'AugurTrading',
    'ProfitLossChanged': 'AugurTrading',
    'MarketVolumeChanged': 'AugurTrading',
    'CancelZeroXOrder': 'AugurTrading',
  };

  private readonly contractAddressToName = {};
  private readonly contractAddresses = [];

  constructor(
    private readonly provider: Provider,
    private readonly augurContractAddresses:EmittingContractAddresses,
    private readonly augurParaDeploys:ParaDeploys = {},
    ) {
    this.provider.storeAbiData(abi.Augur as Abi, 'Augur');
    this.provider.storeAbiData(abi.AugurTrading as Abi, 'AugurTrading');
    this.provider.storeAbiData(abi.ShareToken as Abi, 'ShareToken');

    // ParaDeploy ABI
    this.provider.storeAbiData(abi.ParaAugur as Abi, 'ParaAugur');
    this.provider.storeAbiData(abi.ParaAugurTrading as Abi, 'ParaAugurTrading');
    this.provider.storeAbiData(abi.ParaShareToken as Abi, 'ParaShareToken');

    const allContractAddresses = [
      augurContractAddresses,
      ...Object.values(augurParaDeploys).map((augurParaDeploy) => augurParaDeploy.addresses)
    ].map(({Augur, AugurTrading, ShareToken}) => ({
      Augur: Augur.toLocaleLowerCase(),
      AugurTrading: AugurTrading.toLocaleLowerCase(),
      ShareToken: ShareToken.toLocaleLowerCase()
    }));

    this.contractAddressToName = allContractAddresses.reduce((acc, contractAddresses) => {
      for(const contractName in contractAddresses) {
        acc[contractAddresses[contractName]] = contractName;
      }

      return acc;
    }, this.contractAddressToName);

    console.log('contractAddressToName', this.contractAddressToName);

    this.contractAddresses = allContractAddresses.reduce((acc, {Augur, AugurTrading, ShareToken}) => [
      ...acc,
      Augur,
      AugurTrading,
      ShareToken
    ], [])
      // Remove duplicates.
    .filter((value, index, self) => self.indexOf(value) === index);
  }

  getEventContractName = (eventName: string) => {
    const contractName = this.eventNameToContractName[eventName];
    return contractName || 'Augur';
  };

  getAugurContractAddresses = () => {
    return this.contractAddresses;
  }

  getEventTopics = (eventName: string) => {
    return [this.provider.getEventTopic(this.getEventContractName(eventName), eventName)];
  };

  parseLogs = (logs: Log[]): ParsedLog[] => {
    return logs.map((log) => {
      const contractName: string|undefined = this.contractAddressToName[log.address];
      if (typeof contractName === 'undefined') {
        console.error('Could not find contract name for log, check ABI', log);
        throw new Error(`Recieved a log for an unknown contract at address ${log.address}. Double check that deployment is up to date and new ABIs have been committed.`);
      }

      const logValues = this.provider.parseLogValues(contractName, log);
      return Object.assign(
        { name: '' },
        logValues,
        {
          address: log.address,
          blockNumber: log.blockNumber,
          blockHash: log.blockHash,
          transactionIndex: log.transactionIndex,
          removed: log.removed,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
          topics: log.topics,
        }
      );
    });
  }
}
