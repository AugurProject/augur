#!/usr/bin/env python

from pytest import fixture, skip

from tests.reporting_utils import proceedToInitialReporting
from utils import stringToBytes

FEE = 10  # 10/1000 aka 1%
ATTO = 10 ** 18
INVALID = 0
NO = 1
YES = 2
SYMBOLS = ["Invalid", "No", "Yes"]


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


def test_amm_create_with_initial_liquidity(sessionFixture, market, weth_amm, account0):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    initialLiquidity = 5 * ATTO
    numticks = 1000
    (address, lpTokens) = weth_amm.addAMMWithLiquidity(market.address, FEE, ATTO, False, account0, SYMBOLS,
                                                       value=initialLiquidity)
    assert address != '0x' + ('0' * 40)

    # Expect 90% of the initialLiquidity as lpTokens
    assert lpTokens == (initialLiquidity * 90) // (numticks * 100)

def test_amm_weth_wrapper_getAMM(market, weth_amm, account0):
    ammAddress = weth_amm.addAMMWithLiquidity(market.address, FEE,  ATTO, True, account0, SYMBOLS, value=ATTO)[0]
    maybe_amm = weth_amm.getAMM(market.address, FEE)
    assert maybe_amm == ammAddress

def test_amm_weth_yes_position2(contractsFixture, sessionFixture, market, para_weth_share_token, weth_amm, account0, account1):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    sets = 100 * ATTO
    liquidityCost = sets * numticks
    ratio_50_50 = 10 ** 18

    para_weth_share_token.setApprovalForAll(weth_amm.address, True)

    weth_amm.addAMMWithLiquidity(market.address, FEE, ratio_50_50, True, account1, SYMBOLS, value=liquidityCost)

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


def test_amm_weth_claim_from_multiple_markets(sessionFixture, universe, weth_amm, para_weth_share_token, account0, account1):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    ratio_50_50 = 10 ** 18
    sets = 100 * ATTO

    para_weth_share_token.setApprovalForAll(weth_amm.address, True)

    def do_it():
        market = sessionFixture.createReasonableYesNoMarket(universe)
        numticks = market.getNumTicks()
        liquidityCost = sets * numticks

        weth_amm.addAMMWithLiquidity(market.address, FEE, ratio_50_50, True, account1, SYMBOLS, value=liquidityCost)

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
