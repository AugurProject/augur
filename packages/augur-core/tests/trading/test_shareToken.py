#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises
from utils import fix, AssertLog, stringToBytes, BuyWithCash, nullAddress, longTo32Bytes
from constants import YES, NO

def test_init(contractsFixture, market):
    shareToken = contractsFixture.contracts['ShareToken']

    assert shareToken.name() == "Shares", "currency name"
    assert shareToken.symbol() == "SHARE", "currency symbol"

    assert shareToken.getTypeName() == stringToBytes("ShareToken")

def test_bad_input_to_trade_functions(contractsFixture, universe, market, cash):
    shareToken = contractsFixture.contracts["ShareToken"]

    cost = 10 * market.getNumTicks()
    account = contractsFixture.accounts[1]
    cash.faucet(cost, sender=account)

    # cant provide an invalid outcome
    with raises(TransactionFailed):
        shareToken.buyCompleteSetsForTrade(market.address, 10, 257, account, account, sender = account)

    shareToken.buyCompleteSetsForTrade(market.address, 10, 1, account, account, sender = account)

    # can't provide an invalid market
    shareToken.setApprovalForAll(contractsFixture.accounts[0], True, sender=account)
    with raises(TransactionFailed):
        shareToken.sellCompleteSetsForTrade(nullAddress, 1, 10, account, account, account, account, 4, account, longTo32Bytes(11))

    shareToken.sellCompleteSetsForTrade(market.address, 1, 10, account, account, account, account, 4, account, longTo32Bytes(11))

def test_safeTransferFrom(contractsFixture, universe, market, cash):
    shareToken = contractsFixture.contracts['ShareToken']

    with BuyWithCash(cash, 7 * market.getNumTicks(), contractsFixture.accounts[0], "complete set buy"):
        shareToken.buyCompleteSets(market.address, contractsFixture.accounts[0], 7)

    initialTotalSupply = shareToken.totalSupplyForMarketOutcome(market.address, 0)

    initialBalance0 = shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[0])
    initialBalance1 = shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1])

    tokenId = shareToken.getTokenId(market.address, 0)

    with raises(TransactionFailed):
        shareToken.safeTransferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], tokenId, 11, "", sender=contractsFixture.accounts[0])
    with raises(TransactionFailed):
        shareToken.safeTransferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], tokenId, 5, "", sender=contractsFixture.accounts[1])
    with raises(TransactionFailed):
        shareToken.safeTransferFrom(contractsFixture.accounts[1], contractsFixture.accounts[1], tokenId, 5, "", sender=contractsFixture.accounts[1])

    shareTokenBalanceChangedLog = {
        "universe": universe.address,
        "account": contractsFixture.accounts[1],
        "outcome": 0,
        "balance": 5,
        "market": market.address,
    }

    with AssertLog(contractsFixture, "ShareTokenBalanceChanged", shareTokenBalanceChangedLog, skip=1):
        shareToken.safeTransferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], tokenId, 5, "", sender=contractsFixture.accounts[0])

    afterTransferBalance0 = shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[0])
    afterTransferBalance1 = shareToken.balanceOfMarketOutcome(market.address, 0, contractsFixture.accounts[1])

    assert(initialBalance0 - 5 == afterTransferBalance0), "Decrease in address 1's balance should equal amount transferred"
    assert(initialBalance1 + 5 == afterTransferBalance1), "Increase in address 2's balance should equal amount transferred"
    assert(shareToken.totalSupplyForMarketOutcome(market.address, 0) == initialTotalSupply), "Total supply should be unchanged"

def test_approve(contractsFixture, market, cash):
    shareToken = contractsFixture.contracts['ShareToken']

    tokenId = shareToken.getTokenId(market.address, 0)

    with BuyWithCash(cash, 7 * market.getNumTicks(), contractsFixture.accounts[0], "complete set buy"):
        shareToken.buyCompleteSets(market.address, contractsFixture.accounts[0], 7)

    assert(shareToken.isApprovedForAll(contractsFixture.accounts[0], contractsFixture.accounts[1]) == False), "Initialy Approved"

    with raises(TransactionFailed):
        shareToken.safeTransferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], tokenId, 5, "", sender=contractsFixture.accounts[1])

    shareToken.setApprovalForAll(contractsFixture.accounts[1], True, sender=contractsFixture.accounts[0])
    assert(shareToken.isApprovedForAll(contractsFixture.accounts[0], contractsFixture.accounts[1]) == True), "Not Approved"

    shareToken.safeTransferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], tokenId, 5, "", sender=contractsFixture.accounts[1])

def test_publicBuyCompleteSets(contractsFixture, universe, cash, market):
    orders = contractsFixture.contracts['Orders']
    shareToken = contractsFixture.contracts["ShareToken"]

    assert not cash.balanceOf(contractsFixture.accounts[1])
    assert universe.marketBalance(market.address) == universe.getOrCacheValidityBond()
    assert universe.getOpenInterestInAttoCash() == 0

    cost = 10 * market.getNumTicks()
    assert cash.faucet(cost, sender=contractsFixture.accounts[1])

    completeSetsPurchasedLog = {
        "universe": universe.address,
        "market": market.address,
        "account": contractsFixture.accounts[1],
        "numCompleteSets": 10,
    }

    marketOIChanged = {
        "universe": universe.address,
        "market": market.address,
        "marketOI": cost,
    }

    with AssertLog(contractsFixture, "CompleteSetsPurchased", completeSetsPurchasedLog):
        with AssertLog(contractsFixture, "MarketOIChanged", marketOIChanged):
            assert shareToken.publicBuyCompleteSets(market.address, 10, sender=contractsFixture.accounts[1])

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[1]) == 10, "Should have 10 shares of outcome 1"
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[1]) == 10, "Should have 10 shares of outcome 2"
    assert cash.balanceOf(contractsFixture.accounts[1]) == 0, "Sender's cash balance should be 0"
    assert universe.marketBalance(market.address) == cost + universe.getOrCacheValidityBond(), "Increase in market's cash should equal the cost to purchase the complete set"
    assert shareToken.totalSupplyForMarketOutcome(market.address, YES) == 10, "Increase in yes shares purchased for this market should be 10"
    assert shareToken.totalSupplyForMarketOutcome(market.address, NO) == 10, "Increase in yes shares purchased for this market should be 10"
    assert universe.getOpenInterestInAttoCash() == cost, "Open interest in the universe increases by the cost in ETH of the sets purchased"

def test_publicSellCompleteSets(contractsFixture, universe, cash, market):
    orders = contractsFixture.contracts['Orders']
    shareToken = contractsFixture.contracts["ShareToken"]

    account = contractsFixture.accounts[0]

    assert not cash.balanceOf(account)
    assert universe.marketBalance(market.address) == universe.getOrCacheValidityBond()

    cost = 10 * market.getNumTicks()
    assert cash.faucet(cost)
    assert universe.getOpenInterestInAttoCash() == 0
    shareToken.buyCompleteSets(market.address, account, 10)
    assert universe.getOpenInterestInAttoCash() == 10 * market.getNumTicks()

    completeSetsSoldLog = {
        "universe": universe.address,
        "market": market.address,
        "account": account,
        "numCompleteSets": 9,
        "fees": 9 + 9,
    }

    marketOIChanged = {
        "universe": universe.address,
        "market": market.address,
        "marketOI": market.getNumTicks(),
    }

    with AssertLog(contractsFixture, "CompleteSetsSold", completeSetsSoldLog):
        with AssertLog(contractsFixture, "MarketOIChanged", marketOIChanged):
            result = shareToken.publicSellCompleteSets(market.address, 9, longTo32Bytes(11))

    assert universe.getOpenInterestInAttoCash() == 1 * market.getNumTicks()

    assert shareToken.balanceOfMarketOutcome(market.address, YES, contractsFixture.accounts[0]) == 1, "Should have 1 share of outcome yes"
    assert shareToken.balanceOfMarketOutcome(market.address, NO, contractsFixture.accounts[0]) == 1, "Should have 1 share of outcome no"
    assert shareToken.totalSupplyForMarketOutcome(market.address, YES) == 1
    assert shareToken.totalSupplyForMarketOutcome(market.address, NO) == 1
    assert cash.balanceOf(contractsFixture.accounts[0]) == 882
    assert universe.marketBalance(market.address) == universe.getOrCacheValidityBond() + 100 + 9
    assert market.marketCreatorFeesAttoCash() == 9

def test_sellCompleteSets_failure(contractsFixture, universe, cash, market):
    shareToken = contractsFixture.contracts["ShareToken"]
    orders = contractsFixture.contracts['Orders']

    cost = 10 * market.getNumTicks()
    account = contractsFixture.accounts[1]
    cash.faucet(cost, sender=account)
    shareToken.buyCompleteSets(market.address, account, 10, sender = account)

    # sellCompleteSets exceptions
    with raises(TransactionFailed):
        shareToken.sellCompleteSets(market.address, account, account, 10 + 1, longTo32Bytes(11), account)

def test_maliciousMarket(contractsFixture, universe, cash, market):
    shareToken = contractsFixture.contracts["ShareToken"]
    orders = contractsFixture.contracts['Orders']

    maliciousMarket = contractsFixture.upload('solidity_test_helpers/MaliciousMarket.sol', 'maliciousMarket', constructorArgs=[market.address])

    with raises(TransactionFailed):
        shareToken.buyCompleteSets(maliciousMarket.address, contractsFixture.accounts[1], 10**18, sender = contractsFixture.accounts[1])
