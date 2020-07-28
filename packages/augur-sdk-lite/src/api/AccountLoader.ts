import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { AccountLoaderAbi } from '../abi/AccountLoaderAbi';
import { QUINTILLION, } from '../constants';

export interface GetAccountDataParams {
    accountLoaderAddress: string;
    accountAddress: string;
    reputationTokenAddress: string;
  }

export interface AccountData {
  signerETH: string;
  signerDAI: string;
  signerREP: string;
  signerLegacyREP: string;
  walletETH: string;
  walletDAI: string;
  walletREP: string;
  walletLegacyREP: string;
  attoDAIperREP: string;
  attoDAIperETH: string;
}

export class AccountLoader {
  private readonly provider: ethers.providers.Provider;

  constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
  }

  async getAccountData(params: GetAccountDataParams): Promise<AccountData> {
    const accountAddress = params.accountAddress;
    const reputationTokenAddress = params.reputationTokenAddress;

    let accountData = null;

    const accountLoader = new ethers.Contract(
      params.accountLoaderAddress,
      AccountLoaderAbi,
      this.provider
    );

    try {
      accountData = await accountLoader.loadAccountData(
        accountAddress,
        reputationTokenAddress
      );
    } catch (e) {
      console.error('Can not load account data', e);
    }
    if (!accountData) return null;

    return {
        signerETH: new BigNumber(accountData[0]._hex).toFixed(),
        signerDAI: new BigNumber(accountData[1]._hex).toFixed(),
        signerREP: new BigNumber(accountData[2]._hex).toFixed(),
        signerLegacyREP: new BigNumber(accountData[3]._hex).toFixed(),
        walletETH: new BigNumber(accountData[4]._hex).toFixed(),
        walletDAI: new BigNumber(accountData[5]._hex).toFixed(),
        walletREP: new BigNumber(accountData[6]._hex).toFixed(),
        walletLegacyREP: new BigNumber(accountData[7]._hex).toFixed(),
        attoDAIperREP: new BigNumber(accountData[8]._hex).toFixed(),
        attoDAIperETH: new BigNumber(accountData[9]._hex).toFixed(),
    };
  }
}
