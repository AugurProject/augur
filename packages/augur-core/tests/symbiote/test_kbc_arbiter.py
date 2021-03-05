from datetime import timedelta
from eth_tester.exceptions import TransactionFailed
from pytest import raises, mark, fixture
from utils import stringToBytes, AssertLog, EtherDelta, TokenDelta, nullAddress
from reporting_utils import proceedToDesignatedReporting

def test_kbc_arbiter_happy_path(contractsFixture, universe, reputationToken):
    hatchery, arbiter = setupSymbiote(contractsFixture, universe)

    assert hatchery.getInitialized() == True

    creatorAccount = contractsFixture.accounts[4]
    account1 = contractsFixture.accounts[0]
    cash = contractsFixture.contracts['ParaAugurCash']

    endTime = contractsFixture.contracts["Time"].getTimestamp() + timedelta(days=1).total_seconds()
    creatorFee = 1 * 10**16
    reporterFee = 1 * 10**14
    outcomeSymbols = ["ONE", "TWO"]
    outcomeNames = ["One", "Two"]
    numTicks = 1000
    prices = [0, 10**18]
    extraInfo = ""

    # Arbiter configuration is provided as arbitrary bytes that get abi decoded into the arbtier specific config format for that arbiter.
    duration = 3600 * 3
    responseDuration = 3600
    threshold = 1000 * 10**18
    marketType = 1 # Categorical
    arbiterConfig = arbiter.encodeConfiguration(duration, responseDuration, threshold, endTime, extraInfo, prices, marketType)
    test = arbiter.decodeConfiguration(arbiterConfig)

    symbioteId = hatchery.createSymbiote(creatorFee, outcomeSymbols, outcomeNames, numTicks, arbiter.address, arbiterConfig, sender=creatorAccount)

    # mint complete sets
    numSets = 100
    cost = numSets * numTicks
    cash.faucet(cost, sender=account1)
    cash.approve(hatchery.address, 10**40, sender=account1)
    with TokenDelta(cash, -cost, account1, "Minting sets didnt take cash"):
        assert hatchery.mintCompleteSets(symbioteId, 100, account1, sender=account1)

    (invalidShareTokenAddress, oneShareTokenAddress, twoShareTokenAddress) = hatchery.getShareTokens(symbioteId)

    invalidShareToken = contractsFixture.applySignature('Cash', invalidShareTokenAddress)
    oneShareToken = contractsFixture.applySignature('Cash', oneShareTokenAddress)
    twoShareToken = contractsFixture.applySignature('Cash', twoShareTokenAddress)

    assert invalidShareToken.balanceOf(account1) == oneShareToken.balanceOf(account1) == twoShareToken.balanceOf(account1) == numSets

    # Trigger the KBC dispute time
    disputeStartTime = arbiter.symbioteData(symbioteId)[0]
    contractsFixture.eth_tester.time_travel(disputeStartTime + 1)

    # Dispute three payouts
    account2 = contractsFixture.accounts[1]
    account3 = contractsFixture.accounts[2]

    amount1 = 1000
    amount2 = 2000
    amount3 = 1500

    payout1 = [0, 2, numTicks - 2]
    payout2 = [0, numTicks - 2, 2]
    payout3 = [numTicks, 0, 0]

    reputationToken.approve(arbiter.address, 100000000000000000, sender=account1)
    reputationToken.approve(arbiter.address, 100000000000000000, sender=account2)
    reputationToken.approve(arbiter.address, 100000000000000000, sender=account3)

    reputationToken.transfer(account2, 1000000)
    reputationToken.transfer(account3, 1000000)

    arbiter.stake(symbioteId, payout1, amount1, sender=account1)
    assert arbiter.symbioteData(symbioteId)[7] == arbiter.getPayoutHash(payout1)

    # Move time closer to end to see response durtion applied
    disputeEndTime = arbiter.symbioteData(symbioteId)[1]
    contractsFixture.eth_tester.time_travel(disputeEndTime - 60)

    arbiter.stake(symbioteId, payout2, amount2, sender=account2)
    assert arbiter.symbioteData(symbioteId)[7] == arbiter.getPayoutHash(payout2)

    curTime = contractsFixture.eth_tester.backend.chain.header.timestamp
    timeLeft = arbiter.symbioteData(symbioteId)[1] - curTime
    assert abs(responseDuration - timeLeft) < 60

    arbiter.stake(symbioteId, payout3, amount3, sender=account3)
    assert arbiter.symbioteData(symbioteId)[7] == arbiter.getPayoutHash(payout2)

    # Move time to end
    disputeEndTime = arbiter.symbioteData(symbioteId)[1]
    contractsFixture.eth_tester.time_travel(disputeEndTime + 1)

    with raises(TransactionFailed):
        arbiter.stake(symbioteId, payout3, amount3, sender=account3)

    with TokenDelta(reputationToken, 0, account1, "Loser got REP"):
        arbiter.withdraw(symbioteId, sender=account1)

    with TokenDelta(reputationToken, 0, account3, "Loser got REP"):
        arbiter.withdraw(symbioteId, sender=account3)

    expectedWinnings = amount1 + amount2 + amount3
    with TokenDelta(reputationToken, expectedWinnings, account2, "Withdraw did not give winner REP"):
        arbiter.withdraw(symbioteId, sender=account2)

def test_kbc_arbiter_augur_fallback(contractsFixture, universe, reputationToken):
    hatchery, arbiter = setupSymbiote(contractsFixture, universe)

    assert hatchery.getInitialized() == True

    creatorAccount = contractsFixture.accounts[4]
    account1 = contractsFixture.accounts[0]
    cash = contractsFixture.contracts['ParaAugurCash']

    endTime = contractsFixture.contracts["Time"].getTimestamp() + timedelta(days=1).total_seconds()
    creatorFee = 1 * 10**16
    reporterFee = 1 * 10**14
    outcomeSymbols = ["ONE", "TWO"]
    outcomeNames = ["One", "Two"]
    numTicks = 1000
    prices = [0, 10**18]
    extraInfo = ""

    # Arbiter configuration is provided as arbitrary bytes that get abi decoded into the arbtier specific config format for that arbiter.
    duration = 3600 * 3
    responseDuration = 3600
    threshold = 1000 * 10**18
    marketType = 1 # Categorical
    arbiterConfig = arbiter.encodeConfiguration(duration, responseDuration, threshold, endTime, extraInfo, prices, marketType)
    test = arbiter.decodeConfiguration(arbiterConfig)

    symbioteId = hatchery.createSymbiote(creatorFee, outcomeSymbols, outcomeNames, numTicks, arbiter.address, arbiterConfig, sender=creatorAccount)

    # mint complete sets
    numSets = 100
    cost = numSets * numTicks
    cash.faucet(cost, sender=account1)
    cash.approve(hatchery.address, 10**40, sender=account1)
    with TokenDelta(cash, -cost, account1, "Minting sets didnt take cash"):
        assert hatchery.mintCompleteSets(symbioteId, 100, account1, sender=account1)

    (invalidShareTokenAddress, oneShareTokenAddress, twoShareTokenAddress) = hatchery.getShareTokens(symbioteId)

    invalidShareToken = contractsFixture.applySignature('Cash', invalidShareTokenAddress)
    oneShareToken = contractsFixture.applySignature('Cash', oneShareTokenAddress)
    twoShareToken = contractsFixture.applySignature('Cash', twoShareTokenAddress)

    assert invalidShareToken.balanceOf(account1) == oneShareToken.balanceOf(account1) == twoShareToken.balanceOf(account1) == numSets

    # Trigger the KBC dispute time
    disputeStartTime = arbiter.symbioteData(symbioteId)[0]
    contractsFixture.eth_tester.time_travel(disputeStartTime + 1)

    # Dispute 2 payouts with the second hitting the threshold
    account2 = contractsFixture.accounts[1]

    amount1 = 1000
    amount2 = threshold

    payout1 = [0, 0, numTicks]
    payout2 = [0, numTicks, 0]

    reputationToken.approve(arbiter.address, amount1, sender=account1)
    reputationToken.approve(arbiter.address, amount2, sender=account2)

    reputationToken.transfer(account1, amount1)
    reputationToken.transfer(account2, amount2)

    arbiter.stake(symbioteId, payout1, amount1, sender=account1)

    # We cant initiate the Augur fallback yet
    with raises(TransactionFailed):
        arbiter.initateAugurResolution(symbioteId)

    arbiter.stake(symbioteId, payout2, amount2, sender=account2)

    # We canot stake after threshold hit
    with raises(TransactionFailed):
        arbiter.stake(symbioteId, payout1, amount1, sender=account1)

    validityBond = 100 * 10**18
    coreCash = contractsFixture.applySignature('Cash', arbiter.cash())
    coreCash.faucet(validityBond)
    coreCash.approve(arbiter.address, validityBond)
    reputationToken.approve(arbiter.address, 100 * 10**18)
    arbiter.initateAugurResolution(symbioteId)

    # Initial Report
    market = contractsFixture.applySignature('Market', arbiter.symbioteData(symbioteId)[9])
    contractsFixture.eth_tester.time_travel(market.getEndTime() + 1)
    time = contractsFixture.contracts["Time"]
    time.setTimestamp(market.getEndTime() + 1)
    repBond = market.repBond()
    arbiter.doInitialReportInFallback(symbioteId, payout2, 0, sender=account2)

    # ContributeToTentative
    arbiter.contributeToTentativeInFallback(symbioteId, payout2, threshold - repBond, sender=account2)
    crowdsourcer = contractsFixture.applySignature('Cash', market.preemptiveDisputeCrowdsourcer())
    assert crowdsourcer.balanceOf(account2) == crowdsourcer.totalSupply()

    # Contribute
    arbiter.contributeInFallback(symbioteId, payout1, amount1, sender=account1)
    crowdsourcer = contractsFixture.applySignature('Cash', market.crowdsourcers(arbiter.getPayoutHash(payout2)))
    assert crowdsourcer.balanceOf(account1) == crowdsourcer.totalSupply()

    # Payout 2 is still winning because of a tenative bond
    assert market.getWinningPayoutNumerator(2) == payout2[2]

    # Resolve
    curTime = contractsFixture.eth_tester.backend.chain.header.timestamp
    days = 14 * 24 * 3600
    contractsFixture.eth_tester.time_travel(curTime + days)
    time = contractsFixture.contracts["Time"]
    time.setTimestamp(curTime + days)

    with raises(TransactionFailed):
        arbiter.getSymbioteResolution(symbioteId)

    market.finalize()

    assert arbiter.getSymbioteResolution(symbioteId) == payout2


def setupSymbiote(fixture, universe):
    # upload hatchery
    hatchery = fixture.upload("../src/contracts/symbiote/SymbioteHatchery.sol")
    # upload share token factory
    shareTokenFactory = fixture.upload("../src/contracts/symbiote/SymbioteShareTokenFactory.sol")
    # upload KBC Arbiter
    kbcArbiter = fixture.upload("../src/contracts/symbiote/KBCArbiter.sol")

    # init contracts
    paraAugur = fixture.contracts["ParaAugur"]
    paraUniverse = paraAugur.getParaUniverse(universe.address)
    assert hatchery.initialize(paraUniverse, shareTokenFactory.address)
    assert shareTokenFactory.initialize(hatchery.address)
    assert kbcArbiter.initialize(hatchery.address)
    return hatchery, kbcArbiter