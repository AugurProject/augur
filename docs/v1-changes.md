# V2 Contract Changes

## DAI (denomination token changed to point at an ERC20)

V1 Augur uses ETH for the denomination of all trading. While this is a natural fit in many ways for a decentralized platform running on Ethereum, the fact remains that ETH is highly volatile. The requests for a stable coin denomination in the platform have likely been the largest ask since the release of V1. For V1 the usage of Eth was accomplished through using a contract (“Cash”) that wrapped Eth and was given additional trust. The V2 contracts will still reference “Cash”, which now simply points to an ERC-20 Token with no extensions. At release time this will be set to the Multi-Collateral DAI token. 

## Rep Price Auction

A primary way the Augur platform remains secure is through adjusting fees paid to reporters by traders. The fee is adjusted based on the total open interest (“OI”) in the platform and the price of REP. To determine the price of REP in V1 a centralized price feed was put in place. Shortly after launch a bug was discovered that rendered this price feed pointless, as the fees did not adjust in relation to this feed. Because of this bug, the key needed up update this price feed was discarded. 

The aforementioned bug has been resolved in V2, and furthermore the platform is being made entirely decentralized by introducing a built in double auction that will act as the price feed. Each week there will be two double auctions where a pot of DAI and REP are sold for the other and a price is calculated from the sale prices. This auction is expected to lose a small amount of money each round, and so it will mint some small amount of REP each week. By doing so the auction will introduce a small amount of inflation to REP in exchange for an unstoppable REP price feed used to maintain platform security.

## Upgrade token standard to ERC777

The ERC20 standard is a very simple standard that allows for many applications and has become overwhelmingly commonplace in the Ethereum ecosystem. That said, it also has some deficiencies. One of the proposed token standards, ERC777, is backward compatible with the ERC20 standard but also improves upon many of its features.

In particular the reason we wanted V2 to support this standard was so that developers can make use of the “tokensReceived” fallback function feature. This will let developers program apps that use any token on the Augur platform without requiring the user to do approvals. Currently when approvals are needed in app development it means users must give the apps complete control over their tokens via a very large approval or do two transactions for every desired operation (one to approve and one to take the desired action).

## “Designated Reporting” Reduced to 1 Day

During the operation of V1 it was found that the vast majority of designated reporters that do show up to report do so within 24 hours of the market ending. This data supports the reduction of the designated reporting window to 24 hours. By doing so the time it takes for a market to finalize is effectively shortened by two days in the case when the designated reporter is a “no show.”

## Immediate dispute rounds up to a threshold where it becomes paced by a week

In addition to reducing the Designated Reporter window to a day the V2 contracts will also allow disputes to occur immediately following one another. Presently when an outcome is disputed REP holders must wait until the next window to dispute that new tentatively winning outcome. This effectively paces disputes such that each round takes a week. In V2 for an outcome to win it still must be undisputed for an entire 7 day window, however anyone may dispute that outcome regardless of when it won or when the next window begins.

Once a dispute becomes sufficiently large however (currently once it is large enough that a fork could occur in 8 rounds) this feature will turn off for that market and each round will be paced by week again. This is to allow large amount of REP to mobilize for such a dispute.
Pre-emptive contributions to tentative winning outcome
In V1 Augur an exploit exists which allows arbitrary contributions to the initial report. This effectively means that a dispute can start off at a much higher REP amount than expected. While this was unintended, it is actually a very useful feature for REP holders that have high confidence in an outcome and also want the market to finalize faster.

With that in mind V2 will be formalizing this feature by allowing REP holders to contribute to the tentatively winning outcome up to the threshold at which dispute pacing turns on again (described above). If the tentative winning outcome does end up being disputed then these contributions will automatically go toward a dispute.

As an example imagine a market has an initial report for outcome A with 1 REP. Now imagine that a REP holder wishes to make sure this market resolves quickly should it be disputed. They can contribute 200 REP safely toward outcome A now. If the market is disputed, let’s say for outcome B with 2 REP, that 200 REP will immediately be used to dispute outcome B in favor of A in a single large bond. Now for the dispute to progress, the next bond placed for outcome B would need to be 400 REP.

## Invalid as a tradeable outcome

In the V1 Augur contracts the “Invalid” outcome in a market is a condition where a market is either ambiguous or otherwise cannot be resolved to a definite outcome. In this case any shares in the market can be turned in for an equal amount of money. For example a 3 outcome market with outcomes A, B, and C will give .33 ETH for a share of any outcome.

A problem with this mechanism is that it can be manipulated by bad actors who create Invalid markets, such as ones that end before the event is known, then trade in such a way where they will make a profit if the market resolves Invalid.

In V2 Invalid will simply be a tradeable outcome like any other. This is a simpler mechanism but also provides a huge benefit in the form of an observable metric for the likelihood that a market is Invalid based on market forces. For example if a market’s orderbook consistently has BUY orders for Invalid above .2 that suggests there is a greater than 20% chance the market is Invalid. For many conservative users this should be a warning to not trade the market.

## Invalid markets will send market creator fees to the pool of reporter fees instead of the market creator

In V1 when a market resolves to Invalid the fees collected for the market creator will still be given to them. This makes the potential risk in creating malicious markets potentially much less. The V2 contracts will instead send these fees to reporters in the event the market resolves to Invalid.

## Removal of the Controller Contract and the Escape Hatch

In V1 the Controller contract serves as a central registry for the Augur contracts as well as the entrypoint for admin controls such as triggering the escape hatch. Two weeks after the launch of v1 the admin key was transferred to a burn address. The v2 the contracts will not include any escape hatch code at all. Given this, the Controller contract became just a contract registry which made more sense to implement in the Augur contract.

## Maximum market duration of X months implemented

While there is no technical reason for a market end time limitation, there are two compelling behavioral issues that make putting this limit in the contracts a good idea in practice:

The first issue is that when a new version of the platform is released REP holders can and will be expected to migrate REP to the new version of Augur. Because the security of the platform relies upon the price of REP, as well as OI, this means that any markets which are on the old version will increasingly become insecure as time goes on. A limit on market duration will help to combat this deleterious effect.

The other issue is that fees in Augur are only taken at settlement. This means that someone can purchase shares from the system and only pay fees after market finalization. This is in contrast the trading fees, which are paid any time two parties trade in their shares for Cash. The more OI and the longer it is held without fees being paid the more cost this places on the system for users doing trading which actually extracts fees. This is because the security model of the platform and the adjustments to the fee taken for reporters are based on the OI in the platform. With a limited market duration we limit the impact this has to at least prevent a weaponized variant.

It should be noted that for the V2 version of the contracts we have chosen to not implement time based fees, but are considering such a change for a future version. The belief is that currently the issue is likely low impact at this phase of growth and not worth introducing such a change to combat.

## Use or lose forking

In V1 Augur if a fork occurs REP holders are given 60 days to participate in fork resolution by migrating to a Universe correlated with the forking market’s outcomes. For example, if there were a market for the 2016 US presidential election which forked there would be a Universe where Trump won and a universe where Hillary won. The Universe with the most REP by the end of the 60 day period or which reaches 50% of all REP wins. In order to incentivize people to migrate their REP before the fork resolves anyone in v1 who does so will receive a 5% bonus to their migrated REP in the universe they migrate to.

While this is a theoretically rational incentive it has a couple problems:

The first problem that this method introduces is a security vulnerability that means the cost to force a fork must be higher than 5% of all REP. While this was easy to solve it is always preferable to have full freedom to set values in the platform freely.

The larger issue with this system is that a 5% bonus is not nearly as much of a motivator as is needed to secure the platform. In an ideal world we get 100% REP holder participation, in which case a 51% coalition is needed to determine the winner. If for example the 5% bonus is only enough to incentivize 10% of REP holders than only a 5.1% coalition is needed to determine the winner. This is only twice the amount of REP used in one side of the dispute to get to the fork in the first place.

In order to combat this the V2 contracts will now simply not allow migration to children universes after the 60 day window has ended. This is the most effective way to try and get participation in a fork which is the entire crux of the Augur security model.

## Trading features

Multiple features are being added to the trading API:

### Ability to ignore shares when trading

In the event that someone wishes to use the trading functions but also not sell existing shares they can now specify that preference.

### KYC token support / segregation

The trading functions allow an ERC20 token to be specified which when used will trade with, and place orders on, an order book specifically for users specifying and owning that token. The intention of this feature is to support tokens that are awarded through KYC providers to accounts.

### Affiliate marketing support

In order to incentivize marketers to advertise markets to traders, the trading functions now allow for an affiliate address to be specified, which when present will give a portion of the market creator’s fees to the specified address. That portion is set by the market creator during market creation and can be 0 if they do not wish to enable this feature.

## Remove ETH fees from disputing

REP used in reporting and disputing in V1 Augur awards reporting fees. While this seems logical enough, the volume of REP staked works out such that any fees gained this way are less than the additional gas cost of tracking them in the overwhelming majority of cases. In order to spare REP holders this cost and to drastically simplify the code, both reporting and disputing in v2 will simply not award reporting fees. The 50% ROI from disputing is considered more than enough of an incentive to encourage disputing

## Floating formulas altered to decrease much slower than they increase

An important way Augur encourages creating valid markets is through the validity bond system. In V1 Augur, this bond rate is changes over time, and responds to the number of invalid markets being created. While the V1 bonds are moving, and the formulas are generally working, the way they are tuned means that the bond rate being stable depends on the overall rate of invalidity to not be performing particularly well.

For example the system targets a 1% rate for Invalid markets. It may take several weeks of an increased rate of Invalid markets for the bond to double, but a single week with a 0% Invalid rate will halve it. Effectively when a level is reached that discourages creating Invalid markets, the bond will immediately halve, undoing the multiple weeks of increases.

In V2 the floating bond formula is being altered such that the maximum increase is still 100%, but the maximum decrease for one period is only 10%. This should allow bonds to stay at the appropriate level longer but also allow them to decrease if platform behavior changes.

This change will also apply to the no show bond and the initial reporter bond amounts.

## Ability to make signed trades off chain that can be executed by another party

The V2 trading contracts include a mechanism for executing a signed message which contains data about a trade. This means that someone can generate a trade, such as “Buy 1 @ .9”, and post it publicly where another party can spend the gas to execute it and the system will take the signer’s required capital to execute the trade. In theory this enables a system that allow ETH-less trading, though in practice they still need to have an ETH account with DAI and also need to approve their DAI for transfer which will cost ETH in gas costs.

## Bug Fixes

See the [v1-notable-bugs.md](./v1-notable-bugs.md) document

## Misc. Changes
 - Solidity Compiler Upgraded to 0.5.4
 - Removal of the waiting period on claiming winning shares
 - Trades automatically sell any owned complete sets
 - Functions for creating or canceling multiple orders in one TX added
 - Function for modifying order price
 - Profit & Loss trading data on chain and in logs
