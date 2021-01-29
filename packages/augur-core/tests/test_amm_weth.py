#!/usr/bin/env python

from pytest import fixture, skip

from tests.reporting_utils import proceedToInitialReporting
from utils import stringToBytes

FEE = 10  # 10/1000 aka 1%
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
def account1(sessionFixture):
    return sessionFixture.accounts[1]


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


def test_amm_create_with_initial_liquidity(sessionFixture, market, weth_amm, account0):
    initialLiquidity = 5 * ATTO
    numticks = 1000
    (address, lpTokens) = weth_amm.addAMMWithLiquidity(market.address, FEE, ATTO, False, account0,
                                                       value=initialLiquidity)
    assert address != '0x' + ('0' * 40)
    assert lpTokens == initialLiquidity / numticks


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
    ratio = 10 ** 18 * yesPercent / noPercent
    yesShares = 66666666666666675200  # approximately 2/3 aka 60%
    keptYesShares = sets - yesShares

    lpTokens = weth_amm.addInitialLiquidity(market.address, FEE, ratio, True, account0, value=cost)

    assert lpTokens == 80000000000000006143  # skewed ratio means fewer shares which means fewer LP tokens
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

    removedLPTokens = 8000000000000000615  # remove 1/10th of liquidity (rounded up)
    recoveredInvalidShares = sets // 10
    recoveredNoShares = sets // 10
    recoveredYesShares = yesShares // 10
    remainingInvalidShares = sets - recoveredInvalidShares
    remainingNoShares = sets - recoveredNoShares
    remainingYesShares = yesShares - recoveredYesShares
    amm.removeLiquidity(removedLPTokens)

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


def test_amm_weth_yes_position(sessionFixture, market, para_weth_share_token, weth_amm, account0, amm):
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
    sharesReceived = weth_amm.enterPosition(market.address, FEE, True, 0, value=yesPositionCost)
    assert sharesReceived > yesPositionSets
    assert sharesReceived < 2 * yesPositionSets

    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, account0) == sharesReceived

    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets + yesPositionSets
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, amm.address) == sets + yesPositionSets
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, amm.address) == sets - (sharesReceived - yesPositionSets)

    # Exiting requires you to send shares to the weth-amm wrapper for it to pass along.
    para_weth_share_token.setApprovalForAll(weth_amm.address, True)

    payoutAll = weth_amm.exitAll(market.address, FEE, 0)
    assert payoutAll == 9751022193891319200732

    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, weth_amm.address) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, weth_amm.address) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, weth_amm.address) == 0

    assert para_weth_share_token.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert para_weth_share_token.balanceOfMarketOutcome(market.address, YES, account0) == 0

def test_amm_weth_yes_position2(contractsFixture, sessionFixture, market, factory, para_weth_share_token, weth_amm, account0, account1):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    sets = 100 * ATTO
    liquidityCost = sets * numticks
    ratio_50_50 = 10 ** 18

    para_weth_share_token.setApprovalForAll(weth_amm.address, True)

    factory.addAMM(market.address, para_weth_share_token.address, FEE)
    weth_amm.addInitialLiquidity(market.address, FEE, ratio_50_50, True, account1, value=liquidityCost)

    yesPositionSets = 10 * ATTO
    yesPositionCost = yesPositionSets * numticks

    weth_amm.enterPosition(market.address, FEE, False, 0, value=yesPositionCost)

    proceedToInitialReporting(contractsFixture, market)

    market.doInitialReport([0, market.getNumTicks(), 0], "", 0)

    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    balanceBeforeFinalization = contractsFixture.ethBalance(account0)
    weth_amm.claimTradingProceeds(market.address, account0, stringToBytes(""))

    # Should have more eth than before because market resolved in account0's favor.
    assert contractsFixture.ethBalance(account0) > balanceBeforeFinalization


def test_amm_weth_claim_from_multiple_markets(sessionFixture, universe, factory, weth_amm, para_weth_share_token, account0, account1):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    ratio_50_50 = 10 ** 18
    sets = 100 * ATTO

    para_weth_share_token.setApprovalForAll(weth_amm.address, True)

    def do_it():
        market = sessionFixture.createReasonableYesNoMarket(universe)
        numticks = market.getNumTicks()
        liquidityCost = sets * numticks

        factory.addAMM(market.address, para_weth_share_token.address, FEE)
        weth_amm.addInitialLiquidity(market.address, FEE, ratio_50_50, True, account1, value=liquidityCost)

        yesPositionSets = 10 * ATTO
        yesPositionCost = yesPositionSets * numticks

        weth_amm.enterPosition(market.address, FEE, True, 0, value=yesPositionCost)

        proceedToInitialReporting(sessionFixture, market)

        market.doInitialReport([0, 0, market.getNumTicks()], "", 0)

        disputeWindow = sessionFixture.applySignature('DisputeWindow', market.getDisputeWindow())
        sessionFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

        return market

    market1 = do_it()
    market2 = do_it()

    balanceBeforeFinalization = sessionFixture.ethBalance(account0)
    weth_amm.claimMarketsProceeds([market1.address, market2.address], [para_weth_share_token.address, para_weth_share_token.address], account0, stringToBytes(""))

    # Should have more eth than before because both markets resolved in account0's favor.
    assert sessionFixture.ethBalance(account0) > balanceBeforeFinalization
