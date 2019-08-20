#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from utils import longTo32Bytes, longToHexString, fix, AssertLog, stringToBytes, EtherDelta, PrintGasUsed, BuyWithCash, TokenDelta, nullAddress
from constants import ASK, BID, YES, NO, LONG, SHORT
from pytest import raises, mark
from reporting_utils import proceedToNextRound
from decimal import Decimal
from old_eth_utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad

def signOrder(orderHash, private_key):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + orderHash), key)
    return "0x" + v.to_bytes(1, "big").hex() + (zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32) + zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)).hex() + "03"

def test_basic_trading(contractsFixture, cash, market, universe):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5

    # First we'll create a signed order
    rawZeroXOrderData, orderHash = zeroXTradeToken.createZeroXOrder(BID, fix(2), 60, market.address, YES, nullAddress, expirationTime, salt)
    signature = signOrder(orderHash, contractsFixture.privateKeys[0])
    zeroXExchange = contractsFixture.applySignature("ZeroXExchange", zeroXTradeToken.exchange())
    assert zeroXExchange.isValidSignature(orderHash, contractsFixture.accounts[0], signature)

    fillAmount = fix(1)
    affiliateAddress = nullAddress
    tradeGroupId = longTo32Bytes(42)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # Lets take the order as another user and confirm assets are traded
    assert cash.faucet(fix(1, 60))
    assert cash.faucet(fix(1, 40), sender=contractsFixture.accounts[1])
    with TokenDelta(yesShareToken, fix(1), contractsFixture.accounts[0], "Tester 0 Shares not received"):
        with TokenDelta(noShareToken, fix(1), contractsFixture.accounts[1], "Tester 1 Shares not received"):
            with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[0], "Tester 0 cash not taken"):
                with TokenDelta(cash, -fix(1, 40), contractsFixture.accounts[1], "Tester 1 cash not taken"):
                    with PrintGasUsed(contractsFixture, "zeroXTradeToken.trade", 0):
                        amountRemaining = zeroXTradeToken.trade(fillAmount, affiliateAddress, tradeGroupId, orders, signatures, sender=contractsFixture.accounts[1])
                        assert amountRemaining == 0

    # Another user can fill the rest. We'll also ask to fill more than is available and see that we get back the remaining amount desired
    assert cash.faucet(fix(1, 60))
    assert cash.faucet(fix(1, 40), sender=contractsFixture.accounts[2])
    amountRemaining = zeroXTradeToken.trade(fillAmount + 1, affiliateAddress, tradeGroupId, orders, signatures, sender=contractsFixture.accounts[2])
    assert amountRemaining == 1

    # The order is completely filled so further attempts to take it will not actuall result in any trade occuring
    assert cash.faucet(fix(1, 60))
    assert cash.faucet(fix(1, 40), sender=contractsFixture.accounts[1])
    with TokenDelta(yesShareToken, 0, contractsFixture.accounts[0], "Tester 0 Shares not received"):
        with TokenDelta(noShareToken, 0, contractsFixture.accounts[1], "Tester 1 Shares not received"):
            with TokenDelta(cash, 0, contractsFixture.accounts[0], "Tester 0 cash not taken"):
                with TokenDelta(cash, 0, contractsFixture.accounts[1], "Tester 1 cash not taken"):
                    zeroXTradeToken.trade(fillAmount, affiliateAddress, tradeGroupId, orders, signatures, sender=contractsFixture.accounts[1])

@mark.parametrize('withSelf', [
    True,
    False
])
def test_one_bid_on_books_buy_full_order(withSelf, contractsFixture, cash, market, universe):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # create signed order
    sender = contractsFixture.accounts[2] if withSelf else contractsFixture.accounts[1]
    senderPrivateKey = contractsFixture.privateKeys[2] if withSelf else contractsFixture.privateKeys[1]
    cash.faucet(fix('2', '60'), sender=sender)
    rawZeroXOrderData, orderHash = zeroXTradeToken.createZeroXOrder(BID, fix(2), 60, market.address, YES, nullAddress, expirationTime, salt, sender=sender)
    signature = signOrder(orderHash, senderPrivateKey)

    # fill signed order
    orderEventLog = {
	    "eventType": 3,
	    "addressData": [nullAddress, contractsFixture.accounts[2] if withSelf else contractsFixture.accounts[1] , contractsFixture.accounts[2]],
	    "uint256Data": [60, 0, YES, 0, 0, 0, fix(2),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orders = [rawZeroXOrderData]
    signatures = [signature]
    assert cash.faucet(fix(2, 40), sender=contractsFixture.accounts[2])
    if not withSelf:
        with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
            with TokenDelta(yesShareToken, fix(2), sender, "Creator Shares not received"):
                with TokenDelta(noShareToken, fix(2), contractsFixture.accounts[2], "Taker Shares not received"):
                    with TokenDelta(cash, -fix(2, 60), sender, "Creator cash not taken"):
                        with TokenDelta(cash, -fix(2, 40), contractsFixture.accounts[2], "Taker cash not taken"):
                            assert zeroXTradeToken.trade(fix(2), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0
    else:
        assert zeroXTradeToken.trade(fix(2), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == fix(2)

def test_one_bid_on_books_buy_partial_order(contractsFixture, cash, market):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # create signed order
    cash.faucet(fix('2', '60'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData, orderHash = zeroXTradeToken.createZeroXOrder(BID, fix(2), 60, market.address, YES, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature = signOrder(orderHash, contractsFixture.privateKeys[1])

    # fill signed order
    orderEventLog = {
	    "eventType": 3,
	    "addressData": [nullAddress, contractsFixture.accounts[1], contractsFixture.accounts[2]],
	    "uint256Data": [60, 0, YES, 0, 0, 0, fix(1),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orders = [rawZeroXOrderData]
    signatures = [signature]
    cash.faucet(fix('1', '40'), sender=contractsFixture.accounts[2])
    expectedAmountRemaining = fix(1)
    with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
        with TokenDelta(yesShareToken, fix(1), contractsFixture.accounts[1], "Creator Shares not received"):
            with TokenDelta(noShareToken, fix(1), contractsFixture.accounts[2], "Taker Shares not received"):
                with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[1], "Creator cash not taken"):
                    with TokenDelta(cash, -fix(1, 40), contractsFixture.accounts[2], "Taker cash not taken"):
                        assert zeroXTradeToken.trade(fix(1), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

def test_two_bids_on_books_buy_both(contractsFixture, cash, market):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # create signed order 1
    cash.faucet(fix('4', '60'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = zeroXTradeToken.createZeroXOrder(BID, fix(4), 60, market.address, YES, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = zeroXTradeToken.createZeroXOrder(BID, fix(1), 60, market.address, YES, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    cash.faucet(fix('5', '40'), sender=contractsFixture.accounts[2])
    with TokenDelta(yesShareToken, fix(4), contractsFixture.accounts[1], "Creator Shares not received"):
        with TokenDelta(yesShareToken, fix(1), contractsFixture.accounts[3], "Creator Shares not received"):
            with TokenDelta(noShareToken, fix(5), contractsFixture.accounts[2], "Taker Shares not received"):
                with TokenDelta(cash, -fix(4, 60), contractsFixture.accounts[1], "Creator cash not taken"):
                    with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[3], "Creator cash not taken"):
                        with TokenDelta(cash, -fix(5, 40), contractsFixture.accounts[2], "Taker cash not taken"):
                            assert zeroXTradeToken.trade(fix(5), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

def test_two_bids_on_books_buy_full_and_partial(contractsFixture, cash, market, universe):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # create signed order 1
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = zeroXTradeToken.createZeroXOrder(BID, fix(1), 60, market.address, YES, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('4', '60'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = zeroXTradeToken.createZeroXOrder(BID, fix(4), 60, market.address, YES, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    cash.faucet(fix('3', '40'), sender=contractsFixture.accounts[2])
    with TokenDelta(yesShareToken, fix(1), contractsFixture.accounts[1], "Creator Shares not received"):
        with TokenDelta(yesShareToken, fix(2), contractsFixture.accounts[3], "Creator Shares not received"):
            with TokenDelta(noShareToken, fix(3), contractsFixture.accounts[2], "Taker Shares not received"):
                with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[1], "Creator cash not taken"):
                    with TokenDelta(cash, -fix(2, 60), contractsFixture.accounts[3], "Creator cash not taken"):
                        with TokenDelta(cash, -fix(3, 40), contractsFixture.accounts[2], "Taker cash not taken"):
                            assert zeroXTradeToken.trade(fix(3), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

def test_one_ask_on_books_buy_full_order(contractsFixture, cash, market, universe):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # create signed order
    sender = contractsFixture.accounts[1]
    senderPrivateKey = contractsFixture.privateKeys[1]
    cash.faucet(fix('2', '40'), sender=sender)
    rawZeroXOrderData, orderHash = zeroXTradeToken.createZeroXOrder(ASK, fix(2), 60, market.address, YES, nullAddress, expirationTime, salt, sender=sender)
    signature = signOrder(orderHash, senderPrivateKey)

    # fill signed order
    orderEventLog = {
        "eventType": 3,
        "addressData": [nullAddress, contractsFixture.accounts[1] , contractsFixture.accounts[2]],
        "uint256Data": [60, 0, YES, 0, 0, 0, fix(2),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orders = [rawZeroXOrderData]
    signatures = [signature]
    assert cash.faucet(fix(2, 60), sender=contractsFixture.accounts[2])
    with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
        with TokenDelta(noShareToken, fix(2), sender, "Creator Shares not received"):
            with TokenDelta(yesShareToken, fix(2), contractsFixture.accounts[2], "Taker Shares not received"):
                with TokenDelta(cash, -fix(2, 40), sender, "Creator cash not taken"):
                    with TokenDelta(cash, -fix(2, 60), contractsFixture.accounts[2], "Taker cash not taken"):
                        assert zeroXTradeToken.trade(fix(2), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

def test_one_ask_on_books_buy_partial_order(contractsFixture, cash, market, universe):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # create signed order
    sender = contractsFixture.accounts[1]
    senderPrivateKey = contractsFixture.privateKeys[1]
    cash.faucet(fix('4', '40'), sender=sender)
    rawZeroXOrderData, orderHash = zeroXTradeToken.createZeroXOrder(ASK, fix(4), 60, market.address, YES, nullAddress, expirationTime, salt, sender=sender)
    signature = signOrder(orderHash, senderPrivateKey)

    # fill signed order
    orderEventLog = {
        "eventType": 3,
        "addressData": [nullAddress, contractsFixture.accounts[1] , contractsFixture.accounts[2]],
        "uint256Data": [60, 0, YES, 0, 0, 0, fix(2),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    orders = [rawZeroXOrderData]
    signatures = [signature]
    assert cash.faucet(fix(2, 60), sender=contractsFixture.accounts[2])
    with AssertLog(contractsFixture, "OrderEvent", orderEventLog):
        with TokenDelta(noShareToken, fix(2), sender, "Creator Shares not received"):
            with TokenDelta(yesShareToken, fix(2), contractsFixture.accounts[2], "Taker Shares not received"):
                with TokenDelta(cash, -fix(2, 40), sender, "Creator cash not taken"):
                    with TokenDelta(cash, -fix(2, 60), contractsFixture.accounts[2], "Taker cash not taken"):
                        assert zeroXTradeToken.trade(fix(2), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

def test_two_asks_on_books_buy_both(contractsFixture, cash, market, universe):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # create signed order 1
    cash.faucet(fix('4', '40'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = zeroXTradeToken.createZeroXOrder(ASK, fix(4), 60, market.address, YES, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('1', '40'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = zeroXTradeToken.createZeroXOrder(ASK, fix(1), 60, market.address, YES, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    cash.faucet(fix('5', '60'), sender=contractsFixture.accounts[2])
    with TokenDelta(noShareToken, fix(4), contractsFixture.accounts[1], "Creator Shares not received"):
        with TokenDelta(noShareToken, fix(1), contractsFixture.accounts[3], "Creator Shares not received"):
            with TokenDelta(yesShareToken, fix(5), contractsFixture.accounts[2], "Taker Shares not received"):
                with TokenDelta(cash, -fix(4, 40), contractsFixture.accounts[1], "Creator cash not taken"):
                    with TokenDelta(cash, -fix(1, 40), contractsFixture.accounts[3], "Creator cash not taken"):
                        with TokenDelta(cash, -fix(5, 60), contractsFixture.accounts[2], "Taker cash not taken"):
                            assert zeroXTradeToken.trade(fix(5), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

def test_two_asks_on_books_buy_full_and_partial(contractsFixture, cash, market):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # create signed order 1
    cash.faucet(fix('1', '40'), sender=contractsFixture.accounts[1])
    rawZeroXOrderData1, orderHash1 = zeroXTradeToken.createZeroXOrder(ASK, fix(1), 60, market.address, YES, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature1 = signOrder(orderHash1, contractsFixture.privateKeys[1])

    # create signed order 2
    cash.faucet(fix('4', '40'), sender=contractsFixture.accounts[3])
    rawZeroXOrderData2, orderHash2 = zeroXTradeToken.createZeroXOrder(ASK, fix(4), 60, market.address, YES, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[3])
    signature2 = signOrder(orderHash2, contractsFixture.privateKeys[3])

    orders = [rawZeroXOrderData1, rawZeroXOrderData2]
    signatures = [signature1, signature2]

    # fill signed orders
    cash.faucet(fix('3', '60'), sender=contractsFixture.accounts[2])
    with TokenDelta(noShareToken, fix(1), contractsFixture.accounts[1], "Creator Shares not received"):
        with TokenDelta(noShareToken, fix(2), contractsFixture.accounts[3], "Creator Shares not received"):
            with TokenDelta(yesShareToken, fix(3), contractsFixture.accounts[2], "Taker Shares not received"):
                with TokenDelta(cash, -fix(1, 40), contractsFixture.accounts[1], "Creator cash not taken"):
                    with TokenDelta(cash, -fix(2, 40), contractsFixture.accounts[3], "Creator cash not taken"):
                        with TokenDelta(cash, -fix(3, 60), contractsFixture.accounts[2], "Taker cash not taken"):
                            assert zeroXTradeToken.trade(fix(3), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

def test_take_order_with_shares_buy_with_cash(contractsFixture, cash, market, universe):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    completeSets = contractsFixture.contracts['CompleteSets']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    yesShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(YES))
    noShareToken = contractsFixture.applySignature("ShareToken", market.getShareToken(NO))

    # buy complete sets
    account = contractsFixture.accounts[1]
    with BuyWithCash(cash, fix('1', '100'), account, "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=account)
    assert yesShareToken.balanceOf(account) == fix(1)

    # create signed order
    cash.faucet(fix('1', '40'), sender=account)
    rawZeroXOrderData, orderHash = zeroXTradeToken.createZeroXOrder(ASK, fix(1), 60, market.address, YES, nullAddress, expirationTime, salt, sender=account)
    signature = signOrder(orderHash, contractsFixture.privateKeys[1])

    # fill order with cash and see that the creator has shares taken
    orders = [rawZeroXOrderData]
    signatures = [signature]
    cash.faucet(fix('1', '60'), sender=contractsFixture.accounts[2])
    with TokenDelta(yesShareToken, -fix(1), account, "Creator Shares not taken"):
        with TokenDelta(yesShareToken, fix(1), contractsFixture.accounts[2], "Taker Shares not received"):
            with TokenDelta(cash, fix(1, 60), account, "Creator cash not received"):
                with TokenDelta(cash, -fix(1, 60), contractsFixture.accounts[2], "Taker cash not taken"):
                    assert zeroXTradeToken.trade(fix(1), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

def test_take_best_order_with_shares_escrowed_buy_with_shares_categorical(contractsFixture, cash, categoricalMarket, universe):
    market = categoricalMarket
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    completeSets = contractsFixture.contracts['CompleteSets']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)

    firstShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    secondShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(1))
    thirdShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(2))

    # buy complete sets for both users
    numTicks = market.getNumTicks()
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[1], "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[2], "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[2])
    assert firstShareToken.balanceOf(contractsFixture.accounts[1]) == firstShareToken.balanceOf(contractsFixture.accounts[2]) == fix(1)
    assert secondShareToken.balanceOf(contractsFixture.accounts[1]) == secondShareToken.balanceOf(contractsFixture.accounts[2]) == fix(1)
    assert thirdShareToken.balanceOf(contractsFixture.accounts[1]) == thirdShareToken.balanceOf(contractsFixture.accounts[2]) == fix(1)

    # create signed order
    rawZeroXOrderData, orderHash = zeroXTradeToken.createZeroXOrder(ASK, fix(1), 60, market.address, 0, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature = signOrder(orderHash, contractsFixture.privateKeys[1])

    # fill order with shares and see payouts occur
    orders = [rawZeroXOrderData]
    signatures = [signature]
    totalProceeds = fix(1, numTicks)
    totalProceeds -= fix(1, numTicks) / market.getMarketCreatorSettlementFeeDivisor()
    totalProceeds -= fix(1, numTicks) / universe.getOrCacheReportingFeeDivisor()
    expectedTester1Payout = totalProceeds * 60 / numTicks
    expectedTester2Payout = totalProceeds * (numTicks - 60) / numTicks
    with TokenDelta(cash, expectedTester1Payout, contractsFixture.accounts[1], "Tester 1 Cash delta wrong"):
        with TokenDelta(cash, expectedTester2Payout, contractsFixture.accounts[2], "Tester 2 Cash delta wrong"):
            assert zeroXTradeToken.trade(fix(1), nullAddress, tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

    assert firstShareToken.balanceOf(contractsFixture.accounts[1]) == 0
    assert secondShareToken.balanceOf(contractsFixture.accounts[1]) == fix(1)
    assert thirdShareToken.balanceOf(contractsFixture.accounts[1]) == fix(1)

    assert firstShareToken.balanceOf(contractsFixture.accounts[2]) == fix(1)
    assert secondShareToken.balanceOf(contractsFixture.accounts[2]) == 0
    assert thirdShareToken.balanceOf(contractsFixture.accounts[2]) == 0

@mark.parametrize(('finalized', 'invalid'), [
    (True, True),
    (False, True),
    (True, False),
    (False, False),
])
def test_fees_from_trades(finalized, invalid, contractsFixture, cash, market, universe):
    zeroXTradeToken = contractsFixture.contracts['ZeroXTradeToken']
    completeSets = contractsFixture.contracts['CompleteSets']
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    completeSets = contractsFixture.contracts['CompleteSets']
    firstShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    secondShareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(1))

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
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('1', numTicks), contractsFixture.accounts[2], "buy complete set"):
        assert completeSets.publicBuyCompleteSets(market.address, fix(1), sender=contractsFixture.accounts[2])
    assert firstShareToken.balanceOf(contractsFixture.accounts[1]) == firstShareToken.balanceOf(contractsFixture.accounts[2]) == fix(1)
    assert secondShareToken.balanceOf(contractsFixture.accounts[1]) == secondShareToken.balanceOf(contractsFixture.accounts[2]) == fix(1)

    # create order with shares
    rawZeroXOrderData, orderHash = zeroXTradeToken.createZeroXOrder(ASK, fix(1), 60, market.address, 0, nullAddress, expirationTime, salt, sender=contractsFixture.accounts[1])
    signature = signOrder(orderHash, contractsFixture.privateKeys[1])
    orders = [rawZeroXOrderData]
    signatures = [signature]

    expectedAffiliateFees = fix(100) / 400
    cash.faucet(fix(60), sender=contractsFixture.accounts[2])
    # Trade and specify an affiliate address.
    if finalized:
        if invalid:
            nextDisputeWindowAddress = universe.getOrCreateNextDisputeWindow(False)
            totalFees = fix(100) / 50 # Market fees + reporting fees
            with TokenDelta(cash, totalFees, nextDisputeWindowAddress, "Dispute Window did not recieve the correct fees"):
                assert zeroXTradeToken.trade(fix(1), contractsFixture.accounts[3], tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0
        else:
            with TokenDelta(cash, expectedAffiliateFees, contractsFixture.accounts[3], "Affiliate did not recieve the correct fees"):
                assert zeroXTradeToken.trade(fix(1), contractsFixture.accounts[3], tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0
    else:
        assert zeroXTradeToken.trade(fix(1), contractsFixture.accounts[3], tradeGroupID, orders, signatures, sender=contractsFixture.accounts[2]) == 0

    assert firstShareToken.balanceOf(contractsFixture.accounts[1]) == 0
    assert secondShareToken.balanceOf(contractsFixture.accounts[1]) == fix(1)

    # The second user sold the complete set they ended up holding from this transaction, which extracts fees
    assert firstShareToken.balanceOf(contractsFixture.accounts[2]) == fix(1)
    assert secondShareToken.balanceOf(contractsFixture.accounts[2]) == fix(0)

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

# TODO test kyc token
# TODO test order creator not having funds