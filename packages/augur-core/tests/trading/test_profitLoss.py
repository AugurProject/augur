#!/usr/bin/env python

import math

from utils import fix, AssertLog, longTo32Bytes, longToHexString, stringToBytes, BuyWithCash, nullAddress
from constants import BID, ASK, LONG, SHORT, YES

INVALID = 0
A = 1
B = 2
C = 3

def test_binary_and_claim(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
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
            "realizedPL": .193, # .21 - .017 from fees
            "frozenFunds": 2.45
        }, {
            "direction": SHORT,
            "outcome": YES,
            "quantity": 13,
            "price": .62,
            "position": -20,
            "avgPrice": .6305,
            "realizedPL": .193,
            "frozenFunds": 7.39
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 10,
            "price": .5,
            "position": -10,
            "avgPrice": .6305,
            "realizedPL": 1.448,
            "frozenFunds": 3.695
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 7,
            "price": .15,
            "position": -3,
            "avgPrice": .6305,
            "realizedPL": 4.8015,
            "frozenFunds": 1.1085
        }
    ]

    process_trades(contractsFixture, test_data, cash, market, createOrder, fillOrder, profitLoss)

    contractsFixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)
    market.doInitialReport([0, 0, market.getNumTicks()], "", 0)
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Claim proceeds
    augurTrading.claimTradingProceeds(market.address, contractsFixture.accounts[1], longTo32Bytes(11))
    augurTrading.claimTradingProceeds(market.address, contractsFixture.accounts[2], longTo32Bytes(11))

    assert profitLoss.getNetPosition(market.address, contractsFixture.accounts[1], YES) == 0
    assert profitLoss.getAvgPrice(market.address, contractsFixture.accounts[1], YES) == 0
    assert roughlyEqual(profitLoss.getRealizedProfit(market.address, contractsFixture.accounts[1], YES), -3894 * 10**18)
    assert profitLoss.getFrozenFunds(market.address, contractsFixture.accounts[1], YES) == 0

    assert profitLoss.getNetPosition(market.address, contractsFixture.accounts[2], YES) == 0
    assert profitLoss.getAvgPrice(market.address, contractsFixture.accounts[2], YES) == 0
    assert roughlyEqual(profitLoss.getRealizedProfit(market.address, contractsFixture.accounts[2], YES), 3693 * 10**18)
    assert profitLoss.getFrozenFunds(market.address, contractsFixture.accounts[2], YES) == 0

def test_simple(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
    profitLoss = contractsFixture.contracts["ProfitLoss"]
    shareToken = contractsFixture.contracts['ShareToken']
    augurTrading = contractsFixture.contracts['AugurTrading']
    test_data = [
        {
            "direction": LONG,
            "outcome": YES,
            "quantity": 10,
            "price": .15,
            "position": 10,
            "avgPrice": .15,
            "realizedPL": 0,
            "frozenFunds": 1.5
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 10,
            "price": .18,
            "position": 20,
            "avgPrice": .165,
            "realizedPL": 0,
            "frozenFunds": 3.3
        }
    ]

    process_trades(contractsFixture, test_data, cash, market, createOrder, fillOrder, profitLoss)

def test_cat3_1(contractsFixture, cash, categoricalMarket, universe):
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
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

    process_trades(contractsFixture, test_data, cash, categoricalMarket, createOrder, fillOrder, profitLoss)

def test_cat3_2(contractsFixture, cash, categoricalMarket, universe):
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
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
            "realizedPL": 1.595,
            "frozenFunds": -0.6
        }
    ]

    process_trades(contractsFixture, test_data, cash, categoricalMarket, createOrder, fillOrder, profitLoss)

def test_cat3_3(contractsFixture, cash, categoricalMarket, universe):
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
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
            "realizedPL": -.03,
            "frozenFunds": -2
        }, {
            "direction": SHORT,
            "outcome": B,
            "quantity": 13,
            "price": .2,
            "position": 12,
            "avgPrice": .1,
            "realizedPL": 1.195,
            "frozenFunds": 1.2
        }, {
            "direction": SHORT,
            "outcome": C,
            "quantity": 3,
            "price": .8,
            "position": 2,
            "avgPrice": .6,
            "realizedPL": .57,
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

    process_trades(contractsFixture, test_data, cash, categoricalMarket, createOrder, fillOrder, profitLoss)

def test_scalar(contractsFixture, cash, universe):
    scalarMarket = contractsFixture.createReasonableScalarMarket(universe, 250 * 10**18, 50 * 10**18, 2000000)
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
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

    process_trades(contractsFixture, test_data, cash, scalarMarket, createOrder, fillOrder, profitLoss, 50, 200)

def test_frozen_funds(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
    profitLoss = contractsFixture.contracts["ProfitLoss"]
    orders = contractsFixture.contracts["Orders"]
    cancelOrder = contractsFixture.contracts["CancelOrder"]

    amount = fix(1)
    price = 10
    cost = fix(10)
    outcome = 1

    # Create Order
    profitLossChangedLog = {
        "outcome": outcome,
        "netPosition": 0,
        "avgPrice": 0,
        "realizedProfit": 0,
        "frozenFunds": cost * 10**18,
    }

    assert cash.faucet(cost)

    with AssertLog(contractsFixture, "ProfitLossChanged", profitLossChangedLog):
        orderID = createOrder.publicCreateOrder(BID, amount, price, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress)

    assert profitLoss.getFrozenFunds(market.address, contractsFixture.accounts[0], outcome) == cost * 10**18

    # Cancel Order
    profitLossChangedLog = {
        "outcome": outcome,
        "netPosition": 0,
        "avgPrice": 0,
        "realizedProfit": 0,
        "frozenFunds": 0,
    }

    with AssertLog(contractsFixture, "ProfitLossChanged", profitLossChangedLog):
        orderID = cancelOrder.cancelOrder(orderID)

    assert profitLoss.getFrozenFunds(market.address, contractsFixture.accounts[0], outcome) == 0

    # Create Order
    orderID = createOrder.publicCreateOrder(BID, amount, price, market.address, outcome, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress)

    # Fill Order
    profitLossChangedLog = {
        "outcome": outcome,
        "netPosition": amount,
        "avgPrice": 10**19,
        "realizedProfit": 0,
        "frozenFunds": cost * 10**18,
    }

    fillerCost = (market.getNumTicks() - price) * amount

    assert cash.faucet(fillerCost, sender = contractsFixture.accounts[2])
    with AssertLog(contractsFixture, "ProfitLossChanged", profitLossChangedLog, skip=1):
        fillOrder.publicFillOrder(orderID, amount, longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])

    assert profitLoss.getFrozenFunds(market.address, contractsFixture.accounts[0], outcome) == cost * 10**18

    # Create new Order
    newOutcome = 2
    assert cash.faucet(cost)
    orderID = createOrder.publicCreateOrder(BID, amount, price, market.address, newOutcome, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress)

    # Fill own Order. This should make FF 0
    profitLossChangedLog = {
        "outcome": newOutcome,
        "netPosition": 0,
        "avgPrice": 0,
        "realizedProfit": 0,
        "frozenFunds": 0,
    }

    fillerCost = (market.getNumTicks() - price) * amount

    assert cash.faucet(fillerCost)
    with AssertLog(contractsFixture, "ProfitLossChanged", profitLossChangedLog, skip=2):
        fillOrder.publicFillOrder(orderID, amount, longTo32Bytes(42), longTo32Bytes(11))

    assert profitLoss.getFrozenFunds(market.address, contractsFixture.accounts[0], newOutcome) == 0

def process_trades(contractsFixture, trade_data, cash, market, createOrder, fillOrder, profitLoss, minPrice = 0, displayRange = 1):
    for trade in trade_data:
        onChainLongPrice = int(round((trade['price'] - minPrice) * market.getNumTicks() / displayRange))
        onChainShortPrice = int(round(market.getNumTicks() - onChainLongPrice))
        direction = BID if trade['direction'] == SHORT else ASK
        longCost = trade['quantity'] * onChainLongPrice
        shortCost = trade['quantity'] * onChainShortPrice
        creatorCost = longCost if direction == BID else shortCost
        fillerCost = longCost if direction == ASK else shortCost

        assert cash.faucet(creatorCost, sender = contractsFixture.accounts[1])
        orderID = createOrder.publicCreateOrder(direction, trade['quantity'], onChainLongPrice, market.address, trade['outcome'], longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender = contractsFixture.accounts[1])

        timestamp = contractsFixture.contracts["Augur"].getTimestamp()

        profitLossChangedLog = {
            "outcome": trade['outcome'],
            "timestamp": timestamp,
        }

        assert cash.faucet(fillerCost, sender = contractsFixture.accounts[2])
        with AssertLog(contractsFixture, "ProfitLossChanged", profitLossChangedLog, skip = 0 if direction == BID else 1):
            fillOrder.publicFillOrder(orderID, trade['quantity'], longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])

        avgPrice = (trade['avgPrice'] - minPrice) * market.getNumTicks() / displayRange * 10**18
        realizedProfit = trade['realizedPL'] * market.getNumTicks() / displayRange * 10**18
        frozenFunds = trade['frozenFunds'] * market.getNumTicks() / displayRange * 10**18

        assert profitLoss.getNetPosition(market.address, contractsFixture.accounts[2], trade['outcome']) == trade['position']
        assert roughlyEqual(profitLoss.getAvgPrice(market.address, contractsFixture.accounts[2], trade['outcome']), avgPrice)
        assert roughlyEqual(profitLoss.getRealizedProfit(market.address, contractsFixture.accounts[2], trade['outcome']), realizedProfit)
        assert roughlyEqual(profitLoss.getFrozenFunds(market.address, contractsFixture.accounts[2], trade['outcome']), frozenFunds)

def roughlyEqual(amount1, amount2, tolerance=10**6):
    return abs(amount1 - amount2) < tolerance