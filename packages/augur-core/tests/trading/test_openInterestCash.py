#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, mark
from utils import fix, AssertLog, nullAddress, TokenDelta
from reporting_utils import proceedToFork, finalize
from constants import YES, NO

def getOpenInterestCashAddress(contractsFixture, universe):
    if contractsFixture.paraAugur:
        paraAugur = contractsFixture.contracts["ParaAugur"]
        universe = contractsFixture.applySignature("ParaUniverse", paraAugur.getParaUniverse(universe.address))
    return universe.openInterestCash()

def test_openInterestCash(contractsFixture, augur, universe, cash, market):
    constants = contractsFixture.contracts["Constants"]
    openInterestCashAddress = getOpenInterestCashAddress(contractsFixture, universe)
    openInterestCash = contractsFixture.applySignature("OICash", openInterestCashAddress)

    account1 = contractsFixture.accounts[0]
    account2 = contractsFixture.accounts[1]

    assert openInterestCash.totalSupply() == 0
    assert openInterestCash.balanceOf(account1) == 0

    initialUniverseTotalBalance = 0 if contractsFixture.paraAugur else universe.totalBalance()

    with raises(TransactionFailed):
        openInterestCash.deposit(1, sender=account2)

    depositAmount = 10 * 10**18
    assert cash.faucet(depositAmount)

    with TokenDelta(cash, -depositAmount, account1):
        assert openInterestCash.deposit(depositAmount)

    OIUniverse = universe
    if contractsFixture.paraAugur:
        paraAugur = contractsFixture.contracts["ParaAugur"]
        OIUniverse = contractsFixture.applySignature("ParaUniverse", paraAugur.getParaUniverse(universe.address))

    assert OIUniverse.totalBalance() == depositAmount + initialUniverseTotalBalance
    assert OIUniverse.marketBalance(nullAddress) == depositAmount
    assert OIUniverse.getTargetRepMarketCapInAttoCash() == depositAmount * constants.TARGET_REP_MARKET_CAP_MULTIPLIER()
    assert openInterestCash.totalSupply() == depositAmount

    with raises(TransactionFailed):
        openInterestCash.withdraw(1, sender=account2)

    with raises(TransactionFailed):
        openInterestCash.withdraw(depositAmount + 1)

    reportingFeeDivisor = OIUniverse.getOrCacheReportingFeeDivisor()
    disputeWindowAddress = universe.getOrCreateNextDisputeWindow(False)

    expectedFees = depositAmount / reportingFeeDivisor
    expectedPayout = depositAmount - expectedFees

    originalAccountBalance = cash.balanceOf(account1)
    originalWindowBalance = 0 if contractsFixture.paraAugur else cash.balanceOf(disputeWindowAddress)

    assert openInterestCash.withdraw(depositAmount)

    newAccountBalance = cash.balanceOf(account1)
    if contractsFixture.paraAugur:
        newWindowBalance = cash.balanceOf(OIUniverse.getFeePot())
    else:
        newWindowBalance = cash.balanceOf(disputeWindowAddress)

    assert newAccountBalance == originalAccountBalance + expectedPayout
    assert newWindowBalance == originalWindowBalance + expectedFees

    assert OIUniverse.totalBalance() == initialUniverseTotalBalance
    assert OIUniverse.marketBalance(nullAddress) == 0
    assert OIUniverse.getTargetRepMarketCapInAttoCash() == 0
    assert openInterestCash.totalSupply() == 0

def test_openInterestCash_payFees(contractsFixture, augur, universe, cash, market):
    openInterestCashAddress = getOpenInterestCashAddress(contractsFixture, universe)
    openInterestCash = contractsFixture.applySignature("OICash", openInterestCashAddress)

    account1 = contractsFixture.accounts[0]
    account2 = contractsFixture.accounts[1]

    depositAmount = 10 * 10**18
    assert cash.faucet(depositAmount)
    assert cash.faucet(depositAmount, sender=account2)

    with TokenDelta(cash, -depositAmount, account1):
        assert openInterestCash.deposit(depositAmount)

    with TokenDelta(cash, -depositAmount, account2):
        assert openInterestCash.deposit(depositAmount, sender=account2)

    reportingFeeDivisor = universe.getOrCacheReportingFeeDivisor()
    feeAddress = universe.getOrCreateNextDisputeWindow(False)
    if contractsFixture.paraAugur:
        paraAugur = contractsFixture.contracts["ParaAugur"]
        OIUniverse = contractsFixture.applySignature("ParaUniverse", paraAugur.getParaUniverse(universe.address))
        feeAddress = OIUniverse.getFeePot()

    halfDepositFees = depositAmount / reportingFeeDivisor / 2

    # We'll have account 2 pay half of the deposit amount fee balance
    with TokenDelta(cash, halfDepositFees, feeAddress):
        assert openInterestCash.payFees(halfDepositFees, sender=account2)

    feesPaid = openInterestCash.feesPaid()
    assert feesPaid == halfDepositFees

    # On withdraw account 1 will only have to pay half of the amount owed
    expectedFees = depositAmount / reportingFeeDivisor / 2
    expectedPayout = depositAmount - expectedFees
    with TokenDelta(cash, expectedPayout, account1):
        with TokenDelta(cash, expectedFees, feeAddress):
            assert openInterestCash.withdraw(depositAmount)

def test_completeSets(contractsFixture, augur, universe, cash, market):
    shareToken = contractsFixture.getShareToken()
    openInterestCashAddress = getOpenInterestCashAddress(contractsFixture, universe)
    openInterestCash = contractsFixture.applySignature("OICash", openInterestCashAddress)

    account1 = contractsFixture.accounts[0]

    depositAmount = 10 * 10**18
    assert cash.faucet(depositAmount)

    with TokenDelta(cash, -depositAmount, account1):
        assert openInterestCash.deposit(depositAmount)

    # Now that OI Cash has been deposited we can choose to use it to buy complete sets rather than taking the money out and paying fees
    numCompleteSets = 10**14
    initialFeesPaid = openInterestCash.feesPaid()
    assert openInterestCash.buyCompleteSets(market.address, numCompleteSets)

    for i in range(0, 3):
        assert shareToken.balanceOfMarketOutcome(market.address, i, account1) == numCompleteSets

    assert openInterestCash.feesPaid() == initialFeesPaid

def test_completeSets_fork(contractsFixture, augur, universe, cash, market, scalarMarket):
    if not contractsFixture.paraAugur:
        return

    shareToken = contractsFixture.getShareToken()
    openInterestCashAddress = getOpenInterestCashAddress(contractsFixture, universe)
    openInterestCash = contractsFixture.applySignature("ParaOICash", openInterestCashAddress)

    account1 = contractsFixture.accounts[0]

    depositAmount = 10 * 10**18
    assert cash.faucet(depositAmount)

    with TokenDelta(cash, -depositAmount, account1):
        assert openInterestCash.deposit(depositAmount)

    # Now we'll cause a fork and migrate the market
    paraAugur = contractsFixture.contracts["ParaAugur"]
    proceedToFork(contractsFixture, scalarMarket, universe)
    finalize(contractsFixture, scalarMarket, universe, True)
    market.migrateThroughOneFork([0,0,market.getNumTicks()], "")
    paraAugur.generateParaUniverse(market.getUniverse())

    # We are still able to purchase complete sets in a child universe's market
    numCompleteSets = 10**14
    initialFeesPaid = openInterestCash.feesPaid()
    assert openInterestCash.buyCompleteSets(market.address, numCompleteSets)

    for i in range(0, 3):
        assert shareToken.balanceOfMarketOutcome(market.address, i, account1) == numCompleteSets

    assert openInterestCash.feesPaid() == initialFeesPaid