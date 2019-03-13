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
        createOrder.publicCreateOrder(BID, 0, 4000, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress)

def test_publicCreateOrder_bid(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with BuyWithCash(cash, fix(1, 4000), tester.k0, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 4000, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress)
        assert orderID

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 4000
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 4000)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == bytearray(32)
    assert orders.getWorseOrderId(orderID) == bytearray(32)

def test_publicCreateOrder_ask(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    marketInitialCashBalance = cash.balanceOf(market.address)

    with BuyWithCash(cash, fix(1, 6000), tester.k0, "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(1), 4000, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress)

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 4000
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 6000)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == bytearray(32)
    assert orders.getWorseOrderId(orderID) == bytearray(32)
    assert cash.balanceOf(market.address) == fix(1, 6000) + marketInitialCashBalance

def test_publicCreateOrder_List_Logic(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with BuyWithCash(cash, fix(1, 4010), tester.k0, "create order 1"):
        orderID_10 = createOrder.publicCreateOrder(BID, fix(1), 4010, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(1), False, nullAddress)
    with BuyWithCash(cash, fix(1, 4008), tester.k0, "create order 2"):
        orderID_8 = createOrder.publicCreateOrder(BID, fix(1), 4008, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(2), False, nullAddress)
    with BuyWithCash(cash, fix(1, 4006), tester.k0, "create order 3"):
        orderID_6 = createOrder.publicCreateOrder(BID, fix(1), 4006, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(3), False, nullAddress)
    with BuyWithCash(cash, fix(1, 4002), tester.k0, "create order 4"):
        orderID_2 = createOrder.publicCreateOrder(BID, fix(1), 4002, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(4), False, nullAddress)
    with BuyWithCash(cash, fix(1, 4001), tester.k0, "create order 5"):
        orderID_1 = createOrder.publicCreateOrder(BID, fix(1), 4001, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(5), False, nullAddress)
    with BuyWithCash(cash, fix(1, 4007), tester.k0, "create order 6"):
        orderID_7 = createOrder.publicCreateOrder(BID, fix(1), 4007, market.address, 1, orderID_10, orderID_1, longTo32Bytes(6), False, nullAddress)
    assert orderID_7
    assert orders.getBetterOrderId(orderID_7) == orderID_8
    assert orders.getWorseOrderId(orderID_7) == orderID_6

    with BuyWithCash(cash, fix(1, 4005), tester.k0, "create order 7"):
        orderID_5 = createOrder.publicCreateOrder(BID, fix(1), 4005, market.address, 1, orderID_6, orderID_1, longTo32Bytes(7), False, nullAddress)
    assert orderID_5
    assert orders.getBetterOrderId(orderID_5) == orderID_6
    assert orders.getWorseOrderId(orderID_5) == orderID_2

    with BuyWithCash(cash, fix(1, 4003), tester.k0, "create order 8"):
        orderID_3 = createOrder.publicCreateOrder(BID, fix(1), 4003, market.address, 1, orderID_5, orderID_2, longTo32Bytes(8), False, nullAddress)
    assert orderID_3
    assert orders.getBetterOrderId(orderID_3) == orderID_5
    assert orders.getWorseOrderId(orderID_3) == orderID_2

def test_publicCreateOrder_bid2(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    orderType = BID
    amount = fix(1)
    fxpPrice = 4000
    outcome = 0
    tradeGroupID = longTo32Bytes(42)

    marketInitialCash = cash.balanceOf(market.address)
    creatorInitialETH = contractsFixture.chain.head_state.get_balance(tester.a1)

    orderID = None
    shareToken = contractsFixture.getShareToken(market, 0)

    orderCreatedLog = {
        'creator': bytesToHexString(tester.a1),
        'shareToken': shareToken.address,
        'tradeGroupId': stringToBytes(longTo32Bytes(42)),
    }

    with BuyWithCash(cash, fix('1', '4000'), tester.k1, "create order"):
        with AssertLog(contractsFixture, "OrderCreated", orderCreatedLog):
            orderID = createOrder.publicCreateOrder(orderType, amount, fxpPrice, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress,sender=tester.k1)
        assert orderID != bytearray(32), "Order ID should be non-zero"

    assert orders.getAmount(orderID) == amount
    assert orders.getPrice(orderID) == fxpPrice
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 4000)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert cash.balanceOf(tester.a1) == 0
    assert contractsFixture.chain.head_state.get_balance(tester.a1) == creatorInitialETH - long(4000 * 10**18)
    assert cash.balanceOf(market.address) - marketInitialCash == 4000 * 10**18

def test_createOrder_failure(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    completeSets = contractsFixture.contracts['CompleteSets']

    with raises(TransactionFailed):
        createOrder.createOrder(tester.a1, ASK, fix(1), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    # createOrder exceptions (pre-escrowFunds)
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(3, fix(1), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    # escrowFundsForBid exceptions
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    # escrowFundsForAsk exceptions
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, 1, 1, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    with BuyWithCash(cash, fix('12', market.getNumTicks()), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(12), sender=tester.k1)

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 12000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 4000, tester.a1, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

    assert createOrder.publicCreateOrder(ASK, fix(1), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1) != 0, "Order ID should be non-zero"

    # createOrder exceptions (post-escrowFunds)
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)

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

    orderCreatedLog = {
        'creator': bytesToHexString(tester.a1),
        'shareToken': yesShareToken.address,
        'tradeGroupId': stringToBytes(longTo32Bytes(42)),
    }
    with BuyWithCash(cash, fix('6000'), tester.k1, "buy complete set"):
        with AssertLog(contractsFixture, "OrderCreated", orderCreatedLog):
            orderID = createOrder.publicCreateOrder(ASK, fix(3), 4000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender=tester.k1)
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == 0
    assert noShareToken.balanceOf(tester.a1) == fix(2)

    # validate the order contains expected results
    assert orderID != bytearray(32), "Order ID should be non-zero"
    assert orders.getAmount(orderID) == fix(3)
    assert orders.getPrice(orderID) == 4000
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(orderID) == fix('6000')
    assert orders.getOrderSharesEscrowed(orderID) == fix(2)

def test_duplicate_creation_transaction(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with BuyWithCash(cash, fix(1, 4000), tester.k0, "buy complete set"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 4000, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress)

    assert orderID

    # FFDFSA
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 4000, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, nullAddress, value = fix(1, 4000))

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
        createOrder.publicCreateOrder(BID, fix(1), 5000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), True, nullAddress, sender=tester.k1)

    orderCreatedLog = {
        'creator': bytesToHexString(tester.a1),
        'shareToken': yesShareToken.address,
        'tradeGroupId': stringToBytes(longTo32Bytes(42)),
    }
    with BuyWithCash(cash, fix('5000'), tester.k1, "create order"):
        with AssertLog(contractsFixture, "OrderCreated", orderCreatedLog):
            orderID = createOrder.publicCreateOrder(BID, fix(1), 5000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), True, nullAddress, sender=tester.k1)
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == fix(2)
    assert noShareToken.balanceOf(tester.a1) == fix(2)

    # validate the order contains expected results
    assert orderID != bytearray(32), "Order ID should be non-zero"
    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 5000
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a1)
    assert orders.getOrderMoneyEscrowed(orderID) == fix('5000')
    assert orders.getOrderSharesEscrowed(orderID) == 0

def test_publicCreateOrders(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    types = [BID,BID,BID,ASK,ASK,ASK]
    outcomes = [0, 1, 2, 0, 1, 2]
    attoshareAmounts = [100, 200, 300, 100, 200, 300]
    prices = [4000, 4100, 4200, 7000, 7100, 7200]
    value = 4000 * 100 + 4100 * 200 + 4200 * 300 + 3000 * 100 + 2900 * 200 + 2800 * 300
    with BuyWithCash(cash, value, tester.k0, "create order"):
        orderIDs = createOrder.publicCreateOrders(outcomes, types, attoshareAmounts, prices, market.address, False, longTo32Bytes(42), nullAddress)
        assert orderIDs

    for i in range(len(types)):
        assert orders.getAmount(orderIDs[i]) == attoshareAmounts[i]
        assert orders.getPrice(orderIDs[i]) == prices[i]
        assert orders.getOrderCreator(orderIDs[i]) == bytesToHexString(tester.a0)
        assert orders.getOrderMoneyEscrowed(orderIDs[i]) == attoshareAmounts[i] * prices[i] if type == BID else attoshareAmounts[i] * (10000 - prices[i])
        assert orders.getOrderSharesEscrowed(orderIDs[i]) == 0

def test_publicCreateOrder_kycToken(contractsFixture, cash, market, reputationToken):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 4000, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, reputationToken.address, sender=tester.k1)

    with BuyWithCash(cash, fix(1, 4000), tester.k0, "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 4000, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), False, reputationToken.address)
        assert orderID

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 4000
    assert orders.getKYCToken(orderID) == reputationToken.address
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 4000)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == bytearray(32)
    assert orders.getWorseOrderId(orderID) == bytearray(32)
