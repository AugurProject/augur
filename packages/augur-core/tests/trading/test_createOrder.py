#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, mark
from utils import longTo32Bytes, fix, AssertLog, BuyWithCash, stringToBytes, nullAddress
from constants import BID, ASK, YES, NO


def test_publicCreateOrder_0_shares(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, 0, 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), nullAddress)

@mark.parametrize('afterMkrShutdown', [
    True,
    False
])
def test_publicCreateOrder_bid(afterMkrShutdown, contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    if (afterMkrShutdown):
        contractsFixture.MKRShutdown()

    with BuyWithCash(cash, fix(1, 40), contractsFixture.accounts[0], "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), nullAddress)
        assert orderID

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 40
    assert orders.getOrderCreator(orderID) == contractsFixture.accounts[0]
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 40)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == bytearray(32)
    assert orders.getWorseOrderId(orderID) == bytearray(32)

def test_publicCreateOrder_ask(contractsFixture, cash, market, universe):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with BuyWithCash(cash, fix(1, 60), contractsFixture.accounts[0], "create order"):
        orderID = createOrder.publicCreateOrder(ASK, fix(1), 40, market.address, 0, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), nullAddress)

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 40
    assert orders.getOrderCreator(orderID) == contractsFixture.accounts[0]
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 60)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == bytearray(32)
    assert orders.getWorseOrderId(orderID) == bytearray(32)
    assert orders.getTotalEscrowed(market.address) == fix(1, 60)

def test_publicCreateOrder_List_Logic(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with BuyWithCash(cash, fix(1, 10), contractsFixture.accounts[0], "create order 1"):
        orderID_10 = createOrder.publicCreateOrder(BID, fix(1), 10, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(1), nullAddress)
    with BuyWithCash(cash, fix(1, 8), contractsFixture.accounts[0], "create order 2"):
        orderID_8 = createOrder.publicCreateOrder(BID, fix(1), 8, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(2), nullAddress)
    with BuyWithCash(cash, fix(1, 6), contractsFixture.accounts[0], "create order 3"):
        orderID_6 = createOrder.publicCreateOrder(BID, fix(1), 6, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(3), nullAddress)
    with BuyWithCash(cash, fix(1, 2), contractsFixture.accounts[0], "create order 4"):
        orderID_2 = createOrder.publicCreateOrder(BID, fix(1), 2, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(4), nullAddress)
    with BuyWithCash(cash, fix(1, 1), contractsFixture.accounts[0], "create order 5"):
        orderID_1 = createOrder.publicCreateOrder(BID, fix(1), 1, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(5), nullAddress)
    with BuyWithCash(cash, fix(1, 7), contractsFixture.accounts[0], "create order 6"):
        orderID_7 = createOrder.publicCreateOrder(BID, fix(1), 7, market.address, 1, orderID_10, orderID_1, longTo32Bytes(6), nullAddress)
    assert orderID_7
    assert orders.getBetterOrderId(orderID_7) == orderID_8
    assert orders.getWorseOrderId(orderID_7) == orderID_6

    with BuyWithCash(cash, fix(1, 5), contractsFixture.accounts[0], "create order 7"):
        orderID_5 = createOrder.publicCreateOrder(BID, fix(1), 5, market.address, 1, orderID_6, orderID_1, longTo32Bytes(7), nullAddress)
    assert orderID_5
    assert orders.getBetterOrderId(orderID_5) == orderID_6
    assert orders.getWorseOrderId(orderID_5) == orderID_2

    with BuyWithCash(cash, fix(1, 3), contractsFixture.accounts[0], "create order 8"):
        orderID_3 = createOrder.publicCreateOrder(BID, fix(1), 3, market.address, 1, orderID_5, orderID_2, longTo32Bytes(8), nullAddress)
    assert orderID_3
    assert orders.getBetterOrderId(orderID_3) == orderID_5
    assert orders.getWorseOrderId(orderID_3) == orderID_2

def test_publicCreateOrder_bid2(contractsFixture, cash, market, universe):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']
    shareToken = contractsFixture.contracts["ShareToken"]

    orderType = BID
    amount = fix(1)
    fxpPrice = 40
    outcome = 0
    tradeGroupID = longTo32Bytes(42)

    orderID = None

    orderCreatedEventLog = {
	    "eventType": 0,
	    "addressData": [nullAddress, contractsFixture.accounts[1] , nullAddress],
	    "uint256Data": [fxpPrice, amount, outcome, 0, 0, 0, 0,  contractsFixture.contracts['Time'].getTimestamp(), 0, fix(1, 40)],
    }

    with BuyWithCash(cash, fix('1', '40'), contractsFixture.accounts[1], "create order"):
        with AssertLog(contractsFixture, "OrderEvent", orderCreatedEventLog):
            orderID = createOrder.publicCreateOrder(orderType, amount, fxpPrice, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, nullAddress,sender=contractsFixture.accounts[1])
        assert orderID != bytearray(32), "Order ID should be non-zero"

    assert orders.getAmount(orderID) == amount
    assert orders.getPrice(orderID) == fxpPrice
    assert orders.getOrderCreator(orderID) == contractsFixture.accounts[1]
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 40)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert cash.balanceOf(contractsFixture.accounts[1]) == 0
    assert orders.getTotalEscrowed(market.address) == 40 * 10**18

def test_createOrder_failure(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    shareToken = contractsFixture.contracts['ShareToken']

    with raises(TransactionFailed):
        createOrder.createOrder(contractsFixture.accounts[1], ASK, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])

    # createOrder exceptions (pre-escrowFunds)
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(3, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])

    # escrowFundsForBid exceptions
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])

    # escrowFundsForAsk exceptions
    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, 1, 1, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])

    with BuyWithCash(cash, fix('12', market.getNumTicks()), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(12), sender=contractsFixture.accounts[1])

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 12000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(ASK, fix(1), 40, contractsFixture.accounts[1], YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])

    assert createOrder.publicCreateOrder(ASK, fix(1), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1]) != 0, "Order ID should be non-zero"

def test_ask_withPartialShares(contractsFixture, universe, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']
    shareToken = contractsFixture.contracts['ShareToken']
    shareToken = contractsFixture.contracts["ShareToken"]

    # buy fix(2) complete sets
    with BuyWithCash(cash, fix(2, market.getNumTicks()), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(2), sender = contractsFixture.accounts[1])
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(2)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(2)

    orderID = None

    orderCreatedEventLog = {
	    "eventType": 0,
	    "addressData": [nullAddress, contractsFixture.accounts[1] , nullAddress],
	    "uint256Data": [40, fix(3), YES, 0, 0, 0, 0,  contractsFixture.contracts['Time'].getTimestamp(), fix(2), fix(60)],
    }
    with BuyWithCash(cash, fix('60'), contractsFixture.accounts[1], "buy complete set"):
        with AssertLog(contractsFixture, "OrderEvent", orderCreatedEventLog):
            orderID = createOrder.publicCreateOrder(ASK, fix(3), 40, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(2)

    # validate the order contains expected results
    assert orderID != bytearray(32), "Order ID should be non-zero"
    assert orders.getAmount(orderID) == fix(3)
    assert orders.getPrice(orderID) == 40
    assert orders.getOrderCreator(orderID) == contractsFixture.accounts[1]
    assert orders.getOrderMoneyEscrowed(orderID) == fix('60')
    assert orders.getOrderSharesEscrowed(orderID) == fix(2)

def test_duplicate_creation_transaction(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with BuyWithCash(cash, fix(1, 40), contractsFixture.accounts[0], "buy complete set"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), nullAddress)

    assert orderID

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), nullAddress)

def test_publicCreateOrders(contractsFixture, cash, market):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    types = [BID,BID,BID,ASK,ASK,ASK]
    outcomes = [0, 1, 2, 0, 1, 2]
    attoshareAmounts = [100, 200, 300, 100, 200, 300]
    prices = [40, 41, 42, 70, 71, 72]
    value = 40 * 100 + 41 * 200 + 42 * 300 + 30 * 100 + 29 * 200 + 28 * 300
    with BuyWithCash(cash, value, contractsFixture.accounts[0], "create order"):
        orderIDs = createOrder.publicCreateOrders(outcomes, types, attoshareAmounts, prices, market.address, longTo32Bytes(42), nullAddress)
        assert orderIDs

    for i in range(len(types)):
        assert orders.getAmount(orderIDs[i]) == attoshareAmounts[i]
        assert orders.getPrice(orderIDs[i]) == prices[i]
        assert orders.getOrderCreator(orderIDs[i]) == contractsFixture.accounts[0]
        assert orders.getOrderMoneyEscrowed(orderIDs[i]) == attoshareAmounts[i] * prices[i] if type == BID else attoshareAmounts[i] * (100 - prices[i])
        assert orders.getOrderSharesEscrowed(orderIDs[i]) == 0

def test_publicCreateOrder_kycToken(contractsFixture, cash, market, reputationToken):
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']

    with raises(TransactionFailed):
        createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), reputationToken.address, sender=contractsFixture.accounts[1])

    with BuyWithCash(cash, fix(1, 40), contractsFixture.accounts[0], "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(1), 40, market.address, 1, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(7), reputationToken.address)
        assert orderID

    assert orders.getAmount(orderID) == fix(1)
    assert orders.getPrice(orderID) == 40
    assert orders.getKYCToken(orderID) == reputationToken.address
    assert orders.getOrderCreator(orderID) == contractsFixture.accounts[0]
    assert orders.getOrderMoneyEscrowed(orderID) == fix(1, 40)
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == bytearray(32)
    assert orders.getWorseOrderId(orderID) == bytearray(32)
