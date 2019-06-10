Glossary
========
<!--
this section will include subsections for all terms used and descriptions of what they are and what they do. This is to avoid repeating them same information over and over again in function descriptions in the API section. This section should be easy to navigate and easy to link to specific concepts. To that end, each concept should have its own subsection.

Goals:
  - Easy to navigate
    - every term has its own "section" for easy linking
    - alphabetical
  - Human Readable language
 -->
This section of the documentation is dedicated to terms found and used throughout the rest of documentation. Below you will find sections about terms used in Augur. The goal is to explain everything that might be confusing in an easy-to-understand way.

## Ask Order

An Ask Order is an [Order](#order) indicating the desire of the [Order Creator](#order-creator) to sell [Shares](#share) of one or more [Outcomes](#outcome). This is the opposite of a [Bid Order](#bid-order).

## Atto- (Prefix)

Atto- is a unit prefix in the metric system denoting a factor of 10^−18, or 0.000000000000000001.  This prefix is used for a number of terms in Augur, including attoETH, attoREP, attotoken, etc.

## Bid Order

A Bid Order is an [Order](#order) indicating the desire of the [Order Creator](#order-creator) to buy [Shares](#share) of one or more [Outcomes](#outcome). This is the opposite of an [Ask Order](#ask-order).

## Cash

Cash is an ERC-20 token that is used within Augur's Solidity smart contracts and acts as a wrapper for ETH to facilitate some of Augur's functionality. Users do not interact directly with Cash tokens in Augur.

## Categorical Market

A Categorical Market is a [Market](#market) with more than 2 potential [Outcomes](#outcome), but no more than 8. As with all Markets, [Invalid](#invalid-outcome) is also a potential Outcome, but it does not count toward the 8-Outcome maximum. Categorical Markets are best for multiple choice questions, such as "Which team will win Tournament X?" or "What color tie will the U.S. President wear at the next presidential press conference?". If a Market is based around a simple yes-or-no question, it is better to use a [Yes/No Market](#yes-no-market). For a Market about what a particular stock price will be on a given date, a [Scalar Market](#scalar-market) should be used, as 8 potential outcomes would not be sufficient.

## Challenge

Challenge is used to describe the act of a [REP](#rep) holder [Staking](#dispute-stake) REP on a [Market](#market) [Outcome](#outcome) other than the [Tentative Outcome](#tenative-outcome) for that Market. This REP is sent to a [Crowdsourcer](#crowdsourcer) and goes toward filling a [Dispute Bond](#dispute-bond) for that Outcome in order to [Dispute](#dispute) or "challenge" the Tentative Outcome of a Market before it is [Finalized](#finalized-market). If the Dispute Bond is successfully filled, and that Outcome becomes the [Final Outcome](#final-outcome) for the Market, the users who Staked REP on that Outcome can get back 1.5x the amount of REP they originally Staked, once the Market is Finalized. If the Dispute Bond is successfully filled, but that Outcome does not become the [Final Outcome](#final-outcome) for the Market, the users who Staked REP on that Outcome will forfeit all of the REP they Staked. If the Dispute Bond is not successfully filled, the users who Staked on that Outcome can redeem their REP once the Fee Window has elapsed.

## Child Universe

A Child Universe is a [Universe](#universe) created after a [Market](#market) [Forks](#fork). Child Universes have a [Parent Universe](#parent-universe), which is the Universe where the [Forked Market](#forked-market) resides. [Locked Universes](#locked-universe) always have Child Universes because the Forking process causes the Universe containing the Forked Market to become Locked and creates the Child Universes.

## Complete Set

A Complete Set is a collection of [Shares](#share) in every [Outcome](#outcome). Complete Sets are created when the [Creator](#order-creator) and [Filler](#order-filler) of an [Order](#order) both use currency to pay for the trade, as opposed to one or both parties using Shares to complete the [Trade](#trading). When both parties use shares to complete a trade, then a Complete Set will be formed and [Settled](#settlement) (destroyed). The cost in [attoETH](#atto-prefix) of a Complete Set for a particular [Market](#market) is determined by the [Number of Ticks](#number-of-ticks) for that Market. When Complete Sets are Settled, [Settlement Fees](#settlement-fees) are extracted from the value of the Complete Set and are paid proportionally by both parties. Therefore, users who get a larger payout from Settlement also pay a larger portion of the fees. The Settlement Fees extracted from Share Settlement go toward paying for the [Reporting](#report) system, in the form of a [Reporting Fee](#reporting-fee), and paying the [Market Creator](#market-creator) their set [Creator Fee](#creator-fee).

## Creator Fee

A Creator Fee is a percentage fee, in ETH, that is collected by the [Market Creator](#market-creator) whenever [Shares](#share) are [Settled](#settlement). It is set by the Market Creator when he or she creates a new [Market](#market). The Creator Fee must be between 0% and 50%, and it cannot be changed once it has been set. The Creator Fee and the [Reporting Fee](#reporting-fee) are both extracted at the same time whenever [Shares](#share) are [Settled](#settlement). Shares can be Settled when a user sells a [Complete Set](#complete-set) or when the Market has been [Finalized](#finalized-market) and a user wants to close an open [Position](#position). The Creator Fee is designed to incentivize users to make popular Markets as they stand to earn money if enough people trade on the Market. They can then recoup their Market creation cost and ideally turn a profit on posting interesting Markets. The [Settlement Fees](#settlement-fees) are discussed in more details in the [Trading](#trading) section of the documentation.

## Crowdsourcer

Each [Outcome](#outcome) of a [Market](#market) has its own Crowdsourcer, which is a Solidity smart contract that keeps track of how much [REP](#rep) has been Staked on a particular Outcome during a given [Fee Window](#fee-window). If users Stake enough REP on that Outcome to fill the [Dispute Bond](#dispute-bond) and [Challenge](#challenge) the [Tentative Outcome](#tentative-outcome), that Outcome will become the new Tentative Outcome (and the Market will go through another Dispute Round), or the Market will Fork (if a Dispute Bond greater than the [Fork Threshold](#fork-threshold) is filled). If the Dispute Bond is successfully filled, and that Outcome becomes the [Final Outcome](#final-outcome) for the Market, the users who Staked REP on that Outcome can get back 1.5x the amount of REP they originally Staked, once the Market is [Finalized](#finalized-market). If the Dispute Bond is successfully filled, but that Outcome does not become the [Final Outcome](#final-outcome) for the Market, the users who Staked REP on that Outcome will forfeit all of the REP they Staked. If the Dispute Bond is not successfully filled, the users who Staked on that Outcome can redeem their REP once the Fee Window has elapsed.

## Decentralized Oracle

The heart of Augur is its Decentralized Oracle, which allows users and smart contracts to propose questions to Augur and discover accurate information about the real world (based on how REP holders have voted on [Market](#market) [Outcomes](#outcomes)) without having to trust a single person, AI, or organization. Augur’s Oracle allows information to be migrated from the real world to a blockchain without relying on a centralized, trusted third party.

## Designated Report

A Designated Report occurs when a [Designated Reporter](#designated-reporter) [Stakes](#designated-reporter-stake) [REP](#rep) on a particular [Outcome](#outcome) in a [Market](#market). This Outcome then becomes the [Tentative Outcome](#tentative-outcome) for the Market, and the Market changes to the [Waiting for the Next Fee Window to Begin Phase](#waiting-for-the-next-fee-window-to-begin-phase). 

## Designated Reporter

A Designated Reporter is a single Ethereum address designated to submit the [Tentative Outcome](#tentative-outcome) for a [Market](#market) during the [Designated Reporting Phase](#designated-reporting-phase). The Designated Reporter is set by the [Market Creator](#market-creator) during Market creation. All Markets must have a Designated Reporter.

## Designated Reporter Stake

When a [Designated Reporter](#designated-reporter) submits a [Report](#report), they must put up an amount of REP on an [Outcome](#outcome) that is equal to the Designated Reporter Stake. Note that this amount is calculated differently than the [No-Show Bond](#no-show-bond).

During the very first [Fee Window](#fee-window) after launch, the amount of the Designated Reporter Stake will be set at 0.35 [REP](#rep). The amount of the Designated Reporter Stake is dynamically adjusted according to how many [Designated Reports](#designated-report) were incorrect (failed to concur with the [Market's](#market) [Final Outcome](#final-outcome)) during the previous Fee Window. In particular, we let δ be the proportion of Designated Reports that were incorrect during the previous Fee Window, and we let b<sub>d</sub> be the amount of the Designated Reporter Stake during the previous Fee Window, then the amount of the Designated Reporter Stake for the current Fee Window is max &#123;0.35, b<sub>d</sub>f(δ)&#125;.

## Designated Reporting

Designated Reporting is the first and fastest way that a [Market](#market) can be [Reported](#report) on. One Ethereum address will be responsible for submitting a [Tentative Outcome](#tentative-outcome) for the Market and will have 3 days to do so after a Market's [End Time](#end-time), known as the [Designated Reporting Phase](#designated-reporting-phase).

## Designated Reporting Phase

The Designated Reporting Phase lasts up to three (3) days and begins immediately following the [End Time](#end-time) of a [Market](#market). During this time, the [Designated Reporter](#designated-reporter) is expected to [Report](#report) a [Tentative Outcome](#tentative-outcome) for the Market. When the Designated Reporter submits a Report, the Market will enter the [Waiting for the Next Fee Window to Begin Phase](#waiting-for-the-next-fee-window-to-begin-phase). If the Designated Reporter fails to Report on the Market within the Designated Reporting Phase, then the Market goes to the [Open Reporting Phase](open-reporting-phase). When this happens, the [Market Creator](#market-creator) does not get refunded the [No-Show Bond](#no-show-bond). Instead, the [No-Show Bond](#no-show-bond) goes toward covering the [Stake](#first-public-reporter-stake) of the [First Public Reporter](#first-public-reporter) when they submit the [First Public Report](#first-public-report).

## Developer Mode

During Augur's early stages, its Solidity smart contracts will allow for some special "developer mode" functionality. This functionality has been added as a security precaution in case an attacker attempts to compromise Augur's [Decentralized Oracle](#decentralized-oracle) system. If a security exploit is found, the Augur development team can halt Augur, which will stop all normal functionality, such as trading, reporting, and disputing, and allow users to withdraw their REP and ETH from any Market.

Eventually, once Augur has been thoroughly tested and the Augur development team is confident that it is secure, this functionality will be removed so that it is not available to anyone (including the Augur development team).

## Dispute

Disputing is synonymous with the act of [Challenging](#challenge) a [Tenative Outcome](#tentative-outcome).

## Dispute Bond

When a [Market](#market) is in the [Dispute Round Phase](#dispute-round-phase), users may [Stake](#dispute-stake) [REP](#rep) on an [Outcome](#outome) other than the [Tentative Outcome](#tentative-outcome) if they believe the Tentative Outcome is incorrect. Doing so contributes to a Dispute Bond for that Outcome. Each Outcome other than the Tentative Outcome has its own Dispute Bond that can be filled. Dispute Bonds need not be paid in their entirety by a single user. Augur allows participants to [Crowdsource](#crowdsourcer) the Dispute Bonds. Any user who sees an incorrect Tentative Outcome can dispute that Outcome by Staking some REP on an Outcome other than the Tentative Outcome. If, collectively, some Outcome (other than the Tentative Outcome) receives enough Dispute Stake to fill its Dispute Bond, the current Tentative Outcome will be successfully [Challenged](#challenge). For information about how Dispute Stake gets returned to users, refer to the [Dispute Stake glossary entry](#dispute-stake).

The amount of REP required to fill a Dispute Bond is calculated as follows.

Let <i>A<sub>n</sub></i> denote the total Stake over all of this Market’s Outcomes at the beginning of Dispute Round <i>n</i>. Let &omega; be any Market Outcome other than the Market’s Tentative Outcome at the beginning of this Dispute Round. Let <i>S</i>(&omega;, <i>n</i>) denote the total amount of Stake on Outcome &omega; at the beginning of dispute <i>n</i>. Then the size of the Dispute Bond needed to successfully Dispute the current Tentative Outcome in favor of the new Outcome &omega; during round <i>n</i> is denoted <i>B</i>(&omega;,<i>n</i>) and is given by:

<i>B</i>(&omega;,<i>n</i>)=2<i>A<sub>n</sub></i>-<i>3S</i>(&omega;,<i>n</i>)

The Dispute Bond sizes are chosen this way to ensure a fixed ROI of 50% for [Reporters](#reporter) who successfully Dispute false outcomes.

## Dispute Round

A Dispute Round is one 7-day round out of a maximum of 20 such rounds that can occur during the [Dispute Round Phase](#dispute-round-phase) and before a [Fork](#fork) occurs in a [Market](#market). During a Dispute Round, [REP](#rep) holders who do not agree that the Market's [Tentative Outcome](#tentative-outcome) is accurate can [Stake](#dispute-stake) REP on a different [Outcome](#outcome) in an attempt to [Challenge](#challenge) it. If the Challenge is successful, the Tentative Outcome will be changed to the Outcome that was Staked on, or the Market will [Fork](#fork) if a [Dispute Bond](#dispute-bond) greater than the [Fork Threshold](#fork-threshold) is filled.

## Dispute Round Phase

The Dispute Round Phase is a seven (7) day window after a [Market](#market) has been [Reported](#report) on. During the Dispute Round Phase, [REP](#rep) holders who do not agree that the Market's [Tentative Outcome](#tentative-outcome) is accurate can [Stake](#dispute-stake) REP on a different [Outcome](#outcome) in an attempt to [Challenge](#challenge) it. If the Challenge is successful, the Tentative Outcome will be changed to the Outcome that was Staked on, or the Market will [Fork](#fork) if a [Dispute Bond](#dispute-bond) greater than the [Fork Threshold](#fork-threshold) is filled. With each Dispute Round that successfully Challenges the Tentative Outcome, the next Dispute Round will require an even higher [Dispute Bond](#dispute-bond) to Challenge the Tentative Outcome. For details on how the Dispute Bond is calculated, refer to the the [Dispute Bond glossary entry](#dispute-bond).

## Dispute Stake

When a [Market](#market) is in the [Dispute Round Phase](#dispute-round-phase), users can put up [REP](#rep) on any [Outcome](#outcome) other than the [Tenative Outcome](#tentative-outcome). The amount of REP they put up goes toward filling the crowdsourced [Dispute Bond](#dispute-bond), and can range from 1 [attoREP](#atto-prefix) to the amount still needed to fill the [Dispute Bond](#dispute-bond).

All unsuccesful Dispute Stake is returned to the original owners at the end of every [Dispute Round](#dispute-round). All successful Dispute Stake is applied to the [Outcome](#outcome) it championed, and will remain there until the [Market](#market) is [Finalized](#finalized-market) (or until a [Fork](#fork) occurs in some other Augur Market). Once the Market is Finalized, all users who Staked on the Final Outcome during a Dispute Round will receive 1.5x the amount of REP they originally Staked. REP holders who staked on an Outcome other than the Final Outcome forfeit their REP. All Dispute Stake (whether successful or unsuccessful) will receive a portion of the [Reporting Fee Pool](#reporting-fee-pool) from the current [Fee Window](#fee-window) in ETH. (This ETH comes from trading and winning [Share](#share) redemption: fees are collected in ETH whenever a [Complete Set](#complete-set) is sold or winning Shares are redeemed and given to [Fee Windows](#fee-window).)

By design, the Dispute Bond sizes for each Dispute Round are chosen such that anyone who successfully [Challenges](#challenge) an Outcome in favor of the Market’s [Final Outcome](#final-outcome) is rewarded with a 50% ROI on their Dispute Stake. For details on how the Dispute Bond is calculated, refer to the [Dispute Bond glossary entry](#dispute-bond).

## Dispute Token

When a user Stakes [REP](#rep) in a [Crowdsourcer](#crowdsourcer), that Crowdsourcer will allocate an equal amount of Dispute Tokens to that user. Then, when the Crowdsourcer's [Market](#market) is [Finalized](#finalized-market), these Dispute Tokens are used by Augur's smart contracts to determine the payout that user should receive. Dispute Tokens are only used internally by Augur, and users do not interact with them directly; however, they are implemented as ERC-20 tokens, so they potentially can be traded between users. (For example, a user might want to sell their Dispute Tokens to another user at a discounted price if a Market is being Disputed for a long time and the user wishes to cash out their Dispute Tokens before the Market is Finalized.)

## End Time

End Time is the date and time that a [Market](#market)'s event will have come to pass and should be known. After this date and time has passed the Market will get [Reported](#report) on and eventually [Finalized](#finalized-market).

## Fee Token

Fee Tokens are not tokens that users interact with directly; however, they are used internally by Augur's Solidity smart contracts to allow users to redeem [REP](#rep) Staked either in a [First Public Report](#first-public-report) or in a [Crowdsourcer](#crowdsourcer). When a [First Public Reporter](#first-public-reporter) submits a First Public Report in a given [Fee Window](#fee-window), Augur creates an amount of Fee Tokens equal to the amount of REP they Staked and associates those Fee Tokens with the Ethereum address of the First Public Reporter. Similarly, when a user Stakes REP in a Crowdsourcer to [Challenge](#challenge) a [Tentative Outcome](#tentative-outcome), Augur creates an amount of Fee Tokens equal to the amount of REP they Staked and associates those Fee Tokens with the Ethereum address of that user. Once the Fee Window is over, and a user redeems their Staked REP, Augur uses the amount of Fee Tokens associated their Ethereum address to determine what proportion of the Fee Window's [Reporting Fees](#reporting-fee) (in ETH) to distribute to them.

## Fee Window

Augur’s [Reporting](#report) system runs on a cycle of consecutive 7-day long [Fee Windows](#fee-windows). Any fees collected by Augur during a given Fee Window are added to a [Reporting Fee Pool](#reporting-fee-pool) for that Fee Window. The Reporting Fee Pool is used to reward [REP](#rep) holders who participate in Augur’s Reporting process. REP holders who [Stake](#dispute-stake) REP during a given Fee Window will receive an amount of fees from the Reporting Fee Pool that is proportionate to the amount of REP they Staked. In this way, all REP holders who participate during a Fee Window will receive a portion of the fees collected during that Window. Participation includes [Designated](#designated-reporting) or [Open Reporting](#open-reporting), [Disputing](#dispute) an [Outcome](#outcome), or simply purchasing [Participation Tokens](#participation-token) directly.

## Fill Order

Filling an [Order](#order) is when a [Filler](#order-filler) provides what the [Creator](#order-creator) of the order is seeking in their [Order](#order). If a Filler only provides some of what the Creator wants then it's known as a partial fill. If the Filler provides exactly what the Creator requests then it's known as completely filling the order.

## Final Outcome

A Final Outcome is a [Tentative Outcome](#tentative-outcome) that is not [Challenged](#challenge) through a [Dispute Round Phase](#dispute-round-phase) or is determined through a [Fork](#fork). At this point, the [Market](#market) becomes [Finalized](#finalized-market) and moves to the [Finalized Phase](#finalized-phase). A Market's Final Outcome cannot be challenged or changed.

## Finalized Market

A Finalized Market is a [Market](#market) that has not had its [Tentative Outcome](#tentative-outcome) [Challenged](#challenge) through a [Dispute Round Phase](#dispute-round-phase), or has gone through the [Fork Phase](#fork-period). Its [Tentative Outcome](#tentative-outcome) is now considered final, and the Market will allow [Share](#share) holders to [Settle](#settlement) their Shares with the Market once the [Post-Finalization Waiting Period](#post-finalization-waiting-period) has elapsed.

## Finalized Phase

This is the last phase a [Market](#market) can be in, and it occurs once the Market has been [Finalized](#finalized-market).

## First Public Report

When a [Market's](#market) [Designated Reporter](#designated-reporter) fails to submit a [Designated Report](designated-report), the Market moves to the [Open Reporting Phase](#open-reporting-phase). When this happens, the [No-Show Bond](#no-show-bond) put up by the [Market Creator](#market-creator) can be used by any user to [Stake](#first-public-reporter-stake) [REP](#rep) on a [Tentative Outcome](#tentative-outcome). This Report is called the [First Public Report](#first-public-report). The [First Public Reporter](#first-public-reporter) must pay the gas cost of submitting the First Public Reporter.

## First Public Reporter

The First Public Reporter is any user who [Stakes](#first-public-reporter-stake) [REP](#rep) on a [Tentative Outcome](#tentative-outcome) during the [Open Reporting Phase](#open-reporting-phase).
 
## First Public Reporter Stake

When a [Market's](#market) [Designated Reporter](#designated-reporter) fails to submit a [Designated Report](designated-report), and the [First Public Reporter](#first-public-reporter) submits a [Report](#report) instead, the [No-Show Bond](#no-show-bond) gets used to Stake on a [Tentative Outcome](#tentative-outcome). If that Tentative Outcome becomes the [Final Outcome](#final-outcome), the First Public Reporter will receive the No-Show Bond back.

## Fork

A Fork occurs if the [Tentative Outcome](#tentative-outcome) for a [Market](#market) is [Challenged](#challenge) with a [Dispute Bond](#dispute-bond) greater than the [Fork Threshold](#fork-threshold). A Fork causes Augur to create multiple new [Universes](#universe). Each new Universe is empty except for the [Forked Market](#forked-market); they contain no markets or REP tokens. There will be a Universe created for each possible [Outcome](#outcome) of the [Market](#market), including the [Invalid Outcome](#invalid-outcome), and the Markets will be [Finalized](#finalized-market) on each Universe. REP holders will need to choose which Universe they want to migrate their REP tokens too. Migration is one-way and final. After sixty (60) days the [Fork Period](#fork-period) ends, and the Universe with the most REP migrated too it will allow traders to [Settle](#settlement) [Shares](#share) for the [Forked Market](#forked-market) and [Reporting Fees](#reporting-fee) will be paid out to [Reporters](#reporter) for that Universe only. The original Universe that contained the Forked Market is known as the [Parent Universe](#parent-universe) and is considered [Locked](#locked-universe). All of the new Universes created are known as [Child Universes](#child-universe). Forking will result in a new REP Token contract belonging to each Child Universe spawned by the Fork. In the event of a Fork, all non-Forked Markets in each Child Universe will have their Tentative Outcome reset to the Outcome that was reported by the [Initial Reporter](#initial-reporter), and any REP [Staked](#dispute-stake) on a [Dispute Crowdsourcer](#crowdsourcer) in these Markets will be redeemable by the users who originally Staked that REP. These Markets will start off back in the [Waiting for the Next Fee Window to Begin Phase](#waiting-for-the-next-fee-window-to-begin-phase).

## Fork Period

The Fork Period, or Fork Phase, is period lasting a maximum of sixty (60) days once a [Fork](#fork) has begun. Once a majority of [REP](#rep) has been migrated to a specific [Child Universe](#child-universe) or sixty days have elapsed, the [Market](#market) will become [Finalized](#finalized-market).

## Forked Market

A Forked Market is a [Market](#market) whose [Tentative Outcome](#tentative-outcome) is [Challenged](#challenge) with a [Dispute Bond](#dispute-bond) greater than the [Fork Threshold](#fork-threshold), thus causing a [Fork](#fork) to occur. A Fork will cause the creation of multiple [Universes](#universe) of Augur with the Forked Market having a different [Final Outcome](#final-outcome) in each Universe. The Universe that contained the Forked Market originally will become a [Locked Universe](#locked-universe).

## Fork Threshold

The Fork Threshold is the amount of [REP](#rep) that must be [Staked](#dispute-stake) on a [Dispute Crowdsourcer](#crowdsourcer) in order to cause a [Market](#market) to [Fork](#fork). In Augur, if 2.5% of all existing REP is Staked on the Dispute Crowdsourcer of a Market, that Market will Fork.

## Genesis Universe

A Genesis Universe is a [Universe](#universe) that does not have a [Parent Universe](#parent-universe). At the launch of Augur, only a single Genesis Universe exists. However, users can create other Genesis Universes using the `augur.api.Augur.createGenesisUniverse` function. (One reason they may want to do this, for example, is if they wish to create a competing Genesis Universe because they do not agree with the [Final Outcome](#final-outcome) of a particular [Market](#market) in the original Genesis Universe.) Initially, a new Genesis Universe does not contain any Markets, nor any supply of [REP](#rep). In order to add a REP supply to a Genesis Universe, users must migrate their [Legacy REP](#legacy-rep) to the REP smart contract for that Genesis Universe using the function `augur.api.ReputationToken.migrateFromLegacyReputationToken`.

## Initial Report

The Initial Report is simply the first [Report](#report) placed on a [Market](#market). The Initial Report often will come from the [Designated Reporter](#designed-reporter) for the Market, which would immediately refund the [No-Show Bond](#no-show-bond) to the [Market Creator](#market-creator). However, if the Designated Reporter fails to Report on the Market within the Designated Reporting Phase, then the Market goes to the [Open Reporting Phase](open-reporting-phase). When this happens, the [Market Creator](#market-creator) does not get refunded the [No-Show Bond](#no-show-bond). Instead, the [No-Show Bond](#no-show-bond) goes toward covering the [Stake](#first-public-reporter-stake) of the [First Public Reporter](#first-public-reporter) when they submit the [First Public Report](#first-public-report). This provides an incentive to submit the First Public Report, since the First Public Reporter stands to gain the No-Show Bond in REP if they Stake on the eventual [Final Outcome](#final-outcome).

## Initial Reporter

The Initial Reporter is the person who submits the [Initial Report](#initial-report) on a [Market](#market). Generally, the Initial Reporter will be the [Designated Reporter](#designated-reporter), however if the Designated Reporter fails to [Report](#report), then the Initial Reporter will become whoever submits the First Public Report during the [Open Reporting Phase](#open-reporting-phase) for this Market.

## Invalid Outcome

A [Market](#market) should be considered Invalid if any of the following are true:

  - The question is subjective in nature.
  - The Outcome was not known at Market [End Time](#end-time).
  - The title, details, End Time, resolution source, and Outcomes are in direct conflict with each other.
  - There are strong arguments for the Market resolving as multiple Outcomes.
  - The resolution source does not provide a readily available answer.
  - The resolution source provides different answers to different viewers.

If the [Outcome](#outcome) of a Market is Invalid, [Reporters](#reporters) can [Report](#report) its [Tentative Outcome](#tentative-outcome) as Invalid. Additionally, if the Market is in a [Dispute Round](#dispute-round), users can [Stake](#dispute-stake) [REP](#rep) on Invalid as the Tentative Outcome, or if the Market has [Forked](#fork), users can migrate their REP to the [Child Universe](#child-universe) where the Outcome is Invalid. If the Market's [Final Outcome](#final-outcome) becomes Invalid, its [Payout Set](#payout-set) will be the [Number of Ticks](#number-of-ticks) divided evenly among each Outcome. For example, in a [Categorical Market](#categorical-market) with 10,000 [Ticks](#tick) and 4 potential Outcomes, the Payout Set would be [2500, 2500, 2500, 2500]. This is done to ensure that the holders for each type of [Share](#share) in the Market receive the same payout during [Settlement](#settlement).

## Legacy REP

Legacy [Reputation Tokens](#rep), or Legacy REP, are REP that exist in the [Legacy REP smart contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/LegacyReputationToken.sol) and have not been migrated to the [Reputation Token smart contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/ReputationToken.sol), for a particular [Universe](#universe). Legacy REP must be migrated to the Reputation Token smart contract by calling the `augur.api.ReputationToken.migrateFromLegacyReputationToken` function before they can be used within Augur.

## Long Position

In Augur, opening a [Long Position](#long-position) in the [Outcome](#outcome) of a [Market](#market) means purchasing [Shares](#share) in that Outcome. Opening a Long Position costs (price per Share * number of Shares). For more information on trading, please refer to the [Trading](#trading) section.

## Locked Universe

A Locked Universe is a [Universe](#universe) that had a [Fork](#fork) occur within it and no longer allows the creation of new [Markets](#markets). All Markets within a Locked Universe remain tradable, as Markets never stop being tradable, even after [Finalizing](#finalized-market). [REP](#rep) holders within a Locked Universe are given a one-time and final option to migrate their REP to one of the new Universes created after a Fork locks a Market. There is no time constraint to how long a REP holder is allowed to wait to choose a Universe to migrate their REP to.

## Market

A Market is created by users of Augur for a small fee. They are used to describe an upcoming event that people would presumably be interested in wagering on. They should also provide information on how to verify the [Outcome](#outcome) of the event, the more specific the better. Each Market created on the Augur network will have an automatically managed [Order Book](#order-book), which will allow users to buy and sell [Shares](#share) of different Outcomes of the Market. The [Market Creator](#market-creator) can set the [Creator Fee](#creator-fee) for the Market, which, once set, cannot be changed, and will determine their cut of all Shares [Settled](#settlement) on the Market. The Market Creator also needs to specify a [Max Price](#maximum-display-price) and a [Min Price](#minimum-display-price) as well as the [Number of Ticks](#number-of-ticks) for the Market. There are three different Market types supported by Augur: [Yes/No](#yes-no-market), [Categorical](#categorical-market), and [Scalar](#scalar-market).

## Market Creator

A Market Creator is a user who created a [Market](#market). They are charged a small fee to make a new Market but can set the [Creator Fee](#creator-fee) for [Settlement](#settlement) of [Shares](#share) on that Market. Market Creators are incentivized to create popular Markets so as to generate the most amount of [Settlement Fees](#settlement-fees) for themselves. Other information a Market requires is the actual question being posed, the type of Market (i.e., [Yes/No](#yes-no-market), [Categorical](#categorical-market), or [Scalar](#scalar-market)), the number of [Outcomes](#outcome), [End Time](#end-time), and a [Topic](#topic).

## Market Creator Mailbox

A Market Creator Mailbox is an address that belongs to the [Creator](#market-creator) of a [Market](#market). All of the fees that a Market Creator can collect (whether as ETH or as tokens) get sent to this address, where the Creator can then withdraw them. Funds that are potentially refunded to the Market creator (such as [Validity Bonds](#validity-bond) and [No-Show Bond](#no-show-bond)) are also sent to the Market Creator Mailbox.

## Market Resolution

Market Resolution is the process of [Finalizing](#finalized-market) a [Market](#market). [Designated Reporting](#designated-reporting), [Open Reporting](#open-reporting), [Dispute Rounds](#dispute-round) and [Forks](#fork) are all examples of attempts at Market Resolution.

## Maximum Display Price

The Maximum Display Price (often seen as `maxDisplayPrice`) is the maximum price allowed for a [Share](#share) on a [Market](#market). For [Yes/No](#yes-no-market) or [Categorical](#categorical-market) Markets this value is always 1, as in 1 ETH. [Scalar](#scalar-market) Markets' Maximum Display Price would be the top end of the range set by the [Market Creator](#market-creator).

## Minimum Display Price

The Minimum Display Price (often seen as `minDisplayPrice`) is the minimum price allowed for a [Share](#share) on a [Market](#market). For [Yes/No](#yes-no-market) or [Categorical](#categorical-market) Markets this value is always 0, as in 0 ETH. [Scalar](#scalar-market) Markets' Minimum Display Price would be the bottom end of the range set by the [Market Creator](#market-creator).

## No-Show Bond

The No-Show Bond is paid for using [REP](#rep) by the [Market Creator](#market-creator) during [Market](#market) creation. If the [Designated Reporter](#designed-reporter) submits a [Report](#report) during the [Designated Reporting Phase](#designated-reporting-phase), the Bond is refunded to the Market Creator. If the Designated Reporter fails to Report during the Designated Reporting Phase, then the No-Show Bond is applied as Stake on the [Tentative Outcome](#tentative-outcome) Reported by the [First Public Reporter](#first-public-reporter). If the Tentative Outcome selected by the First Public Reporter becomes the [Final Outcome](#final-outcome) of the Market, the First Public Reporter receives the No-Show Bond. If the Tentative Outcome selected by the First Public Reporter is [Disputed](#disputed) and then still becomes the [Final Outcome](#final-outcome) of the Market, the First Public Reporter receives the No-Show Bond plus an additional 50% of the Bond amount. This actually allows for someone to stake 0 REP for the [First Public Report](#first-public-report) because the Bond is added to whatever is staked. This means someone without any REP has the potential to Report and if the Market is eventually [Finalized](#finalized-market) the way that person Reported, then they can earn REP without having to purchase any. (Note that they will have to pay the gas cost to submit the Report.)

During the very first [Fee Window](#fee-window) after launch, the No-Show Bond will be set at 0.35 REP. As with the [Validity Bond](#validity-bond), the No-Show Bond is adjusted up or down, targeting a 1% no-show rate with a floor of 0.35 REP. Specifically, we let ρ be the proportion of Markets in the previous Fee Window whose Designated Reporters failed to Report on time, and we let b<sub>r</sub> be amount of the No-Show Bond from the previous Fee Window. Then the amount of the No-Show Bond for the current Fee Window is max &#123;0.35, b<sub>r</sub>f(ρ)&#125;.

## Number of Ticks

A [Market's](#market) Number of Ticks can be thought of as the number of possible prices, or [Ticks](#tick), between the [Minimum Display Price](#minimum-display-price) and [Maximum Display Price](#maximum-display-price) for that Market. It is also the amount of [attoETH](#atto-prefix) that must be escrowed with the Market contract to purchase a single [Complete Set](#complete-set) of indivisible [Shares](#share) for a Market. Each Outcome in the [Payout Set](#payout-set) of an [Invalid](#invalid-outcome) Market is set to the Number of Ticks divided by the number of Outcomes (in order to ensure that the holders of each type of [Share](#share) in the Market receive the same payout during [Settlement](#settlement)). 

After Market [Finalization](#finalized-market), each winning Share can be Settled by sending it to the Market contract in exchange for an amount of attoETH equal to the Number of Ticks. In the event that the Market Finalizes as Invalid, each Share of the Market can be returned to the Market contract in exchange for an amount of attoETH equal to (Number of Ticks / Number of Outcomes). In cases where (Number of Ticks / Number of Outcomes) does not equal a whole number, the remainder will be subtracted equally from each Outcome and left on the Market contract as "dust" ETH. For example, if a 3-Outcome Market with no Creator Fee resolves to Invalid, the Payout Set would be [3333, 3333, 3333].

The [attoETH](#atto-prefix) yielded when a Complete Set of Shares is Settled is what [Settlement Fees](#settlement-fees) are extracted from prior to paying out traders for their closed [Positions](#position). Settlement Fees are paid proportionally so that the trader set to receive more payout will have to pay more Fees. The price of an Order can be set to anywhere between 0 and the Number of Ticks set for the Market.

For Yes/No and Categorical Markets, the Number of Ticks is always set to 10,000. For Scalar Markets, the Number of Ticks is determined implicitly by the range and precision set by the Market Creator, and must be evenly divisible by 2. In particular, the Number of Ticks equals (rangeMax - rangeMin) / precision. For example, if the Market Creator sets the range of Outcomes to `[-10, 30]` and the precision to 0.01, then the Number of Ticks equals (30-(-10)) / 0.01, or 4,000.

## Open Interest

Open Interest is the value of all of the [Complete Sets](#complete-set) that exist in a [Market](#market), normalized to the denomination token for all of the Markets (which is currently ETH).

## Open Order

An Open Order is an [Order](#order) that is currently on the [Order Book](#order-book) and has not been completely [Filled](#fill-order).

## Open Reporting

Open Reporting occurs if a [Market's](#market) [Designated Reporter](#designated-reporter) fails to submit a [Designated Report](#designated-report) and another user submits a [First Public Report](#first-public-report) instead by [Staking](#first-public-reporter-stake) [REP](#rep) on an [Outcome](#outcome).

## Open Reporting Phase

In the event that a [Market's](#market) [Designated Reporter](#designated-reporter) fails to submit a [Designated Report](#designated-report), the Market moves to the Open Reporting Phase. When this happens, any user can submit a [First Public Report](#first-public-report) by [Staking](#first-public-reporter-stake) [REP](#rep) on an [Outcome](#outcome).

## Order

An Order can be thought of as the recorded interest of a user to execute a trade of some amount of [Shares](#share) at a defined price point. Orders come in two types, [Bid Orders](#bid-order) and [Ask Orders](#ask-order), which indicate an attempt to buy or sell respectively. The [Creator](#order-creator) of the Order will also need to escrow currency or Shares in order to provide their part of the trade. The information stored in an Order is as follows: the type of Order, the [Market](#market) the Order is trading on, the [Outcome](#outcome) the Order is concerned with buying or selling, the Order Creator's address, the price per share, the amount of shares to trade, what block number the Order was created during, the amount of currency or Shares escrowed in the Order by the Order Creator for their part of the trade.

## Order Book

The Order Book is the collection of all [Open Orders](#open-order) currently available for a [Market](#market). [Orders](#order) are placed on the Order Book by [Order Creators](#order-creator) and are [Filled](#fill-order) by [Order Fillers](#order-filler). Orders are divided up by which type, or side, of Order they are: [Bid](#bid-order) or [Ask](#ask-order). Orders are further divided up by [Outcome](#outcome).

## Order Creator

An Order Creator is the person who places an [Order](#order) on the [Order Book](#order-book). They escrow currency or [Shares](#share) into their Order to buy or sell Shares of an [Outcome](#outcome) of a [Market](#market).

## Order Filler

An Order Filler either partially or fully [Fills](#fill-order) an [Open Order](#open-order) on the [Order Book](#order-book). Order Fillers send currency or [Shares](#share) to fill the Open Order and complete their part of the trade described in the [Order](#order).

## Orphaned Order

[Orders](#order) in Augur can sometimes become "orphaned", meaning they do not get displayed in the [Order Book](#order-book), and do not get filled like non-Orphaned Orders when calling most of Augur's API functions. This is an unintended behavior in Augur that can occur under the following scenario:

Suppose one side of a Market's Order Book is empty, and two Orders for the same price are created on that side of the Order Book. At this point, neither of these Orders has been orphaned, but that side of the Order Book is now in a state where Orders potentially can become orphaned. Any subsequent Orders created for that price on that side of the Order Book will cause all such Orders to become orphaned, except the oldest and newest.

Creating an Order with a worse price on that side of the Order Book while still in that state will cause the previous Order with the same price to become orphaned. However, that side of the Order Book will no longer be in a state where Orders can be orphaned. Similarly, creating an Order with a better price on that side of the Order Book while still in that state will have the same effect, but without causing any other Orders to become orphaned.

Since Orphaned Orders are not displayed in Augur's UI, the only way to fill one is by doing so directly using the Order's ID and an API function such as `augur.api.FillOrder.publicFillOrder`. The Augur UI will alert the user when they have created an Orphaned Order and allow them to cancel it.

## Outcome

An outcome is a potential result of a [Market](#market)'s future event. For example, a Market with a question of "Will it rain anywhere in New York City on November 1st, 2032 as reported by www.weather.com?" would have three potential Outcomes: Yes, No, and [Invalid](#invalid-outcome). Invalid would be an option if the world blew up before November 1st, 2032 and there was no New York City or www.weather.com to verify the Market's Outcome. More realistically, this can happen for Markets that have too vague of a question. A good example of a vague Market that would most likely be resolved as Invalid would be "Does God exist?", as no one has a definitive answer.

## Parent Universe

A Parent Universe is a [Universe](#universe) that has spawned [Child Universes](#child-universe) because a [Fork](#fork) had occurred on the Parent Universe and caused it to make new Universes. In other words, [Locked Universes](#locked-universe) are Parent Universes to the Universes created due to the Fork.

## Participation Token

At any time during a [Fee Window](#fee-window), users can purchase Participation Tokens in exchange for [REP](#rep). Once the Fee Window ends, users can redeem their Participation Tokens for a portion of the [Reporting Fees](#reporting-fee) (in Ether) that Augur collected during that Fee Window. The more Participation Tokens a user purchases, the bigger the portion of the Reporting Fees they will receive. Users are not required to purchase Participation Tokens, but their purpose is to incentivize users to be active on Augur in the event that they will be needed, such as when a [Market](#market) [Forks](#fork).

## Payout Distribution Hash

The Payout Distribution Hash is a SHA-3 hash of the [Payout Set](#payout-set). When a [Market](#market)'s event has occurred, but the Market has not been Finalized yet, it is said to have a tentative Payout Distribution Hash. Once the Market is Finalized, this tentative hash becomes the winning Payout Distribution Hash. Payout Distribution Hashes of [Forked Markets](#forked-market) are used as identifiers for [Child Universes](#child-universe) and [Parent Universes](#parent-universe).

## Payout Set

A Payout Set, sometimes referred to as "Payout Numerators" in Augur's smart contract functions, is an array with a length equal to the number of [Outcomes](#outcome) for a [Market](#market). Each value in the array is required to be 0 or a positive number that does not exceed the [Number of Ticks](#number-of-ticks) for the Market. Further, the total sum of all the values contained within the Payout Set array should be equal to the Number of Ticks for the Market. 

For example, in a [Yes/No Market](#yes-no-market) with 1000 [Ticks](#tick), a [Report](#report) that Stakes [REP](#rep) on Outcome `0` would submit a Payout Set that looks like `[1000, 0]`. Payout Sets are a breakdown of the Payout Distribution, or how Markets should pay out for each [Share](#share) when [Finalized](#finalized-market). In the example above, the Payout Numerators are the values 1000 and 0, and only [Shares](#share) of Outcome 0 (index 0 of the array) will pay out on the Finalized Market because the Payout Numerator for Outcome 1 is `0`. Valid Payout Sets are hashed using the SHA-3 hashing algorithm, which is a [Payout Distribution Hash](#payout-distribution-hash).

The Payout Set for a [Categorical Market](#categorical-market) is similar to that of a Yes/No Market, except that Categorical Markets can have up to 8 Outcomes, so an example Payout Set for a Categorical Market with 8,000 Ticks might look like `[0, 0, 8000, 0, 0, 0, 0, 0]`. The same Categorical Market with an [Invalid Outcome](#invalid-outcome) would have a Payout Set like `[1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]`. This is because each Outcome in the Payout Set of an Invalid Market is set to the Number of Ticks divided by the number of Outcomes, in order to ensure that the holders of each type of [Share](#share) in the Market receive the same payout during [Settlement](#settlement). (In cases where Number of Ticks / Outcomes is not a whole number, the remainder will be deducted from each Outcome in the Payout Set and left on the Market contract as "dust" ETH. For example, a 3-Outcome Market with no Creator Fee that resolves to Invalid will have a Payout Set of [3333, 3333, 3333].)

The Payout Set for a [Scalar Market](#scalar-market) is determined differently than for Yes/No Markets and Categorical Markets. Scalar Markets have just 2 possible Outcomes: 0 (for a [Short Position](#short-position)) and 1 (for a [Long Position](#long-position)). Suppose that a Scalar Market exists with $0 as the [Minimum Display Price](#minimum-display-price), $100 as the [Maximum Display Price](#maximum-display-price), 10,000 as the Number of Ticks, and $75 as the reported Outcome. The Payout Set for this Market would be determined as follows:

1. Normalize the reported Outcome to the Minimum Display Price by subtracting the Minimum Display Price from the reported Outcome: 75 - 0 = 75.
2. Scale the reported outcome to be between 0 and 1 by dividing by (maxPrice - minPrice): 75 / (100 - 0) = 0.75.
3. Scale the reported Outcome to the Number of Ticks by multiplying by the Number of Ticks: 0.75 * 10000 = 7500.
4. Calculate the other Outcome by subtracting the result from the Number of Ticks: 10000 - 7500 = 2500.
5. Put them in an array where the zero index is the Short Position, and one index is the Long Position: `[2500, 7500]`.
Note: When calculating the Payout Set for a Scalar Market using integer-only math, the order of steps (2) and (3) should be switched (i.e., always multiply before dividing in integer math).

## Position

A Position is the amount of [Shares](#share) that are owned (a [Long Position](#long-position)) or borrowed and then sold (a [Short Position](#short-position)) by an individual. A Position can be profitable or unprofitable, depending on [Market](#market) movements. Positions can be open or closed. An open Position means the Position holder currently own the Shares, whereas a closed position means they have redeemed their Shares and have cashed out for currency. Closing a Short Position means a trader is buying Shares of an [Outcome](#outcome) they are short on, whereas closing a Long Position means they are selling the Shares they own.

## Post-Finalization Waiting Period

Once a [Market](#market) has [Finalized](#finalized-market), users must wait three (3) days before claiming their trading proceeds. This waiting period is intended as a security precaution. In the event that an attacker could somehow cause a Market to Finalize incorrectly, the Augur development team would have 3 days to notice and [halt](#developer-mode) the Augur system before the attacker could claim the proceeds. When the Augur development team is confident that Augur is secure, this waiting period will be removed.

## REP

REP, also known as Reputation, Reputation Tokens, or REP Tokens, is the currency used by the Augur [Decentralized Oracle](#decentralized-oracle) system. REP is used to to pay the [No-Show Bond](#no-show-bond) when creating a Market, to Stake on an [Outcome](#outcome) in the [Designated Report](#designated-report) or [First Public Report](#first-public-report) of a [Market](#market), to [Challenge](#challenge) a [Tentative Outcome](#tentative-outcome) by Staking on a different Outcome when a Market is in the [Dispute Round Phase](#dispute-round-phase), and to purchase [Participation Tokens](#participation-tokens).

## Report

A Report, or Reporting, is the Staking of [REP](#rep) on a particular [Outcome](#outcome) in a [Market](#market) that's passed its [End Time](#end-time). Reporting as a term can be used to describe the act of submitting a [Designated Report](#designated-report) or [First Public Report](#first-public-report), or [Challenging](#challenge) a Market's [Tentative Outcome](#tentative-outcome) by [Staking](#dispute-stake) REP on an Outcome other than the Tentative Outcome.

## Reporter

A Reporter is a [REP](#rep) holder who Stakes [REP](#rep) on an [Outcome](#outcome) of a [Market](#market) that has an [End Time](#end-time) that has passed. Reporters can include the [Designated Reporter](#designated-reporter), [First Public Reporter](#first-public-reporter), or users who [Challenge](#challenge) a Market's [Tentative Outcome](#tentative-outcome) by [Staking](#dispute-stake) REP on an Outcome other than the Tentative Outcome.

## Reporting Fee

The Reporting Fee is used to help pay for Augur's [Decentralized Oracle](#decentralized-oracle) system. When [Shares](#share) are [Settled](#settlement) (i.e., destroyed), before paying out to the Share holders, Augur will extract [Settlement Fees](#settlement-fees) in ETH. These Settlement Fees include the [Creator Fee](#creator-fee) and the Reporting Fee. 

The Reporting Fee is a dynamic amount based on the price of [REP](#rep) and the value of the [Open Interest](#open-interest) across all of Augur's [Markets](#market). Augur sets the Reporting Fee so as to target a REP market cap that is 7.5 times the value of the [Open Interest](#open-interest) across all of Augur's markets. This means the [Reporting Fee](#reporting-fee) will go up if the market cap of REP is not sufficiently high (but will never be higher than 33.3%) and will go down if it is higher than this target.

The Reporting Fee is sent to the [Fee Window](#fee-window) that contains the Market being traded on, and is later used to pay REP holders for engaging in [Reporting](#report).

## Reporting Fee Pool

Any [Reporting Fees](#reporting-fee) (in ETH) collected during a [Fee Window](#fee-window) get added to a Reporting Fee Pool. At the end of the Fee Window, the Reporting Fee Pool is paid out to users in proportion to the number of [REP](#rep) they [Staked](#dispute-stake) during that Fee Window. In this way, all users who participate during a Fee Window will receive a portion of the Settlement Fees collected during that Window. Participation includes [Designated](#designated-reporting) or [Open Reporting](#open-reporting), [Challenging](#challenge) an [Outcome](#outcome), or simply purchasing [Participation Tokens](#participation-token) directly.

## Scalar Market

A Scalar Market is a [Market](#market) with a wide range of potential [Outcomes](#outcome). An example of a Scalar Market would be "According to finance.yahoo.com, what will be the price of MSFT on January 3rd, 2062 at exactly 1:00pm?". In this example Market, the [minDisplayPrice](#minimum-display-price) might be set to $0 and the [maxDisplayPrice](#maximum-display-price) to $500. This would allow the Market to [Settle](#settlement) on any number between the two. Sometimes, a range of potential Outcomes is not needed, and a small number of choices will suffice. In these cases, it is better to use a [Yes/No](#yes-no-market) or [Categorical](#categorical-market) Market.

## Settlement

A trader can close their [Position](#position) in one of two ways: by selling the [Shares](#share) they hold to another trader in exchange for Ether, or by Settling their Shares with Augur's smart contracts. Every Share in a Market comes into existence as part of a [Complete Set](#complete-set) when an amount of Ether equal to the [Number of Ticks](#number-of-ticks) for that Market has been escrowed with Augur. To get that Ether out of escrow, traders must give Augur either a Complete Set, or — if the [Market](#market) has [Finalized](#finalized-market) — a Share of the winning [Outcome](#outcome). This exchange is referred to as Settlement.

For example, consider a non-Finalized Market with possible Outcomes A and B. Suppose Alice has a Share of Outcome A that she wants to sell for 0.70 ETH and Bob has a Share of Outcome B that he wants to sell for 0.30 ETH. First, Augur matches these [Orders](#order) and collects the A and B Shares from the participants. Then Augur gives 0.70 ETH (minus [Settlement Fees](#settlement-fees)) to Alice and 0.30 ETH (minus Settlement Fees) to Bob.

As a second example, consider a Finalized Market whose winning Outcome is A. Alice has a Share of A and wants to cash it in. She sends her share of A to Augur and in return receives 1 ETH (minus Settlement Fees).

The [Settlement Fees](#settlement-fees), which include both the [Creator Fee](#creator-fee) and the [Reporting Fee](#reporting-fee), are only extracted during Settlement.

## Settlement Fees

Settlement Fees are fees extracted when a [Complete Set](#complete-set) is [Settled](#settlement). It's the combination of the [Creator Fee](#creator-fee) and the [Reporting Fee](#reporting-fee).

## Share

A Share is the ownership of a portion of a [Market's](#market) [Outcome's](#outcome) value. A [Complete Set](#complete-set) of Shares are created when both the [Creator](#order-creator) and [Filler](#order-filler) of an [Order](#order) send ETH to the Market to complete an [Order](#order). Shares are [Settled](#settlement) (destroyed) when a Complete Set is sold back to the Market.

## Share Unit

Used interchangably with `Share`. This is the smallest, indivisible unit of Shares that can be bought/sold in a [Market's](#market) [Outcome's](#outcome) value.

## Short Position

Opening a Short Position, or shorting, is the selling of a security that is not owned by the seller. Shorting is done with the belief that a security's price will decrease in the future, allowing it to be bought back at a lower price to make a profit.

In Augur, betting on the "No" [Outcome](#outcome) of a [Yes/No Market](#yes-no-market) is done by shorting the "Yes" Outcome. This effectively means the user is selling "Yes" [Shares](#share) they do not own. For [Yes/No Markets](#yes-no-market) and [Scalar Markets](#scalar-market), these are listed as negative quantities of Shares on the Portfolio:Positions view of Augur's user interface.

Opening a Short Position costs ((cost of a Complete Set - price per Share) * number of Shares), where a [Complete Set](#complete-set) is a Share of every Outcome in a Market. For example, suppose a user thinks the "Yes" Outcome of a Yes/No Market is unlikely to happen and expects the price of a "Yes" Share in this Market to decrease in the future. If a Complete Set in this Market costs 1 ETH, and one Share of "Yes" costs 0.55 ETH, a Short Position in 1 Share of the "Yes" Outcome can be opened for (1 - 0.55) 1 = 0.45 ETH.

For more information on trading, please refer to the [Trading](#trading) section.

## Spread Percent

Spread Percent is a liquidity metric for each of the [Outcomes](#outcome) in a [Market](#market).  It measures the difference between best [Bid Orders](#bid-order) and [Ask Orders](#ask-order) of the [Order Book](#order-book) for an Outcome. Lower Spread Percent is better and means that Outcome's best
Bid Orders/Ask Orders on the Order Book are closer together and of higher quality from the standpoint of a taker/bettor. Spread Percent ranges from 0% (perfect spread) to 100% (empty Order Book). A Market's Spread Percent is defined as the max (worst) Spread Percent of its Outcomes.

## Tentative Outcome

The Tentative Outcome is the currently reported [Outcome](#outcome) for a [Market](#market) that has not been [Finalized](#finalized-market) yet. In other words, it's either the Outcome that the [Designated Reporter](#designated-reporter) or [First Public Reporter](#first-public-reporter) has Staked [REP](#rep) on, or it's the Outcome that had enough REP Staked on it in the last [Dispute Round](#dispute-round) to [Challenge](#challenge) the previous Tentative Outcome and make it the new Tentative Outcome. If a Market completes a [Dispute Round](#dispute-round) without being Challenged, or if the Market passes through the [Fork Phase](#fork-period), then the Market will become [Finalized](#finalized-market), and the Tentative Outcome will become a [Final Outcome](#final-outcome).

## Theoretical REP Supply

The Theoretical REP Supply for a [Universe](#universe) is the amount of [REP](#rep) that has been migrated to it, plus the REP supply of its [Parent Universe](#parent-universe).

## Tick

A Tick is the smallest recognized amount by which a price of a security or future may fluctuate. Ticks are each individually a potential price point for a [Share](#share) of an [Outcome](#outcome) for a [Market](#market) between its [Minimum Price](#minimum-display-price) and [Maximum Price](#maximum-display-price). When a [Market Creator](#market-creator) creates a new Market they are asked to enter the [Number of Ticks](#number-of-ticks) for the Market. This number represents how much [attoETH](#atto-prefix) a [Complete Set](#complete-set) of Shares will cost to buy for this Market. A [Scalar Market](#scalar-market) with a Minimum Price of -10 and a Maximum Price of 30 could have a number of ticks set to 4000. This would mean that to purchase a Complete Set for this Market, you would need to spend 4000 attoETH. The [Settlement](#settlement) of a Complete Set of Shares will yield 4000 attoETH, which [Settlement Fees](#settlement-fees) are then extracted from prior to payout. It also indicates that there are 4000 valid price points between -10 and 30 in this Market, which means an [Order](#order) with a price of 1.24 or 20.5 is valid for this Market, but a price of 5.725 would be invalid.

## Topic

A Topic is a keyword used to categorize [Markets](#market). All Markets must have a Topic, and are optionally allowed up to two sub-Topics to further categorize the Market. An example Market for "Will the New York Giants win Super Bowl 100?" might have a Topic of "Sports" and sub-topics of "American Football" and "NFL". The Topics are set by the [Market Creator](#market-creator) when a new Market is made and cannot be changed.

## Universe

All [Markets](#market) created on Augur belong to a Universe. Augur has only one Universe at launch (the [Genesis Universe](#genesis-universe)), but more can be created in the rare event of a [Fork](#fork). The Universe in which a Fork occurs will become a [Locked Universe](#locked-universe) and new [Child Universes](#child-universes) will be created, one for each [Outcome](#outcome) of the [Forked Market](#forked-market). Once a [Fork Phase](#fork-period) begins, [REP](#rep) holders can choose to migrate their REP to one of the new Child Universes. They don't have to migrate, but Locked Universes do not allow the creation of new Markets, and therefore there will be no Markets to [Report](#report) on in the future and no [Fees](#reporting-fee) to earn. All Child Universes can continue to operate after the [Fork Phase](#fork-period) ends.

## Validity Bond

The Validity Bond is paid by the [Market Creator](#market-creator) during [Market](#market) creation. The bond is paid in ETH and is refunded to the Market Creator if the [Final Outcome](#final-outcome) of the [Market](#market) is not [Invalid](#invalid-outcome).

The Validity Bond is a dynamic amount based on the percentage of Markets in Augur that are being [Finalized](#finalized-market) as Invalid. Augur targets having 1% of its Markets Finalized as Invalid. During the very first [Fee Window](#fee-window) after launch, the Validity Bond will be set at 0.01 ETH. Then, if more than 1% of the Finalized Markets in the previous Fee Window were Invalid, the Validity Bond will be increased. If less than 1% of the Finalized Markets in the previous Fee Window were Invalid, then the Validity Bond will be decreased (but will never be lower than 0.01 ETH). In particular, we let ν be the proportion of Finalized Markets in the previous Fee Window that were Invalid, and b<sub>v</sub> be the amount of the Validity Bond from the previous Fee Window. Then the Validity Bond for the current window is max &#123;1/100, b<sub>v</sub>f(ν)&#125;.

## Waiting for the Next Fee Window to Begin Phase

Once a [Designated Report](#designated-report) or [First Public Report](#first-public-report) has been submitted, the [Market](#market) will enter the Waiting for the Next Fee Window to Begin Phase until the current 7-day [Fee Window](#fee-window) has ended. At that point, the Market will move to the [Dispute Round Phase](#dispute-round-phase) of the next Fee Window.

## Winning Universe

When a [Fork](#fork) occurs, the [Child Universe](#child-universe) that has the most [REP](#rep) migrated to it by the end of the [Fork Phase](#fork-period) is the Winning Universe for that particular Fork.

## Yes/No Market

A Yes/No Market is a [Market](#market) with only two [Outcomes](#outcome) (as well as [Invalid](#invalid-outcome), which is always a possible Outcome). Yes/No Markets are for yes-or-no questions; if more potential Outcomes are needed, a [Categorical](#categorical-market) or [Scalar](#scalar-market) Market should be used.
