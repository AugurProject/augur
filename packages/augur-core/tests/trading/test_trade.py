#!/usr/bin/env python

from ethereum.tools import tester
from ethereum.tools.tester import TransactionFailed
from utils import longTo32Bytes, longToHexString, bytesToHexString, fix, AssertLog, stringToBytes, EtherDelta, PrintGasUsed, BuyWithCash, TokenDelta, nullAddress
from constants import ASK, BID, YES, NO, LONG, SHORT
from pytest import raises, mark
from reporting_utils import proceedToNextRound

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
    sender = tester.k2 if withSelf else tester.k1
    with BuyWithCash(cash, fix('2', '6000'), sender, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = sender)

    # fill best order
    orderFilledLog = {
        "filler": bytesToHexString(tester.a2),
        "numCreatorShares": 0,
        "numCreatorTokens": fix('2', '6000'),
        "numFillerShares": 0,
        "numFillerTokens": fix('2', '4000'),
        "marketCreatorFees": 0,
        "reporterFees": 0,
        "shareToken": market.getShareToken(YES),
        "tradeGroupId": stringToBytes(longTo32Bytes(42)),
    }
    with BuyWithCash(cash, fix('2', '4000'), tester.k2, "fill order"):
        with AssertLog(contractsFixture, "OrderFilled", orderFilledLog):
            assert trade.publicTrade(SHORT,market.address, YES, fix(2), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender=tester.k2)
            # It is a self-trade, so the other side have ether left in Cash
            if withSelf:
                assert cash.withdrawEther(fix('2', '10000'), sender=tester.k2)

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

def test_one_bid_on_books_buy_partial_order(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    with BuyWithCash(cash, fix('2', '6000'), tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order
    fillOrderID = None
    orderFilledLog = {
        "amountFilled": fix(1),
    }
    with BuyWithCash(cash, fix('1', '4000'), tester.k2, "trade"):
        with AssertLog(contractsFixture, "OrderFilled", orderFilledLog):
            with PrintGasUsed(contractsFixture, "publicTrade", 0):
                fillOrderID = trade.publicTrade(1, market.address, YES, fix(1), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 6000
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(orderID) == fix('1', '6000')
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
    with BuyWithCash(cash, fix('2', '6000'), tester.k1, "trade 1"):
        orderID = createOrder.publicCreateOrder(BID, fix(2), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order
    orderFilledLog = {
        "amountFilled": fix(1),
    }
    with BuyWithCash(cash, fix('1', '4000'), tester.k2, "trade 2"):
        with AssertLog(contractsFixture, "OrderFilled", orderFilledLog):
            with PrintGasUsed(contractsFixture, "publicTrade", 0):
                fillOrderID = trade.publicTrade(1, market.address, YES, fix(1), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender=tester.k2)

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 6000
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(orderID) == fix('1', '6000')
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert fillOrderID == longTo32Bytes(1)

@mark.parametrize('withTotalCost', [
    True,
    False
])
def test_one_bid_on_books_buy_excess_order(withTotalCost, contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    with BuyWithCash(cash, fix('4', '6000'), tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(4), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order
    orderFilledLog = {
        "filler": bytesToHexString(tester.a2),
        "numCreatorShares": 0,
        "numCreatorTokens": fix('4', '6000'),
        "numFillerShares": 0,
        "numFillerTokens": fix('4', '4000'),
        "marketCreatorFees": 0,
        "reporterFees": 0,
        "shareToken": market.getShareToken(YES),
        "tradeGroupId": stringToBytes(longTo32Bytes(42)),
    }
    orderCreatedLog = {
        "creator": bytesToHexString(tester.a2),
        "shareToken": market.getShareToken(YES),
        "tradeGroupId": stringToBytes(longTo32Bytes(42)),
    }
    with AssertLog(contractsFixture, "OrderFilled", orderFilledLog):
        with AssertLog(contractsFixture, "OrderCreated", orderCreatedLog):
            if withTotalCost:
                with BuyWithCash(cash, fix('5', '4000'), tester.k2, "tradeWithTotalCost"):
                    fillOrderID = trade.publicTradeWithTotalCost(SHORT,market.address, YES, fix(5, 6000), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender=tester.k2)
            else:
                with BuyWithCash(cash, fix('5', '4000'), tester.k2, "trade"):
                    fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(5), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender=tester.k2)

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(1)
    assert orders.getPrice(fillOrderID) == 6000
    assert orders.getOrderCreator(fillOrderID) == bytesToHexString(tester.a2)
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('1', '4000')
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

def test_two_bids_on_books_buy_both(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order 1
    with BuyWithCash(cash, fix('4', '6000'), tester.k1, "create order"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(4), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    # create order 2
    with BuyWithCash(cash, fix('1', '6000'), tester.k3, "create order"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(1), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k3)

    # fill best order
    with PrintGasUsed(contractsFixture, "Fill two", 0):
        with BuyWithCash(cash, fix('5', '4000'), tester.k2, "fill best orders"):
            fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(5), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

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

    with BuyWithCash(cash, fix('4', '6000'), tester.k1, "create order 1"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(4), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    with BuyWithCash(cash, fix('1', '6000'), tester.k3, "create order 2"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(1), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k3)

    # fill best order
    with PrintGasUsed(contractsFixture, "Fill two", 0):
        with BuyWithCash(cash, fix('4', '4000'), tester.k2, "buy complete set"):
            fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(5), 6000, "0", "0", tradeGroupID, 1, False, nullAddress, nullAddress, sender = tester.k2)

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
    with BuyWithCash(cash, fix('12', '6000'), tester.k1, "create order"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    # create order 2
    with BuyWithCash(cash, fix('7', '6000'), tester.k3, "create order"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(7), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k3)

    # fill best order
    with BuyWithCash(cash, fix('15', '4000'), tester.k2, "trade"):
        fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(15), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == fix(4)
    assert orders.getPrice(orderID2) == 6000
    assert orders.getOrderCreator(orderID2) == bytesToHexString(tester.a3)
    assert orders.getOrderMoneyEscrowed(orderID2) == fix('4', '6000')
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
    with BuyWithCash(cash, fix('12', '6000'), tester.k1, "create order"):
        orderID1 = createOrder.publicCreateOrder(BID, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    # create order 2
    with BuyWithCash(cash, fix('7', '5000'), tester.k3, "create order"):
        orderID2 = createOrder.publicCreateOrder(BID, fix(7), 5000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k3)

    # fill/create
    with PrintGasUsed(contractsFixture, "buy one and create", 0):
        with BuyWithCash(cash, fix('15', '4000'), tester.k2, "trade"):
            fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(15), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == fix(7)
    assert orders.getPrice(orderID2) == 5000
    assert orders.getOrderCreator(orderID2) == bytesToHexString(tester.a3)
    assert orders.getOrderMoneyEscrowed(orderID2) == fix('7', '5000')
    assert orders.getOrderSharesEscrowed(orderID2) == 0
    assert orders.getBetterOrderId(orderID2) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID2) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(3)
    assert orders.getPrice(fillOrderID) == 6000
    assert orders.getOrderCreator(fillOrderID) == bytesToHexString(tester.a2)
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('3', '4000')
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

@mark.parametrize('withTotalCost', [
    True,
    False
])
def test_one_ask_on_books_buy_full_order(withTotalCost, contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    fillOrder = contractsFixture.contracts['FillOrder']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    with BuyWithCash(cash, fix('12', '4000'), tester.k1, "buy complete set"):
        orderID = createOrder.publicCreateOrder(ASK, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order
    if withTotalCost:
        with BuyWithCash(cash, fix('12', '6000'), tester.k2, "buy complete set"):
            fillOrderID = trade.publicTradeWithTotalCost(LONG, market.address, YES, fix(12, 6000), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)
    else:
        with BuyWithCash(cash, fix('12', '6000'), tester.k2, "buy complete set"):
            fillOrderID = trade.publicTrade(LONG, market.address, YES, fix(12), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

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

    with BuyWithCash(cash, fix('12', '4000'), tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    with BuyWithCash(cash, fix('7', '6000'), tester.k2, "fill best order"):
        fillOrderID = trade.publicTrade(LONG, market.address, YES, fix(7), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

    assert orders.getAmount(orderID) == fix(5)
    assert orders.getPrice(orderID) == 6000
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(orderID) == fix('5', '4000')
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
    with BuyWithCash(cash, fix('12', '4000'), tester.k1, "buy complete set"):
        orderID = createOrder.publicCreateOrder(ASK, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order
    with BuyWithCash(cash, fix('15', '6000'), tester.k2, "buy complete set"):
        fillOrderID = trade.publicTrade(LONG,market.address, YES, fix(15), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(3)
    assert orders.getPrice(fillOrderID) == 6000
    assert orders.getOrderCreator(fillOrderID) == bytesToHexString(tester.a2)
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('3', '6000')
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
    with BuyWithCash(cash, fix('12', '4000'), tester.k1, "buy complete set"):
        orderID1 = createOrder.publicCreateOrder(ASK, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    # create order 2
    with BuyWithCash(cash, fix('3', '4000'), tester.k3, "buy complete set"):
        orderID2 = createOrder.publicCreateOrder(ASK, fix(3), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k3)

    # fill best order
    with BuyWithCash(cash, fix('15', '6000'), tester.k2, "buy complete set"):
        fillOrderID = trade.publicTrade(LONG,market.address, YES, fix(15), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

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
    with BuyWithCash(cash, fix('12', '4000'), tester.k1, "buy complete set"):
        orderID1 = createOrder.publicCreateOrder(ASK, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    # create order
    with BuyWithCash(cash, fix('7', '4000'), tester.k3, "buy complete set"):
        orderID2 = createOrder.publicCreateOrder(ASK, fix(7), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k3)

    # fill best order
    with BuyWithCash(cash, fix('15', '6000'), tester.k2, "buy complete set"):
        fillOrderID = trade.publicTrade(LONG,market.address, YES, fix(15), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == fix(4)
    assert orders.getPrice(orderID2) == 6000
    assert orders.getOrderCreator(orderID2) == bytesToHexString(tester.a3)
    assert orders.getOrderMoneyEscrowed(orderID2) == fix('4', '4000')
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
    with BuyWithCash(cash, fix('12', '4000'), tester.k1, "create order"):
        orderID1 = createOrder.publicCreateOrder(ASK, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    # create order 2
    with BuyWithCash(cash, fix('7', '3000'), tester.k3, "create order"):
        orderID2 = createOrder.publicCreateOrder(ASK, fix(7), 7000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k3)

    # fill/create
    with BuyWithCash(cash, fix('15', '6000'), tester.k2, "fill and create order"):
        fillOrderID = trade.publicTrade(LONG,market.address, YES, fix(15), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k2)

    assert orders.getAmount(orderID1) == 0
    assert orders.getPrice(orderID1) == 0
    assert orders.getOrderCreator(orderID1) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID1) == 0
    assert orders.getOrderSharesEscrowed(orderID1) == 0
    assert orders.getBetterOrderId(orderID1) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID1) == longTo32Bytes(0)

    assert orders.getAmount(orderID2) == fix(7)
    assert orders.getPrice(orderID2) == 7000
    assert orders.getOrderCreator(orderID2) == bytesToHexString(tester.a3)
    assert orders.getOrderMoneyEscrowed(orderID2) == fix('7', '3000')
    assert orders.getOrderSharesEscrowed(orderID2) == 0
    assert orders.getBetterOrderId(orderID2) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID2) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(3)
    assert orders.getPrice(fillOrderID) == 6000
    assert orders.getOrderCreator(fillOrderID) == bytesToHexString(tester.a2)
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('3', '6000')
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

@mark.parametrize('withTotalCost', [
    True,
    False
])
def test_take_best_order(withTotalCost, contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    initialTester1ETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    initialTester2ETH = contractsFixture.chain.head_state.get_balance(tester.a2)

    # create order with cash
    with BuyWithCash(cash, fix('1', '4000'), tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(1), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
    assert orderID

    # fill order with cash using on-chain matcher
    if withTotalCost:
        with BuyWithCash(cash, fix('1', '6000'), tester.k2, "fill best order"):
            assert trade.publicFillBestOrderWithTotalCost(BID, market.address, YES, fix(1, 6000), 6000, "43", 6, False, nullAddress, nullAddress, sender=tester.k2) == 0
    else:
        with BuyWithCash(cash, fix('1', '6000'), tester.k2, "fill best order"):
            assert trade.publicFillBestOrder(BID, market.address, YES, fix(1), 6000, "43", 6, False, nullAddress, nullAddress, sender=tester.k2) == 0

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
        with BuyWithCash(cash, fix('1', 4000 - i), tester.k1, "create order"):
            orderID = createOrder.publicCreateOrder(ASK, fix(1), 6000 + i, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
        assert orderID
        orderIDs.append(orderID)

    # fill orders with cash using on-chain matcher
    price = 6000 + numOrders
    with PrintGasUsed(contractsFixture, "fill multiple asks", 0):
        # Fills across orders of differing prices, give it some eth to play with
        assert cash.depositEther(sender=tester.k1, value=fix(numOrders, price))
        assert trade.publicFillBestOrder(BID, market.address, YES, fix(numOrders), price, "43", 6, False, nullAddress, nullAddress, sender=tester.k1) == 0

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
    completeSets = contractsFixture.contracts['CompleteSets']
    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))

    # buy complete sets
    sender = tester.k2 if withSelf else tester.k1
    account = tester.a2 if withSelf else tester.a1
    with BuyWithCash(cash, fix('1', '10000'), sender, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=sender)
    assert yesShareToken.balanceOf(account) == fix(1)

    # create order with shares
    orderID = createOrder.publicCreateOrder(ASK, fix(1), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=sender)
    assert orderID

    # fill order with cash using on-chain matcher
    with PrintGasUsed(contractsFixture, "buy shares escrowed order", 0):
        with BuyWithCash(cash, fix('1', '6000'), tester.k2, "fill best order"):
            assert trade.publicFillBestOrder(BID, market.address, YES, fix(1), 6000, "43", 6, False, nullAddress, nullAddress, sender=tester.k2) == 0
            if withSelf:
                totalProceeds = fix(1, '10000') + fix('1', '6000')
                totalProceeds -= fix(1, '10000') / market.getMarketCreatorSettlementFeeDivisor()
                totalProceeds -= fix(1, '10000') / universe.getOrCacheReportingFeeDivisor()
                assert cash.withdrawEther(totalProceeds, sender=tester.k2)

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
    completeSets = contractsFixture.contracts['CompleteSets']
    firstShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    secondShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(1))
    thirdShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(2))

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k1)
    with BuyWithCash(cash, fix('1', numTicks), tester.k2, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k2)
    assert firstShareToken.balanceOf(tester.a1) == firstShareToken.balanceOf(tester.a2) == fix(1)
    assert secondShareToken.balanceOf(tester.a1) == secondShareToken.balanceOf(tester.a2) == fix(1)
    assert thirdShareToken.balanceOf(tester.a1) == thirdShareToken.balanceOf(tester.a2) == fix(1)

    # create order with shares
    orderID = createOrder.publicCreateOrder(ASK, fix(1), 6000, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
    assert orderID

    # fill order with shares using on-chain matcher
    totalProceeds = fix(1, numTicks)
    totalProceeds -= fix(1, numTicks) / market.getMarketCreatorSettlementFeeDivisor()
    totalProceeds -= fix(1, numTicks) / universe.getOrCacheReportingFeeDivisor()
    expectedTester1Payout = totalProceeds * 6000 / numTicks
    expectedTester2Payout = totalProceeds * (numTicks - 6000) / numTicks
    with TokenDelta(cash, expectedTester1Payout, tester.a1, "Tester 1 ETH delta wrong"):
        with PrintGasUsed(contractsFixture, "categoricalFill", 0):
            assert trade.publicFillBestOrder(BID, market.address, 0, fix(1), 6000, "43", 6, False, nullAddress, nullAddress, sender=tester.k2) == 0

    assert firstShareToken.balanceOf(tester.a1) == 0
    assert secondShareToken.balanceOf(tester.a1) == fix(1)
    assert thirdShareToken.balanceOf(tester.a1) == fix(1)

    assert firstShareToken.balanceOf(tester.a2) == fix(1)
    assert secondShareToken.balanceOf(tester.a2) == 0
    assert thirdShareToken.balanceOf(tester.a2) == 0

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
    with BuyWithCash(cash, fix('4', '6000'), tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(4), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order
    orderFilledLog = {
        "filler": bytesToHexString(tester.a1),
        "numCreatorShares": 0,
        "numCreatorTokens": fix('4', '6000'),
        "numFillerShares": 0,
        "numFillerTokens": fix('4', '4000'),
        "marketCreatorFees": 0,
        "reporterFees": 0,
        "shareToken": market.getShareToken(YES),
        "tradeGroupId": stringToBytes(longTo32Bytes(42)),
    }
    orderCreatedLog = {
        "creator": bytesToHexString(tester.a1),
        "shareToken": market.getShareToken(YES),
        "tradeGroupId": stringToBytes(longTo32Bytes(42)),
    }
    with BuyWithCash(cash, fix('5', '4000'), tester.k1, "trade"):
        with AssertLog(contractsFixture, "OrderFilled", orderFilledLog):
            with AssertLog(contractsFixture, "OrderCreated", orderCreatedLog):
                fillOrderID = trade.publicTrade(SHORT,market.address, YES, fix(5), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k1)
                # Since this is self order, withdraw the amount we expect to be paid to ourselves
                # 4 instead of 5 because 4 was market depth for LONG, leaving an order size of 1
                cash.withdrawEther(fix('4', '10000'), sender=tester.k1)

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    assert orders.getAmount(fillOrderID) == fix(1)
    assert orders.getPrice(fillOrderID) == 6000
    assert orders.getOrderCreator(fillOrderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix(1, 4000)
    assert orders.getOrderSharesEscrowed(fillOrderID) == 0
    assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

@mark.parametrize('withTotalCost', [
    True,
    False
])
def test_trade_with_self_take_order_make_order(withTotalCost, contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    tradeGroupID = longTo32Bytes(42)

    # create order
    createCost = fix('0.003', '6000')
    with BuyWithCash(cash, createCost, tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix('0.003'), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order
    takeCost = fix('1', '5000')
    with BuyWithCash(cash, takeCost, tester.k1, "publicTradeWithTotalCost"):
        if withTotalCost:
            fillOrderID = trade.publicTradeWithTotalCost(BID, market.address, YES, takeCost, 5000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k1)
        else:
            fillOrderID = trade.publicTrade(BID, market.address, YES, fix(1), 5000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress, sender = tester.k1)
        # The cost of the original order plus the portion of this order that matched
        cash.withdrawEther(fix('0.003', '6000') + fix('0.003', '5000'), sender=tester.k1)


    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    orderAmount = fix(1) - fix('0.003')
    assert orders.getAmount(fillOrderID) == orderAmount
    assert orders.getPrice(fillOrderID) == 5000
    assert orders.getOrderCreator(fillOrderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(fillOrderID) == fix('0.997', 5000)
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
    createCost = fix('1', '6000')
    with BuyWithCash(cash, createCost, tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix('1'), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    if isMatch:
        createCost = fix('1', '5000')
        with BuyWithCash(cash, createCost, tester.k1, "create matching order"):
            orderID2 = createOrder.publicCreateOrder(ASK, fix('1'), 5000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)
    else:
        createCost = fix('1', '3000')
        with BuyWithCash(cash, createCost, tester.k1, "create non-matching order"):
            orderID2 = createOrder.publicCreateOrder(ASK, fix('1'), 7000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender = tester.k1)

    # fill best order, isMatch determines if one of the orders
    takeCost = fix('2', '6000')
    with BuyWithCash(cash, takeCost, tester.k0, "trade"):
        fillOrderID = trade.publicTrade(BID, market.address, YES, fix(2), 6000, "0", "0", tradeGroupID, 6, False, nullAddress, nullAddress)
        if isMatch:
            # Withdraw the difference from the price of the match
            assert cash.withdrawEther(fix('1', '2000') + fix('1', '1000'), sender=tester.k0)
        else:
            # Withdraw difference from one order, the rest created new order at exact price
            assert cash.withdrawEther(fix('1', '2000'), sender=tester.k0)


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
        assert orders.getPrice(fillOrderID) == 6000
        assert orders.getOrderCreator(fillOrderID) == bytesToHexString(tester.a0)
        assert orders.getOrderMoneyEscrowed(fillOrderID) == fix(6000)
        assert orders.getOrderSharesEscrowed(fillOrderID) == 0
        assert orders.getBetterOrderId(fillOrderID) == longTo32Bytes(0)
        assert orders.getWorseOrderId(fillOrderID) == longTo32Bytes(0)

@mark.parametrize('useFill', [
    True,
    False
])
def test_take_best_order_with_shares_escrowed_buy_with_cash_by_ignoring_shares(useFill, contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    completeSets = contractsFixture.contracts['CompleteSets']
    firstShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    secondShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(1))

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k1)
    with BuyWithCash(cash, fix('1', numTicks), tester.k2, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k2)
    assert firstShareToken.balanceOf(tester.a1) == firstShareToken.balanceOf(tester.a2) == fix(1)
    assert secondShareToken.balanceOf(tester.a1) == secondShareToken.balanceOf(tester.a2) == fix(1)

    # create order with shares
    orderID = createOrder.publicCreateOrder(ASK, fix(1), 6000, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
    assert orderID

    # Since we're ignoring owned shares we need to put up the required cost of the fill
    with raises(TransactionFailed):
        if useFill:
            trade.publicFillBestOrder(BID, market.address, 0, fix(1), 6000, longTo32Bytes(43), 6, True, nullAddress, nullAddress, sender=tester.k2) == 0
        else:
            trade.publicTrade(BID, market.address, 0, fix(1), 6000, longTo32Bytes(0), longTo32Bytes(0), "43", 6, True, nullAddress, nullAddress, sender=tester.k2)

    # fill order with cash using on-chain matcher and ignoring owned shares
    if useFill:
        with BuyWithCash(cash, fix(6000), tester.k2, "fill best order"):
            assert trade.publicFillBestOrder(BID, market.address, 0, fix(1), 6000, longTo32Bytes(43), 6, True, nullAddress, nullAddress, sender=tester.k2) == 0
    else:
        with BuyWithCash(cash, fix(6000), tester.k2, "trade"):
            assert trade.publicTrade(BID, market.address, 0, fix(1), 6000, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(43), 6, True, nullAddress, nullAddress, sender=tester.k2)

    assert firstShareToken.balanceOf(tester.a1) == 0
    assert secondShareToken.balanceOf(tester.a1) == fix(1)

    # The second user did not sell the complete set they ended up holding from this transaction because we specified to ignore shares
    assert firstShareToken.balanceOf(tester.a2) == fix(2)
    assert secondShareToken.balanceOf(tester.a2) == fix(1)

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

@mark.parametrize('finalized', [
    True,
    False
])
def test_fees_from_trades(finalized, contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    completeSets = contractsFixture.contracts['CompleteSets']
    firstShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    secondShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(1))

    if finalized:
        proceedToNextRound(contractsFixture, market)
        disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
        contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
        assert market.finalize()

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k1)
    with BuyWithCash(cash, fix('1', numTicks), tester.k2, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=tester.k2)
    assert firstShareToken.balanceOf(tester.a1) == firstShareToken.balanceOf(tester.a2) == fix(1)
    assert secondShareToken.balanceOf(tester.a1) == secondShareToken.balanceOf(tester.a2) == fix(1)

    # create order with shares
    orderID = createOrder.publicCreateOrder(ASK, fix(1), 6000, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
    assert orderID

    expectedAffiliateFees = fix(10000) * 0.01 * .25
    cash.depositEther(value=fix(6000), sender=tester.k2)
    # Trade and specify an affiliate address.
    if finalized:
        with TokenDelta(cash, expectedAffiliateFees, tester.a3, "Affiliate did not recieve the correct fees"):
            assert trade.publicFillBestOrder(BID, market.address, 0, fix(1), 6000, "43", 6, False, tester.a3, nullAddress, sender=tester.k2) == 0
    else:
        assert trade.publicFillBestOrder(BID, market.address, 0, fix(1), 6000, "43", 6, False, tester.a3, nullAddress, sender=tester.k2) == 0

    assert firstShareToken.balanceOf(tester.a1) == 0
    assert secondShareToken.balanceOf(tester.a1) == fix(1)

    # The second user sold the complete set they ended up holding from this transaction, which extracts fees
    assert firstShareToken.balanceOf(tester.a2) == fix(1)
    assert secondShareToken.balanceOf(tester.a2) == fix(0)

    if not finalized:
        # We can confirm that the 3rd test account has an affiliate fee balance of 25% of the market creator fee 1% taken from the 1 ETH order
        assert market.affiliateFeesAttoEth(tester.a3) == expectedAffiliateFees

        # The affiliate can withdraw their fees
        with TokenDelta(cash, expectedAffiliateFees, tester.a3, "Affiliate did not recieve the correct fees"):
            market.withdrawAffiliateFees(tester.a3)

    # No more fees can be withdrawn
    with TokenDelta(cash, 0, tester.a3, "Affiliate double received fees"):
        market.withdrawAffiliateFees(tester.a3)
