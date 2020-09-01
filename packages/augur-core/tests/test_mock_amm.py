from math import sqrt, floor
from pytest import fixture, mark, raises

NUM_TICKS = 100
FEE_MULTIPLIER = .99
lp = "LP"
lp_2 = "LP_2"
trader = "TRADER"
trader_2 = "TRADER_2"

def test_amm():
    amm = AMM()
    yes = amm.yes
    no = amm.no
    invalid = amm.invalid
    cash = amm.cash

    lpBankroll = 1000 * 10**18
    traderBankRoll = 1000 * 10**18

    cash.mint(lp, lpBankroll)
    cash.mint(trader, traderBankRoll)

    amm.addLiquidity(lp, 100)

    amm.removeLiquidity(lp, 50)

    amm.enterPosition(trader, 50, True)
    assert roughlyEqual(yes.balanceOf(trader), 1)

    amm.exitPosition(trader, 50)

    printBalances(lp, amm)
    printBalances(trader, amm)
    printBalances(amm, amm)

@mark.parametrize('initialLiquidity', [
    300,
    #600,
    #1000,
    #2500,
    #5000
])
def test_take_position(initialLiquidity):
    amm = AMM()
    with TestHarness(amm, initialLiquidity) as session:
        session.enterPosition(trader, 160, True)

# XXX Orderbook PL wrong below

@mark.parametrize('initialLiquidity', [
    300,
    500,
    1000,
    2500,
    5000
])
def test_take_position_multiple(initialLiquidity):
    amm = AMM()
    with TestHarness(amm, initialLiquidity) as session:
        for i in range(4):
            session.enterPosition(trader, 14, True)

@mark.parametrize('initialLiquidity', [
    300,
    1000,
    2500,
    5000
])
def test_take_exit_position(initialLiquidity):
    amm = AMM()
    with TestHarness(amm, initialLiquidity) as session:
        session.enterPosition(trader, 55, True)
        session.exitPosition(trader, 55)

@mark.parametrize('initialLiquidity', [
    300,
    500,
    1000,
    2500,
    5000
])
def test_take_exit_multiple_position(initialLiquidity):
    amm = AMM()
    with TestHarness(amm, initialLiquidity) as session:
        session.enterPosition(trader, 55, True)
        for i in range(3):
            session.exitPosition(trader, 10)

# Trader takes position of size X
# Trader exits position in batches

# Trader takes position of size X
# Trader_2 takes opposing position of size Y
# Trader exits position entirely

# Trader takes position of size X
# Trader_2 takes same position of size Y
# Trader exits position entirely


class TestHarness():

    def __init__(self, amm, initialLiquidity):
        self.amm = amm
        initialLiquidity *= 10**18
        amm.cash.mint(lp, initialLiquidity)
        amm.cash.mint(trader, 10**30)
        amm.cash.mint(trader_2, 10**30)
        amm.cash.mint(lp_2, 10**30)
        self.initialLiquidity = initialLiquidity

    def __enter__(self):
        self.numShares = self.initialLiquidity / NUM_TICKS
        self.amm.addLiquidity(lp, self.numShares)
        return self

    def enterPosition(self, buyer, amountInDai, buyYes):
        amountInDai *= 10**18
        self.amm.enterPosition(buyer, amountInDai, buyYes)
        self.avgSharePrice = amountInDai / (self.amm.yes.balanceOf(buyer) if buyYes else self.amm.no.balanceOf(buyer))

    def exitPosition(self, seller, cashToBuy):
        cashToBuy *= 10**18
        self.amm.exitPosition(seller, cashToBuy)

    def __exit__(self, *args):
        if args[1]:
            raise args[1]
        poolYes = self.amm.yes.balanceOf(self.amm)
        poolNo = self.amm.no.balanceOf(self.amm)
        yesValue = poolNo * NUM_TICKS / (poolYes + poolNo)
        noValue = NUM_TICKS - yesValue
        self.amm.removeLiquidity(lp, self.initialLiquidity / NUM_TICKS)
        lpCashValue = self.amm.cash.balanceOf(lp) + (self.amm.yes.balanceOf(lp) * yesValue) + (self.amm.no.balanceOf(lp) * noValue)
        orderBookPL = floor((self.numShares - self.amm.yes.balanceOf(lp)) * (55 - yesValue) / 10**18)
        print("\n\nRESULTS FOR LIQUIDITY %i" % (self.initialLiquidity / 10**18))
        printBalances(lp, self.amm)
        print("YES VALUE:       %i" % yesValue)
        print("TOTAL LP VALUE: %i" % (lpCashValue / 10**18))
        print("PL:              %i" % ((lpCashValue - self.initialLiquidity) / 10**18))
        print("ORDERBOOK PL:    %i" % orderBookPL)
        self.amm.debugPrint()


class Token():

    def __init__(self, name):
        self.name = name
        self.balances = {}
        self.totalSupply = 0

    def mint(self, target, amount):
        self.balances[target] = amount if target not in self.balances else self.balances[target] + amount
        self.totalSupply += amount

    def burn(self, target, amount):
        self.balances[target] = self.balances[target] - amount
        self.totalSupply -= amount

    def transfer(self, frm, to, amount):
        self.balances[frm] -= amount
        if self.balances[frm] < 0: raise Exception("%s Balance for %s negative" % (self.name, frm))
        self.balances[to] = amount if to not in self.balances else self.balances[to] + amount

    def balanceOf(self, account):
        return 0 if account not in self.balances else self.balances[account]

    def printBalance(self, account):
        div = 10**18 if self.name in ["CASH", "AMM"] else 10**16
        print("%s   %i" % ((self.name+":").ljust(8), self.balanceOf(account) / div))


class ShareToken():

    def __init__(self):
        self.cash = Token("CASH")
        self.yes = Token("YES")
        self.no = Token("NO")
        self.invalid = Token("INVALID")

    def buyCompleteSets(self, buyer, amount):
        self.cash.transfer(buyer, self, amount * NUM_TICKS)
        self.yes.mint(buyer, amount)
        self.no.mint(buyer, amount)
        self.invalid.mint(buyer, amount)

    def sellCompleteSets(self, amount):
        self.yes.burn(buyer, amount)
        self.no.burn(buyer, amount)
        self.invalid.burn(buyer, amount)
        self.cash.transfer(self, buyer, amount * NUM_TICKS * FEE_MULTIPLIER)


class AMM(Token):

    def __init__(self):
        Token.__init__(self, "AMM")
        self.shareToken = ShareToken()
        self.cash = self.shareToken.cash
        self.yes = self.shareToken.yes
        self.no = self.shareToken.no
        self.invalid = self.shareToken.invalid
        self.debugPrintBuffer = []

    def addLiquidity(self, liquidityProvider, sharesToBuy):
        poolConstantBefore = sqrt(self.poolConstant())

        self.cash.transfer(liquidityProvider, self, sharesToBuy * NUM_TICKS)
        self.shareToken.buyCompleteSets(self, sharesToBuy)

        if poolConstantBefore == 0:
            self.mint(liquidityProvider, sqrt(self.poolConstant()))
        else:
            self.mint(liquidityProvider, floor((self.totalSupply * sqrt(self.poolConstant()) / poolConstantBefore) - self.totalSupply))

    def poolConstant(self):
        return self.yes.balanceOf(self) * self.no.balanceOf(self)

    def __str__(self):
        return "AMM"

    def debugPrint(self):
        for item in self.debugPrintBuffer:
            print(item)

    def removeLiquidity(self, liquidityProvider, poolTokensToSell):
        poolSupply = self.totalSupply
        invalidShare = floor(self.invalid.balanceOf(self) * poolTokensToSell / poolSupply)
        noShare = floor(self.no.balanceOf(self) * poolTokensToSell / poolSupply)
        yesShare = floor(self.yes.balanceOf(self) * poolTokensToSell / poolSupply)
        daiShare = floor(self.cash.balanceOf(self) * poolTokensToSell / poolSupply)
        self.burn(liquidityProvider, poolTokensToSell)
        self.yes.transfer(self, liquidityProvider, yesShare)
        self.no.transfer(self, liquidityProvider, noShare)
        self.invalid.transfer(self, liquidityProvider, invalidShare)
        self.cash.transfer(self, liquidityProvider, daiShare)

    def enterPosition(self, buyer, amountInDai, buyYes):
        poolInvalid = self.invalid.balanceOf(self)
        poolNo = self.no.balanceOf(self)
        poolYes = self.yes.balanceOf(self)
        setsToBuy = floor(amountInDai / NUM_TICKS)

        invalidToUser = setsToBuy
        noToUser = setsToBuy
        yesToUser = setsToBuy
        poolInvalid = poolInvalid - invalidToUser
        poolNo = poolNo - noToUser
        poolYes = poolYes - yesToUser

        if poolInvalid < 0: raise Exception("Pool doesnt have enough invalid shares")
        if poolYes < 0: raise Exception("Pool doesnt have enough yes shares")
        if poolNo < 0: raise Exception("Pool doesnt have enough no shares")

        poolConstant = poolYes * poolNo

        if buyYes:
            yesToUser += floor(poolYes - (poolConstant / (poolNo + noToUser)))
            noToUser = 0
        else:
            noToUser += floor(poolNo - (poolConstant / (poolYes + yesToUser)))
            yesToUser = 0

        self.cash.transfer(buyer, self, amountInDai)
        self.yes.transfer(self, buyer, yesToUser)
        self.no.transfer(self, buyer, noToUser)
        self.invalid.transfer(self, buyer, invalidToUser)
        self.debugPrintBuffer.append("SHARE AVG PURCHASE PRICE: %i" % (amountInDai / (yesToUser if buyYes else noToUser)))

    def exitPosition(self, seller, cashToBuy):
        userInvalid = self.invalid.balanceOf(seller)
        userNo = self.no.balanceOf(seller)
        userYes = self.yes.balanceOf(seller)
        poolNo = self.no.balanceOf(self)
        poolYes = self.yes.balanceOf(self)
        setsToSell = floor(cashToBuy / NUM_TICKS)

        if userInvalid >= setsToSell and userNo >= setsToSell and userYes >= setsToSell:
            self.yes.transfer(self, seller, setsToSell)
            self.no.transfer(self, seller, setsToSell)
            self.invalid.transfer(self, seller, setsToSell)
            self.cash.transfer(self, seller, cashToBuy)
            return

        if userInvalid < setsToSell: raise Exception("AugurCP: You don't have enough invalid tokens to close out for this amount.")
        if userNo <= setsToSell and userYes <= setsToSell: raise Exception("AugurCP: You don't have enough YES or NO tokens to close out for this amount.")

        poolConstant = poolYes * poolNo
        invalidFromUser = setsToSell
        noFromUser = 0
        yesFromUser = 0
        if userYes > userNo:
            noToUser = setsToSell - userNo
            yesToPool = floor((poolConstant / (poolNo - noToUser)) - poolYes)
            if yesToPool > (userYes - setsToSell): raise Exception("AugurCP: You don't have enough YES tokens to close out for this amount.")
            noFromUser = userNo
            yesFromUser = yesToPool + setsToSell
        else:
            yesToUser = setsToSell - userYes
            noToPool = floor((poolConstant / (poolYes - yesToUser)) - poolNo)
            if noToPool > (userNo - setsToSell): raise Exception("AugurCP: You don't have enough NO tokens to close out for this amount.")
            yesFromUser = userYes
            noFromUser = noToPool + setsToSell

        self.invalid.transfer(seller, self, invalidFromUser)
        self.no.transfer(seller, self, noFromUser)
        self.yes.transfer(seller, self, yesFromUser)
        self.cash.transfer(self, seller, cashToBuy)

def roughlyEqual(amount1, amount2, tolerance = .01):
    return abs(amount1 - amount2) < tolerance

def printBalances(holder, amm):
    print("\nBALANCES for %s:" % holder)
    amm.cash.printBalance(holder)
    amm.yes.printBalance(holder)
    amm.no.printBalance(holder)
    amm.invalid.printBalance(holder)