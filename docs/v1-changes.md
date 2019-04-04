# V2 Contract Changes

DAI (denomination token changed to point at an ERC20)
We are excited to satisfy the single biggest request we have received since our initial release: allow for trading with a stablecoin. V1 Augur uses ETH for all trading. While this is a natural fit in many ways for a decentralized platform running on Ethereum, ETH is highly volatile. Introducing stablecoin denomination will make trading less volatile and more accessible. 

For V1, the usage of ETH was accomplished by using a contract (“Cash”) that wrapped ETH and was given additional trust by the Augur contracts to take privileged transfers. The V2 contracts will still reference “Cash,” which will instead point to an ERC20 Token with no extensions. At release time, this will be set to the Multi-Collateral DAI token. 

## Invalid as a tradeable outcome

In V2, we address another major pain point for Augur users: the risk of invalid markets. 

In V1, a market resolves as “Invalid” when reporters deem its outcome ambiguous or unverifiable. Shares in such markets can be turned in for an equal amount of money. For example, a three outcome market with outcomes A, B, and C that resolves Invalid will give .33 ETH for a share of each outcome. Bad actors have capitalized on this by, for instance, creating markets that end before the event outcome is known and buying cheap shares that earn a profit once the market resolves Invalid. 

In V2, Invalid will be a tradeable outcome like any other. This is a simpler mechanism and also provides a huge benefit in the form of an observable metric for the likelihood that a market is Invalid based on market forces. For example, if a market’s orderbook consistently has BUY orders for Invalid above .2, that suggests there is a greater than 20% chance the market is Invalid. For conservative users, this should be a warning to not trade the market.

## Invalid markets will send market creator fees to the pool of reporter fees

When a market resolves Invalid in V1, the market creator still collects fees. V2 contracts will further discourage the creation of malicious markets by sending these fees to reporters rather than market creators in the event of Invalid outcomes.

## “Use It or Lose It” forking

In V1 Augur, if a fork occurs, REP holders are given 60 days to participate in the resolution by migrating to a Universe correlated with the forking market’s outcomes. For example, if there were a market for the 2016 U.S. presidential election which forked there would be a Universe where Trump won and a universe where Hillary won. The Universe with the most REP by the end of the 60 day period or which reaches 50% of all REP, wins. In order to incentivize people to migrate their REP before the fork resolves, anyone in V1 who does so receives a 5% bonus to their migrated REP in their new universe.

While this is a theoretically rational incentive, it has a couple problems:

First, this method introduces a security vulnerability that means the cost to force a fork must be higher than 5% of all REP. While this was easy to solve, it is arguably preferable to have flexibility in the values being used.

The larger issue is that a 5% bonus is an insufficient motivator to secure the platform. In an ideal world, we get 100% REP holder participation, in which case a 51% coalition is needed to determine the winner. For example, if the 5% bonus is only enough to incentivize 10% of REP holders, then only a 5.1% coalition is needed to determine the winner. This is only twice the amount of REP used in one side of the dispute to get to the fork in the first place.

In order to combat this, the V2 contracts will not allow migration to children universes after the 60 day window has ended. This is the most effective way to motivate participation in a fork, which is the crux of the Augur security model.
Disputing the winning outcome may be done without waiting
In V1, markets often take a while to resolve. Well, this is about to change... We are excited to introduce a suite of improvements that will speed up this process. 

First off, in V2, disputes can occur immediately following one another. In V1, when an outcome is disputed, REP holders must wait until the next window to dispute the tentative winning outcome. This effectively paces disputes such that each round takes a week. In V2, for an outcome to win, it still must be undisputed for an entire seven-day window, however anyone may dispute that outcome regardless of when it won or when the next window begins.

This feature will turn off if a market reaches a sufficient size (currently, once it is large enough that a fork could occur in eight rounds) and rounds will return to a weeklong pace. The longer timeframe will allow reporters to mobilize the large amount of REP necessary for dispute. For example, reporters can use the time to convince large REP holders to participate or to access REP that is held in cold storage. 

## Designated reporting reduced to one day

We have also compressed the designated reporting window to a day since the vast majority of designated reporters that show up to report do so within 24 hours of market expiration.
Pre-emptive contributions to tentative winning outcome
V2 formalizes and improves a sort of accidental feature from V1 that can accelerate market resolution: allowing REP holders to contribute any desired amount to their reported outcome (up to the threshold at which dispute pacing turns on again, described above). If the tentative winning outcome is disputed, then these contributions automatically go toward a dispute.

For example, imagine a market has an initial report for outcome A with 1 REP. Now imagine that a REP holder wishes to make sure that the market resolves quickly should it be disputed. They can contribute 200 REP safely toward outcome A. If the market is disputed, let’s say for outcome B with 2 REP, that 200 REP will immediately be used to dispute outcome B in favor of A in a single large bond. To progress to the next round, disputers would need to put up 400 REP toward outcome B.

## REP Price Auction

Adjusting fees paid to reporters by traders is one of the main mechanisms that keeps Augur secure. The fee is adjusted based on the total open interest (OI) on the platform and the price of REP. To determine the price of REP in V1, a centralized price feed was put in place. Shortly after launch, a bug was discovered that rendered this price feed pointless, as the fees did not adjust in relation to the centralized feed. Because of this bug, the key needed to update this price feed was discarded.

We have resolved the aforementioned bug in V2, and furthermore, we are making the platform fully decentralized by introducing a built-in double auction that will act as the price feed. Two double auctions will take place each week where a pot of DAI and REP are sold for one another, and a REP price is calculated from the sale prices. The platform will mint a small amount of REP weekly to compensate for any losses from the auction. This will introduce a small amount of inflation to REP in exchange for a decentralized price feed used to maintain platform security.

## Upgrade token standard to ERC777

ERC20 is a simple, commonplace standard in the Ethereum ecosystem that allows for many applications. That said, it has some deficiencies. One of the proposed token standards, ERC777, is backward compatible with ERC20 but also improves upon many of its features.

In particular, the reason we wanted V2 to support this standard was so that developers can make use of the “tokensReceived” fallback function feature. This feature will allow developers to make their apps interact with Augur tokens without the need for users to give full transfer permissions or make an extra approval transaction for every action they take.
Removal of the Controller Contract and the Escape Hatch
In V1, the Controller contract serves as a central registry for the Augur contracts as well as the entrypoint for admin controls such as triggering the “escape hatch,” which would attempt to let users withdraw their funds in case of a critical bug. Two weeks after the launch of V1, the admin key was transferred to a burn address. The V2 contracts will include no escape hatch. Given this, the Controller contract became just a contract registry which made more sense to implement in the Augur contract.

## Maximum market duration of X months implemented
While there is no technical reason for a market end time limitation, there are two compelling issues that make this limit a good idea in practice:

The first issue is that when a new version of the platform is released, REP holders can and will be expected to migrate REP to the new version of Augur. Because the security of the platform relies upon the price of REP, as well as OI, this means that any markets which are on the old version will increasingly become insecure as time goes on. A limit on market duration will help combat this risk.

The other issue is that fees in Augur are only taken at settlement. This means that someone can purchase shares from the system and only pay fees after market finalization. This is in contrast to the trading fees which are paid any time two parties trade in their shares for Cash. The greater the OI and the longer it is held without fees being paid, the more cost this places on the system for trading which extracts fees. This is because the security model and adjustments to the fee for reporters are based on the OI in the platform. With a limited market duration, we limit the impact this has to at least prevent a weaponized variant where a malicious party parks a large amount of OI in the system without trading.

It should be noted that for V2, we have chosen to not implement time based fees. However, we are considering this change for a future version. We believe that currently the issue is likely low impact and not worth introducing yet.
## Trading features
Multiple features are being added to the trading API:
### Ability to ignore shares when trading
In the event that someone wishes to use the trading functions but also not sell existing shares, they can now specify that preference. When this option is used, the system will not automatically liquidate complete sets.
### KYC token support / segregation
The trading functions allow a token to be specified which will cause trades to take place in an orderbook segregated only to holders of that token. The intention of this feature is to support tokens that are awarded through KYC providers.

## Affiliate marketing support
In order to incentivize marketers to advertise markets to traders, the trading functions now allow for an affiliate address to be specified. This will give a portion of the market creator’s fees to the specified address. That portion is set by the market creator during market creation and can be 0 if they do not wish to enable this feature.

## Remove ETH fees from disputing
REP used in reporting and disputing in V1 Augur awards reporting fees. While this seems logical enough, the volume of REP staked works out such that any fees gained this way are less than the additional gas cost of tracking them in the majority of cases. In order to spare REP holders this cost and to simplify the code, both reporting and disputing in V2 will simply not award reporting fees. The 40% ROI from disputing is considered more than enough of an incentive to encourage disputing

## Floating formulas altered to decrease much slower than they increase
An important way that Augur encourages creating valid markets is via the validity bond. In V1 Augur, this bond rate changes over time and responds to the number of invalid markets being created. While the V1 bonds are moving and the formulas are generally working, the way they are tuned means that the bond rate being stable depends on the overall rate of invalidity not to be performing particularly well.

For example, the system targets a 1% rate for Invalid markets. It may take several weeks of an increased rate of Invalid markets for the bond to double, and a single week with a 0% Invalid rate will halve it. In effect, when a level is reached that discourages creating Invalid markets, the bond will immediately halve, undoing the multiple weeks of increases.

In V2, the floating bond formula is being altered such that the maximum increase is still 100%, but the maximum decrease for one period is only 10%. This should allow bonds to stay at the appropriate level longer but also allow them to decrease if platform behavior changes.

This change will also apply to the no show bond and the initial reporter bond amounts.

## Ability to make signed trades off chain that can be executed by another party
With the introduction of DAI to denominate markets, it is possible to reach users who do not possess ETH. The V2 trading contracts include a mechanism for executing a signed message which contains data about a trade. This means that someone can generate a trade, such as “Buy 1 @ .9”, and post it publicly where another party can spend the gas to execute it and the system will take the signer’s required capital to execute the trade. In theory this enables a system that allow ETH-less trading, though in practice they still need to have an ETH account with DAI and also need to approve their DAI for transfer which will cost ETH in gas costs.


## Bug Fixes

See the [v1-notable-bugs.md](./v1-notable-bugs.md) document

## Misc. Changes
 - Solidity Compiler Upgraded to 0.5.4
 - Removal of the waiting period on claiming winning shares
 - Trades automatically sell any owned complete sets
 - Functions for creating or canceling multiple orders in one TX added
 - Function for modifying order price
 - Profit & Loss trading data on chain and in logs
