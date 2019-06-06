
from utils import longToHexString, stringToBytes, twentyZeros, thirtyTwoZeros, longTo32Bytes
from pytest import fixture, raises, mark
from eth_tester.exceptions import TransactionFailed

pytestmark = mark.skip(reason="Mock Tests off")

numTicks = 10 ** 10
disputeWindowId = 1467446882

def test_fee_window_creation(localFixture, initializedDisputeWindow, mockReputationToken, mockUniverse, constants, Time):
    assert initializedDisputeWindow.getTypeName() == stringToBytes("DisputeWindow")
    assert initializedDisputeWindow.getReputationToken() == mockReputationToken.address
    assert initializedDisputeWindow.getStartTime() == disputeWindowId * mockUniverse.getDisputeRoundDurationInSeconds()
    assert initializedDisputeWindow.getUniverse() == mockUniverse.address
    assert initializedDisputeWindow.getEndTime() == disputeWindowId * mockUniverse.getDisputeRoundDurationInSeconds() + constants.DISPUTE_ROUND_DURATION_SECONDS()
    assert initializedDisputeWindow.getNumInvalidMarkets() == 0
    assert initializedDisputeWindow.getNumIncorrectDesignatedReportMarkets() == 0
    assert initializedDisputeWindow.getNumDesignatedReportNoShows() == 0
    assert initializedDisputeWindow.isActive() == False
    assert initializedDisputeWindow.isOver() == False
    Time.setTimestamp(disputeWindowId * mockUniverse.getDisputeRoundDurationInSeconds() + 1)
    assert initializedDisputeWindow.isActive() == True
    Time.setTimestamp(disputeWindowId * mockUniverse.getDisputeRoundDurationInSeconds() + constants.DISPUTE_ROUND_DURATION_SECONDS())
    assert initializedDisputeWindow.isActive() == False
    assert initializedDisputeWindow.isOver() == True

def test_fee_window_on_market_finalization(localFixture, initializedDisputeWindow, mockUniverse, mockMarket):
    with raises(TransactionFailed):
        initializedDisputeWindow.onMarketFinalized()

    with raises(TransactionFailed):
        mockMarket.callOnMarketFinalized()

    mockUniverse.setIsContainerForMarket(True)
    mockMarket.setIsInvalid(False)
    mockMarket.setDesignatedReporterWasCorrect(True)
    mockMarket.setDesignatedReporterShowed(True)

    numMarkets = initializedDisputeWindow.getNumMarkets()
    invalidMarkets = initializedDisputeWindow.getNumInvalidMarkets()
    incorrectDRMarkets = initializedDisputeWindow.getNumIncorrectDesignatedReportMarkets()

    assert mockMarket.callOnMarketFinalized(initializedDisputeWindow.address) == True
    assert initializedDisputeWindow.getNumMarkets() == numMarkets + 1
    assert initializedDisputeWindow.getNumInvalidMarkets() == invalidMarkets
    assert initializedDisputeWindow.getNumIncorrectDesignatedReportMarkets() == incorrectDRMarkets

    mockMarket.setIsInvalid(True)
    mockMarket.setDesignatedReporterWasCorrect(False)
    mockMarket.setDesignatedReporterShowed(False)

    numMarkets = initializedDisputeWindow.getNumMarkets()
    invalidMarkets = initializedDisputeWindow.getNumInvalidMarkets()
    incorrectDRMarkets = initializedDisputeWindow.getNumIncorrectDesignatedReportMarkets()

    assert mockMarket.callOnMarketFinalized(initializedDisputeWindow.address) == True
    assert initializedDisputeWindow.getNumMarkets() == numMarkets + 1
    assert initializedDisputeWindow.getNumInvalidMarkets() == invalidMarkets + 1
    assert initializedDisputeWindow.getNumIncorrectDesignatedReportMarkets() == incorrectDRMarkets + 1

@fixture(scope="module")
def localSnapshot(fixture, augurInitializedWithMocksSnapshot):
    fixture.resetToSnapshot(augurInitializedWithMocksSnapshot)
    augur = fixture.contracts['Augur']
    mockCash = fixture.contracts['MockCash']
    mockAugur = fixture.contracts['MockAugur']
    mockReputationToken = fixture.contracts['MockReputationToken']
    augur.registerContract(stringToBytes('Cash'), mockCash.address)
    augur.registerContract(stringToBytes('Augur'), mockAugur.address)
    disputeWindow = fixture.upload('../source/contracts/reporting/DisputeWindow.sol', 'disputeWindow')
    fixture.contracts["initializedDisputeWindow"] = disputeWindow

    mockUniverse = fixture.contracts['MockUniverse']
    mockUniverse.setReputationToken(mockReputationToken.address)
    mockUniverse.setDisputeRoundDurationInSeconds(5040)
    mockUniverse.setForkingMarket(5040)
    mockUniverse.setForkingMarket(longToHexString(0))
    mockUniverse.setIsForking(False)
    fixture.contracts["Time"].setTimestamp(disputeWindowId)
    disputeWindow.initialize(mockUniverse.address, disputeWindowId)
    return fixture.createSnapshot()

@fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@fixture
def mockUniverse(localFixture):
    return localFixture.contracts['MockUniverse']

@fixture
def mockMarket(localFixture):
    return localFixture.contracts['MockMarket']

@fixture
def mockCash(localFixture):
    return localFixture.contracts['MockCash']

@fixture
def mockReputationToken(localFixture):
    return localFixture.contracts['MockReputationToken']

@fixture
def initializedDisputeWindow(localFixture):
    return localFixture.contracts["initializedDisputeWindow"]

@fixture
def constants(localFixture):
    return localFixture.contracts['Constants']

@fixture
def mockInitialReporter(localFixture):
    return localFixture.contracts['MockInitialReporter']

@fixture
def Time(localFixture):
    return localFixture.contracts["Time"]
