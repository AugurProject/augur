#!/usr/bin/env python

import math
from ethereum.tools import tester
from utils import fix, bytesToHexString, AssertLog, longTo32Bytes, longToHexString, stringToBytes, BuyWithCash, nullAddress
from constants import BID, ASK, LONG, SHORT, YES

INVALID = 0
A = 1
B = 2
C = 3

def test_binary(contractsFixture, cash, market, universe):
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
    profitLoss = contractsFixture.contracts["ProfitLoss"]
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
            "realizedPL": .21,
            "frozenFunds": 2.45
        }, {
            "direction": SHORT,
            "outcome": YES,
            "quantity": 13,
            "price": .62,
            "position": -20,
            "avgPrice": .6305,
            "realizedPL": .21,
            "frozenFunds": 7.39
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 10,
            "price": .5,
            "position": -10,
            "avgPrice": .6305,
            "realizedPL": 1.515,
            "frozenFunds": 3.695
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 7,
            "price": .15,
            "position": -3,
            "avgPrice": .6305,
            "realizedPL": 4.8785,
            "frozenFunds": 1.1085
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
            "realizedPL": 1.6,
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
            "realizedPL": 0,
            "frozenFunds": -2
        }, {
            "direction": SHORT,
            "outcome": B,
            "quantity": 13,
            "price": .2,
            "position": 12,
            "avgPrice": .1,
            "realizedPL": 1.3,
            "frozenFunds": 1.2
        }, {
            "direction": SHORT,
            "outcome": C,
            "quantity": 3,
            "price": .8,
            "position": 2,
            "avgPrice": .6,
            "realizedPL": .6,
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
    scalarMarket = contractsFixture.createReasonableScalarMarket(universe, 250, 50, 2000000)
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
            "realizedPL": 56,
            "frozenFunds": 138
        }, {
            "direction": SHORT,
            "outcome": YES,
            "quantity": 11,
            "price": 205,
            "position": -10,
            "avgPrice": 205,
            "realizedPL": 73,
            "frozenFunds": 450
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 7,
            "price": 150,
            "position": -3,
            "avgPrice": 205,
            "realizedPL": 458,
            "frozenFunds": 135
        }
    ]

    process_trades(contractsFixture, test_data, cash, scalarMarket, createOrder, fillOrder, profitLoss, 50, 200)

def process_trades(contractsFixture, trade_data, cash, market, createOrder, fillOrder, profitLoss, minPrice = 0, displayRange = 1):
    for trade in trade_data:
        onChainLongPrice = int((trade['price'] - minPrice) * market.getNumTicks() / displayRange)
        onChainShortPrice = int(market.getNumTicks() - onChainLongPrice)
        direction = BID if trade['direction'] == SHORT else ASK
        longCost = trade['quantity'] * onChainLongPrice
        shortCost = trade['quantity'] * onChainShortPrice
        creatorCost = longCost if direction == BID else shortCost
        fillerCost = longCost if direction == ASK else shortCost

        assert cash.depositEther(value = creatorCost, sender = tester.k1)
        orderID = createOrder.publicCreateOrder(direction, trade['quantity'], onChainLongPrice, market.address, trade['outcome'], longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender = tester.k1)

        avgPrice = math.ceil((trade['avgPrice'] - minPrice) * market.getNumTicks() / displayRange)
        realizedProfit = math.ceil(trade['realizedPL'] * market.getNumTicks() / displayRange)
        frozenFunds = math.ceil(trade['frozenFunds'] * market.getNumTicks() / displayRange)

        profitLossChangedLog = {
            "outcome": trade['outcome'],
            "netPosition": trade['position'],
            "avgPrice": avgPrice,
            "realizedProfit": realizedProfit,
            "frozenFunds": frozenFunds,
        }

        assert cash.depositEther(value = fillerCost, sender = tester.k2)
        with AssertLog(contractsFixture, "ProfitLossChanged", profitLossChangedLog, skip = 0 if direction == BID else 1):
            fillOrder.publicFillOrder(orderID, trade['quantity'], longTo32Bytes(42), False, "0x0000000000000000000000000000000000000000", sender = tester.k2)

        assert profitLoss.getNetPosition(market.address, tester.a2, trade['outcome']) == trade['position']
        assert profitLoss.getAvgPrice(market.address, tester.a2, trade['outcome']) == avgPrice
        assert profitLoss.getRealizedProfit(market.address, tester.a2, trade['outcome']) == realizedProfit
        assert profitLoss.getFrozenFunds(market.address, tester.a2, trade['outcome']) == frozenFunds
