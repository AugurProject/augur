#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises
from utils import AssertLog, stringToBytes, BuyWithCash

def test_init(contractsFixture, market):
    shareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))

    assert shareToken.name() == "Shares", "currency name"
    assert shareToken.decimals() == 18, "number of decimals"
    assert shareToken.symbol() == "SHARE", "currency symbol"

    assert shareToken.getTypeName() == stringToBytes("ShareToken")

def test_transfer(contractsFixture, market, cash):
    shareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    completeSets = contractsFixture.contracts['CompleteSets']

    with BuyWithCash(cash, 7 * market.getNumTicks(), contractsFixture.accounts[0], "complete set buy"):
        completeSets.publicBuyCompleteSets(market.address, 7)
    initialTotalSupply = shareToken.totalSupply()
    initialBalance0 = shareToken.balanceOf(contractsFixture.accounts[0])
    initialBalance1 = shareToken.balanceOf(contractsFixture.accounts[1])

    with raises(TransactionFailed):
        shareToken.transfer(contractsFixture.accounts[0], 11, sender=contractsFixture.accounts[0])
    with raises(TransactionFailed):
        shareToken.transfer(contractsFixture.accounts[0], 5, sender=contractsFixture.accounts[1])

    transferLog = {
        "from": contractsFixture.accounts[0],
        "to": contractsFixture.accounts[1],
        "value": 5,
    }

    tokensTransferredLog = {
        "token": shareToken.address,
        "from": contractsFixture.accounts[0],
        "to": contractsFixture.accounts[1],
        "universe": market.getUniverse(),
        "tokenType": 1,
        "market": market.address,
        "value": 5,
    }

    with AssertLog(contractsFixture, "Transfer", transferLog, contract=shareToken):
        with AssertLog(contractsFixture, "TokensTransferred", tokensTransferredLog):
            assert shareToken.transfer(contractsFixture.accounts[1], 5, sender=contractsFixture.accounts[0])

    afterTransferBalance0 = shareToken.balanceOf(contractsFixture.accounts[0])
    afterTransferBalance1 = shareToken.balanceOf(contractsFixture.accounts[1])

    assert(initialBalance0 - 5 == afterTransferBalance0), "Decrease in address 1's balance should equal amount transferred"
    assert(initialBalance1 + 5 == afterTransferBalance1), "Increase in address 2's balance should equal amount transferred"
    assert(shareToken.totalSupply() == initialTotalSupply), "Total supply should be unchanged"

def test_approve(contractsFixture, market, cash):
    shareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    completeSets = contractsFixture.contracts['CompleteSets']

    with BuyWithCash(cash, 7 * market.getNumTicks(), contractsFixture.accounts[0], "complete set buy"):
        completeSets.publicBuyCompleteSets(market.address, 7)

    assert(shareToken.allowance(contractsFixture.accounts[0], contractsFixture.accounts[1]) == 0), "initial allowance is 0"

    approvalLog = {
        "owner": contractsFixture.accounts[0],
        "spender": contractsFixture.accounts[1],
        "value": 10
    }

    with AssertLog(contractsFixture, "Approval", approvalLog, contract=shareToken):
        assert shareToken.approve(contractsFixture.accounts[1], 10, sender=contractsFixture.accounts[0])
    assert(shareToken.allowance(contractsFixture.accounts[0], contractsFixture.accounts[1]) == 10), "allowance is 10 after approval"

    transferLog = {
        "from": contractsFixture.accounts[0],
        "to": contractsFixture.accounts[1],
        "value": 7
    }

    tokensTransferredLog = {
        "token": shareToken.address,
        "from": contractsFixture.accounts[0],
        "to": contractsFixture.accounts[1],
        "universe": market.getUniverse(),
        "tokenType": 1,
        "market": market.address,
        "value": 7
    }

    with AssertLog(contractsFixture, "Transfer", transferLog, contract=shareToken):
        with AssertLog(contractsFixture, "TokensTransferred", tokensTransferredLog):
            assert shareToken.transferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], 7, sender=contractsFixture.accounts[1])

def test_transferFrom(contractsFixture, market, cash):
    shareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    completeSets = contractsFixture.contracts['CompleteSets']
    with BuyWithCash(cash, 7 * market.getNumTicks(), contractsFixture.accounts[0], "complete set buy"):
        completeSets.publicBuyCompleteSets(market.address, 7)

    with raises(TransactionFailed):
        shareToken.transferFrom(contractsFixture.accounts[0], contractsFixture.accounts[1], 7, sender=contractsFixture.accounts[1])
