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
import { getAddress } from 'ethers/utils/address';
import * as _ from 'lodash';
import { RelayClient, PreparedTransaction } from './relayclient';

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const RELAY_HUB_ADDRESS = "0xD216153c06E857cD7f72665E0aF1d7D82172F494";
const MIN_GAS_PRICE = new BigNumber(20e9); // Min: 1 Gwei
const DEFAULT_GAS_PRICE = new BigNumber(20e9); // Default: GasPrice: 4 Gwei

export enum WalletState {
  // Wallet address is waiting for funds.
  WAITING_FOR_FUNDS = 'WAITING_FOR_FUNDS',

  // The Wallet address is funded. The TX to create needs to be sent
  FUNDED = 'FUNDED',

  // The TX to create has been sent
  PENDING = 'PENDING',

  // The Wallet is ready for use
  AVAILABLE = 'AVAILABLE',

  // The Relay service is behaving badly
  ERROR = 'ERROR',
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
  status: WalletState = WalletState.WAITING_FOR_FUNDS;
  walletAddress: string = null;
  relayClient: RelayClient;
  relayHub: ethers.Contract;
  augurWalletRegistry: ethers.Contract;

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
    const txHash: string = await this.execTransaction(request.tx);

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
    public gasPrice: BigNumber = DEFAULT_GAS_PRICE,
    address?: string
  ) {
    super(provider, signer, address);
    this.relayClient = new RelayClient(this.provider, { verbose: true });
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
  }

  static async create(
    provider: EthersProvider,
    signer: EthersSigner,
    augurWalletRegistryAddress: string,
    gasPrice: BigNumber = DEFAULT_GAS_PRICE,
    address?: string): Promise<ContractDependenciesGSN> {
      const dependencies = new ContractDependenciesGSN(provider, signer, augurWalletRegistryAddress, gasPrice, address);

      let status = WalletState.WAITING_FOR_FUNDS;
      if (dependencies.signer) {
        const signerAddress = await dependencies.signer.getAddress();
        let walletAddress = await dependencies.augurWalletRegistry.getWallet(signerAddress);
        if (walletAddress !== NULL_ADDRESS) {
          status = WalletState.AVAILABLE;
        }
        if (!walletAddress) {
          walletAddress = await dependencies.augurWalletRegistry.getCreate2WalletAddress(signerAddress);
        }
        dependencies.walletAddress = walletAddress;
      }

      dependencies.setStatus(status);

      return dependencies;
  }

  setStatus(status: WalletState): void {
    this.status = status;
  }

  getStatus(): WalletState {
    return this.status;
  }

  setUseWallet(useWallet: boolean): void {
    this.useWallet = useWallet;
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
      this.onTransactionStatusChanged(txMetadata, TransactionStatus.FAILURE, hash);
      throw e;
    } finally {
      delete this.transactionDataMetaData[txMetadataKey];
    }
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
    if (this.useWallet && this.status === WalletState.AVAILABLE) {
      tx = this.convertToWalletTx(tx);
    }

    if (this.useRelay && tx.to != this.augurWalletRegistry.address) {
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

  convertToWalletTx(tx: Transaction<ethers.utils.BigNumber>): Transaction<ethers.utils.BigNumber> {
    const proxiedTxData =  this.augurWalletRegistry.interface.functions['executeWalletTransaction'].encode([tx.to, tx.data, tx.value]);
    tx.data = proxiedTxData;
    tx.to = this.augurWalletRegistry.address;
    tx.value = new ethers.utils.BigNumber(0);
    return tx;
  }

  async execTransaction(
    relayTransaction: PreparedTransaction
  ): Promise<string> {
    const txHash = await this.relayClient.sendTransaction(relayTransaction);
    return txHash;
  }
}
