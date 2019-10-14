import { abi } from '@augurproject/artifacts';
import {
  GnosisSafeState,
  GnosisSafeStateReponse,
  IGnosisRelayAPI,
  SafeResponse,
} from '@augurproject/gnosis-relay-api';
import { BigNumber } from 'bignumber.js';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { Abi } from 'ethereum';
import * as ethUtil from 'ethereumjs-util';
import { ethers, utils as ethersUtils } from 'ethers';

import { NULL_ADDRESS, Provider, SubscriptionEventName } from '..';
import { Augur } from '../Augur';
import { Address } from '../state/logs/types';
import { formatBytes32String } from 'ethers/utils';

export const AUGUR_GNOSIS_SAFE_NONCE = 872838000000;

export interface CreateGnosisSafeViaRelayParams {
  owner: string;
  paymentToken: string;
}

export interface CalculateGnosisSafeAddressParams
  extends CreateGnosisSafeViaRelayParams {
  safe: string;
  payment: string;
}

export interface GnosisSafeDeploymentStatusParams {
  owner: Address;
  safe: Address;
}

export interface GnosisSafeStatusPayload
  extends GnosisSafeDeploymentStatusParams {
  status: GnosisSafeState;
  txHash?: string;
}

export class Gnosis {
  constructor(
    private readonly provider: Provider,
    private readonly gnosisRelay: IGnosisRelayAPI,
    private readonly augur: Augur,
    private readonly dependencies: ContractDependenciesGnosis
  ) {
    // Check safe status on new block. Possible to wait for a transfer event to show up in the DB if this is problematic.
    augur
      .getAugurEventEmitter()
      .on(SubscriptionEventName.NewBlock, this.onNewBlock);

    this.provider.storeAbiData(abi.GnosisSafe as Abi, 'GnosisSafe');
    this.provider.storeAbiData(abi.ProxyFactory as Abi, 'ProxyFactory');
    this.provider.storeAbiData(
      abi.GnosisSafeRegistry as Abi,
      'GnosisSafeRegistry'
    );
  }

  private safesToCheck: GnosisSafeStatusPayload[] = [];

  // Check for safe creations on new block
  // At this point we will emit status per safe wallet per block. If this is
  // too noisy for consumers of the event we can be more clever about it.
  private onNewBlock = async () => {
    for (const s of this.safesToCheck) {
      const status = await this.getGnosisSafeDeploymentStatusViaRelay(s);
      if (
        status.status in [GnosisSafeState.AVAILABLE, GnosisSafeState.CREATED]
      ) {
        const signerAddress = await this.dependencies.signer.getAddress();
        if (signerAddress === s.owner) {
          this.augur.setGnosisSafeAddress(s.safe);
          this.augur.setUseGnosisSafe(true);
        }
      }

      // Can only register Contract if the current signer is the safe owner.
      // Be sure the safe creation transaction has been mined.
      if (status.status === GnosisSafeState.CREATED) {
        const tx = await this.augur.getTransaction(status.txHash);

        // @todo Is this sufficient to consider it mined?
        if (tx.blockNumber) {
          const data = await this.buildGnosisSetupData(s.owner);

          // Trigger delegate call.
          const resp = await this.dependencies.sendDelegateTransaction(
            {
              to: s.safe,
              data,
              value: new ethers.utils.BigNumber(0),
            },
            {
              name: 'safe-delegate-call',
              params: {},
            }
          );

          s.txHash = resp.transactionHash;
        }
      }

      this.augur
        .getAugurEventEmitter()
        .emit(SubscriptionEventName.GnosisSafeStatus, {
          ...s,
          status,
        });

      // Clear the "watch" when we reach a terminal safe state.
      if (status.status in [GnosisSafeState.AVAILABLE, GnosisSafeState.ERROR]) {
        this.safesToCheck = this.safesToCheck.filter(r => s.safe !== r.safe);
      }
    }
  };

  /**
   * @desc Start the gnosis workflow. Updates on status will be available via event emitter if relay transaction is appropriate..
   * @param {CalculateGnosisSafeAddressParams | Address} params - Address of the wallet to check/create safe for. Object is used to reinitialize polling on new block.
   * @returns {Promise<CalculateGnosisSafeAddressParams | Address>} - returns address if the safe exists, otherwise object of safe creation params.
   *
   */
  async getOrCreateGnosisSafe(
    params: CalculateGnosisSafeAddressParams | Address
  ): Promise<CalculateGnosisSafeAddressParams | Address> {
    const owner = typeof params === 'string' ? params : params.owner;
    const safe = await this.getGnosisSafeAddress(owner);
    if (ethersUtils.getAddress(safe) !== ethersUtils.getAddress(NULL_ADDRESS)) {
      this.augur
        .getAugurEventEmitter()
        .emit(SubscriptionEventName.GnosisSafeStatus, {
          status: GnosisSafeState.AVAILABLE,
          safe,
          owner,
        });
      return safe;
    }

    // Validate previous relay creation params.
    if (typeof params === 'object') {
      const safe = await this.calculateGnosisSafeAddress(params);
      const status = await this.getGnosisSafeDeploymentStatusViaRelay(params);

      if (safe !== params.safe) {
        console.log(
          `Saved relay safe creation params invalid. Calculated safe address is ${safe}. Passed params: ${JSON.stringify(
            params
          )}.`
        );
      } else if (status.status === GnosisSafeState.WAITING_FOR_FUNDS) {
        // Still pending, add to watchlist.
        if (!this.safesToCheck.find(safes => safes.owner === owner)) {
          this.safesToCheck.push({
            status: status.status,
            owner,
            safe,
          });
        }

        await this.onNewBlock();

        return params;
      } else if (status.status === GnosisSafeState.CREATED) {
        this.augur
          .getAugurEventEmitter()
          .emit(SubscriptionEventName.GnosisSafeStatus, {
            status: GnosisSafeState.CREATED,
            safe: params.safe,
            owner,
          });
        return params;
      }
    }

    const result = await this.createGnosisSafeViaRelay({
      owner,
      paymentToken: this.augur.contracts.cash.address,
    });

    // Fire events to notify any interested parties.
    await this.onNewBlock();

    return {
      ...result,
      owner,
    };
  }

  /**
   * @desc Calculates the safe address from creation params. Generally used to confirm safe address in local storage is correct and valid.
   * @param {CalculateGnosisSafeAddressParams} params
   * @returns {Promise<string>}
   */
  async calculateGnosisSafeAddress(
    params: CalculateGnosisSafeAddressParams
  ): Promise<string> {
    const gnosisSafeRegistryAddress = this.augur.contracts.gnosisSafeRegistry
      .address;

    const setupData = await this.buildGnosisSetupData(
      params.owner,
      params.payment
    );
    const gnosisSafeData = await this.provider.encodeContractFunction(
      'GnosisSafe',
      'setup',
      [
        [params.owner],
        1,
        gnosisSafeRegistryAddress,
        setupData,
        NULL_ADDRESS,
        params.paymentToken,
        new BigNumber(params.payment),
        NULL_ADDRESS,
      ]
    );

    // This _could_ be made into a constant if this ends up being a problem in any way
    const proxyCreationCode = await this.augur.contracts.proxyFactory.proxyCreationCode_();

    const abiCoder = new ethers.utils.AbiCoder();

    const constructorData = abiCoder.encode(
      ['address'],
      [this.augur.contracts.gnosisSafe.address]
    );
    const encodedNonce = abiCoder.encode(
      ['uint256'],
      [AUGUR_GNOSIS_SAFE_NONCE]
    );
    const salt = ethUtil.keccak256(
      '0x' +
        ethUtil.keccak256(gnosisSafeData).toString('hex') +
        encodedNonce.substr(2)
    );
    const initCode = proxyCreationCode + constructorData.substr(2);

    return (
      '0x' +
      ethUtil
        .generateAddress2(
          this.augur.contracts.proxyFactory.address,
          salt,
          initCode
        )
        .toString('hex')
    );
  }

  async getGnosisSafeAddress(account: string): Promise<string> {
    return this.augur.contracts.gnosisSafeRegistry.getSafe_(account);
  }

  async createGnosisSafeDirectlyWithETH(account: string): Promise<string> {
    const gnosisSafeData = await this.buildGnosisSetupData(account);

    // Make transaction to proxy factory
    const nonce = AUGUR_GNOSIS_SAFE_NONCE;
    const proxy = this.augur.contracts.proxyFactory.createProxyWithNonce_(
      this.augur.contracts.gnosisSafe.address,
      gnosisSafeData,
      new BigNumber(nonce)
    );
    await this.augur.contracts.proxyFactory.createProxyWithNonce(
      this.augur.contracts.gnosisSafe.address,
      gnosisSafeData,
      new BigNumber(nonce)
    );
    return proxy;
  }

  async createGnosisSafeViaRelay(
    params: CreateGnosisSafeViaRelayParams
  ): Promise<SafeResponse> {
    if (this.gnosisRelay === undefined) {
      throw new Error('No Gnosis Relay provided to Augur SDK');
    }

    const gnosisSafeRegistryAddress = this.augur.contracts.gnosisSafeRegistry
      .address;

    const setupData = await this.buildRegistrationData();
    const response = await this.gnosisRelay.createSafe({
      saltNonce: AUGUR_GNOSIS_SAFE_NONCE,
      owners: [params.owner],
      threshold: 1,
      paymentToken: params.paymentToken,
      to: gnosisSafeRegistryAddress,
      setupData,
    });

    this.safesToCheck.push({
      safe: response.safe,
      owner: params.owner,
      status: GnosisSafeState.WAITING_FOR_FUNDS,
    });

    return response;
  }

  async getGnosisSafeDeploymentStatusViaRelay(
    params: GnosisSafeDeploymentStatusParams
  ): Promise<GnosisSafeStateReponse> {
    if (this.gnosisRelay === undefined) {
      throw new Error('No Gnosis Relay provided to Augur SDK');
    }

    const safe = await this.getGnosisSafeAddress(params.owner);
    if (safe !== NULL_ADDRESS) {
      return {
        status: GnosisSafeState.AVAILABLE,
      };
    }

    return this.gnosisRelay.checkSafe(params.safe);
  }

  private async buildRegistrationData() {
    const gnosisSafeRegistryAddress = this.augur.contracts.gnosisSafeRegistry
      .address;

    const cashAddress = this.augur.contracts.cash.address;
    const shareTokenAddress = this.augur.contracts.shareToken.address;
    const augurAddress = this.augur.contracts.augur.address;
    const createOrderAddress = this.augur.contracts.createOrder.address;
    const fillOrderAddress = this.augur.contracts.fillOrder.address;
    const affiliates = this.augur.contracts.affiliates.address;
    // TODO
    const fingerprint = formatBytes32String('');
    const referralAddress = NULL_ADDRESS;
    return this.provider.encodeContractFunction(
      'GnosisSafeRegistry',
      'callRegister',
      [
        gnosisSafeRegistryAddress,
        augurAddress,
        createOrderAddress,
        fillOrderAddress,
        cashAddress,
        shareTokenAddress,
        affiliates,
        fingerprint,
        referralAddress,
      ]
    );
  }

  private async buildGnosisSetupData(account: string, payment = '0') {
    const cashAddress = this.augur.contracts.cash.address;
    const gnosisSafeRegistryAddress = this.augur.contracts.gnosisSafeRegistry
      .address;

    const registrationData = await this.buildRegistrationData();
    /*
        address[] calldata _owners,
        uint256 _threshold,
        address to,
        bytes calldata data,
        address fallbackHandler,
        address paymentToken,
        uint256 payment,
        address payable paymentReceiver
     */
    return this.provider.encodeContractFunction('GnosisSafe', 'setup', [
      [account],
      1,
      gnosisSafeRegistryAddress,
      registrationData,
      NULL_ADDRESS,
      cashAddress,
      new BigNumber(payment),
      NULL_ADDRESS,
    ]);
  }
}
