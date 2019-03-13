#!/usr/bin/env python

from ethereum.tools import tester
from ethereum.tools.tester import TransactionFailed
from utils import longTo32Bytes, longToHexString, bytesToHexString, fix, AssertLog, stringToBytes, EtherDelta, PrintGasUsed, BuyWithCash, TokenDelta, nullAddress
from constants import ASK, BID, YES, NO, LONG, SHORT
from pytest import raises, mark


def test_orders_set_order_price_all_tokens(contractsFixture, market, cash):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']
    nullOrder = longTo32Bytes(0)
    tradeGroupID = "42"

    # create order
    with BuyWithCash(cash, fix('10', '5000'), tester.k0, "create order"):
        orderId = createOrder.publicCreateOrder(BID, fix(10), 5000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress)

    assert orders.getAmount(orderId) == fix('10')
    assert orders.getPrice(orderId) == 5000
    assert orders.getOrderCreator(orderId) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderId) == fix('10', '5000')
    assert orders.getOrderSharesEscrowed(orderId) == 0

    # Change the price to 6000
    # We have to provide the extra tokens required by the increase in our BID
    with raises(TransactionFailed):
        orders.setOrderPrice(orderId, 6000, nullOrder, nullOrder)

    with BuyWithCash(cash, fix('10', '1000'), tester.k0, "set order price higher"):
        assert orders.setOrderPrice(orderId, 6000, nullOrder, nullOrder)

    # See that the order price and money escrowed has changed
    assert orders.getAmount(orderId) == fix('10')
    assert orders.getPrice(orderId) == 6000
    assert orders.getOrderCreator(orderId) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderId) == fix('10', '6000')
    assert orders.getOrderSharesEscrowed(orderId) == 0

    # Now if we set the price lower again to 5000 we'll receive a refund for the difference
    with TokenDelta(cash, fix(10, 1000), tester.a0, "Did not recieve a refund for lowering order price"):
        assert orders.setOrderPrice(orderId, 5000, nullOrder, nullOrder)

    # See that the order price and money escrowed has changed
    assert orders.getAmount(orderId) == fix('10')
    assert orders.getPrice(orderId) == 5000
    assert orders.getOrderCreator(orderId) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderId) == fix('10', '5000')
    assert orders.getOrderSharesEscrowed(orderId) == 0

def test_orders_set_order_price_all_shares(contractsFixture, market, cash):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']
    completeSets = contractsFixture.contracts['CompleteSets']
    nullOrder = longTo32Bytes(0)
    tradeGroupID = "42"

    # create order using only shares
    with BuyWithCash(cash, fix('10', '10000'), tester.k0, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(10))

    orderId = createOrder.publicCreateOrder(ASK, fix(10), 5000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress)

    assert orders.getAmount(orderId) == fix('10')
    assert orders.getPrice(orderId) == 5000
    assert orders.getOrderCreator(orderId) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderId) == 0
    assert orders.getOrderSharesEscrowed(orderId) == fix(10)

    # Change the price to 6000
    # We don't need to provide any additional tokens since we're covering this order entirely with shares
    assert orders.setOrderPrice(orderId, 6000, nullOrder, nullOrder)

    # See that the order price has changed and the money escrowed has not changed
    assert orders.getAmount(orderId) == fix('10')
    assert orders.getPrice(orderId) == 6000
    assert orders.getOrderCreator(orderId) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderId) == 0
    assert orders.getOrderSharesEscrowed(orderId) == fix(10)

def test_orders_set_order_price_partial_shares(contractsFixture, market, cash):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']
    completeSets = contractsFixture.contracts['CompleteSets']
    nullOrder = longTo32Bytes(0)
    tradeGroupID = "42"

    # create order using partial shares along with tokens escrowed
    with BuyWithCash(cash, fix('5', '10000'), tester.k0, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(5))

    with BuyWithCash(cash, fix('5', '5000'), tester.k0, "create order"):
        orderId = createOrder.publicCreateOrder(ASK, fix(10), 5000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress)

    assert orders.getAmount(orderId) == fix('10')
    assert orders.getPrice(orderId) == 5000
    assert orders.getOrderCreator(orderId) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderId) == fix('5', '5000')
    assert orders.getOrderSharesEscrowed(orderId) == fix(5)

    # Change the price to 4000
    # We have to provide the extra tokens required by the decrease in our ASK
    with raises(TransactionFailed):
        orders.setOrderPrice(orderId, 4000, nullOrder, nullOrder)

    with BuyWithCash(cash, fix('5', '1000'), tester.k0, "set order price higher"):
        assert orders.setOrderPrice(orderId, 4000, nullOrder, nullOrder)

    # See that the order price and money escrowed has changed
    assert orders.getAmount(orderId) == fix('10')
    assert orders.getPrice(orderId) == 4000
    assert orders.getOrderCreator(orderId) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderId) == fix('5', '6000')
    assert orders.getOrderSharesEscrowed(orderId) == fix(5)
