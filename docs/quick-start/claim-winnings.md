---
description: >-
  In some instances it is valuable to be able to run claimTradingProceeds via web console.
---

## Introduction

Augur version 2.0,  In some cases or situtations the user needs to claim winnings manually. Below are the instructions to do so.


## Login

Load the trading UI and login like normal. Navigate to the market you want to claim proceeds on, make note of the marketId that is in the address bar.


## Web console

After loading up the trading UI, open the web console. The process varies depending on browser. In Chrome the web console is in developer tools which can be accessed from View -> Developer -> Developer Tools.


## Claim Winnings

In order to execute the command, The market id and user account needs to be known. In the web console type

```
await AugurSDK.contracts.shareToken.claimTradingProceeds("<marketId>", "<user account>", "0x3131000000000000000000000000000000000000000000000000000000000000");
```

After pressing ENTER, meta mask or your wallet provider will pop up for you to sign the transactions, make sure to review the transaction. After signing the transaction will be sent.

