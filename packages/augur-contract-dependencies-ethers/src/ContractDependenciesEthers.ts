import { getAddress } from 'ethers/utils/address';
import * as _ from 'lodash';
import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { TransactionRequest, TransactionResponse } from 'ethers/providers';

import { getGasStation, NetworkId } from '@augurproject/utils';

import {
  Dependencies,
  AbiFunction,
  AbiParameter,
  Transaction,
  TransactionReceipt,
} from './types';
import {
  isInstanceOfBigNumber,
  isInstanceOfEthersBigNumber,
  isInstanceOfArray,
  isObject,
} from './utils';


export interface EthersSigner {
  sendTransaction(
    transaction: ethers.providers.TransactionRequest
  ): Promise<ethers.providers.TransactionResponse>;
  getAddress(): Promise<string>;
  signMessage(message: ethers.utils.Arrayish | string): Promise<string>;
}

export interface EthersProvider {
  call(transaction: Transaction<ethers.utils.BigNumber>): Promise<string>;
  estimateGas(transaction: TransactionRequest): Promise<ethers.utils.BigNumber>;
  listAccounts(): Promise<string[]>;
  getBalance(address: string): Promise<ethers.utils.BigNumber>;
  getGasPrice(networkId?: NetworkId): Promise<ethers.utils.BigNumber>;
  getTransaction(hash: string): Promise<TransactionResponse>;
  waitForTransaction(
    hash: string,
    confirmations?: number
  ): Promise<ethers.providers.TransactionReceipt>;

  //sendAsync(payload: JSONRPCRequestPayload): Promise<any>;
}

const MIN_GAS_PRICE = new BigNumber(1e9); // Min: 1 Gwei

export enum TransactionStatus {
  AWAITING_SIGNING,
  PENDING,
  SUCCESS,
  FAILURE,
  RELAYER_DOWN,
  FEE_TOO_LOW,
}

export type TransactionStatusCallback = (
  transaction: TransactionMetadata,
  status: TransactionStatus,
  hash?: string,
  reason?: string
) => void;

export interface TransactionMetadataParams {
  [paramName: string]: any;
}

export interface TransactionMetadata {
  name: string;
  params: TransactionMetadataParams;
}

export class ContractDependenciesEthers implements Dependencies<BigNumber> {
  protected readonly abiCoder: ethers.utils.AbiCoder = new ethers.utils.AbiCoder();

  protected transactionDataMetaData: {
    [data: string]: TransactionMetadata;
  } = {};
  protected transactionStatusCallbacks: {
    [key: string]: TransactionStatusCallback;
  } = {};

  constructor(
    readonly provider: EthersProvider,
    public signer?: EthersSigner,
    readonly address?: string
  ) {}

  setSigner(signer: EthersSigner) {
    this.signer = signer;
  }

  setGasPrice(gasPrice: BigNumber): void {
    if (gasPrice.lt(MIN_GAS_PRICE)) gasPrice = MIN_GAS_PRICE;
    // @ts-ignore
    this.provider.overrideGasPrice = new ethers.utils.BigNumber(
      gasPrice.toNumber()
    );
  }

  transactionToEthersTransaction(
    transaction: Transaction<BigNumber>
  ): Transaction<ethers.utils.BigNumber> {
    const transactionObj: Transaction<ethers.utils.BigNumber> = {
      to: transaction.to,
      data: transaction.data,
      value: transaction.value
        ? new ethers.utils.BigNumber(transaction.value.toString())
        : new ethers.utils.BigNumber(0),
    };
    if (transaction.from) {
      transactionObj.from = transaction.from;
    }
    return transactionObj;
  }

  ethersTransactionToTransaction(
    transaction: Transaction<ethers.utils.BigNumber>
  ): Transaction<BigNumber> {
    return {
      to: transaction.to,
      from: transaction.from,
      data: transaction.data,
      value: transaction.value
        ? new BigNumber(transaction.value.toString())
        : new BigNumber(0),
    };
  }

  keccak256(utf8String: string): string {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(utf8String));
  }

  encodeParams(abiFunction: AbiFunction, parameters: any[]) {
    const ethersParams = _.map(parameters, param => {
      return this.encodeParam(param);
    });
    const txData = this.abiCoder.encode(abiFunction.inputs, ethersParams);
    this.storeTxMetadata(abiFunction, parameters, txData);
    return txData.substr(2);
  }

  private encodeParam(param: any): any {
    if (isInstanceOfBigNumber(param)) {
      return new ethers.utils.BigNumber(param.toFixed());
    } else if (isInstanceOfArray(param)) {
      return param.length > 0
        ? _.map(param, value => this.encodeParam(value))
        : param;
    } else if (isObject(param)) {
      return _.mapValues(param, value => this.encodeParam(value));
    }
    return param;
  }

  storeTxMetadata(
    abiFunction: AbiFunction,
    parameters: any[],
    txData: string
  ): void {
    const txParams = _.reduce(
      abiFunction.inputs,
      (result, input, index) => {
        result[input.name] = parameters[index];
        return result;
      },
      {} as { [paramName: string]: any }
    );
    this.transactionDataMetaData[txData] = {
      name: abiFunction.name,
      params: txParams,
    };
  }

  decodeParams(abiParameters: AbiParameter[], encoded: string) {
    const results = this.abiCoder.decode(abiParameters, encoded);
    return _.map(results, result => {
      if (isInstanceOfEthersBigNumber(result)) {
        return new BigNumber(result.toString());
      } else if (
        isInstanceOfArray(result) &&
        result.length > 0 &&
        isInstanceOfEthersBigNumber(result[0])
      ) {
        return _.map(result, value => new BigNumber(value.toString()));
      }
      return result;
    });
  }

  async call(transaction: Transaction<BigNumber>): Promise<string> {
    return this.provider.call(this.transactionToEthersTransaction(transaction));
  }

  async getDefaultAddress(): Promise<string | undefined> {
    if (this.signer) {
      return getAddress(await this.signer.getAddress());
    }

    if (this.address) return getAddress(this.address);

    return undefined;
  }

  registerTransactionStatusCallback(
    key: string,
    callback: TransactionStatusCallback
  ): void {
    this.transactionStatusCallbacks[key] = callback;
  }

  deRegisterTransactionStatusCallback(key: string): void {
    delete this.transactionStatusCallbacks[key];
  }

  deRegisterAllTransactionStatusCallbacks(): void {
    Object.keys(this.transactionStatusCallbacks).map(key =>
      this.deRegisterTransactionStatusCallback(key)
    );
  }

  onTransactionStatusChanged(
    txMetadata: TransactionMetadata,
    status: TransactionStatus,
    hash?: string,
    reason?: string
  ): void {
    for (const callback of Object.values(this.transactionStatusCallbacks)) {
      callback(txMetadata, status, hash, reason);
    }
  }

  async submitTransaction(
    transaction: Transaction<BigNumber>
  ): Promise<TransactionReceipt> {
    if (!this.signer) {
      throw new Error('Attempting to sign a transaction while not providing a signer');
    }
    // @TODO: figure out a way to propagate a warning up to the user in this scenario, we don't currently have a mechanism for error propagation, so will require infrastructure work
    const tx = this.transactionToEthersTransaction(transaction);
    const txMetadataKey = `0x${transaction.data.substring(10)}`;
    const txMetadata = this.transactionDataMetaData[txMetadataKey];
    this.onTransactionStatusChanged(
      txMetadata,
      TransactionStatus.AWAITING_SIGNING
    );
    let hash = undefined;
    try {
      const receipt = await this.sendTransaction(tx, txMetadata);
      hash = receipt.transactionHash;
      const status =
        receipt.status === 1
          ? TransactionStatus.SUCCESS
          : TransactionStatus.FAILURE;
      this.onTransactionStatusChanged(txMetadata, status, hash);
      // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
      return receipt as TransactionReceipt;
    } catch (e) {
      this.onTransactionStatusChanged(
        txMetadata,
        TransactionStatus.FAILURE,
        hash
      );
      throw e;
    } finally {
      delete this.transactionDataMetaData[txMetadataKey];
    }
  }

  async sendTransaction(
    tx: Transaction<ethers.utils.BigNumber>,
    txMetadata: TransactionMetadata
  ): Promise<ethers.providers.TransactionReceipt> {
    tx.gasLimit = tx.gasLimit || await this.provider.estimateGas(tx);
    tx.gasPrice = tx.gasPrice || await this.provider.getGasPrice();

    // @BODY https://github.com/ethers-io/ethers.js/issues/321
    // the 'from field is required to estimate gas but will fail if present when the transaction is sent.
    delete tx.from;

    const response = await this.signer.sendTransaction(tx);
    const hash = response.hash;
    this.onTransactionStatusChanged(
      txMetadata,
      TransactionStatus.PENDING,
      hash
    );
    return response.wait();
  }

  async estimateGas(transaction: Transaction<BigNumber>): Promise<BigNumber> {
    const ethersTransaction = this.transactionToEthersTransaction(transaction);
    return this.estimateGasForEthersTransaction(ethersTransaction);
  }

  async estimateGasForEthersTransaction(
    transaction: Transaction<ethers.utils.BigNumber>
  ): Promise<BigNumber> {
    const estimate = await this.provider.estimateGas(transaction);
    return new BigNumber(estimate.toString());
  }
}
