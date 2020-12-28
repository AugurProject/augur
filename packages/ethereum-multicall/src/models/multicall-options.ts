import { Provider } from '@ethersproject/providers';

interface MulticallOptionsBase {
  multicallCustomContractAddress?: string;
}

export interface MulticallOptionsWeb3 extends MulticallOptionsBase {
  // so we can support any version of web3 typings
  // tslint:disable-next-line: no-any
  web3Instance: any;
}

export interface MulticallOptionsEthers extends MulticallOptionsBase {
  ethersProvider: Provider;
}

export interface MulticallOptionsCustomJsonRpcProvider
  extends MulticallOptionsBase {
  nodeUrl: string;
}
