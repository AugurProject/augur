import { SDKConfiguration } from '@augurproject/utils';
import { Market } from '@augurproject/core/build/libraries/ContractInterfaces';
import { BigNumber } from 'bignumber.js';
import { ContractAPI } from '..';
import { BASE_MNEMONIC } from '../constants';
import {
  AccountCreator,
  FINNEY,
  setupMarkets,
  setupUsers,
} from './performance';

export const perfSetup = async (ethSource: ContractAPI, marketMakerCount: number, traderCount:number, serial: boolean, config: SDKConfiguration) => {
  const accountCreator = new AccountCreator(BASE_MNEMONIC);
  const marketMakerAccounts = accountCreator.marketMakers(marketMakerCount);
  const traderAccounts = accountCreator.traders(traderCount);

  let users:ContractAPI[] = [];
  if (marketMakerCount > 0) {
    const makers: ContractAPI[] = await setupUsers(marketMakerAccounts, ethSource, new BigNumber(FINNEY).times(40), config, serial);
    users = [...users, ...makers];

    const markets: Market[] = await setupMarkets(makers, serial);
    console.log('Created markets:', markets.map((market) => market.address).join(','))
  }
  if (traderCount > 0) {
    const takers: ContractAPI[] = await setupUsers(traderAccounts, ethSource, new BigNumber(FINNEY).times(5), config, serial);
    users = [...users, ...takers];

    console.log('Created traders:');
    traderAccounts.forEach((trader, index) => {
      console.log(`#${index}: ${trader.privateKey} -> ${trader.address}`);
    })
  }

  return users;
};
