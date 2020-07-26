#!/usr/bin/env python

import math

from utils import fix, AssertLog, longTo32Bytes, longToHexString, stringToBytes, BuyWithCash, nullAddress
from constants import BID, ASK, LONG, SHORT, YES
from pytest import mark
from old_eth_utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad


INVALID = 0
A = 1
B = 2
C = 3

@mark.parametrize('taker', [
    True,
    False
])
def test_binary_and_claim(taker, contractsFixture, cash, market, universe):
    zeroXTrade = contractsFixture.contracts["ZeroXTrade"]
    profitLoss = contractsFixture.contracts["ProfitLoss"]
    shareToken = contractsFixture.contracts['ShareToken']
    augurTrading = contractsFixture.contracts['AugurTrading']
    test_data = [
        {
            "direction": SHORT,
            "outcome": YES,
            "quantity": 10,
            "price": .65,
            "position": -10,
            "avgPrice": .65,
            "realizedPL": 0,
            "frozenFunds": 3.5
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 3,
            "price": .58,
            "position": -7,
            "avgPrice": .65,
            "realizedPL": .192426, # .21 - fees
            "frozenFunds": 2.45
        }, {
            "direction": SHORT,
            "outcome": YES,
            "quantity": 13,
            "price": .62,
            "position": -20,
            "avgPrice": .6305,
            "realizedPL": .192426,
            "frozenFunds": 7.39
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 10,
            "price": .5,
            "position": -10,
            "avgPrice": .6305,
            "realizedPL": 1.446926, # 1.51 - fees
            "frozenFunds": 3.695
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 7,
            "price": .15,
            "position": -3,
            "avgPrice": .6305,
            "realizedPL": 4.799821,
            "frozenFunds": 1.1085
        }
    ]

    process_trades(contractsFixture, test_data, cash, market, zeroXTrade, profitLoss, taker)

    contractsFixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)
    market.doInitialReport([0, 0, market.getNumTicks()], "", 0)
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Claim proceeds
    augurTrading.claimTradingProceeds(market.address, contractsFixture.accounts[1], longTo32Bytes(11))
    augurTrading.claimTradingProceeds(market.address, contractsFixture.accounts[2], longTo32Bytes(11))

    account1 = contractsFixture.accounts[1] if taker else contractsFixture.accounts[2]
    account2 = contractsFixture.accounts[2] if taker else contractsFixture.accounts[1]

    assert profitLoss.getNetPosition(market.address, account1, YES) == 0
    assert profitLoss.getAvgPrice(market.address, account1, YES) == 0
    assert roughlyEqual(profitLoss.getRealizedProfit(market.address, account1, YES), -3893.321 * 10**36)
    assert profitLoss.getFrozenFunds(market.address, account1, YES) == 0

    assert profitLoss.getNetPosition(market.address, account2, YES) == 0
    assert profitLoss.getAvgPrice(market.address, account2, YES) == 0
    assert roughlyEqual(profitLoss.getRealizedProfit(market.address, account2, YES), 3691.321 * 10**36)
    assert profitLoss.getFrozenFunds(market.address, account2, YES) == 0

@mark.parametrize('taker', [
    True,
    False
])
def test_cat3_1(taker, contractsFixture, cash, categoricalMarket, universe):
    zeroXTrade = contractsFixture.contracts["ZeroXTrade"]
    profitLoss = contractsFixture.contracts["ProfitLoss"]
    test_data = [
        {
            "direction": LONG,
            "outcome": A,
            "quantity": 1,
            "price": .4,
            "position": 1,
            "avgPrice": .4,
            "realizedPL": 0,
            "frozenFunds": 0.4
        }, {
            "direction": SHORT,
            "outcome": B,
            "quantity": 2,
            "price": .2,
            "position": -2,
            "avgPrice": .2,
            "realizedPL": 0,
            "frozenFunds": 1.6
        }, {
            "direction": LONG,
            "outcome": C,
            "quantity": 1,
            "price": .3,
            "position": 1,
            "avgPrice": .3,
            "realizedPL": 0,
            "frozenFunds": .3
        }, {
            "direction": SHORT,
            "outcome": A,
            "quantity": 1,
            "price": .7,
            "position": 0,
            "avgPrice": 0,
            "realizedPL": .3,
            "frozenFunds": 0
        }
    ]

    process_trades(contractsFixture, test_data, cash, categoricalMarket, zeroXTrade, profitLoss, taker)

@mark.parametrize('taker', [
    True,
    False
])
def test_cat3_2(taker, contractsFixture, cash, categoricalMarket, universe):
    zeroXTrade = contractsFixture.contracts["ZeroXTrade"]
    profitLoss = contractsFixture.contracts["ProfitLoss"]
    test_data = [
        {
            "direction": SHORT,
            "outcome": A,
            "quantity": 5,
            "price": .4,
            "position": -5,
            "avgPrice": .4,
            "realizedPL": 0,
            "frozenFunds": 3
        }, {
            "direction": SHORT,
            "outcome": B,
            "quantity": 3,
            "price": .35,
            "position": -3,
            "avgPrice": .35,
            "realizedPL": 0,
            "frozenFunds": -1.05
        }, {
            "direction": SHORT,
            "outcome": C,
            "quantity": 10,
            "price": .3,
            "position": -10,
            "avgPrice": .3,
            "realizedPL": 0,
            "frozenFunds": 2
        }, {
            "direction": LONG,
            "outcome": C,
            "quantity": 8,
            "price": .1,
            "position": -2,
            "avgPrice": .3,
            "realizedPL": 1.59495,
            "frozenFunds": -0.6
        }
    ]

    process_trades(contractsFixture, test_data, cash, categoricalMarket, zeroXTrade, profitLoss, taker)

@mark.parametrize('taker', [
    True,
    False
])
def test_cat3_3(taker, contractsFixture, cash, categoricalMarket, universe):
    zeroXTrade = contractsFixture.contracts["ZeroXTrade"]
    profitLoss = contractsFixture.contracts["ProfitLoss"]
    test_data = [
        {
            "direction": LONG,
            "outcome": INVALID,
            "quantity": 5,
            "price": .05,
            "position": 5,
            "avgPrice": .05,
            "realizedPL": 0,
            "frozenFunds": .25
        },
        {
            "direction": LONG,
            "outcome": A,
            "quantity": 10,
            "price": .15,
            "position": 10,
            "avgPrice": .15,
            "realizedPL": 0,
            "frozenFunds": 1.5
        }, {
            "direction": LONG,
            "outcome": B,
            "quantity": 25,
            "price": .1,
            "position": 25,
            "avgPrice": .1,
            "realizedPL": 0,
            "frozenFunds": 2.5
        }, {
            "direction": LONG,
            "outcome": C,
            "quantity": 5,
            "price": .6,
            "position": 5,
            "avgPrice": .6,
            "realizedPL": -.0303, # Loss on fees
            "frozenFunds": -2
        }, {
            "direction": SHORT,
            "outcome": B,
            "quantity": 13,
            "price": .2,
            "position": 12,
            "avgPrice": .1,
            "realizedPL": 1.19496,
            "frozenFunds": 1.2
        }, {
            "direction": SHORT,
            "outcome": C,
            "quantity": 3,
            "price": .8,
            "position": 2,
            "avgPrice": .6,
            "realizedPL": .5697,
            "frozenFunds": -0.8
        }, {
            "direction": SHORT,
            "outcome": A,
            "quantity": 10,
            "price": .1,
            "position": 0,
            "avgPrice": 0,
            "realizedPL": -.5,
            "frozenFunds": 2
        }
    ]

    process_trades(contractsFixture, test_data, cash, categoricalMarket, zeroXTrade, profitLoss, taker)

@mark.parametrize('taker', [
    True,
    False
])
def test_scalar(taker, contractsFixture, cash, universe):
    scalarMarket = contractsFixture.createReasonableScalarMarket(universe, 250 * 10**18, 50 * 10**18, 2000000)
    zeroXTrade = contractsFixture.contracts["ZeroXTrade"]
    profitLoss = contractsFixture.contracts["ProfitLoss"]
    test_data = [
        {
            "direction": LONG,
            "outcome": YES,
            "quantity": 2,
            "price": 200,
            "position": 2,
            "avgPrice": 200,
            "realizedPL": 0,
            "frozenFunds": 300
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 3,
            "price": 180,
            "position": 5,
            "avgPrice": 188,
            "realizedPL": 0,
            "frozenFunds": 690
        }, {
            "direction": SHORT,
            "outcome": YES,
            "quantity": 4,
            "price": 202,
            "position": 1,
            "avgPrice": 188,
            "realizedPL": 54.0608,
            "frozenFunds": 138
        }, {
            "direction": SHORT,
            "outcome": YES,
            "quantity": 11,
            "price": 205,
            "position": -10,
            "avgPrice": 205,
            "realizedPL": 70.6063,
            "frozenFunds": 450
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 7,
            "price": 150,
            "position": -3,
            "avgPrice": 205,
            "realizedPL": 448.5363,
            "frozenFunds": 135
        }
    ]

    process_trades(contractsFixture, test_data, cash, scalarMarket, zeroXTrade, profitLoss, taker, 50, 200, 10**27)

def process_trades(contractsFixture, trade_data, cash, market, zeroXTrade, profitLoss, taker, minPrice = 0, displayRange = 1, PLTolerance = 10**24):
    for trade in trade_data:
        quantity = trade['quantity'] * 10**18
        onChainLongPrice = int(round((trade['price'] - minPrice) * market.getNumTicks() / displayRange))
        onChainShortPrice = int(round(market.getNumTicks() - onChainLongPrice))
        direction = BID if trade['direction'] == SHORT else ASK
        direction = direction if taker else ASK if trade['direction'] == SHORT else BID
        longCost = quantity * onChainLongPrice
        shortCost = quantity * onChainShortPrice
        creatorCost = longCost if direction == BID else shortCost
        fillerCost = longCost if direction == ASK else shortCost
        expirationTime = contractsFixture.contracts["Time"].getTimestamp() + 1000000
        salt = 42

        assert cash.faucet(creatorCost, sender = contractsFixture.accounts[1])

        rawZeroXOrderData, orderHash = zeroXTrade.createZeroXOrder(direction, quantity, onChainLongPrice, market.address, trade['outcome'], expirationTime, salt, sender = contractsFixture.accounts[1])
        signature = signOrder(orderHash, contractsFixture.privateKeys[1])

        timestamp = contractsFixture.contracts["Augur"].getTimestamp()

        profitLossChangedLog = {
            "outcome": trade['outcome'],
            "timestamp": timestamp,
        }

        fingerprint = longTo32Bytes(11)
        tradeGroupId = longTo32Bytes(42)
        orders = [rawZeroXOrderData]
        signatures = [signature]

        assert cash.faucet(fillerCost, sender = contractsFixture.accounts[2])
        skip = 0 if direction == BID else 1
        skip = skip if taker else (1 if direction == BID else 0)
        with AssertLog(contractsFixture, "ProfitLossChanged", profitLossChangedLog, skip = skip):
            zeroXTrade.trade(quantity, fingerprint, tradeGroupId, 0, 10, orders, signatures, sender=contractsFixture.accounts[2], value=150000)

        avgPrice = (trade['avgPrice'] - minPrice) * market.getNumTicks() / displayRange * 10**18
        realizedProfit = trade['realizedPL'] * market.getNumTicks() / displayRange * 10**36
        frozenFunds = trade['frozenFunds'] * market.getNumTicks() / displayRange * 10**36

        account = contractsFixture.accounts[2] if taker else contractsFixture.accounts[1]
        assert profitLoss.getNetPosition(market.address, account, trade['outcome']) == trade['position'] * 10**18
        assert roughlyEqual(profitLoss.getAvgPrice(market.address, account, trade['outcome']), avgPrice, 10**6)
        assert roughlyEqual(profitLoss.getRealizedProfit(market.address, account, trade['outcome']), realizedProfit, PLTolerance)
        assert roughlyEqual(profitLoss.getFrozenFunds(market.address, account, trade['outcome']), frozenFunds)

def signOrder(orderHash, private_key, signaturePostFix="03"):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + orderHash), key)
    return "0x" + v.to_bytes(1, "big").hex() + (zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32) + zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)).hex() + signaturePostFix

def roughlyEqual(amount1, amount2, tolerance=10**24):
    return abs(amount1 - amount2) < tolerance