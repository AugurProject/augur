from datetime import timedelta
from eth_tester.exceptions import TransactionFailed
from pytest import fixture, mark, raises
from utils import longTo32Bytes, TokenDelta, AssertLog, EtherDelta, longToHexString, BuyWithCash, nullAddress
from reporting_utils import proceedToDesignatedReporting, proceedToInitialReporting, proceedToNextRound, proceedToFork, finalize
from decimal import Decimal
from constants import YES, NO

def test_designatedReportHappyPath(localFixture, universe, market):
    # proceed to the designated reporting period
    proceedToDesignatedReporting(localFixture, market)

    # an address that is not the designated reporter cannot report
    with raises(TransactionFailed):
        market.doInitialReport([0, 0, market.getNumTicks()], "", 0, sender=localFixture.accounts[1])

    # Reporting with an invalid number of outcomes should fail
    with raises(TransactionFailed):
        market.doInitialReport([0, 0, 0, 0, market.getNumTicks()], "", 0)

    # We cannot directly call clearCrowdsourcers setting back reporting
    with raises(AttributeError):
        market.clearCrowdsourcers()

    # do an initial report as the designated reporter
    disputeWindow = localFixture.applySignature("DisputeWindow", universe.getOrCreateNextDisputeWindow(True))
    initialReportLog = {
        "universe": universe.address,
        "reporter": localFixture.accounts[0],
        "market": market.address,
        "amountStaked": market.repBond(),
        "isDesignatedReporter": True,
        "payoutNumerators": [0, 0, market.getNumTicks()],
        "description": "Obviously I'm right",
        "nextWindowStartTime": disputeWindow.getStartTime(),
        "nextWindowEndTime": disputeWindow.getEndTime()
    }
    with AssertLog(localFixture, "InitialReportSubmitted", initialReportLog):
        assert market.doInitialReport([0, 0, market.getNumTicks()], "Obviously I'm right", 0)

    with raises(TransactionFailed):
        assert market.doInitialReport([0, 0, market.getNumTicks()], "Obviously I'm right", 0)

    # the market is now assigned a dispute window
    newDisputeWindowAddress = market.getDisputeWindow()
    assert newDisputeWindowAddress
    disputeWindow = localFixture.applySignature('DisputeWindow', newDisputeWindowAddress)
    assert disputeWindow.getEndTime() < market.getEndTime() + (24 * 60 * 60 * 2) # Confirm the dispute window time is within 2 days of the market end (1 day DR window + 1 day initial dispute window)

    # time marches on and the market can be finalized
    timestamp = disputeWindow.getEndTime() + 1
    localFixture.contracts["Time"].setTimestamp(timestamp)
    marketFinalizedLog = {
        "universe": universe.address,
        "market": market.address,
        "timestamp": timestamp,
        "winningPayoutNumerators": [0, 0, market.getNumTicks()]
    }

    with AssertLog(localFixture, "MarketFinalized", marketFinalizedLog):
        assert market.finalize()

    with raises(TransactionFailed):
        market.finalize()

@mark.parametrize('reportByDesignatedReporter', [
    True,
    False
])
def test_initialReportHappyPath(reportByDesignatedReporter, localFixture, universe, market):
    # proceed to the initial reporting period
    proceedToInitialReporting(localFixture, market)

    # do an initial report as someone other than the designated reporter
    sender = localFixture.accounts[0] if reportByDesignatedReporter else localFixture.accounts[1]
    assert market.doInitialReport([0, 0, market.getNumTicks()], "", 0, sender=sender)

    # the market is now assigned a dispute window
    newDisputeWindowAddress = market.getDisputeWindow()
    assert newDisputeWindowAddress
    disputeWindow = localFixture.applySignature('DisputeWindow', newDisputeWindowAddress)

    # Confirm that with the designated report we initially have a different time period than normal to dispute
    assert disputeWindow.duration() == localFixture.contracts["Constants"].INITIAL_DISPUTE_ROUND_DURATION_SECONDS()

    # time marches on and the market can be finalized
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

def test_initialReport_methods(localFixture, universe, market, constants):
    reputationToken = localFixture.applySignature("ReputationToken", universe.getReputationToken())

    # proceed to the initial reporting period
    proceedToInitialReporting(localFixture, market)

    # do an initial report as someone other than the designated reporter
    assert market.doInitialReport([0, 0, market.getNumTicks()], "", 0, sender=localFixture.accounts[1])

    # the market is now assigned a dispute window
    newDisputeWindowAddress = market.getDisputeWindow()
    assert newDisputeWindowAddress
    disputeWindow = localFixture.applySignature('DisputeWindow', newDisputeWindowAddress)

    # time marches on and the market can be finalized
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # We can see that the market reports the designated reporter did not show
    initialReporter = localFixture.applySignature('InitialReporter', market.participants(0))
    assert not initialReporter.designatedReporterShowed()

    # Let's get a reference to the Initial Reporter bond and transfer it to the original designated reporter account
    initialReporter = localFixture.applySignature("InitialReporter", market.getInitialReporter())
    transferLog = {
        "universe": universe.address,
        "market": market.address,
        "from": localFixture.accounts[1],
        "to": initialReporter.getDesignatedReporter(),
    }
    with AssertLog(localFixture, "InitialReporterTransferred", transferLog):
        assert initialReporter.transferOwnership(initialReporter.getDesignatedReporter(), sender=localFixture.accounts[1])

    # Transfering to the owner is a noop
    assert initialReporter.transferOwnership(initialReporter.getDesignatedReporter())

    # The market still correctly indicates the designated reporter did not show up
    initialReporter = localFixture.applySignature('InitialReporter', market.participants(0))
    assert not initialReporter.designatedReporterShowed()

    # confirm we cannot call protected methods on the initial reporter which only the market may use
    with raises(TransactionFailed):
        initialReporter.report(localFixture.accounts[0], "", [], 1)

    with raises(TransactionFailed):
        initialReporter.returnRepFromDisavow()

    with raises(TransactionFailed):
        initialReporter.migrateToNewUniverse(localFixture.accounts[0])

    # When we redeem the initialReporter it goes to the correct party as well
    expectedRep = initialReporter.getStake()
    owner = initialReporter.getOwner()

    with TokenDelta(reputationToken, expectedRep, owner, "Redeeming didn't refund REP"):
        assert initialReporter.redeem(owner)

@mark.parametrize('rounds', [
    2,
    3,
    6,
    16
])
def test_roundsOfReporting(rounds, localFixture, market, universe):
    disputeWindow = universe.getOrCreateCurrentDisputeWindow(False)

    marketRepBond = market.repBond()

    # Do the initial report
    proceedToNextRound(localFixture, market, moveTimeForward = False)

    initialDisputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    assert initialDisputeWindow.duration() == localFixture.contracts["Constants"].INITIAL_DISPUTE_ROUND_DURATION_SECONDS()

    # Do the first round outside of the loop and test logging
    crowdsourcerCreatedLog = {
        "universe": universe.address,
        "market": market.address,
        "size": marketRepBond * 2,
        "payoutNumerators": [0, 0, market.getNumTicks()],
    }

    crowdsourcerContributionLog = {
        "universe": universe.address,
        "reporter": localFixture.accounts[0],
        "market": market.address,
        "amountStaked": marketRepBond * 2,
        "description": "Clearly incorrect",
        "payoutNumerators": [0, 0, market.getNumTicks()],
        "currentStake": marketRepBond * 2,
        "stakeRemaining": 0,
    }

    disputeWindow = localFixture.applySignature("DisputeWindow", universe.getOrCreateNextDisputeWindow(False))
    crowdsourcerCompletedLog = {
        "universe": universe.address,
        "market": market.address,
        "nextWindowStartTime": disputeWindow.getStartTime(),
        "nextWindowEndTime": disputeWindow.getEndTime(),
        "totalRepStakedInMarket": marketRepBond * 3,
        "disputeRound": 2,
        "payoutNumerators": [0, 0, market.getNumTicks()],
        "totalRepStakedInPayout": marketRepBond * 2,
    }

    with AssertLog(localFixture, "DisputeCrowdsourcerCreated", crowdsourcerCreatedLog):
        with AssertLog(localFixture, "DisputeCrowdsourcerContribution", crowdsourcerContributionLog):
            with AssertLog(localFixture, "DisputeCrowdsourcerCompleted", crowdsourcerCompletedLog):
                market.contribute([0, 0, market.getNumTicks()], universe.getInitialReportMinValue() * 2, "Clearly incorrect", sender=localFixture.accounts[0])

    newDisputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    assert newDisputeWindow.duration() == localFixture.contracts["Constants"].DISPUTE_ROUND_DURATION_SECONDS()

    # proceed through several rounds of disputing
    for i in range(rounds - 2):
        proceedToNextRound(localFixture, market)
        assert disputeWindow != market.getDisputeWindow()
        disputeWindow = market.getDisputeWindow()
        assert disputeWindow == universe.getOrCreateCurrentDisputeWindow(False)

@mark.parametrize('finalizeByMigration, manuallyDisavow', [
    (True, True),
    (False, True),
    (True, False),
    (False, False),
])
def test_forking(finalizeByMigration, manuallyDisavow, localFixture, universe, market, cash, categoricalMarket, scalarMarket):
    shareToken = localFixture.getShareToken()

    time = localFixture.contracts["Time"].getTimestamp()
    farOutEndTime = time + (365 * 24 * 60 * 60)
    farOutMarket = localFixture.createYesNoMarket(universe, farOutEndTime, 0, 0, localFixture.accounts[0])

    # Let's go into the one dispute round for the categorical market
    proceedToNextRound(localFixture, categoricalMarket)
    proceedToNextRound(localFixture, categoricalMarket)

    # proceed to forking
    proceedToFork(localFixture, market, universe)

    with raises(TransactionFailed):
        universe.fork()

    with raises(TransactionFailed):
        categoricalMarket.migrateThroughOneFork([0,0,0,categoricalMarket.getNumTicks()], "")

    with raises(TransactionFailed):
        time = localFixture.contracts["Time"].getTimestamp()
        localFixture.createYesNoMarket(universe, time + 1000, 1, 0, localFixture.accounts[0])

    # confirm that we can manually create a child universe from an outcome no one asserted was true during dispute
    numTicks = market.getNumTicks()
    childUniverse = universe.createChildUniverse([0, numTicks/ 4, numTicks * 3 / 4])

    # confirm that before the fork is finalized we can redeem stake in other markets crowdsourcers, which are disavowable
    categoricalDisputeCrowdsourcer = localFixture.applySignature("DisputeCrowdsourcer", categoricalMarket.participants(1))

    # confirm we cannot liquidate it
    with raises(TransactionFailed):
        categoricalDisputeCrowdsourcer.liquidateLosing()

    # confirm we cannot fork it
    with raises(TransactionFailed):
        categoricalDisputeCrowdsourcer.forkAndRedeem()

    if manuallyDisavow:
        marketParticipantsDisavowedLog = {
            "universe": universe.address,
            "market": categoricalMarket.address,
        }
        with AssertLog(localFixture, "MarketParticipantsDisavowed", marketParticipantsDisavowedLog):
            assert categoricalMarket.disavowCrowdsourcers()
        # We can redeem before the fork finalizes since disavowal has occured
        assert categoricalDisputeCrowdsourcer.redeem(localFixture.accounts[0])

    # We cannot contribute to a crowdsourcer during a fork
    with raises(TransactionFailed):
        categoricalMarket.contribute([0,2,2,categoricalMarket.getNumTicks()-4], 1, "")

    # We cannot purchase new Participation Tokens during a fork
    disputeWindowAddress = universe.getOrCreateCurrentDisputeWindow(False)
    disputeWindow = localFixture.applySignature("DisputeWindow", disputeWindowAddress)

    # finalize the fork
    finalize(localFixture, market, universe, finalizeByMigration)

    # We cannot contribute to a crowdsourcer in a forked universe
    with raises(TransactionFailed):
        categoricalMarket.contribute([0,2,2,categoricalMarket.getNumTicks()-4], 1, "")

    newUniverseAddress = universe.getWinningChildUniverse()
    newUniverse = localFixture.applySignature("Universe", newUniverseAddress)

    # Let's make sure fork payouts work correctly for the forking market
    numSets = 10
    cost = market.getNumTicks() * numSets
    with BuyWithCash(cash, cost, localFixture.accounts[0], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, numSets)

    shareToken.safeTransferFrom(localFixture.accounts[0], localFixture.accounts[1], shareToken.getTokenId(market.address, NO), shareToken.balanceOfMarketOutcome(market.address, NO, localFixture.accounts[0]), "")

    expectedYesOutcomePayout = newUniverse.payoutNumerators(YES)
    expectedNoOutcomePayout = newUniverse.payoutNumerators(NO)

    expectedYesPayout = expectedYesOutcomePayout * shareToken.balanceOfMarketOutcome(market.address, YES, localFixture.accounts[0]) * .9999 # to account for fees (creator fee goes to the claimer in this case)
    with TokenDelta(cash, expectedYesPayout, localFixture.accounts[0], "Payout for Yes Shares was wrong in forking market"):
        shareToken.claimTradingProceeds(market.address, localFixture.accounts[0], longTo32Bytes(11))

    expectedNoPayout = expectedNoOutcomePayout * shareToken.balanceOfMarketOutcome(market.address, NO, localFixture.accounts[1]) * .9899 # to account for fees
    with TokenDelta(cash, expectedNoPayout, localFixture.accounts[1], "Payout for No Shares was wrong in forking market"):
        shareToken.claimTradingProceeds(market.address, localFixture.accounts[1], longTo32Bytes(11))

    # Migrate a market that has not ended yet
    assert farOutMarket.migrateThroughOneFork([], "")

    # buy some complete sets to change OI of the cat market
    numSets = 10
    cost = categoricalMarket.getNumTicks() * numSets
    with BuyWithCash(cash, cost, localFixture.accounts[0], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(categoricalMarket.address, numSets)
    assert localFixture.getOpenInterestInAttoCash(universe) == cost

    marketMigratedLog = {
        "market": categoricalMarket.address,
        "newUniverse": newUniverseAddress,
        "originalUniverse": universe.address,
    }
    with AssertLog(localFixture, "MarketMigrated", marketMigratedLog):
        assert categoricalMarket.migrateThroughOneFork([0,0,0,categoricalMarket.getNumTicks()], "")

    #For the augur ETH variant we'll need to generate the new universe to see this have an affect on the OI. The parent universe will still have the OI because its the same universe as the winner
    if localFixture.paraAugur:
        assert localFixture.getOpenInterestInAttoCash(universe) == cost
        localFixture.contracts["ParaAugur"].generateParaUniverse(newUniverseAddress)
        assert localFixture.getOpenInterestInAttoCash(newUniverse) == cost
    else:
        assert localFixture.getOpenInterestInAttoCash(universe) == 0

    # The dispute crowdsourcer has been disavowed
    newUniverse = localFixture.applySignature("Universe", categoricalMarket.getUniverse())
    assert newUniverse.address != universe.address
    assert categoricalDisputeCrowdsourcer.isDisavowed()
    assert not universe.isContainerForReportingParticipant(categoricalDisputeCrowdsourcer.address)
    assert not newUniverse.isContainerForReportingParticipant(categoricalDisputeCrowdsourcer.address)
    assert localFixture.getOpenInterestInAttoCash(newUniverse) == cost

    # The initial report is still present however
    categoricalInitialReport = localFixture.applySignature("InitialReporter", categoricalMarket.participants(0))
    assert categoricalMarket.participants(0) == categoricalInitialReport.address
    assert not categoricalInitialReport.isDisavowed()
    assert not universe.isContainerForReportingParticipant(categoricalInitialReport.address)
    assert newUniverse.isContainerForReportingParticipant(categoricalInitialReport.address)

    # The categorical market has a new dispute window since it was initially reported on and may be disputed now
    categoricalMarketDisputeWindowAddress = categoricalMarket.getDisputeWindow()
    categoricalMarketDisputeWindow = localFixture.applySignature("DisputeWindow", categoricalMarketDisputeWindowAddress)

    proceedToNextRound(localFixture, categoricalMarket)

    # We will finalize the categorical market in the new universe
    disputeWindow = localFixture.applySignature('DisputeWindow', categoricalMarket.getDisputeWindow())
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    assert categoricalMarket.finalize()

    # We can migrate a market that has not had its initial reporting completed as well, and confirm that the report is now made in the new universe
    reputationToken = localFixture.applySignature("ReputationToken", universe.getReputationToken())
    previousREPBalance = reputationToken.balanceOf(scalarMarket.address)
    assert previousREPBalance > 0
    newReputationToken = localFixture.applySignature("ReputationToken", newUniverse.getReputationToken())
    with TokenDelta(reputationToken, previousREPBalance, scalarMarket.repBondOwner(), "Market did not transfer rep balance to rep bond owner"):
        with TokenDelta(newReputationToken, -newUniverse.getOrCacheMarketRepBond(), localFixture.accounts[0], "Migrator did not pay new REP bond"):
            assert scalarMarket.migrateThroughOneFork([0,0,scalarMarket.getNumTicks()], "")
    newUniverseREP = localFixture.applySignature("ReputationToken", newUniverse.getReputationToken())
    initialReporter = localFixture.applySignature('InitialReporter', scalarMarket.getInitialReporter())
    assert newUniverseREP.balanceOf(initialReporter.address) == newUniverse.getOrCacheDesignatedReportNoShowBond()

    # We cannot migrate legacy REP to the new Universe REP
    legacyRepToken = localFixture.applySignature('LegacyReputationToken', newUniverseREP.getLegacyRepToken())
    assert legacyRepToken.faucet(500)
    totalSupply = legacyRepToken.balanceOf(localFixture.accounts[0])
    legacyRepToken.approve(newUniverseREP.address, totalSupply)
    with raises(TransactionFailed):
        newUniverseREP.migrateFromLegacyReputationToken()

    # We can finalize this market as well
    proceedToNextRound(localFixture, scalarMarket)
    disputeWindow = localFixture.applySignature('DisputeWindow', scalarMarket.getDisputeWindow())
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    assert scalarMarket.finalize()

def test_finalized_fork_migration(localFixture, universe, market, categoricalMarket):
    # Make the categorical market finalized
    proceedToNextRound(localFixture, categoricalMarket)
    disputeWindow = localFixture.applySignature('DisputeWindow', categoricalMarket.getDisputeWindow())

    # Time marches on and the market can be finalized
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert categoricalMarket.finalize()

    # Proceed to Forking for the yesNo market and finalize it
    proceedToFork(localFixture, market, universe)
    finalize(localFixture, market, universe)

    # The categorical market is finalized and cannot be migrated to the new universe
    with raises(TransactionFailed):
        categoricalMarket.migrateThroughOneFork([0,0,0,categoricalMarket.getNumTicks()], "")

    # We also can't disavow the crowdsourcers for this market
    with raises(TransactionFailed):
        categoricalMarket.disavowCrowdsourcers()

    # The forking market may not migrate or disavow crowdsourcers either
    with raises(TransactionFailed):
        market.migrateThroughOneFork([0,0,market.getNumTicks()], "")

    with raises(TransactionFailed):
        market.disavowCrowdsourcers()

def test_fork_migration_no_report(localFixture, universe, market):
    # Proceed to Forking for the yesNo market but don't go all the way so that we can create the new market still
    for i in range(10):
        proceedToNextRound(localFixture, market)

    # Create a market before the fork occurs which has an end date past the forking window
    endTime = localFixture.contracts["Time"].getTimestamp() + timedelta(days=90).total_seconds()
    longMarket = localFixture.createYesNoMarket(universe, endTime, 1, 0, localFixture.accounts[0])

    # Go to the forking period
    proceedToFork(localFixture, market, universe)

    # Now finalize the fork so migration can occur
    finalize(localFixture, market, universe)

    # Now when we migrate the market through the fork we'll place a new bond in the winning universe's REP
    oldReputationToken = localFixture.applySignature("ReputationToken", universe.getReputationToken())
    oldBalance = oldReputationToken.balanceOf(longMarket.address)
    newUniverse = localFixture.applySignature("Universe", universe.getChildUniverse(market.getWinningPayoutDistributionHash()))
    newNoShowBond = newUniverse.getOrCacheMarketRepBond()
    newReputationToken = localFixture.applySignature("ReputationToken", newUniverse.getReputationToken())
    with TokenDelta(oldReputationToken, -oldBalance, longMarket.address, "Migrating didn't disavow old no show bond"):
        with TokenDelta(newReputationToken, newNoShowBond, longMarket.address, "Migrating didn't place new no show bond"):
            assert longMarket.migrateThroughOneFork([], "")

def test_forking_values(localFixture, universe, market):
    reputationToken = localFixture.applySignature("ReputationToken", universe.getReputationToken())

    # Give some REP to another account
    reputationToken.transfer(localFixture.accounts[1], 100)

    # proceed to forking
    proceedToFork(localFixture, market, universe)

    # finalize the fork
    finalize(localFixture, market, universe)

    # We can see that the theoretical total REP supply in the winning child universe is a lower total to account for sibling migrations
    winningPayoutHash = market.getWinningPayoutDistributionHash()
    childUniverse = localFixture.applySignature("Universe", universe.getChildUniverse(winningPayoutHash))
    childUniverseReputationToken = localFixture.applySignature("ReputationToken", childUniverse.getReputationToken())
    childUniverseTheoreticalSupply = childUniverseReputationToken.getTotalTheoreticalSupply()
    assert childUniverseReputationToken.getTotalTheoreticalSupply() <= childUniverseTheoreticalSupply

    # If we migrate some REP to another Universe we can see that amount deducted from the theoretical supply
    losingPayoutNumerators = [0, 0, market.getNumTicks()]
    losingUniverse =  localFixture.applySignature('Universe', universe.createChildUniverse(losingPayoutNumerators))
    losingUniverseReputationToken = localFixture.applySignature('ReputationToken', losingUniverse.getReputationToken())
    assert reputationToken.migrateOutByPayout(losingPayoutNumerators, 100, sender=localFixture.accounts[1])
    lowerChildUniverseTheoreticalSupply = childUniverseReputationToken.getTotalTheoreticalSupply()
    assert lowerChildUniverseTheoreticalSupply == childUniverseTheoreticalSupply - 100

    # If we move past the forking window end time however we will see that some REP was trapped in the parent and deducted from the supply
    localFixture.contracts["Time"].setTimestamp(universe.getForkEndTime() + 1)
    childUniverseTheoreticalSupply = childUniverseReputationToken.getTotalTheoreticalSupply()
    assert childUniverseTheoreticalSupply < lowerChildUniverseTheoreticalSupply

    # In a forked universe the total supply will be different so its childrens goals will not be the same initially
    childUniverse.updateForkValues()
    assert childUniverse.getForkReputationGoal() == int(Decimal(childUniverseTheoreticalSupply) / 2)
    assert childUniverse.getDisputeThresholdForFork() == int(Decimal(childUniverseTheoreticalSupply) / 40)
    assert childUniverse.getInitialReportMinValue() == int(Decimal(childUniverse.getDisputeThresholdForFork()) / 3 / 2**18 + 1)

    # Now we'll fork again and confirm it still takes only 20 dispute rounds in the worst case
    newMarket = localFixture.createReasonableYesNoMarket(childUniverse)
    proceedToFork(localFixture, newMarket, childUniverse)
    assert newMarket.getNumParticipants() == 21

    # finalize the fork
    finalize(localFixture, newMarket, childUniverse)

    # The total theoretical supply is the total supply of the token plus that of the parent
    childWinningPayoutHash = newMarket.getWinningPayoutDistributionHash()
    leafUniverse = localFixture.applySignature("Universe", childUniverse.getChildUniverse(childWinningPayoutHash))
    leafUniverseReputationToken = localFixture.applySignature("ReputationToken", leafUniverse.getReputationToken())
    leafUniverseTheoreticalSupply = leafUniverseReputationToken.getTotalTheoreticalSupply()
    assert leafUniverseTheoreticalSupply == leafUniverseReputationToken.totalSupply() + childUniverseReputationToken.totalSupply()

    # After the fork window ends however we can again recalculate
    localFixture.contracts["Time"].setTimestamp(childUniverse.getForkEndTime() + 1)
    leafUniverseTheoreticalSupply = leafUniverseReputationToken.getTotalTheoreticalSupply()
    assert leafUniverseTheoreticalSupply == leafUniverseReputationToken.totalSupply()


def test_fee_window_record_keeping(localFixture, universe, market, categoricalMarket, scalarMarket):
    disputeWindow = localFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))

    noShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    initialReportBond = universe.getOrCacheDesignatedReportStake()
    validityBond = universe.getOrCacheValidityBond()

    # First we'll confirm we get the expected default values for the window record keeping
    assert disputeWindow.invalidMarketsTotal() == 0
    assert disputeWindow.validityBondTotal() == 0
    assert disputeWindow.incorrectDesignatedReportTotal() == 0
    assert disputeWindow.initialReportBondTotal() == 0
    assert disputeWindow.designatedReportNoShowsTotal() == 0
    assert disputeWindow.designatedReporterNoShowBondTotal() == 0

    # Go to designated reporting
    proceedToDesignatedReporting(localFixture, market)

    # Do a report that we'll make incorrect
    assert market.doInitialReport([0, 0, market.getNumTicks()], "", 0)

    # Do a report for a market we'll say is invalid
    assert categoricalMarket.doInitialReport([0, 0, 0, categoricalMarket.getNumTicks()], "", 0)

    # Designated reporter doesn't show up for the third market. Go into initial reporting and do a report by someone else
    reputationToken = localFixture.applySignature('ReputationToken', universe.getReputationToken())
    reputationToken.transfer(localFixture.accounts[1], 10**6 * 10**18)
    proceedToInitialReporting(localFixture, scalarMarket)
    assert scalarMarket.doInitialReport([0, 0, scalarMarket.getNumTicks()], "", 0, sender=localFixture.accounts[1])

    # proceed to the window start time
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # dispute the first market
    chosenPayoutNumerators = [0, market.getNumTicks(), 0]
    chosenPayoutHash = market.derivePayoutDistributionHash(chosenPayoutNumerators)
    amount = 2 * market.getParticipantStake() - 3 * market.getStakeInOutcome(chosenPayoutHash)
    assert market.contribute(chosenPayoutNumerators, amount, "")
    newDisputeWindowAddress = market.getDisputeWindow()
    assert newDisputeWindowAddress != disputeWindow

    # dispute the second market with an invalid outcome
    chosenPayoutNumerators = [categoricalMarket.getNumTicks(), 0, 0, 0]
    chosenPayoutHash = categoricalMarket.derivePayoutDistributionHash(chosenPayoutNumerators)
    amount = 2 * categoricalMarket.getParticipantStake() - 3 * categoricalMarket.getStakeInOutcome(chosenPayoutHash)
    assert categoricalMarket.contribute(chosenPayoutNumerators, amount, "")
    assert categoricalMarket.getDisputeWindow() != disputeWindow

    # progress time forward
    disputeWindow = localFixture.applySignature('DisputeWindow', newDisputeWindowAddress)
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    # finalize the markets
    assert market.finalize()
    assert categoricalMarket.finalize()
    assert scalarMarket.finalize()

    # Now we'll confirm the record keeping was updated
    # Dispute Window cadence is different in the subFork Univese tests so we account for that
    assert disputeWindow.invalidMarketsTotal() == validityBond
    assert disputeWindow.validityBondTotal() == 3 * validityBond

    assert disputeWindow.incorrectDesignatedReportTotal() == 2 * initialReportBond
    assert disputeWindow.initialReportBondTotal() == 3 * initialReportBond

    disputeWindow = localFixture.applySignature('DisputeWindow', scalarMarket.getDisputeWindow())
    assert disputeWindow.designatedReportNoShowsTotal() == noShowBond
    assert disputeWindow.designatedReporterNoShowBondTotal() == 3 * noShowBond

def test_rep_migration_convenience_function(localFixture, universe, market):
    proceedToFork(localFixture, market, universe)

    payoutNumerators = [0, 1, market.getNumTicks()-1]
    payoutDistributionHash = market.derivePayoutDistributionHash(payoutNumerators)

    # Initially child universes don't exist
    assert universe.getChildUniverse(payoutDistributionHash) == longToHexString(0)

    # We'll use the convenience function for migrating REP instead of manually creating a child universe
    reputationToken = localFixture.applySignature("ReputationToken", universe.getReputationToken())

    with raises(TransactionFailed):
        reputationToken.migrateOutByPayout(payoutNumerators, 0)

    assert reputationToken.migrateOutByPayout(payoutNumerators, 10)

    # We can see that the child universe was created
    newUniverse = localFixture.applySignature("Universe", universe.getChildUniverse(payoutDistributionHash))
    newReputationToken = localFixture.applySignature("ReputationToken", newUniverse.getReputationToken())
    assert newReputationToken.balanceOf(localFixture.accounts[0]) == 10

def test_dispute_pacing_threshold(localFixture, universe, market):
    # We'll dispute until we reach the dispute pacing threshold
    while not market.getDisputePacingOn():
        proceedToNextRound(localFixture, market, moveTimeForward = False)

    # Now if we try to immediately dispute without the newly assigned dispute window being active the tx will fail
    with raises(TransactionFailed):
        market.contribute([0, market.getNumTicks(), 0], 1, "")

    # If we move time forward to the dispute window start we succeed
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    assert localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)
    assert market.contribute([0, market.getNumTicks(), 0], 1, "")

def test_crowdsourcer_minimum_remaining(localFixture, universe, market):
    proceedToNextRound(localFixture, market, moveTimeForward = False)

    payoutNumerators = [0, 0, market.getNumTicks()]
    initialReporter = localFixture.applySignature('InitialReporter', market.getInitialReporter())
    initialReportSize = initialReporter.getSize()
    totalBondSize = initialReportSize * 2

    # We cannot leave only 1 attoREP remaining to fill
    with raises(TransactionFailed):
        market.contribute(payoutNumerators, totalBondSize - 1, "")

    # We cannot leave anything less than the initial report size left to fill in fact
    with raises(TransactionFailed):
        market.contribute(payoutNumerators, totalBondSize - initialReportSize + 1, "")

    # Lets fill up to the initial report size
    mintLog = {
        "target": localFixture.accounts[0],
        "market": market.address,
        "amount": totalBondSize - initialReportSize,
        "totalSupply": totalBondSize - initialReportSize
    }
    with AssertLog(localFixture, "TokensMinted", mintLog):
        assert market.contribute(payoutNumerators, totalBondSize - initialReportSize, "")

    # Now we'll completely fill the bond
    assert market.contribute(payoutNumerators, initialReportSize, "")

@fixture(scope="session")
def localSnapshot(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    return fixture.createSnapshot()

@fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@fixture
def constants(localFixture, kitchenSinkSnapshot):
    return localFixture.contracts['Constants']
