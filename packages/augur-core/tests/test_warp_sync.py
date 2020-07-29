#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture as pytest_fixture
from utils import nullAddress, TokenDelta, PrintGasUsed, AssertLog
from reporting_utils import proceedToDesignatedReporting, proceedToInitialReporting, proceedToFork, finalize


def test_warp_sync(contractsFixture, augur, universe, reputationToken, warpSync, cash):
    account = contractsFixture.accounts[0]
    time = contractsFixture.contracts["Time"]

    # See that warp sync market does not exist initially
    assert warpSync.markets(universe.address) == nullAddress

    # We can initialize the warp sync market for a universe and be rewarded with REP based on how long since the universe was created
    expectedCreationReward = warpSync.getCreationReward(universe.address)
    with PrintGasUsed(contractsFixture, "WS Market Finalization Cost", 0):
        with TokenDelta(reputationToken, expectedCreationReward, account, "REP reward not minted for initializing universe"):
            warpSync.initializeUniverse(universe.address)

    # The market now exists
    market = contractsFixture.applySignature("Market", warpSync.markets(universe.address))

    # Initially there is no warp sync data for this universe
    assert warpSync.data(universe.address) == [0, 0]

    # Finalize the warp sync market with some value
    proceedToDesignatedReporting(contractsFixture, market)
    numTicks = market.getNumTicks()
    assert warpSync.doInitialReport(universe.address, [0,0,numTicks], "")
    disputeWindow = contractsFixture.applySignature("DisputeWindow", market.getDisputeWindow())

    time.setTimestamp(disputeWindow.getEndTime())

    # Finalizing the warp sync market will award the finalizer REP based on time since it became finalizable
    expectedFinalizationReward = warpSync.getFinalizationReward(market.address)
    WarpSyncDataUpdatedLog = {
        "universe": universe.address,
        "warpSyncHash": numTicks,
        "marketEndTime": market.getEndTime()
    }
    with AssertLog(contractsFixture, "WarpSyncDataUpdated", WarpSyncDataUpdatedLog):
        with PrintGasUsed(contractsFixture, "WS Market Finalization Cost", 0):
            with TokenDelta(reputationToken, expectedFinalizationReward, account, "REP reward not minted for finalizer"):
                assert market.finalize()

    # Check Warp Sync contract for universe and see existing value
    assert warpSync.data(universe.address) == [numTicks, market.getEndTime()]

    # See new warp sync market
    newWarpSyncMarket = contractsFixture.applySignature("Market", warpSync.markets(universe.address))
    assert newWarpSyncMarket.address != market.address

    # Finalize it
    proceedToInitialReporting(contractsFixture, newWarpSyncMarket)
    numTicks = newWarpSyncMarket.getNumTicks()
    assert newWarpSyncMarket.doInitialReport([0,1,numTicks-1], "", 0)
    disputeWindow = contractsFixture.applySignature("DisputeWindow", newWarpSyncMarket.getDisputeWindow())

    time.setTimestamp(disputeWindow.getEndTime())
    assert newWarpSyncMarket.finalize()

    # See new warp sync value
    assert warpSync.data(universe.address) == [numTicks-1, newWarpSyncMarket.getEndTime()]

    # See another new market
    assert newWarpSyncMarket.address != warpSync.markets(universe.address)

def test_warp_sync_finalization_reward(contractsFixture, augur, universe, reputationToken, warpSync):
    account = contractsFixture.accounts[0]
    time = contractsFixture.contracts["Time"]

    warpSync.initializeUniverse(universe.address)
    market = contractsFixture.applySignature("Market", warpSync.markets(universe.address))

    proceedToInitialReporting(contractsFixture, market)
    numTicks = market.getNumTicks()
    assert market.doInitialReport([0,0,numTicks], "", 0)
    disputeWindow = contractsFixture.applySignature("DisputeWindow", market.getDisputeWindow())

    time.setTimestamp(disputeWindow.getEndTime())

    # The finalization reward grows as we get further out from the possible finalization time
    finalizationReward = warpSync.getFinalizationReward(market.address)
    # Initially it is 0
    assert finalizationReward == 0

    # After a day it will be about 0.64 REP
    day = 24 * 60 * 60
    time.incrementTimestamp(day)
    expectedFinalizationReward = (day ** 3) * 1000
    finalizationReward = warpSync.getFinalizationReward(market.address)
    assert finalizationReward == expectedFinalizationReward

    # After a week it will be about 221 REP
    time.incrementTimestamp(6 * day)
    expectedFinalizationReward = ((7 * day) ** 3) * 1000
    finalizationReward = warpSync.getFinalizationReward(market.address)
    assert finalizationReward == expectedFinalizationReward

    # We limit the maximum growth time to a week
    time.incrementTimestamp(1 * day)
    finalizationReward = warpSync.getFinalizationReward(market.address)
    assert finalizationReward == expectedFinalizationReward

def test_warp_sync_gets_forked(contractsFixture, augur, universe, reputationToken, warpSync):
    account = contractsFixture.accounts[0]
    time = contractsFixture.contracts["Time"]

    # See warp sync market
    warpSync.initializeUniverse(universe.address)
    market = contractsFixture.applySignature("Market", warpSync.markets(universe.address))

    # Fork warp sync market
    proceedToFork(contractsFixture, market, universe)
    finalize(contractsFixture, market, universe)

    # See that market finalizes but no new warp sync market exists
    assert market.isFinalized()
    assert market.address == warpSync.markets(universe.address)

    # See warp sync markets dont exists for child universes initially until initialization
    shortPayoutNumerators = [0] * market.getNumberOfOutcomes()
    shortPayoutNumerators[1] = market.getNumTicks()
    longPayoutNumerators = [0] * market.getNumberOfOutcomes()
    longPayoutNumerators[2] = market.getNumTicks()
    shortUniverse =  contractsFixture.applySignature('Universe', universe.createChildUniverse(shortPayoutNumerators))
    longUniverse =  contractsFixture.applySignature('Universe', universe.createChildUniverse(longPayoutNumerators))

    warpSync.initializeUniverse(shortUniverse.address)
    warpSync.initializeUniverse(longUniverse.address)
    shortUniverseMarket = contractsFixture.applySignature("Market", warpSync.markets(shortUniverse.address))
    longUniverseMarket = contractsFixture.applySignature("Market", warpSync.markets(longUniverse.address))

    assert shortUniverseMarket.address != nullAddress
    assert longUniverseMarket.address != nullAddress

    # Initially there is no warp sync data for the child universe
    assert warpSync.data(shortUniverseMarket.address) == [0, 0]

    # Finalize the warp sync market with some value
    proceedToInitialReporting(contractsFixture, shortUniverseMarket)
    numTicks = shortUniverseMarket.getNumTicks()
    assert shortUniverseMarket.doInitialReport([0,0,numTicks], "", 0)
    disputeWindow = contractsFixture.applySignature("DisputeWindow", shortUniverseMarket.getDisputeWindow())

    time.setTimestamp(disputeWindow.getEndTime())
    assert shortUniverseMarket.finalize()

    # Check Warp Sync contract for universe and see existing value
    assert warpSync.data(shortUniverse.address) == [numTicks, shortUniverseMarket.getEndTime()]

    # See new warp sync market
    newWarpSyncMarket = contractsFixture.applySignature("Market", warpSync.markets(shortUniverse.address))
    assert newWarpSyncMarket.address != shortUniverseMarket.address

def test_warp_sync_in_fork(contractsFixture, augur, universe, reputationToken, warpSync, market):
    account = contractsFixture.accounts[0]
    time = contractsFixture.contracts["Time"]

    # Get warp sync market
    warpSync.initializeUniverse(universe.address)
    warpMarket = contractsFixture.applySignature("Market", warpSync.markets(universe.address))

    # Fork the standard market
    proceedToFork(contractsFixture, market, universe)
    finalize(contractsFixture, market, universe)

    # See that we cannot migrate the warp sync market
    numTicks = market.getNumTicks()
    with raises(TransactionFailed):
        assert warpMarket.migrateThroughOneFork([0, 0, numTicks], "")

    # Instead we just create a new warp sync market as usual for the new universe
    winningUniverse = universe.getChildUniverse(market.getWinningPayoutDistributionHash())
    warpSync.initializeUniverse(winningUniverse)

    # The market now exists
    assert not warpSync.markets(winningUniverse) == nullAddress



@pytest_fixture
def warpSync(contractsFixture):
    return contractsFixture.contracts["WarpSync"]
