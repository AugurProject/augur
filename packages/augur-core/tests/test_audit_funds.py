#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture, mark
from utils import fix, AssertLog, EtherDelta, TokenDelta, BuyWithCash, nullAddress, longTo32Bytes
from reporting_utils import proceedToDesignatedReporting, proceedToInitialReporting, proceedToNextRound, proceedToFork, finalize
from constants import YES, NO

def test_shares(kitchenSinkFixture, universe, cash, market, scalarMarket):
    shareToken = kitchenSinkFixture.contracts['ShareToken']
    auditFunds = kitchenSinkFixture.contracts['AuditFunds']

    account = kitchenSinkFixture.accounts[0]

    marketFactory = kitchenSinkFixture.contracts['MarketFactory']
    assert auditFunds.addressFrom(marketFactory.address, 1) == market.address

    # Get scalar LONG shares with a1
    acquireLongShares(kitchenSinkFixture, cash, scalarMarket, YES, 1, shareToken.address, sender = account)
    finalizeMarket(kitchenSinkFixture, scalarMarket, [0, 10**5, 3*10**5])

    # get YES shares with a1
    acquireLongShares(kitchenSinkFixture, cash, market, YES, 1, shareToken.address, sender = account)
    finalizeMarket(kitchenSinkFixture, market, [0, 0, 10**3])

    marketResult, done = auditFunds.getAvailableShareData(account, 0, 1)
    assert len(marketResult) == 1
    assert done == False
    assert marketResult[0][0] == market.address
    assert marketResult[0][1] == 1000

    scalarMarketResult, done = auditFunds.getAvailableShareData(account, 3, 1)
    assert len(scalarMarketResult) == 1
    assert done == False
    assert scalarMarketResult[0][0] == scalarMarket.address
    assert scalarMarketResult[0][1] == 300000

    results, done = auditFunds.getAvailableShareData(account, 0, 10)
    assert done
    assert results[0][0] == market.address
    assert results[0][1] == 1000
    assert results[3][0] == scalarMarket.address
    assert results[3][1] == 300000

def test_reports(kitchenSinkFixture, universe, cash, market):
    auditFunds = kitchenSinkFixture.contracts['AuditFunds']

    account = kitchenSinkFixture.accounts[0]

    proceedToInitialReporting(kitchenSinkFixture, market)

    repBond = market.repBond()

    # do an initial report
    assert market.doInitialReport([0, 0, market.getNumTicks()], "", 0)

    # the market is now assigned a dispute window
    newDisputeWindowAddress = market.getDisputeWindow()
    disputeWindow = kitchenSinkFixture.applySignature('DisputeWindow', newDisputeWindowAddress)

    # time marches on and the market can be finalized
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    reportResult, done = auditFunds.getAvailableReports(account, 0, 1)
    assert len(reportResult) == 1
    assert done == False
    assert reportResult[0] [0] == market.address
    assert reportResult[0][2] == repBond

    results, done = auditFunds.getAvailableReports(account, 0, 10)
    assert done
    assert results[0][0] == market.address
    assert results[0][2] == repBond

def test_disputes(kitchenSinkFixture, universe, cash, market, reputationToken):
    auditFunds = kitchenSinkFixture.contracts['AuditFunds']

    account = kitchenSinkFixture.accounts[0]

    kitchenSinkFixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)

    market.doInitialReport([0, market.getNumTicks(), 0], "", 0)

    disputeWindow = kitchenSinkFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    constants = kitchenSinkFixture.contracts["Constants"]

    # We'll make the window active
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # We'll have testers push markets into the next round by funding dispute crowdsourcers
    amount = 2 * market.getParticipantStake()
    assert market.contribute([0, 0, market.getNumTicks()], amount, "")

    newDisputeWindowAddress = market.getDisputeWindow()
    assert newDisputeWindowAddress != disputeWindow.address

    # fast forward time to the fee new window
    disputeWindow = kitchenSinkFixture.applySignature('DisputeWindow', newDisputeWindowAddress)
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # Fast forward time until the new dispute window is over and we can redeem our winning stake, and dispute bond tokens
    kitchenSinkFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()
    marketDisputeCrowdsourcer = kitchenSinkFixture.applySignature('DisputeCrowdsourcer', market.participants(1))
    amount = marketDisputeCrowdsourcer.getStake()

    reportResult, done = auditFunds.getAvailableDisputes(account, 0, 1)
    assert len(reportResult) == 1
    assert done == False
    assert reportResult[0] [0] == market.address
    assert reportResult[0][2] == amount

    results, done = auditFunds.getAvailableDisputes(account, 0, 10)
    assert done
    assert results[0][0] == market.address
    assert results[0][2] == amount

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