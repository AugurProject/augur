// Create market, make a trade on it, designated reporter reports, market is finalized, traders settle shares, reporters redeem tokens.

// TODO: Add checks to ensure ETH redeemed for shares/reporting fees is correct, since fixture.getEthBalance returns the same amount every time it's called.

import { BigNumber } from "bignumber.js";
import { expect } from "chai";
import "jest";
import { stringTo32ByteHex } from "../libraries/HelperFunctions";
import { TestFixture } from './TestFixture';
import { ReportingUtils } from './ReportingUtils';

describe("TradeAndReport", () => {
    let fixture: TestFixture;
    jest.setTimeout(1000000);
    beforeAll(async () => {
        fixture = await TestFixture.create();
    });
    it("#tradeAndReport", async () => {
        await fixture.approveCentralAuthority();

        let ethBalance = await fixture.getEthBalance();
        console.log("Starting ETH balance", ethBalance.toString());

        // Create a market
        const market = await fixture.createReasonableMarket(fixture.universe!, [stringTo32ByteHex(" "), stringTo32ByteHex(" ")]);

        // Place an order
        let type = new BigNumber(0); // BID
        let outcome = new BigNumber(0);
        let numShares = new BigNumber(10000000000000);
        let price = new BigNumber(21);

        await fixture.placeOrder(market.address, type, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

        const orderID = await fixture.getBestOrderId(type, market.address, outcome)

        const orderPrice = await fixture.getOrderPrice(orderID);
        expect(orderPrice.toNumber()).to.equal(price.toNumber());

        ethBalance = await fixture.getEthBalance();
        console.log("ethBalance before buying complete set", ethBalance.toString());

        // Buy complete sets
        await fixture.buyCompleteSets(market, numShares);
        const numOwnedShares = await fixture.getNumSharesInMarket(market, outcome);
        expect(numOwnedShares.toNumber()).to.equal(numShares.toNumber());

        ethBalance = await fixture.getEthBalance();
        console.log("ethBalance after buying complete set", ethBalance.toString());

        // Cancel the original rest of order
        await fixture.cancelOrder(orderID);
        const remainingAmount = await fixture.getOrderAmount(orderID);
        expect(remainingAmount.toNumber()).to.equal(0);

        // Proceed to reporting
        const reportingUtils = new ReportingUtils();
        await reportingUtils.proceedToFork(fixture, market);

        const isForking = await fixture.isForking();
        expect(isForking).to.be.true;

        const numTicks = await market.getNumTicks_();
        const reputationToken = await fixture.getReputationToken();
        const payoutDistributionHash = await fixture.derivePayoutDistributionHash(market, [new BigNumber(0), numTicks, new BigNumber(0)]);
        const childUniverseReputationToken = await fixture.getChildUniverseReputationToken(payoutDistributionHash);
        const initialRepTotalMigrated = await childUniverseReputationToken.getTotalMigrated_();
        expect(initialRepTotalMigrated === new BigNumber("366666666666666667016192")); // TODO: calculate this value instead of hard-coding it
        const repAmountToMigrate = new BigNumber(9000000).multipliedBy(new BigNumber(10).pow(18));
        await fixture.migrateOutByPayout(reputationToken, [new BigNumber(0), numTicks, new BigNumber(0)], repAmountToMigrate);
        const finalRepTotalMigrated = await childUniverseReputationToken.getTotalMigrated_();
        expect(finalRepTotalMigrated.minus(initialRepTotalMigrated).toString()).to.equal(repAmountToMigrate.toString());

        let isFinalized = await market.isFinalized_();
        expect(isFinalized).to.be.true;
    });
});
