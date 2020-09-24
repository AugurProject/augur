#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, mark
from utils import longTo32Bytes, fix, AssertLog, TokenDelta, BuyWithCash, nullAddress
from constants import BID, ASK, YES, NO


def test_create_ask_with_shares_fill_with_shares(contractsFixture, cash, market):
    shareToken = contractsFixture.contracts['ShareToken']
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    shareToken = contractsFixture.contracts["ShareToken"]

    completeSetFees = fix('12', '0.0101') * market.getNumTicks()

    # 1. both accounts buy a complete set
    with BuyWithCash(cash, fix('12', market.getNumTicks()), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(12), sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('12', market.getNumTicks()), contractsFixture.accounts[2], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(12), sender = contractsFixture.accounts[2])

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(12)
    
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(12)

    # 2. create ASK order for YES with YES shares for escrow
    askOrderID = createOrder.publicCreateOrder(ASK, fix(12), 600, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender = contractsFixture.accounts[1])
    assert askOrderID
    assert cash.balanceOf(contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12)

    # 3. fill ASK order for YES with NO shares
    amountRemaining = fillOrder.publicFillOrder(askOrderID, fix(12), longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])
    creatorFee = completeSetFees * 3 / 5
    fillerFee = completeSetFees * 2 / 5
    assert amountRemaining == 0
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('12', '600') - creatorFee
    assert cash.balanceOf(contractsFixture.accounts[2]) == fix('12', '400') - fillerFee
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == 0

def test_create_ask_with_shares_fill_with_cash(contractsFixture, cash, market):
    shareToken = contractsFixture.contracts['ShareToken']
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    shareToken = contractsFixture.contracts["ShareToken"]

    # 1. buy a complete set with account 1
    with BuyWithCash(cash, fix('12', market.getNumTicks()), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(12), sender = contractsFixture.accounts[1])
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12), "Account 1 should have 12 shares of outcome 1"
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12), "Account 1 should have 12 shares of outcome 2"

    # 2. create ASK order for YES with YES shares for escrow
    askOrderID = createOrder.publicCreateOrder(ASK, fix(12), 60, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender = contractsFixture.accounts[1])
    assert askOrderID, "Order ID should be non-zero"
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12)

    # 3. fill ASK order for YES with cash
    with BuyWithCash(cash, fix('12', '60'), contractsFixture.accounts[2], "filling order"):
        amountRemaining = fillOrder.publicFillOrder(askOrderID, fix(12), longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])
    assert amountRemaining == 0
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('12', '60')
    assert cash.balanceOf(contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == 0

def test_create_ask_with_cash_fill_with_shares(contractsFixture, cash, market):
    shareToken = contractsFixture.contracts['ShareToken']
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    shareToken = contractsFixture.contracts["ShareToken"]

    # 1. buy complete sets with account 2
    with BuyWithCash(cash, fix('12', market.getNumTicks()), contractsFixture.accounts[2], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(12), sender=contractsFixture.accounts[2])
    assert cash.balanceOf(contractsFixture.accounts[2]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(12)

    # 2. create ASK order for YES with cash escrowed
    with BuyWithCash(cash, fix('12', '400'), contractsFixture.accounts[1], "buy complete set"):
        askOrderID = createOrder.publicCreateOrder(ASK, fix(12), 600, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender=contractsFixture.accounts[1])
    assert askOrderID
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0

    # 3. fill ASK order for YES with shares of NO
    amountRemaining = fillOrder.publicFillOrder(askOrderID, fix(12), longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])
    assert amountRemaining == 0, "Amount remaining should be 0"
    assert cash.balanceOf(contractsFixture.accounts[1]) == 0
    assert cash.balanceOf(contractsFixture.accounts[2]) == fix('12', '400')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == 0

def test_create_ask_with_cash_fill_with_cash(contractsFixture, cash, market):
    shareToken = contractsFixture.contracts['ShareToken']
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    shareToken = contractsFixture.contracts["ShareToken"]

    # 1. create ASK order for YES with cash escrowed
    with BuyWithCash(cash, fix('12', '400'), contractsFixture.accounts[1], "create order"):
        askOrderID = createOrder.publicCreateOrder(ASK, fix(12), 600, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender= contractsFixture.accounts[1])
    assert askOrderID
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0

    # 2. fill ASK order for YES with cash
    with BuyWithCash(cash, fix('12', '600'), contractsFixture.accounts[2], "create order"):
        amountRemaining = fillOrder.publicFillOrder(askOrderID, fix(12), longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])
    assert amountRemaining == 0
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert cash.balanceOf(contractsFixture.accounts[2]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == 0

def test_create_bid_with_shares_fill_with_shares(contractsFixture, cash, market, universe):
    shareToken = contractsFixture.contracts['ShareToken']
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    shareToken = contractsFixture.contracts["ShareToken"]

    totalProceeds = fix('12', market.getNumTicks())
    marketCreatorFee = totalProceeds / market.getMarketCreatorSettlementFeeDivisor()
    reporterFee = totalProceeds / universe.getOrCacheReportingFeeDivisor()
    completeSetFees = marketCreatorFee + reporterFee

    # 1. buy complete sets with both accounts
    with BuyWithCash(cash, fix('12', market.getNumTicks()), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(12), sender = contractsFixture.accounts[1])
    with BuyWithCash(cash, fix('12', market.getNumTicks()), contractsFixture.accounts[2], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(12), sender = contractsFixture.accounts[2])
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert cash.balanceOf(contractsFixture.accounts[2]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(12)

    # 2. create BID order for YES with NO shares escrowed
    orderID = createOrder.publicCreateOrder(BID, fix(12), 600, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender = contractsFixture.accounts[1])
    assert orderID
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0

    # 3. fill BID order for YES with shares of YES
    orderFilledEventLog = {
	    "eventType": 2,
	    "addressData": [contractsFixture.accounts[1] , contractsFixture.accounts[2]],
	    "uint256Data": [600, 0, YES, 0, 0, completeSetFees, fix(12),  contractsFixture.contracts['Time'].getTimestamp(), 0, 0],
    }
    with AssertLog(contractsFixture, 'OrderEvent', orderFilledEventLog):
        leftoverInOrder = fillOrder.publicFillOrder(orderID, fix(12), longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])
        assert leftoverInOrder == 0

    creatorFee = completeSetFees * 2 / 5
    fillerFee = completeSetFees * 3 / 5
    creatorPayment = fix('12', '400') - creatorFee
    fillerPayment = fix('12', '600') - fillerFee
    assert cash.balanceOf(contractsFixture.accounts[1]) == creatorPayment
    assert cash.balanceOf(contractsFixture.accounts[2]) == fillerPayment
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(12)

def test_create_bid_with_shares_fill_with_cash(contractsFixture, cash, market):
    shareToken = contractsFixture.contracts['ShareToken']
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    shareToken = contractsFixture.contracts["ShareToken"]

    # 1. buy complete sets with account 1
    with BuyWithCash(cash, fix('12', market.getNumTicks()), contractsFixture.accounts[1], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(12), sender = contractsFixture.accounts[1])
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == fix(12)

    # 2. create BID order for YES with NO shares escrowed
    orderID = createOrder.publicCreateOrder(BID, fix(12), 600, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender = contractsFixture.accounts[1])
    assert orderID
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0

    # 3. fill BID order for YES with cash
    with BuyWithCash(cash, fix('12', '400'), contractsFixture.accounts[2], "fill order"):
        leftoverInOrder = fillOrder.publicFillOrder(orderID, fix(12), longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])
    assert leftoverInOrder == 0
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('12', '400')
    assert cash.balanceOf(contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(12)

def test_create_bid_with_cash_fill_with_shares(contractsFixture, cash, market):
    shareToken = contractsFixture.contracts['ShareToken']
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    shareToken = contractsFixture.contracts["ShareToken"]

    # 1. buy complete sets with account 2
    with BuyWithCash(cash, fix('12', market.getNumTicks()), contractsFixture.accounts[2], "buy complete set"):
        assert shareToken.publicBuyCompleteSets(market.address, fix(12), sender = contractsFixture.accounts[2])
    assert cash.balanceOf(contractsFixture.accounts[2]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(12)

    # 2. create BID order for YES with cash escrowed
    with BuyWithCash(cash, fix('12', '600'), contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(12), 600, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender = contractsFixture.accounts[1])
    assert orderID
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0

    # 3. fill BID order for YES with shares of YES
    leftoverInOrder = fillOrder.publicFillOrder(orderID, fix(12), longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])
    assert leftoverInOrder == 0
    assert cash.balanceOf(contractsFixture.accounts[1]) == 0
    assert cash.balanceOf(contractsFixture.accounts[2]) == fix('12', '600')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(12)

def test_create_bid_with_cash_fill_with_cash(contractsFixture, cash, market):
    createOrder = contractsFixture.contracts['CreateOrder']
    fillOrder = contractsFixture.contracts['FillOrder']
    shareToken = contractsFixture.contracts["ShareToken"]

    # 1. create BID order for YES with cash escrowed
    with BuyWithCash(cash, fix('12', '600'), contractsFixture.accounts[1], "create order"):
        orderID = createOrder.publicCreateOrder(BID, fix(12), 600, market.address, YES, longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), nullAddress, sender = contractsFixture.accounts[1])
    assert orderID
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0

    # 2. fill BID order for YES with cash
    with BuyWithCash(cash, fix('12', '400'), contractsFixture.accounts[2], "create order"):
        leftoverInOrder = fillOrder.publicFillOrder(orderID, fix(12), longTo32Bytes(42), longTo32Bytes(11), sender = contractsFixture.accounts[2])
    assert leftoverInOrder == 0
    assert cash.balanceOf(contractsFixture.accounts[1]) == fix('0')
    assert cash.balanceOf(contractsFixture.accounts[2]) == fix('0')
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == fix(12)
    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[2]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[2]) == fix(12)

