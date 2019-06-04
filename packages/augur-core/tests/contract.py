from eth_tester.exceptions import TransactionFailed
from decimal import Decimal

class Contract():

    def __init__(self, w3, w3Contract):
        self.w3 = w3
        self.w3Contract = w3Contract
        self.address = self.w3Contract.address
        self.abi = self.w3Contract.abi
        if len(self.w3Contract.abi) < 1:
            return
        for abiFunc in self.w3Contract.functions._functions:
            functionName = abiFunc['name']
            originalFunction = self.w3Contract.functions.__dict__[functionName]
            setattr(self, functionName, self.get_contract_function(originalFunction, abiFunc))

    def get_contract_function(self, originalFunction, abiFunc):
        def contract_function(*args, sender=self.w3.eth.accounts[0], value=0, getReturnData=True, commitTx=True):
            contractFunction = originalFunction(*self.processArgs(*args, abiFunc=abiFunc))
            retVal = True
            outputs = abiFunc['outputs']
            if len(outputs) == 1 and outputs[0]['type'] == 'bool':
                getReturnData = False
            if getReturnData or abiFunc['constant'] or not commitTx:
                retVal = contractFunction.call({'from': sender, 'value': value}, block_identifier='pending')
            if not abiFunc['constant'] and commitTx:
                tx_hash = contractFunction.transact({'from': sender, 'value': value, 'gasPrice': 1, 'gas': 7500000})
                receipt = self.w3.eth.waitForTransactionReceipt(tx_hash, 1)
                if receipt.status == 0:
                    raise TransactionFailed
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

