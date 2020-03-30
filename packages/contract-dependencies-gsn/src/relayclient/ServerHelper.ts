import { BigNumber } from 'bignumber.js';
var Web3EthAbi = require('web3-eth-abi');
import { HttpWrapper } from './HttpWrapper';
import { ethers } from 'ethers';
import * as _ from 'lodash';

//relays are "down-scored" in case they timed out a request.
// they are "forgiven" after this timeout.
export const DEFAULT_RELAY_TIMEOUT_GRACE_SEC = 60 * 30;

export interface Relay {
  relayUrl: string,
  transactionFee?: number
  address?: string;
  score?: number;
  stake?: number;
  lastError?: any;
  unstakeDelay?: number;
  RelayServerAddress?: string,
  Ready?: boolean,
  MinGasPrice?: number;
}

export interface RelayResponse {
  RelayServerAddress: string,
  Ready: boolean,
  MinGasPrice: number,
}

export class ActiveRelayPinger {

  remainingRelays: Relay[];
  httpSend: HttpWrapper;
  pingedRelays: number;
  relaysCount: number;
  gasPrice: number;
  verbose: boolean;
  errors: string[];

  constructor(filteredRelays: Relay[], httpSend: HttpWrapper, gasPrice: number, verbose: boolean) {
    this.remainingRelays = filteredRelays.slice();
    this.httpSend = httpSend;
    this.pingedRelays = 0;
    this.relaysCount = filteredRelays.length;
    this.gasPrice = gasPrice;
    this.verbose = verbose;
    this.errors = [];
  }

  /**
   * Ping those relays that were not returned yet. Remove the returned relay (first to respond) from {@link remainingRelays}
   * @returns the first relay to respond to a ping message. Note: will never return the same relay twice.
   */
  async nextRelay(): Promise<Relay> {
    if (this.remainingRelays.length === 0) {
      return null;
    }

    let firstRelayToRespond;
    for (; !firstRelayToRespond && this.remainingRelays.length; ) {
      let bulkSize = Math.min(3, this.remainingRelays.length);
      try {
        let slice = this.remainingRelays.slice(0, bulkSize);
        if (this.verbose) {
          console.log('nextRelay: find fastest relay from: ' + JSON.stringify(slice));
        }
        firstRelayToRespond = await this.raceToSuccess(
          slice.map(relay => this.getRelayAddressPing(relay.relayUrl, relay.transactionFee, this.gasPrice)),
        );
        if (this.verbose) {
          console.log('race finished with a champion: ' + firstRelayToRespond.relayUrl);
        }
      } catch (e) {
        if (this.verbose) {
          console.log('One batch of relays failed, last error: ', e);
        }
        //none of the first `bulkSize` items matched. remove them, to continue with the next bulk.
        this.remainingRelays = this.remainingRelays.slice(bulkSize);
      }
    }

    this.remainingRelays = this.remainingRelays.filter(a => a.relayUrl !== firstRelayToRespond.relayUrl);
    this.pingedRelays++;
    return firstRelayToRespond;
  }

  /**
   * @returns JSON response from the relay server, but adds the requested URL to it:
   * { relayUrl: url,
   *   transactionFee: fee,
   *   RelayServerAddress: address,
   *   Ready: bool,   //should ignore relays with "false"
   *   MinGasPrice:   //minimum gas requirement by this relay.
   * }
   */
  async getRelayAddressPing(relayUrl: string, transactionFee: number, gasPrice: number): Promise<Relay> {
    if (this.verbose) {
      console.log('getRelayAddressPing URL: ' + relayUrl);
    }
    const relayResponse: RelayResponse = await this.httpSend.send(relayUrl + '/getaddr', {});
    if (!relayResponse.Ready) {
      throw new Error(`Relayer ${relayUrl} is not ready`);
    }
    if (relayResponse.MinGasPrice > gasPrice) {
      throw new Error(`Relayer ${relayUrl} requires a minimum gas price of ${relayResponse.MinGasPrice} which is over this transaction gas price (${gasPrice})`);
    }
    //add extra attributes (relayUrl, transactionFee)
    return Object.assign(relayResponse, { relayUrl, transactionFee });
  }

  /**
   * From https://stackoverflow.com/a/37235207 (modified to catch exceptions)
   * Resolves once any promise resolves, ignores the rest, ignores rejections
   */
  async raceToSuccess(promises: Promise<any>[]) {
    let numRejected = 0;
    return new Promise((resolve, reject) =>
      promises.forEach(promise =>
        promise
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            this.errors.push(err);
            if (++numRejected === promises.length) {
              reject('No response matched filter from any server: ' + err);
            }
          }),
      ),
    );
  }
}

export interface ServerHelperConfig {
  verbose?: boolean,
  minStake?: number,
  minDelay?: number,
  relayTimeoutGrace?: number,
  relayFilter?: (relay: Relay) => boolean,
  addScoreRandomness?: () => number,
  calculateRelayScore?: (relay: Relay) => number,
}

export class ServerHelper {
  httpSend: HttpWrapper;
  verbose: boolean;
  isInitialized: boolean;
  failedRelays: {[key:string]: Relay};
  filteredRelays: Relay[];
  relayTimeoutGrace: number;
  relayHubInstance: ethers.Contract;
  addedAndRemovedSignatures: string[];
  fromBlock: number;
  relayFilter: (relay: Relay) => boolean;
  addScoreRandomness: () => number;
  calculateRelayScore: (relay: Relay) => number;

  constructor(
    httpSend: HttpWrapper,
    failedRelays: {[key:string]: Relay},
    config: ServerHelperConfig,
  ) {
    const {
      verbose,
      minStake,
      minDelay, //params for relayFilter: filter out this relay if unstakeDelay or stake are too low.
      relayTimeoutGrace, //ignore score drop of a relay after this time (seconds)
      calculateRelayScore, //function: return relay score, higher the better. default uses transactionFee and some randomness
      relayFilter, //function: return false to filter out a relay. default uses minStake, minDelay
      addScoreRandomness, //function: return Math.random (0..1), to fairly distribute among relays with same score.
    } = config;

    this.httpSend = httpSend;
    this.verbose = verbose;
    this.failedRelays = failedRelays;
    this.relayTimeoutGrace = relayTimeoutGrace || DEFAULT_RELAY_TIMEOUT_GRACE_SEC;
    this.addScoreRandomness = addScoreRandomness || Math.random;
    this.calculateRelayScore = calculateRelayScore || this.defaultCalculateRelayScore.bind(this);


    //default filter: either calculateRelayScore didn't set "score" field,
    // or if unstakeDelay is below min, or if stake is below min.
    this.relayFilter =
      relayFilter ||
      (relay =>
        relay.score != null &&
        (!minDelay || new BigNumber(relay.unstakeDelay).gte(minDelay)) &&
        (!minStake || new BigNumber(relay.stake).gte(minStake)));

    this.filteredRelays = [];
    this.isInitialized = false;
  }

  defaultCalculateRelayScore(relay: Relay): number {
    //basic score is transaction fee (which is %)
    //higher the better.
    let score = 1000 - relay.transactionFee;

    const failedRelay = this.failedRelays[relay.relayUrl];
    if (failedRelay) {
      const elapsed = (new Date().getTime() - failedRelay.lastError) / 1000;
      if (elapsed < this.relayTimeoutGrace) score -= 10;
      //relay failed to answer lately. demote.
      else delete this.failedRelays[relay.relayUrl];
    }

    return score;
  }

  //compare relay scores.
  // if they are the same, use addScoreRandomness to shuffle them..
  compareRelayScores(r1: Relay, r2: Relay) {
    const diff = r2.score - r1.score;
    if (diff) return diff;
    return this.addScoreRandomness() - 0.5;
  }

  /**
   *
   * @param {*} relayHubInstance
   */
  setHub(relayHubInstance: ethers.Contract): void {
    if (this.relayHubInstance !== relayHubInstance) {
      this.filteredRelays = [];
    }
    this.relayHubInstance = relayHubInstance;
    this.addedAndRemovedSignatures = [];
    this.addedAndRemovedSignatures.push(this.relayHubInstance.interface.events['RelayAdded'].topic);
    this.addedAndRemovedSignatures.push(this.relayHubInstance.interface.events['RelayRemoved'].topic);
  }

  async newActiveRelayPinger(fromBlock: number, gasPrice: number): Promise<ActiveRelayPinger> {
    if (!this.relayHubInstance) {
      throw new Error('Must call setHub first!');
    }
    if (this.filteredRelays.length == 0 || this.fromBlock !== fromBlock) {
      this.fromBlock = fromBlock;
      await this.fetchRelaysAdded();
    }
    return this.createActiveRelayPinger(this.filteredRelays, this.httpSend, gasPrice, this.verbose);
  }

  createActiveRelayPinger(filteredRelays: Relay[], httpSend: HttpWrapper, gasPrice: number, verbose: boolean): ActiveRelayPinger {
    return new ActiveRelayPinger(filteredRelays, httpSend, gasPrice, verbose);
  }

  /**
   * Iterates through all RelayAdded and RelayRemoved logs emitted by given hub
   * initializes an array {@link filteredRelays} of relays curently registered on given RelayHub contract
   */
  async fetchRelaysAdded(): Promise<Relay[]> {
    const activeRelays = {};
    const fromBlock = this.fromBlock || 2;
    console.log(`Getting RelayHub logs fromBlock: ${fromBlock} address: ${this.relayHubInstance.address} topics: ${this.addedAndRemovedSignatures}`);
    const addedAndRemovedEvents = await this.relayHubInstance.provider.getLogs({
      fromBlock: fromBlock,
      address: this.relayHubInstance.address,
      topics: [this.addedAndRemovedSignatures],
    });

    if (this.verbose) {
      console.log('fetchRelaysAdded: found ' + addedAndRemovedEvents.length + ' events');
    }
    //TODO: better filter RelayAdded, RelayRemoved events: otherwise, we'll be scanning all TransactionRelayed too...
    //since RelayAdded can't be called after RelayRemoved, its OK to scan first for add, and the remove all removed relays.
    for (const event of addedAndRemovedEvents) {
      const parsedEvent = this.relayHubInstance.interface.parseLog(event);
      if (parsedEvent.name === 'RelayAdded') {
        let args = parsedEvent.values;
        let relay: Relay = {
          address: args.relay,
          relayUrl: args.url,
          transactionFee: args.transactionFee,
          stake: args.stake,
          unstakeDelay: args.unstakeDelay,
        };
        relay.score = this.calculateRelayScore(relay);
        activeRelays[args.relay] = relay;
      } else if (parsedEvent.name === 'RelayRemoved') {
        delete activeRelays[parsedEvent.values.relay];
      }
    }

    const origRelays: Relay[] = Object.values(activeRelays);
    if (origRelays.length === 0) {
      throw new Error(`No relayers registered in the requested hub at ${this.relayHubInstance.address}`);
    }

    const filteredRelays = origRelays.filter(this.relayFilter).sort(this.compareRelayScores.bind(this));
    if (filteredRelays.length == 0) {
      throw new Error(
        'No relayers elligible after filtering. Available relayers:\n' +
          origRelays.map(
            r =>
              ` score=${r.score} txFee=${r.transactionFee} stake=${r.stake} unstakeDelay=${r.unstakeDelay} address=${r.address} url=${r.relayUrl}`,
          ),
      );
    }

    if (this.verbose) {
      console.log('fetchRelaysAdded: after filtering have ' + filteredRelays.length + ' active relays');
    }

    this.filteredRelays = filteredRelays;
    this.isInitialized = true;
    return filteredRelays;
  }
}
