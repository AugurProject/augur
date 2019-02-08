import {
  Address
} from 'augur-core';

export enum NetworkId {
  Mainnet = '1',
  Ropsten = '3',
  Rinkeby= '4',
  Kovan = '42',
  Local1 = '101',
  Local2 = '102',
  Local3 = '103',
  Local4 = '104'
}

export interface GenericContractAddresses<T> {
  Universe: T;
  Augur: T;
  LegacyReputationToken: T;
  CancelOrder: T;
  Cash: T;
  ClaimTradingProceeds: T;
  CompleteSets: T;
  CreateOrder: T;
  FillOrder: T;
  Order: T;
  Orders: T;
  ShareToken: T;
  Trade: T;
  Controller?: T;
  OrdersFinder?: T;
  OrdersFetcher?: T;
  TradingEscapeHatch?: T;
}

export type ContractAddresses = GenericContractAddresses<Address>;

interface GenericNetworks<T> {
  [NetworkId.Mainnet]: GenericContractAddresses<T>;
  [NetworkId.Ropsten]: GenericContractAddresses<T>;
  [NetworkId.Rinkeby]: GenericContractAddresses<T>;
  [NetworkId.Kovan]: GenericContractAddresses<T>;
  [NetworkId.Local1]: GenericContractAddresses<T>;
  [NetworkId.Local2]: GenericContractAddresses<T>;
  [NetworkId.Local3]: GenericContractAddresses<T>;
  [NetworkId.Local4]: GenericContractAddresses<T>;
}


export interface RawNetworkContractAddresses extends GenericNetworks<string> {
}

export interface NetworkContractAddresses extends GenericNetworks<Address> {
}

const processNetwork = (genericContractAddresses: GenericContractAddresses<string>):ContractAddresses => ({
  Universe: (new Address()).from(genericContractAddresses.Universe),
  Augur: (new Address()).from(genericContractAddresses.Augur),
  LegacyReputationToken: (new Address()).from(genericContractAddresses.LegacyReputationToken),
  CancelOrder: (new Address()).from(genericContractAddresses.CancelOrder),
  Cash: (new Address()).from(genericContractAddresses.Cash),
  ClaimTradingProceeds: (new Address()).from(genericContractAddresses.ClaimTradingProceeds),
  CompleteSets: (new Address()).from(genericContractAddresses.CompleteSets),
  CreateOrder: (new Address()).from(genericContractAddresses.CreateOrder),
  FillOrder: (new Address()).from(genericContractAddresses.FillOrder),
  Order: (new Address()).from(genericContractAddresses.Order),
  Orders: (new Address()).from(genericContractAddresses.Orders),
  ShareToken: (new Address()).from(genericContractAddresses.ShareToken),
  Trade: (new Address()).from(genericContractAddresses.Trade)
});

export const processNetworks = (rawNetworkContractAddresses:RawNetworkContractAddresses): NetworkContractAddresses => ({
  [NetworkId.Mainnet]: processNetwork(rawNetworkContractAddresses[NetworkId.Mainnet]),
  [NetworkId.Ropsten]: processNetwork(rawNetworkContractAddresses[NetworkId.Ropsten]),
  [NetworkId.Rinkeby]: processNetwork(rawNetworkContractAddresses[NetworkId.Rinkeby]),
  [NetworkId.Kovan]: processNetwork(rawNetworkContractAddresses[NetworkId.Kovan]),
  [NetworkId.Local1]: processNetwork(rawNetworkContractAddresses[NetworkId.Local1]),
  [NetworkId.Local2]: processNetwork(rawNetworkContractAddresses[NetworkId.Local2]),
  [NetworkId.Local3]: processNetwork(rawNetworkContractAddresses[NetworkId.Local3]),
  [NetworkId.Local4]: processNetwork(rawNetworkContractAddresses[NetworkId.Local4])
});

export const getNetworkAddress = (networkContractAddresses: NetworkContractAddresses, networkId:NetworkId) => {
  return networkContractAddresses[networkId];
};
