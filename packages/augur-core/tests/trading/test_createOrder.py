#!/usr/bin/env python

from ethereum.tools import tester
from ethereum.tools.tester import TransactionFailed
from pytest import raises
from utils import longTo32Bytes, bytesToHexString, fix, AssertLog, BuyWithCash, stringToBytes, nullAddress
from constants import BID, ASK, YES, NO

tester.STARTGAS = long(6.7 * 10**6)

ATTOSHARES = 0
DISPLAY_PRICE = 1
OWNER = 2
TOKENS_ESCROWED = 3
SHARES_ESCROWED = 4
BETTER_ORDER_ID = 5
WORSE_ORDER_ID = 6
GAS_PRICE = 7

def test_publicCreateOrder_0_shares(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, 0, 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress)

def test_publicCreateOrder_bid(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with BuyWithCash(cash, fix(1, 40), tester.k0, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress)
        assert orderID

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 40
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 40)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == bytearray(32)
    assert orders.getWorseOrderId(orderID) == bytearray(32)

def test_publicCreateOrder_ask(contractsFixture, cash, market, universe):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    marketInitialCashBalance = universe.marketBalance(market.address)

    with BuyWithCash(cash, fix(1, 60), tester.k0, "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(1), 40, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress)

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 40
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 60)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == bytearray(32)
    assert orders.getWorseOrderId(orderID) == bytearray(32)
    assert universe.marketBalance(market.address) == fix(1, 60) + marketInitialCashBalance

def test_publicCreateOrder_List_Logic(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with BuyWithCash(cash, fix(1, 10), tester.k0, "create order 1"):
        orderID_10 = createOrder.publicCreateOrder(BID, fix(1), 10, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(1), False, nullAddress)
    with BuyWithCash(cash, fix(1, 8), tester.k0, "create order 2"):
        orderID_8 = createOrder.publicCreateOrder(BID, fix(1), 8, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(2), False, nullAddress)
    with BuyWithCash(cash, fix(1, 6), tester.k0, "create order 3"):
        orderID_6 = createOrder.publicCreateOrder(BID, fix(1), 6, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(3), False, nullAddress)
    with BuyWithCash(cash, fix(1, 2), tester.k0, "create order 4"):
        orderID_2 = createOrder.publicCreateOrder(BID, fix(1), 2, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(4), False, nullAddress)
    with BuyWithCash(cash, fix(1, 1), tester.k0, "create order 5"):
        orderID_1 = createOrder.publicCreateOrder(BID, fix(1), 1, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(5), False, nullAddress)
    with BuyWithCash(cash, fix(1, 7), tester.k0, "create order 6"):
        orderID_7 = createOrder.publicCreateOrder(BID, fix(1), 7, market.address, 1, orderID_10, orderID_1, longTo32Bytes(6), False, nullAddress)
    assert orderID_7
    assert orders.getBetterOrderId(orderID_7) == orderID_8
    assert orders.getWorseOrderId(orderID_7) == orderID_6

    with BuyWithCash(cash, fix(1, 5), tester.k0, "create order 7"):
        orderID_5 = createOrder.publicCreateOrder(BID, fix(1), 5, market.address, 1, orderID_6, orderID_1, longTo32Bytes(7), False, nullAddress)
    assert orderID_5
    assert orders.getBetterOrderId(orderID_5) == orderID_6
    assert orders.getWorseOrderId(orderID_5) == orderID_2

    with BuyWithCash(cash, fix(1, 3), tester.k0, "create order 8"):
        orderID_3 = createOrder.publicCreateOrder(BID, fix(1), 3, market.address, 1, orderID_5, orderID_2, longTo32Bytes(8), False, nullAddress)
    assert orderID_3
    assert orders.getBetterOrderId(orderID_3) == orderID_5
    assert orders.getWorseOrderId(orderID_3) == orderID_2

def test_publicCreateOrder_bid2(contractsFixture, cash, market, universe):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    orderType = BID
    amount = fix(1)
    fxpPrice = 40
    outcome = 0
    tradeGroupID = longTo32Bytes(42)

    marketInitialCash = universe.marketBalance(market.address)

    orderID = None
    shareToken = contractsFixture.getShareToken(market, 0)

    orderCreatedEventLog = {
	    "eventType": 0,
	    "addressData": [nullAddress, bytesToHexString(tester.a1) , nullAddress],
	    "uint256Data": [fxpPrice, amount, outcome, 0, 0, 0, 0,  contractsFixture.contracts['Time'].getTimestamp()],
    }

    with BuyWithCash(cash, fix('1', '40'), tester.k1, "create order"):
        with AssertLog(contractsFixture, "OrderEvent", orderCreatedEventLog):
            orderID = createOrder.publicCreateOrder(orderType, amount, fxpPrice, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress,sender=tester.k1)
        assert orderID != bytearray(32), "Order ID should be non-zero"

    assert orders.getAmount(orderID) == amount
    assert orders.getPrice(orderID) == fxpPrice
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 40)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert cash.balanceOf(tester.a1) == 0
    assert universe.marketBalance(market.address) - marketInitialCash == 40 * 10**18

def test_createOrder_failure(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    completeSets = contractsFixture.contracts['CompleteSets']

    with raises(TransactionFailed):
        createOrder.createOrder(tester.a1, ASK, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    # createOrder exceptions (pre-escrowFunds)
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(3, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    # escrowFundsForBid exceptions
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    # escrowFundsForAsk exceptions
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, 1, 1, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    with BuyWithCash(cash, fix('12', market.getNumTicks()), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(12), sender=tester.k1)

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 12000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 40, tester.a1, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    assert createOrder.publicCreateOrder(ASK, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1) != 0, "Order ID should be non-zero"

    # createOrder exceptions (post-escrowFunds)
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

def test_ask_withPartialShares(contractsFixture, universe, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']
    completeSets = contractsFixture.contracts['CompleteSets']
    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(NO))

    # buy fix(2) complete sets
    with BuyWithCash(cash, fix(2, market.getNumTicks()), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(2), sender = tester.k1)
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == fix(2)
    assert noShareToken.balanceOf(tester.a1) == fix(2)

    orderID = None

    orderCreatedEventLog = {
	    "eventType": 0,
	    "addressData": [nullAddress, bytesToHexString(tester.a1) , nullAddress],
	    "uint256Data": [40, fix(3), YES, 0, 0, 0, 0,  contractsFixture.contracts['Time'].getTimestamp()],
    }
    with BuyWithCash(cash, fix('60'), tester.k1, "buy complete set"):
        with AssertLog(contractsFixture, "OrderEvent", orderCreatedEventLog):
            orderID = createOrder.publicCreateOrder(ASK, fix(3), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == 0
    assert noShareToken.balanceOf(tester.a1) == fix(2)

    # validate the order contains expected results
    assert orderID != bytearray(32), "Order ID should be non-zero"
    assert orders.getAmount(orderID) == fix(3)
    assert orders.getPrice(orderID) == 40
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(orderID) == fix('60')
    assert orders.getOrderSharesEscrowed(orderID) == fix(2)

def test_duplicate_creation_transaction(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with BuyWithCash(cash, fix(1, 40), tester.k0, "buy complete set"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress)

    assert orderID

    # FFDFSA
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress, value = fix(1, 40))

def test_ask_withSharesIgnored(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']
    completeSets = contractsFixture.contracts['CompleteSets']
    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(NO))

    # buy fix(2) complete sets
    with BuyWithCash(cash, fix(2, market.getNumTicks()), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(2), sender = tester.k1)
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == fix(2)
    assert noShareToken.balanceOf(tester.a1) == fix(2)

    orderID = None

    # Even though we have no shares available to cover this order if we indicate that we do not want to use them we'll need to provide sufficient ETH to cover the order
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 50, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), True, nullAddress, sender=tester.k1)

    orderCreatedEventLog = {
	    "eventType": 0,
	    "addressData": [nullAddress, bytesToHexString(tester.a1) , nullAddress],
	    "uint256Data": [50, fix(1), YES, 0, 0, 0, 0,  contractsFixture.contracts['Time'].getTimestamp()],
    }
    with BuyWithCash(cash, fix('50'), tester.k1, "create order"):
        with AssertLog(contractsFixture, "OrderEvent", orderCreatedEventLog):
            orderID = createOrder.publicCreateOrder(BID, fix(1), 50, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), True, nullAddress, sender=tester.k1)
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == fix(2)
    assert noShareToken.balanceOf(tester.a1) == fix(2)

    # validate the order contains expected results
    assert orderID != bytearray(32), "Order ID should be non-zero"
    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 50
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(orderID) == fix('50')
    assert orders.getOrderSharesEscrowed(orderID) == 0

def test_publicCreateOrders(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    types = [BID,BID,BID,ASK,ASK,ASK]
    outcomes = [0, 1, 2, 0, 1, 2]
    attoshareAmounts = [100, 200, 300, 100, 200, 300]
    prices = [40, 41, 42, 70, 71, 72]
    value = 40 * 100 + 41 * 200 + 42 * 300 + 30 * 100 + 29 * 200 + 28 * 300
    with BuyWithCash(cash, value, tester.k0, "create order"):
        orderIDs = createOrder.publicCreateOrders(outcomes, types, attoshareAmounts, prices, market.address, False, longTo32Bytes(42), nullAddress)
        assert orderIDs

    for i in range(len(types)):
        assert orders.getAmount(orderIDs[i]) == attoshareAmounts[i]
        assert orders.getPrice(orderIDs[i]) == prices[i]
        assert orders.getOrderCreator(orderIDs[i]) == bytesToHexString(tester.a0)
        assert orders.getOrderMoneyEscrowed(orderIDs[i]) == attoshareAmounts[i] * prices[i] if type == BID else attoshareAmounts[i] * (100 - prices[i])
        assert orders.getOrderSharesEscrowed(orderIDs[i]) == 0

def test_publicCreateOrder_kycToken(contractsFixture, cash, market, reputationToken):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, reputationToken.address, sender=tester.k1)

    with BuyWithCash(cash, fix(1, 40), tester.k0, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, reputationToken.address)
        assert orderID

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 40
    assert orders.getKYCToken(orderID) == reputationToken.address
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 40)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == bytearray(32)
    assert orders.getWorseOrderId(orderID) == bytearray(32)
