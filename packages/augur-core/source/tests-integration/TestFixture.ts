import {ethers} from 'ethers'
import { TestRpc } from './TestRpc';
import { ContractCompiler } from '../libraries/ContractCompiler';
import { ContractDeployer } from '../libraries/ContractDeployer';
import { CompilerConfiguration } from '../libraries/CompilerConfiguration';
import { DeployerConfiguration } from '../libraries/DeployerConfiguration';
import { NetworkConfiguration } from '../libraries/NetworkConfiguration';
import { ContractDependenciesEthers } from '../libraries/ContractDependenciesEthers';
import { DisputeWindow, ShareToken, ClaimTradingProceeds, CompleteSets, TimeControlled, Cash, Universe, Market, CreateOrder, Orders, Trade, CancelOrder, LegacyReputationToken, DisputeCrowdsourcer, ReputationToken,  } from '../libraries/ContractInterfaces';
import { Dependencies } from '../libraries/GenericContractInterfaces';
import { stringTo32ByteHex } from '../libraries/HelperFunctions';
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';

export class TestFixture {
    // FIXME: extract out the bits of contract deployer that we need access to, like the contracts/abis, so we can have a more targeted dependency
    public readonly contractDeployer: ContractDeployer;
    public readonly dependencies: Dependencies<ethers.utils.BigNumber>;
    public readonly provider: ethers.providers.JsonRpcProvider;
    public readonly account: string;
    public readonly testRpc: TestRpc | null;
    public readonly sdbEnabled: boolean;

    public get universe() { return this.contractDeployer.universe!; }
    public get cash() { return new Cash(this.dependencies, this.contractDeployer.getContractAddress('Cash')); }

    public constructor(dependencies: Dependencies<ethers.utils.BigNumber>, provider: ethers.providers.JsonRpcProvider, contractDeployer: ContractDeployer, testRpc: TestRpc | null, sdbEnabled: boolean, account: string) {
        this.contractDeployer = contractDeployer;
        this.dependencies = dependencies;
        this.provider = provider;
        this.account = account;
        this.testRpc = testRpc;
        this.sdbEnabled = sdbEnabled;
    }

    public static create = async (pretendToBeProduction: boolean = false): Promise<TestFixture> => {
        const networkConfiguration = NetworkConfiguration.create();
        const compilerConfiguration = CompilerConfiguration.create()

        const testRpc = await TestRpc.startTestRpcIfNecessary(networkConfiguration, compilerConfiguration);

        const compiledContracts = await new ContractCompiler(compilerConfiguration).compileContracts();

        const provider = new ethers.providers.JsonRpcProvider(networkConfiguration.http);
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

        const addressMapping = await contractDeployer.deploy();

         if (testRpc !== null && compilerConfiguration.enableSdb) {
            await testRpc.linkDebugSymbols(compiledContracts, addressMapping);
        }

        const testFixture = new TestFixture(dependencies, provider, contractDeployer, testRpc, compilerConfiguration.enableSdb, signer.address);
        await testFixture.linkDebugSymbolsForContract('Universe', testFixture.universe.address);

        return testFixture;
    }

    public async linkDebugSymbolsForContract(contractName: string, contractAddress: string): Promise<void> {
        if (this.sdbEnabled && this.testRpc !== null) {
            await this.testRpc.linkContractAddress(contractName, contractAddress);
        }
    }

    public async approveCentralAuthority(): Promise<void> {
        const authority = this.contractDeployer.getContractAddress('Augur');
        const cash = new Cash(this.dependencies, this.contractDeployer.getContractAddress('Cash'));
        await cash.approve(authority, new ethers.utils.BigNumber(2).pow(new ethers.utils.BigNumber(256)).sub(new ethers.utils.BigNumber(1)));
    }

    public async createMarket(universe: Universe, outcomes: string[], endTime: ethers.utils.BigNumber, feePerEthInWei: ethers.utils.BigNumber, designatedReporter: string): Promise<Market> {
        const marketCreationFee = await universe.getOrCacheMarketCreationCost_();

        console.log("Creating Market");
        const marketAddress = await universe.createCategoricalMarket_(endTime, feePerEthInWei, designatedReporter, outcomes, stringTo32ByteHex(" "), 'description', '', { attachedEth: marketCreationFee });
        if (!marketAddress || marketAddress == "0x") {
            throw new Error("Unable to get address for new categorical market.");
        }
        await universe.createCategoricalMarket(endTime, feePerEthInWei, designatedReporter, outcomes, stringTo32ByteHex(" "), 'description', '', { attachedEth: marketCreationFee });
        const market = new Market(this.dependencies, marketAddress);
        if (await market.getTypeName_() !== stringTo32ByteHex("Market")) {
            throw new Error("Unable to create new categorical market");
        }
        await this.linkDebugSymbolsForContract('Market', market.address);
        return market;
    }

    public async createReasonableMarket(universe: Universe, outcomes: string[]): Promise<Market> {
        const endTime = new ethers.utils.BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60);
        const fee = (new ethers.utils.BigNumber(10)).pow(new ethers.utils.BigNumber(16));
        return await this.createMarket(universe, outcomes, endTime, fee, this.account);
    }

    public async placeOrder(market: string, type: ethers.utils.BigNumber, numShares: ethers.utils.BigNumber, price: ethers.utils.BigNumber, outcome: ethers.utils.BigNumber, betterOrderID: string, worseOrderID: string, tradeGroupID: string): Promise<void> {
        const createOrderContract = await this.contractDeployer.getContractAddress("CreateOrder");
        const createOrder = new CreateOrder(this.dependencies, createOrderContract);

        const ethValue = numShares.mul(price);

        await createOrder.publicCreateOrder(type, numShares, price, market, outcome, betterOrderID, worseOrderID, tradeGroupID, false, { attachedEth: ethValue });
        return;
    }

    public async takeBestOrder(marketAddress: string, type: ethers.utils.BigNumber, numShares: ethers.utils.BigNumber, price: ethers.utils.BigNumber, outcome: ethers.utils.BigNumber, tradeGroupID: string): Promise<void> {
        const tradeContract = await this.contractDeployer.getContractAddress("Trade");
        const trade = new Trade(this.dependencies, tradeContract);

        let actualPrice = price;
        if (type == new ethers.utils.BigNumber(1)) {
            const market = new Market(this.dependencies, marketAddress);
            const numTicks = await market.getNumTicks_();
            actualPrice = numTicks.sub(price);
        }
        const ethValue = numShares.mul(actualPrice);

        const bestPriceAmount = await trade.publicFillBestOrder_(type, marketAddress, outcome, numShares, price, tradeGroupID, new ethers.utils.BigNumber(3), false, { attachedEth: ethValue });
        if (bestPriceAmount == new ethers.utils.BigNumber(0)) {
            throw new Error("Could not take best Order");
        }

        await trade.publicFillBestOrder(type, marketAddress, outcome, numShares, price, tradeGroupID, new ethers.utils.BigNumber(3), false, { attachedEth: ethValue });
        return;
    }

    public async cancelOrder(orderID: string): Promise<void> {
        const cancelOrderContract = await this.contractDeployer.getContractAddress("CancelOrder");
        const cancelOrder = new CancelOrder(this.dependencies, cancelOrderContract);

        await cancelOrder.cancelOrder(orderID);
        return;
    }

    public async claimTradingProceeds(market: Market, shareholder: string): Promise<void> {
        const claimTradingProceedsContract = await this.contractDeployer.getContractAddress("ClaimTradingProceeds");
        const claimTradingProceeds = new ClaimTradingProceeds(this.dependencies, claimTradingProceedsContract);
        await claimTradingProceeds.claimTradingProceeds(market.address, shareholder);
        return;
    }

    public async getOrderPrice(orderID: string): Promise<ethers.utils.BigNumber> {
        const ordersContract = await this.contractDeployer.getContractAddress("Orders");
        const orders = new Orders(this.dependencies, ordersContract);

        const price = await orders.getPrice_(orderID);
        if (price.toNumber() == 0) {
            throw new Error("Unable to get order price");
        }
        return price;
    }

    public async getOrderAmount(orderID: string): Promise<ethers.utils.BigNumber> {
        const ordersContract = await this.contractDeployer.getContractAddress("Orders");
        const orders = new Orders(this.dependencies, ordersContract);
        return await orders.getAmount_(orderID);
    }

    public async getBestOrderId(type: ethers.utils.BigNumber, market: string, outcome: ethers.utils.BigNumber): Promise<string> {
        const ordersContract = await this.contractDeployer.getContractAddress("Orders");
        const orders = new Orders(this.dependencies, ordersContract);

        const orderID = await orders.getBestOrderId_(type, market, outcome);
        if (!orderID) {
            throw new Error("Unable to get order price");
        }
        return orderID;
    }

    public async buyCompleteSets(market: Market, amount: ethers.utils.BigNumber): Promise<void> {
        const completeSetsContract = await this.contractDeployer.getContractAddress("CompleteSets");
        const completeSets = new CompleteSets(this.dependencies, completeSetsContract);

        const numTicks = await market.getNumTicks_();
        const ethValue = amount.mul(numTicks);

        await completeSets.publicBuyCompleteSets(market.address, amount, { attachedEth: ethValue });
        return;
    }

    public async sellCompleteSets(market: Market, amount: ethers.utils.BigNumber): Promise<void> {
        const completeSetsContract = await this.contractDeployer.getContractAddress("CompleteSets");
        const completeSets = new CompleteSets(this.dependencies, completeSetsContract);

        await completeSets.publicSellCompleteSets(market.address, amount);
        return;
    }

    public async contribute(market: Market, payoutNumerators: Array<ethers.utils.BigNumber>, amount: ethers.utils.BigNumber): Promise<void> {
        await market.contribute(payoutNumerators, amount, "");
        return;
    }

    public async derivePayoutDistributionHash(market: Market, payoutNumerators: Array<ethers.utils.BigNumber>): Promise<string> {
        return await market.derivePayoutDistributionHash_(payoutNumerators);
    }

    public async isForking(): Promise<boolean> {
        return await this.universe!.isForking_();
    }

    public async migrateOutByPayout(reputationToken: ReputationToken, payoutNumerators: Array<ethers.utils.BigNumber>, attotokens: ethers.utils.BigNumber) {
        await reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
        return;
    }

    public async getNumSharesInMarket(market: Market, outcome: ethers.utils.BigNumber): Promise<ethers.utils.BigNumber> {
        const shareTokenAddress = await market.getShareToken_(outcome);
        const shareToken = new ShareToken(this.dependencies, shareTokenAddress);
        return await shareToken.balanceOf_(this.account);
    }

    public async getDisputeWindow(market: Market): Promise<DisputeWindow> {
        const disputeWindowAddress = await market.getDisputeWindow_();
        await this.linkDebugSymbolsForContract('DisputeWindow', disputeWindowAddress);
        return new DisputeWindow(this.dependencies, disputeWindowAddress);
    }

    public async getReportingParticipant(reportingParticipantAddress: string): Promise<DisputeCrowdsourcer> {
        return new DisputeCrowdsourcer(this.dependencies, reportingParticipantAddress);
    }

    public async getUniverse(market: Market): Promise<Universe> {
        const universeAddress = await market.getUniverse_();
        return new Universe(this.dependencies, universeAddress);
    }

    public async getWinningReportingParticipant(market: Market): Promise<DisputeCrowdsourcer> {
        const reportingParticipantAddress = await market.getWinningReportingParticipant_();
        return new DisputeCrowdsourcer(this.dependencies, reportingParticipantAddress);
    }

    public async setTimestamp(timestamp: ethers.utils.BigNumber): Promise<void> {
        const timeContract = await this.contractDeployer.getContractAddress("TimeControlled");
        const time = new TimeControlled(this.dependencies, timeContract);
        await time.setTimestamp(timestamp);
        return;
    }

    public async getTimestamp(): Promise<ethers.utils.BigNumber> {
        return this.contractDeployer.augur!.getTimestamp_();
    }

    public async doInitialReport(market: Market, payoutNumerators: Array<ethers.utils.BigNumber>): Promise<void> {
        await market.doInitialReport(payoutNumerators, "");
        return;
    }

    public async finalizeMarket(market: Market): Promise<void> {
        await market.finalize();
        return;
    }

    public async getLegacyRepBalance(owner: string): Promise<ethers.utils.BigNumber> {
        const legacyRepContract = await this.contractDeployer.getContractAddress("LegacyReputationToken");
        const legacyRep = new LegacyReputationToken(this.dependencies, legacyRepContract);
        return await legacyRep.balanceOf_(owner);
    }

    public async getLegacyRepAllowance(owner: string, spender: string): Promise<ethers.utils.BigNumber> {
        const legacyRepContract = await this.contractDeployer.getContractAddress("LegacyReputationToken");
        const legacyRep = new LegacyReputationToken(this.dependencies, legacyRepContract);
        return await legacyRep.allowance_(owner, spender);
    }

    public async transferLegacyRep(to: string, amount: ethers.utils.BigNumber): Promise<void> {
        const legacyRepContract = await this.contractDeployer.getContractAddress("LegacyReputationToken");
        const legacyRep = new LegacyReputationToken(this.dependencies, legacyRepContract);
        await legacyRep.transfer(to, amount);
        return;
    }

    public async approveLegacyRep(spender: string, amount: ethers.utils.BigNumber): Promise<void> {
        const legacyRepContract = await this.contractDeployer.getContractAddress("LegacyReputationToken");
        const legacyRep = new LegacyReputationToken(this.dependencies, legacyRepContract);
        await legacyRep.approve(spender, amount);
        return;
    }

    public async getChildUniverseReputationToken(parentPayoutDistributionHash: string) {
        const childUniverseAddress = await this.contractDeployer.universe!.getChildUniverse_(parentPayoutDistributionHash);
        const childUniverse = new Universe(this.dependencies, childUniverseAddress);
        const repContractAddress = await childUniverse.getReputationToken_();
        return new ReputationToken(this.dependencies, repContractAddress);
    }

    public async getReputationToken(): Promise<ReputationToken> {
        const repContractAddress = await this.contractDeployer.universe!.getReputationToken_();
        return new ReputationToken(this.dependencies, repContractAddress);
    }

    // TODO: Determine why ETH balance doesn't change when buying complete sets or redeeming reporting participants
    public async getEthBalance(): Promise<ethers.utils.BigNumber> {
        return await this.provider.getBalance(this.account);
    }

    public async getRepBalance(owner: string): Promise<ethers.utils.BigNumber> {
        const rep = await this.getReputationToken();
        return await rep.balanceOf_(owner);
    }

    public async getRepAllowance(owner: string, spender: string): Promise<ethers.utils.BigNumber> {
        const rep = await this.getReputationToken();
        return await rep.allowance_(owner, spender);
    }
}
