#!/usr/bin/env python

from ethereum.tools import tester
from ethereum.tools.tester import ABIContract, TransactionFailed
from pytest import fixture, raises
from utils import longTo32Bytes, PrintGasUsed, fix, bytesToHexString, BuyWithCash, longToHexString, TokenDelta, nullAddress
from constants import BID, ASK, YES, NO
from datetime import timedelta
from ethereum.utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad


def test_signed_trade(contractsFixture, universe, market, cash, augur):
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    expirationTimestampInSec = augur.getTimestamp() + 1
    payment = 100

    tradeHash = trade.getTradeHash(BID, market.address, YES, 10, 1000, tester.a0, False, expirationTimestampInSec, 42, payment)
    v, r, s = createTrade(tradeHash)

    # Fail with no Cash deposited
    with raises(TransactionFailed):
        trade.executeSignedTrade(
            BID, market.address, YES, 10, 1000, tester.a0, False, expirationTimestampInSec, 42, payment,
            v,
            r,
            s,
            sender=tester.k1)

    assert cash.depositEther(value = 10100)
    assert cash.approve(augur.address, 10100)

    with TokenDelta(cash, 100, tester.a1, "User was not paid for executing the transaction"):
        assert trade.executeSignedTrade(
            BID, market.address, YES, 10, 1000, tester.a0, False, expirationTimestampInSec, 42, payment,
            v,
            r,
            s,
            sender=tester.k1)

    # The user has created an order
    orderID = orders.getBestOrderId(BID, market.address, YES, nullAddress)
    assert orders.getAmount(orderID) == 10
    assert orders.getPrice(orderID) == 1000
    assert orders.getOrderCreator(orderID) == bytesToHexString(tester.a0)
    assert orders.getOrderMoneyEscrowed(orderID) == 10000
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

def test_signed_fill(contractsFixture, universe, market, cash, augur):
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    createOrder = contractsFixture.contracts['CreateOrder']
    expirationTimestampInSec = augur.getTimestamp() + 1
    payment = 100

    with BuyWithCash(cash, 90000, tester.k1, "place an order"):
        orderID = createOrder.publicCreateOrder(ASK, 10, 1000, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender = tester.k1)

    tradeHash = trade.getTradeHash(BID, market.address, YES, 10, 1000, tester.a0, False, expirationTimestampInSec, 42, payment)
    v, r, s = createTrade(tradeHash)

    assert cash.depositEther(value = 10100)
    assert cash.approve(augur.address, 10100)

    assert trade.executeSignedTrade(
        BID, market.address, YES, 10, 1000, tester.a0, False, expirationTimestampInSec, 42, payment,
        v,
        r,
        s,
        sender=tester.k1)

    # The signer took the original order off the book
    assert orders.getAmount(orderID) == 0
    assert orders.getPrice(orderID) == 0
    assert orders.getOrderCreator(orderID) == longToHexString(0)
    assert orders.getOrderMoneyEscrowed(orderID) == 0
    assert orders.getOrderSharesEscrowed(orderID) == 0
    assert orders.getBetterOrderId(orderID) == longTo32Bytes(0)
    assert orders.getWorseOrderId(orderID) == longTo32Bytes(0)

    yesShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(YES))
    assert yesShareToken.balanceOf(tester.a0) == 10

def test_signed_trade_cancel(contractsFixture, universe, market, cash, augur):
    trade = contractsFixture.contracts['Trade']
    orders = contractsFixture.contracts['Orders']
    expirationTimestampInSec = augur.getTimestamp() + 1
    payment = 100

    tradeHash = trade.getTradeHash(BID, market.address, YES, 10, 1000, tester.a0, False, expirationTimestampInSec, 42, payment)
    v, r, s = createTrade(tradeHash)

    assert cash.depositEther(value = 10000)
    assert cash.approve(augur.address, 10000)

    # Cancel the order
    assert trade.cancelTrade(BID, market.address, YES, 10, 1000, tester.a0, False, expirationTimestampInSec, 42, payment)

    # Fail executing the order if cancelled
    with raises(TransactionFailed):
        trade.executeSignedTrade(
            BID, market.address, YES, 10, 1000, tester.a0, False, expirationTimestampInSec, 42, payment,
            v,
            r,
            s)


def createTrade(tradeHash, key=tester.k0):
    key = normalize_key(key)
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32" + tradeHash), key)
    return v, zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32), zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)
