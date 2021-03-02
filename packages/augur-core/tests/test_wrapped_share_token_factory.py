#!/usr/bin/env python

from tests.reporting_utils import proceedToInitialReporting
from pytest import raises, fixture, mark, skip
from utils import nullAddress, stringToBytes, PrintGasUsed

ATTO = 10 ** 18
SYMBOLS = ["Invalid", "No", "Yes"]

@fixture
def account0(sessionFixture):
    return sessionFixture.accounts[0]

@fixture
def wrappedShareTokenFactory(sessionFixture):
    return sessionFixture.contracts['WrappedShareTokenFactory']

def test_wrapped_share_token_factory(contractsFixture, cash, shareToken, account0, market, wrappedShareTokenFactory):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    setsToBuy = 100 * ATTO
    initialCost = setsToBuy * market.getNumTicks()

    cash.faucet(initialCost)
    cash.approve(shareToken.address, initialCost)
    shareToken.publicBuyCompleteSets(market.address, setsToBuy)
    shareToken.setApprovalForAll(wrappedShareTokenFactory.address, True)

    invalidTokenId = shareToken.getTokenId(market.address, 0)
    wrappedShareTokenFactory.wrapShares(shareToken.address, invalidTokenId, SYMBOLS[0], account0, setsToBuy)

    invalidTokenAddress = wrappedShareTokenFactory.getOrCreateWrappedShareToken(shareToken.address, invalidTokenId, SYMBOLS[0])
    invalidToken = contractsFixture.applySignature("WrappedShareToken", invalidTokenAddress)

    assert invalidToken.balanceOf(account0) == setsToBuy

def test_wrapped_share_token_factory_public_buy_sell_sets(contractsFixture, augur, cash, shareToken, account0, market, wrappedShareTokenFactory):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    setsToBuy = 100 * ATTO
    initialCost = setsToBuy * market.getNumTicks()

    cash.faucet(initialCost * 2)
    cash.approve(wrappedShareTokenFactory.address, initialCost)
    cash.approve(augur.address, initialCost)

    wrappedShareTokenFactory.publicBuyCompleteSets(market.address, shareToken.address, SYMBOLS, setsToBuy)

    invalidTokenId = shareToken.getTokenId(market.address, 0)
    invalidTokenAddress = wrappedShareTokenFactory.getOrCreateWrappedShareToken(shareToken.address, invalidTokenId, SYMBOLS[0])
    invalidToken = contractsFixture.applySignature("WrappedShareToken", invalidTokenAddress)

    assert invalidToken.balanceOf(account0) == setsToBuy

    noTokenId = shareToken.getTokenId(market.address, 1)
    noTokenAddress = wrappedShareTokenFactory.getOrCreateWrappedShareToken(shareToken.address, noTokenId, SYMBOLS[1])
    noToken = contractsFixture.applySignature("WrappedShareToken", noTokenAddress)

    assert noToken.balanceOf(account0) == setsToBuy

    yesTokenId = shareToken.getTokenId(market.address, 2)
    yesTokenAddress = wrappedShareTokenFactory.getOrCreateWrappedShareToken(shareToken.address, yesTokenId, SYMBOLS[2])
    yesToken = contractsFixture.applySignature("WrappedShareToken", yesTokenAddress)

    assert yesToken.balanceOf(account0) == setsToBuy

def test_wrapped_share_token_calculate_share_token_address(contractsFixture, cash, shareToken, account0, market, wrappedShareTokenFactory):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    invalidTokenId = shareToken.getTokenId(market.address, 0)
    calculatedShareTokenAddress = wrappedShareTokenFactory.calculateShareTokenAddress(
        shareToken.address,
        invalidTokenId,
        SYMBOLS[0]
    )
    deployedShareTokenAddress = wrappedShareTokenFactory.getOrCreateWrappedShareToken(
        shareToken.address,
        invalidTokenId,
        SYMBOLS[0]
    )

    assert calculatedShareTokenAddress == deployedShareTokenAddress
