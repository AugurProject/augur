#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from utils import longTo32Bytes, longToHexString, fix, AssertLog, stringToBytes, EtherDelta, PrintGasUsed, BuyWithCash, TokenDelta, nullAddress
from constants import ASK, BID, YES, NO, LONG, SHORT
from pytest import raises, mark
from reporting_utils import proceedToNextRound
from decimal import Decimal

@mark.parametrize('withSelf', [
    True,
    False
])
def test_one_bid_on_books_buy_full_order(withSelf, contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    sender = contractsFixture.accounts[2] if withSelf else contractsFixture.accounts[1]
    with BuyWithCash(cash, fix('2', '60'), sender, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = sender)

    # fill best order
    orderEventLog = {
	    "eventType": 2,
	    "addressData": [nullAddress, contractsFixture.accounts[2] if withSelf else contractsFixture.accounts[1] , contractsFixture.accounts[2]],
	    "uint256Data": [60, 0, YES, 0, 0, 0, fix(2),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    with BuyWithCash(cash, fix('2', '40'), contractsFixture.accounts[2], "fill order"):
        with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
            assert trade.publicTrade(SHORT,market.address, YES, fix(2), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender=contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

@mark.parametrize('afterMkrShutdown', [
    True,
    False
])
def test_one_bid_on_books_buy_partial_order(afterMkrShutdown, contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    if (afterMkrShutdown):
        contractsFixture.MKRShutdown()

    # create order
    with BuyWithCash(cash, fix('2', '60'), contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    fillOrderID = None
    orderEventLog = {
	    "eventType": 2,
	    "addressData": [nullAddress, contractsFixture.accounts[1], contractsFixture.accounts[2]],
	    "uint256Data": [60, fix(1), YES, 0, 0, 0, fix(1),  contractsFixture.contracts['Time'].getTimestamp(), 0, fix(1, 60)],
    }
    with BuyWithCash(cash, fix('1', '40'), contractsFixture.accounts[2], "trade"):
        with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
            with PrintGasUsed(contractsFixture, "publicTrade", 0):
                fillOrderID = trade.publicTrade(1, market.address, YES, fix(1), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 60
    assert orders.getOrderCreator(orderID) == contractsFixture.accounts[1]
    assert orders.getOrderMoneyEscrowed(orderID) == fix('1', '60')
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert fillOrderID == longTo32Bytes(1)

def test_one_bid_on_books_buy_partial_order_fill_loop_limit(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    with BuyWithCash(cash, fix('2', '60'), contractsFixture.accounts[1], "trade 1"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    orderEventLog = {
	    "eventType": 2,
	    "addressData": [nullAddress, contractsFixture.accounts[1], contractsFixture.accounts[2]],
	    "uint256Data": [60, fix(1), YES, 0, 0, 0, fix(1),  contractsFixture.contracts['Time'].getTimestamp(), 0, fix(1, 60)],
    }
    with BuyWithCash(cash, fix('1', '40'), contractsFixture.accounts[2], "trade 2"):
        with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
            with PrintGasUsed(contractsFixture, "publicTrade", 0):
                fillOrderID = trade.publicTrade(1, market.address, YES, fix(1), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender=contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 60
    assert orders.getOrderCreator(orderID) == contractsFixture.accounts[1]
    assert orders.getOrderMoneyEscrowed(orderID) == fix('1', '60')
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert fillOrderID == longTo32Bytes(1)

def test_one_bid_on_books_buy_excess_order(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    with BuyWithCash(cash, fix('4', '60'), contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(4), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    orderFilledEventLog = {
	    "eventType": 2,
	    "addressData": [nullAddress, contractsFixture.accounts[1], contractsFixture.accounts[2]],
	    "uint256Data": [60, 0, YES, 0, 0, 0, fix(4),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orderCreatedEventLog = {
        "eventType": 0,
	    "addressData": [nullAddress, contractsFixture.accounts[2], nullAddress],
	    "uint256Data": [60, fix(1), YES, 0, 0, 0, 0,  contractsFixture.contracts['Time'].getTimestamp(), 0, fix(1, 40)],
    }
    with AssertLog(contractsFixture, "OrderEvent", orderFilledEventLog):
        with AssertLog(contractsFixture, "OrderEvent", orderCreatedEventLog, skip=1):
            with BuyWithCash(cash, fix('5', '40'), contractsFixture.accounts[2], "trade"):
                fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(5), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender=contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(1)
    assert orders.getPrice(fillOrderID) == 60
    assert orders.getOrderCreator(fillOrderID) == contractsFixture.accounts[2]
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('1', '40')
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

def test_two_bids_on_books_buy_both(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order 1
    with BuyWithCash(cash, fix('4', '60'), contractsFixture.accounts[1], "create order"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(4), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    # create order 2
    with BuyWithCash(cash, fix('1', '60'), contractsFixture.accounts[3], "create order"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(1), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[3])

    # fill best order
    with PrintGasUsed(contractsFixture, "Fill two", 0):
        with BuyWithCash(cash, fix('5', '40'), contractsFixture.accounts[2], "fill best orders"):
            fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(5), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == 0
    assert orders.getPrice(orderID2) == 0
    assert orders.getOrderCreator(orderID2) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID2) == 0
    assert orders.getOrderSharesEscrowed(orderID2) == 0
    assert orders.getBetterOrderId(orderID2) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID2) == longTo32Bytes(0)

    assert fillOrderID == longTo32Bytes(1)

def test_two_bids_on_books_buy_one_with_limit(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    with BuyWithCash(cash, fix('4', '60'), contractsFixture.accounts[1], "create order 1"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(4), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', '60'), contractsFixture.accounts[3], "create order 2"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(1), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[3])

    # fill best order
    with PrintGasUsed(contractsFixture, "Fill two", 0):
        with BuyWithCash(cash, fix('4', '40'), contractsFixture.accounts[2], "buy complete set"):
            fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(5), 60, "0", "0", tradeGroupID, 1, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == fix(1)

    # We dont create an order since an existing match is on the books
    assert fillOrderID == longTo32Bytes(1)

def test_two_bids_on_books_buy_full_and_partial(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order 1
    with BuyWithCash(cash, fix('12', '60'), contractsFixture.accounts[1], "create order"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(12), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    # create order 2
    with BuyWithCash(cash, fix('7', '60'), contractsFixture.accounts[3], "create order"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(7), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[3])

    # fill best order
    with BuyWithCash(cash, fix('15', '40'), contractsFixture.accounts[2], "trade"):
        fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(15), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == fix(4)
    assert orders.getPrice(orderID2) == 60
    assert orders.getOrderCreator(orderID2) == contractsFixture.accounts[3]
    assert orders.getOrderMoneyEscrowed(orderID2) == fix('4', '60')
    assert orders.getOrderSharesEscrowed(orderID2) == 0
    assert orders.getBetterOrderId(orderID2) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID2) == longTo32Bytes(0)

    assert fillOrderID == longTo32Bytes(1)

def test_two_bids_on_books_buy_one_full_then_create(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order 1
    with BuyWithCash(cash, fix('12', '60'), contractsFixture.accounts[1], "create order"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(12), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    # create order 2
    with BuyWithCash(cash, fix('7', '50'), contractsFixture.accounts[3], "create order"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(7), 50, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[3])

    # fill/create
    with PrintGasUsed(contractsFixture, "buy one and create", 0):
        with BuyWithCash(cash, fix('15', '40'), contractsFixture.accounts[2], "trade"):
            fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(15), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == fix(7)
    assert orders.getPrice(orderID2) == 50
    assert orders.getOrderCreator(orderID2) == contractsFixture.accounts[3]
    assert orders.getOrderMoneyEscrowed(orderID2) == fix('7', '50')
    assert orders.getOrderSharesEscrowed(orderID2) == 0
    assert orders.getBetterOrderId(orderID2) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID2) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(3)
    assert orders.getPrice(fillOrderID) == 60
    assert orders.getOrderCreator(fillOrderID) == contractsFixture.accounts[2]
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('3', '40')
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

def test_one_ask_on_books_buy_full_order(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    with BuyWithCash(cash, fix('12', '40'), contractsFixture.accounts[1], "buy complete set"):
        orderID = createOrder.publicCreateOrder(ASK, fix(12), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    with BuyWithCash(cash, fix('12', '60'), contractsFixture.accounts[2], "buy complete set"):
        fillOrderID = trade.publicTrade(LONG, market.address, YES, fix(12), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert fillOrderID == longTo32Bytes(1)

def test_one_ask_on_books_buy_partial_order(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    with BuyWithCash(cash, fix('12', '40'), contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(12), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    with BuyWithCash(cash, fix('7', '60'), contractsFixture.accounts[2], "fill best order"):
        fillOrderID = trade.publicTrade(LONG, market.address, YES, fix(7), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == fix(5)
    assert orders.getPrice(orderID) == 60
    assert orders.getOrderCreator(orderID) == contractsFixture.accounts[1]
    assert orders.getOrderMoneyEscrowed(orderID) == fix('5', '40')
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    assert fillOrderID == longTo32Bytes(1)

def test_one_ask_on_books_buy_excess_order(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    with BuyWithCash(cash, fix('12', '40'), contractsFixture.accounts[1], "buy complete set"):
        orderID = createOrder.publicCreateOrder(ASK, fix(12), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    with BuyWithCash(cash, fix('15', '60'), contractsFixture.accounts[2], "buy complete set"):
        fillOrderID = trade.publicTrade(LONG,market.address, YES, fix(15), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(3)
    assert orders.getPrice(fillOrderID) == 60
    assert orders.getOrderCreator(fillOrderID) == contractsFixture.accounts[2]
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('3', '60')
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

def test_two_asks_on_books_buy_both(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order 1
    with BuyWithCash(cash, fix('12', '40'), contractsFixture.accounts[1], "buy complete set"):
        orderID1 = createOrder.publicCreateOrder(ASK, fix(12), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    # create order 2
    with BuyWithCash(cash, fix('3', '40'), contractsFixture.accounts[3], "buy complete set"):
        orderID2 = createOrder.publicCreateOrder(ASK, fix(3), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[3])

    # fill best order
    with BuyWithCash(cash, fix('15', '60'), contractsFixture.accounts[2], "buy complete set"):
        fillOrderID = trade.publicTrade(LONG,market.address, YES, fix(15), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == 0
    assert orders.getPrice(orderID2) == 0
    assert orders.getOrderCreator(orderID2) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID2) == 0
    assert orders.getOrderSharesEscrowed(orderID2) == 0
    assert orders.getBetterOrderId(orderID2) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID2) == longTo32Bytes(0)
    assert fillOrderID == longTo32Bytes(1)

def test_two_asks_on_books_buy_full_and_partial(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order 1
    with BuyWithCash(cash, fix('12', '40'), contractsFixture.accounts[1], "buy complete set"):
        orderID1 = createOrder.publicCreateOrder(ASK, fix(12), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    # create order
    with BuyWithCash(cash, fix('7', '40'), contractsFixture.accounts[3], "buy complete set"):
        orderID2 = createOrder.publicCreateOrder(ASK, fix(7), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[3])

    # fill best order
    with BuyWithCash(cash, fix('15', '60'), contractsFixture.accounts[2], "buy complete set"):
        fillOrderID = trade.publicTrade(LONG,market.address, YES, fix(15), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == fix(4)
    assert orders.getPrice(orderID2) == 60
    assert orders.getOrderCreator(orderID2) == contractsFixture.accounts[3]
    assert orders.getOrderMoneyEscrowed(orderID2) == fix('4', '40')
    assert orders.getOrderSharesEscrowed(orderID2) == 0
    assert orders.getBetterOrderId(orderID2) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID2) == longTo32Bytes(0)

    assert fillOrderID == longTo32Bytes(1)

def test_two_asks_on_books_buy_one_full_then_create(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order 1
    with BuyWithCash(cash, fix('12', '40'), contractsFixture.accounts[1], "create order"):
        orderID1 = createOrder.publicCreateOrder(ASK, fix(12), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    # create order 2
    with BuyWithCash(cash, fix('7', '30'), contractsFixture.accounts[3], "create order"):
        orderID2 = createOrder.publicCreateOrder(ASK, fix(7), 70, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[3])

    # fill/create
    with BuyWithCash(cash, fix('15', '60'), contractsFixture.accounts[2], "fill and create order"):
        fillOrderID = trade.publicTrade(LONG,market.address, YES, fix(15), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[2])

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == fix(7)
    assert orders.getPrice(orderID2) == 70
    assert orders.getOrderCreator(orderID2) == contractsFixture.accounts[3]
    assert orders.getOrderMoneyEscrowed(orderID2) == fix('7', '30')
    assert orders.getOrderSharesEscrowed(orderID2) == 0
    assert orders.getBetterOrderId(orderID2) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID2) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(3)
    assert orders.getPrice(fillOrderID) == 60
    assert orders.getOrderCreator(fillOrderID) == contractsFixture.accounts[2]
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('3', '60')
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

def test_take_best_order(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']

    # create order with cash
    with BuyWithCash(cash, fix('1', '40'), contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(1), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])
    assert orderID

    # fill order with cash using on-chain matcher
    with BuyWithCash(cash, fix('1', '60'), contractsFixture.accounts[2], "fill best order"):
        assert trade.publicFillBestOrder(BID, market.address, YES, fix(1), 60, "43", 6, longTo32Bytes(11), nullAddress, sender=contractsFixture.accounts[2]) == 0

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

def test_take_best_order_multiple_orders(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']

    # create orders with cash
    orderIDs = []
    numOrders = 5
    for i in range(numOrders):
        with BuyWithCash(cash, fix('1', 40 - i), contractsFixture.accounts[1], "create order"):
            orderID = createOrder.publicCreateOrder(ASK, fix(1), 60 + i, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])
        assert orderID
        orderIDs.append(orderID)

    # fill orders with cash using on-chain matcher
    price = 60 + numOrders
    with PrintGasUsed(contractsFixture, "fill multiple asks", 0):
        # Fills across orders of differing prices, give it some eth to play with
        assert cash.faucet(fix(numOrders, price), sender=contractsFixture.accounts[1])
        assert trade.publicFillBestOrder(BID, market.address, YES, fix(numOrders), price, "43", 6, longTo32Bytes(11), nullAddress, sender=contractsFixture.accounts[1]) == 0

    for i in range(numOrders):
        orderID = orderIDs[i]
        assert orders.getAmount(orderID) == 0
        assert orders.getPrice(orderID) == 0
        assert orders.getOrderCreator(orderID) == longToHexString(0)
        assert orders.getOrderMoneyEscrowed(orderID) == 0
        assert orders.getOrderSharesEscrowed(orderID) == 0
        assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
        assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

@mark.parametrize('withSelf', [
    True,
    False
])
def test_take_best_order_with_shares_escrowed_buy_with_cash(withSelf, contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    shareToken = contractsFixture.contracts['ShareToken']
    shareToken = contractsFixture.contracts["ShareToken"]

    # buy complete sets
    sender = contractsFixture.accounts[2] if withSelf else contractsFixture.accounts[1]
    account = contractsFixture.accounts[2] if withSelf else contractsFixture.accounts[1]
    with BuyWithCash(cash, fix('1', '100'), sender, "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=sender)
    assert shareToken.balanceOfMarketOutcome(market.address, 0, account) == fix(1)

    # create order with shares
    orderID = createOrder.publicCreateOrder(ASK, fix(1), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=sender)
    assert orderID

    # fill order with cash using on-chain matcher
    with PrintGasUsed(contractsFixture, "buy shares escrowed order", 0):
        with BuyWithCash(cash, fix('1', '60'), contractsFixture.accounts[2], "fill best order"):
            assert trade.publicFillBestOrder(BID, market.address, YES, fix(1), 60, "43", 6, longTo32Bytes(11), nullAddress, sender=contractsFixture.accounts[2]) == 0

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

def test_take_best_order_with_shares_escrowed_buy_with_shares_categorical(contractsFixture, cash, categoricalMarket, universe):
    market = categoricalMarket
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    shareToken = contractsFixture.contracts['ShareToken']
    shareToken = contractsFixture.contracts["ShareToken"]

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[2], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[2])

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[2]) == fix(1)

    # create order with shares
    orderID = createOrder.publicCreateOrder(ASK, fix(1), 60, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])
    assert orderID

    # fill order with shares using on-chain matcher
    totalProceeds = fix(1, numTicks)
    totalProceeds -= fix(1, numTicks) / market.getMarketCreatorSettlementFeeDivisor()
    totalProceeds -= fix(1, numTicks) / universe.getOrCacheReportingFeeDivisor()
    expectedTester1Payout = totalProceeds * 60 / numTicks
    expectedTester2Payout = totalProceeds * (numTicks - 60) / numTicks
    with TokenDelta(cash, expectedTester1Payout, contractsFixture.accounts[1], "Tester 1 ETH delta wrong"):
        with PrintGasUsed(contractsFixture, "categoricalFill", 0):
            assert trade.publicFillBestOrder(BID, market.address, 0, fix(1), 60, "43", 6, longTo32Bytes(11), nullAddress, sender=contractsFixture.accounts[2]) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[1]) == fix(1)

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 2, contractsFixture.accounts[2]) == 0

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

def test_trade_with_self(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    orderID = None
    # create order
    with BuyWithCash(cash, fix('4', '60'), contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(4), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    orderFilledEventLog = {
	    "eventType": 2,
	    "addressData": [nullAddress, contractsFixture.accounts[1], contractsFixture.accounts[1]],
	    "uint256Data": [60, 0, YES, 0, 0, 0, fix(4),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orderCreatedEventLog = {
	    "eventType": 0,
	    "addressData": [nullAddress, contractsFixture.accounts[1], nullAddress],
	    "uint256Data": [60, fix(1), YES, 0, 0, 0, 0,  contractsFixture.contracts['Time'].getTimestamp(), 0, fix(1, 40)],
    }
    with BuyWithCash(cash, fix('5', '40'), contractsFixture.accounts[1], "trade"):
        with AssertLog(contractsFixture, "OrderEvent", orderFilledEventLog):
            with AssertLog(contractsFixture, "OrderEvent", orderCreatedEventLog, skip=1):
                fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(5), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[1])

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(1)
    assert orders.getPrice(fillOrderID) == 60
    assert orders.getOrderCreator(fillOrderID) == contractsFixture.accounts[1]
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix(1, 40)
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

def test_trade_with_self_take_order_make_order(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    createCost = fix('0.003', '60')
    with BuyWithCash(cash, createCost, contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix('0.003'), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order
    takeCost = fix('1', '50')
    with BuyWithCash(cash, takeCost, contractsFixture.accounts[1], "publicTrade"):
        fillOrderID = trade.publicTrade(BID, market.address, YES, fix(1), 50, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress, sender = contractsFixture.accounts[1])

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    orderAmount = fix(1) - fix('0.003')
    assert orders.getAmount(fillOrderID) == orderAmount
    assert orders.getPrice(fillOrderID) == 50
    assert orders.getOrderCreator(fillOrderID) == contractsFixture.accounts[1]
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('0.997', 50)
    # Note that we never ended up with the original orders shares. The ETH escrowed for those was simply returned to us for this case.
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

@mark.parametrize('isMatch', [
    True,
    False
])
def test_create_order_after_exhausting_book(isMatch, contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create orders
    createCost = fix('1', '60')
    with BuyWithCash(cash, createCost, contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix('1'), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    if isMatch:
        createCost = fix('1', '50')
        with BuyWithCash(cash, createCost, contractsFixture.accounts[1], "create matching order"):
            orderID2 = createOrder.publicCreateOrder(ASK, fix('1'), 50, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])
    else:
        createCost = fix('1', '30')
        with BuyWithCash(cash, createCost, contractsFixture.accounts[1], "create non-matching order"):
            orderID2 = createOrder.publicCreateOrder(ASK, fix('1'), 70, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress, sender = contractsFixture.accounts[1])

    # fill best order, isMatch determines if one of the orders
    takeCost = fix('2', '60')
    with BuyWithCash(cash, takeCost, contractsFixture.accounts[0], "trade"):
        fillOrderID = trade.publicTrade(BID, market.address, YES, fix(2), 60, "0", "0", tradeGroupID, 6, longTo32Bytes(11), nullAddress)

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    if isMatch:
        assert orders.getAmount(orderID2) == 0
        assert orders.getPrice(orderID2) == 0
        assert orders.getOrderCreator(orderID2) == longToHexString(0)
        assert orders.getOrderMoneyEscrowed(orderID2) == 0
        assert orders.getOrderSharesEscrowed(orderID2) == 0
        assert orders.getBetterOrderId(orderID2) == longTo32Bytes(0)
        assert orders.getWorseOrderId(orderID2) == longTo32Bytes(0)
        assert fillOrderID == longTo32Bytes(1)
    else:
        orderAmount = fix(1)
        assert orders.getAmount(orderID2) == fix(1)
        assert orders.getAmount(fillOrderID) == orderAmount
        assert orders.getPrice(fillOrderID) == 60
        assert orders.getOrderCreator(fillOrderID) == contractsFixture.accounts[0]
        assert orders.getOrderMoneyEscrowed(fillOrderID) == fix(60)
        assert orders.getOrderSharesEscrowed(fillOrderID) == 0
        assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
        assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

@mark.parametrize(('finalized', 'invalid'), [
    (True, True),
    (False, True),
    (True, False),
    (False, False),
])
def test_fees_from_trades(finalized, invalid, contractsFixture, cash, market, universe):
    affiliates = contractsFixture.contracts['Affiliates']
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    shareToken = contractsFixture.contracts['ShareToken']
    shareToken = contractsFixture.contracts["ShareToken"]
    fingerprint = longTo32Bytes(11)

    affiliateAddress = contractsFixture.accounts[3]
    affiliates.setReferrer(affiliateAddress, longTo32Bytes(0), sender=contractsFixture.accounts[1])
    affiliates.setReferrer(affiliateAddress, longTo32Bytes(0), sender=contractsFixture.accounts[2])

    if finalized:
        if invalid:
            contractsFixture.contracts["Time"].setTimestamp(market.getDesignatedReportingEndTime() + 1)
            market.doInitialReport([market.getNumTicks(), 0, 0], "", 0)
        else:
            proceedToNextRound(contractsFixture, market)

        disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
        contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
        assert market.finalize()

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[2], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[2])

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == fix(1)


    # create order with shares
    orderID = createOrder.publicCreateOrder(ASK, fix(1), 60, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])
    assert orderID

    expectedAffiliateFees = fix(100) / 400
    sourceKickback = expectedAffiliateFees / 5
    expectedAffiliateFees -= sourceKickback
    cash.faucet(fix(60), sender=contractsFixture.accounts[2])
    # Trade and specify an affiliate address.
    if finalized:
        if invalid:
            nextDisputeWindowAddress = universe.getOrCreateNextDisputeWindow(False)
            totalFees = fix(100) / 50 # Market fees + reporting fees
            totalFees -= sourceKickback
            with TokenDelta(cash, totalFees, nextDisputeWindowAddress, "Dispute Window did not recieve the correct fees"):
                assert trade.publicFillBestOrder(BID, market.address, 0, fix(1), 60, "43", 6, fingerprint, nullAddress, sender=contractsFixture.accounts[2]) == 0
        else:
            with TokenDelta(cash, expectedAffiliateFees, contractsFixture.accounts[3], "Affiliate did not recieve the correct fees"):
                assert trade.publicFillBestOrder(BID, market.address, 0, fix(1), 60, "43", 6, fingerprint, nullAddress, sender=contractsFixture.accounts[2]) == 0
    else:
        assert trade.publicFillBestOrder(BID, market.address, 0, fix(0.5), 60, "43", 6, fingerprint, nullAddress, sender=contractsFixture.accounts[2]) == 0
        assert trade.publicFillBestOrder(BID, market.address, 0, fix(0.5), 60, "43", 6, fingerprint, nullAddress, sender=contractsFixture.accounts[2]) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[1]) == fix(1)

    # The second user sold the complete set they ended up holding from this transaction, which extracts fees
    assert shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[2]) == fix(1)
    assert shareToken.balanceOfMarketOutcome(market.address, 1, contractsFixture.accounts[2]) == 0

    if not finalized:
        # We can confirm that the 3rd test account has an affiliate fee balance of 25% of the market creator fee 1% taken from the 1 ETH order
        assert market.affiliateFeesAttoCash(contractsFixture.accounts[3]) == expectedAffiliateFees

        # The affiliate can withdraw their fees only after the market is finalized as valid
        with raises(TransactionFailed):
            market.withdrawAffiliateFees(contractsFixture.accounts[3])

        if invalid:
            contractsFixture.contracts["Time"].setTimestamp(market.getDesignatedReportingEndTime() + 1)
            market.doInitialReport([market.getNumTicks(), 0, 0], "", 0)
        else:
            proceedToNextRound(contractsFixture, market)

        disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
        contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
        totalCollectedFees = market.marketCreatorFeesAttoCash() + market.totalAffiliateFeesAttoCash() + market.validityBondAttoCash()
        nextDisputeWindowAddress = universe.getOrCreateNextDisputeWindow(False)
        nextDisputeWindowBalanceBeforeFinalization = cash.balanceOf(universe.getOrCreateNextDisputeWindow(False))
        assert market.finalize()

        if invalid:
            with raises(TransactionFailed):
                market.withdrawAffiliateFees(contractsFixture.accounts[3])
            assert cash.balanceOf(universe.getOrCreateNextDisputeWindow(False)) == nextDisputeWindowBalanceBeforeFinalization + totalCollectedFees
        else:
            with TokenDelta(cash, expectedAffiliateFees, contractsFixture.accounts[3], "Affiliate did not recieve the correct fees"):
                market.withdrawAffiliateFees(contractsFixture.accounts[3])

    # No more fees can be withdrawn
    if not invalid:
        with TokenDelta(cash, 0, contractsFixture.accounts[3], "Affiliate double received fees"):
            market.withdrawAffiliateFees(contractsFixture.accounts[3])