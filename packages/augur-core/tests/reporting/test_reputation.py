from eth_tester.exceptions import TransactionFailed
from pytest import raises
from utils import AssertLog

def test_init(contractsFixture, universe):
    reputationTokenFactory = contractsFixture.contracts['ReputationTokenFactory']
    assert reputationTokenFactory
    reputationTokenAddress = reputationTokenFactory.createReputationToken(contractsFixture.contracts['Augur'].address, universe.address, "0x0000000000000000000000000000000000000000")
    reputationToken = contractsFixture.applySignature('ReputationToken', reputationTokenAddress)

    assert reputationToken.name() == "Reputation"
    assert reputationToken.decimals() == 18
    assert reputationToken.symbol() == "REP"

def test_reputation_token_logging(contractsFixture, universe):
    reputationToken = contractsFixture.applySignature("ReputationToken", universe.getReputationToken())

    tokensTransferredLog = {
        'from': contractsFixture.accounts[0],
        'to': contractsFixture.accounts[1],
        'token': reputationToken.address,
        'universe': universe.address,
        'tokenType': 0,
        'value': 8,
    }

    with AssertLog(contractsFixture, 'TokensTransferred', tokensTransferredLog):
        assert reputationToken.transfer(contractsFixture.accounts[1], 8)

    assert reputationToken.approve(contractsFixture.accounts[2], 12)

    tokensTransferredLog['value'] = 12
    with AssertLog(contractsFixture, 'TokensTransferred', tokensTransferredLog):
        assert reputationToken.transferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], 12, sender=contractsFixture.accounts[2])

def test_legacy_migration(augurInitializedFixture):
    # Initialize the legacy REP contract with some balances
    legacyReputationToken = augurInitializedFixture.contracts['LegacyReputationToken']
    legacyReputationToken.faucet(11 * 10**6 * 10**18)
    legacyReputationToken.transfer(augurInitializedFixture.accounts[1], 100)
    legacyReputationToken.transfer(augurInitializedFixture.accounts[2], 100)
    legacyReputationToken.approve(augurInitializedFixture.accounts[1], 1000)
    legacyReputationToken.approve(augurInitializedFixture.accounts[2], 2000)

    # When we create a genesis universe we'll need to migrate the legacy REP before the contract can be used
    universe = augurInitializedFixture.createUniverse()
    reputationToken = augurInitializedFixture.applySignature("ReputationToken", universe.getReputationToken())

    # We'll only partially migrate right now
    legacyReputationToken.approve(reputationToken.address, 100, sender=augurInitializedFixture.accounts[1])
    reputationToken.migrateFromLegacyReputationToken(sender=augurInitializedFixture.accounts[1])
    assert reputationToken.balanceOf(augurInitializedFixture.accounts[1]) == 100

    # Doing again is a noop
    reputationToken.migrateFromLegacyReputationToken(sender=augurInitializedFixture.accounts[1])
    assert reputationToken.balanceOf(augurInitializedFixture.accounts[1]) == 100

    # Doing with an account which has no legacy REP is a noop
    legacyReputationToken.approve(reputationToken.address, 100)
    reputationToken.migrateFromLegacyReputationToken(sender=augurInitializedFixture.accounts[6])
    assert reputationToken.balanceOf(augurInitializedFixture.accounts[6]) == 0

    # We'll finish the migration now
    legacyReputationToken.approve(reputationToken.address, 11 * 10**6 * 10**18, sender=augurInitializedFixture.accounts[0])
    reputationToken.migrateFromLegacyReputationToken(sender=augurInitializedFixture.accounts[0])
    assert reputationToken.balanceOf(augurInitializedFixture.accounts[0]) == 11 * 10**6 * 10**18 - 200

    legacyReputationToken.approve(reputationToken.address, 100, sender=augurInitializedFixture.accounts[2])
    reputationToken.migrateFromLegacyReputationToken(sender=augurInitializedFixture.accounts[2])
    assert reputationToken.balanceOf(augurInitializedFixture.accounts[2]) == 100
