from eth_tester.exceptions import TransactionFailed
from utils import captureFilteredLogs, AssertLog, nullAddress, TokenDelta
from pytest import raises
from reporting_utils import proceedToNextRound, proceedToFork

def test_crowdsourcer_transfer(contractsFixture, market, universe):
    proceedToNextRound(contractsFixture, market)
    proceedToNextRound(contractsFixture, market)
    proceedToNextRound(contractsFixture, market)

    crowdsourcer = contractsFixture.applySignature("DisputeCrowdsourcer", market.getWinningReportingParticipant())

    transferAmount = 1
    tester0Balance = crowdsourcer.balanceOf(contractsFixture.accounts[0]) - transferAmount
    tester1Balance = crowdsourcer.balanceOf(contractsFixture.accounts[1]) + transferAmount

    crowdsourcerTokenTransferLog = {
        'from': contractsFixture.accounts[0],
        'to': contractsFixture.accounts[1],
        'token': crowdsourcer.address,
        'universe': universe.address,
        'tokenType': 1,
        'value': transferAmount,
    }

    crowdsourcerTokenBalance0Log = {
        'owner': contractsFixture.accounts[0],
        'token': crowdsourcer.address,
        'universe': universe.address,
        'tokenType': 1,
        'balance': tester0Balance,
    }

    crowdsourcerTokenBalance1Log = {
        'owner': contractsFixture.accounts[1],
        'token': crowdsourcer.address,
        'universe': universe.address,
        'tokenType': 1,
        'balance': tester1Balance,
    }

    with AssertLog(contractsFixture, "TokensTransferred", crowdsourcerTokenTransferLog):
        with AssertLog(contractsFixture, "TokenBalanceChanged", crowdsourcerTokenBalance0Log):
            with AssertLog(contractsFixture, "TokenBalanceChanged", crowdsourcerTokenBalance1Log, skip=1):
                assert crowdsourcer.transfer(contractsFixture.accounts[1], transferAmount)

def test_malicious_shady_parties(contractsFixture, universe):
    maliciousMarketHaver = contractsFixture.upload('solidity_test_helpers/MaliciousMarketHaver.sol', 'maliciousMarketHaver')

    maliciousMarketHaver.setMarket(nullAddress)
    assert not universe.isContainerForReportingParticipant(maliciousMarketHaver.address)

def test_universe_fork_goal_freeze(contractsFixture, universe, market):
    proceedToFork(contractsFixture, market, universe)

    with raises(TransactionFailed):
        universe.updateForkValues()

def test_additional_initial_report_stake(contractsFixture, universe, reputationToken, market):
    # Skip to Designated Reporting
    contractsFixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)

    # Designated Report with additional stake specified
    designatedReportCost = universe.getOrCacheDesignatedReportStake()
    additionalStake = 500 * 10**18
    with TokenDelta(reputationToken, -additionalStake, contractsFixture.accounts[0], "Doing the designated report with additional stake didn't take the additional stake"):
        market.doInitialReport([0, market.getNumTicks(), 0], "", additionalStake)

    # Now let the market resolve with the initial report
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    # Time marches on and the market can be finalized
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # The premptive bond can be redeemed for the REP staked
    preemptiveDisputeCrowdsourcer = contractsFixture.applySignature('DisputeCrowdsourcer', market.preemptiveDisputeCrowdsourcer())

    with TokenDelta(reputationToken, additionalStake, contractsFixture.accounts[0], "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(contractsFixture.accounts[0])

def test_dispute_window_buffer(contractsFixture, augur, universe):
    time = contractsFixture.contracts["Time"]
    constants = contractsFixture.contracts["Constants"]

    initialTimestamp = 1569110400 # Sunday, September 22, 2019 12:00:00 AM
    lessThanBuffer = constants.DISPUTE_WINDOW_BUFFER_SECONDS() - 1
    timestamp = initialTimestamp + lessThanBuffer
    time.setTimestamp(timestamp)

    curDisputeWindowAddress = universe.getOrCreateCurrentDisputeWindow(True)
    curDisputeWindow = contractsFixture.applySignature("DisputeWindow", curDisputeWindowAddress)

    assert curDisputeWindow.getStartTime() < timestamp
    assert curDisputeWindow.getEndTime() > timestamp

    nextDisputeWindowAddress = universe.getOrCreateNextDisputeWindow(True)
    nextDisputeWindow = contractsFixture.applySignature("DisputeWindow", nextDisputeWindowAddress)

    expectedMaxEndTime = 2 * 24 * 60 * 60 # 2 days out

    assert nextDisputeWindow.getStartTime() > timestamp
    assert nextDisputeWindow.getEndTime() < timestamp + expectedMaxEndTime
