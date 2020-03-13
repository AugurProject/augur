import { ethers } from 'ethers';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { Transaction } from 'contract-dependencies';
import { HttpWrapper } from './HttpWrapper';
import {
    parseHexString,
    removeHexPrefix,
    padTo64,
    appendAddress,
    toInt,
    preconditionCodeToDescription,
    createRelayHubFromRecipient,
    getTransactionHash,
    getEcRecoverMeta
} from './utils';
import { ServerHelperConfig, ServerHelper, Relay } from './ServerHelper';
import { BigNumber } from 'bignumber.js';
import * as ethUtils from 'ethereumjs-util';
import { Transaction as ethJsTx } from 'ethereumjs-tx';
import * as abi_decoder from 'abi-decoder';
import * as _ from 'lodash';

const relayHubAbi = require('./IRelayHub');

const relay_lookup_limit_blocks = 6000;
abi_decoder.addABI(relayHubAbi);

// default timeout (in ms) for http requests
const DEFAULT_HTTP_TIMEOUT = 10000;

const RELAY_HUB_ADDRESS = "0xD216153c06E857cD7f72665E0aF1d7D82172F494";

export interface TransactionOptions {
    from: string,
    to: string,
    txfee: number,
    gas_price: number,
    gas_limit?: number,
}

export interface PreparedTransaction {
    encodedFunctionCall: string,
    options: TransactionOptions,
    relay: Relay,
    txHash: string;
    nonce: number,
    signature?: string;
}

export interface RelayClientConfig extends ServerHelperConfig {
    httpTimeout?: number,
    txFee?: number,
    gasPriceFactorPercent?: number,
    userAgent?: string,
    preferredRelayer?: Relay,
    allowedRelayNonceGap?: number,
}

export class RelayClient {
    config: RelayClientConfig;
    provider: EthersProvider;
    httpSend: HttpWrapper;
    serverHelper: ServerHelper;
    failedRelays: {[key: string]: Relay};

  /**
   * create a RelayClient library object, to force contracts to go through a relay.
   * @param web3  - the web3 instance to use.
   * @param {object} config options
   *    txfee
   *lookup for relay
   *    minStake - ignore relays with stake below this (wei) value.
   *    minDelay - ignore relays with delay lower this (sec) value
   *
   *    calculateRelayScore - function to give a "score" to a relay, based on its properties:
   *          transactionFee, stake, unstakeDelay, relayUrl.
   *          return null to filter-out the relay completely
   *          default function uses just trasnactionFee (gives highest score to lowest fee)
   *
   *    gaspriceFactorPercent - increase (in %) over current gasPrice average. default is 10%.
   *          Note that the resulting gasPrice must be accepted by relay (above its minGasPrice)
   *
   *manual settings: these can be used to override the default setting.
   *    preferredRelayer - skip relayer lookup and use this preferred relayer, fallbacking to regular lookup on error
   *       An example preferredRelayer configuration:
   *        {
   *          RelayServerAddress: '0x73a652f54d5fd8273f17a28e206d47f5bd1bc06a',
   *          relayUrl: 'http://localhost:8090',
   *          transactionFee: '70'
   *        }
   *       These values can be be retrieved from the `/getaddr` endpoint of a relayer. e.g `curl http://localhost:8090/getaddr`
   *    force_gasLimit - force gaslimit, instead of transaction paramter
   *    force_gasPrice - force gasPrice, instread of transaction parameter.
   */
  constructor(provider: EthersProvider, config: RelayClientConfig) {
    //fill in defaults:
    this.config = Object.assign(
      {
        httpTimeout: DEFAULT_HTTP_TIMEOUT,
        txFee: 70,
      },
      config,
    );

    this.provider = provider;
    this.httpSend = new HttpWrapper({ timeout: this.config.httpTimeout });
    this.failedRelays = {};
    this.serverHelper = new ServerHelper(this.httpSend, this.failedRelays, this.config);
  }

  getTransactionOptions(transaction: Transaction<ethers.utils.BigNumber>, gasPrice: number): TransactionOptions {
    const relayClientOptions = this.config;
    let relayOptions = {
      from: transaction.from,
      to: transaction.to,
      txfee: relayClientOptions.txFee,
      gas_price: gasPrice,
    };
    if (relayClientOptions.verbose) console.log('RR: ', relayOptions);
    return relayOptions;
  }

  async sendTransaction(preparedTx: PreparedTransaction) {
    const tx = await this.relayTransaction(preparedTx.encodedFunctionCall, preparedTx.options, preparedTx.signature, preparedTx.relay, preparedTx.txHash, preparedTx.nonce);
    return ethUtils.bufferToHex(tx.hash(true));
  }

  /**
   * Decode the signed transaction returned from the Relay Server, compare it to the
   * requested transaction and validate its signature.
   * @returns a signed {@link ethJsTx} instance for broacasting, or null if returned
   * transaction is not valid.
   */
  validateRelayResponse(
    returned_tx: any,
    address_relay: string,
    from: string,
    to: string,
    transaction_orig: string,
    transaction_fee: number,
    gas_price: number,
    gas_limit: number,
    nonce: number,
    relay_hub_address: string,
    relay_address: string,
    sig: string,
    approvalData: string,
  ): ethJsTx {
    var tx = new ethJsTx({
      nonce: returned_tx.nonce,
      gasPrice: returned_tx.gasPrice,
      gasLimit: returned_tx.gas,
      to: returned_tx.to,
      value: returned_tx.value,
      data: returned_tx.input,
      v: returned_tx.v,
      r: returned_tx.r,
      s: returned_tx.s
    });

    from = from.toLowerCase();
    to = to.toLowerCase();
    relay_hub_address = relay_hub_address.toLowerCase();
    relay_address = relay_address.toLowerCase();
    let message = ethUtils.rlphash(tx.raw.slice(0, 6));
    let tx_v = parseInt(returned_tx.v, 16);
    let tx_r = Buffer.from(padTo64(removeHexPrefix(returned_tx.r)), 'hex');
    let tx_s = Buffer.from(padTo64(removeHexPrefix(returned_tx.s)), 'hex');

    let signer = ethUtils.bufferToHex(ethUtils.pubToAddress(ethUtils.ecrecover(message, tx_v, tx_r, tx_s)));
    let request_decoded_params = abi_decoder.decodeMethod(returned_tx.input).params;
    let returned_tx_params_hash = getTransactionHash(
      request_decoded_params[0].value,
      request_decoded_params[1].value,
      request_decoded_params[2].value,
      request_decoded_params[3].value,
      request_decoded_params[4].value,
      request_decoded_params[5].value,
      request_decoded_params[6].value,
      returned_tx.to,
      signer,
    );
    let transaction_orig_params_hash = getTransactionHash(
      from,
      to,
      transaction_orig,
      transaction_fee,
      gas_price,
      gas_limit,
      nonce,
      relay_hub_address,
      relay_address,
    );

    if (returned_tx_params_hash === transaction_orig_params_hash && address_relay === signer) {
      if (this.config.verbose) {
        console.log('validateRelayResponse - valid transaction response');
      }
      return tx;
    } else {
      console.error(`tx hashes: returned: ${returned_tx_params_hash} original: ${transaction_orig_params_hash}`);
      console.error('validateRelayResponse: req', JSON.stringify(request_decoded_params));
      console.error('validateRelayResponse: rsp', {
        returned_tx,
        address_relay,
        from,
        to,
        transaction_orig,
        transaction_fee,
        gas_price,
        gas_limit,
        nonce,
        sig,
        approvalData,
        signer,
      });
    }
    return null;
  }

  /**
   * Performs a '/relay' HTTP request to the given url
   * @returns a Promise that resolves to an instance of {@link ethJsTx} signed by a relay
   */
  async sendViaRelay(
    relayAddress: string,
    from: string,
    to: string,
    encodedFunction: string,
    relayFee: number,
    gasprice: number,
    gaslimit: number,
    recipientNonce: number,
    signature: string,
    approvalData: string,
    relayUrl: string,
    relayHubAddress: string,
    relayMaxNonce: number,
  ): Promise<any> {
      const jsonRequestData = {
        encodedFunction: encodedFunction,
        signature: parseHexString(signature.replace(/^0x/, '')),
        approvalData: parseHexString(approvalData.replace(/^0x/, '')),
        from: from,
        to: to,
        gasPrice: gasprice,
        gasLimit: gaslimit,
        relayFee: relayFee,
        RecipientNonce: recipientNonce,
        RelayMaxNonce: relayMaxNonce,
        RelayHubAddress: relayHubAddress,
      };
      try {
        if (this.config.verbose) {
          console.log('sendViaRelay to URL: ' + relayUrl + ' ' + JSON.stringify(jsonRequestData));
        }
        const response = await this.httpSend.send(relayUrl + '/relay', { ...jsonRequestData, userAgent: this.config.userAgent });
        if (this.config.verbose) {
            console.log('sendViaRelay resp=', response);
        }
        if (response && response.error) {
            throw new Error(response.error);
        }
        if (!response || !response.nonce) {
            throw new Error("Empty body received from server, or neither 'error' nor 'nonce' fields present.");
        }

        let validTransaction;
        try {
            validTransaction = this.validateRelayResponse(
                response,
                relayAddress,
                from,
                to,
                encodedFunction,
                relayFee,
                gasprice,
                gaslimit,
                recipientNonce,
                relayHubAddress,
                relayAddress,
                signature,
                approvalData,
            );
        } catch (error) {
            console.error('validateRelayResponse ' + error);
        }

        if (!validTransaction) {
            throw new Error('Failed to validate response');
        }
        const receivedNonce = validTransaction.nonce.readUIntBE(0, validTransaction.nonce.byteLength);
        if (receivedNonce > relayMaxNonce) {
            // TODO: need to validate that client retries the same request and doesn't double-spend.
            // Note that this transaction is totally valid from the EVM's point of view
            throw new Error('Relay used a tx nonce higher than requested. Requested ' + relayMaxNonce + ' got ' + receivedNonce);
        }

        const raw_tx = '0x' + validTransaction.serialize().toString('hex');
        const txHash = '0x' + validTransaction.hash(true).toString('hex');
        if (this.config.verbose) console.log('txHash= ' + txHash);
        await this.broadcastRawTx(raw_tx);
        return validTransaction;
      } catch (err) {
        if (err.error && err.error.indexOf('timeout') != -1) {
            this.failedRelays[relayUrl] = {
              lastError: new Date().getTime(),
              address: relayAddress,
              relayUrl,
            };
        }
        throw err;
      }
  }

  /**
   * In case Relay Server does not broadcast the signed transaction to the network,
   * client also broadcasts the same transaction. If the transaction fails with nonce
   * error, it indicates Relay may have signed multiple transactions with same nonce,
   * causing a DoS attack.
   *
   * @param {*} raw_tx - raw transaction bytes, signed by relay
   * @param {*} tx_hash - this transaction's ID
   */
  async broadcastRawTx(raw_tx: string): Promise<void> {
    try {
      await this.provider.provider.sendTransaction(raw_tx);
    } catch (err) {
      // This is what we want to be the case
      if (err.responseText.includes("known transaction")) {
        return;
      }
      throw err;
    }
  }

  /**
   * check the balance of the given target contract.
   * the method will fail if the target is not a RelayRecipient.
   * (not strictly a client operation, but without a balance, the target contract can't accept calls)
   */
  async balanceOf(target: string) {
    const relayHub = await createRelayHubFromRecipient(this.provider, target);

    //note that the returned value is a promise too, returning BigNumber
    return relayHub.balanceOf(target);
  }

  async selectRelayAndGetTxHash(encodedFunctionCall: string, options: TransactionOptions, nonce: number): Promise<PreparedTransaction> {
    const relayHub = await createRelayHubFromRecipient(this.provider, options.to);

    this.serverHelper.setHub(relayHub);

    const gasPrice = options.gas_price;
    let gasLimit = options.gas_limit;

    // If we don't have a gas limit, then estimate it, since we need a concrete value for checking the recipient balance
    try {
      if (!gasLimit) {
        gasLimit = await this.estimateGas(
          {
            to: options.to,
            from: options.from,
            gasPrice,
            data: encodedFunctionCall,
          },
        );
      }
    } catch (err) {
      throw new Error(
        `Error estimating gas usage for transaction (${err.message}). Make sure the transaction is valid, or set a fixed gas value.`,
      );
    }

    options.gas_limit = gasLimit;

    // Check that the recipient has enough balance in the hub, assuming a relaying fee of zero
    await this.validateRecipientBalance(relayHub, options.to, gasLimit, gasPrice, 0);

    const blockNow = await this.provider.getBlockNumber();
    const blockFrom = Math.max(1, blockNow - relay_lookup_limit_blocks);
    const pinger = await this.serverHelper.newActiveRelayPinger(blockFrom, gasPrice);
    const errors = [];

    let relay: Relay;
      // Relayer lookup - we prefer the preferred relayer, but default to regular lookup on failure
    if (this.config.preferredRelayer !== undefined) {
        relay = this.config.preferredRelayer;
    } else {
        const nextRelay = await pinger.nextRelay();

        if (nextRelay) {
            relay = nextRelay;
        } else {
            const subErrors = errors.concat(pinger.errors);
            const error = new Error(
            `No relayer responded or accepted the transaction out of the ${
                pinger.pingedRelays
            } queried:\n${subErrors.map(err => ` ${err}`).join('\n')}`,
            );
            throw error;
        }
    }

    const relayAddress = relay.RelayServerAddress;
    relay.address = relay.RelayServerAddress;
    let txfee = options.txfee || relay.transactionFee;

    let txHash = getTransactionHash(
        options.from,
        options.to,
        encodedFunctionCall,
        txfee,
        gasPrice,
        gasLimit,
        nonce,
        RELAY_HUB_ADDRESS,
        relayAddress,
    );

    return {
        txHash,
        relay,
        encodedFunctionCall,
        options,
        nonce
    }
  }

  /**
   * Options include standard transaction params: from,to, gasprice, gaslimit
   * can also override default relayUrl, relayFee
   * return value is the same as from sendTransaction
   */
  async relayTransaction(encodedFunctionCall: string, options: any, signature: string, relay: Relay, hash: string, nonce: number): Promise<any> {
    const gasPrice = options.gas_price;
    const gasLimit = options.gas_limit;
    const txfee = options.txfee;

    const errors = [];

    if (this.config.verbose) {
        console.log('relayTransaction hash: ', hash, 'from: ', options.from, 'sig: ', signature);
        let rec = getEcRecoverMeta(hash, signature);
        if (rec.toLowerCase() === options.from.toLowerCase()) {
            console.log('relayTransaction recovered:', rec, 'signature is correct');
        } else {
            console.error('relayTransaction recovered:', rec, 'signature error');
        }
    }

    // max nonce is not signed, as contracts cannot access addresses' nonces.
    let allowed_relay_nonce_gap = this.config.allowedRelayNonceGap;
    if (typeof allowed_relay_nonce_gap === 'undefined') {
        allowed_relay_nonce_gap = 3;
    }
    let relayMaxNonce = (await this.provider.getTransactionCount(relay.address)) + allowed_relay_nonce_gap;

    try {
        let validTransaction = await this.sendViaRelay(
            relay.address,
            options.from,
            options.to,
            encodedFunctionCall,
            txfee,
            gasPrice,
            gasLimit,
            nonce,
            signature,
            "0x",
            relay.relayUrl,
            RELAY_HUB_ADDRESS,
            relayMaxNonce,
        );
        return validTransaction;
    } catch (error) {
        const errMsg = (error.message || error)
            .toString()
            .replace(
            /canRelay\(\) view function returned error code=(\d+)\..+/,
            (_match, code) => `canRelay check failed with ${preconditionCodeToDescription(code)}`,
            );
        errors.push(`Error sending transaction via relayer ${relay.address}: ${errMsg}`);
        if (this.config.verbose) {
            console.log('relayTransaction: req:', {
                from: options.from,
                to: options.to,
                encodedFunctionCall,
                txfee,
                gasPrice,
                gasLimit,
                nonce,
                relayhub: RELAY_HUB_ADDRESS,
                relay: relay.address,
            });
            console.log('relayTransaction:', ('' + error).replace(/ (\w+:)/g, '\n$1 '));
        }
        throw new Error(errMsg);
    }
  }

  async validateRecipientBalance(relayHub: ethers.Contract, recipient: string, gasLimit: number, gasPrice: number, relayFee: number): Promise<void> {
    const balance = await relayHub.balanceOf(recipient);
    if (new BigNumber(balance).isZero()) {
      throw new Error(`Recipient ${recipient} has no funds for paying for relayed calls on the relay hub.`);
    }

    const maxCharge = await relayHub.maxPossibleCharge(gasLimit, gasPrice, relayFee);
    if (new BigNumber(maxCharge).isGreaterThan(balance)) {
      throw new Error(
        `Recipient ${recipient} has not enough funds for paying for this relayed call (has ${balance}, requires ${maxCharge}).`,
      );
    }
  }

  async estimateGas(txParams: any): Promise<number> {
    let gasEstimate = (await this.provider.estimateGas(txParams)).toNumber();
    gasEstimate += 150000; // This is a rough upper bound estimate of the cost of swapping DAI for ETH which will occur only if the sender is the relay hub
    return gasEstimate;
  }
}
