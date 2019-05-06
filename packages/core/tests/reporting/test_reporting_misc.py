from ethereum.tools import tester
from ethereum.tools.tester import TransactionFailed
from utils import captureFilteredLogs, bytesToHexString, AssertLog
from pytest import raises
from reporting_utils import proceedToNextRound

def test_crowdsourcer_transfer(contractsFixture, market, universe):
    proceedToNextRound(contractsFixture, market)
    proceedToNextRound(contractsFixture, market)
    proceedToNextRound(contractsFixture, market)

    crowdsourcer = contractsFixture.applySignature("DisputeCrowdsourcer", market.getWinningReportingParticipant())

    transferAmount = 1
    tester0Balance = crowdsourcer.balanceOf(tester.a0) - transferAmount
    tester1Balance = crowdsourcer.balanceOf(tester.a1) + transferAmount

    crowdsourcerTokenTransferLog = {
        'from': bytesToHexString(tester.a0),
        'to': bytesToHexString(tester.a1),
        'token': crowdsourcer.address,
        'universe': universe.address,
        'tokenType': 2,
        'value': transferAmount,
    }

    crowdsourcerTokenBalance0Log = {
        'owner': bytesToHexString(tester.a0),
        'token': crowdsourcer.address,
        'universe': universe.address,
        'tokenType': 2,
        'balance': tester0Balance,
    }

    crowdsourcerTokenBalance1Log = {
        'owner': bytesToHexString(tester.a1),
        'token': crowdsourcer.address,
        'universe': universe.address,
        'tokenType': 2,
        'balance': tester1Balance,
    }


    with AssertLog(contractsFixture, "TokensTransferred", crowdsourcerTokenTransferLog):
        with AssertLog(contractsFixture, "TokenBalanceChanged", crowdsourcerTokenBalance0Log):
            with AssertLog(contractsFixture, "TokenBalanceChanged", crowdsourcerTokenBalance1Log, skip=1):
                assert crowdsourcer.transfer(tester.a1, transferAmount)

def test_malicious_shady_parties(contractsFixture, universe):
    maliciousMarketHaver = contractsFixture.upload('solidity_test_helpers/MaliciousMarketHaver.sol', 'maliciousMarketHaver')

    maliciousMarketHaver.setMarket(universe.address)
    assert not universe.isContainerForShareToken(maliciousMarketHaver.address)

    maliciousMarketHaver.setMarket(0)
    assert not universe.isContainerForReportingParticipant(maliciousMarketHaver.address)
