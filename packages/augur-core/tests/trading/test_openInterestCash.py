#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, mark
from utils import fix, AssertLog, nullAddress, TokenDelta
from constants import YES, NO

@mark.parametrize('afterMkrShutdown', [
    True,
    False
])
def test_openInterestCash(afterMkrShutdown, contractsFixture, augur, universe, cash, market):
    constants = contractsFixture.contracts["Constants"]
    daiVat = contractsFixture.contracts["DaiVat"]
    openInterestCashAddress = universe.openInterestCash()
    openInterestCash = contractsFixture.applySignature("OICash", openInterestCashAddress)

    if (afterMkrShutdown):
        contractsFixture.MKRShutdown()

    account1 = contractsFixture.accounts[0]
    account2 = contractsFixture.accounts[1]

    assert openInterestCash.totalSupply() == 0
    assert openInterestCash.balanceOf(account1) == 0

    initialUniverseTotalBalance = universe.totalBalance()

    with raises(TransactionFailed):
        openInterestCash.deposit(1, sender=account2)

    depositAmount = 10 * 10**18
    assert cash.faucet(depositAmount)

    with TokenDelta(cash, -depositAmount, account1):
        assert openInterestCash.deposit(depositAmount)

    assert universe.totalBalance() == depositAmount + initialUniverseTotalBalance
    assert universe.marketBalance(nullAddress) == depositAmount
    assert universe.getTargetRepMarketCapInAttoCash() == depositAmount * constants.TARGET_REP_MARKET_CAP_MULTIPLIER()
    assert openInterestCash.totalSupply() == depositAmount

    with raises(TransactionFailed):
        openInterestCash.withdraw(1, sender=account2)

    with raises(TransactionFailed):
        openInterestCash.withdraw(depositAmount + 1)

    reportingFeeDivisor = universe.getOrCacheReportingFeeDivisor()
    disputeWindowAddress = universe.getOrCreateNextDisputeWindow(False)

    expectedFees = depositAmount / reportingFeeDivisor
    expectedPayout = depositAmount - expectedFees

    originalAccountBalance = cash.balanceOf(account1)
    originalWindowBalance = cash.balanceOf(disputeWindowAddress)

    assert openInterestCash.withdraw(depositAmount)

    newAccountBalance = cash.balanceOf(account1) + daiVat.dai(account1) / 10**27
    newWindowBalance = cash.balanceOf(disputeWindowAddress) + daiVat.dai(disputeWindowAddress) / 10**27

    assert newAccountBalance == originalAccountBalance + expectedPayout
    assert newWindowBalance == originalWindowBalance + expectedFees

    assert universe.totalBalance() == initialUniverseTotalBalance
    assert universe.marketBalance(nullAddress) == 0
    assert universe.getTargetRepMarketCapInAttoCash() == 0
    assert openInterestCash.totalSupply() == 0

def test_openInterestCash_payFees(contractsFixture, augur, universe, cash, market):
    openInterestCashAddress = universe.openInterestCash()
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
    disputeWindowAddress = universe.getOrCreateNextDisputeWindow(False)

    halfDepositFees = depositAmount / reportingFeeDivisor / 2

    # We'll have account 2 pay half of the deposit amount fee balance
    with TokenDelta(cash, halfDepositFees, disputeWindowAddress):
        assert openInterestCash.payFees(halfDepositFees, sender=account2)

    feesPaid = openInterestCash.feesPaid()
    assert feesPaid == halfDepositFees

    # On withdraw account 1 will only have to pay half of the amount owed
    expectedFees = depositAmount / reportingFeeDivisor / 2
    expectedPayout = depositAmount - expectedFees
    with TokenDelta(cash, expectedPayout, account1):
        with TokenDelta(cash, expectedFees, disputeWindowAddress):
            assert openInterestCash.withdraw(depositAmount)

def test_completeSets(contractsFixture, augur, universe, cash, market):
    shareToken = contractsFixture.contracts["ShareToken"]
    openInterestCashAddress = universe.openInterestCash()
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