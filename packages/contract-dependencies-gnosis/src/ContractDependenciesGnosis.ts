import { abi } from '@augurproject/artifacts';
import {
  GnosisSafeState,
  IGnosisRelayAPI,
  Operation,
  RelayTransaction,
  RelayTxEstimateData,
  RelayTxEstimateResponse,
} from '@augurproject/gnosis-relay-api';
import { BigNumber } from 'bignumber.js';
import { Transaction } from 'contract-dependencies';
import {
  ContractDependenciesEthers,
  EthersProvider,
  EthersSigner,
  TransactionMetadata,
  TransactionStatus,
} from 'contract-dependencies-ethers';
import { ethers } from 'ethers';
import { getAddress } from 'ethers/utils/address';
import * as _ from 'lodash';

const DEFAULT_GAS_PRICE = new BigNumber(10 ** 9);
const BASE_GAS_ESTIMATE = new BigNumber(75000);
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export class ContractDependenciesGnosis extends ContractDependenciesEthers {
  useRelay = true;
  useSafe = false;
  status = null;

  private _currentSignRequest: Promise<RelayTransaction>;

  gnosisSafe: ethers.Contract;

  constructor(
    provider: EthersProvider,
    private readonly gnosisRelay: IGnosisRelayAPI,
    signer: EthersSigner,
    private gasToken: string = NULL_ADDRESS,
    public gasPrice: BigNumber = DEFAULT_GAS_PRICE,
    public safeAddress?: string,
    address?: string
  ) {
    super(provider, signer, address);
    if (safeAddress) {
      this.setSafeAddress(safeAddress);
    }
  }

  async getDefaultAddress(): Promise<string | undefined> {
    if (this.useSafe && this.safeAddress) {
      return getAddress(this.safeAddress);
    }

    return super.getDefaultAddress();
  }

  setSigner(signer: EthersSigner) {
    super.setSigner(signer);

    // Clear previous relayer state.
    this.setUseSafe(false);
    this.safeAddress = NULL_ADDRESS;
    this.gnosisSafe = null;
  }

  setSafeAddress(safeAddress: string): void {
    this.safeAddress = safeAddress;
    this.gnosisSafe = new ethers.Contract(
      safeAddress,
      abi['GnosisSafe'],
      this.signer
    );

    this._currentSignRequest = this.gnosisSafe
      .nonce()
      .then(nonce => ({
        to: '0x0',
        safe: '0x0',
        data: '',
        gasToken: '0x0',
        safeTxGas: '0x0',
        dataGas: new BigNumber(0),
        gasPrice: new BigNumber(0),
        refundReceiver: '0x0',
        nonce: nonce - 1,
        value: new BigNumber(0),
        operation: 0,
        signatures: [],
      }))
      .catch(() => {
        return {
          to: '0x0',
          safe: '0x0',
          data: '',
          gasToken: '0x0',
          safeTxGas: '0x0',
          dataGas: new BigNumber(0),
          gasPrice: new BigNumber(0),
          refundReceiver: '0x0',
          nonce: -1,
          value: new BigNumber(0),
          operation: 0,
          signatures: [],
        };
      });
  }

  setStatus(status: GnosisSafeState): void {
    this.status = status;
  }

  getStatus(): GnosisSafeState {
    return this.status;
  }

  setUseSafe(useSafe: boolean): void {
    this.useSafe = useSafe;
  }

  setUseRelay(useRelay: boolean): void {
    this.useRelay = useRelay;
  }

  setGasPrice(gasPrice: BigNumber): void {
    this.gasPrice = gasPrice;
  }

  async sendTransaction(
    tx: Transaction<ethers.utils.BigNumber>,
    txMetadata: TransactionMetadata
  ): Promise<ethers.providers.TransactionReceipt> {
    // Just use normal signing/sending if no safe is configured
    if (!this.useSafe || !this.safeAddress) {
      return super.sendTransaction(tx, txMetadata);
    }
    let txHash: string;
    // If the Relay Service is not being used so we'll execute the TX directly
    const prevTransaction = await this._currentSignRequest;
    const relayTransaction = await this.ethersTransactionToRelayTransaction(tx);

    if (prevTransaction === relayTransaction)
      throw new Error('Message signature failed.');

    if (this.useRelay) {
      txHash = await this.gnosisRelay.execTransaction(relayTransaction);
    } else {
      txHash = await this.execTransactionDirectly(relayTransaction);
    }

    this.onTransactionStatusChanged(
      txMetadata,
      TransactionStatus.PENDING,
      txHash
    );
    const response = await this.provider.getTransaction(txHash);
    return response.wait();
  }

  async sendDelegateTransaction(
    tx: Transaction<ethers.utils.BigNumber>,
    txMetadata: TransactionMetadata
  ): Promise<ethers.providers.TransactionReceipt> {
    // Just use normal signing/sending if no safe is configured
    if (!this.useSafe || !this.safeAddress) {
      return super.sendTransaction(tx, txMetadata);
    }

    let txHash: string;
    // If the Relay Service is not being used so we'll execute the TX directly
    const relayTransaction = await this.ethersTransactionToRelayTransaction(
      tx,
      Operation.DelegateCall
    );
    if (this.useRelay) {
      txHash = await this.gnosisRelay.execTransaction(relayTransaction);
    } else {
      txHash = await this.execTransactionDirectly(relayTransaction);
    }

    this.onTransactionStatusChanged(
      txMetadata,
      TransactionStatus.PENDING,
      txHash
    );
    const response = await this.provider.getTransaction(txHash);
    return response.wait();
  }

  async estimateGas(transaction: Transaction<BigNumber>): Promise<BigNumber> {
    if (this.useSafe && this.safeAddress && this.useRelay) {
      transaction.from = this.safeAddress;
      const response = await this.relayerEstimateGas(transaction);
      return response;
    } else {
      return super.estimateGas(transaction);
    }
  }

  async relayerEstimateGas(
    transaction: Transaction<BigNumber>
  ): Promise<BigNumber> {
    transaction.from = this.safeAddress;
    const to = transaction.to;
    const value = transaction.value;

    const relayEstimateRequest = {
      safe: this.safeAddress,
      to,
      data: transaction.data,
      value: value ? new BigNumber(value.toString()) : new BigNumber(0),
      operation: Operation.Call,
      gasToken: this.gasToken,
    };

    const gasEstimates: RelayTxEstimateResponse = await this.estimateTransactionViaRelay(
      relayEstimateRequest
    );
    const safeTxGas = new BigNumber(gasEstimates.safeTxGas);
    const baseGas = new BigNumber(gasEstimates.baseGas);

    return safeTxGas.plus(baseGas);
  }

  async estimateTransactionViaRelay(
    relayEstimateRequest: RelayTxEstimateData
  ): Promise<RelayTxEstimateResponse> {
    return this.gnosisRelay.estimateTransaction(relayEstimateRequest);
  }

  async estimateTransactionDirectly(
    tx: Transaction<ethers.utils.BigNumber>
  ): Promise<RelayTxEstimateResponse> {
    const safeTxGas = await this.estimateGas(
      this.ethersTransactionToTransaction(tx)
    );
    return {
      baseGas: BASE_GAS_ESTIMATE,
      safeTxGas,
    };
  }

  async execTransactionDirectly(
    relayTransaction: RelayTransaction
  ): Promise<string> {
    const r = _.padStart(
      new BigNumber(relayTransaction.signatures[0].r).toString(16),
      64,
      '0'
    );
    const s = _.padStart(
      new BigNumber(relayTransaction.signatures[0].s).toString(16),
      64,
      '0'
    );
    const v = relayTransaction.signatures[0].v!.toString(16);
    const signatures = `0x${r}${s}${v}`;
    const response = await this.gnosisSafe.execTransaction(
      relayTransaction.to,
      new ethers.utils.BigNumber(Number(relayTransaction.value).toFixed()),
      relayTransaction.data,
      relayTransaction.operation,
      new ethers.utils.BigNumber(Number(relayTransaction.safeTxGas).toFixed()),
      new ethers.utils.BigNumber(Number(relayTransaction.dataGas).toFixed()),
      new ethers.utils.BigNumber(Number(relayTransaction.gasPrice).toFixed()),
      relayTransaction.gasToken,
      relayTransaction.refundReceiver,
      signatures
    );
    return response.hash;
  }

  async ethersTransactionToRelayTransaction(
    tx: Transaction<ethers.utils.BigNumber>,
    operation: Operation = Operation.Call
  ): Promise<RelayTransaction> {
    const prevRequest = await this._currentSignRequest;
    const nonce = Number(prevRequest.nonce) + 1;
    console.log('nonce', nonce);

    const to = tx.to;
    const value = tx.value;
    const data = tx.data;

    const relayEstimateRequest = {
      safe: this.safeAddress,
      to,
      data: tx.data,
      value: new BigNumber(value.toString()),
      operation,
      gasToken: this.gasToken,
    };

    let gasEstimates: RelayTxEstimateResponse;
    if (this.useRelay) {
      gasEstimates = await this.estimateTransactionViaRelay(
        relayEstimateRequest
      );
    } else {
      gasEstimates = await this.estimateTransactionDirectly(tx);
    }

    // We need to bump up safeTxGas or TX's fail on Portis/Fortmatic/Torus
    const safeTxGas = new ethers.utils.BigNumber(
      Number(gasEstimates.safeTxGas)
    ).add(1000);
    const baseGas = gasEstimates.baseGas;
    const gasPrice = this.gasPrice;
    const gasToken = this.gasToken;
    const refundReceiver = NULL_ADDRESS;

    const txHashBytes = await this.gnosisSafe.getTransactionHash(
      to,
      value,
      data,
      operation,
      safeTxGas,
      new ethers.utils.BigNumber(Number(baseGas).toFixed()),
      new ethers.utils.BigNumber(Number(gasPrice).toFixed()),
      gasToken,
      refundReceiver,
      nonce
    );

    this._currentSignRequest = this.signer
      .signMessage(ethers.utils.arrayify(txHashBytes))
      .then(
        flatSig => {
          const sig = ethers.utils.splitSignature(flatSig);

          const signatures = [
            {
              s: new BigNumber(sig.s, 16).toFixed(),
              r: new BigNumber(sig.r, 16).toFixed(),
              v: sig.v! + 4,
            },
          ];

          return Object.assign(
            {
              safeTxGas: safeTxGas.toString(),
              dataGas: baseGas,
              gasPrice,
              refundReceiver,
              nonce,
              signatures,
            },
            relayEstimateRequest
          );
        },
        e => {
          console.error('Error during message signing:', e);
          return prevRequest;
        }
      );

    return this._currentSignRequest;
  }
}
