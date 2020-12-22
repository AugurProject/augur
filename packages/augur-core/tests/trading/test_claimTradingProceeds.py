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

def test_helpers(kitchenSinkFixture, scalarMarket):
    market = scalarMarket
    shareToken= kitchenSinkFixture.getShareToken()
    finalizeMarket(kitchenSinkFixture, market, [0,0,40*10**4])

    assert shareToken.calculateCreatorFee(market.address, fix('3')) == fix('0.03')
    if kitchenSinkFixture.paraAugur:
        paraAugur = kitchenSinkFixture.contracts["ParaAugur"]
        assert shareToken.calculateReportingFee(paraAugur.getParaUniverse(market.getUniverse()), fix('5')) == fix('0.0005')
    else:
        assert shareToken.calculateReportingFee(market.address, fix('5')) == fix('0.0005')
    assert shareToken.calculateProceeds(market.address, YES, 7) == 7 * market.getNumTicks()
    assert shareToken.calculateProceeds(market.address, NO, fix('11')) == fix('0')
    (proceeds, shareholderShare, creatorShare, reporterShare) = (0, 0, 0, 0)
    if kitchenSinkFixture.paraAugur:
        paraAugur = kitchenSinkFixture.contracts["ParaAugur"]
        (proceeds, shareholderShare, creatorShare, reporterShare) = shareToken.divideUpWinnings(market.address, paraAugur.getParaUniverse(market.getUniverse()), YES, 13)
    else:
        (proceeds, shareholderShare, creatorShare, reporterShare) = shareToken.divideUpWinnings(market.address, YES, 13)
    assert proceeds == 13.0 * market.getNumTicks()
    assert reporterShare == 13.0 * market.getNumTicks() * 0.0001
    assert creatorShare == 13.0 * market.getNumTicks() * 0.01
    assert shareholderShare == 13.0 * market.getNumTicks() * 0.9899

def test_redeem_shares_in_yesNo_market(kitchenSinkFixture, universe, cash, market):
    shareToken = kitchenSinkFixture.getShareToken()
    expectedValue = 100 * market.getNumTicks()
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees
    expectedPayout = expectedValue - expectedSettlementFees

    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 0

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 100, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 100 * market.getNumTicks()
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 100, shareToken.address, sender = kitchenSinkFixture.accounts[2])
    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 200 * market.getNumTicks()
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**3])

    tradingProceedsClaimedLog = {
        'market': market.address,
        'numPayoutTokens': expectedPayout,
        'numShares': 100,
        'sender': kitchenSinkFixture.accounts[1],
        'fees': 1010,
    }

    disputeWindow = universe.getOrCreateNextDisputeWindow(False)
    originalDisputeWindowBalance = cash.balanceOf(disputeWindow)
    originalShareTokenBalance = cash.balanceOf(shareToken.address)
    originalMarketCreatorBalance = cash.balanceOf(market.getOwner())

    # redeem shares with a1
    with AssertLog(kitchenSinkFixture, "TradingProceedsClaimed", tradingProceedsClaimedLog):
        shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], longTo32Bytes(11))
    # redeem shares with a2
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], longTo32Bytes(11))

    if kitchenSinkFixture.paraAugur:
        feePot = kitchenSinkFixture.getFeePot(universe)
        assert cash.balanceOf(feePot.address) == expectedReporterFees
    elif kitchenSinkFixture.sideChain:
        assert cash.balanceOf(shareToken.address) == originalShareTokenBalance - expectedPayout - expectedMarketCreatorFees
    else:
        newDisputeWindowBalance = cash.balanceOf(disputeWindow)
        assert newDisputeWindowBalance == expectedReporterFees + originalDisputeWindowBalance

    newMarketCreatorBalanceFromFees = cash.balanceOf(market.getOwner())
    assert newMarketCreatorBalanceFromFees == int(expectedMarketCreatorFees) + originalMarketCreatorBalance

    # assert a1 ends up with cash (minus fees) and a2 does not
    assert cash.balanceOf(kitchenSinkFixture.accounts[1]) == expectedPayout

    assert shareToken.balanceOfMarketOutcome(market.address, YES, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, kitchenSinkFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, kitchenSinkFixture.accounts[2]) == 0

def test_redeem_shares_in_categorical_market(kitchenSinkFixture, universe, cash, categoricalMarket):
    market = categoricalMarket
    shareToken = kitchenSinkFixture.getShareToken()

    numTicks = market.getNumTicks()
    expectedValue = numTicks
    expectedSettlementFees = expectedValue * 0.0101
    expectedPayout = expectedValue - expectedSettlementFees

    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 0

    # get long shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, 3, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 1 * numTicks
    # get short shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, 3, 1, shareToken.address, sender = kitchenSinkFixture.accounts[2])
    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 2 * numTicks

    if kitchenSinkFixture.sideChain:
        finalizeMarket(kitchenSinkFixture, market, [0, 0, 0, numTicks])
    else:
        prepare_finalize_market(kitchenSinkFixture, market, [0, 0, 0, numTicks])

    # redeem shares with a1
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], longTo32Bytes(11))
    assert market.isFinalized()
    # redeem shares with a2
    shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[2], longTo32Bytes(11))

    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 0
    # assert both accounts are paid (or not paid) accordingly
    assert abs(cash.balanceOf(kitchenSinkFixture.accounts[1]) - expectedPayout) < 1
    assert cash.balanceOf(kitchenSinkFixture.accounts[2]) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, 2, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 2, kitchenSinkFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, kitchenSinkFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 0, kitchenSinkFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 0, kitchenSinkFixture.accounts[2]) == 0

def test_redeem_shares_in_scalar_market(kitchenSinkFixture, universe, cash, scalarMarket):
    market = scalarMarket
    shareToken = kitchenSinkFixture.getShareToken()
    expectedValue = 1 * market.getNumTicks()
    expectedSettlementFees = expectedValue * 0.0101
    expectedPayout = expectedValue - expectedSettlementFees

    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 0

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 1 * market.getNumTicks()
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[2])
    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 2 * market.getNumTicks()
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
    if kitchenSinkFixture.sideChain:
        return
    
    shareToken = kitchenSinkFixture.getShareToken()

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
    market.doInitialReport([0, 0, 1000], "", 0)
    # set timestamp to after designated dispute end
    disputeWindow = kitchenSinkFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 365*60*60*24)

    # validate that everything else is OK
    assert shareToken.claimTradingProceeds(market.address, kitchenSinkFixture.accounts[1], longTo32Bytes(11))
    assert market.isFinalized()

def test_redeem_shares_in_multiple_markets(kitchenSinkFixture, universe, cash, market, scalarMarket):
    shareToken = kitchenSinkFixture.getShareToken()
    augurTrading = kitchenSinkFixture.contracts['SideChainAugurTrading'] if kitchenSinkFixture.sideChain else kitchenSinkFixture.contracts['AugurTrading']

    # Get scalar LONG shares with a1
    expectedValue = 1 * scalarMarket.getNumTicks() * 3 / 4
    expectedSettlementFees = expectedValue * 0.0101
    expectedPayout = expectedValue - expectedSettlementFees
    acquireLongShares(kitchenSinkFixture, cash, scalarMarket, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    finalizeMarket(kitchenSinkFixture, scalarMarket, [0, 10**5, 3*10**5])

    # get YES shares with a1
    expectedValue = 1 * market.getNumTicks()
    expectedSettlementFees = expectedValue * 0.0101
    expectedPayout += expectedValue - expectedSettlementFees
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**3])

    with TokenDelta(cash, expectedPayout, kitchenSinkFixture.accounts[1], "Claiming multiple markets did not give expected payout"):
        assert augurTrading.claimMarketsProceeds([market.address, scalarMarket.address], kitchenSinkFixture.accounts[1], longTo32Bytes(11))

def test_redeem_shares_affiliate(kitchenSinkFixture, universe, cash, market):
    affiliates = kitchenSinkFixture.contracts['SideChainAffiliates'] if kitchenSinkFixture.sideChain else kitchenSinkFixture.contracts['Affiliates']
    shareToken = kitchenSinkFixture.getShareToken()
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

    if not kitchenSinkFixture.sideChain: assert kitchenSinkFixture.getOpenInterestInAttoCash(universe) == 0
    affiliateAddress = kitchenSinkFixture.accounts[5]
    affiliates.setReferrer(affiliateAddress, longTo32Bytes(0), sender=kitchenSinkFixture.accounts[1])
    affiliates.setReferrer(affiliateAddress, longTo32Bytes(0), sender=kitchenSinkFixture.accounts[2])

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 100, shareToken.address, sender = kitchenSinkFixture.accounts[1])
    # get NO shares with a2
    acquireShortShareSet(kitchenSinkFixture, cash, market, YES, 100, shareToken.address, sender = kitchenSinkFixture.accounts[2])
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**3])

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