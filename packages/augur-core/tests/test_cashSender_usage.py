#!/usr/bin/env python

import os

methods = {
    "transfer": {
        "AugurWallet.sol": 1,
    },
    "balanceOf": {
        "Market.sol": 1,
        "AugurWalletRegistry.sol": 1,
    },
    "allowance": {
    },
    "approve": {
        "Market.sol": 1,
        "Universe.sol": 2,
        "AugurTrading.sol": 1,
        "FillOrder.sol": 1,
        "AugurWallet.sol": 4,
    }
}

def test_cashSender_usage():
    for root, dirs, files in os.walk('source/contracts'):
        for file in files:
            if (file == "CashSender.sol"):
                continue
            if (not file.endswith("sol")):
                continue
            with open(os.path.join(root, file), "r") as auto:
                data = auto.read()
                for method, fileExceptions in methods.items():
                    expected = fileExceptions.get(file) or 0
                    notFound = data.count("cash.%s" % method) <= expected
                    assert notFound, "Contract %s has an unexpected cash.%s in it" % (file, method)
