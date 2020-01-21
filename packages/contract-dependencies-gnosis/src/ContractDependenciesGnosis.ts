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
import { ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { getAddress } from 'ethers/utils/address';
import * as _ from 'lodash';

const DEFAULT_GAS_PRICE = new BigNumber(10 ** 9 * 4); // Default: GasPrice: 4
const BASE_GAS_ESTIMATE = '75000';
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const GWEI_CONVERSION = 1000000000;

export class ContractDependenciesGnosis extends ContractDependenciesEthers {
  useRelay = true;
  useSafe = false;
  status = null;

  private _currentSignRequest: Promise<RelayTransaction>;

  gnosisSafe: ethers.Contract;

  constructor(
    provider: EthersProvider,
    public readonly gnosisRelay: IGnosisRelayAPI,
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
    this.gnosisSafe = null;
  }

  initCurrentSignRequest() {
    return this.gnosisSafe
      .nonce()
      .then(nonce => ({
        to: '0x0',
        safe: '0x0',
        data: '',
        gasToken: '0x0',
        safeTxGas: '0x0',
        dataGas: new BigNumber(0),
        gasPrice: DEFAULT_GAS_PRICE,
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
          gasPrice: DEFAULT_GAS_PRICE,
          refundReceiver: '0x0',
          nonce: -1,
          value: new BigNumber(0),
          operation: 0,
          signatures: [],
        };
      });
  }

  setSafeAddress(safeAddress: string): void {
    this.safeAddress = safeAddress;
    this.gnosisSafe = new ethers.Contract(
      safeAddress,
      abi['GnosisSafe'],
      this.signer
    );

    this._currentSignRequest = this.initCurrentSignRequest();
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

  async submitTransaction(transaction: Transaction<BigNumber>): Promise<TransactionReceipt> {
    if (!this.signer) throw new Error("Attempting to sign a transaction while not providing a signer");
    const tx = this.transactionToEthersTransaction(transaction);
    const txMetadataKey = `0x${transaction.data.substring(10)}`;
    const txMetadata = this.transactionDataMetaData[txMetadataKey];
    this.onTransactionStatusChanged(txMetadata, TransactionStatus.AWAITING_SIGNING);
    let hash = undefined;
    try {
      const receipt = await this.sendTransaction(tx, txMetadata);
      hash = receipt.transactionHash;
      const status = receipt.status == 1 ? TransactionStatus.SUCCESS : TransactionStatus.FAILURE;
      this.onTransactionStatusChanged(txMetadata, status, hash);
      // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
      return <TransactionReceipt>receipt;
    } catch (e) {
      if (this.gnosisSafe) {
        this._currentSignRequest = await this.initCurrentSignRequest();
      }

      if (e === TransactionStatus.RELAYER_DOWN) {
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

    if (prevTransaction === relayTransaction) {
      throw new Error('Message signature failed.');
    }

    if (this.useRelay) {
      try {
        txHash = await this.gnosisRelay.execTransaction(relayTransaction);
      } catch (error) {
        this.setUseRelay(false);
        throw TransactionStatus.RELAYER_DOWN;
      }
    } else {
      txHash = await this.execTransactionDirectly(relayTransaction);
    }

    let response = await this.provider.getTransaction(txHash);

    this.onTransactionStatusChanged(
      txMetadata,
      TransactionStatus.PENDING,
      txHash
    );

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
    const gasPrice = new ethers.utils.BigNumber(
      this.gasPrice.multipliedBy(GWEI_CONVERSION).toFixed()
    );

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
      signatures,
      {
        gasLimit,
        gasPrice,
      }
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
      gasPrice: this.gasPrice,
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
