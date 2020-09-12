#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import fixture, raises
from utils import AssertLog, stringToBytes, BuyWithCash

INVALID = 0
NO = 1
YES = 2
NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

@fixture(scope='session')
def testerSnapshot(sessionFixture):
    return sessionFixture.createSnapshot()


@fixture
def nexus(sessionFixture, shareToken):
    nexus = sessionFixture.contracts['ERC20Proxy1155Nexus']
    shareToken.setApprovalForAll(nexus.address, True)
    return nexus


@fixture
def tokenId(sessionFixture, shareToken, market):
    return shareToken.getTokenId(market.address, INVALID)


@fixture
def erc20(sessionFixture, nexus, tokenId):
    erc20Address = nexus.newERC20(tokenId)
    return sessionFixture.applySignature("ERC20Proxy1155", erc20Address)


@fixture
def account0(sessionFixture):
    return sessionFixture.accounts[0]


@fixture
def account1(sessionFixture):
    return sessionFixture.accounts[1]


@fixture
def account2(sessionFixture):
    return sessionFixture.accounts[2]


def test_proxy_required(testerSnapshot, nexus, erc20, account0, account1):
    with raises(TransactionFailed):
        nexus.transfer(erc20.address, account0, account1, 15)

    with raises(TransactionFailed):
        nexus.transferFrom(erc20.address, account0, account0, account1, 15)

    with raises(TransactionFailed):
        nexus.approve(erc20.address, account0, account1, 15)


def test_base_state(testerSnapshot, tokenId, erc20, nexus, account0, account1):
    assert erc20.tokenId() == tokenId
    assert nexus.getProxy(tokenId) == erc20.address
    assert erc20.totalSupply() == 0
    assert erc20.balanceOf(account0) == 0
    assert nexus.allowance(erc20.address, account0, account1) == 0


def test_allowance_and_logs(testerSnapshot, cash, shareToken, market, account0, account1, account2, erc20):
    shares = 2
    cost = shares * market.getNumTicks()
    with BuyWithCash(cash, cost, account0, "complete set buy"):
        shareToken.publicBuyCompleteSets(market.address, shares)

    assert erc20.allowance(account0, account1) == 0

    with raises(TransactionFailed):
        erc20.transferFrom(account0, account2, shares - 1, sender=account1)

    erc20.approve(account1, shares - 1)
    assert erc20.getLogs("Approval")[0].get("args").__dict__ == {
        'owner': account0,
        'spender': account1,
        'value': shares - 1,
    }

    assert erc20.allowance(account0, account1) == shares - 1

    # try to send more shares than allowed
    with raises(TransactionFailed):
        erc20.transferFrom(account0, account2, shares, sender=account1) # note only shares-1 have been approved

    # send max approved shares
    erc20.transferFrom(account0, account2, shares - 1, sender=account1)
    assert erc20.getLogs("Transfer")[0].get("args").__dict__ == {
        'from': account0,
        'to': account2,
        'value': shares - 1,
    }
    assert erc20.allowance(account0, account1) == 0

    # should have no more allowed shares to trade
    with raises(TransactionFailed):
        erc20.transferFrom(account0, account2, 1, sender=account1)


def test_supply(testerSnapshot, cash, shareToken, market, nexus, erc20, account0):
    shareToken.setApprovalForAll(nexus.address, True)

    assert erc20.totalSupply() == 0
    assert erc20.balanceOf(account0) == 0

    shares = 1
    cost = shares * market.getNumTicks()
    with BuyWithCash(cash, cost, account0, "complete set buy"):
        shareToken.publicBuyCompleteSets(market.address, shares)

    assert erc20.totalSupply() == 1
    assert erc20.balanceOf(account0) == 1


def test_no_overwrite_of_proxy(testerSnapshot, nexus, erc20, tokenId):
    # was already created in the fixture
    with raises(TransactionFailed):
        nexus.newERC20(tokenId)

    # can still mint new proxies though
    fakeTokenId = 42
    fakeErc = nexus.newERC20(fakeTokenId)

    assert nexus.getProxy(tokenId) == erc20.address
    assert nexus.getProxy(fakeTokenId) == fakeErc
    unregisteredTokenId = 9001
    assert nexus.getProxy(unregisteredTokenId) == NULL_ADDRESS

def test_can_always_get_proxy_address(testerSnapshot, nexus):
    uncreatedTokenId = 9001
    assert nexus.getProxyAddress(uncreatedTokenId) == "0x3CCFf0dd2eEF0Ba49a6DdCfDA9DD24d560A60e85"

def test_malicious_proxy(testerSnapshot, fixture, nexus, market, cash, shareToken, account0, account1, account2, tokenId, erc20):
    maliciousProxy = fixture.upload("../../../src/contracts/trading/erc20proxy1155/ERC20Proxy1155.sol")
    maliciousProxy.initialize(nexus.address, tokenId)
    benignProxy = erc20

    shares = 2
    cost = shares * market.getNumTicks()
    with BuyWithCash(cash, cost, account0, "complete set buy"):
        shareToken.publicBuyCompleteSets(market.address, shares)

    with raises(TransactionFailed):
        maliciousProxy.transfer(account1, shares - 1)

    benignProxy.transfer(account1, shares - 1)

    with raises(TransactionFailed):
        maliciousProxy.approve(account1, shares - 1)

    benignProxy.approve(account1, shares - 1)

    with raises(TransactionFailed):
        maliciousProxy.transferFrom(account0, account2, shares - 1, sender=account1)

    benignProxy.transferFrom(account0, account2, shares - 1, sender=account1)


def test_re_init(testerSnapshot, erc20):
    with raises(TransactionFailed):
        erc20.initialize(NULL_ADDRESS, 40000)


def test_bulk(testerSnapshot, sessionFixture, nexus):
    erc20s = nexus.newERC20s([5, 7, 21])
    assert len(erc20s) == 3
    assert len(erc20s[0]) == 42 # "0x" + 40 hexes
    assert len(erc20s[1]) == 42 # "0x" + 40 hexes
    assert len(erc20s[2]) == 42 # "0x" + 40 hexes

    erc20_5 = sessionFixture.applySignature("ERC20Proxy1155", erc20s[0])
    erc20_7 = sessionFixture.applySignature("ERC20Proxy1155", erc20s[1])
    erc20_21 = sessionFixture.applySignature("ERC20Proxy1155", erc20s[2])

    assert erc20_5.tokenId() == 5
    assert erc20_7.tokenId() == 7
    assert erc20_21.tokenId() == 21



