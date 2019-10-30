
from utils import longToHexString, stringToBytes, twentyZeros, thirtyTwoZeros, longTo32Bytes
from pytest import fixture, raises, mark
from eth_tester.exceptions import TransactionFailed

pytestmark = mark.skip(reason="Mock Tests off")

numTicks = 10 ** 10
def test_market_creation(localFixture, mockUniverse, mockDisputeWindow, mockCash, chain, constants, mockMarket, mockReputationToken, mockShareToken, mockShareTokenFactory):
    fee = 16
    oneEther = 10 ** 18
    endTime = localFixture.contracts["Time"].getTimestamp() + constants.DESIGNATED_REPORTING_DURATION_SECONDS()
    market = localFixture.upload('../source/contracts/reporting/Market.sol', 'newMarket')

    with raises(TransactionFailed):
        market.initialize(mockUniverse.address, endTime, fee, fixture.accounts[1], fixture.accounts[1], 1, numTicks)

    with raises(TransactionFailed):
        market.initialize(mockUniverse.address, endTime, fee, fixture.accounts[1], fixture.accounts[1], 9, numTicks)

    with raises(TransactionFailed):
        market.initialize(mockUniverse.address, endTime, fee, fixture.accounts[1], fixture.accounts[1], 7, numTicks)

    with raises(TransactionFailed):
        market.initialize(mockUniverse.address, endTime, oneEther / 2 + 1, fixture.accounts[1], fixture.accounts[1], 5, numTicks)

    with raises(TransactionFailed):
        market.initialize(mockUniverse.address, endTime, fee, longToHexString(0), fixture.accounts[1], 5, numTicks)

    with raises(TransactionFailed):
        market.initialize(mockUniverse.address, endTime, fee, fixture.accounts[1], longToHexString(0), 5, numTicks)

    mockUniverse.setForkingMarket(mockMarket.address)
    with raises(TransactionFailed):
        market.initialize(mockUniverse.address, endTime, fee, fixture.accounts[1], fixture.accounts[1], 5, numTicks)

    mockUniverse.setForkingMarket(longToHexString(0))
    mockReputationToken.setBalanceOf(0)
    mockUniverse.setOrCacheDesignatedReportNoShowBond(100)
    with raises(TransactionFailed):
        market.initialize(mockUniverse.address, endTime, fee, fixture.accounts[1], fixture.accounts[1], 5, numTicks)

    mockReputationToken.setBalanceOf(100)
    mockUniverse.setOrCacheTargetReporterGasCosts(15)
    mockUniverse.setOrCacheValidityBond(12)
    with raises(TransactionFailed):
        market.initialize(mockUniverse.address, endTime, fee, fixture.accounts[1], fixture.accounts[1], 5, numTicks, value=0)

    mockShareTokenFactory.resetCreateShareToken()
    assert market.initialize(mockUniverse.address, endTime, fee, fixture.accounts[1], fixture.accounts[1], 5, numTicks, value=100)
    assert mockShareTokenFactory.getCreateShareTokenMarketValue() == market.address
    assert mockShareTokenFactory.getCreateShareTokenOutcomeValue() == 5
    assert market.getTypeName() == stringToBytes("Market")
    assert market.getUniverse() == mockUniverse.address
    assert market.getUniverse() == mockUniverse.address
    assert market.getDesignatedReporter() == fixture.accounts[1]
    assert market.getNumberOfOutcomes() == 6
    assert market.getEndTime() == endTime
    assert market.getNumTicks() == numTicks
    assert market.getMarketCreatorSettlementFeeDivisor() == oneEther / 16
    assert mockShareTokenFactory.getCreateShareTokenCounter() == 6
    assert mockShareTokenFactory.getCreateShareToken(0) == market.getShareToken(0)
    assert mockShareTokenFactory.getCreateShareToken(1) == market.getShareToken(1)
    assert mockShareTokenFactory.getCreateShareToken(2) == market.getShareToken(2)
    assert mockShareTokenFactory.getCreateShareToken(3) == market.getShareToken(3)
    assert mockShareTokenFactory.getCreateShareToken(4) == market.getShareToken(4)
    assert mockUniverse.getOrCacheValidityBondWallCalled() == True

def test_initial_report(localFixture, initializedMarket, mockReputationToken, mockUniverse, mockInitialReporter):
    # We can't do the initial report till the market has ended
    with raises(TransactionFailed):
        initializedMarket.doInitialReport([initializedMarket.getNumTicks(), 0, 0, 0, 0, 0], "", 0, sender=fixture.accounts[1])

    localFixture.contracts["Time"].setTimestamp(initializedMarket.getEndTime() + 1)

    repBalance = 10 ** 4
    initBond = 10 ** 8
    mockUniverse.setOrCacheDesignatedReportStake(initBond)
    mockReputationToken.setBalanceOf(repBalance)
    assert initializedMarket.doInitialReport([initializedMarket.getNumTicks(), 0, 0, 0, 0, 0], "", 0, sender=fixture.accounts[1])
    # verify creator gets back rep bond
    assert mockReputationToken.getTransferValueFor(fixture.accounts[2]) == mockUniverse.getOrCacheDesignatedReportNoShowBond()
    # verify init reporter pays init rep bond
    assert mockReputationToken.getTrustedTransferSourceValue() == fixture.accounts[1]
    assert mockReputationToken.getTrustedTransferAttotokensValue() == initBond
    initialReporter = localFixture.applySignature("InitialReporter", initializedMarket.getInitialReporter())
    assert mockReputationToken.getTrustedTransferDestinationValue() == initialReporter.address
    assert mockInitialReporter.reportWasCalled() == True

def test_contribute(localFixture, initializedMarket, mockNextDisputeWindow, mockInitialReporter, mockDisputeCrowdsourcer, mockDisputeCrowdsourcerFactory):
    # We can't contribute until there is an initial report to dispute
    with raises(TransactionFailed):
        initializedMarket.contribute([0, 0, 0, 0, 0, initializedMarket.getNumTicks()], 1, "")

    localFixture.contracts["Time"].setTimestamp(initializedMarket.getEndTime() + 1)

    assert initializedMarket.doInitialReport([initializedMarket.getNumTicks(), 0, 0, 0, 0, 0], "", 0, sender=fixture.accounts[1])

    mockNextDisputeWindow.setIsActive(True)
    winningPayoutHash = initializedMarket.derivePayoutDistributionHash([initializedMarket.getNumTicks(), 0, 0, 0, 0, 0])
    mockInitialReporter.setPayoutDistributionHash(winningPayoutHash)

    # We can't contribute to the current winning outcome
    with raises(TransactionFailed):
        initializedMarket.contribute([initializedMarket.getNumTicks(), 0, 0, 0, 0, 0], 1, "")

    assert initializedMarket.contribute([0, 0, 0, 0, 0, initializedMarket.getNumTicks()], 1, "")
    assert mockDisputeCrowdsourcer.contributeWasCalled() == True
    assert mockDisputeCrowdsourcer.getContributeParticipant() == fixture.accounts[0]
    assert mockDisputeCrowdsourcer.getContributeAmount() == 1


def test_market_finish_crowdsourcing_dispute_bond_fork(localFixture, initializedMarket, mockDisputeCrowdsourcer, mockNextDisputeWindow, mockUniverse):
    localFixture.contracts["Time"].setTimestamp(initializedMarket.getEndTime() + 1)
    assert initializedMarket.doInitialReport([initializedMarket.getNumTicks(), 0, 0, 0, 0, 0], "", 0, sender=fixture.accounts[1])
    mockNextDisputeWindow.setIsActive(True)

    mockUniverse.setDisputeThresholdForFork(200)
    mockDisputeCrowdsourcer.setTotalSupply(1)
    mockDisputeCrowdsourcer.setSize(200)

    assert initializedMarket.contribute([0, 0, 0, 0, 0, initializedMarket.getNumTicks()], 1, "")

    assert mockUniverse.getForkCalled() == False

    mockDisputeCrowdsourcer.setTotalSupply(200)

    assert initializedMarket.contribute([0, 0, 0, 0, 0, initializedMarket.getNumTicks()], 1, "")

    assert mockUniverse.getForkCalled() == True

    assert mockUniverse.getOrCreateNextDisputeWindowWasCalled() == True

def test_market_finalize_fork(localFixture, initializedMarket, mockUniverse):
    with raises(TransactionFailed):
        initializedMarket.finalize()

    mockUniverse.setForkingMarket(initializedMarket.address)
    winningUniverse = localFixture.upload('solidity_test_helpers/MockUniverse.sol', 'winningUniverse')
    mockUniverse.setWinningChildUniverse(winningUniverse.address)
    winningUniverse.setParentPayoutDistributionHash(stringToBytes("111"))

    assert initializedMarket.finalize() == True
    assert initializedMarket.getWinningPayoutDistributionHash() == stringToBytes("111")


def test_finalize(localFixture, chain, initializedMarket, mockInitialReporter, mockNextDisputeWindow, mockUniverse):
    with raises(TransactionFailed):
        initializedMarket.finalize()

    localFixture.contracts["Time"].setTimestamp(initializedMarket.getEndTime() + 1)
    assert initializedMarket.doInitialReport([initializedMarket.getNumTicks(), 0, 0, 0, 0, 0], "", 0, sender=fixture.accounts[1])
    mockInitialReporter.setReportTimestamp(1)

    with raises(TransactionFailed):
        initializedMarket.finalize()

    mockNextDisputeWindow.setIsOver(True)

    mockUniverse.setForkingMarket(longToHexString(1))

    with raises(TransactionFailed):
        initializedMarket.finalize()

    mockUniverse.setForkingMarket(longToHexString(0))

    mockInitialReporter.setPayoutDistributionHash(longTo32Bytes(2))

    assert initializedMarket.finalize()
    # since market is not the forking market tentative winning hash will be the winner
    assert initializedMarket.getWinningPayoutDistributionHash() == longTo32Bytes(2)

def test_approve_spenders(localFixture, initializedMarket, mockCash, mockShareTokenFactory):
    approvalAmount = 2**256-1
    # approveSpender was called as part of market initialization
    initializedMarket.approveSpenders()
    cancelOrder = localFixture.contracts['CancelOrder']
    assert mockCash.getApproveValueFor(cancelOrder.address) == approvalAmount
    CompleteSets = localFixture.contracts['CompleteSets']
    assert mockCash.getApproveValueFor(CompleteSets.address) == approvalAmount
    shareToken= localFixture.contracts['ShareToken']
    assert mockCash.getApproveValueFor(shareToken.address) == approvalAmount

    FillOrder = localFixture.contracts['FillOrder']
    assert mockCash.getApproveValueFor(FillOrder.address) == approvalAmount

    # verify all shared tokens have approved amount for fill order contract
    # this market only has 5 outcomes
    for index in range(5):
        shareToken = localFixture.applySignature('MockShareToken', mockShareTokenFactory.getCreateShareToken(index));
        assert shareToken.getApproveValueFor(FillOrder.address) == approvalAmount

@fixture(scope="module")
def localSnapshot(fixture, augurInitializedWithMocksSnapshot):
    fixture.resetToSnapshot(augurInitializedWithMocksSnapshot)
    augur = fixture.contracts['Augur']
    mockCash = fixture.contracts['MockCash']
    mockAugur = fixture.contracts['MockAugur']
    mockInitialReporter = fixture.contracts['MockInitialReporter']
    mockDisputeCrowdsourcer = fixture.contracts['MockDisputeCrowdsourcer']
    mockShareTokenFactory = fixture.contracts['MockShareTokenFactory']
    mockInitialReporterFactory = fixture.contracts['MockInitialReporterFactory']
    mockDisputeCrowdsourcerFactory = fixture.contracts['MockDisputeCrowdsourcerFactory']
    mockShareToken = fixture.contracts['MockShareToken']

    # pre populate share tokens for max of 8 possible outcomes
    for index in range(8):
        item = fixture.uploadAndAddToAugur('solidity_test_helpers/MockShareToken.sol', 'newMockShareToken' + str(index))
        mockShareTokenFactory.pushCreateShareToken(item.address)

    augur.registerContract(stringToBytes('Cash'), mockCash.address)
    augur.registerContract(stringToBytes('ShareTokenFactory'), mockShareTokenFactory.address)
    augur.registerContract(stringToBytes('InitialReporterFactory'), mockInitialReporterFactory.address)
    augur.registerContract(stringToBytes('DisputeCrowdsourcerFactory'), mockDisputeCrowdsourcerFactory.address)
    mockShareTokenFactory.resetCreateShareToken()

    mockReputationToken = fixture.contracts['MockReputationToken']
    mockUniverse = fixture.contracts['MockUniverse']
    mockUniverse.setReputationToken(mockReputationToken.address)

    mockDisputeWindow = fixture.contracts['MockDisputeWindow']
    mockDisputeWindow.setReputationToken(mockReputationToken.address)
    mockDisputeWindow.setUniverse(mockUniverse.address)

    mockNextDisputeWindow = fixture.upload('solidity_test_helpers/MockDisputeWindow.sol', 'mockNextDisputeWindow')
    mockNextDisputeWindow.setReputationToken(mockReputationToken.address)
    mockNextDisputeWindow.setUniverse(mockUniverse.address)

    mockInitialReporterFactory.setInitialReporter(mockInitialReporter.address)
    mockDisputeCrowdsourcerFactory.setDisputeCrowdsourcer(mockDisputeCrowdsourcer.address)

    constants = fixture.contracts['Constants']

    market = fixture.upload('../source/contracts/reporting/Market.sol', 'market')
    fixture.contracts["initializedMarket"] = market
    contractMap = fixture.upload('../source/contracts/libraries/collections/Map.sol', 'Map')
    endTime = fixture.contracts["Time"].getTimestamp() + constants.DESIGNATED_REPORTING_DURATION_SECONDS()

    mockUniverse.setForkingMarket(longToHexString(0))
    mockUniverse.setOrCacheDesignatedReportNoShowBond(100)
    mockReputationToken.setBalanceOf(100)
    mockUniverse.setOrCacheTargetReporterGasCosts(15)
    mockUniverse.setOrCacheValidityBond(12)
    mockUniverse.setNextDisputeWindow(mockNextDisputeWindow.address)
    mockDisputeWindow.setEndTime(fixture.contracts["Time"].getTimestamp() + constants.DESIGNATED_REPORTING_DURATION_SECONDS())
    mockNextDisputeWindow.setEndTime(mockDisputeWindow.getEndTime() + constants.DESIGNATED_REPORTING_DURATION_SECONDS())
    assert market.initialize(mockUniverse.address, endTime, 16, fixture.accounts[1], fixture.accounts[2], 5, numTicks, value=100)

    return fixture.createSnapshot()

@fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@fixture
def mockUniverse(localFixture):
    return localFixture.contracts['MockUniverse']

@fixture
def mockDisputeWindow(localFixture):
    return localFixture.contracts['MockDisputeWindow']

@fixture
def mockNextDisputeWindow(localFixture):
    return localFixture.contracts['mockNextDisputeWindow']

@fixture
def constants(localFixture):
    return localFixture.contracts['Constants']

@fixture
def mockCash(localFixture):
    return localFixture.contracts['MockCash']

@fixture
def chain(localFixture):
    return localFixture.chain

@fixture
def mockMarket(localFixture):
    return localFixture.contracts['MockMarket']

@fixture
def mockAugur(localFixture):
    return localFixture.contracts['MockAugur']

@fixture
def mockReputationToken(localFixture):
    return localFixture.contracts['MockReputationToken']

@fixture
def mockShareToken(localFixture):
    return localFixture.contracts['MockShareToken']

@fixture
def mockShareTokenFactory(localFixture):
    return localFixture.contracts['MockShareTokenFactory']

@fixture
def mockInitialReporter(localFixture):
    return localFixture.contracts['MockInitialReporter']

@fixture
def initializedMarket(localFixture):
    return localFixture.contracts["initializedMarket"]

@fixture
def mockDisputeCrowdsourcer(localFixture):
    return localFixture.contracts["MockDisputeCrowdsourcer"]

@fixture
def mockDisputeCrowdsourcerFactory(localFixture):
    return localFixture.contracts["MockDisputeCrowdsourcerFactory"]
