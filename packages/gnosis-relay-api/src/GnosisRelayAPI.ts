import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import axios from 'axios';

export interface Signatures {
  v?: number;
  r: string;
  s: string;
}

export interface CreateSafeData {
  saltNonce: number;
  threshold: number;
  owners: string[];
  paymentToken: string;
}

export interface RelayTxEstimateData {
  safe: string;
  to: string;
  data: string;
  value: BigNumber;
  operation: number;
  gasToken: string;
}

export interface RelayTransaction extends RelayTxEstimateData {
  safeTxGas: BigNumber;
  dataGas: BigNumber;
  gasPrice: BigNumber;
  refundReceiver: string;
  nonce: number;
  signatures: Signatures[];
}

export interface SafeResponse {
  safe: string;
  payment: string;
}

export interface CheckSafeResponse {
  blockNumber: number;
  txHash: string;
}

export interface RelayTxEstimateResponse {
  safeTxGas: BigNumber;
  baseGas: BigNumber;
}

export interface IGnosisRelayAPI {
  createSafe(createSafeTx: CreateSafeData): Promise<SafeResponse>;
  execTransaction(RelayTransaction): Promise<string>; // TX Hash
  checkSafe(safeAddress: string): Promise<CheckSafeResponse>;
  estimateTransaction(relayTxEstimateData: RelayTxEstimateData): Promise<RelayTxEstimateResponse>;
}

export class GnosisRelayAPI implements IGnosisRelayAPI {
  public readonly relayURL: string;

  constructor(relayURL: string) {
    this.relayURL = relayURL;
  }

  public async createSafe(createSafeTx: CreateSafeData): Promise<SafeResponse> {
    const url = `${this.relayURL}v2/safes/`;

    const result = await axios.post(url, createSafeTx);

    return result.data;
  }

  public async checkSafe(safeAddress: string): Promise<CheckSafeResponse> {
    const url = `${this.relayURL}v2/safes/${safeAddress}/funded/`;

    // Trigger an update
    await axios.put(url);

    try {
      const result = await axios.get(url);
      return result.data;
    } catch (error) {
      // If the safe address was just requested the service will not have an entry for it in the DB yet
      return {
        blockNumber: null,
        txHash: null
      }
    }
  }

  public async estimateTransaction(relayTxEstimateData: RelayTxEstimateData): Promise<RelayTxEstimateResponse> {
    const url = `${this.relayURL}v2/safes/${relayTxEstimateData.safe}/transactions/estimate`;

    try {
      const result = await axios.post(url, relayTxEstimateData);
      return result.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }

  public async execTransaction(relayTx: RelayTransaction): Promise<string> {
    const url = `${this.relayURL}v1/safes/${relayTx.safe}/transactions/`;

    try {
      const result = await axios.post(url, relayTx);
      return result.data.txHash;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
}