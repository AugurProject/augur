#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from tests.reporting_utils import proceedToInitialReporting
from pytest import raises, fixture, mark, skip
from utils import nullAddress, stringToBytes

def calc_ratio(yesPercent):
    noPercent = 1 - yesPercent
    return 10**18 * yesPercent / noPercent


FEE = 10 # 10/1000 aka 1%
ATTO = 10 ** 18
INVALID = 0
NO = 1
YES = 2
RATIO_50_50 = calc_ratio(0.5)
RATIO_60_40 = calc_ratio(0.4)
BALANCER_POOL_MIN = 2 * 10 ** 6

@fixture
def factory(sessionFixture):
    return sessionFixture.contracts['AMMFactory']

@fixture
def amm(sessionFixture, factory, market, shareToken, cash):
    sets = 100 * ATTO
    cost = sets * 1000

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    ammAddress = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost, 10**18, True, account0)
    return sessionFixture.applySignature("AMMExchange", ammAddress)

@fixture
def account0(sessionFixture):
    return sessionFixture.accounts[0]

@fixture
def account1(sessionFixture):
    return sessionFixture.accounts[1]

def test_amm_calc_addr(contractsFixture, factory, shareToken, market):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    address = factory.calculateAMMAddress(market.address, shareToken.address, FEE)
    assert address != nullAddress

def test_amm_add_with_liquidity(contractsFixture, market, cash, shareToken, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    setsToBuy = 10 * ATTO
    keepYes = True

    cost = setsToBuy * 10000
    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    ammAddress = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost, RATIO_50_50, keepYes, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammAddress[0])

    addLiquidityEvent = amm.getLogs('AddLiquidity')
    assert addLiquidityEvent[0].args.sender == account0

    assert ammAddress != nullAddress

def test_amm_add_with_liquidity2(contractsFixture, market, cash, shareToken, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cost = 10**18
    keepYes = False

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    ammAddress = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost, RATIO_50_50, keepYes, account0)
    assert ammAddress != nullAddress

def test_amm_initial_liquidity(contractsFixture, sessionFixture, market, cash, shareToken, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    sets = 100 * ATTO
    cost = (sets * 1000) + (BALANCER_POOL_MIN * 1000)

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    ammAddress = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost, 10**18, True, account0)
    assert ammAddress != nullAddress

    amm = sessionFixture.applySignature("AMMExchange", ammAddress[0])
    lpTokens = ammAddress[1]

    addLiquidityEvent = amm.getLogs('AddLiquidity')
    assert addLiquidityEvent[0].args.sender == account0

    # all cash was used to buy complete sets
    assert cash.balanceOf(account0) == 0
    assert cash.balanceOf(amm.address) == 0
    # user did not get any shares themselves: they go to the AMM
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    # AMM has 100 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == sets

    assert amm.balanceOf(account0) == sets # liquidity provider tokens should match the sets minted, when no fees in 50:50
    assert lpTokens == sets # returned LP tokens should match actual LP tokens

    removedLPTokens = lpTokens // 10
    amm.removeLiquidity(removedLPTokens)

    assert cash.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert cash.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears
    assert amm.balanceOf(account0) == lpTokens - removedLPTokens
    # user receives just shy of 10 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == sets * 0.1
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == sets * 0.1
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == sets * 0.1
    # # AMM still has 90 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets * 0.9
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == sets * 0.9
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == sets * 0.9

def test_amm_subsequent_liquidity(contractsFixture, market, cash, shareToken, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cash.approve(factory.address, 10 ** 48)

    initialSets = 100 * ATTO
    initialCost = (initialSets * 1000) + (2 * 10**6 * 1000)
    cash.faucet(initialCost)
    ammAddress = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, initialCost, 10**18, True, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammAddress[0])

    subsequentSets = 100 * ATTO
    subsequentCost = subsequentSets * 1000
    cash.faucet(subsequentCost)
    amm.addLiquidity(subsequentCost, account0)

    totalSets = initialSets + subsequentSets

    assert cash.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert cash.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears
    assert amm.balanceOf(account0) == totalSets  # LP tokens

    # user receives no shares
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 0
    # AMM has initial and subsequent liquidity shares
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == totalSets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == totalSets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == totalSets

    # Now enter a position, causing fees to be collected and therefore the value of an LP token to rise

    cost = 1000 * 10 * ATTO
    cash.faucet(cost)
    amm.enterPosition(cost, True, 0)

    # Now test adding liquidity after entering position

    finalSets = 100 * ATTO
    finalCost = finalSets * 1000
    cash.faucet(finalCost)
    lpTokens = amm.addLiquidity(finalCost, account0)
    assert lpTokens == 95238095238095238064 # less than finalSets due to captured fees raising the value of an LP token

def test_amm_60_40_liquidity(contractsFixture, market, cash, shareToken, factory, account0, kitchenSinkSnapshot):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    sets = 100 * ATTO
    cost = (sets * 1000) + (2 * 10**6 * 1000)

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    yesShares = 66666666666666675200 # approximately 2/3 aka 60%
    keptYesShares = sets - yesShares

    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost, RATIO_60_40, True, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammInfo[0])
    lpTokens = ammInfo[1]

    assert lpTokens == 80000000000000006143 # skewed ratio means fewer shares which means fewer LP tokens
    assert amm.balanceOf(account0) == lpTokens

    # all cash was used to buy complete sets
    assert cash.balanceOf(account0) == 0
    assert cash.balanceOf(amm.address) == 0
    # user did not get any shares themselves: they go to the AMM
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == keptYesShares
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    # AMM has 60 Yes shares and 40 No shares
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == yesShares
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == sets

    removedLPTokens = 8000000000000000615 # remove 1/10th of liquidity (rounded up)
    recoveredInvalidShares = sets // 10
    recoveredNoShares = sets // 10
    recoveredYesShares = yesShares // 10
    remainingInvalidShares = sets - recoveredInvalidShares
    remainingNoShares = sets - recoveredNoShares
    remainingYesShares = yesShares - recoveredYesShares
    amm.removeLiquidity(removedLPTokens)

    assert cash.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert cash.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears
    assert amm.balanceOf(account0) == lpTokens - removedLPTokens  # LP tokens

    # user receives 10 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == recoveredInvalidShares
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == recoveredNoShares
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == recoveredYesShares + keptYesShares
    # AMM still has 90 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == remainingInvalidShares
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == remainingNoShares
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == remainingYesShares

    finalSets = 100 * ATTO
    finalCost = finalSets * 1000
    cash.faucet(finalCost)
    lpTokens = amm.addLiquidity(finalCost, account0)
    assert lpTokens == 80000000000000006141 # 2 atto off from initial, probably due to rounding

def test_amm_yes_position(contractsFixture, market, shareToken, cash, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    sets = 100 * ATTO
    liquidityCost = (sets * numticks) + (BALANCER_POOL_MIN * numticks)

    cash.faucet(liquidityCost)
    cash.approve(factory.address, 10 ** 48)

    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, liquidityCost, 10**18, True, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammInfo[0])
    lpTokens = ammInfo[1]

    yesPositionSets = 10 * ATTO
    yesPositionCost = yesPositionSets * numticks

    # Enter position
    cash.faucet(yesPositionCost)
    sharesReceived = amm.enterPosition(yesPositionCost, True, 0)
    assert sharesReceived > yesPositionSets
    assert sharesReceived < 2 * yesPositionSets

    assert cash.balanceOf(account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == sharesReceived

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets + yesPositionSets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == sets + yesPositionSets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == sets - (sharesReceived - yesPositionSets)

    # Exiting requires you to send shares.
    shareToken.setApprovalForAll(amm.address, True)
    shareToken.setApprovalForAll(factory.address, True)

    payoutAll = amm.exitAll(0)
    assert payoutAll == 9751022193891319200732

    assert cash.balanceOf(account0) == payoutAll

def test_amm_yes_position_oversized(contractsFixture, shareToken, market, cash, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    sets = 100 * ATTO
    liquidityCost = (sets * numticks) + (BALANCER_POOL_MIN * numticks)

    cash.faucet(liquidityCost)
    cash.approve(factory.address, 10 ** 48)

    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, liquidityCost, RATIO_50_50, True, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammInfo[0])

    # Enter position, skewing the ratio
    yesPositionSets = 10 * ATTO
    yesPositionCost = yesPositionSets * numticks
    cash.faucet(yesPositionCost)
    sharesReceivedFirst = amm.enterPosition(yesPositionCost, True, 0)

    # Enter position again, with so many shares that swap direction must be correct
    yesPositionSets = 10000000 * ATTO
    yesPositionCost = yesPositionSets * numticks
    cash.faucet(yesPositionCost)
    sharesReceivedSecond = amm.enterPosition(yesPositionCost, True, 0)


def test_amm_no_position(contractsFixture, market, shareToken, cash, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cash.faucet(100000 * ATTO)
    cash.approve(factory.address, 10 ** 48)

    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, 100000 * ATTO, RATIO_50_50, True, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammInfo[0])

    shareToken.setApprovalForAll(amm.address, True)

    cost = 10000 * ATTO

    # Enter NO position
    cash.faucet(cost)
    sharesReceived = amm.enterPosition(cost, False, 0)
    assert sharesReceived > 10 * ATTO

    assert cash.balanceOf(account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == sharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == sharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 0

def test_amm_swap(contractsFixture, market, shareToken, cash, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    liquidityCost = (100000 * ATTO) + (2 * 10**6 * 1000)

    cash.faucet(liquidityCost)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(factory.address, True)
    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, liquidityCost, RATIO_50_50, True, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammInfo[0])

    cost = 10000 * ATTO

    cash.faucet(cost)
    yesShares = amm.enterPosition(cost, True, 0)

    noSharesReceived = amm.rateSwap(1 * ATTO, False) # trade away 1 Yes share

    # Entered Yes position earlier, which spent Cash for Yes shares, raising their value and therefore lowering the value of No shares.
    # Then sold 1e18 Yes shares for No shares, which are worth less than Yes shares.
    assert noSharesReceived == 1183695652173913044

    amm.swap(1 * ATTO, False, noSharesReceived)

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == noSharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == noSharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == yesShares - ATTO # spent one Yes share to buy some No shares

def test_amm_fees_work(sessionFixture, market, shareToken, cash, factory, account0):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    fee = 3 # 3/1000 aka 0.3%

    liquiditySets = 100 * ATTO
    liquidityCash = (liquiditySets * market.getNumTicks()) + (2 * 10**6 * market.getNumTicks())
    cash.faucet(liquidityCash)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(factory.address, True)

    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, fee, liquidityCash, RATIO_50_50, True, account0)
    amm = sessionFixture.applySignature("AMMExchange", ammInfo[0])
    lpTokens = ammInfo[1]

    tradeCash = 10000 * ATTO
    tradeSets = tradeCash // market.getNumTicks()
    cash.faucet(tradeCash)
    yesShares = amm.enterPosition(tradeCash, True, 0)
    assert yesShares == 19063636363636363637

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == yesShares
    assert cash.balanceOf(account0) == 0
    assert amm.balanceOf(account0) == amm.totalSupply()
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == liquiditySets + tradeSets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == liquiditySets + tradeSets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == liquiditySets - (yesShares - tradeSets)

    # Now remove liquidity and verify that LP tokens yield what they should.
    (noRemoved, yesRemoved) = amm.removeLiquidity(lpTokens)

    assert noRemoved == liquiditySets + tradeSets
    assert yesRemoved == liquiditySets - (yesShares - tradeSets)

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == 0
    assert cash.balanceOf(amm.address) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == liquiditySets + tradeSets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == liquiditySets + tradeSets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == liquiditySets + tradeSets
    assert cash.balanceOf(account0) == 0

def test_amm_fee_calc_0(sessionFixture, market, shareToken, cash, factory, account0):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()

    fee = 0  # 0/1000 aka 0.0%
    liquiditySets = 100
    amm = make_amm(sessionFixture, factory, market, shareToken, cash, account0, fee, liquiditySets)

    cash.faucet(10 ** 48) # just need enough to avoid reverts

    YES = True
    NO = False
    def trade(tradeCash, yes):
        tradeCash *= ATTO
        setsToBuy = tradeCash // numticks
        shares = setsToBuy + amm.rateSwap(setsToBuy, not yes) # considers both minted shares and swapped-for shares
        target = setsToBuy * 2
        slippage = (target - shares) / target
        return "{:23d}".format(shares), "{:12.10f}".format(slippage)

    def print_trade(tradeCash, yes):
        shares, slippage = trade(tradeCash, yes)
        direction = "YES" if yes else "NO"
        print("assert trade( {:8d}, {} ) == ( '{}', '{}' )".format(tradeCash, direction, shares, slippage))

    print("#               cash   type             shares                  slippage")
    print_trade(1, YES)
    print_trade(10, YES)
    print_trade(100, YES)
    print_trade(1000, YES)
    print_trade(10000, YES)
    print_trade(20000, YES)
    print_trade(30000, YES)
    print_trade(40000, YES)
    print_trade(50000, YES)
    print_trade(60000, YES)
    print_trade(70000, YES)
    print_trade(80000, YES)
    print_trade(90000, YES)
    print_trade(100000, YES)
    print_trade(200000, YES)
    print_trade(500000, YES)
    print_trade(1000000, YES)
    print_trade(2000000, YES)
    print_trade(5000000, YES)
    print_trade(10000000, YES)

    # Each cash is worth 1/numticks shares, but you get almost double per cash because you sell the side you don't want.
    # There's some slippage however, so you don't quite get double.
    #               cash   type             shares                  slippage
    assert trade(        1, YES ) == ( '       1999990000100000', '0.0000050000' )
    assert trade(       10, YES ) == ( '      19999000099990001', '0.0000499950' )
    assert trade(      100, YES ) == ( '     199900099900099901', '0.0004995005' )
    assert trade(     1000, YES ) == ( '    1990099009900990100', '0.0049504950' )
    assert trade(    10000, YES ) == ( '   19090909090909090910', '0.0454545455' )
    assert trade(    20000, YES ) == ( '   36666666666666666667', '0.0833333333' )
    assert trade(    30000, YES ) == ( '   53076923076923076924', '0.1153846154' )
    assert trade(    40000, YES ) == ( '   68571428571428571429', '0.1428571429' )
    assert trade(    50000, YES ) == ( '   83333333333333333334', '0.1666666667' )
    assert trade(    60000, YES ) == ( '   97500000000000000000', '0.1875000000' )
    assert trade(    70000, YES ) == ( '  111176470588235294118', '0.2058823529' )
    assert trade(    80000, YES ) == ( '  124444444444444444445', '0.2222222222' )
    assert trade(    90000, YES ) == ( '  137368421052631578948', '0.2368421053' )
    assert trade(   100000, YES ) == ( '  150000000000000000000', '0.2500000000' )
    assert trade(   200000, YES ) == ( '  266666666666666666667', '0.3333333333' )
    assert trade(   500000, YES ) == ( '  583333333333333333334', '0.4166666667' )
    assert trade(  1000000, YES ) == ( ' 1090909090909090909091', '0.4545454545' )
    assert trade(  2000000, YES ) == ( ' 2095238095238095238096', '0.4761904762' )
    assert trade(  5000000, YES ) == ( ' 5098039215686274509804', '0.4901960784' )
    assert trade( 10000000, YES ) == ( '10099009900990099009901', '0.4950495050' )

def test_amm_fee_calc_10(sessionFixture, market, shareToken, cash, factory, account0):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    cash.faucet(10 ** 48)  # just need enough to avoid reverts

    fee = 10  # 10/1000 aka 1.0%
    liquiditySets = 100
    amm = make_amm(sessionFixture, factory, market, shareToken, cash, account0, fee, liquiditySets)

    YES = True
    NO = False
    def trade(tradeCash, yes):
        tradeCash *= ATTO
        setsToBuy = tradeCash // numticks
        shares = setsToBuy + amm.rateSwap(setsToBuy, not yes) # considers both minted shares and swapped-for shares
        target = setsToBuy * 2
        slippage = (target - shares) / target
        return "{:23d}".format(shares), "{:12.10f}".format(slippage)

    def print_trade(tradeCash, yes):
        shares, slippage = trade(tradeCash, yes)
        direction = "YES" if yes else "NO"
        print("assert trade( {:8d}, {} ) == ( '{}', '{}' )".format(tradeCash, direction, shares, slippage))

    print("#               cash   type             shares                  slippage")
    print_trade(1, YES)
    print_trade(10, YES)
    print_trade(100, YES)
    print_trade(1000, YES)
    print_trade(10000, YES)
    print_trade(20000, YES)
    print_trade(30000, YES)
    print_trade(40000, YES)
    print_trade(50000, YES)
    print_trade(60000, YES)
    print_trade(70000, YES)
    print_trade(80000, YES)
    print_trade(90000, YES)
    print_trade(100000, YES)
    print_trade(200000, YES)
    print_trade(500000, YES)
    print_trade(1000000, YES)
    print_trade(2000000, YES)
    print_trade(5000000, YES)
    print_trade(10000000, YES)

    # Each cash is worth 1/numticks shares, but you get almost double per cash because you sell the side you don't want.
    # There's some slippage however, so you don't quite get double.
    assert trade(        1, YES ) == ( '       1989990100099000', '0.0050049500' )
    assert trade(       10, YES ) == ( '      19899010098990100', '0.0050494951' )
    assert trade(      100, YES ) == ( '     198901098901098901', '0.0054945055' )
    assert trade(     1000, YES ) == ( '    1980198019801980199', '0.0099009901' )
    assert trade(    10000, YES ) == ( '   19000000000000000000', '0.0500000000' )
    assert trade(    20000, YES ) == ( '   36500000000000000000', '0.0875000000' )
    assert trade(    30000, YES ) == ( '   52846153846153846154', '0.1192307692' )
    assert trade(    40000, YES ) == ( '   68285714285714285714', '0.1464285714' )
    assert trade(    50000, YES ) == ( '   83000000000000000000', '0.1700000000' )
    assert trade(    60000, YES ) == ( '   97125000000000000000', '0.1906250000' )
    assert trade(    70000, YES ) == ( '  110764705882352941176', '0.2088235294' )
    assert trade(    80000, YES ) == ( '  124000000000000000000', '0.2250000000' )
    assert trade(    90000, YES ) == ( '  136894736842105263158', '0.2394736842' )
    assert trade(   100000, YES ) == ( '  149500000000000000000', '0.2525000000' )
    assert trade(   200000, YES ) == ( '  266000000000000000000', '0.3350000000' )
    assert trade(   500000, YES ) == ( '  582500000000000000000', '0.4175000000' )
    assert trade(  1000000, YES ) == ( ' 1090000000000000000000', '0.4550000000' )
    assert trade(  2000000, YES ) == ( ' 2094285714285714285715', '0.4764285714' )
    assert trade(  5000000, YES ) == ( ' 5097058823529411764705', '0.4902941176' )
    assert trade( 10000000, YES ) == ( '10098019801980198019801', '0.4950990099' )

def test_amm_multiuser_liquidity(contractsFixture, market, cash, factory, shareToken, account0, account1):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()

    cash.approve(factory.address, 10 ** 48)
    cash.approve(factory.address, 10 ** 48, sender=account1)

    cost0 = 10 * ATTO
    cash.faucet(cost0)
    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost0, RATIO_50_50, True, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammInfo[0])

    cost1 = 5 * ATTO
    sets1 = cost1 // numticks
    cash.faucet(cost1, sender=account1)
    lpTokens1 = amm.addLiquidity(cost1, account1, sender=account1)

    assert amm.balanceOf(account1) == lpTokens1

    # Test is for verifying that this does not fail
    [short, long] = amm.rateRemoveLiquidity(lpTokens1, sender=account1)
    assert short == sets1
    assert long == sets1

    amm.removeLiquidity(lpTokens1, sender=account1, getReturnData=False)

def test_amm_villainous_fee_extraction(contractsFixture, market, cash, shareToken, factory, account0, account1):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    sets = 100 * ATTO
    initialLiquidityCost = (sets * numticks) + (2 * 10**6 * 1000)

    cash.approve(factory.address, 10 ** 48, sender=account0)
    cash.approve(factory.address, 10 ** 48, sender=account1)

    cash.faucet(initialLiquidityCost)
    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, initialLiquidityCost, RATIO_50_50, True, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammInfo[0])

    # Enter long position
    longPositionSets = 10 * ATTO
    longPositionCost = longPositionSets * numticks
    cash.faucet(longPositionCost)
    amm.enterPosition(longPositionCost, True, 0)

    # Attacker creates and destroys LP tokens, trying to make a nefarious profit thereby
    attacker = account1
    attackSets = 100 * ATTO
    attackLiquidityCost = attackSets * numticks
    cash.faucet(attackLiquidityCost, sender=attacker)
    lpTokens = amm.addLiquidity(attackLiquidityCost, attacker, sender=attacker)
    totalLPSupply = amm.totalSupply()
    shareToken.setApprovalForAll(factory.address, True, sender=attacker)

    [_, shortFromLP, longFromLP] = amm.shareBalances(attacker)
    [shortShare, longShare] = amm.removeLiquidity(lpTokens, sender=attacker)

    setsToKeep = min(shortFromLP + shortShare, longFromLP + longShare)
    shortsToExit = shortFromLP + shortShare - setsToKeep
    longsToExit = longFromLP + longShare - setsToKeep

    cashFromPosition = amm.exitPosition(shortsToExit, longsToExit, 0, sender=attacker)

    totalValue = cashFromPosition + setsToKeep*numticks

    print('lpTokens:', lpTokens)
    print('totalLPSupply:', totalLPSupply)
    print('shortFromLP:', shortFromLP)
    print('longFromLP:', longFromLP)
    print('shortShare:', shortShare)
    print('longShare:', longShare)
    print('setsToKeep:', setsToKeep)
    print('shortsToExit:', shortsToExit)
    print('longsToExit:', longsToExit)
    print('cashFromPosition:', cashFromPosition)
    print('totalValue:', totalValue)
    print('attackLiquidityCost:', attackLiquidityCost)

    assert lpTokens == 90909090909090909048
    assert totalLPSupply == 190909090909090909048
    assert shortFromLP == 0
    assert longFromLP == 17272727272727272800
    assert shortShare == 99999999999999999975
    assert longShare == 82727272727272727217
    assert cashFromPosition == 21778 # very very little difference in long and short so little to swap away
    assert attackLiquidityCost * 0.99 < totalValue <= attackLiquidityCost # no profit but little loss

def test_amm_add_liquidity_ratio(contractsFixture, market, cash, shareToken, factory, account0, account1):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    def calc_ratio():
        [_, short, long] = amm.shareBalances(amm.address)
        return short / long

    numticks = market.getNumTicks()
    sets = 100 * ATTO

    cash.approve(factory.address, 10 ** 48)

    initialLiquidityCost = (sets * numticks) + (2 * 10**6 * 1000)
    cash.faucet(initialLiquidityCost)
    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, initialLiquidityCost, RATIO_60_40, True, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammInfo[0])

    priorRatio = calc_ratio()

    subsequentLiquidityCost = sets * numticks
    cash.faucet(subsequentLiquidityCost)
    amm.addLiquidity(subsequentLiquidityCost, account0)
    latterRatio = calc_ratio()

    assert priorRatio == latterRatio

def test_amm_claim_from_multiple_markets(sessionFixture, universe, factory, shareToken, cash, account0, account1):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")


    def do_it():
        market = sessionFixture.createReasonableYesNoMarket(universe)
        numticks = market.getNumTicks()

        amm = make_amm(sessionFixture, factory, market, shareToken, cash, account1, FEE, 100)

        yesPositionSets = 10 * ATTO
        yesPositionCost = yesPositionSets * numticks

        cash.faucet(yesPositionCost)
        amm.enterPosition(yesPositionCost, True, 0)

        proceedToInitialReporting(sessionFixture, market)

        market.doInitialReport([0, 0, market.getNumTicks()], "", 0)

        disputeWindow = sessionFixture.applySignature('DisputeWindow', market.getDisputeWindow())
        sessionFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

        market.finalize()

        return market

    market1 = do_it()
    market2 = do_it()

    balanceBeforeFinalization = cash.balanceOf(account0)
    factory.claimMarketsProceeds([market1.address, market2.address], [shareToken.address, shareToken.address], account0, stringToBytes(""))

    # Should have more cash than before because both markets resolved in account0's favor.
    assert cash.balanceOf(account0) > balanceBeforeFinalization

# TODO tests
# 1. Two users add and remove liquidity, without trading occuring.
# 2. Two users add liquidity, then other users trade, then the users remove liquidity.
#    The worry is that our reward function doesn't work quite right so users won't get back what they put in.
# 3. User adds liqudity. Then there's trading. Then another user adds liquidity. They should get the right number of LP tokens.
#    And when the users remove liquidity, they get the number of shares and cash that makes sense.
# 4. Users swap and enter and exit positions.
# 5. The sqrt functions for safemath int and uint work as expected. Alex wrote them but there just aren't any tests yet.
# 6. Verify specific enterPosition costs.


def make_amm(sessionFixture, factory, market, shareToken, cash, account, fee=FEE, liquiditySets=0, liquidityRatio=RATIO_50_50):
    liquiditySets *= ATTO
    liquidityCash = (liquiditySets * market.getNumTicks()) + (2 * 10**6 * 1000)
    cash.faucet(liquidityCash)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(factory.address, True)

    ammInfo = factory.addAMMWithLiquidity(market.address, shareToken.address, fee, liquidityCash, liquidityRatio, True, account)
    amm = sessionFixture.applySignature("AMMExchange", ammInfo[0])

    return amm
