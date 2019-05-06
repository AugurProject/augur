#!/usr/bin/env python

from ethereum.tools import tester
from ethereum.tools.tester import TransactionFailed
from pytest import raises
from utils import AssertLog, bytesToHexString, stringToBytes, BuyWithCash

def test_init(contractsFixture, market):
    shareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))

    assert shareToken.name() == "Shares", "currency name"
    assert shareToken.decimals() == 18, "number of decimals"
    assert shareToken.symbol() == "SHARE", "currency symbol"

    assert shareToken.getTypeName() == stringToBytes("ShareToken")

def test_transfer(contractsFixture, market, cash):
    shareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    completeSets = contractsFixture.contracts['CompleteSets']

    with BuyWithCash(cash, 7 * market.getNumTicks(), tester.k0, "complete set buy"):
        completeSets.publicBuyCompleteSets(market.address, 7)
    initialTotalSupply = shareToken.totalSupply()
    initialBalance0 = shareToken.balanceOf(tester.a0)
    initialBalance1 = shareToken.balanceOf(tester.a1)

    with raises(TransactionFailed):
        shareToken.transfer(tester.a0, 11, sender=tester.k0)
    with raises(TransactionFailed):
        shareToken.transfer(tester.a0, 5, sender=tester.k1)

    transferLog = {
        "_event_type": "Transfer",
        "from": bytesToHexString(tester.a0),
        "to": bytesToHexString(tester.a1),
        "value": 5,
    }

    tokensTransferredLog = {
        "_event_type": "TokensTransferred",
        "token": shareToken.address,
        "from": bytesToHexString(tester.a0),
        "to": bytesToHexString(tester.a1),
        "universe": market.getUniverse(),
        "tokenType": 1,
        "market": market.address,
        "value": 5,
    }

    with AssertLog(contractsFixture, "Transfer", transferLog, contract=shareToken):
        with AssertLog(contractsFixture, "TokensTransferred", tokensTransferredLog):
            assert shareToken.transfer(tester.a1, 5, sender=tester.k0)

    afterTransferBalance0 = shareToken.balanceOf(tester.a0)
    afterTransferBalance1 = shareToken.balanceOf(tester.a1)

    assert(initialBalance0 - 5 == afterTransferBalance0), "Decrease in address 1's balance should equal amount transferred"
    assert(initialBalance1 + 5 == afterTransferBalance1), "Increase in address 2's balance should equal amount transferred"
    assert(shareToken.totalSupply() == initialTotalSupply), "Total supply should be unchanged"

def test_approve(contractsFixture, market, cash):
    shareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    completeSets = contractsFixture.contracts['CompleteSets']

    with BuyWithCash(cash, 7 * market.getNumTicks(), tester.k0, "complete set buy"):
        completeSets.publicBuyCompleteSets(market.address, 7)

    assert(shareToken.allowance(tester.a0, tester.a1) == 0), "initial allowance is 0"

    approvalLog = {
        "owner": bytesToHexString(tester.a0),
        "spender": bytesToHexString(tester.a1),
        "value": 10
    }

    with AssertLog(contractsFixture, "Approval", approvalLog, contract=shareToken):
        assert shareToken.approve(tester.a1, 10, sender=tester.k0)
    assert(shareToken.allowance(tester.a0, tester.a1) == 10), "allowance is 10 after approval"

    transferLog = {
        "from": bytesToHexString(tester.a0),
        "to": bytesToHexString(tester.a1),
        "value": 7
    }

    tokensTransferredLog = {
        "token": shareToken.address,
        "from": bytesToHexString(tester.a0),
        "to": bytesToHexString(tester.a1),
        "universe": market.getUniverse(),
        "tokenType": 1,
        "market": market.address,
        "value": 7
    }

    with AssertLog(contractsFixture, "Transfer", transferLog, contract=shareToken):
        with AssertLog(contractsFixture, "TokensTransferred", tokensTransferredLog):
            assert shareToken.transferFrom(tester.a0, tester.a1, 7, sender=tester.k1)

def test_transferFrom(contractsFixture, market, cash):
    shareToken = contractsFixture.applySignature('ShareToken', market.getShareToken(0))
    completeSets = contractsFixture.contracts['CompleteSets']
    with BuyWithCash(cash, 7 * market.getNumTicks(), tester.k0, "complete set buy"):
        completeSets.publicBuyCompleteSets(market.address, 7)

    with raises(TransactionFailed):
        shareToken.transferFrom(tester.a0, tester.a1, 7, sender=tester.k1)
