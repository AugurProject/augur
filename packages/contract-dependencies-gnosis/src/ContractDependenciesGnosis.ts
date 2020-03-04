import { abi } from '@augurproject/artifacts';
import {
  GnosisRelayAPI,
  GnosisSafeState,
  IGnosisRelayAPI,
  Operation,
  RelayTransaction,
  RelayTxEstimateData,
  RelayTxEstimateResponse,
} from '@augurproject/gnosis-relay-api';
import { BigNumber } from 'bignumber.js';
import { Transaction, TransactionReceipt } from 'contract-dependencies';
import {
  ContractDependenciesEthers,
  EthersProvider,
  EthersSigner,
  TransactionMetadata,
  TransactionStatus,
} from 'contract-dependencies-ethers';
import { AsyncQueue, queue } from 'async';
import { ethers } from 'ethers';
import { getAddress } from 'ethers/utils/address';
import * as _ from 'lodash';

const MIN_GAS_PRICE = new BigNumber(1e9); // Min: 1 Gwei
const DEFAULT_GAS_PRICE = new BigNumber(4e9); // Default: GasPrice: 4 Gwei
const BASE_GAS_ESTIMATE = '75000';
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

interface SigningQueueTask {
  tx: Transaction<ethers.utils.BigNumber>,
  operation: Operation
};

interface RelayerQueueTask {
  tx: RelayTransaction,
  txMetadata: TransactionMetadata
};

export class ContractDependenciesGnosis extends ContractDependenciesEthers {
  useRelay = true;
  useSafe = false;
  status = null;

  private _currentNonce = -1;
  private _signingQueue: AsyncQueue<SigningQueueTask> = queue(async (task: SigningQueueTask) => {
    if (this._currentNonce === -1) {
      this._currentNonce = Number(await this.gnosisSafe.nonce());
    }

    const result = await this.ethersTransactionToRelayTransaction(this._currentNonce, task.tx, task.operation);
    this._currentNonce++;
    return result;
  });

  private _relayQueue: AsyncQueue<RelayerQueueTask> = queue(async (request: RelayerQueueTask) => {
    if (this.useRelay) {
      try {
        const txHash: string = await this.execTransactionOnRelayer(request.tx);

        this.onTransactionStatusChanged(
          request.txMetadata,
          TransactionStatus.PENDING,
          txHash
        );

        return await this.provider.waitForTransaction(txHash);
      }
      catch (error) {
        if (error === TransactionStatus.RELAYER_DOWN) {
          // Relayer down we must clear the queue
          await this._relayQueue.kill();

          this.onTransactionStatusChanged(
            request.txMetadata,
            TransactionStatus.RELAYER_DOWN,
          );
        } else if (error === TransactionStatus.FAILURE) {
          this.onTransactionStatusChanged(
            request.txMetadata,
            TransactionStatus.FAILURE,
          );
        }
        throw error;
      }
    } else {
      // The Relay Service is not being used so we'll execute the TX directly
      const txHash: string = await this.execTransactionDirectly(request.tx);

      this.onTransactionStatusChanged(
        request.txMetadata,
        TransactionStatus.PENDING,
        txHash
      );
      return this.provider.waitForTransaction(txHash);
    }
  });


  gnosisSafe: ethers.Contract;

  constructor(
    provider: EthersProvider,
    readonly gnosisRelay: IGnosisRelayAPI,
    signer?: EthersSigner,
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

  static create(provider: EthersProvider, signer: EthersSigner|undefined, cashAddress: string, gnosisRelayEndpoint?: string): ContractDependenciesGnosis {
    const gnosisRelay = gnosisRelayEndpoint
      ? new GnosisRelayAPI(gnosisRelayEndpoint)
      : undefined;

    return new ContractDependenciesGnosis(provider, gnosisRelay, signer, cashAddress);
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
    this._currentNonce = -1;
    this.gnosisSafe = null;
  }

  setSafeAddress(safeAddress: string) {
    this.safeAddress = safeAddress;
    this._currentNonce = -1;
    this.gnosisSafe = new ethers.Contract(
      safeAddress,
      abi['GnosisSafe'],
      this.signer
    );
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
    if (gasPrice.lt(MIN_GAS_PRICE)) gasPrice = MIN_GAS_PRICE;
    this.gasPrice = gasPrice;
  }

  async submitTransaction(transaction: Transaction<BigNumber>): Promise<TransactionReceipt> {
    if (!this.signer) throw new Error('Attempting to sign a transaction while not providing a signer');
    const tx = this.transactionToEthersTransaction(transaction);
    const txMetadataKey = `0x${transaction.data.substring(10)}`;
    const txMetadata = this.transactionDataMetaData[txMetadataKey];
    this.onTransactionStatusChanged(txMetadata, TransactionStatus.AWAITING_SIGNING);
    let hash = undefined;
    try {
      const receipt = await this.sendTransaction(tx, txMetadata);
      hash = receipt.transactionHash;
      const status = receipt.status === 1 ? TransactionStatus.SUCCESS : TransactionStatus.FAILURE;
      this.onTransactionStatusChanged(txMetadata, status, hash);
      // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
      return receipt as TransactionReceipt;
    } catch (e) {
      if (this.gnosisSafe) {
        this._currentNonce = Number(await this.gnosisSafe.nonce());
      }

      if (e === TransactionStatus.FEE_TOO_LOW) {
        this.onTransactionStatusChanged(txMetadata, TransactionStatus.FEE_TOO_LOW, hash);
        throw Error('Fee too low');
      }
      else if (e === TransactionStatus.RELAYER_DOWN) {
        this.onTransactionStatusChanged(txMetadata, TransactionStatus.RELAYER_DOWN, hash);
        throw Error('Relayer down');
      } else {
        this.onTransactionStatusChanged(txMetadata, TransactionStatus.FAILURE, hash);
        throw e;
      }
    } finally {
      delete this.transactionDataMetaData[txMetadataKey];
    }
  }

  async signTransaction(tx: Transaction<ethers.utils.BigNumber>, operation: Operation = Operation.Call) {
    return new Promise<RelayTransaction>((resolve, reject) => {
      this._signingQueue.push( {tx, operation }, (error, value: RelayTransaction) => {
        if(error) reject(error);
        else resolve(value);
      });
    });
  }

  async sendTransaction(
    tx: Transaction<ethers.utils.BigNumber>,
    txMetadata: TransactionMetadata
  ): Promise<ethers.providers.TransactionReceipt> {
    // Just use normal signing/sending if no safe is configured
    if (!this.useSafe || !this.safeAddress) {
      return super.sendTransaction(tx, txMetadata);
    }

    const relayTransaction = await this.signTransaction(tx);

    return this.waitForTx({ tx: relayTransaction, txMetadata });
  }

  async waitForTx(task: RelayerQueueTask): Promise<ethers.providers.TransactionReceipt> {
    return new Promise((resolve, reject) => {
      this._relayQueue.push(task, (error, value: ethers.providers.TransactionReceipt) => {
        if(error) reject(error);
        else resolve(value);
      });
    });
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
    const relayTransaction = await this.signTransaction(tx, Operation.DelegateCall);
    if (this.useRelay) {
      txHash = await this.execTransactionOnRelayer(relayTransaction);
    } else {
      txHash = await this.execTransactionDirectly(relayTransaction);
    }

    this.onTransactionStatusChanged(
      txMetadata,
      TransactionStatus.PENDING,
      txHash
    );
    return this.provider.waitForTransaction(txHash);
  }

  async estimateGas(transaction: Transaction<BigNumber>): Promise<BigNumber> {
    if (this.useSafe && this.safeAddress && this.useRelay) {
      transaction.from = this.safeAddress;
      return this.relayerEstimateGas(transaction);
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
      gasPrice: new ethers.utils.BigNumber(Number(this.gasPrice).toFixed()),
    };

    const gasEstimates: RelayTxEstimateResponse = await this.estimateTransactionViaRelay(
      relayEstimateRequest
    );
    const safeTxGas = new BigNumber(gasEstimates.safeTxGas);
    const baseGas = new BigNumber(gasEstimates.baseGas);
    return baseGas.plus(safeTxGas);
  }

  async estimateTransactionViaRelay(
    relayEstimateRequest: RelayTxEstimateData
  ): Promise<RelayTxEstimateResponse> {
    return this.gnosisRelay.estimateTransaction(relayEstimateRequest);
  }

  async estimateTransactionDirectly(
    tx: Transaction<ethers.utils.BigNumber>
  ): Promise<RelayTxEstimateResponse> {
    const safeTxGas: BigNumber = await this.estimateGas(
      this.ethersTransactionToTransaction(tx)
    );
    return {
      baseGas: BASE_GAS_ESTIMATE,
      safeTxGas: safeTxGas.toFixed(),
    };
  }

  async execTransactionOnRelayer(
    relayTransaction: RelayTransaction
  ) {
      try {
        return await this.gnosisRelay.execTransaction(relayTransaction);
      } catch (error) {
        const response = error.response;
        const exception = (response.data || {}).exception;
        const status = response.status;
        const isServerError = status >= 500;
        const isMultiError = 'SafeMultisigTxExists';
        console.error(`Gnosis Relay ${status} Error: ${exception}`);
        if (exception && exception.includes('There are too many transactions in the queue')) {
          throw TransactionStatus.FEE_TOO_LOW;
        } else if (isServerError || exception && exception.includes('funds') || exception && exception.includes(isMultiError)) {
          // In the event of a SafeMultisigTxExists, 5XX error or when the relayer has no funds we should consider the relay down
          this.setUseRelay(false);
          this.setStatus(GnosisSafeState.ERROR);
          throw TransactionStatus.RELAYER_DOWN;
        } else {
          throw TransactionStatus.FAILURE;
        }
      }
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
    const gasLimit = new ethers.utils.BigNumber(
      Number(relayTransaction.safeTxGas).toFixed()
    ).add(
      new ethers.utils.BigNumber(Number(relayTransaction.dataGas).toFixed())
    );
    const gasPrice = new ethers.utils.BigNumber(this.gasPrice.toFixed());
    const response = await this.gnosisSafe.execTransaction(
      relayTransaction.to,
      new ethers.utils.BigNumber(Number(relayTransaction.value).toFixed()),
      relayTransaction.data,
      relayTransaction.operation,
      new ethers.utils.BigNumber(Number(relayTransaction.safeTxGas).toFixed()),
      new ethers.utils.BigNumber(Number(relayTransaction.dataGas).toFixed()),
      gasPrice,
      relayTransaction.gasToken,
      relayTransaction.refundReceiver,
      signatures,
      {
        gasLimit,
        gasPrice,
      }
    );
    return response.hash;
  }

  async ethersTransactionToRelayTransaction(
    nonce: number,
    tx: Transaction<ethers.utils.BigNumber>,
    operation: Operation = Operation.Call
  ): Promise<RelayTransaction> {
    const to = tx.to;
    const value = tx.value;
    const data = tx.data;

    const gasPrice = new ethers.utils.BigNumber(this.gasPrice.toFixed()).toNumber();

    const relayEstimateRequest = {
      safe: this.safeAddress,
      to,
      data: tx.data,
      value: new BigNumber(value.toString()),
      operation,
      gasToken: this.gasToken,
      gasPrice,
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

    const flatSig = await this.signer.signMessage(ethers.utils.arrayify(txHashBytes));
    const sig = ethers.utils.splitSignature(flatSig);

    const signatures = [
      {
        s: new BigNumber(sig.s, 16).toFixed(),
        r: new BigNumber(sig.r, 16).toFixed(),
        v: sig.v! + 4,
      },
    ];

    return Object.assign({
        safeTxGas: safeTxGas.toString(),
        dataGas: baseGas,
        gasPrice: new BigNumber(gasPrice),
        refundReceiver,
        nonce,
        signatures,
      },
      relayEstimateRequest
    );
  }
}
