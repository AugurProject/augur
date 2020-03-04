import { abi } from '@augurproject/artifacts';
import { ContractDependenciesGSN, WalletState } from 'contract-dependencies-gsn';
import { Abi } from 'ethereum';
import * as ethUtil from 'ethereumjs-util';
import { utils as ethersUtils } from 'ethers';
import { NULL_ADDRESS, Provider, SubscriptionEventName } from '..';
import { Augur } from '../Augur';


export interface CreateWalletParams {
  affiliate: string;
  fingerprint: string;
}

export interface WalletStatePayload {
  owner: string;
  wallet: string;
  state: WalletState;
}

export class GSN {
  private walletsToCheck: WalletStatePayload[] = [];

  constructor(
    private readonly provider: Provider,
    private readonly augur: Augur,
    private readonly dependencies: ContractDependenciesGSN
  ) {

    // Check wallet status on new block. Possible to wait for a transfer event to show up in the DB if this is problematic.
    augur.events.on(SubscriptionEventName.NewBlock, this.onNewBlock.bind(this));

    //this.provider.storeAbiData(abi.RelayHub as Abi, 'RelayHub');
    this.provider.storeAbiData(abi.AugurWalletRegistry as Abi, 'AugurWalletRegistry');
  }

  updateWalletsToCheckList = (wallet: string, owner: string, state: WalletState) => {
    this.walletsToCheck = this.walletsToCheck.filter(r => wallet !== r.wallet);
    this.walletsToCheck.push({
      state,
      owner,
      wallet: ethUtil.toChecksumAddress(wallet),
    });
  }

  // Check for wallet creations on new block
  // At this point we will emit status per wallet per block. If this is
  // too noisy for consumers of the event we can be more clever about it.
  private onNewBlock = async () => {
    for (const s of this.walletsToCheck) {
      let status = s.state;
      const registeredAddress = await this.getWalletAddress(s.owner);
      if (registeredAddress !== NULL_ADDRESS) {
        status = WalletState.AVAILABLE;
      } else if ((await this.augur.contracts.cash.balanceOf_(s.wallet)).gt(1)) { // TODO Get actual safe creation cost
        status = WalletState.FUNDED;
      } else {
        status = WalletState.WAITING_FOR_FUNDS;
      }
      this.updateWalletsToCheckList(s.wallet, s.owner, status);
      this.augur.setWalletStatus(status);

      this.augur
        .events
        .emit(SubscriptionEventName.WalletStatus, {
          ...s,
          status,
        });

      // Clear the "watch" when we reach a terminal wallet state.
      if ([WalletState.AVAILABLE, WalletState.ERROR].includes(status)) {
        this.walletsToCheck = this.walletsToCheck.filter(r => s.wallet !== r.wallet);
      }
    }
  };

  /**
   * @desc Start the create wallet workflow. Updates on status will be available via event emitter if relay transaction is appropriate..
   * @param {CalculateWalletAddressParams | Address} params - Address of the wallet to check/create wallet for. Object is used to reinitialize polling on new block.
   * @returns {Promise<Address>} - returns address if the wallet exists, otherwise null;
   *
   */
  async getOrCreateWallet(
    params: CreateWalletParams,
  ): Promise<string> {
    const owner = await this.dependencies.signer.getAddress();
    const wallet = await this.getWalletAddress(owner);

    if (ethersUtils.getAddress(wallet) !== ethersUtils.getAddress(NULL_ADDRESS)) {
      this.updateWalletsToCheckList(wallet, owner, WalletState.AVAILABLE);
      await this.onNewBlock();

      this.augur.setWalletStatus(WalletState.AVAILABLE);
      return wallet;
    }

    await this.createWallet(params, owner, wallet);
    return null;
  }

  /**
   * @desc Calculates the wallet address for a user
   * @param {string} owner
   * @returns {Promise<string>}
   */
  async calculateWalletAddress(
    owner: string
  ): Promise<string> {
    return this.augur.contracts.augurWalletRegistry.getCreate2WalletAddress_(owner);
  }

  async getWalletAddress(account: string): Promise<string> {
    return this.augur.contracts.augurWalletRegistry.getWallet_(account);
  }

  async createWallet(
    params: CreateWalletParams,
    owner?: string,
    wallet?: string
  ): Promise<void> {
    if (!owner) owner = await this.dependencies.signer.getAddress();
    if (!wallet) wallet = await this.calculateWalletAddress(owner);
    this.updateWalletsToCheckList(wallet, owner, WalletState.PENDING);
    await this.onNewBlock();
    await this.augur.contracts.augurWalletRegistry.createAugurWallet(params.affiliate, params.fingerprint);
    // We set the status back as if the tx failed this is the proper state
    this.updateWalletsToCheckList(wallet, owner, WalletState.FUNDED);
    await this.onNewBlock();
  }
}
