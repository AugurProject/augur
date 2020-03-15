#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture as pytest_fixture
from utils import stringToBytes, AssertLog, PrintGasUsed


def test_eth_exchange(localFixture, augur, cash, ethExchange):
    account = localFixture.accounts[0]

    # Add liquidity to suggest the price is 1 ETH = 100 Cash
    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    addLiquidity(localFixture, ethExchange, cash, cashAmount, ethAmount, account)

    # Now we can buy ETH
    cashAmount = 10 * 10**18 # Trade 10 DAI for ~.1 ETH
    expectedEthAmount = 10**17
    assert roughlyEqual(ethExchange.getTokenPurchaseCost(expectedEthAmount), cashAmount, 2 * 10**17)
    initialETH = localFixture.ethBalance(account)
    buyEth(localFixture, ethExchange, cash, cashAmount, account)
    assert roughlyEqual(initialETH + expectedEthAmount, localFixture.ethBalance(account))

    # Buy Dai
    ethAmount = 1 * 10**17 # Trade .1 ETH for ~10 DAI
    initialCash = cash.balanceOf(account)
    sellEth(localFixture, ethExchange, ethAmount, account)
    assert roughlyEqual(initialCash + 10**19, cash.balanceOf(account), 10**17)

    # Confirm that our estimate functions match
    cashAmount = ethExchange.getTokenPurchaseCost(ethAmount)
    assert ethExchange.getCashSaleProceeds(cashAmount) == ethAmount


def addLiquidity(fixture, exchange, cash, cashAmount, ethAmount, address):
    cash.faucet(cashAmount)
    cash.transfer(exchange.address, cashAmount)
    fixture.sendEth(address, exchange.address, ethAmount)
    assert exchange.getTokenBalance() == ethAmount
    exchange.publicMint(address)

def buyEth(fixture, exchange, cash, cashAmount, address):
    cash.faucet(cashAmount)
    with PrintGasUsed(fixture, "Transfer Cash"):
        cash.transfer(exchange.address, cashAmount)
    with PrintGasUsed(fixture, "Buy ETH"):
        exchange.buyToken(address)

def sellEth(fixture, exchange, ethAmount, address):
    fixture.sendEth(address, exchange.address, ethAmount)
    exchange.sellToken(address)

def roughlyEqual(amount1, amount2, tolerance=10**16):
    return abs(amount1 - amount2) < tolerance

@pytest_fixture(scope="session")
def localSnapshot(fixture, augurInitializedSnapshot):
    fixture.resetToSnapshot(augurInitializedSnapshot)
    return augurInitializedSnapshot

@pytest_fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@pytest_fixture
def augur(localFixture, localSnapshot):
    return localFixture.contracts["Augur"]

@pytest_fixture
def ethExchange(localFixture, localSnapshot):
    return localFixture.contracts["EthExchange"]
