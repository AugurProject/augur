import axios from 'axios';
import { BigNumber } from 'bignumber.js';

export enum Operation {
  Call,
  DelegateCall,
  Create,
}

export interface Signatures {
  v?: number;
  r: string;
  s: string;
}

export interface CreateSafeData {
  saltNonce: number;
  threshold: number;
  owners: string[];
  to?: string;
  data?: string;
  paymentToken: string;
  fallbackHandler?: string;
  setupData?: string;
}

export interface RelayTxEstimateData {
  safe: string;
  to: string;
  data: string;
  value: BigNumber;
  operation: Operation;
  gasToken: string;
}

export interface RelayTransaction extends RelayTxEstimateData {
  safeTxGas: BigNumber | string;
  dataGas: BigNumber;
  gasPrice: BigNumber;
  refundReceiver: string;
  nonce: number;
  signatures: Signatures[];
}

export interface SafeResponse {
  safe: string;
  masterCopy: string;
  proxyFactory: string;
  paymentToken: string;
  payment: string;
  paymentReceiver: string;
  setupData: string;
  gasEstimated: string;
  gasPriceEstimated: string;
}

export interface GasStationResponse {
  lastUpdate: string;
  lowest: string;
  safeLow: string;
  standard: string;
  fast: string;
  fastest: string;
}

export interface CheckSafeResponse {
  data: {
    blockNumber: number;
    txHash: string;
  };
}

export interface RelayTxEstimateResponse {
  safeTxGas: BigNumber;
  baseGas: BigNumber;
}

export enum GnosisSafeState {
  // Relay has transaction queued and waiting for funds.
  WAITING_FOR_FUNDS = 'WAITING_FOR_FUNDS',

  // The Safe is created and funded. Need to register with GnosisSafeRegistry.
  CREATED = 'CREATED',

  // Delegate call is in flight.
  REGISTERING_SAFE = 'REGISTERING_SAFE',

  // Funded and ready
  AVAILABLE = 'AVAILABLE',

  // The Safe does not exist and should be cleared from state.
  ERROR = 'ERROR',

  // Service call failure.
  UNAVAILABLE = 'UNAVAILABLE',
}

export type GnosisSafeStateReponse = {
  status: Exclude<GnosisSafeState, 'CREATED'>;
} | {
  status: GnosisSafeState.CREATED | GnosisSafeState.REGISTERING_SAFE;
  txHash: string;
};

export interface IGnosisRelayAPI {
  createSafe(createSafeTx: CreateSafeData): Promise<SafeResponse>;
  execTransaction(tx: RelayTransaction): Promise<string>; // TX Hash
  checkSafe(safeAddress: string): Promise<GnosisSafeStateReponse>;
  estimateTransaction(
    relayTxEstimateData: RelayTxEstimateData
  ): Promise<RelayTxEstimateResponse>;
  gasStation(): Promise<GasStationResponse>
}

export class GnosisRelayAPI implements IGnosisRelayAPI {
  readonly relayURL: string;

  constructor(relayURL: string) {
    this.relayURL = relayURL;
  }

  async createSafe(createSafeTx: CreateSafeData): Promise<SafeResponse> {
    const url = `${this.relayURL}v2/safes/`;

    try {
        const result = await axios.post(url, createSafeTx);
        return result.data;
    }
    catch(error) {
      throw error.response ? error.response.data : error;
    }
  }

  async checkSafe(safeAddress: string): Promise<GnosisSafeStateReponse> {
    const url = `${this.relayURL}v2/safes/${safeAddress}/funded/`;

    try {
      // Trigger an update
      await axios.put(url);

      const result = (await axios.get(url)) as CheckSafeResponse;
      if (result.data.txHash === null) {
        return {
          status: GnosisSafeState.WAITING_FOR_FUNDS
        };
      }

      return {
        status: GnosisSafeState.CREATED,
        txHash: result.data.txHash,
      };
    } catch (error) {
      // If the safe address was just requested the service will not have an entry for it in the DB yet
      if (error.response.status === 404) {
        return {
          status: GnosisSafeState.ERROR,
        };
      } else {
        return {
          status: GnosisSafeState.UNAVAILABLE,
        };
      }
    }
  }

  async gasStation(): Promise<GasStationResponse> {
    const url = `${this.relayURL}v1/gas-station/`;

    try {
      const result = await axios.get(url);
      return result.data
    } catch (error) {
      throw error;
    }
  }

  async estimateTransaction(
    relayTxEstimateData: RelayTxEstimateData
  ): Promise<RelayTxEstimateResponse> {
    const url = `${this.relayURL}v2/safes/${relayTxEstimateData.safe}/transactions/estimate/`;

    try {
      const result = await axios.post(url, relayTxEstimateData);
      return result.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }

  async execTransaction(relayTx: RelayTransaction): Promise<string> {
    const url = `${this.relayURL}v1/safes/${relayTx.safe}/transactions/`;

    try {
      const result = await axios.post(url, relayTx);
      return result.data.txHash;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
}
