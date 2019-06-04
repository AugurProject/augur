#!/usr/bin/env python

from decimal import Decimal
from struct import pack

nullAddress = "0x0000000000000000000000000000000000000000"
garbageAddress = '0xdefec8eddefec8eddefec8eddefec8eddefec8ed'
twentyZeros = str(pack(">l", 0).rjust(20, '\x00'.encode('utf-8')))
thirtyTwoZeros = str(pack(">l", 0).rjust(32, '\x00'.encode('utf-8')))

def fix(n, m = 1):
    return Decimal(n) * Decimal(m) * 10**18

def unfix(n):
    return n // 10**18

def stringToBytes(value):
    return value.ljust(32, '\x00').encode('utf-8')

def longTo32Bytes(value):
    return pack(">l", value).rjust(32, '\x00'.encode('utf-8'))

def longToHexString(value, leftPad=40):
    # convert the value to a hex string, strip off the `0x`, strip off any trailing `L`, pad with zeros, prefix with `0x`
    return '0x' + hex(value)[2:].rstrip('L').zfill(leftPad)

def bytesToLong(value):
    return value.encode('hex')

def captureFilteredLogs(state, contract, logs):
    def captureLog(contract, logs, message):
        translated = contract.translator.listen(message)
        if not translated: return
        logs.append(translated)
    state.log_listeners.append(lambda x: captureLog(contract, logs, x))

class TokenDelta():

    def __init__(self, token, delta, account, err=""):
        self.account = account
        self.token = token
        self.delta = delta
        self.err = err

    def __enter__(self):
        self.originalBalance = self.token.balanceOf(self.account)

    def __exit__(self, *args):
        if args[1]:
            raise args[1]
        originalBalance = self.originalBalance
        newBalance = self.token.balanceOf(self.account)
        delta = self.delta
        resultDelta = newBalance - originalBalance
        diff = delta - resultDelta
        assert diff == 0, self.err + ". Delta EXPECTED: %i ACTUAL: %i DIFF: %i" % (delta, resultDelta, diff)

class BuyWithCash():

    def __init__(self, cash, amount, account, err=""):
        self.account = account
        self.cash = cash
        self.amount = amount
        self.err = err

    def __enter__(self):
        self.originalBalance = self.cash.balanceOf(self.account)
        self.cash.faucet(self.amount, sender = self.account)

    def __exit__(self, *args):
        if args[1]:
            print(args)
            raise args[1]

class EtherDelta():

    def __init__(self, delta, account, chain, err=""):
        self.account = account
        self.chain = chain
        self.delta = delta
        self.err = err

    def __enter__(self):
        self.originalBalance = self.chain.head_state.get_balance(self.account)

    def __exit__(self, *args):
        if args[1]:
            raise args[1]
        originalBalance = self.originalBalance
        newBalance = self.chain.head_state.get_balance(self.account)
        delta = self.delta
        resultDelta = newBalance - originalBalance
        assert resultDelta == delta, self.err + ". Delta EXPECTED: %i ACTUAL: %i DIFF: %i" % (delta, resultDelta, delta - resultDelta)

class PrintGasUsed():

    def __init__(self, fixture, action, originalGas=0):
        self.fixture = fixture
        self.action = action
        self.originalGas = originalGas
        self.blockNumber = self.fixture.eth_tester.backend.chain.get_block().number

    def __enter__(self):
        pass

    def __exit__(self, *args):
        if args[1]:
            raise args[1]
        currentBlock = self.fixture.eth_tester.backend.chain.get_block().number
        gasUsed = 0
        while self.blockNumber < currentBlock:
            gasUsed += self.fixture.eth_tester.backend.chain.get_canonical_block_by_number(self.blockNumber)._header._gas_used
            self.blockNumber += 1
        if self.originalGas:
            print("GAS USED WITH %s : %i. ORIGINAL: %i DELTA: %i" % (self.action, gasUsed, self.originalGas, self.originalGas - gasUsed))
        else:
            print("GAS USED WITH %s : %i" % (self.action, gasUsed))

class AssertLog():

    def __init__(self, fixture, eventName, data, skip=0, contract=None):
        self.fixture = fixture
        self.eventName = eventName
        self.data = data
        self.skip = skip
        self.contract = contract
        if not self.contract:
            self.contract = fixture.contracts['Augur']

    def __enter__(self):
        pass

    def __exit__(self, *args):
        if args[1]:
            raise args[1]

        foundLog = None
        for log in self.contract.getLogs(self.eventName):
            if (self.skip == 0):
                foundLog = log
                break
            else:
                self.skip -= 1

        if not foundLog:
            import pdb;pdb.set_trace()
            raise Exception("Assert log failed to find the log with event name %s" % (self.eventName))

        for (key, expectedValue) in self.data.items():
            actualValue = log.args.get(key)
            assert actualValue == expectedValue, "%s Log had incorrect value for key \"%s\". Expected: %s. Actual: %s" % (self.eventName, key, expectedValue, actualValue)
