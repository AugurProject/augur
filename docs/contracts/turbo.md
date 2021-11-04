Augur Turbo's contracts are structured such that they are mostly independent.
This makes it easy to upgrade smart contracts without special authority.

The major components are: MarketFactory, Fetcher, AMMFactory, MasterChef, and
FeePot. The contracts can be found at
https://github.com/AugurProject/turbo/tree/dev/packages/smart/contracts.

Every type of market has its own MarketFactory. The market factory accepts USDC
and returns a "complete set", which is one outcome token for each outcome.
The user will trade away the outcome tokens they don't want, for those they do,
giving them a "position" that pays out a profit if they guess correctly.

Every market factory has the same common code for defining markets, minting
outcome tokens, and claiming winnings. These are defined in the contracts
"AbstractMarketFactoryV*", with "V3" being the latest.

Each market factory additionally defines rules for market creation and market
resolution. Sports market factories encode some of the game rules, like
defining spread or specifying how to handle ties. The crypto market factory
pulls from the price feeds.

The market factories are mostly built out of other contracts, acting as mixins.
The design goal has been to move any common code into mixins. The market
factory contracts themselves hold a lot of boilerplate code used to invoke code
defined in mixins.

The market factories also define structs for additional information about
markets. For sports markets this is the "Event" struct, which ties together
several markets that are resolved by the same game scoring information. For
crypto this is the "Coin" struct, storing information like price feed address.

The sports supported right now are: NBA, NFL, MLB, and MMA/UFC. Other sports
can be added fairly easily using mixins, if they're similar to other sports.

The crypto market factory deployed right now only supports price feeds. The
next version, which has been written, supports market cap as well. In actuality
the new version supports any Chainlink feeds.

There are some other market factories that aren't supported for one reason or
another. Some are older versions that aren't used anymore, like
SportsLinkMarketFactory. Others were made in expectation of being used but have
been indeterminately delayed or cancelled, like GroupedMarketFactory.

A market factory can contain virtually infinite markets. Iterating over all of
them to get the current state of markets isn't always possible because many
nodes limit query runtime or response size. To work around this, we have the
Fetcher contracts.

Fetcher contracts return paginated lists of "interesting" markets. These are
markets that are either unresolved (open) or have unclaimed winning outcome
shares. There are two Fetcher contracts that matter right now: SportsFetcher
and CryptoFetcher.

This concludes the overview of the market factories. They're all you need to
run Augur Turbo. However, in reality you want an easy way to trade, which can
be promoted through liquidity provision rewards.

Trading is enabled via BalancerV1 AMMs interacted with via the AMMFactory.
There need only be one AMMFactory for all market factories. It handles creating
AMMs, buying and selling outcome shares, and interacts with the MasterChef
contract to enable rewards.

The ability to set weights is necessary for adding liquidity to Augur Turbo
AMMs because of the way outcome tokens are created. Thus, we need to use
Balancer AMMs. The ability to use several outcomes is also helpful since
most markets have three outcomes due to the inclusion of the invalid outcome.

Why are weights needed? A naive AMM sets the price of tokens by their relative
balances in the AMM. This works reasonably well for normal tokens because
cheaper tokens are actually easier to acquire in larger quantities. This is not
true of outcome tokens because they are minted in equal quantities.

If you have a 50:50 market then a complete set of outcome tokens can be added
to the AMM's liquidity pool without any tokens being kept by the LP. But if the
price isn't exactly 50:50 then some tokens will be kept by the user lest they
move the price towards 50:50.

Normal outcome prices don't differ enough to matter much up until the outcome
is known, which causes the price to rapidly approach 100:0. But the invalid
outcome (usually labeled "No Contest") is uncommon so it's set to 2%, the
smallest default ratio using BalancerV1. To provide the same amount of
liquidity for a 98:2 AMM is many times more than needed for a 50:50 market.
That inefficiency is extremely undesirable since it locks up so much capital
as well as giving the LP a larger position than they may desire.

The initial weights the AMMs use are set at market creation using the lines
from the sportsbook. They do not update as the sportsbook lines change.

Note that crypto markets do not have an invalid outcome and always start at a
price ratio of 50:50, but still use BalancerV1 AMMs. There's no deep reason:
it's easy to use the existing infrastructure needed for the sports markets.

TODO rewards

This concludes the overview of trading and rewards. Finally, there's the FeePot
contract.

We don't use it right now. It's designed to pay REPv2 holders for providing a
secure backstop in case of bad market resolution. That functionality hasn't
been implemented yet so the fee that would go to the FeePot is set to zero.

So long as AugurV2 (on Ethereum mainnet) never forks, there will only ever need
to be one FeePot contract. If it works then a new FeePot must be deployed.
