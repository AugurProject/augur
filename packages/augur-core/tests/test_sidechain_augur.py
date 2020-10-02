#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture, mark
from utils import fix, AssertLog, EtherDelta, TokenDelta, BuyWithCash, nullAddress, longTo32Bytes
from constants import YES, NO


def acquireLongShares(kitchenSinkFixture, cash, market, outcome, amount, approvalAddress, sender):
    if amount == 0: return
    shareToken = kitchenSinkFixture.getShareToken()

    cost = amount * market.getNumTicks()
    with BuyWithCash(cash, cost, sender, "complete set buy"):
        assert shareToken.publicBuyCompleteSets(market.address, amount, sender = sender)
    for otherOutcome in range(0, market.getNumberOfOutcomes()):
        if otherOutcome == outcome: continue
        shareToken.safeTransferFrom(sender, kitchenSinkFixture.accounts[8], shareToken.getTokenId(market.address, otherOutcome), amount, "", sender = sender)

def acquireShortShareSet(kitchenSinkFixture, cash, market, outcome, amount, approvalAddress, sender):
    if amount == 0: return
    cost = amount * market.getNumTicks()
    shareToken = kitchenSinkFixture.getShareToken()

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

# Test rep fee collection and periodic push

def test_rep_fees(kitchenSinkFixture, universe, cash, market):
    shareToken = kitchenSinkFixture.getShareToken()
    expectedValue = 100 * market.getNumTicks()
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees
    expectedPayout = expectedValue - expectedSettlementFees

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 100, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 100, shareToken.address, sender = kitchenSinkFixture.accounts[2])
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**3])

    originalShareTokenBalance = cash.balanceOf(shareToken.address)

    # redeem shares with a1
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], longTo32Bytes(11))
    # redeem shares with a2
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], longTo32Bytes(11))

    assert cash.balanceOf(shareToken.address) == originalShareTokenBalance - expectedPayout - expectedMarketCreatorFees
    assert shareToken.repFees() == expectedReporterFees

    with TokenDelta(cash, expectedReporterFees, shareToken.repFeeTarget(), "Reporting fees not pushed to configured target"):
        shareToken.pushRepFees()
