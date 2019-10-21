#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises
from utils import AssertLog, stringToBytes, BuyWithCash

def test_init(contractsFixture, market):
    shareToken = contractsFixture.contracts['ShareToken']

    assert shareToken.name() == "Shares", "currency name"
    assert shareToken.symbol() == "SHARE", "currency symbol"

    assert shareToken.getTypeName() == stringToBytes("ShareToken")

def test_safeTransferFrom(contractsFixture, universe, market, cash):
    shareToken = contractsFixture.contracts['ShareToken']
    completeSets = contractsFixture.contracts['CompleteSets']

    with BuyWithCash(cash, 7 * market.getNumTicks(), contractsFixture.accounts[0], "complete set buy"):
        completeSets.publicBuyCompleteSets(market.address, 7)

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
    completeSets = contractsFixture.contracts['CompleteSets']

    tokenId = shareToken.getTokenId(market.address, 0)

    with BuyWithCash(cash, 7 * market.getNumTicks(), contractsFixture.accounts[0], "complete set buy"):
        completeSets.publicBuyCompleteSets(market.address, 7)

    assert(shareToken.isApprovedForAll(contractsFixture.accounts[0], contractsFixture.accounts[1]) == False), "Initialy Approved"

    with raises(TransactionFailed):
        shareToken.safeTransferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], tokenId, 5, "", sender=contractsFixture.accounts[1])

    shareToken.setApprovalForAll(contractsFixture.accounts[1], True, sender=contractsFixture.accounts[0])
    assert(shareToken.isApprovedForAll(contractsFixture.accounts[0], contractsFixture.accounts[1]) == True), "Not Approved"

    shareToken.safeTransferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], tokenId, 5, "", sender=contractsFixture.accounts[1])


