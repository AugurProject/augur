#!/usr/bin/env python

from utils import longTo32Bytes, longToHexString, fix, AssertLog, stringToBytes, EtherDelta, PrintGasUsed, BuyWithCash, nullAddress
from constants import ASK, BID, YES, NO

def test_correct_order_for_same_price(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)
    nullOrder = longTo32Bytes(0)

    assert orders.getBestOrderId(BID, market.address, 1, nullAddress) == nullOrder
    with BuyWithCash(cash, fix('1', '31'), contractsFixture.accounts[1], "create order 1"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(1), 31, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', '30'), contractsFixture.accounts[1], "create order 2"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(1), 30, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('2', '30'), contractsFixture.accounts[1], "create order 3"):
        orderID3 = createOrder.publicCreateOrder(BID, fix(2), 30, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('3', '30'), contractsFixture.accounts[1], "create order 4"):
        orderID4 = createOrder.publicCreateOrder(BID, fix(3), 30, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', '29'), contractsFixture.accounts[1], "create order 5"):
        orderID5 = createOrder.publicCreateOrder(BID, fix(1), 29, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('4', '30'), contractsFixture.accounts[1], "create order 6"):
        orderID6 = createOrder.publicCreateOrder(BID, fix(4), 30, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    assert orders.getWorseOrderId(orderID1) == orderID2
    assert orders.getWorseOrderId(orderID2) == orderID3
    assert orders.getWorseOrderId(orderID3) == orderID4
    assert orders.getWorseOrderId(orderID4) == orderID6
    assert orders.getWorseOrderId(orderID6) == orderID5
    assert orders.getWorseOrderId(orderID5) == longTo32Bytes(0)
    assert orders.getBetterOrderId(orderID2) == orderID1
    assert orders.getBetterOrderId(orderID3) == orderID2
    assert orders.getBetterOrderId(orderID4) == orderID3
    assert orders.getBetterOrderId(orderID5) == orderID6
    assert orders.getBetterOrderId(orderID6) == orderID4
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)

def test_no_orphans_when_same_price(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)
    nullOrder = longTo32Bytes(0)

    # create orders
    assert orders.getBestOrderId(BID, market.address, 1, nullAddress) == nullOrder
    with BuyWithCash(cash, fix('1', '31'), contractsFixture.accounts[1], "create order 1"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(1), 31, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', '30'), contractsFixture.accounts[1], "create order 2"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(1), 30, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('2', '30'), contractsFixture.accounts[1], "create order 3"):
        orderID3 = createOrder.publicCreateOrder(BID, fix(2), 30, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('3', '30'), contractsFixture.accounts[1], "create order 4"):
        orderID4 = createOrder.publicCreateOrder(BID, fix(3), 30, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    assert orders.getWorseOrderId(orderID1) == orderID2
    assert orders.getWorseOrderId(orderID2) == orderID3
    assert orders.getWorseOrderId(orderID3) == orderID4
    assert orders.getWorseOrderId(orderID4) == longTo32Bytes(0)
    assert orders.getBetterOrderId(orderID2) == orderID1
    assert orders.getBetterOrderId(orderID3) == orderID2
    assert orders.getBetterOrderId(orderID4) == orderID3
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
