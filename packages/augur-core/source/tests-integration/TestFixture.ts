import { ethers } from "ethers";
import { ContractCompiler } from "../libraries/ContractCompiler";
import { CompilerConfiguration } from "../libraries/CompilerConfiguration";
import { ContractDependenciesEthers } from "../libraries/ContractDependenciesEthers";
import { EthersFastSubmitWallet } from "../libraries/EthersFastSubmitWallet";
import {
    Address,
    Bytes32,
    CancelOrder,
    Cash,
    ClaimTradingProceeds,
    CompleteSets,
    ContractDeployer,
    CreateOrder,
    Dependencies,
    DeployerConfiguration,
    DisputeCrowdsourcer,
    DisputeWindow,
    LegacyReputationToken,
    Market,
    NetworkConfiguration,
    Orders,
    ReputationToken,
    ShareToken,
    TimeControlled,
    Trade,
    UInt256,
    UInt8,
    Universe
} from "../";

class DebugProvider extends ethers.providers.JsonRpcProvider {
    // This should return a Promise (and may throw erros)
    // method is the method name (e.g. getBalance) and params is an
    // object with normalized values passed in, depending on the method
    perform(method: string, params: any): Promise<any> {
        return super.perform(method, params).then((result: any) => {
            console.log("DEBUG", method, params, "=>", result);
            return result;
        }, (error: any) => {
            console.log("DEBUG:ERROR", method, params, "=>", error);
            throw error;
        });
    }
}

export class TestFixture {
    public get universe() { return this.contractDeployer.universe!; }
    public get cash() { return new Cash(this.dependencies, this.contractDeployer.getContractAddress('Cash')); }

    // FIXME: extract out the bits of contract deployer that we need access to, like the contracts/abis, so we can have a more targeted dependency
    public constructor(
        public readonly dependencies: Dependencies<ethers.utils.BigNumber>,
        public readonly provider: ethers.providers.JsonRpcProvider,
        public readonly contractDeployer: ContractDeployer,
        public readonly account: Address) {
    }

    public static create = async (pretendToBeProduction: boolean = false): Promise<TestFixture> => {
        const networkConfiguration = NetworkConfiguration.create();
        const compilerConfiguration = CompilerConfiguration.create();

        const compiledContracts = await new ContractCompiler(compilerConfiguration).compileContracts();

        const provider = new DebugProvider(networkConfiguration.http);
        const signer = await EthersFastSubmitWallet.create(<string>networkConfiguration.privateKey, provider);
        const dependencies = new ContractDependenciesEthers(provider, signer, networkConfiguration.gasPrice.toNumber());

        const deployerConfiguration = DeployerConfiguration.createWithControlledTime();
        let contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, provider, signer, compiledContracts);

        if (pretendToBeProduction) {
            const legacyRepAddress = await contractDeployer.uploadLegacyRep();
            await contractDeployer.initializeLegacyRep();

            const fakeProdDeployerConfiguration = DeployerConfiguration.createWithControlledTime(legacyRepAddress, true);
            contractDeployer = new ContractDeployer(fakeProdDeployerConfiguration, dependencies, provider, signer, compiledContracts);
        }

        await contractDeployer.deploy();

        return new TestFixture(dependencies, provider, contractDeployer, (new Address()).from(signer.address));
    };

    public async approveCentralAuthority(): Promise<void> {
        const authority = this.contractDeployer.getContractAddress('Augur');
        const amount = new ethers.utils.BigNumber(2).pow(new ethers.utils.BigNumber(256)).sub(new ethers.utils.BigNumber(1)) as UInt256<ethers.utils.BigNumber>;

        await this.cash.approve(authority, amount);
    }

    public async createMarket(universe: Universe<ethers.utils.BigNumber>, outcomes: Bytes32[], endTime: UInt256<ethers.utils.BigNumber>, feePerEthInWei: UInt256<ethers.utils.BigNumber>, designatedReporter: Address): Promise<Market<ethers.utils.BigNumber>> {
        const marketCreationFee = await universe.getOrCacheMarketCreationCost_();

        console.log("Creating Market<ethers.utils.BigNumber>");
        await this.cash.depositEther({ attachedEth: marketCreationFee });
        const marketAddress = await universe.createCategoricalMarket_(endTime, feePerEthInWei, designatedReporter, outcomes, (new Bytes32()).from(" "), "description", "");
        if (!marketAddress || marketAddress.to0xString() == "0x") {
            throw new Error("Unable to get address for new categorical market.");
        }
        await universe.createCategoricalMarket(endTime, feePerEthInWei, designatedReporter, outcomes, (new Bytes32()).from(" "), "description", "");

        const market = new Market<ethers.utils.BigNumber>(this.dependencies, marketAddress);
        const typeName = await market.getTypeName_();
        if (typeName.equals((new Bytes32()).from("Market<ethers.utils.BigNumber>"))) {
            throw new Error("Unable to create new categorical market");
        }
        return market;
    }

    public async createReasonableMarket(universe: Universe<ethers.utils.BigNumber>, outcomes: Bytes32[]): Promise<Market<ethers.utils.BigNumber>> {
        const endTime = new ethers.utils.BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60) as UInt256<ethers.utils.BigNumber>;
        const fee = (new ethers.utils.BigNumber(10)).pow(new ethers.utils.BigNumber(16)) as UInt256<ethers.utils.BigNumber>;
        return await this.createMarket(universe, outcomes, endTime, fee, this.account);
    }

    public async placeOrder(market: Address, type: UInt8, numShares: UInt256<ethers.utils.BigNumber>, price: UInt256<ethers.utils.BigNumber>, outcome: UInt256<ethers.utils.BigNumber>, betterOrderID: Bytes32, worseOrderID: Bytes32, tradeGroupID: Bytes32): Promise<void> {
        const createOrderContract = await this.contractDeployer.getContractAddress("CreateOrder");
        const createOrder = new CreateOrder(this.dependencies, createOrderContract);

        const ethValue = numShares.mul(price) as UInt256<ethers.utils.BigNumber>;

        await this.cash.depositEther({attachedEth: ethValue});
        await createOrder.publicCreateOrder(type, numShares, price, market, outcome, betterOrderID, worseOrderID, tradeGroupID, false);
        return;
    }

    public async takeBestOrder(marketAddress: Address, type: UInt8, numShares: UInt256<ethers.utils.BigNumber>, price: UInt256<ethers.utils.BigNumber>, outcome: UInt256<ethers.utils.BigNumber>, tradeGroupID: Bytes32): Promise<void> {
        const tradeContract = await this.contractDeployer.getContractAddress("Trade");
        const trade = new Trade(this.dependencies, tradeContract);

        let actualPrice = price;
        if (type == 1) {
            const market = new Market<ethers.utils.BigNumber>(this.dependencies, marketAddress);
            const numTicks = await market.getNumTicks_();
            actualPrice = numTicks.sub(price) as UInt256<ethers.utils.BigNumber>;
        }
        const ethValue = numShares.mul(actualPrice) as UInt256<ethers.utils.BigNumber>;
        await this.cash.depositEther({ attachedEth: ethValue });

        const bestPriceAmount = await trade.publicFillBestOrder_(type, marketAddress, outcome, numShares, price, tradeGroupID, new ethers.utils.BigNumber(3) as UInt256<ethers.utils.BigNumber>, false);
        if (bestPriceAmount == new ethers.utils.BigNumber(0)) {
            throw new Error("Could not take best Order");
        }

        await trade.publicFillBestOrder(type, marketAddress, outcome, numShares, price, tradeGroupID, new ethers.utils.BigNumber(3) as UInt256<ethers.utils.BigNumber>, false);
        return;
    }

    public async cancelOrder(orderID: Bytes32): Promise<void> {
        const cancelOrderContract = await this.contractDeployer.getContractAddress("CancelOrder");
        const cancelOrder = new CancelOrder(this.dependencies, cancelOrderContract);

        await cancelOrder.cancelOrder(orderID);
        return;
    }

    public async claimTradingProceeds(market: Market<ethers.utils.BigNumber>, shareholder: Address): Promise<void> {
        const claimTradingProceedsContract = await this.contractDeployer.getContractAddress("ClaimTradingProceeds");
        const claimTradingProceeds = new ClaimTradingProceeds(this.dependencies, claimTradingProceedsContract);
        await claimTradingProceeds.claimTradingProceeds(market.address, shareholder);
        return;
    }

    public async getOrderPrice(orderID: Bytes32): Promise<ethers.utils.BigNumber> {
        const ordersContract = await this.contractDeployer.getContractAddress("Orders");
        const orders = new Orders(this.dependencies, ordersContract);

        const price = await orders.getPrice_(orderID);
        if (price.toNumber() == 0) {
            throw new Error("Unable to get order price");
        }
        return price;
    }

    public async getOrderAmount(orderID: Bytes32): Promise<ethers.utils.BigNumber> {
        const ordersContract = await this.contractDeployer.getContractAddress("Orders");
        const orders = new Orders(this.dependencies, ordersContract);
        return await orders.getAmount_(orderID);
    }

    public async getBestOrderId(type: UInt8, market: Address, outcome: UInt256<ethers.utils.BigNumber>): Promise<Bytes32> {
        const ordersContract = await this.contractDeployer.getContractAddress("Orders");
        const orders = new Orders(this.dependencies, ordersContract);

        const orderID = await orders.getBestOrderId_(type, market, outcome);
        if (!orderID) {
            throw new Error("Unable to get order price");
        }
        return orderID;
    }

    public async buyCompleteSets(market: Market<ethers.utils.BigNumber>, amount: UInt256<ethers.utils.BigNumber>): Promise<void> {
        const completeSetsContract = await this.contractDeployer.getContractAddress("CompleteSets");
        const completeSets = new CompleteSets(this.dependencies, completeSetsContract);

        const numTicks = await market.getNumTicks_();
        const ethValue = amount.mul(numTicks) as UInt256<ethers.utils.BigNumber>;

        await this.cash.depositEther({ attachedEth: ethValue });
        await completeSets.publicBuyCompleteSets(market.address, amount);
        return;
    }

    public async sellCompleteSets(market: Market<ethers.utils.BigNumber>, amount: UInt256<ethers.utils.BigNumber>): Promise<void> {
        const completeSetsContract = await this.contractDeployer.getContractAddress("CompleteSets");
        const completeSets = new CompleteSets(this.dependencies, completeSetsContract);

        await completeSets.publicSellCompleteSets(market.address, amount);
        return;
    }

    public async contribute(market: Market<ethers.utils.BigNumber>, payoutNumerators: UInt256<ethers.utils.BigNumber>[], amount: UInt256<ethers.utils.BigNumber>): Promise<void> {
        await market.contribute(payoutNumerators, amount, "");
        return;
    }

    public async derivePayoutDistributionHash(market: Market<ethers.utils.BigNumber>, payoutNumerators: Array<UInt256<ethers.utils.BigNumber>>): Promise<Bytes32> {
        return await market.derivePayoutDistributionHash_(payoutNumerators);
    }

    public async isForking(): Promise<boolean> {
        return await this.universe!.isForking_();
    }

    public async migrateOutByPayout(reputationToken: ReputationToken<ethers.utils.BigNumber>, payoutNumerators: Array<UInt256<ethers.utils.BigNumber>>, attotokens: UInt256<ethers.utils.BigNumber>) {
        await reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
        return;
    }

    public async getNumSharesInMarket(market: Market<ethers.utils.BigNumber>, outcome: UInt256<ethers.utils.BigNumber>): Promise<ethers.utils.BigNumber> {
        const shareTokenAddress = await market.getShareToken_(outcome);
        const shareToken = new ShareToken(this.dependencies, shareTokenAddress);
        return await shareToken.balanceOf_(this.account);
    }

    public async getDisputeWindow(market: Market<ethers.utils.BigNumber>): Promise<DisputeWindow<ethers.utils.BigNumber>> {
        const disputeWindowAddress = await market.getDisputeWindow_();
        return new DisputeWindow(this.dependencies, disputeWindowAddress);
    }

    public async getReportingParticipant(reportingParticipantAddress: Address): Promise<DisputeCrowdsourcer<ethers.utils.BigNumber>> {
        return new DisputeCrowdsourcer(this.dependencies, reportingParticipantAddress);
    }

    public async getUniverse(market: Market<ethers.utils.BigNumber>): Promise<Universe<ethers.utils.BigNumber>> {
        const universeAddress = await market.getUniverse_();
        return new Universe(this.dependencies, universeAddress);
    }

    public async getWinningReportingParticipant(market: Market<ethers.utils.BigNumber>): Promise<DisputeCrowdsourcer<ethers.utils.BigNumber>> {
        const reportingParticipantAddress = await market.getWinningReportingParticipant_();
        return new DisputeCrowdsourcer(this.dependencies, reportingParticipantAddress);
    }

    public async setTimestamp(timestamp: UInt256<ethers.utils.BigNumber>): Promise<void> {
        const timeContract = await this.contractDeployer.getContractAddress("TimeControlled");
        const time = new TimeControlled(this.dependencies, timeContract);
        await time.setTimestamp(timestamp);
        return;
    }

    public async getTimestamp(): Promise<ethers.utils.BigNumber> {
        return this.contractDeployer.augur!.getTimestamp_();
    }

    public async doInitialReport(market: Market<ethers.utils.BigNumber>, payoutNumerators: Array<UInt256<ethers.utils.BigNumber>>): Promise<void> {
        await market.doInitialReport(payoutNumerators, "");
        return;
    }

    public async finalizeMarket(market: Market<ethers.utils.BigNumber>): Promise<void> {
        await market.finalize();
        return;
    }

    public async getLegacyRepBalance(owner: Address): Promise<ethers.utils.BigNumber> {
        const legacyRepContract = await this.contractDeployer.getContractAddress("LegacyReputationToken");
        const legacyRep = new LegacyReputationToken(this.dependencies, legacyRepContract);
        return await legacyRep.balanceOf_(owner);
    }

    public async getLegacyRepAllowance(owner: Address, spender: Address): Promise<ethers.utils.BigNumber> {
        const legacyRepContract = await this.contractDeployer.getContractAddress("LegacyReputationToken");
        const legacyRep = new LegacyReputationToken(this.dependencies, legacyRepContract);
        return await legacyRep.allowance_(owner, spender);
    }

    public async transferLegacyRep(to: Address, amount: UInt256<ethers.utils.BigNumber>): Promise<void> {
        const legacyRepContract = await this.contractDeployer.getContractAddress("LegacyReputationToken");
        const legacyRep = new LegacyReputationToken(this.dependencies, legacyRepContract);
        await legacyRep.transfer(to, amount);
        return;
    }

    public async approveLegacyRep(spender: Address, amount: UInt256<ethers.utils.BigNumber>): Promise<void> {
        const legacyRepContract = await this.contractDeployer.getContractAddress("LegacyReputationToken");
        const legacyRep = new LegacyReputationToken(this.dependencies, legacyRepContract);
        await legacyRep.approve(spender, amount);
        return;
    }

    public async getChildUniverseReputationToken(parentPayoutDistributionHash: Bytes32) {
        const childUniverseAddress = await this.contractDeployer.universe!.getChildUniverse_(parentPayoutDistributionHash);
        const childUniverse = new Universe(this.dependencies, childUniverseAddress);
        const repContractAddress = await childUniverse.getReputationToken_();
        return new ReputationToken(this.dependencies, repContractAddress);
    }

    public async getReputationToken(): Promise<ReputationToken<ethers.utils.BigNumber>> {
        const repContractAddress = await this.contractDeployer.universe!.getReputationToken_();
        return new ReputationToken(this.dependencies, repContractAddress);
    }

    // TODO: Determine why ETH balance doesn't change when buying complete sets or redeeming reporting participants
    public async getEthBalance(): Promise<ethers.utils.BigNumber> {
        return await this.provider.getBalance(this.account.to0xString());
    }

    public async getRepBalance(owner: Address): Promise<ethers.utils.BigNumber> {
        const rep = await this.getReputationToken();
        return await rep.balanceOf_(owner);
    }

    public async getRepAllowance(owner: Address, spender: Address): Promise<ethers.utils.BigNumber> {
        const rep = await this.getReputationToken();
        return await rep.allowance_(owner, spender);
    }
}
