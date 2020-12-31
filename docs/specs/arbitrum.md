# Arbitrum flow has 2 parts:

1. Setup: enable bridging from Ethereum to Arbitrum's L2 chain.
2. Use: bridge Augur markets and fees to L2.

## Setup

+ Arbitrum deploys contracts on Ethereum: GlobalInbox, AugurPushBridge, ArbitrumBridge.
+ Arbitrum invokes ArbitrumBridge.registerArbchain.
* Arbitrum deploys contacts on their chain: ArbitrumMarketGetter.
* Anyone deploys Augur to the Arbitrum chain, set to point to the ArbitumMarketGetter.

##  Use

* On Ethereum, user calls ArbitrumBridge to initiate a bridge of a Market or Fee from Ethereum to Arbitrum.
* The bridge uses AugurPushBridge as a utility to generate the payload.
* That payload is sent to GlobalInbox.
* On Arbitrum, ArbOS reads the inbox and calls ArbitrumMarketGetter methods receiveMarketData or receiveFeeData, with appropriate args.
* Now the Augur contracts deployed on Arbitrum get their market information from that market getter.
