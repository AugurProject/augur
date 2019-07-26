#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture, mark
from utils import fix, AssertLog, EtherDelta, TokenDelta, BuyWithCash, nullAddress
from constants import YES, NO


def captureLog(contract, logs, message):
    translated = contract.translator.listen(message)
    if not translated: return
    logs.append(translated)

def acquireLongShares(kitchenSinkFixture, cash, market, outcome, amount, approvalAddress, sender):
    if amount == 0: return

    shareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(outcome))
    completeSets = kitchenSinkFixture.contracts['CompleteSets']
    cost = amount * market.getNumTicks()
    with BuyWithCash(cash, cost, sender, "complete set buy"):
        assert completeSets.publicBuyCompleteSets(market.address, amount, sender = sender)
    assert shareToken.approve(approvalAddress, amount, sender = sender)
    for otherOutcome in range(0, market.getNumberOfOutcomes()):
        if otherOutcome == outcome: continue
        otherShareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(otherOutcome))
        assert otherShareToken.transfer(kitchenSinkFixture.accounts[8], amount, sender = sender)

def acquireShortShareSet(kitchenSinkFixture, cash, market, outcome, amount, approvalAddress, sender):
    if amount == 0: return
    cost = amount * market.getNumTicks()

    shareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(outcome))
    completeSets = kitchenSinkFixture.contracts['CompleteSets']
    with BuyWithCash(cash, cost, sender, "complete set buy"):
        assert completeSets.publicBuyCompleteSets(market.address, amount, sender = sender)
    assert shareToken.transfer(kitchenSinkFixture.accounts[8], amount, sender = sender)
    for otherOutcome in range(0, market.getNumberOfOutcomes()):
        if otherOutcome == outcome: continue
        otherShareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(otherOutcome))
        assert otherShareToken.approve(approvalAddress, amount, sender = sender)

def finalizeMarket(fixture, market, payoutNumerators):
    # set timestamp to after market end
    fixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)
    # have kitchenSinkFixture.accounts[0] submit designated report
    market.doInitialReport(payoutNumerators, "", 0)
    # set timestamp to after designated dispute end
    disputeWindow = fixture.applySignature('DisputeWindow', market.getDisputeWindow())
    fixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    # finalize the market
    assert market.finalize()

def test_helpers(kitchenSinkFixture, scalarMarket):
    market = scalarMarket
    claimTradingProceeds = kitchenSinkFixture.contracts['ClaimTradingProceeds']
    finalizeMarket(kitchenSinkFixture, market, [0,0,40*10**4])

    assert claimTradingProceeds.calculateCreatorFee(market.address, fix('3')) == fix('0.03')
    assert claimTradingProceeds.calculateReportingFee(market.address, fix('5')) == fix('0.05')
    assert claimTradingProceeds.calculateProceeds(market.address, YES, 7) == 7 * market.getNumTicks()
    assert claimTradingProceeds.calculateProceeds(market.address, NO, fix('11')) == fix('0')
    (proceeds, shareholderShare, creatorShare, reporterShare) = claimTradingProceeds.divideUpWinnings(market.address, YES, 13)
    assert proceeds == 13.0 * market.getNumTicks()
    assert reporterShare == 13.0 * market.getNumTicks() * 0.01
    assert creatorShare == 13.0 * market.getNumTicks() * 0.01
    assert shareholderShare == 13.0 * market.getNumTicks() * 0.98

def test_redeem_shares_in_yesNo_market(kitchenSinkFixture, universe, cash, market):
    claimTradingProceeds = kitchenSinkFixture.contracts['ClaimTradingProceeds']
    yesShareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(NO))
    expectedValue = 1 * market.getNumTicks()
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees
    expectedPayout = expectedValue - expectedSettlementFees

    assert universe.getOpenInterestInAttoCash() == 0

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[1])
    assert universe.getOpenInterestInAttoCash() == 1 * market.getNumTicks()
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[2])
    assert universe.getOpenInterestInAttoCash() == 2 * market.getNumTicks()
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**2])


    tradingProceedsClaimedLog = {
        'market': market.address,
        'shareToken': yesShareToken.address,
        'numPayoutTokens': expectedPayout,
        'numShares': 1,
        'sender': kitchenSinkFixture.accounts[1],
        'fees': 2,
    }

    with TokenDelta(cash, expectedMarketCreatorFees, market.getOwner(), "market creator fees not paid"):
        with TokenDelta(cash, expectedReporterFees, universe.getOrCreateNextDisputeWindow(False), "Reporter fees not paid"):
            # redeem shares with a1
            with AssertLog(kitchenSinkFixture, "TradingProceedsClaimed", tradingProceedsClaimedLog):
                claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], nullAddress)
            # redeem shares with a2
            claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], nullAddress)

    # assert a1 ends up with cash (minus fees) and a2 does not
    assert cash.balanceOf(kitchenSinkFixture.accounts[1]) == expectedPayout
    assert yesShareToken.balanceOf(kitchenSinkFixture.accounts[1]) == 0
    assert yesShareToken.balanceOf(kitchenSinkFixture.accounts[2]) == 0
    assert noShareToken.balanceOf(kitchenSinkFixture.accounts[1]) == 0
    assert noShareToken.balanceOf(kitchenSinkFixture.accounts[2]) == 0

def test_redeem_shares_in_categorical_market(kitchenSinkFixture, universe, cash, categoricalMarket):
    market = categoricalMarket
    claimTradingProceeds = kitchenSinkFixture.contracts['ClaimTradingProceeds']
    shareToken2 = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(2))
    shareToken1 = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(1))
    shareToken0 = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(0))
    numTicks = market.getNumTicks()
    expectedValue = numTicks
    expectedSettlementFees = expectedValue * 0.02
    expectedPayout = expectedValue - expectedSettlementFees

    assert universe.getOpenInterestInAttoCash() == 0

    # get long shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, 3, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[1])
    assert universe.getOpenInterestInAttoCash() == 1 * numTicks
    # get short shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, 3, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[2])
    assert universe.getOpenInterestInAttoCash() == 2 * numTicks

    finalizeMarket(kitchenSinkFixture, market, [0, 0, 0, numTicks])

    assert universe.getOpenInterestInAttoCash() == 0

    # redeem shares with a1
    claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], nullAddress)
    # redeem shares with a2
    claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], nullAddress)

    # assert both accounts are paid (or not paid) accordingly
    assert cash.balanceOf(kitchenSinkFixture.accounts[1]) == expectedPayout
    assert cash.balanceOf(kitchenSinkFixture.accounts[2]) == 0

    assert shareToken2.balanceOf(kitchenSinkFixture.accounts[1]) == 0
    assert shareToken2.balanceOf(kitchenSinkFixture.accounts[2]) == 0
    assert shareToken1.balanceOf(kitchenSinkFixture.accounts[1]) == 0
    assert shareToken1.balanceOf(kitchenSinkFixture.accounts[2]) == 0
    assert shareToken0.balanceOf(kitchenSinkFixture.accounts[1]) == 0
    assert shareToken0.balanceOf(kitchenSinkFixture.accounts[2]) == 0

def test_redeem_shares_in_scalar_market(kitchenSinkFixture, universe, cash, scalarMarket):
    market = scalarMarket
    claimTradingProceeds = kitchenSinkFixture.contracts['ClaimTradingProceeds']
    yesShareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(NO))
    expectedValue = 1 * market.getNumTicks()
    expectedSettlementFees = expectedValue * 0.02
    expectedPayout = expectedValue - expectedSettlementFees

    assert universe.getOpenInterestInAttoCash() == 0

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[1])
    assert universe.getOpenInterestInAttoCash() == 1 * market.getNumTicks()
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[2])
    assert universe.getOpenInterestInAttoCash() == 2 * market.getNumTicks()
    finalizeMarket(kitchenSinkFixture, market, [0, 10**5, 3*10**5])

    # redeem shares with a1
    claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], nullAddress)
    # redeem shares with a2
    claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], nullAddress)

    # assert a1 ends up with cash (minus fees) and a2 does not
    assert cash.balanceOf(kitchenSinkFixture.accounts[1]) == expectedPayout * 3 / 4
    assert cash.balanceOf(kitchenSinkFixture.accounts[2]) == expectedPayout * 1 / 4

    assert yesShareToken.balanceOf(kitchenSinkFixture.accounts[1]) == 0
    assert yesShareToken.balanceOf(kitchenSinkFixture.accounts[2]) == 0
    assert noShareToken.balanceOf(kitchenSinkFixture.accounts[1]) == 0
    assert noShareToken.balanceOf(kitchenSinkFixture.accounts[2]) == 0

def test_reedem_failure(kitchenSinkFixture, cash, market):
    claimTradingProceeds = kitchenSinkFixture.contracts['ClaimTradingProceeds']

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[1])
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[2])
    # set timestamp to after market end
    kitchenSinkFixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)
    # have kitchenSinkFixture.accounts[0] subimt designated report (75% high, 25% low, range -10*10^18 to 30*10^18)
    market.doInitialReport([0, 0, 100], "", 0)
    # set timestamp to after designated dispute end
    disputeWindow = kitchenSinkFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    # market not finalized
    with raises(TransactionFailed):
        claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], nullAddress)
    # finalize the market
    assert market.finalize()

    # validate that everything else is OK
    assert claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], nullAddress)

def test_redeem_shares_in_multiple_markets(kitchenSinkFixture, universe, cash, market, scalarMarket):
    claimTradingProceeds = kitchenSinkFixture.contracts['ClaimTradingProceeds']

    # Get scalar LONG shares with a1
    expectedValue = 1 * scalarMarket.getNumTicks() * 3 / 4
    expectedSettlementFees = expectedValue * 0.02
    expectedPayout = expectedValue - expectedSettlementFees
    acquireLongShares(kitchenSinkFixture, cash, scalarMarket, YES, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[1])
    finalizeMarket(kitchenSinkFixture, scalarMarket, [0, 10**5, 3*10**5])

    # get YES shares with a1
    expectedValue = 1 * market.getNumTicks()
    expectedSettlementFees = expectedValue * 0.02
    expectedPayout += expectedValue - expectedSettlementFees
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[1])
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**2])

    with TokenDelta(cash, expectedPayout, kitchenSinkFixture.accounts[1], "Claiming multiple markets did not give expected payout"):
        assert claimTradingProceeds.claimMarketsProceeds([market.address, scalarMarket.address], kitchenSinkFixture.accounts[1], nullAddress)

def test_redeem_shares_affiliate(kitchenSinkFixture, universe, cash, market):
    claimTradingProceeds = kitchenSinkFixture.contracts['ClaimTradingProceeds']
    yesShareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = kitchenSinkFixture.applySignature('ShareToken', market.getShareToken(NO))
    expectedValue = 100 * market.getNumTicks()
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees
    expectedPayout = expectedValue - expectedSettlementFees
    expectedAffiliateFees = expectedMarketCreatorFees / market.affiliateFeeDivisor()
    expectedMarketCreatorFees = expectedMarketCreatorFees - expectedAffiliateFees

    assert universe.getOpenInterestInAttoCash() == 0
    affiliateAddress = kitchenSinkFixture.accounts[5]

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 100, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[1])
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 100, claimTradingProceeds.address, sender = kitchenSinkFixture.accounts[2])
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**2])

    with TokenDelta(cash, expectedMarketCreatorFees, market.getOwner(), "market creator fees not paid"):
        with TokenDelta(cash, expectedAffiliateFees, affiliateAddress, "affiliate fees not paid"):
            # redeem shares with a1
            claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], affiliateAddress)
            # redeem shares with a2
            claimTradingProceeds.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], affiliateAddress)

    # assert a1 ends up with cash (minus fees) and a2 does not
    assert cash.balanceOf(kitchenSinkFixture.accounts[1]) == expectedPayout
    assert yesShareToken.balanceOf(kitchenSinkFixture.accounts[1]) == 0
    assert yesShareToken.balanceOf(kitchenSinkFixture.accounts[2]) == 0
    assert noShareToken.balanceOf(kitchenSinkFixture.accounts[1]) == 0
    assert noShareToken.balanceOf(kitchenSinkFixture.accounts[2]) == 0