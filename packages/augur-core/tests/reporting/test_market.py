from datetime import timedelta
from eth_tester.exceptions import TransactionFailed
from pytest import raises, mark
from utils import stringToBytes, AssertLog, EtherDelta, TokenDelta, nullAddress
from reporting_utils import proceedToDesignatedReporting

@mark.parametrize('afterMkrShutdown', [
    True,
    False
])
def test_market_creation(afterMkrShutdown, contractsFixture, augur, universe, market):
    marketFactory = contractsFixture.contracts["MarketFactory"]
    account0 = contractsFixture.accounts[0]
    numTicks = market.getNumTicks()

    market = None
    endTime = contractsFixture.contracts["Time"].getTimestamp() + timedelta(days=1).total_seconds()

    if (afterMkrShutdown):
        contractsFixture.MKRShutdown()

    marketCreatedLog = {
        "extraInfo": 'so extra',
        "endTime": endTime,
        "marketCreator": account0,
        "designatedReporter": account0,
        "noShowBond": universe.getOrCacheMarketRepBond(),
    }

    with raises(TransactionFailed):
        market = marketFactory.createMarket(augur.address, endTime, 0, nullAddress, 0, account0, account0, 3, 100)

    with AssertLog(contractsFixture, "MarketCreated", marketCreatedLog):
        market = contractsFixture.createReasonableYesNoMarket(universe, extraInfo="so extra")

    assert market.getUniverse() == universe.address
    assert market.getNumberOfOutcomes() == 3
    assert numTicks == 100
    assert market.getReputationToken() == universe.getReputationToken()
    assert market.getWinningPayoutDistributionHash() == stringToBytes("")
    assert market.getInitialized()

    endTime = 0
    with raises(TransactionFailed):
        contractsFixture.createYesNoMarket(universe, endTime, 1, 0, account0)

def test_categorical_market_creation(contractsFixture, universe):
    account0 = contractsFixture.accounts[0]
    endTime = contractsFixture.contracts["Time"].getTimestamp() + 1

    with raises(TransactionFailed):
        contractsFixture.createCategoricalMarket(universe, 1, 0, endTime, 1, account0)

    assert contractsFixture.createCategoricalMarket(universe, 3, endTime, 1, 0, account0)
    assert contractsFixture.createCategoricalMarket(universe, 4, endTime, 1, 0, account0)
    assert contractsFixture.createCategoricalMarket(universe, 5, endTime, 1, 0, account0)
    assert contractsFixture.createCategoricalMarket(universe, 6, endTime, 1, 0, account0)
    assert contractsFixture.createCategoricalMarket(universe, 7, endTime, 1, 0, account0)

    with raises(TransactionFailed):
        contractsFixture.createCategoricalMarket(universe, 8, endTime, 1, 0, account0)

def test_num_ticks_validation(contractsFixture, universe):
    # Require numTicks != 0
    with raises(TransactionFailed):
       market = contractsFixture.createReasonableScalarMarket(universe, 30, -10, 0)

def test_transfering_ownership(contractsFixture, universe, market):
    account0 = contractsFixture.accounts[0]
    account1 = contractsFixture.accounts[1]

    transferLog = {
        "universe": universe.address,
        "market": market.address,
        "from": account0,
        "to": account1,
    }
    with AssertLog(contractsFixture, "MarketTransferred", transferLog):
        assert market.transferOwnership(account1)

    assert market.transferRepBondOwnership(account1)
    assert market.repBondOwner() == account1

@mark.parametrize('invalid', [
    True,
    False
])
def test_variable_validity_bond(invalid, contractsFixture, universe, cash):
    # We can't make a market with less than the minimum required validity bond
    minimumValidityBond = universe.getOrCacheValidityBond()

    with raises(TransactionFailed):
       contractsFixture.createReasonableYesNoMarket(universe, validityBond=minimumValidityBond-1)

    # No longer testing a higher validity bond, token transfers are token precisely, no ability to send more than required
    market = contractsFixture.createReasonableYesNoMarket(universe, validityBond=minimumValidityBond)
    assert market.getValidityBondAttoCash() == minimumValidityBond

    # We'll also throw in some additional Cash to the validity bond
    additionalAmount = 100
    cash.faucet(additionalAmount)
    cash.approve(market.address, additionalAmount)
    assert market.increaseValidityBond(additionalAmount)
    
    validityBond = minimumValidityBond + additionalAmount
    assert market.getValidityBondAttoCash() == validityBond

    # If we resolve the market the bond in it's entirety will go to the fee pool or to the market creator if the resolution was not invalid
    proceedToDesignatedReporting(contractsFixture, market)

    if invalid:
        market.doInitialReport([market.getNumTicks(), 0, 0], "", 0)
    else:
        market.doInitialReport([0, 0, market.getNumTicks()], "", 0)

    # Move time forward so we can finalize and see the bond move
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    assert contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    if invalid:
        with TokenDelta(cash, validityBond, universe.getOrCreateNextDisputeWindow(False), "Validity bond did not go to the dispute window"):
            market.finalize()
    else:
        with TokenDelta(cash, validityBond, market.getOwner(), "Validity bond did not go to the market creator"):
            market.finalize()

def test_non_dr_initial_reporter(contractsFixture, universe, reputationToken):
    account0 = contractsFixture.accounts[0]
    account1 = contractsFixture.accounts[1]
    market = contractsFixture.createReasonableYesNoMarket(universe, extraInfo="so extra", designatedReporterAddress=account1)

    proceedToDesignatedReporting(contractsFixture, market)

    stake = market.repBond()
    reputationToken.transfer(account1, stake)
    with TokenDelta(reputationToken, stake, account0, "Market creator didn't get bond back"):
        with TokenDelta(reputationToken, -stake, account1, "Designated Reporter did not pay bond"):
            market.doInitialReport([0, 0, market.getNumTicks()], "", 0, sender=account1)

def test_max_duration_with_upgrade_cadence(contractsFixture, universe):
    account0 = contractsFixture.accounts[0]
    baseMarketDurationMaximum = contractsFixture.contracts["Constants"].BASE_MARKET_DURATION_MAXIMUM()
    upgradeCadence = contractsFixture.contracts["Constants"].UPGRADE_CADENCE()
    upgradeDate = contractsFixture.contracts["Augur"].getMaximumMarketEndDate()

    # We cannot create markets after the initial deployment upgrade Date
    endTime = upgradeDate + 1
    with raises(TransactionFailed):
        contractsFixture.createYesNoMarket(universe, endTime, 1, 0, account0)

    # If we get within the baseMarketDurationMaximum window of the upgrade day we can create markets that end that much time from now
    now = contractsFixture.contracts["Time"].getTimestamp()
    contractsFixture.contracts["Time"].setTimestamp(upgradeDate - baseMarketDurationMaximum + 2)
    assert contractsFixture.createYesNoMarket(universe, endTime, 1, 0, account0)

    # Once the upgrade date has passed we can create markets with end times up to the old upgrade date + our upgrade cadence
    contractsFixture.contracts["Time"].setTimestamp(upgradeDate + 1)
    upgradeDate += upgradeCadence
    endTime = upgradeDate + 1
    with raises(TransactionFailed):
        contractsFixture.createYesNoMarket(universe, endTime, 1, 0, account0)

    endTime = upgradeDate - 1
    assert contractsFixture.createYesNoMarket(universe, endTime, 1, 0, account0)
