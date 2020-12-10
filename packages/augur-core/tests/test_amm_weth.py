#!/usr/bin/env python

from pytest import fixture, skip


FEE = 10 # 10/1000 aka 1%
ATTO = 10 ** 18
INVALID = 0
NO = 1
YES = 2


@fixture
def weth(sessionFixture):
    return sessionFixture.contracts['WETH9']

@fixture
def account0(sessionFixture):
    return sessionFixture.accounts[0]

@fixture
def factory(sessionFixture):
    return sessionFixture.contracts['AMMFactory']

@fixture
def para_weth_share_token(sessionFixture):
    return sessionFixture.contracts["ParaWethShareToken"]

@fixture
def weth_amm(sessionFixture, factory, para_weth_share_token):
    return sessionFixture.uploadWethWrappedAmm(factory, para_weth_share_token)

@fixture
def amm(sessionFixture, factory, market, para_weth_share_token):
    ammAddress = factory.addAMM(market.address, para_weth_share_token.address, FEE)
    return sessionFixture.applySignature("AMMExchange", ammAddress)


def test_amm_weth_wrapper_getAMM(market, weth_amm, amm):
    maybe_amm = weth_amm.getAMM(market.address, FEE)
    assert maybe_amm == amm.address


def test_amm_weth_60_40_liquidity(sessionFixture, market, weth, para_weth_share_token, weth_amm, account0, amm):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    sets = 100 * ATTO
    cost = sets * 1000

    yesPercent = 0.4
    noPercent = 1 - yesPercent
    ratio = 10**18 * yesPercent / noPercent
    yesShares = 66666666666666675200 # approximately 2/3 aka 60%
    keptYesShares = sets - yesShares

    lpTokens = weth_amm.addInitialLiquidity(market.address, FEE, ratio, True, account0, value=cost)

    assert lpTokens == 81649658092772608498 # skewed ratio means fewer shares which means fewer LP tokens
    assert amm.balanceOf(account0) == lpTokens

    # all cash was used to buy complete sets
    assert weth.balanceOf(account0) == 0
    assert weth.balanceOf(weth_amm.address) == 0
    # user did not get any shares themselves: they go to the AMM
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, account0) == keptYesShares
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, account0) == 0
    # AMM has 60 Yes shares and 40 No shares
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, amm.address) == yesShares
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, amm.address) == sets

    # Must approve the weth_amm to remove liquidity
    amm.approve(weth_amm.address, 10 ** 48)

    removedLPTokens = 8164965809277260850 # remove 1/10th of liquidity (rounded up)
    recoveredInvalidShares = sets // 10
    recoveredNoShares = sets // 10
    recoveredYesShares = yesShares // 10
    remainingInvalidShares = sets - recoveredInvalidShares
    remainingNoShares = sets - recoveredNoShares
    remainingYesShares = yesShares - recoveredYesShares
    weth_amm.removeLiquidity(market.address, FEE, removedLPTokens, 0)

    assert weth.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert weth.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears

    # user receives 10 of each share
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, account0) == recoveredInvalidShares
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, account0) == recoveredNoShares
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, account0) == recoveredYesShares + keptYesShares
    # AMM still has 90 of each share
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, amm.address) == remainingInvalidShares
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, amm.address) == remainingNoShares
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, amm.address) == remainingYesShares

    finalSets = 100 * ATTO
    finalCost = finalSets * 1000
    lpTokens = weth_amm.addLiquidity(market.address, FEE, account0, value=finalCost)
    assert lpTokens > 0


def test_amm_weth_yes_position(sessionFixture, market, para_weth_share_token, weth_amm, account0, amm, weth):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    sets = 100 * ATTO
    liquidityCost = sets * numticks
    ratio_50_50 = 10 ** 18

    weth_amm.addInitialLiquidity(market.address, FEE, ratio_50_50, True, account0, value=liquidityCost)

    yesPositionSets = 10 * ATTO
    yesPositionCost = yesPositionSets * numticks

    # Enter position
    sharesReceived = amm.rateEnterPosition(yesPositionCost, True)
    assert sharesReceived > yesPositionSets
    assert sharesReceived < 2 * yesPositionSets
    weth_amm.enterPosition(market.address, FEE, True, sharesReceived, value=yesPositionCost)

    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, account0) == sharesReceived

    assert weth.balanceOf(amm.address) == yesPositionCost
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, amm.address) == sets
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, amm.address) == sets - sharesReceived

    # Exiting requires you to send shares to the weth-amm wrapper for it to pass along.
    para_weth_share_token.setApprovalForAll(weth_amm.address, True)

    payoutAll = amm.rateExitAll()
    assert payoutAll == 9795561209096775126300

    weth_amm.exitAll(market.address, FEE, payoutAll)

    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, weth_amm.address) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, weth_amm.address) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, weth_amm.address) == 0

    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, account0) == 0
