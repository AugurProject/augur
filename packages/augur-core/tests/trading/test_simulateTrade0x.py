#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from utils import longTo32Bytes, longToHexString, fix, AssertLog, stringToBytes, EtherDelta, PrintGasUsed, BuyWithCash, TokenDelta, nullAddress
from constants import ASK, BID, YES, NO, LONG, SHORT
from pytest import raises, mark
from decimal import Decimal
from old_eth_utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad

def signOrder(orderHash, private_key):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + orderHash), key)
    return "0x" + v.to_bytes(1, "big").hex() + (zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32) + zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)).hex() + "03"

def test_simple_simulate(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5

    account1 = contractsFixture.accounts[0]
    account2 = contractsFixture.accounts[1]

    direction = BID
    outcome = YES
    amount = fix(1)
    price = 60
    ignoreShares = False
    kycToken = nullAddress
    fillOnly = False
    fillerPrice = market.getNumTicks() - price

    # Create zeroX Signed Order
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(direction, amount, price, market.address, outcome, kycToken, expirationTime, salt, sender=account1)
    orders = [rawZeroXOrderData]

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateZeroXTrade(orders, amount, fillOnly, sender=account2)

    assert sharesFilled == amount
    assert tokensDepleted == amount * fillerPrice
    assert sharesDepleted == 0
    assert settlementFees == 0
    assert numFills == 1

def test_simple_trades_and_fees(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    account0 = contractsFixture.accounts[0]
    senderPrivateKey0 = contractsFixture.privateKeys[0]
    account1 = contractsFixture.accounts[1]
    senderPrivateKey1 = contractsFixture.privateKeys[1]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    fingerprint = longTo32Bytes(11)

    direction = LONG
    outcome = YES
    amount = fix(1)
    price = 40
    kycToken = nullAddress
    fillOnly = False
    numTicks = market.getNumTicks()
    cost = amount * price

    cash.faucet(cost)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(direction, amount, price, market.address, outcome, kycToken, expirationTime, salt, sender=account0)
    signature = signOrder(orderHash, senderPrivateKey0)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateZeroXTrade(orders, amount, fillOnly, sender=account1)

    fillPrice = numTicks - price
    cost = amount * fillPrice
    assert sharesFilled == amount
    assert tokensDepleted == cost
    assert sharesDepleted == 0
    assert settlementFees == 0
    assert numFills == 1

    cash.faucet(cost, sender=account1)
    assert ZeroXTrade.trade(amount, fingerprint, tradeGroupID, orders, signatures, sender=account1, value=150000) == 0

    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(SHORT, amount, price, market.address, outcome, kycToken, expirationTime, salt, sender=account0)
    signature = signOrder(orderHash, senderPrivateKey0)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateZeroXTrade(orders, amount, fillOnly, sender=account1)
    assert simulateTrade.getNumberOfAvaialableShares(LONG, market.address, outcome, account1) == fix(1)

    expectedValue = fix(1) * (numTicks - price)
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees

    assert sharesFilled == fix(1)
    assert tokensDepleted == 0
    assert sharesDepleted == fix(1)
    assert settlementFees == expectedSettlementFees
    assert numFills == 1

def test_partial_fill(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    cash = contractsFixture.contracts["Cash"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    
    direction = LONG
    outcome = YES
    amount = fix(1)
    price = 40
    kycToken = nullAddress
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    fillOnly = False    

    makerAccount = contractsFixture.accounts[1]
    makerPrivKey = contractsFixture.privateKeys[1]
    fillerAccount = contractsFixture.accounts[0]

    cash.faucet(amount*price, sender=makerAccount)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(direction, amount, price, market.address, outcome, kycToken, expirationTime, salt, sender=makerAccount)
    signature = signOrder(orderHash, makerPrivKey)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    simulate_then_trade(contractsFixture, market, outcome, direction, orders, signatures, amount / 2, fillOnly, fillerAccount)

def test_multiple_trades(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    cash = contractsFixture.contracts["Cash"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    
    direction = LONG
    outcome = YES
    amount = fix(1)
    kycToken = nullAddress
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    fillOnly = False    

    makerAccount = contractsFixture.accounts[1]
    makerPrivKey = contractsFixture.privateKeys[1]
    fillerAccount = contractsFixture.accounts[0]
    numOrders = 10
    orders = []
    signatures = []

    for i in range(numOrders):
        price = i + 1
        cash.faucet(amount*price, sender=makerAccount)
        rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(direction, amount, price, market.address, outcome, kycToken, expirationTime, salt, sender=makerAccount)
        signature = signOrder(orderHash, makerPrivKey)
        orders.append(rawZeroXOrderData)
        signatures.append(signature)

    simulate_then_trade(contractsFixture, market, outcome, direction, orders, signatures, (amount * numOrders) - fix(0.5), fillOnly, fillerAccount)

def test_kyc_token(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    cash = contractsFixture.contracts["Cash"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    
    direction = LONG
    outcome = YES
    amount = fix(1)
    price = 40
    kycToken = cash.address
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    fillOnly = False    

    makerAccount = contractsFixture.accounts[1]
    makerPrivKey = contractsFixture.privateKeys[1]
    fillerAccount = contractsFixture.accounts[0]

    cash.faucet(amount*price, sender=makerAccount)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(direction, amount, price, market.address, outcome, kycToken, expirationTime, salt, sender=makerAccount)
    signature = signOrder(orderHash, makerPrivKey)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    simulate_then_trade(contractsFixture, market, outcome, direction, orders, signatures, amount, fillOnly, fillerAccount)

def test_self_trade(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    cash = contractsFixture.contracts["Cash"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    
    direction = LONG
    outcome = YES
    amount = fix(1)
    price = 40
    kycToken = nullAddress
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    fillOnly = True    

    makerAccount = contractsFixture.accounts[0]
    makerPrivKey = contractsFixture.privateKeys[0]
    fillerAccount = contractsFixture.accounts[0]

    cash.faucet(amount*price, sender=makerAccount)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(direction, amount, price, market.address, outcome, kycToken, expirationTime, salt, sender=makerAccount)
    signature = signOrder(orderHash, makerPrivKey)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    simulate_then_trade(contractsFixture, market, outcome, direction, orders, signatures, amount, fillOnly, fillerAccount)

def test_fill_only(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    cash = contractsFixture.contracts["Cash"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    
    direction = LONG
    outcome = YES
    amount = fix(1)
    price = 40
    kycToken = nullAddress
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    fillOnly = True    

    makerAccount = contractsFixture.accounts[1]
    makerPrivKey = contractsFixture.privateKeys[1]
    fillerAccount = contractsFixture.accounts[0]

    cash.faucet(amount*price, sender=makerAccount)
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(direction, amount, price, market.address, outcome, kycToken, expirationTime, salt, sender=makerAccount)
    signature = signOrder(orderHash, makerPrivKey)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    simulate_then_trade(contractsFixture, market, outcome, direction, orders, signatures, amount * 2, fillOnly, fillerAccount)

def test_fees(contractsFixture, cash, market, universe):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    cash = contractsFixture.contracts["Cash"]
    shareToken = contractsFixture.contracts["ShareToken"]
    expirationTime = contractsFixture.contracts['Time'].getTimestamp() + 10000
    
    direction = SHORT
    outcome = YES
    amount = fix(1)
    price = 40
    kycToken = nullAddress
    salt = 5
    tradeGroupID = longTo32Bytes(42)
    fillOnly = False    

    makerAccount = contractsFixture.accounts[1]
    makerPrivKey = contractsFixture.privateKeys[1]
    fillerAccount = contractsFixture.accounts[0]

    expectedValue = amount * (market.getNumTicks() - price)
    expectedReporterFees = expectedValue / universe.getOrCacheReportingFeeDivisor()
    expectedMarketCreatorFees = expectedValue / market.getMarketCreatorSettlementFeeDivisor()
    expectedSettlementFees = expectedReporterFees + expectedMarketCreatorFees

    # Buy and distribute complete sets
    cash.faucet(amount * market.getNumTicks(), sender=makerAccount)
    shareToken.publicBuyCompleteSets(market.address, amount, sender=makerAccount)

    shareToken.safeTransferFrom(makerAccount, fillerAccount, shareToken.getTokenId(market.address, 0), amount, "", sender=makerAccount)
    shareToken.safeTransferFrom(makerAccount, fillerAccount, shareToken.getTokenId(market.address, NO), amount, "", sender=makerAccount)

    # Make order
    rawZeroXOrderData, orderHash = ZeroXTrade.createZeroXOrder(direction, amount, price, market.address, outcome, kycToken, expirationTime, salt, sender=makerAccount)
    signature = signOrder(orderHash, makerPrivKey)
    orders = [rawZeroXOrderData]
    signatures = [signature]

    simulate_then_trade(contractsFixture, market, outcome, direction, orders, signatures, amount, fillOnly, fillerAccount, expectedFees=expectedSettlementFees)

def simulate_then_trade(contractsFixture, market, outcome, orderDirection, orders, signatures, fillAmount, fillOnly, fillerAccount, expectedFees=0):
    ZeroXTrade = contractsFixture.contracts['ZeroXTrade']
    zeroXExchange = contractsFixture.contracts["ZeroXExchange"]
    simulateTrade = contractsFixture.contracts["SimulateTrade"]
    shareToken = contractsFixture.contracts["ShareToken"]
    cash = contractsFixture.contracts["Cash"]
    shareTokenOutcome = outcome if orderDirection == LONG else ((outcome + 1) % 3)
    tradeGroupID = longTo32Bytes(42)
    fingerprint = longTo32Bytes(11)

    (sharesFilled, tokensDepleted, sharesDepleted, settlementFees, numFills) = simulateTrade.simulateZeroXTrade(orders, fillAmount, fillOnly, sender=fillerAccount)

    cash.faucet(tokensDepleted, sender=fillerAccount)
    initialCashBalance = cash.balanceOf(fillerAccount)
    initialShareBalance = shareToken.balanceOfMarketOutcome(market.address, shareTokenOutcome, fillerAccount)

    expectedAmountRemaining = fillAmount - sharesFilled
    assert ZeroXTrade.trade(fillAmount, fingerprint, tradeGroupID, orders, signatures, sender=fillerAccount, value=150000*len(orders)) == expectedAmountRemaining 

    if (tokensDepleted > 0):
        assert tokensDepleted == initialCashBalance - cash.balanceOf(fillerAccount)
    if (sharesDepleted > 0):
        assert sharesDepleted == initialShareBalance - shareToken.balanceOfMarketOutcome(market.address, shareTokenOutcome, fillerAccount)

    expectedSharesFilled = 0
    expectedNumFills = 0
    orderEventLogs = contractsFixture.contracts["AugurTrading"].getLogs("OrderEvent")
    for log in orderEventLogs:
        if log.args.eventType == 2: # Fill Event
            expectedSharesFilled += log.args.uint256Data[6]
            expectedNumFills += 1

    assert sharesFilled == expectedSharesFilled
    assert settlementFees == expectedFees
    assert numFills == expectedNumFills
