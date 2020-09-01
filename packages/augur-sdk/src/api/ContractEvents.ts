import { abi } from '@augurproject/artifacts';
import { Log, ParsedLog } from '@augurproject/types';
import { ContractAddresses, ParaDeploys } from '@augurproject/utils';
import { Abi } from 'ethereum';
import { Provider } from '..';
import { invert, invertBy } from 'lodash/fp';

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

    this.contractAddresses = [
      augurContractAddresses,
      ...Object.values(augurParaDeploys).map((augurParaDeploy) => augurParaDeploy.addresses)
    ].map(({Augur, AugurTrading, ShareToken}) => ({
      Augur: Augur.toLocaleLowerCase(),
      AugurTrading: AugurTrading.toLocaleLowerCase(),
      ShareToken: ShareToken.toLocaleLowerCase()
    })).reduce((acc, {Augur, AugurTrading, ShareToken}) => [
      ...acc,
      Augur,
      AugurTrading,
      ShareToken
    ], [])
    // Remove duplicates.
    .filter((value, index, self) => self.indexOf(value) === index);

    const pluckContracts = (prefix = '') => ({Augur, AugurTrading, ShareToken}) => ({
      [Augur.toLocaleLowerCase()]: `${prefix}Augur`,
      [AugurTrading.toLocaleLowerCase()]: `${prefix}AugurTrading`,
      [ShareToken.toLocaleLowerCase()]: `${prefix}ShareToken`
    });

    this.contractAddressToName =  {
      ...Object.values(augurParaDeploys)
      .map(({addresses}) => addresses)
      // Prefix para deploy contract names.
      .map(pluckContracts('Para'))
      .reduce((acc, value) => {
        return {
          ...acc,
          ...value,
          }
        }, {}),
      ...pluckContracts()(augurContractAddresses),
    };

    console.log('this.contractAddressToName',
      JSON.stringify(this.contractAddressToName));
  }

  getEventContractName = (eventName: string) => {
    const contractName = this.eventNameToContractName[eventName];
    return contractName || 'Augur';
  };

  getAugurContractAddresses = () => {
    return this.contractAddresses;
  }

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
