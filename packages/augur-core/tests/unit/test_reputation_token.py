
from datetime import timedelta
from utils import longToHexString, stringToBytes, twentyZeros, thirtyTwoZeros
from pytest import fixture, raises, mark
from eth_tester.exceptions import TransactionFailed

pytestmark = mark.skip(reason="Mock Tests off")

def test_reputation_token_creation(localFixture, mockUniverse):
    reputationToken = localFixture.upload('../source/contracts/reporting/ReputationToken.sol', 'reputationToken', constructorArgs=[localFixture.contracts['Augur'].address, mockUniverse.address, mockUniverse.address])

    assert reputationToken.getTypeName() == stringToBytes('ReputationToken')
    assert reputationToken.getUniverse() == mockUniverse.address

def test_reputation_token_migrate_in(localFixture, mockUniverse, initializedReputationToken, mockReputationToken, mockMarket):
    with raises(TransactionFailed):
        initializedReputationToken.migrateIn(fixture.accounts[1], 100)

    with raises(TransactionFailed):
        mockReputationToken.callMigrateIn(initializedReputationToken.address, fixture.accounts[1], 1000)

    parentUniverse = localFixture.upload('solidity_test_helpers/MockUniverse.sol', 'parentUniverse')
    parentUniverse.setReputationToken(mockReputationToken.address)
    mockUniverse.setParentUniverse(parentUniverse.address)
    parentUniverse.setForkEndTime(1000000000000000)
    mockReputationToken.setUniverse(mockUniverse.address)
    with raises(TransactionFailed):
        mockReputationToken.callMigrateIn(initializedReputationToken.address, fixture.accounts[1], 100)

    parentUniverse.setForkingMarket(mockMarket.address)

    assert initializedReputationToken.totalSupply() == 100
    mockReputationToken.callMigrateIn(initializedReputationToken.address, fixture.accounts[1], 100)
    assert initializedReputationToken.totalSupply() == 200

    mockReputationToken.callMigrateIn(initializedReputationToken.address, fixture.accounts[2], 100)
    assert initializedReputationToken.totalSupply() == 300

def test_reputation_token_trusted_transfer(localFixture, mockUniverse, initializedReputationToken, mockMarket, mockDisputeWindow, mockLegacyReputationToken):
    with raises(TransactionFailed):
        initializedReputationToken.trustedDisputeWindowTransfer(fixture.accounts[1], fixture.accounts[2], 100)

    with raises(TransactionFailed):
        mockDisputeWindow.callTrustedDisputeWindowTransfer(initializedReputationToken.address, fixture.accounts[1], fixture.accounts[2], 100)

    with raises(TransactionFailed):
        mockMarket.callTrustedMarketTransfer(initializedReputationToken.address, fixture.accounts[1], fixture.accounts[2], 100)

    with raises(TransactionFailed):
        mockDisputeWindow.callTrustedDisputeWindowTransfer(initializedReputationToken.address, fixture.accounts[1], fixture.accounts[2], 100)

    mockUniverse.setIsContainerForDisputeWindow(True)
    with raises(TransactionFailed):
        mockDisputeWindow.callTrustedDisputeWindowTransfer(initializedReputationToken.address, fixture.accounts[1], fixture.accounts[2], 100)


    assert initializedReputationToken.totalSupply() == 100
    assert initializedReputationToken.balanceOf(fixture.accounts[1]) == 0
    assert initializedReputationToken.transfer(fixture.accounts[1], 35)
    assert initializedReputationToken.totalSupply() == 100
    assert initializedReputationToken.balanceOf(fixture.accounts[2]) == 0
    assert initializedReputationToken.balanceOf(fixture.accounts[1]) == 35

    with raises(TransactionFailed):
        mockDisputeWindow.callTrustedDisputeWindowTransfer(initializedReputationToken.address, fixture.accounts[1], fixture.accounts[2], 100)

    assert mockDisputeWindow.callTrustedDisputeWindowTransfer(initializedReputationToken.address, fixture.accounts[1], fixture.accounts[2], 35)
    # TODO find out why total supply grows
    assert initializedReputationToken.totalSupply() == 100
    assert initializedReputationToken.balanceOf(fixture.accounts[2]) == 35
    assert initializedReputationToken.balanceOf(fixture.accounts[1]) == 0

@fixture(scope="session")
def localSnapshot(fixture, augurInitializedWithMocksSnapshot):
    fixture.resetToSnapshot(augurInitializedWithMocksSnapshot)
    augur = fixture.contracts['Augur']
    mockLegacyReputationToken = fixture.contracts['MockLegacyReputationToken']
    augur.registerContract(stringToBytes('LegacyReputationToken'), mockLegacyReputationToken.address)
    mockLegacyReputationToken.setTotalSupply(100)
    mockLegacyReputationToken.setBalanceOfValueFor(fixture.accounts[0], 100)
    return fixture.createSnapshot()

@fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@fixture
def mockUniverse(localFixture):
    mockUniverse = localFixture.contracts['MockUniverse']
    return mockUniverse

@fixture
def mockReputationToken(localFixture):
    mockReputationToken = localFixture.contracts['MockReputationToken']
    return mockReputationToken

@fixture
def mockMarket(localFixture):
    mockMarket = localFixture.contracts['MockMarket']
    return mockMarket

@fixture
def mockDisputeWindow(localFixture):
    return localFixture.contracts['MockDisputeWindow']

@fixture
def mockDisputeWindow(localFixture):
    return localFixture.contracts['MockDisputeWindow']

@fixture
def mockLegacyReputationToken(localFixture):
    return localFixture.contracts['MockLegacyReputationToken']

@fixture
def mockAugur(localFixture):
    return localFixture.contracts['MockAugur']

@fixture
def initializedReputationToken(localFixture, mockUniverse, mockLegacyReputationToken):
    reputationToken = localFixture.upload('../source/contracts/reporting/ReputationToken.sol', 'reputationToken', constructorArgs=[localFixture.contracts['Augur'].address, mockUniverse.address, mockUniverse.address])
    totalSupply = 11 * 10**6 * 10**18
    assert mockLegacyReputationToken.faucet(totalSupply)
    assert mockLegacyReputationToken.approve(reputationToken.address, totalSupply)
    assert reputationToken.migrateFromLegacyReputationToken()
    return reputationToken
