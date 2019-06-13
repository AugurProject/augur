from eth_tester.exceptions import TransactionFailed
from utils import captureFilteredLogs, AssertLog, nullAddress
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
        'tokenType': 2,
        'value': transferAmount,
    }

    crowdsourcerTokenBalance0Log = {
        'owner': contractsFixture.accounts[0],
        'token': crowdsourcer.address,
        'universe': universe.address,
        'tokenType': 2,
        'balance': tester0Balance,
    }

    crowdsourcerTokenBalance1Log = {
        'owner': contractsFixture.accounts[1],
        'token': crowdsourcer.address,
        'universe': universe.address,
        'tokenType': 2,
        'balance': tester1Balance,
    }


    with AssertLog(contractsFixture, "TokensTransferred", crowdsourcerTokenTransferLog):
        with AssertLog(contractsFixture, "TokenBalanceChanged", crowdsourcerTokenBalance0Log):
            with AssertLog(contractsFixture, "TokenBalanceChanged", crowdsourcerTokenBalance1Log, skip=1):
                assert crowdsourcer.transfer(contractsFixture.accounts[1], transferAmount)

def test_malicious_shady_parties(contractsFixture, universe):
    maliciousMarketHaver = contractsFixture.upload('solidity_test_helpers/MaliciousMarketHaver.sol', 'maliciousMarketHaver')

    maliciousMarketHaver.setMarket(universe.address)
    assert not universe.isContainerForShareToken(maliciousMarketHaver.address)

    maliciousMarketHaver.setMarket(nullAddress)
    assert not universe.isContainerForReportingParticipant(maliciousMarketHaver.address)

def test_universe_fork_goal_freeze(contractsFixture, universe, market):
    proceedToFork(contractsFixture, market, universe)

    with raises(TransactionFailed):
        universe.updateForkValues()