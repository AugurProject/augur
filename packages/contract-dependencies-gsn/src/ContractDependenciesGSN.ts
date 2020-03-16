import { abi } from '@augurproject/artifacts';
import { BigNumber } from 'bignumber.js';
import { Transaction, TransactionReceipt, AbiFunction, AbiParameter } from 'contract-dependencies';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import {
  ContractDependenciesEthers,
  EthersSigner,
  TransactionMetadata,
  TransactionStatus,
} from 'contract-dependencies-ethers';
import { AsyncQueue, queue } from 'async';
import { ethers } from 'ethers';
import * as _ from 'lodash';
import { RelayClient, PreparedTransaction } from './relayclient';
import { formatBytes32String } from 'ethers/utils';


const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const RELAY_HUB_ADDRESS = "0xD216153c06E857cD7f72665E0aF1d7D82172F494";
const MIN_GAS_PRICE = new BigNumber(20e9); // Min: 1 Gwei
const DEFAULT_GAS_PRICE = new BigNumber(20e9); // Default: GasPrice: 4 Gwei

const OVEREAD_RELAY_GAS = 400000;

const GSN_RELAY_CALL_STATUS = {
  0: "OK",                      // The transaction was successfully relayed and execution successful - never included in the event
  1: "RelayedCallFailed",       // The transaction was relayed, but the relayed call failed
  2: "PreRelayedFailed",        // The transaction was not relayed due to preRelatedCall reverting
  3: "PostRelayedFailed",       // The transaction was relayed and reverted due to postRelatedCall reverting
  4: "RecipientBalanceChanged"  // The transaction was relayed and reverted due to the recipient's balance changing
}

interface SigningQueueTask {
  tx: Transaction<ethers.utils.BigNumber>,
};

interface RelayerQueueTask {
  tx: PreparedTransaction,
  txMetadata: TransactionMetadata
};

export class ContractDependenciesGSN extends ContractDependenciesEthers {
  useRelay: boolean = false;
  useWallet: boolean = false;
  walletAddress: string = null;
  relayClient: RelayClient;
  relayHub: ethers.Contract;
  augurWalletRegistry: ethers.Contract;
  ethExchange: ethers.Contract;
  referralAddress: string = NULL_ADDRESS;
  fingerprint: string = formatBytes32String('');

  _currentNonce = -1;

  _signingQueue: AsyncQueue<SigningQueueTask> = queue(async (task: SigningQueueTask) => {
    if (this._currentNonce === -1) {
      const nonce = await this.relayHub.getNonce(await this.signer.getAddress());
      this._currentNonce = nonce.toNumber();
    }
    const result = await this.validateAndSign(task.tx);
    this._currentNonce++;
    return result;
  });

  _relayQueue: AsyncQueue<RelayerQueueTask> = queue(async (request: RelayerQueueTask) => {
    const txHash: string = await this.relayClient.sendTransaction(request.tx);

    this.onTransactionStatusChanged(
      request.txMetadata,
      TransactionStatus.PENDING,
      txHash
    );

    return this.provider.waitForTransaction(txHash);
  });

  constructor(
    readonly provider: EthersProvider,
    signer: EthersSigner,
    augurWalletRegistryAddress: string,
    ethExchangeAddress: string,
    public gasPrice: BigNumber = DEFAULT_GAS_PRICE,
    address?: string
  ) {
    super(provider, signer, address);
    this.relayClient = new RelayClient(this.provider, { verbose: false });
    this.relayHub = new ethers.Contract(
      RELAY_HUB_ADDRESS,
      abi['RelayHub'],
      provider
    );
    this.augurWalletRegistry = new ethers.Contract(
      augurWalletRegistryAddress,
      abi['AugurWalletRegistry'],
      provider
    );
    this.ethExchange = new ethers.Contract(
      ethExchangeAddress,
      abi['EthExchange'],
      provider
    );
  }

  static async create(
    provider: EthersProvider,
    signer: EthersSigner,
    augurWalletRegistryAddress: string,
    ethExchangeAddress: string,
    gasPrice: BigNumber = DEFAULT_GAS_PRICE,
    address?: string): Promise<ContractDependenciesGSN> {
      return new ContractDependenciesGSN(provider, signer, augurWalletRegistryAddress, ethExchangeAddress, gasPrice, address);
  }

  setUseWallet(useWallet: boolean): void {
    this.useWallet = useWallet;
  }

  setUseRelay(useRelay: boolean): void {
    this.useRelay = useRelay;
  }

  setReferralAddress(referralAddress: string): void {
    this.referralAddress = referralAddress;
  }

  setFingerprint(fingerprint: string): void {
    this.fingerprint = fingerprint;
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
      let status = receipt.status === 1 ? TransactionStatus.SUCCESS : TransactionStatus.FAILURE;
      if (receipt.status === 1) {
        // Even though the TX was a "success" the actual delegated call may have failed so we check that status here by parsing relay hub and wallet registry logs
        status = this.parseTransactionLogs(receipt, txMetadata.name, hash);
      }
      this.onTransactionStatusChanged(txMetadata, status, hash);
      // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
      return receipt as TransactionReceipt;
    } catch (e) {
      this._currentNonce = -1;
      this.onTransactionStatusChanged(txMetadata, TransactionStatus.FAILURE, hash);
      throw e;
    } finally {
      delete this.transactionDataMetaData[txMetadataKey];
    }
  }

  parseTransactionLogs(txReceipt: ethers.providers.TransactionReceipt, txName: string, txHash: string): TransactionStatus {
    if (this.useRelay) {
      const transactionRelayedLog = this.relayHub.interface.parseLog(txReceipt.logs.pop());
      const callStatus = new BigNumber(transactionRelayedLog.values.status);
      if (callStatus.gt(0)) {
        const reason = GSN_RELAY_CALL_STATUS[callStatus.toNumber()];
        console.error(`TX ${txName} with hash ${txHash} failed in Relay Machinery. Error Reason: ${reason}`)
        return TransactionStatus.FAILURE;
      }
      // Pop the deposit log
      txReceipt.logs.pop();
    }
    if (this.useWallet) {
      const executeTransactionStatusLog = this.augurWalletRegistry.interface.parseLog(txReceipt.logs.pop());
      const transactionSuccess = executeTransactionStatusLog.values.success;
      if (!transactionSuccess) {
        console.error(`TX ${txName} with hash ${txHash} failed the transaction execution.`)
        return TransactionStatus.FAILURE;
      }
    }
    return TransactionStatus.SUCCESS;
  }

  async validateAndSign(tx: Transaction<ethers.utils.BigNumber>): Promise<PreparedTransaction> {
    const relayOptions = this.relayClient.getTransactionOptions(tx, this.gasPrice.toNumber());
    const preparedTx = await this.relayClient.selectRelayAndGetTxHash(tx.data, relayOptions, this._currentNonce);
    preparedTx.signature = await this.signer.signMessage(ethers.utils.arrayify(preparedTx.txHash));
    return preparedTx;
  }

  async sendTransaction(
    tx: Transaction<ethers.utils.BigNumber>,
    txMetadata: TransactionMetadata
  ): Promise<ethers.providers.TransactionReceipt> {
    if (this.useWallet) {
      const payment = await this.getRelayPaymentForEthersTransaction(tx);
      tx = this.convertToWalletTx(tx, new ethers.utils.BigNumber(payment.toFixed()));
    }

    if (this.useRelay && tx.to !== this.augurWalletRegistry.address) {
      throw new Error("Cannot use GSN relay to process TXs except to create a wallet or send wallet transaction execution requests");
    }

    // Just use normal signing/sending if we're not using the relay
    if (!this.useRelay) {
      return super.sendTransaction(tx, txMetadata);
    }

    const relayTransaction = await this.signTransaction(tx);

    return this.waitForTx({ tx: relayTransaction, txMetadata });
  }

  async signTransaction(tx: Transaction<ethers.utils.BigNumber>) {
    return new Promise<PreparedTransaction>((resolve, reject) => {
      this._signingQueue.push( {tx }, (error, value: PreparedTransaction) => {
        if(error) reject(error);
        else resolve(value);
      });
    });
  }

  async waitForTx(task: RelayerQueueTask): Promise<ethers.providers.TransactionReceipt> {
    return new Promise((resolve, reject) => {
      this._relayQueue.push(task, (error, value: ethers.providers.TransactionReceipt) => {
        if(error) reject(error);
        else resolve(value);
      });
    });
  }

  convertToWalletTx(tx: Transaction<ethers.utils.BigNumber>, payment?: ethers.utils.BigNumber): Transaction<ethers.utils.BigNumber> {
    payment = payment || new ethers.utils.BigNumber(0); // For gas estimates we use a payment of 0 dai as no payment is required
    const data =  this.augurWalletRegistry.interface.functions['executeWalletTransaction'].encode([tx.to, tx.data, tx.value, payment, this.referralAddress, this.fingerprint]);
    return {
      data,
      to: this.augurWalletRegistry.address,
      from: tx.from
    }
  }

  async estimateGas(transaction: Transaction<BigNumber>): Promise<BigNumber> {
    let ethersTransaction = this.transactionToEthersTransaction(transaction);
    return this.estimateGasForEthersTransaction(ethersTransaction);
  }

  async estimateGasForEthersTransaction(transaction: Transaction<ethers.utils.BigNumber>): Promise<BigNumber> {
    if (this.useWallet) {
      transaction = this.convertToWalletTx(transaction);
    }
    if (this.useRelay) {
      const estimate = await this.relayClient.estimateGas(transaction);
      return new BigNumber(estimate);
    }
    return super.estimateGasForEthersTransaction(transaction);
  }

  async getRelayPayment(transaction: Transaction<BigNumber>): Promise<BigNumber> {
    const ethersTransaction = this.transactionToEthersTransaction(transaction);
    return this.getRelayPaymentForEthersTransaction(ethersTransaction);
  }

  async getRelayPaymentForEthersTransaction(tx: Transaction<ethers.utils.BigNumber>): Promise<BigNumber> {
    if (!this.useWallet || !this.useRelay) return new BigNumber(0);
    let gasEstimate = await this.estimateGasForEthersTransaction(tx);
    gasEstimate = gasEstimate.plus(OVEREAD_RELAY_GAS);
    let ethCost = gasEstimate.multipliedBy(this.gasPrice);
    ethCost = ethCost.multipliedBy((100+this.relayClient.config.txFee) / 100);
    const cashCost: ethers.utils.BigNumber = await this.ethExchange.getTokenPurchaseCost('0x'+ethCost.toString(16));
    let cost = new BigNumber(cashCost.toString());
    cost = cost.multipliedBy(1.15); // account for slippage; CONSIDER: make this configurable?
    return cost.decimalPlaces(0);
  }
}
