#!/usr/bin/env python

from ethereum.tools import tester
from ethereum.tools.tester import TransactionFailed
from pytest import raises, mark
from utils import longTo32Bytes, longToHexString, fix, AssertLog, bytesToHexString, BuyWithCash, nullAddress
from constants import BID, ASK, YES, NO

tester.STARTGAS = long(6.7 * 10**6)

def test_cancelBid(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    cancelOrder = contractsFixture.contracts['CancelOrder']
    orders = contractsFixture.contracts['Orders']

    orderType = BID
    amount = fix(1)
    fxpPrice = 6000
    outcomeID = YES
    tradeGroupID = longTo32Bytes(42)
    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(NO))
    creatorInitialETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    creatorInitialShares = yesShareToken.balanceOf(tester.a1)
    marketInitialCash = cash.balanceOf(market.address)
    marketInitialYesShares = yesShareToken.totalSupply()
    marketInitialNoShares = noShareToken.totalSupply()
    with BuyWithCash(cash, fix(fxpPrice), tester.k1, "The sender didn't get cost deducted for create order"):
        orderID = createOrder.publicCreateOrder(orderType, amount, fxpPrice, market.address, outcomeID, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender=tester.k1)

    assert orderID, "Order ID should be non-zero"
    assert orders.getOrderCreator(orderID), "Order should have an owner"

    assert contractsFixture.chain.head_state.get_balance(tester.a1) == creatorInitialETH - fix('1', '6000'), "ETH should be deducted from the creator balance"

    orderCanceledLog = {
        'orderId': orderID,
        'shareToken': yesShareToken.address,
        'sender': bytesToHexString(tester.a1),
        'orderType': orderType,
        'sharesRefund': 0,
        'tokenRefund': fix('1', '6000'),
    }
    with AssertLog(contractsFixture, 'OrderCanceled', orderCanceledLog):
        assert(cancelOrder.cancelOrder(orderID, sender=tester.k1) == 1), "cancelOrder should succeed"

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert(contractsFixture.chain.head_state.get_balance(tester.a1) == creatorInitialETH - fix('6000')), "Maker's ETH should be the deducted order cost"
    assert(cash.balanceOf(tester.a1) == fix('6000')), "Maker's cash balance should be order size"
    assert(marketInitialCash == cash.balanceOf(market.address)), "Market's cash balance should be the same as before the order was placed"
    assert(creatorInitialShares == yesShareToken.balanceOf(tester.a1)), "Maker's shares should be unchanged"
    assert(marketInitialYesShares == yesShareToken.totalSupply()), "Market's yes shares should be unchanged"
    assert marketInitialNoShares == noShareToken.totalSupply(), "Market's no shares should be unchanged"

def test_cancelAsk(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    cancelOrder = contractsFixture.contracts['CancelOrder']
    orders = contractsFixture.contracts['Orders']

    orderType = ASK
    amount = fix(1)
    fxpPrice = 6000
    outcomeID = 1
    tradeGroupID = longTo32Bytes(42)
    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(NO))
    creatorInitialETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    creatorInitialShares = yesShareToken.balanceOf(tester.a1)
    marketInitialCash = cash.balanceOf(market.address)
    marketInitialYesShares = yesShareToken.totalSupply()
    marketInitialNoShares = noShareToken.totalSupply()
    with BuyWithCash(cash, fix(10000 - fxpPrice), tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(orderType, amount, fxpPrice, market.address, outcomeID, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender=tester.k1)
    assert(orderID != bytearray(32)), "Order ID should be non-zero"
    assert orders.getOrderCreator(orderID), "Order should have an owner"

    assert contractsFixture.chain.head_state.get_balance(tester.a1) == creatorInitialETH - fix('1', '4000'), "ETH should be deducted from the creator balance"

    assert(cancelOrder.cancelOrder(orderID, sender=tester.k1) == 1), "cancelOrder should succeed"

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert(contractsFixture.chain.head_state.get_balance(tester.a1) == creatorInitialETH - fix(10000 - fxpPrice)), "Maker's ETH should be the same as before the order was placed"
    assert(marketInitialCash == cash.balanceOf(market.address)), "Market's cash balance should be the same as before the order was placed"
    assert(creatorInitialShares == yesShareToken.balanceOf(tester.a1)), "Maker's shares should be unchanged"
    assert(marketInitialYesShares == yesShareToken.totalSupply()), "Market's yes shares should be unchanged"
    assert marketInitialNoShares == noShareToken.totalSupply(), "Market's no shares should be unchanged"

def test_cancelWithSharesInEscrow(contractsFixture, cash, market, universe):
    completeSets = contractsFixture.contracts['CompleteSets']
    createOrder = contractsFixture.contracts['CreateOrder']
    cancelOrder = contractsFixture.contracts['CancelOrder']
    orders = contractsFixture.contracts['Orders']

    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(NO))
    totalProceeds = fix('12', market.getNumTicks())
    marketCreatorFee = totalProceeds / market.getMarketCreatorSettlementFeeDivisor()
    reporterFee = totalProceeds / universe.getOrCacheReportingFeeDivisor()
    completeSetFees = marketCreatorFee + reporterFee

    # buy complete sets
    with BuyWithCash(cash, fix('12', market.getNumTicks()), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(12), sender = tester.k1)
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == fix(12)
    assert noShareToken.balanceOf(tester.a1) == fix(12)

    creatorInitialETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    creatorInitialShares = yesShareToken.balanceOf(tester.a1)
    marketInitialCash = cash.balanceOf(market.address)
    marketInitialYesShares = yesShareToken.totalSupply()
    marketInitialNoShares = noShareToken.totalSupply()

    # create BID order for YES with NO shares escrowed
    assert noShareToken.approve(createOrder.address, fix(12), sender = tester.k1)
    orderID = createOrder.publicCreateOrder(BID, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender = tester.k1)
    assert orderID
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == fix(12)
    assert noShareToken.balanceOf(tester.a1) == 0

    # now cancel the order
    assert(cancelOrder.cancelOrder(orderID, sender=tester.k1) == 1), "cancelOrder should succeed"

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert(creatorInitialETH == contractsFixture.chain.head_state.get_balance(tester.a1)), "Maker's ETH should be the same as before the order was placed"
    assert(marketInitialCash == cash.balanceOf(market.address)), "Market's cash balance should be the same as before the order was placed"
    assert(creatorInitialShares == yesShareToken.balanceOf(tester.a1)), "Maker's shares should be unchanged"
    assert(marketInitialYesShares == yesShareToken.totalSupply()), "Market's yes shares should be unchanged"
    assert marketInitialNoShares == noShareToken.totalSupply(), "Market's no shares should be unchanged"

def test_cancelWithSharesInEscrowAsk(contractsFixture, cash, market, universe):
    completeSets = contractsFixture.contracts['CompleteSets']
    createOrder = contractsFixture.contracts['CreateOrder']
    cancelOrder = contractsFixture.contracts['CancelOrder']
    orders = contractsFixture.contracts['Orders']

    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(NO))
    totalProceeds = fix('12', market.getNumTicks())
    marketCreatorFee = totalProceeds / market.getMarketCreatorSettlementFeeDivisor()
    reporterFee = totalProceeds / universe.getOrCacheReportingFeeDivisor()
    completeSetFees = marketCreatorFee + reporterFee

    # buy complete sets
    with BuyWithCash(cash, fix('12', market.getNumTicks()), tester.k1, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(12), sender = tester.k1)
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == fix(12)
    assert noShareToken.balanceOf(tester.a1) == fix(12)

    creatorInitialETH = contractsFixture.chain.head_state.get_balance(tester.a1)
    creatorInitialShares = yesShareToken.balanceOf(tester.a1)
    marketInitialCash = cash.balanceOf(market.address)
    marketInitialYesShares = yesShareToken.totalSupply()
    marketInitialNoShares = noShareToken.totalSupply()

    # create ASK order for YES with YES shares escrowed
    assert noShareToken.approve(createOrder.address, fix(12), sender = tester.k1)
    orderID = createOrder.publicCreateOrder(ASK, fix(12), 6000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender = tester.k1)
    assert orderID
    assert cash.balanceOf(tester.a1) == fix('0')
    assert yesShareToken.balanceOf(tester.a1) == 0
    assert noShareToken.balanceOf(tester.a1) == fix(12)

    # now cancel the order
    assert(cancelOrder.cancelOrder(orderID, sender=tester.k1) == 1), "cancelOrder should succeed"

    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)
    assert(creatorInitialETH == contractsFixture.chain.head_state.get_balance(tester.a1)), "Maker's ETH should be the same as before the order was placed"
    assert(marketInitialCash == cash.balanceOf(market.address)), "Market's cash balance should be the same as before the order was placed"
    assert(creatorInitialShares == yesShareToken.balanceOf(tester.a1)), "Maker's shares should be unchanged"
    assert(marketInitialYesShares == yesShareToken.totalSupply()), "Market's yes shares should be unchanged"
    assert marketInitialNoShares == noShareToken.totalSupply(), "Market's no shares should be unchanged"

def test_exceptions(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    cancelOrder = contractsFixture.contracts['CancelOrder']

    orderType = BID
    amount = fix(1)
    fxpPrice = 6000
    outcomeID = YES
    tradeGroupID = longTo32Bytes(42)
    with BuyWithCash(cash, fix(fxpPrice), tester.k1, "create order"):
        orderID = createOrder.publicCreateOrder(orderType, amount, fxpPrice, market.address, outcomeID, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress, sender=tester.k1)
    assert(orderID != bytearray(32)), "Order ID should be non-zero"

    # cancelOrder exceptions
    with raises(TransactionFailed):
        cancelOrder.cancelOrder(longTo32Bytes(0), sender=tester.k1)
    with raises(TransactionFailed):
        cancelOrder.cancelOrder(longTo32Bytes(1), sender=tester.k1)
    with raises(TransactionFailed):
        cancelOrder.cancelOrder(orderID, sender=tester.k2)
    assert(cancelOrder.cancelOrder(orderID, sender=tester.k1) == 1), "cancelOrder should succeed"
    with raises(TransactionFailed):
        cancelOrder.cancelOrder(orderID, sender=tester.k1)

def test_cancelOrders(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts['CreateOrder']
    cancelOrder = contractsFixture.contracts['CancelOrder']
    orders = contractsFixture.contracts['Orders']

    orderType = BID
    amount = fix(1)
    fxpPrice = 6000
    outcomeID = YES
    tradeGroupID = longTo32Bytes(42)
    orderIDs = []
    for i in range(10):
        with BuyWithCash(cash, fix(fxpPrice + i), tester.k0, "create order"):
            orderIDs.append(createOrder.publicCreateOrder(orderType, amount, fxpPrice + i, market.address, outcomeID, longTo32Bytes(0), longTo32Bytes(0), tradeGroupID, False, nullAddress))

    for i in range(10):
        assert orders.getAmount(orderIDs[i]) == amount

    assert cancelOrder.cancelOrders(orderIDs)

    for i in range(10):
        assert orders.getAmount(orderIDs[i]) == 0
