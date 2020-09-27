#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from utils import longTo32Bytes, longToHexString, fix, AssertLog, stringToBytes, EtherDelta, PrintGasUsed, BuyWithCash, TokenDelta, nullAddress
from constants import ASK, BID, YES, NO, LONG, SHORT
from pytest import raises, mark
from decimal import Decimal

def test_simple_simulate(contractsFixture, cash, market, universe):
    trade = contractsFixture.contracts["Trade"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]

    direction = LONG
    outcome = YES
    amount = fix(1)
    price = 400
    ignoreShares = False
    fillOnly = False

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateTrade(direction, market.address, outcome, amount, price, fillOnly)

    assert sharesFilled == 0
    assert tokensDepleted == amount * price
    assert sharesDepleted == 0
    assert settlementFees == 0
    assert numFills == 0

def test_simple_trades_and_fees(contractsFixture, cash, market, universe):
    trade = contractsFixture.contracts["Trade"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    account1 = contractsFixture.accounts[1]

    direction = LONG
    outcome = YES
    amount = fix(1)
    price = 400
    fillOnly = False
    numTicks = market.getNumTicks()
    cost = amount * price

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateTrade(direction, market.address, outcome, amount, price, fillOnly)

    assert sharesFilled == 0
    assert tokensDepleted == cost
    assert sharesDepleted == 0
    assert settlementFees == 0
    assert numFills == 0

    cash.faucet(cost)
    assert trade.publicTrade(direction, market.address, outcome, amount, price, "0", "0", "42", 6, longTo32Bytes(11))

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateTrade(SHORT, market.address, outcome, amount, price, fillOnly, sender=account1)

    fillPrice = numTicks - price
    cost = amount * fillPrice
    assert sharesFilled == amount
    assert tokensDepleted == cost
    assert sharesDepleted == 0
    assert settlementFees == 0
    assert numFills == 1

    cash.faucet(cost, sender=account1)
    assert trade.publicTrade(SHORT, market.address, outcome, amount, price, "0", "0", "42", 6, longTo32Bytes(11), sender=account1)

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateTrade(SHORT, market.address, outcome, amount, price, fillOnly)

    assert sharesFilled == 0
    assert tokensDepleted == 0
    assert sharesDepleted == fix(1)
    assert settlementFees == 0
    assert numFills == 0

    assert trade.publicTrade(SHORT, market.address, outcome, amount, price, "0", "0", "42", 6, longTo32Bytes(11))

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateTrade(LONG, market.address, outcome, amount, price, fillOnly, sender=account1)
    assert simulateTrade.getNumberOfAvaialableShares(LONG, market.address, outcome, account1) == fix(1)

    expectedValue = fix(1) * (numTicks - price)
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees

    assert sharesFilled == fix(1)
    assert tokensDepleted == 0
    assert sharesDepleted == fix(1)
    assert settlementFees == expectedSettlementFees
    assert numFills == 1

def test_partial_fill(contractsFixture, cash, market, universe):
    outcome = YES
    amount = fix(1)
    price = 400
    fillOnly = False

    account1 = contractsFixture.accounts[1]

    simulate_then_trade(contractsFixture, LONG, market, outcome, amount, price, fillOnly, sender=account1)
    simulate_then_trade(contractsFixture, SHORT, market, outcome, amount / 2, price, fillOnly)

def test_multiple_trades(contractsFixture, cash, market, universe):
    outcome = YES
    amount = fix(1)
    fillOnly = False
    account1 = contractsFixture.accounts[1]
    numOrders = 10

    for i in range(numOrders):
        simulate_then_trade(contractsFixture, SHORT, market, outcome, amount, i + 1, fillOnly, sender=account1)

    simulate_then_trade(contractsFixture, LONG, market, outcome, fix(numOrders - 0.5), numOrders + 10, fillOnly)

def test_self_trade(contractsFixture, cash, market, universe):
    outcome = YES
    amount = fix(1)
    price = 400
    fillOnly = False

    simulate_then_trade(contractsFixture, LONG, market, outcome, amount, price, fillOnly)
    simulate_then_trade(contractsFixture, SHORT, market, outcome, amount, price, fillOnly)

def test_fill_only(contractsFixture, cash, market, universe):
    outcome = YES
    amount = fix(1)
    price = 400

    account1 = contractsFixture.accounts[1]

    simulate_then_trade(contractsFixture, LONG, market, outcome, amount, price, False, sender=account1)
    simulate_then_trade(contractsFixture, SHORT, market, outcome, amount + fix(1), price, True)

def test_fees(contractsFixture, cash, market, universe):
    outcome = YES
    amount = fix(1)
    price = 400
    fillOnly = False

    account1 = contractsFixture.accounts[1]

    expectedValue = fix(1) * (market.getNumTicks() - price)
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees

    simulate_then_trade(contractsFixture, LONG, market, outcome, amount, price, fillOnly, sender=account1)
    simulate_then_trade(contractsFixture, SHORT, market, outcome, amount, price, fillOnly)
    simulate_then_trade(contractsFixture, SHORT, market, outcome, amount, price, fillOnly, sender=account1)
    simulate_then_trade(contractsFixture, LONG, market, outcome, amount, price, fillOnly, expectedFees=expectedSettlementFees)

def test_use_shares_multiple(contractsFixture, cash, market, universe):
    outcome = YES
    amount = fix(1)
    price = 400
    fillOnly = False

    account1 = contractsFixture.accounts[1]
    account2 = contractsFixture.accounts[2]
    
    simulate_then_trade(contractsFixture, LONG, market, outcome, amount, price, False, sender=account1)
    simulate_then_trade(contractsFixture, SHORT, market, outcome, amount + fix(1), price, True)

    simulate_then_trade(contractsFixture, LONG, market, outcome, amount, price, False, sender=account2)
    simulate_then_trade(contractsFixture, SHORT, market, outcome, amount * 2, price, False, sender=account1)

def simulate_then_trade(contractsFixture, direction, market, outcome, amount, price, fillOnly, sender=None, expectedFees=0):
    trade = contractsFixture.contracts["Trade"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    shareToken = contractsFixture.contracts["ShareToken"]
    cash = contractsFixture.contracts["Cash"]
    sender = sender if sender is not None else contractsFixture.accounts[0]
    shareTokenOutcome = outcome if direction == SHORT else ((outcome + 1) % 3)

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateTrade(direction, market.address, outcome, amount, price, fillOnly, sender=sender)

    cash.faucet(tokensDepleted, sender=sender)
    initialCashBalance = cash.balanceOf(sender)
    initialShareBalance = shareToken.balanceOfMarketOutcome(market.address, shareTokenOutcome, sender)

    if fillOnly:
        orderId = trade.publicFillBestOrder(direction, market.address, outcome, amount, price, "42", 10, longTo32Bytes(11), sender=sender)
    else:
        orderId = trade.publicTrade(direction, market.address, outcome, amount, price, "0", "0", "42", 10, longTo32Bytes(11), sender=sender)

    if (tokensDepleted > 0):
        assert tokensDepleted == initialCashBalance - cash.balanceOf(sender)
    if (sharesDepleted > 0):
        assert sharesDepleted == initialShareBalance - shareToken.balanceOfMarketOutcome(market.address, shareTokenOutcome, sender)

    expectedSharesFilled = 0
    expectedNumFills = 0
    orderEventLogs = contractsFixture.contracts["AugurTrading"].getLogs("OrderEvent")
    for log in orderEventLogs:
        if log.args.eventType == 2: # Fill Event
            expectedSharesFilled += log.args.uint256Data[6]
            expectedNumFills += 1

    assert sharesFilled == expectedSharesFilled
    assert settlementFees == expectedFees
    assert numFills == expectedNumFills
    return orderId