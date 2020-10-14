import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { AccountLoaderAbi } from '../abi/AccountLoaderAbi';

export interface GetAccountDataParams {
    accountLoaderAddress: string;
    accountAddress: string;
    reputationTokenAddress: string;
    USDCAddress: string;
    USDTAddress: string;
    collateralAddress: string;
  }

export interface AccountData {
  signerETH: string;
  signerDAI: string;
  signerREP: string;
  signerLegacyREP: string;
  signerUSDC: string;
  signerUSDT: string;
  signerCollateral: string;
  attoDAIperREP: string;
  attoDAIperETH: string;
  attoDAIperUSDC: string;
  attoDAIperUSDT: string;
  attoETHperREP: string;
  attoETHperUSDC: string;
  attoETHperUSDT: string;
  attoREPperUSDC: string;
  attoREPperUSDT: string;
  attoUSDCperUSDT: string;
  attoETHperCollateral: string;
}

export class AccountLoader {
  static readonly ABI = AccountLoaderAbi;
  private readonly provider: ethers.providers.Provider;

  constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
  }

  async getAccountData(params: GetAccountDataParams): Promise<AccountData> {
    const {
      accountLoaderAddress,
      accountAddress,
      reputationTokenAddress,
      USDCAddress,
      USDTAddress,
      collateralAddress
    } = params;

    let accountData = null;

    const accountLoader = new ethers.Contract(
      accountLoaderAddress,
      AccountLoaderAbi,
      this.provider
    );

    try {
      accountData = await accountLoader.loadAccountData(
        accountAddress,
        reputationTokenAddress,
        USDCAddress,
        USDTAddress,
        collateralAddress
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
        attoDAIperREP: new BigNumber(accountData[4]._hex).toFixed(),
        attoDAIperETH: new BigNumber(accountData[5]._hex).toFixed(),
        attoDAIperUSDC: new BigNumber(accountData[6]._hex).toFixed(),
        attoDAIperUSDT: new BigNumber(accountData[7]._hex).toFixed(),
        attoETHperREP: new BigNumber(accountData[8]._hex).toFixed(),
        attoETHperUSDC: new BigNumber(accountData[9]._hex).toFixed(),
        attoETHperUSDT: new BigNumber(accountData[10]._hex).toFixed(),
        attoREPperUSDC: new BigNumber(accountData[11]._hex).toFixed(),
        attoREPperUSDT: new BigNumber(accountData[12]._hex).toFixed(),
        attoUSDCperUSDT: new BigNumber(accountData[13]._hex).toFixed(),
        attoETHperCollateral: new BigNumber(accountData[14]._hex).toFixed(),
        signerUSDC: new BigNumber(accountData[15]._hex).toFixed(),
        signerUSDT: new BigNumber(accountData[16]._hex).toFixed(),
        signerCollateral: new BigNumber(accountData[17]._hex).toFixed(),
    };
  }
}
