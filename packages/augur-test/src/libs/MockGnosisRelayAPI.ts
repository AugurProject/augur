import {
  CreateSafeData,
  GasStationResponse,
  GnosisSafeState,
  GnosisSafeStateReponse,
  IGnosisRelayAPI,
  RelayTransaction,
  RelayTxEstimateData,
  RelayTxEstimateResponse,
  SafeResponse,
} from '@augurproject/gnosis-relay-api';
import { NULL_ADDRESS } from '@augurproject/sdk';
// tslint:disable-next-line:import-blacklist
import { AUGUR_GNOSIS_SAFE_NONCE } from '@augurproject/sdk/build/api/Gnosis';

import { ContractAPI } from '@augurproject/tools';
import { prefixHex } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import * as ethUtil from 'ethereumjs-util';
import { ethers } from 'ethers';

export class MockGnosisRelayAPI implements IGnosisRelayAPI {
  // If we ever need to have multiple inflight safe creation txs this should become an mapping.
  private currentTxHash: string | null;
  private currentCreateSafeResponse: SafeResponse | null;
  private payer: ContractAPI;

  constructor() {}

  initialize(payer: ContractAPI) {
    this.payer = payer;
  }

  /**
   * This is a copy-paste of calculateGnosisSafeAddress method from the gnosis class.
   * @param {} createSafeTx
   * @returns {Promise<>}
   */
  async createSafe(createSafeTx: CreateSafeData): Promise<SafeResponse> {
    const gnosisSafeRegistryAddress = this.payer.augur.contracts.gnosisSafeRegistry.address;

    const gasPrice = new BigNumber(1);
    const gasEstimated = new BigNumber(7500000);
    const payment = gasPrice.multipliedBy(gasEstimated);

    const gnosisSafeData = await this.payer.provider.encodeContractFunction(
      'GnosisSafe',
      'setup',
      [
        createSafeTx.owners,
        createSafeTx.threshold,
        createSafeTx.to,
        createSafeTx.setupData,
        NULL_ADDRESS,
        createSafeTx.paymentToken,
        payment,
        NULL_ADDRESS,
      ]
    );

    const proxyCreationCode = await this.payer.augur.contracts.proxyFactory.proxyCreationCode_();

    const abiCoder = new ethers.utils.AbiCoder();

    const constructorData = abiCoder.encode(
      ['address'],
      [this.payer.augur.contracts.gnosisSafe.address]
    );
    const encodedNonce = abiCoder.encode(
      ['uint256'],
      [AUGUR_GNOSIS_SAFE_NONCE]
    );
    const saltNonceWithCallback = ethUtil.keccak256(encodedNonce + this.payer.augur.contracts.gnosisSafeRegistry.address.substr(2));
    const salt = ethUtil.keccak256(
      '0x' +
        ethUtil.keccak256(gnosisSafeData).toString('hex') +
        saltNonceWithCallback.toString('hex')
    );

    const initCode = proxyCreationCode + constructorData.substr(2);

    const safe =
      '0x' +
      ethUtil
        .generateAddress2(
          this.payer.augur.contracts.proxyFactory.address,
          salt,
          initCode
        )
        .toString('hex');

    this.currentCreateSafeResponse = {
      safe,
      setupData: gnosisSafeData,
      paymentToken: createSafeTx.paymentToken,
      proxyFactory: this.payer.augur.contracts.proxyFactory.address,
      paymentReceiver: this.payer.account.publicKey,
      masterCopy: this.payer.augur.contracts.gnosisSafe.address,
      gasPriceEstimated: prefixHex(gasPrice),
      gasEstimated: prefixHex(gasEstimated),
      payment: prefixHex(payment),
      callback: gnosisSafeRegistryAddress
    };

    return this.currentCreateSafeResponse;
  }

  /**
   * We need to check the address has $$$$$$$......
   * If so, go to work.
   * @param {string} safeAddress
   * @returns {Promise<>}
   */
  async checkSafe(safeAddress: string): Promise<GnosisSafeStateReponse> {
    const gnosisSafeRegistryAddress = this.payer.augur.contracts.gnosisSafeRegistry.address;
    const balance = await this.payer.augur.contracts.cash.balanceOf_(
      safeAddress
    );
    if (balance.eq(0)) {
      return {
        status: GnosisSafeState.WAITING_FOR_FUNDS,
      };
    }

    if (!this.currentTxHash) {
      const data = this.payer.provider.encodeContractFunction(
        'ProxyFactory',
        'createProxyWithCallback',
        [
          this.currentCreateSafeResponse.masterCopy,
          this.currentCreateSafeResponse.setupData,
          new BigNumber(AUGUR_GNOSIS_SAFE_NONCE),
          gnosisSafeRegistryAddress
        ]
      );

      const tx = {
        to: this.payer.augur.contracts.proxyFactory.address,
        from: this.payer.account.publicKey,
        data,
      };

      const response = await this.payer.dependencies.signer.sendTransaction({
        ...tx,
      });

      const status = await this.payer.provider.getTransaction(response.hash);

      this.currentTxHash = response.hash;
    }

    return {
      status: GnosisSafeState.CREATED,
      txHash: this.currentTxHash,
    };
  }

  async execTransaction(relayTx: RelayTransaction): Promise<string> {
    return this.payer.dependencies.execTransactionDirectly(relayTx);
  }

  async gasStation(): Promise<GasStationResponse> {
    throw new Error('Not Implemented: gasStation');
  }

  async estimateTransaction(
    relayTxEstimateData: RelayTxEstimateData
  ): Promise<RelayTxEstimateResponse> {
    return {
      baseGas: '75000',
      safeTxGas: '80000',
    };
  }
}
