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
                notFound = data.count("cash.transfer") == 0
                assert notFound, "Contract %s has an unexpected cash.transfer in it" % file
                notFound = data.count("cash.balanceOf") == 0
                assert notFound, "Contract %s has an unexpected cash.balanceOf in it" % file
                notFound = data.count("cash.allowance") == 0
                assert notFound, "Contract %s has an unexpected cash.allowance in it" % file