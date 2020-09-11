#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture
from utils import nullAddress, PrintGasUsed


ATTO = 10 ** 18
INVALID = 0
NO = 1
YES = 2


@fixture
def factory(sessionFixture):
    return sessionFixture.contracts['AMMFactory']

@fixture
def amm(sessionFixture, factory, market, shareToken):
    ammAddress = factory.addAMM(market.address, shareToken.address)
    return sessionFixture.applySignature("AMMExchange", ammAddress)

@fixture
def account0(sessionFixture):
    return sessionFixture.accounts[0]


def test_amm_liquidity(contractsFixture, market, cash, shareToken, amm, account0, kitchenSinkSnapshot):
    if not contractsFixture.paraAugur:
        return

    cash.faucet(100000 * ATTO)
    cash.approve(amm.address, 10 ** 48)

    assert cash.balanceOf(account0) == 100000 * ATTO
    assert cash.allowance(account0, amm.address) == 10 ** 48

    amm.addLiquidity(100 * ATTO)

    assert cash.balanceOf(account0) == 0
    assert cash.balanceOf(amm.address) == 0
    # user did not get any shares themselves: they go to the AMM
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    # AMM has 100 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == 100 * ATTO
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == 100 * ATTO
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == 100 * ATTO

    amm.removeLiquidity(10 * ATTO, 0)

    assert cash.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert cash.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears

    # user receives 10 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 10 * ATTO
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 10 * ATTO
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 10 * ATTO
    # AMM still has 90 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == 90 * ATTO
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == 90 * ATTO
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == 90 * ATTO

def test_amm_position(contractsFixture, market, shareToken, cash, amm, account0):
    if not contractsFixture.paraAugur:
        return

    cash.faucet(100000 * ATTO)
    cash.approve(amm.address, 10 ** 48)
    amm.addLiquidity(100 * ATTO)

    SHARES_TO_BUY = 10 * ATTO

    cost = amm.rateEnterPosition(SHARES_TO_BUY, True)
    print(cost)
    assert cost < SHARES_TO_BUY * market.getNumTicks() # must cost less than buying complete sets
    cash.faucet(cost)
    amm.enterPosition(SHARES_TO_BUY, True, cost)

    assert cash.balanceOf(account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == cost // market.getNumTicks()
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == SHARES_TO_BUY


# TODO tests
# 1. Two users add and remove liquidity, without trading occuring.
# 2. Two users add liquidity, then other users trade, then the users remove liquidity.
#    The worry is that our reward function doesn't work quite right so users won't get back what they put in.
# 3. User adds liqudity. Then there's trading. Then another user adds liquidity. They should get the right number of LP tokens.
#    And when the users remove liquidity, they get the number of shares and cash that makes sense.
# 4. Users swap and enter and exit positions.
# 5. The sqrt functions for safemath int and uint work as expected. Alex wrote them but there just aren't any tests yet.
# 6. Verify specific enterPosition costs.
