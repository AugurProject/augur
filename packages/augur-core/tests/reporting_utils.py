#!/usr/bin/env python

from random import randint
from eth_tester.exceptions import TransactionFailed
from pytest import raises
from utils import longToHexString, PrintGasUsed, TokenDelta, BuyWithCash, AssertLog

def proceedToDesignatedReporting(fixture, market):
    fixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)

def proceedToInitialReporting(fixture, market):
    fixture.contracts["Time"].setTimestamp(market.getDesignatedReportingEndTime() + 1)

def proceedToNextRound(fixture, market, contributor = None, doGenerateFees = False, moveTimeForward = True, randomPayoutNumerators = False, description = ""):
    contributor = contributor or fixture.accounts[0]
    if fixture.contracts["Augur"].getTimestamp() < market.getEndTime():
        fixture.contracts["Time"].setTimestamp(market.getDesignatedReportingEndTime() + 1)

    disputeWindow = market.getDisputeWindow()

    payoutNumerators = [0] * market.getNumberOfOutcomes()
    payoutNumerators[1] = market.getNumTicks()

    if (disputeWindow == longToHexString(0)):
        market.doInitialReport(payoutNumerators, "", 0)
        assert market.getDisputeWindow()
    else:
        disputeWindow = fixture.applySignature('DisputeWindow', market.getDisputeWindow())
        if market.getDisputePacingOn():
            fixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)
        # This will also use the InitialReporter which is not a DisputeCrowdsourcer, but has the called function from abstract inheritance
        winningReport = fixture.applySignature('DisputeCrowdsourcer', market.getWinningReportingParticipant())
        winningPayoutHash = winningReport.getPayoutDistributionHash()

        chosenPayoutNumerators = [0] * market.getNumberOfOutcomes()
        chosenPayoutNumerators[1] = market.getNumTicks()

        if (randomPayoutNumerators):
            chosenPayoutNumerators[1] = randint(0, market.getNumTicks())
            chosenPayoutNumerators[2] = market.getNumTicks() - chosenPayoutNumerators[1]
        else:
            firstReportWinning = market.derivePayoutDistributionHash(payoutNumerators) == winningPayoutHash
            if firstReportWinning:
                chosenPayoutNumerators[1] = 0
                chosenPayoutNumerators[2] = market.getNumTicks()

        chosenPayoutHash = market.derivePayoutDistributionHash(chosenPayoutNumerators)
        amount = 2 * market.getParticipantStake() - 3 * market.getStakeInOutcome(chosenPayoutHash)
        with PrintGasUsed(fixture, "Contribute:", 0):
            market.contribute(chosenPayoutNumerators, amount, description, sender=contributor)
        assert market.getForkingMarket() or market.getDisputeWindow() != disputeWindow

    if (doGenerateFees):
        universe = fixture.applySignature("Universe", market.getUniverse())
        generateFees(fixture, universe, market)

    if (moveTimeForward):
        disputeWindow = fixture.applySignature('DisputeWindow', market.getDisputeWindow())
        fixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

def proceedToFork(fixture, market, universe):
    while (market.getForkingMarket() == longToHexString(0)):
        proceedToNextRound(fixture, market)

    for i in range(market.getNumParticipants()):
        reportingParticipant = fixture.applySignature("DisputeCrowdsourcer", market.getReportingParticipant(i))
        reportingParticipant.forkAndRedeem()

def finalize(fixture, market, universe, finalizeByMigration = True):
    account0 = fixture.accounts[0]
    reputationToken = fixture.applySignature('ReputationToken', universe.getReputationToken())

    # The universe forks and there is now a universe where NO and YES are the respective outcomes of each
    noPayoutNumerators = [0] * market.getNumberOfOutcomes()
    noPayoutNumerators[1] = market.getNumTicks()
    yesPayoutNumerators = [0] * market.getNumberOfOutcomes()
    yesPayoutNumerators[2] = market.getNumTicks()
    noUniverse =  fixture.applySignature('Universe', universe.createChildUniverse(noPayoutNumerators))
    yesUniverse =  fixture.applySignature('Universe', universe.createChildUniverse(yesPayoutNumerators))
    noUniverseReputationToken = fixture.applySignature('ReputationToken', noUniverse.getReputationToken())
    yesUniverseReputationToken = fixture.applySignature('ReputationToken', yesUniverse.getReputationToken())
    assert noUniverse.address != universe.address
    assert yesUniverse.address != universe.address
    assert yesUniverse.address != noUniverse.address
    assert noUniverseReputationToken.address != yesUniverseReputationToken.address

    # Attempting to finalize the fork now will not succeed as no REP has been migrated and not enough time has passed
    with raises(TransactionFailed):
        market.finalize()

    # A Tester moves some of their REP to the YES universe
    amount = 10 ** 6 * 10 ** 18

    with raises(TransactionFailed):
        reputationToken.migrateOutByPayout(yesPayoutNumerators, 0)

    with TokenDelta(yesUniverseReputationToken, amount, account0, "Yes REP token balance was no correct"):
        reputationToken.migrateOutByPayout(yesPayoutNumerators, amount)

    # Attempting to finalize the fork now will not succeed as a majority or REP has not yet migrated and fork end time has not been reached
    with raises(TransactionFailed):
        market.finalize()

    if (finalizeByMigration):
        # Tester 0 moves more than 50% of REP
        amount = reputationToken.balanceOf(account0) - 20
        marketFinalizedLog = {
            "universe": universe.address,
            "market": market.address,
        }
        with AssertLog(fixture, "MarketFinalized", marketFinalizedLog):
            with TokenDelta(noUniverseReputationToken, amount, account0, "No REP token balance was no correct"):
                reputationToken.migrateOutByPayout(noPayoutNumerators, amount)
        assert reputationToken.balanceOf(account0) == 20
        assert market.getWinningPayoutDistributionHash() == noUniverse.getParentPayoutDistributionHash()
    else:
        # Time marches on past the fork end time
        fixture.contracts["Time"].setTimestamp(universe.getForkEndTime() + 1)
        marketFinalizedLog = {
            "universe": universe.address,
            "market": market.address,
        }
        with AssertLog(fixture, "MarketFinalized", marketFinalizedLog):
            assert market.finalize()
        assert market.getWinningPayoutDistributionHash() == yesUniverse.getParentPayoutDistributionHash()
        # If the fork is past the fork period we can not migrate
        with raises(TransactionFailed):
            reputationToken.migrateOutByPayout(noPayoutNumerators, 1)

    # Finalize fork cannot be called again
    with raises(TransactionFailed):
        market.finalize()

def generateFees(fixture, universe, market):
    account1 = fixture.accounts[1]
    shareToken = fixture.contracts['ShareToken']
    cash = fixture.contracts['Cash']
    daiVat = fixture.contracts['DaiVat']
    disputeWindow = universe.getOrCreateNextDisputeWindow(False)
    oldFeesBalance = cash.balanceOf(disputeWindow)

    cost = 1000 * market.getNumTicks()
    marketCreatorFees = cost / market.getMarketCreatorSettlementFeeDivisor()

    with BuyWithCash(cash, cost, account1, "buy complete set"):
        shareToken.publicBuyCompleteSets(market.address, 1000, sender=account1)
    initialMarketCreatorFees = market.marketCreatorFeesAttoCash()
    shareToken.publicSellCompleteSets(market.address, 1000, sender=account1)
    assert marketCreatorFees == market.marketCreatorFeesAttoCash() - initialMarketCreatorFees, "The market creator didn't get correct share of fees from complete set sale"
    newFeesBalance = cash.balanceOf(disputeWindow) + daiVat.dai(disputeWindow) / 10**27
    reporterFees = cost / universe.getOrCacheReportingFeeDivisor()
    feesGenerated = newFeesBalance - oldFeesBalance
    assert feesGenerated == reporterFees, "Cash balance of dispute window differs by: " + str(feesGenerated - reporterFees)
