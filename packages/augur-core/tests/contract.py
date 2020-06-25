from eth_tester.exceptions import TransactionFailed
from decimal import Decimal

class Contract():

    def __init__(self, w3, w3Contract, logListener=None, coverageMode=False):
        self.w3 = w3
        self.w3Contract = w3Contract
        self.address = self.w3Contract.address
        self.abi = self.w3Contract.abi
        self.logListener = logListener
        self.coverageMode = coverageMode
        if len(self.w3Contract.abi) < 1:
            return
        for abiFunc in self.w3Contract.functions._functions:
            functionName = abiFunc['name']
            originalFunction = self.w3Contract.functions.__dict__[functionName]
            setattr(self, functionName, self.get_contract_function(originalFunction, abiFunc))
            setattr(self, functionName + "_encode", self.get_encode_contract_function(originalFunction, abiFunc))

    def get_encode_contract_function(self, originalFunction, abiFunc):
        def encode_contract_function(*args):
            contractFunction = originalFunction(*self.processArgs(*args, abiFunc=abiFunc))
            return contractFunction._encode_transaction_data()
        return encode_contract_function

    def get_contract_function(self, originalFunction, abiFunc):
        def contract_function(*args, sender=self.w3.eth.accounts[0], value=0, getReturnData=True, commitTx=True, debug=False, gas=1000000000):
            contractFunction = originalFunction(*self.processArgs(*args, abiFunc=abiFunc))
            retVal = True
            outputs = abiFunc['outputs']
            value = int(value)
            gas = int(gas)
            # In coverage mode all functions change state through logs so we can't do this optimization
            if not self.coverageMode and len(outputs) == 1 and outputs[0]['type'] == 'bool':
                getReturnData = False
            if getReturnData or abiFunc['constant'] or not commitTx:
                try:
                    retVal = contractFunction.call({'from': sender, 'value': value, 'gas': gas}, block_identifier='pending')
                except TransactionFailed as e:
                    raise e
                except: # There is a specific contract this is for where the expected return value is (bool, string)
                    retVal = True, ""
            if not abiFunc['constant'] and commitTx:
                tx_hash = contractFunction.transact({'from': sender, 'value': value, 'gasPrice': 1, 'gas': gas})
                receipt = self.w3.eth.waitForTransactionReceipt(tx_hash, 1)
                if receipt.status == 0:
                    raise TransactionFailed
                if self.logListener:
                    for log in receipt.logs:
                        self.logListener(log)
            return retVal

        return contract_function

    def processArgs(self, *args, abiFunc):
        processedArgs = []
        for index, abiParam in enumerate(abiFunc['inputs']):
            arg = args[index]
            argType = type(arg)
            if argType is float or argType is Decimal:
                arg = int(arg)
            elif abiParam['type'] == 'uint256[]':
                arg = [int(item) for item in arg]
            elif argType == str and abiParam['type'] == 'bytes32':
                arg = arg.encode('utf-8')
            elif abiParam['type'] == 'bytes32[]' and type(arg[0]) is not bytes:
                arg = [item.encode('utf-8') for item in arg]
            processedArgs.append(arg)
        return processedArgs

    def getLogs(self, eventName):
        return self.w3Contract.events.__dict__[eventName].getLogs()

