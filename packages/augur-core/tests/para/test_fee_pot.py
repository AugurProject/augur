
from eth_tester.exceptions import TransactionFailed
from utils import captureFilteredLogs, AssertLog, nullAddress, TokenDelta
from pytest import raises

def test_fee_pot_symbol(contractsFixture, universe, reputationToken):
    if not contractsFixture.paraAugur:
        return
        
    feePot = contractsFixture.getFeePot(universe)

    assert feePot.symbol() == "S_REPv2"

def test_fee_pot_main(contractsFixture, universe, reputationToken, cash):
    if not contractsFixture.paraAugur:
        return

    feePot = contractsFixture.getFeePot(universe)

    bob = contractsFixture.accounts[0]
    alice = contractsFixture.accounts[1]

    reputationToken.faucet(100, sender=bob)
    reputationToken.faucet(100, sender=alice)

    cash.faucet(10000)
    cash.approve(feePot.address, 10000000000000000)

    reputationToken.approve(feePot.address, 10000000000000000, sender=bob)
    reputationToken.approve(feePot.address, 10000000000000000, sender=alice)

    # Put 10 Cash in
    feePot.depositFees(10)

    # Alice puts in 1 REP
    feePot.stake(1, sender=alice)

    # Nothing owed yet
    assert feePot.withdrawableFeesOf(alice) == 0

    # Put 10 Cash in
    feePot.depositFees(10)

    # Alice owed all 20
    assert feePot.withdrawableFeesOf(alice) == 20

    # Put 10 Cash in
    feePot.depositFees(10)

    # Alice owed all 30
    assert feePot.withdrawableFeesOf(alice) == 30

    # Bob puts in 2 REP
    feePot.stake(2, sender=bob)

    # Alice still owed all 30
    assert feePot.withdrawableFeesOf(alice) == 30

    # Bob owed nothing
    assert feePot.withdrawableFeesOf(bob) == 0

    # Put 30 Cash in
    feePot.depositFees(30)

    # Alice owed 40
    assert feePot.withdrawableFeesOf(alice) == 40

    # Bob owed 20
    assert feePot.withdrawableFeesOf(bob) == 20

    # Alice redeems and gets 40 Cash and 0 REP
    with TokenDelta(reputationToken, 0, alice, "Alice got REP back for redeeming incorrectly"):
        with TokenDelta(cash, 40, alice, "Alice didnt get fees"):
            feePot.redeem(sender=alice)

    # Alice owed 0
    assert feePot.withdrawableFeesOf(alice) == 0

    # Bob owed 20
    assert feePot.withdrawableFeesOf(bob) == 20

    # Bob transfers 1 REP to Alice
    feePot.transfer(alice, 1, sender=bob)

    # Alice owed 0
    assert feePot.withdrawableFeesOf(alice) == 0

    # Bob owed 20
    assert feePot.withdrawableFeesOf(bob) == 20

    # Put in 90
    feePot.depositFees(90)

    # Alice owed 60
    assert feePot.withdrawableFeesOf(alice) == 60

    # Bob owed 50
    assert feePot.withdrawableFeesOf(bob) == 50

    # Bob exits and gets 30 Cash and 1 REP
    with TokenDelta(reputationToken, 1, bob, "Bob didn't get back REP"):
        with TokenDelta(cash, 50, bob, "Bob didnt get fees"):
            feePot.exit(1, sender=bob)

    # Alice owed 60
    assert feePot.withdrawableFeesOf(alice) == 60

    # Bob owed 0
    assert feePot.withdrawableFeesOf(bob) == 0

def test_fee_pot_double_transfer(contractsFixture, universe, reputationToken, cash):
    if not contractsFixture.paraAugur:
        return

    feePot = contractsFixture.getFeePot(universe)

    bob = contractsFixture.accounts[0]
    alice = contractsFixture.accounts[1]

    reputationToken.faucet(100, sender=bob)
    reputationToken.faucet(100, sender=alice)

    cash.faucet(10000)
    cash.approve(feePot.address, 10000000000000000)

    reputationToken.approve(feePot.address, 10000000000000000, sender=bob)
    reputationToken.approve(feePot.address, 10000000000000000, sender=alice)

    # Alice puts in 1 REP
    feePot.stake(1, sender=alice)

    # Bob puts in 3 REP
    feePot.stake(3, sender=bob)

    # Nothing owed yet
    assert feePot.withdrawableFeesOf(alice) == 0
    assert feePot.withdrawableFeesOf(bob) == 0

    # Put 100 Cash in
    feePot.depositFees(100)

    # Alice owed 25
    assert feePot.withdrawableFeesOf(alice) == 25

    # Bob owed 75
    assert feePot.withdrawableFeesOf(bob) == 75

    # Bob transfers 1 REP to Alice
    feePot.transfer(alice, 1, sender=bob)

    # Alice owed 25
    assert feePot.withdrawableFeesOf(alice) == 25

    # Bob owed 75
    assert feePot.withdrawableFeesOf(bob) == 75

    # Bob transfers 1 REP to Alice again
    feePot.transfer(alice, 1, sender=bob)

    # Alice owed 25
    assert feePot.withdrawableFeesOf(alice) == 25

    # Bob owed 75
    assert feePot.withdrawableFeesOf(bob) == 75

    # Put 100 Cash in
    feePot.depositFees(100)

    # Alice owed 100
    assert feePot.withdrawableFeesOf(alice) == 100

    # Bob owed 100
    assert feePot.withdrawableFeesOf(bob) == 100


def test_fee_pot_double_stake(contractsFixture, universe, reputationToken, cash):
    if not contractsFixture.paraAugur:
        return

    feePot = contractsFixture.getFeePot(universe)

    bob = contractsFixture.accounts[0]
    alice = contractsFixture.accounts[1]

    reputationToken.faucet(100, sender=bob)
    reputationToken.faucet(100, sender=alice)

    cash.faucet(10000)
    cash.approve(feePot.address, 10000000000000000)

    reputationToken.approve(feePot.address, 10000000000000000, sender=bob)
    reputationToken.approve(feePot.address, 10000000000000000, sender=alice)

    # Alice puts in 1 REP
    feePot.stake(1, sender=alice)

    # Bob puts in 2 REP
    feePot.stake(2, sender=bob)

    # Alice puts in 1 REP again
    feePot.stake(1, sender=alice)

    # Nothing owed yet
    assert feePot.withdrawableFeesOf(alice) == 0
    assert feePot.withdrawableFeesOf(bob) == 0

    # Put 100 Cash in
    feePot.depositFees(100)

    # Alice owed 50
    assert feePot.withdrawableFeesOf(alice) == 50

    # Bob owed 50
    assert feePot.withdrawableFeesOf(bob) == 50

def test_fee_pot_exit_partial(contractsFixture, universe, reputationToken, cash):
    if not contractsFixture.paraAugur:
        return

    feePot = contractsFixture.getFeePot(universe)

    bob = contractsFixture.accounts[0]
    alice = contractsFixture.accounts[1]

    reputationToken.faucet(100, sender=bob)
    reputationToken.faucet(100, sender=alice)

    cash.faucet(10000)
    cash.approve(feePot.address, 10000000000000000)

    reputationToken.approve(feePot.address, 10000000000000000, sender=bob)
    reputationToken.approve(feePot.address, 10000000000000000, sender=alice)

    # Alice puts in 1 REP
    feePot.stake(1, sender=alice)

    # Bob puts in 2 REP
    feePot.stake(2, sender=bob)

    # Nothing owed yet
    assert feePot.withdrawableFeesOf(alice) == 0
    assert feePot.withdrawableFeesOf(bob) == 0

    # Put 90 Cash in
    feePot.depositFees(90)

    # Alice owed 30
    assert feePot.withdrawableFeesOf(alice) == 30

    # Bob owed 60
    assert feePot.withdrawableFeesOf(bob) == 60

    # Bob partial exits and gets 60 Cash and 1 REP
    with TokenDelta(reputationToken, 1, bob, "Bob didn't get back REP"):
        with TokenDelta(cash, 60, bob, "Bob didnt get fees"):
            feePot.exit(1, sender=bob)

    # Alice owed 30
    assert feePot.withdrawableFeesOf(alice) == 30

    # Bob owed 0
    assert feePot.withdrawableFeesOf(bob) == 0

    # Put 100 Cash in
    feePot.depositFees(100)

    # Alice owed 80
    assert feePot.withdrawableFeesOf(alice) == 80

    # Bob owed 50
    assert feePot.withdrawableFeesOf(bob) == 50