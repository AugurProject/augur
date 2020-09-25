from eth_tester.exceptions import TransactionFailed
from utils import captureFilteredLogs, AssertLog, nullAddress, TokenDelta, PrintGasUsed
from pytest import raises, mark

pytestmark = mark.skip(reason="We might not even need governance and currently dont account for transfering ownership")

def test_gov(contractsFixture, universe, reputationToken, cash):
    if not contractsFixture.paraAugur:
        return

    nexus = contractsFixture.contracts["OINexus"]

    deployer = contractsFixture.accounts[0]
    bob = contractsFixture.accounts[1]
    alice = contractsFixture.accounts[2]

    reputationToken.faucet(100, sender=bob)
    reputationToken.faucet(100, sender=alice)

    feePot = contractsFixture.getFeePot(universe)

    cash.faucet(10000)
    cash.approve(feePot.address, 10000000000000000)

    reputationToken.approve(feePot.address, 10000000000000000, sender=bob)
    reputationToken.approve(feePot.address, 10000000000000000, sender=alice)

    rewardsToken = contractsFixture.upload('../src/contracts/Cash.sol', "rewardsToken")
    lpToken = contractsFixture.upload('../src/contracts/Cash.sol', "lpToken")

    # Deploy GOV token
    govToken = contractsFixture.upload("../src/contracts/gov/GovToken.sol", constructorArgs=[deployer])

    # Deploy Timelock
    timelock = contractsFixture.upload("../src/contracts/gov/Timelock.sol", constructorArgs=[deployer])

    # Deploy a FeePotStakingContract for S_REP (Fee Pot Tokens)
    feePotStakingContract = contractsFixture.upload("../src/contracts/gov/FeePotStakingRewards.sol", constructorArgs=[deployer, deployer, govToken.address, feePot.address])
    initialSupply = 11 * 10**6 * 10**18
    govToken.setMintAllowance(feePotStakingContract.address, initialSupply)
    feePotStakingContract.notifyRewardAmount(initialSupply)

    # Deploy Governance
    governance = contractsFixture.upload("../src/contracts/gov/Governance.sol", constructorArgs=[timelock.address, govToken.address])

    # Cede control of Timelock to Governance
    timelock.setAdmin(governance.address)

    # Cede control of GOV Token to Governance
    govToken.transferOwnership(timelock.address)

    # Cede control of OINexus to Governance
    nexus.transferOwnership(timelock.address)

    # Cede control of FeePotStakingContract to Governance
    feePotStakingContract.setRewardsDistribution(timelock.address)
    feePotStakingContract.transferOwnership(timelock.address)

    # Get S_REP
    feePot.stake(1, sender=alice)

    # Stake
    feePot.approve(feePotStakingContract.address, 100, sender=alice)
    feePotStakingContract.stake(1, sender=alice)

    # Move time
    timestamp = contractsFixture.eth_tester.backend.chain.header.timestamp
    contractsFixture.eth_tester.time_travel(int(timestamp + 24 * 60 * 60))

    # Redeem
    feePotStakingContract.exit(sender=alice)

    totalSupply = govToken.totalSupply()
    assert governance.quorumVotes() - (totalSupply / 25) == 0
    assert governance.proposalThreshold() - (totalSupply / 1000) == 0
    assert govToken.balanceOf(alice) == totalSupply

    target = govToken.address
    signature = ""
    calldata = govToken.mint_encode(bob, 100)

    # Delegate votes to self and propose to mint GOV and fail due to time constraint
    govToken.delegate(alice, sender=alice)
    with raises(TransactionFailed):
        governance.propose([target], [0], [signature], [calldata], "Give Bob the Monies", sender=alice)

    # Move time forward
    timestamp = contractsFixture.eth_tester.backend.chain.header.timestamp
    contractsFixture.eth_tester.time_travel(int(timestamp + 24 * 60 * 60 * 7))

    # Propose to mint GOV to Bob
    proposalId = governance.propose([target], [0], [signature], [calldata], "Give Bob the Monies", sender=alice)

    # Vote it into effect
    contractsFixture.eth_tester.backend.chain.mine_block()
    governance.castVote(proposalId, True, sender=alice)

    # Queue the proposal
    timestamp = contractsFixture.eth_tester.backend.chain.header.timestamp
    contractsFixture.eth_tester.time_travel(int(timestamp + 24 * 60 * 60 * 3))
    governance.queue(proposalId)

    # Execute the proposal
    timestamp = contractsFixture.eth_tester.backend.chain.header.timestamp
    contractsFixture.eth_tester.time_travel(int(timestamp + 24 * 60 * 60 * 2))
    governance.execute(proposalId)

    assert govToken.balanceOf(bob) == 100
