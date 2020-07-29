import { abi } from '@augurproject/artifacts';
import {
  ContractDependenciesEthers,
  EthersSigner,
  Transaction,
  TransactionMetadata,
  TransactionReceipt,
  TransactionStatus,
} from '@augurproject/contract-dependencies-ethers';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { SDKConfiguration } from '@augurproject/utils';
import { AsyncQueue, queue } from 'async';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { formatBytes32String } from 'ethers/utils';
import { PreparedTransaction, RelayClient } from './relayclient';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const RELAY_HUB_ADDRESS = '0xD216153c06E857cD7f72665E0aF1d7D82172F494';

const MIN_GAS_PRICE = new BigNumber(1e9); // Min: 1 Gwei
const DEFAULT_GAS_PRICE = new BigNumber(4e9); // Default: GasPrice: 4 Gwei

const OVEREAD_RELAY_GAS = 500000;
const UNISWAP_MAX_GAS_COST = 150000;
const REFRESH_INTERVAL_MS = 10000; // 10 seconds
const GAS_PRICE_MULTIPLIER = 1.1;
const GAS_COST_MULTIPLIER = 1.05;

const GSN_RELAY_CALL_STATUS = {
  0: 'OK', // The transaction was successfully relayed and execution successful - never included in the event
  1: 'RelayedCallFailed', // The transaction was relayed, but the relayed call failed
  2: 'PreRelayedFailed', // The transaction was not relayed due to preRelatedCall reverting
  3: 'PostRelayedFailed', // The transaction was relayed and reverted due to postRelatedCall reverting
  4: 'RecipientBalanceChanged', // The transaction was relayed and reverted due to the recipient's balance changing
};

interface SigningQueueTask {
  tx: Transaction<ethers.utils.BigNumber>;
  txMetadata: TransactionMetadata;
}

interface RelayerQueueTask {
  tx: PreparedTransaction;
  txMetadata: TransactionMetadata;
}

interface TransactionPaymentData {
  gasCost: BigNumber;
  relayerDaiPayment: BigNumber;
}

export class ContractDependenciesGSN extends ContractDependenciesEthers {
  useRelay = false;
  useWallet = false;
  useDesiredSignerETHBalance = true;
  walletAddress: string = null;
  relayClient: RelayClient;
  relayHub: ethers.Contract;
  augurWalletRegistry: ethers.Contract;
  ethExchange: ethers.Contract;
  cash: ethers.Contract;
  referralAddress: string = NULL_ADDRESS;
  fingerprint: string = formatBytes32String('');
  maxExchangeRate: BigNumber;

  relayGasPrice: BigNumber;
  ethToDaiRate: BigNumber;
  signerAccountETHBalance: BigNumber;
  desiredSignerETHBalance: string;
  walletDaiBalance: BigNumber;

  refreshValuesTimeout = null;

  _currentNonce = -1;

  _signingQueue: AsyncQueue<SigningQueueTask> = queue(
    async (task: SigningQueueTask) => {
      if (this._currentNonce === -1) {
        const nonce = await this.relayHub.getNonce(
          await this.signer.getAddress()
        );
        this._currentNonce = nonce.toNumber();
      }
      const result = await this.validateAndSign(task.tx, task.txMetadata);
      this._currentNonce++;
      return result;
    }
  );

  _relayQueue: AsyncQueue<RelayerQueueTask> = queue(
    async (request: RelayerQueueTask) => {
      const txHash: string = await this.relayClient.sendTransaction(request.tx);

      this.onTransactionStatusChanged(
        request.txMetadata,
        TransactionStatus.PENDING,
        txHash
      );

      return this.provider.waitForTransaction(txHash);
    }
  );

  constructor(
    readonly provider: EthersProvider,
    signer: EthersSigner,
    private config: SDKConfiguration,
    public token0IsCash: boolean,
    address?: string
  ) {
    super(provider, signer, address);
    this.desiredSignerETHBalance = `0x${new BigNumber(
      config.gsn.desiredSignerBalanceInETH * 10 ** 18
    ).toString(16)}`;
    this.relayClient = new RelayClient(this.provider, {
      verbose: false,
      allowedRelayNonceGap: 10,
    });
    this.relayHub = new ethers.Contract(
      RELAY_HUB_ADDRESS,
      abi['RelayHub'],
      provider
    );
    this.augurWalletRegistry = new ethers.Contract(
      this.config.addresses.AugurWalletRegistry,
      abi['AugurWalletRegistry'],
      provider
    );
    this.ethExchange = new ethers.Contract(
      this.config.addresses.EthExchange,
      abi['UniswapV2Pair'],
      provider
    );
    this.cash = new ethers.Contract(
      this.config.addresses.Cash,
      abi['Cash'],
      provider
    );
  }

  static async create(
    provider: EthersProvider,
    signer: EthersSigner,
    config: SDKConfiguration,
    address?: string
  ): Promise<ContractDependenciesGSN> {
    const token0IsCash = new BigNumber(config.addresses.Cash.toLowerCase()).lt(
      config.addresses.WETH9.toLowerCase()
    );
    const deps = new ContractDependenciesGSN(
      provider,
      signer,
      config,
      token0IsCash,
      address
    );
    await deps.refreshValues();
    return deps;
  }

  async manualRefreshValues(): Promise<void> {
    if (this.refreshValuesTimeout) clearTimeout(this.refreshValuesTimeout);
    this.refreshValues();
  }

  setSigner(signer: EthersSigner) {
    this.signer = signer;
    this.walletAddress = null;
    this.manualRefreshValues();
  }

  async refreshValues(): Promise<void> {
    // Refresh Relay Gas price
    // We bypass the Provider wrapper here and directly get the eth rpc api gas price since we do not want overrides.
    const reccomendedGasPrice = await this.provider.provider.getGasPrice();
    this.relayGasPrice = new BigNumber(reccomendedGasPrice.toString())
      .multipliedBy(GAS_PRICE_MULTIPLIER)
      .decimalPlaces(0);

    // Refresh Exchange Rate
    const reservesData = await this.ethExchange.getReserves();
    const cashReserves: BigNumber = new BigNumber(
      (this.token0IsCash ? reservesData[0] : reservesData[1]).toString()
    );
    const ethReserves: BigNumber = new BigNumber(
      (this.token0IsCash ? reservesData[1] : reservesData[0]).toString()
    );
    this.ethToDaiRate = cashReserves
      .div(ethReserves)
      .multipliedBy(10 ** 18)
      .decimalPlaces(0);

    // Set max exchange rate
    this.maxExchangeRate = this.ethToDaiRate
      .multipliedBy(this.config.uniswap.exchangeRateBufferMultiplier)
      .decimalPlaces(0);

    // Refresh signer account ETH balance if possible
    if (this.signer) {
      const signerAddress = await this.signer.getAddress();
      this.signerAccountETHBalance = new BigNumber(
        await (await this.provider.getBalance(signerAddress)).toString()
      );
      if (this.walletAddress === null) {
        this.walletAddress = await this.augurWalletRegistry.getCreate2WalletAddress(signerAddress);
      }
      this.walletDaiBalance = new BigNumber(
        await (await this.cash.balanceOf(this.walletAddress)).toString()
      );
    } else {
      this.signerAccountETHBalance = new BigNumber(0);
    }

    this.refreshValuesTimeout = setTimeout(this.refreshValues.bind(this), REFRESH_INTERVAL_MS);
  }

  setUseWallet(useWallet: boolean): void {
    this.useWallet = useWallet;
  }

  setUseRelay(useRelay: boolean): void {
    this.useRelay = useRelay;
  }

  setUseDesiredEthBalance(useDesiredEthBalance: boolean): void {
    this.useDesiredSignerETHBalance = useDesiredEthBalance;
  }

  setGasPrice(gasPrice: BigNumber): void {
    if (gasPrice.lt(MIN_GAS_PRICE)) gasPrice = MIN_GAS_PRICE;
    this.provider.overrideGasPrice = new ethers.utils.BigNumber(
      gasPrice.toNumber()
    );
  }

  setReferralAddress(referralAddress: string): void {
    this.referralAddress = referralAddress;
  }

  setFingerprint(fingerprint: string): void {
    this.fingerprint = fingerprint;
  }

  async submitTransaction(
    transaction: Transaction<BigNumber>,
    txMetadata?: TransactionMetadata
  ): Promise<TransactionReceipt> {
    if (!this.signer) {
      throw new Error(
        'Attempting to sign a transaction while not providing a signer'
      );
    }
    const tx = this.transactionToEthersTransaction(transaction);
    const txMetadataKey = `0x${transaction.data.substring(10)}`;
    txMetadata = txMetadata ||
      this.transactionDataMetaData[txMetadataKey] || {
        name: 'Unknown Transaction',
        params: {},
      };
    this.onTransactionStatusChanged(
      txMetadata,
      TransactionStatus.AWAITING_SIGNING
    );
    let hash = undefined;
    try {
      const receipt = await this.sendTransaction(tx, txMetadata);
      hash = receipt.transactionHash;
      let status =
        receipt.status === 1
          ? TransactionStatus.SUCCESS
          : TransactionStatus.FAILURE;
      if (receipt.status === 1) {
        // Even though the TX was a "success" the actual delegated call may have failed so we check that status here by parsing relay hub and wallet registry logs
        status = this.parseTransactionLogs(receipt, txMetadata.name, hash);
      }
      this.onTransactionStatusChanged(txMetadata, status, hash);
      // ethers has `status` on the receipt as optional, even though it isn't and never will be undefined if using a modern network (which this is designed for)
      return receipt as TransactionReceipt;
    } catch (e) {
      this._currentNonce = -1;
      this.onTransactionStatusChanged(
        txMetadata,
        TransactionStatus.FAILURE,
        hash,
        e.message
      );
      throw e;
    } finally {
      delete this.transactionDataMetaData[txMetadataKey];
    }
  }

  parseTransactionLogs(
    txReceipt: ethers.providers.TransactionReceipt,
    txName: string,
    txHash: string
  ): TransactionStatus {
    if (this.useRelay) {
      const transactionRelayedLog = this.relayHub.interface.parseLog(
        txReceipt.logs[txReceipt.logs.length - 1]
      );
      // Even if the relay option is on we will bypass the relay if ETH is available to the signer
      if (
        transactionRelayedLog &&
        transactionRelayedLog.name === 'TransactionRelayed'
      ) {
        txReceipt.logs.pop();
        const callStatus = new BigNumber(transactionRelayedLog.values.status);
        if (callStatus.gt(0)) {
          const reason = GSN_RELAY_CALL_STATUS[callStatus.toNumber()];
          console.error(
            `TX ${txName} with hash ${txHash} failed in Relay Machinery. Error Reason: ${reason}`
          );
          return TransactionStatus.FAILURE;
        }
        // Pop the deposit log
        txReceipt.logs.pop();
      }
    }
    if (this.useWallet) {
      const executeTransactionStatusLog = this.augurWalletRegistry.interface.parseLog(
        txReceipt.logs.pop()
      );
      const transactionSuccess = executeTransactionStatusLog.values.success;
      if (!transactionSuccess) {
        console.error(
          `TX ${txName} with hash ${txHash} failed the transaction execution.`
        );
        return TransactionStatus.FAILURE;
      }
    }
    return TransactionStatus.SUCCESS;
  }

  async validateAndSign(
    tx: Transaction<ethers.utils.BigNumber>,
    txMetadata: TransactionMetadata
  ): Promise<PreparedTransaction> {
    const relayOptions = this.relayClient.getTransactionOptions(
      tx,
      this.relayGasPrice.toNumber()
    );
    relayOptions.gas_limit = tx.gasLimit.toNumber();
    const preparedTx = await this.relayClient.selectRelayAndGetTxHash(
      tx.data,
      relayOptions,
      this._currentNonce
    );
    preparedTx.signature = await this.signer.signMessage(
      ethers.utils.arrayify(preparedTx.txHash)
    );
    return preparedTx;
  }

  async sendTransaction(
    tx: Transaction<ethers.utils.BigNumber>,
    txMetadata: TransactionMetadata
  ): Promise<ethers.providers.TransactionReceipt> {
    const signerEthBalance = await this.provider.getBalance(
      await this.signer.getAddress()
    );
    const paymentData = await this.getTransactionPaymentData(tx);
    if (this.useWallet) {
      console.log(
        'Transaction Payment (DAI)',
        paymentData.relayerDaiPayment.dividedBy(10 ** 18).toFixed()
      );
      tx = this.convertToWalletTx(
        tx,
        new ethers.utils.BigNumber(paymentData.relayerDaiPayment.toFixed())
      );
    }

    if (this.useRelay && tx.to !== this.augurWalletRegistry.address) {
      throw new Error(
        'Cannot use GSN relay to process TXs except to create a wallet or send wallet transaction execution requests'
      );
    }

    let gasLimit = paymentData.gasCost.multipliedBy(GAS_COST_MULTIPLIER);
    gasLimit = BigNumber.min(gasLimit, this.provider.gasLimit.toNumber());

    // Just use normal signing/sending if the signer has sufficient ETH or if we're not using the relay
    const gasPrice = await this.provider.getGasPrice();
    const ethCost = paymentData.gasCost.multipliedBy(gasPrice.toString());
    if (!this.useRelay || signerEthBalance.gt(ethCost.toString())) {
      tx.gasPrice = gasPrice;
      tx.gasLimit = new ethers.utils.BigNumber(
        gasLimit.decimalPlaces(0).toString()
      );
      return super.sendTransaction(tx, txMetadata);
    }

    tx.gasLimit = new ethers.utils.BigNumber(gasLimit.decimalPlaces(0).toString());

    const relayTransaction = await this.signTransaction(tx, txMetadata);

    return this.waitForTx({ tx: relayTransaction, txMetadata });
  }

  async signTransaction(
    tx: Transaction<ethers.utils.BigNumber>,
    txMetadata: TransactionMetadata
  ) {
    return new Promise<PreparedTransaction>((resolve, reject) => {
      this._signingQueue.push(
        { tx, txMetadata },
        (error, value: PreparedTransaction) => {
          if (error) reject(error);
          else resolve(value);
        }
      );
    });
  }

  async waitForTx(
    task: RelayerQueueTask
  ): Promise<ethers.providers.TransactionReceipt> {
    return new Promise((resolve, reject) => {
      this._relayQueue.push(
        task,
        (error, value: ethers.providers.TransactionReceipt) => {
          if (error) reject(error);
          else resolve(value);
        }
      );
    });
  }

  convertToWalletTx(
    tx: Transaction<ethers.utils.BigNumber>,
    payment?: ethers.utils.BigNumber,
    revertOnFailure = false
  ): Transaction<ethers.utils.BigNumber> {
    payment = payment || new ethers.utils.BigNumber(0); // For gas estimates we use a payment of 0 dai as no payment is required
    const maxExchangeRate = `0x${this.maxExchangeRate}`;
    const desiredSignerETHBalance = this.useDesiredSignerETHBalance ? this.walletDaiBalance.isGreaterThan(this.config.gsn.minDaiForSignerETHBalanceInDAI * 10**18) ? this.desiredSignerETHBalance : "0x00" : "0x00";
    const data = this.augurWalletRegistry.interface.functions[
      'executeWalletTransaction'
    ].encode([
      tx.to,
      tx.data,
      tx.value,
      payment,
      this.referralAddress,
      this.fingerprint,
      desiredSignerETHBalance,
      maxExchangeRate,
      revertOnFailure,
    ]);
    return {
      data,
      to: this.augurWalletRegistry.address,
      from: tx.from,
    };
  }

  async estimateGas(transaction: Transaction<BigNumber>): Promise<BigNumber> {
    const ethersTransaction = this.transactionToEthersTransaction(transaction);
    return this.estimateGasForEthersTransaction(ethersTransaction);
  }

  async estimateGasForEthersTransaction(
    transaction: Transaction<ethers.utils.BigNumber>
  ): Promise<BigNumber> {
    if (this.useWallet) {
      transaction = this.convertToWalletTx(
        transaction,
        new ethers.utils.BigNumber(0),
        true
      );
    }
    if (this.useRelay) {
      const estimate = await this.relayClient.estimateGas(transaction);
      return new BigNumber(estimate);
    }
    return super.estimateGasForEthersTransaction(transaction);
  }

  async getRelayPayment(
    transaction: Transaction<BigNumber>
  ): Promise<BigNumber> {
    const ethersTransaction = this.transactionToEthersTransaction(transaction);
    const txPaymentData = await this.getTransactionPaymentData(
      ethersTransaction
    );
    return txPaymentData.relayerDaiPayment;
  }

  async getTransactionPaymentData(
    tx: Transaction<ethers.utils.BigNumber>
  ): Promise<TransactionPaymentData> {
    const gasCost = await this.estimateGasForEthersTransaction(tx);
    let relayerDaiPayment = new BigNumber(0);
    if (this.useWallet && this.useRelay) {
      relayerDaiPayment = this.convertGasEstimateToDaiCost(gasCost);
    }
    return {
      gasCost,
      relayerDaiPayment,
    };
  }

  convertGasEstimateToDaiCost(gasEstimate: BigNumber | string): BigNumber {
    gasEstimate = new BigNumber(gasEstimate);
    gasEstimate = gasEstimate.plus(OVEREAD_RELAY_GAS);
    gasEstimate = gasEstimate.plus(UNISWAP_MAX_GAS_COST);
    gasEstimate = gasEstimate.multipliedBy(GAS_COST_MULTIPLIER);
    let ethCost = gasEstimate.multipliedBy(this.relayGasPrice);
    ethCost = ethCost.multipliedBy((100 + this.relayClient.config.txFee) / 100);
    let cashCost = ethCost.multipliedBy(this.ethToDaiRate).div(10 ** 18);
    cashCost = cashCost.multipliedBy(this.config.uniswap.exchangeRateBufferMultiplier);
    return cashCost.decimalPlaces(0);
  }

  getDisplayCostInDaiForGasEstimate(
    gasEstimate: BigNumber | string,
    manualGasPrice?: number
  ): BigNumber {
    let tempGasEstimate = new BigNumber(gasEstimate);
    tempGasEstimate = tempGasEstimate.multipliedBy(GAS_COST_MULTIPLIER);
    const specifiedGasPrice = this.provider.overrideGasPrice
      ? this.provider.overrideGasPrice.toNumber()
      : this.relayGasPrice;
    const gasPrice = manualGasPrice || specifiedGasPrice;
    const ethCost = tempGasEstimate.multipliedBy(gasPrice);

    if (!this.useRelay || this.signerAccountETHBalance.gt(ethCost.toString())) {
      let cashCost = ethCost.multipliedBy(this.ethToDaiRate).div(10 ** 18);
      cashCost = cashCost.multipliedBy(this.config.uniswap.exchangeRateBufferMultiplier);
      return cashCost.decimalPlaces(0);
    }

    return this.convertGasEstimateToDaiCost(gasEstimate);
  }
}
