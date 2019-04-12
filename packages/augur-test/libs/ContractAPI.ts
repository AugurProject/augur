import { ethers } from "ethers";
import { stringTo32ByteHex, NULL_ADDRESS} from "./Utils";
import { Augur } from "@augurproject/api";
import { GenericAugurInterfaces, EthersFastSubmitWallet } from "@augurproject/core";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { AccountList } from "./LocalAugur";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { ContractAddresses } from "@augurproject/artifacts";

const ETERNAL_APPROVAL_VALUE = new ethers.utils.BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"); // 2^256 - 1

export class ContractAPI {
  public static async userWrapper(accounts: AccountList, accountIndex: number, provider: EthersProvider, addresses: ContractAddresses) {
    const account = accounts[accountIndex];

    const signer = await EthersFastSubmitWallet.create(account.secretKey, provider);
    const dependencies = new ContractDependenciesEthers(provider, signer, account.publicKey);
    const augur = await Augur.create(provider, dependencies, addresses);

    return new ContractAPI(augur, provider, account.publicKey);
  }

  public constructor(
    public readonly augur: Augur<ethers.utils.BigNumber>,
    public readonly provider: EthersProvider,
    public account: string, // address
  ) {}

  public async approveCentralAuthority(): Promise<void> {
    const authority = this.augur.addresses.Augur;
    await this.augur.contracts.cash.approve(authority, new ethers.utils.BigNumber(2).pow(new ethers.utils.BigNumber(256)).sub(new ethers.utils.BigNumber(1)));
  }

  public async createYesNoMarket(universe: GenericAugurInterfaces.Universe<ethers.utils.BigNumber>, endTime: ethers.utils.BigNumber, feePerEthInWei: ethers.utils.BigNumber, affiliateFeeDivisor: ethers.utils.BigNumber, designatedReporter: string): Promise<GenericAugurInterfaces.Market<ethers.utils.BigNumber>> {
    const marketCreationFee = await universe.getOrCacheMarketCreationCost_();

    await this.faucet(marketCreationFee);
    const marketAddress = await universe.createYesNoMarket_(endTime, feePerEthInWei, affiliateFeeDivisor, designatedReporter, stringTo32ByteHex(" "), "description", "");
    if (!marketAddress || marketAddress === "0x") {
      throw new Error("Unable to get address for new binary market.");
    }
    await universe.createYesNoMarket(endTime, feePerEthInWei, affiliateFeeDivisor, designatedReporter, stringTo32ByteHex(" "), "description", "");
    return this.augur.contracts.marketFromAddress(marketAddress);
  }

  public async createReasonableYesNoMarket(universe: GenericAugurInterfaces.Universe<ethers.utils.BigNumber>): Promise<GenericAugurInterfaces.Market<ethers.utils.BigNumber>> {
    const endTime = new ethers.utils.BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60);
    const fee = new ethers.utils.BigNumber(10).pow(new ethers.utils.BigNumber(16));
    const affiliateFeeDivisor = new ethers.utils.BigNumber(25);
    return await this.createYesNoMarket(universe, endTime, fee, affiliateFeeDivisor, this.account);
  }

  public async createCategoricalMarket(universe: GenericAugurInterfaces.Universe<ethers.utils.BigNumber>, outcomes: Array<string>, endTime: ethers.utils.BigNumber, feePerEthInWei: ethers.utils.BigNumber, affiliateFeeDivisor: ethers.utils.BigNumber, designatedReporter: string): Promise<GenericAugurInterfaces.Market<ethers.utils.BigNumber>> {
    const marketCreationFee = await universe.getOrCacheMarketCreationCost_();

    await this.faucet(marketCreationFee);
    const marketAddress = await universe.createCategoricalMarket_(endTime, feePerEthInWei, affiliateFeeDivisor, designatedReporter, outcomes, stringTo32ByteHex(" "), "description", "");
    if (!marketAddress || marketAddress === "0x") {
      throw new Error("Unable to get address for new categorical market.");
    }
    await universe.createCategoricalMarket(endTime, feePerEthInWei, affiliateFeeDivisor, designatedReporter, outcomes, stringTo32ByteHex(" "), "description", "");
    return this.augur.contracts.marketFromAddress(marketAddress);
  }

  public async createReasonableMarket(universe: GenericAugurInterfaces.Universe<ethers.utils.BigNumber>, outcomes: Array<string>): Promise<GenericAugurInterfaces.Market<ethers.utils.BigNumber>> {
    const endTime = new ethers.utils.BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60);
    const fee = new ethers.utils.BigNumber(10).pow(new ethers.utils.BigNumber(16));
    const affiliateFeeDivisor = new ethers.utils.BigNumber(25);
    return await this.createCategoricalMarket(universe, outcomes, endTime, fee, affiliateFeeDivisor, this.account);
  }

  public async createScalarMarket(universe: GenericAugurInterfaces.Universe<ethers.utils.BigNumber>, outcomes: Array<string>, endTime: ethers.utils.BigNumber, feePerEthInWei: ethers.utils.BigNumber, affiliateFeeDivisor: ethers.utils.BigNumber, designatedReporter: string): Promise<GenericAugurInterfaces.Market<ethers.utils.BigNumber>> {
    const marketCreationFee = await universe.getOrCacheMarketCreationCost_();

    await this.faucet(marketCreationFee);
    const minPrice = new ethers.utils.BigNumber(0);
    const maxPrice = new ethers.utils.BigNumber(40);
    const numTicks = new ethers.utils.BigNumber(4000);
    const marketAddress = await universe.createScalarMarket_(endTime, feePerEthInWei, affiliateFeeDivisor, designatedReporter, minPrice, maxPrice, numTicks, stringTo32ByteHex(" "), "description", "");
    if (!marketAddress || marketAddress === "0x") {
      throw new Error("Unable to get address for new scalar market.");
    }
    await universe.createScalarMarket(endTime, feePerEthInWei, affiliateFeeDivisor, designatedReporter, minPrice, maxPrice, numTicks, stringTo32ByteHex(" "), "description", "");
    return this.augur.contracts.marketFromAddress(marketAddress);
  }

  public async createReasonableScalarMarket(universe: GenericAugurInterfaces.Universe<ethers.utils.BigNumber>, outcomes: Array<string>): Promise<GenericAugurInterfaces.Market<ethers.utils.BigNumber>> {
    const endTime = new ethers.utils.BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60);
    const fee = new ethers.utils.BigNumber(10).pow(new ethers.utils.BigNumber(16));
    const affiliateFeeDivisor = new ethers.utils.BigNumber(25);
    return await this.createScalarMarket(universe, outcomes, endTime, fee, affiliateFeeDivisor, this.account);
  }

  public async placeOrder(
    market: string,
    type: ethers.utils.BigNumber,
    numShares: ethers.utils.BigNumber,
    price: ethers.utils.BigNumber,
    outcome: ethers.utils.BigNumber,
    betterOrderID: string,
    worseOrderID: string,
    tradeGroupID: string,
  ): Promise<string> {
    const createOrder = this.augur.contracts.createOrder;
    const ethValue = numShares.mul(price);
    await this.faucet(ethValue);
    const orderId = await createOrder.publicCreateOrder_(type, numShares, price, market, outcome, betterOrderID, worseOrderID, tradeGroupID, false, NULL_ADDRESS);
    await createOrder.publicCreateOrder(type, numShares, price, market, outcome, betterOrderID, worseOrderID, tradeGroupID, false, NULL_ADDRESS);
    return orderId;
  }

  public async fillOrder(orderId: string, cost: ethers.utils.BigNumber, numShares: ethers.utils.BigNumber, tradeGroupId: string) {
    await this.faucet(cost);
    await this.augur.contracts.fillOrder.publicFillOrder(orderId, numShares, stringTo32ByteHex(tradeGroupId), false, NULL_ADDRESS);
  }


  public async takeBestOrder(marketAddress: string, type: ethers.utils.BigNumber, numShares: ethers.utils.BigNumber, price: ethers.utils.BigNumber, outcome: ethers.utils.BigNumber, tradeGroupID: string): Promise<void> {
    let actualPrice = price;
    if (type === new ethers.utils.BigNumber(1)) {
      const market = this.augur.contracts.marketFromAddress(marketAddress);
      const numTicks = await market.getNumTicks_();
      actualPrice = numTicks.sub(price);
    }
    const ethValue = numShares.mul(actualPrice);

    await this.faucet(ethValue);

    const bestPriceAmount = await this.augur.contracts.trade.publicFillBestOrder_(type, marketAddress, outcome, numShares, price, tradeGroupID, new ethers.utils.BigNumber(3), false, NULL_ADDRESS, NULL_ADDRESS);
    if (bestPriceAmount === new ethers.utils.BigNumber(0)) {
      throw new Error("Could not take best Order");
    }

    await this.augur.contracts.trade.publicFillBestOrder(type, marketAddress, outcome, numShares, price, tradeGroupID, new ethers.utils.BigNumber(3), false, NULL_ADDRESS, NULL_ADDRESS);
  }

  public async cancelOrder(orderID: string): Promise<void> {
    await this.augur.contracts.cancelOrder.cancelOrder(orderID);
  }

  public async claimTradingProceeds(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>, shareholder: string): Promise<void> {
    await this.augur.contracts.claimTradingProceeds.claimTradingProceeds(market.address, shareholder);
  }

  public async getOrderPrice(orderID: string): Promise<ethers.utils.BigNumber> {
    const price = await this.augur.contracts.orders.getPrice_(orderID);
    if (price.toNumber() === 0) {
      throw new Error("Unable to get order price");
    }
    return price;
  }

  public getOrderAmount(orderID: string): Promise<ethers.utils.BigNumber> {
    return this.augur.contracts.orders.getAmount_(orderID);
  }

  public async getBestOrderId(type: ethers.utils.BigNumber, market: string, outcome: ethers.utils.BigNumber): Promise<string> {
    const orderID = await this.augur.contracts.orders.getBestOrderId_(type, market, outcome, NULL_ADDRESS);
    if (!orderID) {
      throw new Error("Unable to get order price");
    }
    return orderID;
  }

  public async buyCompleteSets(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>, amount: ethers.utils.BigNumber): Promise<void> {
    const numTicks = await market.getNumTicks_();
    const ethValue = amount.mul(numTicks);

    await this.faucet(ethValue);
    await this.augur.contracts.completeSets.publicBuyCompleteSets(market.address, amount);
  }

  public async sellCompleteSets(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>, amount: ethers.utils.BigNumber): Promise<void> {
    await this.augur.contracts.completeSets.publicSellCompleteSets(market.address, amount);
  }

  public async contribute(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>, payoutNumerators: Array<ethers.utils.BigNumber>, amount: ethers.utils.BigNumber): Promise<void> {
    await market.contribute(payoutNumerators, amount, "");
  }

  public derivePayoutDistributionHash(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>, payoutNumerators: Array<ethers.utils.BigNumber>): Promise<string> {
    return market.derivePayoutDistributionHash_(payoutNumerators);
  }

  public isForking(): Promise<boolean> {
    return this.augur.contracts.universe.isForking_();
  }

  public migrateOutByPayout(reputationToken: GenericAugurInterfaces.ReputationToken<ethers.utils.BigNumber>, payoutNumerators: Array<ethers.utils.BigNumber>, attotokens: ethers.utils.BigNumber) {
    return reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
  }

  public async getNumSharesInMarket(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>, outcome: ethers.utils.BigNumber): Promise<ethers.utils.BigNumber> {
    const shareTokenAddress = await market.getShareToken_(outcome);
    const shareToken = this.augur.contracts.shareTokenFromAddress(shareTokenAddress);
    return await shareToken.balanceOf_(this.account);
  }

  public async getDisputeWindow(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>): Promise<GenericAugurInterfaces.DisputeWindow<ethers.utils.BigNumber>> {
    const disputeWindowAddress = await market.getDisputeWindow_();
    return this.augur.contracts.disputeWindowFromAddress(disputeWindowAddress);
  }

  public async getWinningReportingParticipant(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>): Promise<GenericAugurInterfaces.DisputeCrowdsourcer<ethers.utils.BigNumber>> {
    const reportingParticipantAddress = await market.getWinningReportingParticipant_();
    return this.augur.contracts.getReportingParticipant(reportingParticipantAddress);
  }

  public async getUniverse(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>): Promise<GenericAugurInterfaces.Universe<ethers.utils.BigNumber>> {
    const universeAddress = await market.getUniverse_();
    return this.augur.contracts.universeFromAddress(universeAddress);
  }

  public async setTimestamp(timestamp: ethers.utils.BigNumber): Promise<void> {
    const time = this.augur.contracts.getTime();

    if (this.augur.contracts.isTimeControlled(time)) {
      await time.setTimestamp(timestamp);
    } else {
      throw Error("Cannot set timestamp because Time contract is not TimeControlled");
    }
  }

  public async getTimestamp(): Promise<ethers.utils.BigNumber> {
    return this.augur.contracts.augur.getTimestamp_();
  }

  public async doInitialReport(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>, payoutNumerators: Array<ethers.utils.BigNumber>): Promise<void> {
    await market.doInitialReport(payoutNumerators, "");
  }

  public async finalizeMarket(market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>): Promise<void> {
    await market.finalize();
  }

  public async faucet(wei: ethers.utils.BigNumber): Promise<void> {
    await this.augur.contracts.cash.faucet(wei);
  }

  public getLegacyRepBalance(owner: string): Promise<ethers.utils.BigNumber> {
    return this.augur.contracts.legacyReputationToken.balanceOf_(owner);
  }

  public getLegacyRepAllowance(owner: string, spender: string): Promise<ethers.utils.BigNumber> {
    return this.augur.contracts.legacyReputationToken.allowance_(owner, spender);
  }

  public async transferLegacyRep(to: string, amount: ethers.utils.BigNumber): Promise<void> {
    await this.augur.contracts.legacyReputationToken.transfer(to, amount);
  }

  public async approveLegacyRep(spender: string, amount: ethers.utils.BigNumber): Promise<void> {
    await this.augur.contracts.legacyReputationToken.approve(spender, amount);
  }

  public async getChildUniverseReputationToken(parentPayoutDistributionHash: string) {
    const childUniverseAddress = await this.augur.contracts.universe!.getChildUniverse_(parentPayoutDistributionHash);
    const childUniverse = this.augur.contracts.universeFromAddress(childUniverseAddress);
    const repContractAddress = await childUniverse.getReputationToken_();
    return this.augur.contracts.reputationTokenFromAddress(repContractAddress, this.augur.networkId);
  }

  // TODO: Determine why ETH balance doesn't change when buying complete sets or redeeming reporting participants
  public async getEthBalance(): Promise<ethers.utils.BigNumber> {
    return await this.provider.getBalance(this.account);
  }

  public getRepBalance(owner: string): Promise<ethers.utils.BigNumber> {
    return this.augur.contracts.getReputationToken().balanceOf_(owner);
  }

  public getRepAllowance(owner: string, spender: string): Promise<ethers.utils.BigNumber> {
    return this.augur.contracts.getReputationToken().allowance_(owner, spender);
  }

  public async approveAugurEternalApprovalValue(owner: string) {
    const spender = this.augur.addresses.Augur;
    const allowance = new ethers.utils.BigNumber(await this.augur.contracts.cash.allowance_(owner, spender));

    if (!allowance.eq(ETERNAL_APPROVAL_VALUE)) {
      await this.augur.contracts.cash.approve(spender, ETERNAL_APPROVAL_VALUE, { sender: this.account });
    }
  }
}
