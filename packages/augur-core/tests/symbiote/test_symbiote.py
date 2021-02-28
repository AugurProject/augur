from datetime import timedelta
from eth_tester.exceptions import TransactionFailed
from pytest import raises, mark, fixture
from utils import stringToBytes, AssertLog, EtherDelta, TokenDelta, nullAddress
from reporting_utils import proceedToDesignatedReporting

def test_symbiote(contractsFixture, universe):
    hatchery, arbiter = setupSymbiote(contractsFixture, universe)

    assert hatchery.getInitialized() == True

    creatorAccount = contractsFixture.accounts[4]
    account1 = contractsFixture.accounts[0]
    cash = contractsFixture.contracts['ParaAugurCash']

    creatorFee = 1 * 10**16
    reporterFee = 1 * 10**14
    outcomeSymbols = ["ONE", "TWO"]
    outcomeNames = ["One", "Two"]
    numTicks = 1000
    arbiterConfig = ""

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

    # burn some sets
    burnSets = numSets / 2
    payment = burnSets * numTicks
    fees = payment * (creatorFee + reporterFee) / 10**18
    expectedPayout = payment - fees
    with TokenDelta(cash, expectedPayout, account1, "Burning sets didnt give cash"):
        assert hatchery.burnCompleteSets(symbioteId, burnSets, sender=account1)

    assert invalidShareToken.balanceOf(account1) == oneShareToken.balanceOf(account1) == twoShareToken.balanceOf(account1) == numSets - burnSets
    assert cash.balanceOf(hatchery.address) == hatchery.symbiotes(symbioteId)[-1] # creator fees

    # trigger resolution
    invalidPayout = 1
    onePayout = 2
    twoPayout = numTicks - invalidPayout - onePayout
    arbiter.setSymbioteResolution([invalidPayout, onePayout, twoPayout])

    # claim winnings
    account2 = contractsFixture.accounts[1]
    account3 = contractsFixture.accounts[2]

    invalidShareToken.transfer(account1, burnSets)
    oneShareToken.transfer(account2, burnSets)
    twoShareToken.transfer(account3, burnSets)

    payout = invalidPayout * burnSets
    fees = payout * (creatorFee + reporterFee) / 10**18
    expectedPayout = payout - fees
    creatorFees = cash.balanceOf(hatchery.address) + payout * creatorFee / 10 ** 18
    with TokenDelta(cash, creatorFees, hatchery.feePot(), "Claiming an Invalid Market didnt give correct cash to fee pot"):
        with TokenDelta(cash, expectedPayout, account1, "Claiming didnt give correct cash"):
            assert hatchery.claimWinnings(symbioteId, sender=account1)

    payout = onePayout * burnSets
    fees = payout * (creatorFee + reporterFee) / 10**18
    expectedPayout = payout - fees
    with TokenDelta(cash, expectedPayout, account2, "Claiming didnt give correct cash"):
        assert hatchery.claimWinnings(symbioteId, sender=account2)

    payout = twoPayout * burnSets
    fees = payout * (creatorFee + reporterFee) / 10**18
    expectedPayout = payout - fees + 1 # rounding
    with TokenDelta(cash, expectedPayout, account3, "Claiming didnt give correct cash"):
        assert hatchery.claimWinnings(symbioteId, sender=account3)

def setupSymbiote(fixture, universe):
    # upload hatchery
    hatchery = fixture.upload("../src/contracts/symbiote/SymbioteHatchery.sol")
    # upload share token factory
    shareTokenFactory = fixture.upload("../src/contracts/symbiote/SymbioteShareTokenFactory.sol")
    # upload Test Arbiter
    testArbiter = fixture.upload("solidity_test_helpers/TestArbiter.sol")

    # init contracts
    paraAugur = fixture.contracts["ParaAugur"]
    paraUniverse = paraAugur.getParaUniverse(universe.address)
    assert hatchery.initialize(paraUniverse, shareTokenFactory.address)
    assert shareTokenFactory.initialize(hatchery.address)
    return hatchery, testArbiter