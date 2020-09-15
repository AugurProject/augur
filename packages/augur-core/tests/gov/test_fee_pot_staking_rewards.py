from eth_tester.exceptions import TransactionFailed
from utils import captureFilteredLogs, AssertLog, nullAddress, TokenDelta
from pytest import raises

def test_fee_pot_staking(contractsFixture, universe, reputationToken, cash):
    if not contractsFixture.paraAugur:
        return

    bob = contractsFixture.accounts[0]
    alice = contractsFixture.accounts[1]

    rewardsToken = contractsFixture.upload('../src/contracts/gov/GovToken.sol', "rewardsToken", constructorArgs=[bob])

    feePot = contractsFixture.getFeePot(universe)
    stakingContract = contractsFixture.upload('../src/contracts/gov/FeePotStakingRewards.sol', constructorArgs=[bob, bob, rewardsToken.address, feePot.address])
    rewardSupply = 10**18
    rewardsToken.setMintAllowance(stakingContract.address, rewardSupply)
    stakingContract.notifyRewardAmount(rewardSupply)

    reputationToken.faucet(100, sender=bob)
    reputationToken.faucet(100, sender=alice)

    cash.faucet(10000)
    cash.approve(feePot.address, 10000000000000000)

    reputationToken.approve(feePot.address, 10000000000000000, sender=bob)
    reputationToken.approve(feePot.address, 10000000000000000, sender=alice)

    # Put 10 Cash in fee pot
    feePot.depositFees(10)

    # Alice puts in 1 REP and deposits the token she receives in the staking contract
    feePot.stake(1, sender=alice)
    feePot.approve(stakingContract.address, 100, sender=alice)
    stakingContract.stake(1, sender=alice)
    
    # Nothing owed yet
    assert stakingContract.withdrawableFees(alice) == 0

    # Put 10 Cash in
    feePot.depositFees(10)

    # Alice owed all 20
    assert stakingContract.withdrawableFees(alice) == 20

    # Put 10 Cash in
    feePot.depositFees(10)

    # Alice owed all 30
    assert stakingContract.withdrawableFees(alice) == 30

    # Bob puts in 2 REP
    feePot.stake(2, sender=bob)
    feePot.approve(stakingContract.address, 100, sender=bob)
    stakingContract.stake(2, sender=bob)

    # Alice still owed all 30
    assert stakingContract.withdrawableFees(alice) == 30

    # Bob owed nothing
    assert stakingContract.withdrawableFees(bob) == 0

    # Put 30 Cash in
    feePot.depositFees(30)

    # Alice owed 40
    assert stakingContract.withdrawableFees(alice) == 40

    # Bob owed 20
    assert stakingContract.withdrawableFees(bob) == 20

    # Alice redeems and gets 40 Cash and no S_REP
    with TokenDelta(feePot, 0, alice, "Alice got S_REP back for redeeming fees incorrectly"):
        with TokenDelta(cash, 40, alice, "Alice didnt get fees"):
            stakingContract.getFeeReward(sender=alice)

    # Alice owed 0
    assert stakingContract.withdrawableFees(alice) == 0

    # Bob owed 20
    assert stakingContract.withdrawableFees(bob) == 20

    # Put in 90
    feePot.depositFees(90)

    # Alice owed 30
    assert stakingContract.withdrawableFees(alice) == 30

    # Bob owed 80
    assert stakingContract.withdrawableFees(bob) == 80

    assert stakingContract.earnedFees(bob) == 20

    # Bob exits and gets 80 Cash and 1 S_REP and 1 Reward Token
    timestamp = contractsFixture.eth_tester.backend.chain.header.timestamp
    contractsFixture.eth_tester.time_travel(int(timestamp + 24 * 60 * 60))

    with TokenDelta(feePot, 2, bob, "Bob didn't get back S_REP"):
        with TokenDelta(cash, 80, bob, "Bob didnt get correct fees"):
            with TokenDelta(rewardsToken, 95242504409162237, bob, "Bob didnt get reward tokens"):
                stakingContract.exit(sender=bob)

    # Alice owed 30
    assert stakingContract.withdrawableFees(alice) == 30

    # Bob owed 0
    assert stakingContract.withdrawableFees(bob) == 0

def test_double_stake(contractsFixture, universe, reputationToken, cash):
    if not contractsFixture.paraAugur:
        return

    bob = contractsFixture.accounts[0]
    alice = contractsFixture.accounts[1]

    rewardsToken = contractsFixture.upload('../src/contracts/gov/GovToken.sol', "rewardsToken", constructorArgs=[bob])

    feePot = contractsFixture.getFeePot(universe)
    stakingContract = contractsFixture.upload('../src/contracts/gov/FeePotStakingRewards.sol', constructorArgs=[bob, bob, rewardsToken.address, feePot.address])
    initialSupply = 10**18
    rewardsToken.setMintAllowance(stakingContract.address, initialSupply)
    stakingContract.notifyRewardAmount(initialSupply)

    reputationToken.faucet(100, sender=bob)
    reputationToken.faucet(100, sender=alice)

    cash.faucet(10000)
    cash.approve(feePot.address, 10000000000000000)

    reputationToken.approve(feePot.address, 10000000000000000, sender=bob)
    reputationToken.approve(feePot.address, 10000000000000000, sender=alice)

    feePot.approve(stakingContract.address, 100, sender=alice)
    feePot.approve(stakingContract.address, 100, sender=bob)

    # Alice puts in 1 REP
    feePot.stake(1, sender=alice)
    stakingContract.stake(1, sender=alice)

    # Bob puts in 2 REP
    feePot.stake(2, sender=bob)
    stakingContract.stake(2, sender=bob)

    # Alice puts in 1 REP again
    feePot.stake(1, sender=alice)
    stakingContract.stake(1, sender=alice)

    # Nothing owed yet
    assert stakingContract.withdrawableFees(alice) == 0
    assert stakingContract.withdrawableFees(bob) == 0

    # Put 100 Cash in
    feePot.depositFees(100)

    # Alice owed 50
    assert stakingContract.withdrawableFees(alice) == 50

    # Bob owed 50
    assert stakingContract.withdrawableFees(bob) == 50

def test_exit_partial(contractsFixture, universe, reputationToken, cash):
    if not contractsFixture.paraAugur:
        return

    bob = contractsFixture.accounts[0]
    alice = contractsFixture.accounts[1]

    rewardsToken = contractsFixture.upload('../src/contracts/gov/GovToken.sol', "rewardsToken", constructorArgs=[bob])

    feePot = contractsFixture.getFeePot(universe)
    stakingContract = contractsFixture.upload('../src/contracts/gov/FeePotStakingRewards.sol', constructorArgs=[bob, bob, rewardsToken.address, feePot.address])
    initialSupply = 10**18
    rewardsToken.setMintAllowance(stakingContract.address, initialSupply)
    stakingContract.notifyRewardAmount(initialSupply)

    reputationToken.faucet(100, sender=bob)
    reputationToken.faucet(100, sender=alice)

    cash.faucet(10000)
    cash.approve(feePot.address, 10000000000000000)

    reputationToken.approve(feePot.address, 10000000000000000, sender=bob)
    reputationToken.approve(feePot.address, 10000000000000000, sender=alice)

    feePot.approve(stakingContract.address, 100, sender=alice)
    feePot.approve(stakingContract.address, 100, sender=bob)

    # Alice puts in 1 REP
    feePot.stake(1, sender=alice)
    stakingContract.stake(1, sender=alice)

    # Bob puts in 2 REP
    feePot.stake(2, sender=bob)
    stakingContract.stake(2, sender=bob)

    # Nothing owed yet
    assert stakingContract.withdrawableFees(alice) == 0
    assert stakingContract.withdrawableFees(bob) == 0

    # Put 90 Cash in
    feePot.depositFees(90)

    # Alice owed 30
    assert stakingContract.withdrawableFees(alice) == 30

    # Bob owed 60
    assert stakingContract.withdrawableFees(bob) == 60

    # Bob partial exits and gets 60 Cash and 1 REP
    with TokenDelta(feePot, 1, bob, "Bob didn't get back S_REP"):
        with TokenDelta(cash, 60, bob, "Bob didnt get fees"):
            stakingContract.withdraw(1, sender=bob)

    # Alice owed 30
    assert stakingContract.withdrawableFees(alice) == 30

    # Bob owed 0
    assert stakingContract.withdrawableFees(bob) == 0

    # Put 100 Cash in. This will only increase the staking contracts portion of fees by 66 since 2/3 of the total fee pot supply is owned by it
    feePot.depositFees(100)

    # Alice owed 30 + 33 = 63
    assert stakingContract.withdrawableFees(alice) == 63

    # Bob owed 33
    assert stakingContract.withdrawableFees(bob) == 33