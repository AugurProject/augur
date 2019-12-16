#!/usr/bin/env python

import os

def test_cashSender_usage():
    for root, dirs, files in os.walk('source/contracts'):
        for file in files:
            if (file == "CashSender.sol"):
                continue
            if (not file.endswith("sol")):
                continue
            with open(os.path.join(root, file), "r") as auto:
                data = auto.read()
                expectedOccurences = 0
                if (file == "Market.sol"):
                    expectedOccurences = 1
                notFound = data.count("cash.transfer") == expectedOccurences
                assert notFound, "Contract %s has an unexpected cash.transfer in it" % file