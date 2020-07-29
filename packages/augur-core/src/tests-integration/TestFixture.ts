import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { ContractCompiler } from '../libraries/ContractCompiler';
import { ContractDeployer } from '../libraries/ContractDeployer';
import { CompilerConfiguration } from '../libraries/CompilerConfiguration';
import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';
import {
    DisputeWindow,
    ShareToken,
    TimeControlled,
    Cash,
    Universe,
    Market,
    CreateOrder,
    Orders,
    Trade,
    CancelOrder,
    LegacyReputationToken,
    DisputeCrowdsourcer,
    TestNetReputationToken
} from '../libraries/ContractInterfaces';
import { Dependencies } from '../libraries/GenericContractInterfaces';
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';
import { formatBytes32String } from 'ethers/utils';
import { buildConfig } from '@augurproject/artifacts';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAX_APPROVAL = new BigNumber(2).pow(256).minus(1);

export class TestFixture {
    // FIXME: extract out the bits of contract deployer that we need access to, like the contracts/abis, so we can have a more targeted dependency
    readonly contractDeployer: ContractDeployer;
    readonly dependencies: Dependencies<BigNumber>;
    readonly provider: ethers.providers.JsonRpcProvider;
    readonly account: string;

    get universe() {
        return this.contractDeployer.universe!;
    }
    get cash() {
        return new Cash(
            this.dependencies,
            this.contractDeployer.getContractAddress('Cash')
        );
    }
    get shareToken() {
        return new ShareToken(
            this.dependencies,
            this.contractDeployer.getContractAddress('ShareToken')
        );
    }

    constructor(
        dependencies: Dependencies<BigNumber>,
        provider: ethers.providers.JsonRpcProvider,
        contractDeployer: ContractDeployer,
        account: string
    ) {
        this.contractDeployer = contractDeployer;
        this.dependencies = dependencies;
        this.provider = provider;
        this.account = account;
    }

    static create = async (
        pretendToBeProduction = false
    ): Promise<TestFixture> => {
        const compilerConfiguration = CompilerConfiguration.create();
        const config = buildConfig('test', {
            deploy: {
                isProduction: pretendToBeProduction,
                normalTime: false,
            },
        });

        const compiledContracts = await new ContractCompiler(
            compilerConfiguration
        ).compileContracts();

        const provider = new ethers.providers.JsonRpcProvider(
            config.ethereum.http
        );
        const signer = await EthersFastSubmitWallet.create(
            config.deploy.privateKey as string,
            provider
        );
        const dependencies = new ContractDependenciesEthers(
            provider,
            signer,
            signer.address
        );

        const contractDeployer = new ContractDeployer(
            config,
            dependencies,
            provider,
            signer,
            compiledContracts
        );
        await contractDeployer.deploy('test');

        return new TestFixture(
            dependencies,
            provider,
            contractDeployer,
            signer.address
        );
    };

    async approve(): Promise<void> {
        const authority = this.contractDeployer.getContractAddress('Augur');
        await this.cash.approve(authority, MAX_APPROVAL);

        const fillOrder = this.contractDeployer.getContractAddress('FillOrder');
        await this.cash.approve(fillOrder, MAX_APPROVAL);
        await this.shareToken.setApprovalForAll(fillOrder, true);

        const createOrder = this.contractDeployer.getContractAddress(
            'CreateOrder'
        );
        await this.cash.approve(createOrder, MAX_APPROVAL);
        await this.shareToken.setApprovalForAll(createOrder, true);
    }

    async faucet(attoCash: BigNumber): Promise<void> {
        await this.cash.faucet(attoCash);
    }

    async faucetRep(attoRep: BigNumber): Promise<void> {
        const reputationToken = await this.getReputationToken();
        await reputationToken.faucet(attoRep);
    }

    async createMarket(
        universe: Universe,
        outcomes: string[],
        endTime: BigNumber,
        feePerEthInWei: BigNumber,
        affiliateFeeDivisor: BigNumber,
        designatedReporter: string
    ): Promise<Market> {
        const marketCreationFee = await universe.getOrCacheValidityBond_();

        console.log('Creating Market');
        await this.cash.faucet(marketCreationFee);
        console.log('Getting Market Address');
        const marketAddress = await universe.createCategoricalMarket_(
            endTime,
            feePerEthInWei,
            NULL_ADDRESS,
            affiliateFeeDivisor,
            designatedReporter,
            outcomes,
            '{categories: [" "], description: "description"}'
        );
        if (!marketAddress || marketAddress === '0x') {
            throw new Error(
                'Unable to get address for new categorical market.'
            );
        }
        console.log('Sending Market Transaction');
        await universe.createCategoricalMarket(
            endTime,
            feePerEthInWei,
            NULL_ADDRESS,
            affiliateFeeDivisor,
            designatedReporter,
            outcomes,
            '{categories: [" "], description: "description"}'
        );
        return new Market(this.dependencies, marketAddress);
    }

    async createReasonableMarket(
        universe: Universe,
        outcomes: string[]
    ): Promise<Market> {
        const endTime = new BigNumber(
            Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60
        );
        const fee = new BigNumber(10).pow(16);
        const affiliateFeeDivisor = new BigNumber(25);
        return this.createMarket(
            universe,
            outcomes,
            endTime,
            fee,
            affiliateFeeDivisor,
            this.account
        );
    }

    async placeOrder(
        market: string,
        type: BigNumber,
        numShares: BigNumber,
        price: BigNumber,
        outcome: BigNumber,
        betterOrderID: string,
        worseOrderID: string,
        tradeGroupID: string
    ): Promise<void> {
        const createOrderContract = await this.contractDeployer.getContractAddress(
            'CreateOrder'
        );
        const createOrder = new CreateOrder(
            this.dependencies,
            createOrderContract
        );

        const ethValue = numShares.multipliedBy(price);

        await this.cash.faucet(ethValue);
        await createOrder.publicCreateOrder(
            type,
            numShares,
            price,
            market,
            outcome,
            betterOrderID,
            worseOrderID,
            tradeGroupID
        );
        return;
    }

    async takeBestOrder(
        marketAddress: string,
        type: BigNumber,
        numShares: BigNumber,
        price: BigNumber,
        outcome: BigNumber,
        tradeGroupID: string
    ): Promise<void> {
        const tradeContract = await this.contractDeployer.getContractAddress(
            'Trade'
        );
        const trade = new Trade(this.dependencies, tradeContract);

        let actualPrice = price;
        if (type.isEqualTo(1)) {
            const market = new Market(this.dependencies, marketAddress);
            const numTicks = await market.getNumTicks_();
            actualPrice = numTicks.minus(price);
        }
        const ethValue = numShares.multipliedBy(actualPrice);

        await this.cash.faucet(ethValue);

        const bestPriceAmount = await trade.publicFillBestOrder_(
            type,
            marketAddress,
            outcome,
            numShares,
            price,
            tradeGroupID,
            new BigNumber(3),
            NULL_ADDRESS
        );
        if (bestPriceAmount.isEqualTo(0)) {
            throw new Error('Could not take best Order');
        }

        await trade.publicFillBestOrder(
            type,
            marketAddress,
            outcome,
            numShares,
            price,
            tradeGroupID,
            new BigNumber(3),
            NULL_ADDRESS
        );
        return;
    }

    async cancelOrder(orderID: string): Promise<void> {
        const cancelOrderContract = await this.contractDeployer.getContractAddress(
            'CancelOrder'
        );
        const cancelOrder = new CancelOrder(
            this.dependencies,
            cancelOrderContract
        );

        await cancelOrder.cancelOrder(orderID);
        return;
    }

    async claimTradingProceeds(
        market: Market,
        shareholder: string,
        fingerprint = formatBytes32String('')
    ): Promise<void> {
        const shareTokenContract = await this.contractDeployer.getContractAddress(
            'ShareToken'
        );
        const shareToken = new ShareToken(
            this.dependencies,
            shareTokenContract
        );
        await shareToken.claimTradingProceeds(
            market.address,
            shareholder,
            fingerprint
        );
        return;
    }

    async getOrderPrice(orderID: string): Promise<BigNumber> {
        const ordersContract = await this.contractDeployer.getContractAddress(
            'Orders'
        );
        const orders = new Orders(this.dependencies, ordersContract);

        const price = await orders.getPrice_(orderID);
        if (price.toNumber() === 0) {
            throw new Error('Unable to get order price');
        }
        return price;
    }

    async getOrderAmount(orderID: string): Promise<BigNumber> {
        const ordersContract = await this.contractDeployer.getContractAddress(
            'Orders'
        );
        const orders = new Orders(this.dependencies, ordersContract);
        return orders.getAmount_(orderID);
    }

    async getBestOrderId(
        type: BigNumber,
        market: string,
        outcome: BigNumber
    ): Promise<string> {
        const ordersContract = await this.contractDeployer.getContractAddress(
            'Orders'
        );
        const orders = new Orders(this.dependencies, ordersContract);

        const orderID = await orders.getBestOrderId_(type, market, outcome);
        if (!orderID) {
            throw new Error('Unable to get order price');
        }
        return orderID;
    }

    async buyCompleteSets(market: Market, amount: BigNumber): Promise<void> {
        const shareTokenContract = await this.contractDeployer.getContractAddress(
            'ShareToken'
        );
        const shareToken = new ShareToken(
            this.dependencies,
            shareTokenContract
        );

        const numTicks = await market.getNumTicks_();
        const ethValue = amount.multipliedBy(numTicks);

        await this.cash.faucet(ethValue);
        await shareToken.publicBuyCompleteSets(market.address, amount);
        return;
    }

    async sellCompleteSets(market: Market, amount: BigNumber): Promise<void> {
        const shareTokenContract = await this.contractDeployer.getContractAddress(
            'ShareToken'
        );
        const shareToken = new ShareToken(
            this.dependencies,
            shareTokenContract
        );

        await shareToken.publicSellCompleteSets(market.address, amount);
        return;
    }

    async contribute(
        market: Market,
        payoutNumerators: BigNumber[],
        amount: BigNumber
    ): Promise<void> {
        await market.contribute(payoutNumerators, amount, '');
        return;
    }

    async derivePayoutDistributionHash(
        market: Market,
        payoutNumerators: BigNumber[]
    ): Promise<string> {
        return market.derivePayoutDistributionHash_(payoutNumerators);
    }

    async isForking(): Promise<boolean> {
        return this.universe!.isForking_();
    }

    async migrateOutByPayout(
        reputationToken: TestNetReputationToken,
        payoutNumerators: BigNumber[],
        attotokens: BigNumber
    ) {
        await reputationToken.migrateOutByPayout(payoutNumerators, attotokens);
    }

    async getNumSharesInMarket(
        market: Market,
        outcome: BigNumber
    ): Promise<BigNumber> {
        const shareTokenAddress = await this.contractDeployer.getContractAddress(
            'ShareToken'
        );
        const shareToken = new ShareToken(this.dependencies, shareTokenAddress);
        return shareToken.balanceOfMarketOutcome_(
            market.address,
            outcome,
            this.account
        );
    }

    async getDisputeWindow(market: Market): Promise<DisputeWindow> {
        const disputeWindowAddress = await market.getDisputeWindow_();
        return new DisputeWindow(this.dependencies, disputeWindowAddress);
    }

    async getReportingParticipant(
        reportingParticipantAddress: string
    ): Promise<DisputeCrowdsourcer> {
        return new DisputeCrowdsourcer(
            this.dependencies,
            reportingParticipantAddress
        );
    }

    async getUniverse(market: Market): Promise<Universe> {
        const universeAddress = await market.getUniverse_();
        return new Universe(this.dependencies, universeAddress);
    }

    async getWinningReportingParticipant(
        market: Market
    ): Promise<DisputeCrowdsourcer> {
        const reportingParticipantAddress = await market.getWinningReportingParticipant_();
        return new DisputeCrowdsourcer(
            this.dependencies,
            reportingParticipantAddress
        );
    }

    async setTimestamp(timestamp: BigNumber): Promise<void> {
        const timeContract = await this.contractDeployer.getContractAddress(
            'TimeControlled'
        );
        const time = new TimeControlled(this.dependencies, timeContract);
        await time.setTimestamp(timestamp);
        return;
    }

    async getTimestamp(): Promise<BigNumber> {
        return this.contractDeployer.augur!.getTimestamp_();
    }

    async doInitialReport(
        market: Market,
        payoutNumerators: BigNumber[]
    ): Promise<void> {
        await market.doInitialReport(payoutNumerators, '', new BigNumber(0));
        return;
    }

    async finalizeMarket(market: Market): Promise<void> {
        await market.finalize();
        return;
    }

    async getLegacyRepBalance(owner: string): Promise<BigNumber> {
        const legacyRepContract = await this.contractDeployer.getContractAddress(
            'LegacyReputationToken'
        );
        const legacyRep = new LegacyReputationToken(
            this.dependencies,
            legacyRepContract
        );
        return legacyRep.balanceOf_(owner);
    }

    async getLegacyRepAllowance(
        owner: string,
        spender: string
    ): Promise<BigNumber> {
        const legacyRepContract = await this.contractDeployer.getContractAddress(
            'LegacyReputationToken'
        );
        const legacyRep = new LegacyReputationToken(
            this.dependencies,
            legacyRepContract
        );
        return legacyRep.allowance_(owner, spender);
    }

    async transferLegacyRep(to: string, amount: BigNumber): Promise<void> {
        const legacyRepContract = await this.contractDeployer.getContractAddress(
            'LegacyReputationToken'
        );
        const legacyRep = new LegacyReputationToken(
            this.dependencies,
            legacyRepContract
        );
        await legacyRep.transfer(to, amount);
        return;
    }

    async approveLegacyRep(spender: string, amount: BigNumber): Promise<void> {
        const legacyRepContract = await this.contractDeployer.getContractAddress(
            'LegacyReputationToken'
        );
        const legacyRep = new LegacyReputationToken(
            this.dependencies,
            legacyRepContract
        );
        await legacyRep.approve(spender, amount);
        return;
    }

    async getChildUniverseReputationToken(
        parentPayoutDistributionHash: string
    ) {
        const childUniverseAddress = await this.contractDeployer.universe!.getChildUniverse_(
            parentPayoutDistributionHash
        );
        const childUniverse = new Universe(
            this.dependencies,
            childUniverseAddress
        );
        const repContractAddress = await childUniverse.getReputationToken_();
        return new TestNetReputationToken(
            this.dependencies,
            repContractAddress
        );
    }

    async getReputationToken(): Promise<TestNetReputationToken> {
        const repContractAddress = await this.contractDeployer.universe!.getReputationToken_();
        return new TestNetReputationToken(
            this.dependencies,
            repContractAddress
        );
    }

    async getEthBalance(): Promise<string> {
        const ethBalance = await this.provider.getBalance(this.account);
        return ethBalance.toString();
    }

    async getRepBalance(owner: string): Promise<BigNumber> {
        const rep = await this.getReputationToken();
        return rep.balanceOf_(owner);
    }

    async getRepAllowance(owner: string, spender: string): Promise<BigNumber> {
        const rep = await this.getReputationToken();
        return rep.allowance_(owner, spender);
    }

    async pokeRepOracle(): Promise<BigNumber> {
        return this.contractDeployer.universe!.pokeRepMarketCapInAttoCash_();
    }
}
