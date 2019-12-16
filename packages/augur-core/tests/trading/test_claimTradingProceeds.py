#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture, mark
from utils import fix, AssertLog, EtherDelta, TokenDelta, BuyWithCash, nullAddress, longTo32Bytes
from constants import YES, NO


def acquireLongShares(kitchenSinkFixture, cash, market, outcome, amount, approvalAddress, sender):
    if amount == 0: return
    shareToken = kitchenSinkFixture.contracts["ShareToken"]

    cost = amount * market.getNumTicks()
    with BuyWithCash(cash, cost, sender, "complete set buy"):
        assert shareToken.publicBuyCompleteSets(market.address, amount, sender = sender)
    for otherOutcome in range(0, market.getNumberOfOutcomes()):
        if otherOutcome == outcome: continue
        shareToken.safeTransferFrom(sender, kitchenSinkFixture.accounts[8], shareToken.getTokenId(market.address, otherOutcome), amount, "", sender = sender)

def acquireShortShareSet(kitchenSinkFixture, cash, market, outcome, amount, approvalAddress, sender):
    if amount == 0: return
    cost = amount * market.getNumTicks()
    shareToken = kitchenSinkFixture.contracts["ShareToken"]

    with BuyWithCash(cash, cost, sender, "complete set buy"):
        assert shareToken.publicBuyCompleteSets(market.address, amount, sender = sender)
    shareToken.safeTransferFrom(sender, kitchenSinkFixture.accounts[8], shareToken.getTokenId(market.address, outcome), amount, "", sender = sender)

def finalizeMarket(fixture, market, payoutNumerators):
    prepare_finalize_market(fixture, market, payoutNumerators)
    assert market.finalize()

def prepare_finalize_market(fixture, market, payoutNumerators):
    # set timestamp to after market end
    fixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)
    # have kitchenSinkFixture.accounts[0] submit designated report
    market.doInitialReport(payoutNumerators, "", 0)
    # set timestamp to after designated dispute end
    disputeWindow = fixture.applySignature('DisputeWindow', market.getDisputeWindow())
    fixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    # finalize the market

def test_helpers(kitchenSinkFixture, scalarMarket):
    market = scalarMarket
    shareToken= kitchenSinkFixture.contracts['ShareToken']
    finalizeMarket(kitchenSinkFixture, market, [0,0,40*10**4])

    assert shareToken.calculateCreatorFee(market.address, fix('3')) == fix('0.03')
    assert shareToken.calculateReportingFee(market.address, fix('5')) == fix('0.05')
    assert shareToken.calculateProceeds(market.address, YES, 7) == 7 * market.getNumTicks()
    assert shareToken.calculateProceeds(market.address, NO, fix('11')) == fix('0')
    (proceeds, shareholderShare, creatorShare, reporterShare) = shareToken.divideUpWinnings(market.address, YES, 13)
    assert proceeds == 13.0 * market.getNumTicks()
    assert reporterShare == 13.0 * market.getNumTicks() * 0.01
    assert creatorShare == 13.0 * market.getNumTicks() * 0.01
    assert shareholderShare == 13.0 * market.getNumTicks() * 0.98

@mark.parametrize('afterMkrShutdown', [
    True,
    False
])
def test_redeem_shares_in_yesNo_market(afterMkrShutdown, kitchenSinkFixture, universe, cash, market):
    shareToken = kitchenSinkFixture.contracts["ShareToken"]
    expectedValue = 1 * market.getNumTicks()
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees
    expectedPayout = expectedValue - expectedSettlementFees

    if (afterMkrShutdown):
        kitchenSinkFixture.MKRShutdown()

    assert universe.getOpenInterestInAttoCash() == 0

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    assert universe.getOpenInterestInAttoCash() == 1 * market.getNumTicks()
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[2])
    assert universe.getOpenInterestInAttoCash() == 2 * market.getNumTicks()
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**2])


    tradingProceedsClaimedLog = {
        'market': market.address,
        'numPayoutTokens': expectedPayout,
        'numShares': 1,
        'sender': kitchenSinkFixture.accounts[1],
        'fees': 2,
    }

    daiVat = kitchenSinkFixture.contracts['DaiVat']
    disputeWindow = universe.getOrCreateNextDisputeWindow(False)
    originalDisputeWindowBalance = cash.balanceOf(disputeWindow)
    originalMarketCreatorBalance = cash.balanceOf(market.getOwner())

    # redeem shares with a1
    with AssertLog(kitchenSinkFixture, "TradingProceedsClaimed", tradingProceedsClaimedLog):
        shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], longTo32Bytes(11))
    # redeem shares with a2
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], longTo32Bytes(11))

    newDisputeWindowBalance = cash.balanceOf(disputeWindow) + daiVat.dai(disputeWindow) / 10**27
    assert newDisputeWindowBalance == expectedReporterFees + originalDisputeWindowBalance

    if afterMkrShutdown:
        newMarketCreatorBalanceFromFees = (daiVat.dai(market.getOwner()) - 10**46) / 10**27 # - 10**46 is subtracting winnings to get fees
    else:
        newMarketCreatorBalanceFromFees = cash.balanceOf(market.getOwner())
    assert newMarketCreatorBalanceFromFees == int(expectedMarketCreatorFees) + originalMarketCreatorBalance

    # assert a1 ends up with cash (minus fees) and a2 does not
    if afterMkrShutdown:
        assert daiVat.dai(kitchenSinkFixture.accounts[1]) / 10**27 == expectedPayout
    else:
        assert cash.balanceOf(kitchenSinkFixture.accounts[1]) == expectedPayout

    assert shareToken.balanceOfMarketOutcome(market.address, YES, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, kitchenSinkFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, kitchenSinkFixture.accounts[2]) == 0

def test_redeem_shares_in_categorical_market(kitchenSinkFixture, universe, cash, categoricalMarket):
    market = categoricalMarket
    shareToken = kitchenSinkFixture.contracts["ShareToken"]

    numTicks = market.getNumTicks()
    expectedValue = numTicks
    expectedSettlementFees = expectedValue * 0.02
    expectedPayout = expectedValue - expectedSettlementFees

    assert universe.getOpenInterestInAttoCash() == 0

    # get long shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, 3, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    assert universe.getOpenInterestInAttoCash() == 1 * numTicks
    # get short shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, 3, 1, shareToken.address, sender = kitchenSinkFixture.accounts[2])
    assert universe.getOpenInterestInAttoCash() == 2 * numTicks

    prepare_finalize_market(kitchenSinkFixture, market, [0, 0, 0, numTicks])

    # redeem shares with a1
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], longTo32Bytes(11))
    assert market.isFinalized()
    # redeem shares with a2
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], longTo32Bytes(11))

    assert universe.getOpenInterestInAttoCash() == 0
    # assert both accounts are paid (or not paid) accordingly
    assert cash.balanceOf(kitchenSinkFixture.accounts[1]) == expectedPayout
    assert cash.balanceOf(kitchenSinkFixture.accounts[2]) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, 2, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 2, kitchenSinkFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, kitchenSinkFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 0, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 0, kitchenSinkFixture.accounts[2]) == 0

def test_redeem_shares_in_scalar_market(kitchenSinkFixture, universe, cash, scalarMarket):
    market = scalarMarket
    shareToken = kitchenSinkFixture.contracts["ShareToken"]
    expectedValue = 1 * market.getNumTicks()
    expectedSettlementFees = expectedValue * 0.02
    expectedPayout = expectedValue - expectedSettlementFees

    assert universe.getOpenInterestInAttoCash() == 0

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    assert universe.getOpenInterestInAttoCash() == 1 * market.getNumTicks()
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[2])
    assert universe.getOpenInterestInAttoCash() == 2 * market.getNumTicks()
    finalizeMarket(kitchenSinkFixture, market, [0, 10**5, 3*10**5])

    # redeem shares with a1
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], longTo32Bytes(11))
    # redeem shares with a2
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], longTo32Bytes(11))

    # assert a1 ends up with cash (minus fees) and a2 does not
    assert cash.balanceOf(kitchenSinkFixture.accounts[1]) == expectedPayout * 3 / 4
    assert cash.balanceOf(kitchenSinkFixture.accounts[2]) == expectedPayout * 1 / 4

    assert shareToken.balanceOfMarketOutcome(market.address, YES, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, kitchenSinkFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, kitchenSinkFixture.accounts[2]) == 0

def test_reedem_failure(kitchenSinkFixture, cash, market):
    shareToken = kitchenSinkFixture.contracts['ShareToken']

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[2])

    # can't claim trading proceeds before market ends
    with raises(TransactionFailed):
        shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], longTo32Bytes(11))

    # set timestamp to after market end
    kitchenSinkFixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)

    # have kitchenSinkFixture.accounts[0] subimt designated report (75% high, 25% low, range -10*10^18 to 30*10^18)
    market.doInitialReport([0, 0, 100], "", 0)
    # set timestamp to after designated dispute end
    disputeWindow = kitchenSinkFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    # validate that everything else is OK
    assert shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], longTo32Bytes(11))
    assert market.isFinalized()

def test_redeem_shares_in_multiple_markets(kitchenSinkFixture, universe, cash, market, scalarMarket):
    shareToken = kitchenSinkFixture.contracts['ShareToken']
    augurTrading = kitchenSinkFixture.contracts['AugurTrading']

    # Get scalar LONG shares with a1
    expectedValue = 1 * scalarMarket.getNumTicks() * 3 / 4
    expectedSettlementFees = expectedValue * 0.02
    expectedPayout = expectedValue - expectedSettlementFees
    acquireLongShares(kitchenSinkFixture, cash, scalarMarket, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    finalizeMarket(kitchenSinkFixture, scalarMarket, [0, 10**5, 3*10**5])

    # get YES shares with a1
    expectedValue = 1 * market.getNumTicks()
    expectedSettlementFees = expectedValue * 0.02
    expectedPayout += expectedValue - expectedSettlementFees
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**2])

    with TokenDelta(cash, expectedPayout, kitchenSinkFixture.accounts[1], "Claiming multiple markets did not give expected payout"):
        assert augurTrading.claimMarketsProceeds([market.address, scalarMarket.address], kitchenSinkFixture.accounts[1], longTo32Bytes(11))

def test_redeem_shares_affiliate(kitchenSinkFixture, universe, cash, market):
    affiliates = kitchenSinkFixture.contracts['Affiliates']
    shareToken = kitchenSinkFixture.contracts['ShareToken']
    expectedValue = 100 * market.getNumTicks()
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees
    expectedPayout = expectedValue - expectedSettlementFees
    expectedAffiliateFees = expectedMarketCreatorFees / market.affiliateFeeDivisor()
    expectedMarketCreatorFees = expectedMarketCreatorFees - expectedAffiliateFees
    sourceKickback = expectedAffiliateFees / 5
    expectedAffiliateFees -= sourceKickback
    fingerprint = longTo32Bytes(11)

    assert universe.getOpenInterestInAttoCash() == 0
    affiliateAddress = kitchenSinkFixture.accounts[5]
    affiliates.setReferrer(affiliateAddress, longTo32Bytes(0), sender=kitchenSinkFixture.accounts[1])
    affiliates.setReferrer(affiliateAddress, longTo32Bytes(0), sender=kitchenSinkFixture.accounts[2])

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 100, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 100, shareToken.address, sender = kitchenSinkFixture.accounts[2])
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**2])

    with TokenDelta(cash, expectedMarketCreatorFees, market.getOwner(), "market creator fees not paid"):
        with TokenDelta(cash, expectedAffiliateFees, affiliateAddress, "affiliate fees not paid"):
            # redeem shares with a1
            shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], fingerprint)
            # redeem shares with a2
            shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], fingerprint)

    # assert a1 ends up with cash (minus fees) and a2 does not
    assert cash.balanceOf(kitchenSinkFixture.accounts[1]) == expectedPayout + sourceKickback
    assert shareToken.balanceOfMarketOutcome(market.address, YES, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, kitchenSinkFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, kitchenSinkFixture.accounts[1]) == 0