
Reporting
=========
Once a [Market](#market)'s underlying event  occurs, the [Outcome](#outcome) must be determined in order for the Market to [Finalize](#finalized-market) and begin [Settlement](#settlement). Outcomes are determined by Augur’s [Decentralized Oracle](#decentralized-oracle), which consists of profit-motivated [Reporters](#reporter), who simply report the actual, real-world Outcome of the event. Anyone who owns [REP](#rep) may participate in the [Reporting](#report) and [Disputing](#dispute) of Outcomes. Reporters whose [Reports](#report) are consistent with consensus are financially rewarded, while those whose Reports are not consistent with consensus are financially penalized.

Fee Windows
-----------
Augur’s reporting system runs on a cycle of consecutive 7-day long [Fee Windows](#fee-window). A [Reporting Fee](#reporting-fee) collected by Augur during a given Fee Window are added to the [Reporting Fee Fee Pool](#reporting-fee-pool) for that Fee Window. At the end of the Fee Window, the Reporting Fee Pool is paid out to [REP](#rep) holders who participated in that reporting process. [Reporters](#reporter) receive rewards in proportion to the amount of REP they Staked during that Fee Window. Participation includes: Staking during an [Initial Report](#initial-report), [Disputing](#dispute) a [Tentative Outcome](#tentative-outcome), or purchasing [Participation Tokens](#participation-token).

Participation Tokens
--------------------
During any [Fee Window](#fee-window), [REP](#rep) holders may purchase any number of [Participation Tokens](#participation-token) for an equivalent amount of REP. At the end of the Fee Window, they may redeem their Participation Tokens for the same amount of REP, plus a proportional share of the [Fee Window’s](#fee-window) [Reporting Fee Pool](#reporting-fee-pool). If there were no actions (e.g., submitting a [Report](#report) or [Disputing](#dispute) a Report submitted by another user) needed of a [Reporter](#reporter), the Reporter may purchase Participation Tokens to indicate that they showed up for the Fee Window. Just like Staked REP, Participation Tokens may be redeemed by their owners for a pro rata portion of fees in this Fee Window.

It is important that REP holders are ready to participate in [Market](#market) resolution in the event of a [Fork](#fork). The Participation Token provides an incentive for REP holders to monitor the platform at least once per week, and, thus, be ready to participate if the need arises. Even REP holders who do not want to participate in the reporting process are incentivized to check in with Augur once per 7-day Fee Window in order to buy Participation Tokens and collect fees. This regular, active checking in will ensure that they will be familiar with how to use Augur, will be aware of Forks when they occur, and thus should be more ready to participate in Forks when they happen.

Market State Progression
------------------------
Augur [Markets](#market) can be in seven different states after creation. The potential states, or “phases”, of an Augur Market are as follows:

* Pre-Reporting
* Designated Reporting
* Open Reporting
* Waiting for the Next Fee Window to Begin
* Dispute Round
* Fork
* Finalized

The relationship between these states can be seen in the figure below:

<a href="images/Detailed Reporting Diagram.png"><img src="images/Detailed Reporting Diagram.png"></a>

Pre-Reporting State
-------------------
The Pre-Reporting or trading phase is the time period that begins after trading has begun in the [Market](#market), but before the Market’s event has come to pass. Generally, this is the most active trading period for any given Augur Market. Once the event end date has passed, the Market enters the [Designated Reporting Phase](#designated-reporting-phase) (state a in the figure above).

Designated Reporting State
--------------------------
When creating a Market, [Market Creators](#market-creator) are required to choose a [Designated Reporter](#designated-reporter) and post a [No-Show Bond](#no-show-bond). During the Designated Reporting Phase (state a in the figure above), the Market’s Designated Reporter has up to three days to Report on the [Outcome](#outcome) of the event. If the Designated Reporter fails to Report within the allotted 3 days, the Market Creator forfeits the No-Show Bond, and the Market automatically enters the [Open Reporting Phase](#open-reporting-phase) (state b in the figure above).

If the Designated Reporter submits a [Report](#report) on time, then the No-Show Bond is returned to the Market Creator. The Designated Reporter is required to post the [Designated Reporter Stake](#designated-reporter-stake) on its Reported Outcome, which it will forfeit if the Market finalizes to any Outcome other than the one they Reported. As soon as the Designated Reporter submits its Report, the Market enters the [Waiting for the Next Fee Window to Begin Phase](#waiting-for-the-next-fee-window-to-begin-phase) (state c in the figure above), and the Reported Outcome becomes the Market’s [Tentative Outcome](#tentative-outcome).

Open Reporting State
--------------------
If the Designated Reporter fails to Report within the allotted 3 days, the Market Creator forfeits the [No-Show Bond](#no-show-bond), and the Market immediately enters the Open Reporting Phase. As soon as the Market enters the Open Reporting Phase, anyone can report the Outcome of the Market. When the Designated Reporter fails to Report, the first Reporter who Reports on the Outcome of a Market is called the Market’s [First Public Reporter](#first-public-reporter).

The Market’s First Public Reporter receives the forfeited [No-Show Bond](#no-show-bond) in the form of Stake on their chosen Outcome, so they may claim the No-Show Bond only if their Reported Outcome agrees with the Market’s [Final Outcome](#final-outcome).

The First Public Reporter does not need to Stake any of their own [REP](#rep) when Reporting the Outcome of the Market. In this way, any Market whose Designated Reporter fails to Report is expected to have its Outcome reported by someone very soon after entering the Open Reporting Phase.

Once an [Initial Report](#initial-report) has been received from the Initial Reporter (whether it was the Designated Reporter or First Public Reporter), the Reported Outcome becomes the Market’s [Tentative Outcome](#tentative-outcome), and the Market enters the [Waiting for the Next Fee Window to Begin Phase](#waiting-for-the-next-fee-window-to-begin-phase) (state c in the figure above).

Waiting for the Next Fee Window to Begin State
----------------------------------------------
Once the market receives its Initial Report it enters the Waiting for the Next Fee Window to Begin Phase (state c in the figure above). During this phase, Reporting for the Market is on hold until end of the current [Fee Window](#fee-window). Once the next Fee Window begins, the Market enters the [Dispute Round Phase](#dispute-round-phase).

Dispute Round State
-------------------
The [Dispute Round](#dispute-round) (state d in the figure above) is a 7-day period, during which any REP holder has the opportunity to [Dispute](#dispute) the Market’s Tentative Outcome. (At the beginning of a
Dispute Round, a Market’s Tentative Outcome is the outcome that will become the Market’s Final Outcome if it is not successfully disputed by REP holders.) A Dispute consists of Staking REP (referred to as [Dispute Stake](#dispute-stake) in this context) on an Outcome other than the Market’s current Tentative Outcome. A Dispute is successful if the total amount of Dispute Stake on some Outcome meets the [Dispute Bond](#dispute-bond) size required for the current round. The Dispute Bond sizes are chosen in such a way to ensure a fixed ROI of 50% for Reporters who successfully dispute false Outcomes. Details for how the Dispute Bond size is computed can be found in the [Dispute Bond glossary entry](#dispute-bond).

The [Dispute Bonds](#dispute-bond) need not be paid in their entirety by a single user. The Augur platform allows participants to crowdsource the Dispute Bonds. Any user who sees an incorrect Tentative Outcome can Dispute that Outcome by Staking REP on some Outcome other than the Tentative Outcome. If any Outcome (other than the Tentative Outcome) receives enough Dispute Stake to fill its Dispute Bond, the current Tentative Outcome will be successfully Disputed.

In the case of a successful Dispute, the Market will either undergo another Dispute Round or it will enter the [Fork Phase](#fork-period) (state e in the figure above). If the size of the filled Dispute Bond is greater than the [Fork Threshold](#fork-threshold), then the Market will enter the [Fork Phase](#fork-period). If the size of the filled Dispute bond is less than the Fork Threshold, then the newly chosen Outcome becomes the Market’s new Tentative Outcome, and the Market undergoes another Dispute Round.

All Dispute Stake is held in escrow during the Dispute Round. If a Dispute Bond is unsuccessful, then the dispute Stake is returned to its owners at the end of the Dispute Round. If no Dispute is successful during the 7-day Dispute Round, the Market enters the [Finalized State](#finalized-phase) (state f in the figure above), and its Tentative Outcome is accepted as the [Final Outcome](#final-outcome). A Market's Final Outcome is the Tentative Outcome that passes through a dispute Round without being successfully Disputed, or is determined via a [Fork](#fork). Augur's contracts treat Final Outcomes as truth and pay out accordingly.

All unsuccesful Dispute Stake is returned to the original owners at the end of every Dispute Round. All successful Dispute Stake is applied to the Outcome it championed, and remains there until the Market is Finalized (or until a Fork occurs in some other Augur Market). All Dispute Stake (whether successful or unsuccessful) will receive a portion of the [Reporting Fee Pool](#reporting-fee-pool) from the current Fee Window.

Fork State
----------
The Fork Phase is a special state that lasts up to 60 days. Forking is the Market resolution method of last resort; it is a very disruptive process and is intended to be a rare occurrence. A Fork is caused when there is a Market with an Outcome with a successfully filled Dispute Bond of at least 2.5% of all REP. This Market is referred to as the [Forking Market](#forked-market).

When a Fork is initiated, a 60-day Forking Period begins. Disputing for all other non-Finalized Markets is put on hold until the end of this Forking Period. The Forking Period is much longer than the usual Fee Window because the platform needs to provide ample time for REP holders and service providers (such as wallets and exchanges) to prepare. A Fork's Final Outcome cannot be Disputed.

Every Augur Market and all REP tokens exist in some [Universe](#universe). REP tokens can be used to Report on Outcomes (and thus earn fees) only for Markets that exist in the same Universe as the REP tokens. When Augur first launches all Markets and all REP will exist together in a [Genesis Universe](#genesis-universe).

When a Market Forks, new Universes are created. Forking creates a new [Child Universe](#child-universe) for each possible Outcome of the Forking Market (including the [Invalid Outcome](#invalid-outcome)). For example, a [Yes/No Market](#yes-no-market) has 3 possible Outcomes: A, B, and Invalid. Thus a Yes/No Forking Market will create three new Child Universes: Universe A, Universe B, and Universe Invalid. Initially these newly created Universes are empty: they contain no Markets or REP tokens.

When a Fork is initiated, the [Parent Universe](#parent-universe) becomes permanently [Locked](#locked-universe). In a Locked Universe, no new Markets may be created. Users may continue trading Shares in Markets in Locked Universes, and Markets in a Locked Universe may still receive their [Initial Reports](#initial-report). However, no Reporting rewards are paid out there, and Markets in Locked Universes cannot be Finalized. In order for Markets or REP tokens in the Locked Universe to be useful, they must first be migrated to a Child Universe.

Holders of REP tokens in the Parent Universe may migrate their tokens to a Child Universe of their choice. This choice should be considered carefully, because migration is one-way; it cannot be reversed. Tokens cannot be sent from one sibling Universe to another. Migration is a permanent commitment of REP tokens to a particular Market Outcome. REP tokens that migrate to different Child Universes ought to be considered entirely separate tokens, and exchanges ought to list them as such.

When a Fork is initiated, all REP [Staked](#dispute-stake) on all non-Forking Markets is unstaked so that it is free to be migrated to a Child Universe during the Forking Period.

Whichever Child Universe receives the most migrated REP by the end of the Forking Period becomes the [Winning Universe](#winning-universe), and its corresponding Outcome becomes the Final Outcome of the Forking Market. Un-Finalized Markets in the Parent Universe may be migrated only to the Winning Universe and, if they are un-Finalized and have received an Initial Report, are reset back to the Waiting for the Next Fee Window to Begin Phase. 

There is no time limit on migrating tokens from the Parent Universe to a Child Universe. Tokens may be migrated after the Forking Period, but they will not count towards the determination of the Winning Universe. To encourage greater participation during the Forking Period, all token holders who migrate their REP within 60 days of the start of a Fork will receive 5% additional REP in the Child Universe to which they migrated. This reward is paid for by minting new REP tokens. 

Reporters that have Staked REP on one of the Forking Market’s Outcomes cannot change their position during a Fork. REP that was Staked on an Outcome in the Parent Universe can be migrated only to the Child Universe that corresponds to that Outcome. For example, if a Reporter helped fulfill a successful Dispute Bond in favor of Outcome A during some previous Dispute Round, then the REP they have Staked on Outcome A can only be migrated to Universe A during a Fork.

Sibling Universes are entirely disjoint. REP tokens that exist in one Universe cannot be used to Report on events or earn rewards from Markets in another Universe. Since users presumably will not want to create or trade on Markets in a Universe whose [Oracle](#decentralized-oracle) is untrustworthy, REP that exists in a Universe that does not correspond to objective reality is unlikely to earn its owner any fees, and therefore should not hold any significant market value. 

Therefore, REP tokens migrated to a Universe which does not correspond to objective reality should hold no market value, regardless of whether or not the objectively
false Universe ends up being the Winning Universe after a Fork. 

Recall from the section on the [Dispute Round State](#dispute-round-state) that any Stake successfully disputing an Outcome in favor of the Market’s Final Outcome will receive a 50% ROI on their Dispute Stake. 

In the event of a Fork, any REP Staked on any of the Market’s false Outcomes
should lose all economic value, while any REP Staked on the Market’s true Outcome is rewarded with 50% more REP (via newly minted REP) in the Child Universe that corresponds to the Market’s true Outcome (regardless of the Outcome of the Fork). Therefore, if pushed to a Fork, REP holders who Dispute false Outcomes in favor of true Outcomes will always come out ahead, while REP holders who Staked on false Outcomes will see their REP lose all economic value.

Finalized State
---------------
A Market enters the Finalized State (state f in the figure above) if it passes through a 7-day Dispute Round without having its Tentative Outcome successfully Disputed, or after completion of a Fork. The Outcome of a Fork cannot be Disputed and is always considered final at the end of the Forking Period. Once a Market is Finalized, traders can [Settle](#settlement) their [Positions](#position) directly with the Market. When a Market enters the Finalized State, we refer to its chosen Outcome as the Final Outcome.

Designated Reporting Details
----------------------------
During the creation of a Market, a [Market Creator](#market-creator) must assign a [Designated Reporter](#designated-reporter). [Designated Reporting](#designated-reporting) is designed to be a quick way to bring about a [Market Resolution](#market-resolution). This is pleasing to Traders who want to [Settle](#settlement) their [Shares](#share) and collect their earnings as soon as possible after a Market's [End Time](#end-time) has passed. The [Designated Reporting Phase](#designated-reporting-phase) begins immediately following the End Time of a Market. The result of Designated Reporting is still [Challengeable](#challenge) with a [Dispute Bond](#dispute-bond) so if the Designated Reporter does incorrectly [Report](#report) the [Outcome](#outcome) of the [Market](#market), it can be adjudicated by [Dispute Rounds](#dispute-round). With the dispute system in place, we don't actually lose any security or truth as an incorrect [Tentative Outcome](#tentative-outcome) for a Market can be Challenged.

The [Designated Reporting Phase](#designated-reporting-phase) lasts a maximum of three (3) days and ends immediately when the Designated Reporter submits their Report and the [Tentative Outcome](#tentative-outcome) is set for the Market.

If the Designated Reporter fails to Report within the Designated Reporting Phase, the Market Creator forfeits the [No-Show Bond](#no-show-bond), and the Market is moved into the [Open Reporting Phase](#open-reporting-phase). The No-Show Bond is then used to add to the [REP](#rep) [Staked](#first-public-reporter-stake) by the [First Public Reporter](#first-public-reporter).

If the Designated Reporter does successfully Report within the Designated Reporting Phase, the No-Show Bond is refunded to the Market Creator immediately and the Market enters the [Dispute Round Phase](#dispute-round-phase), which lasts for seven (7) days. During this 7-day period, any [REP](#rep) holder can [Stake](#dispute-stake) REP on an outcome other than the [Tentative Outcome](#tentative-outcome) and receive a proportionate amount of Participation Tokens in return. The [Participation Tokens](#participation-token) allow the holder to collect fees at the end of the current [Fee Window](#fee-window). The Staked REP goes toward filling the Dispute Bond for the Outcome on which it was Staked. If that outcome gets enough REP Staked on it to fill the Dispute Bond size, that Outcome becomes the new Tentative Outcome, and the Market returns to the [Waiting for the Next Fee Window to Begin Phase](#waiting-for-the-next-fee-window-to-begin-phase) (or [Forks](#fork) if the Outcome gets more than the [Fork Threshold](#fork-threshold) Staked on it). If the Market is left unchallenged for the duration of the Dispute Round Phase, then the Market's Tentative Outcome becomes the [Final Outcome](#final-outcome) and the Market is considered [Finalized](#finalized-market), allowing the Settlement of Shares.

Fee Window Details
------------------
[Fee Windows](#fee-window) continually occur and last for seven (7) days. During a Fee Window, any [REP](#rep) holder is able to [Stake](#dispute-stake) REP on any [Outcome](#outcome) other than the [Tentative Outcome](#tentative-outcome). By doing so, they receive an equal number of [Participation Tokens](#participation-tokens) in return, and the REP they Stake goes toward to a [Dispute Bond](#dispute-bond) to [Challenge](#challenge) the Tentative Outcome of the [Market](#market). In order to earn fees as a REP holder in the current Fee Window, users need to participate in the Market's [Dispute Round](#dispute-round) in some way, such as submitting a [Designated Report](#designated-report) or [First Public Report](#first-public-report), [Disputing](#dispute) the Tentative Outcome (i.e., staking on an outcome other than the Tentative Outcome), or simply purchasing [Participation Tokens](#participation-token) directly.

Any fees collected by Augur during a given Fee Window are added to a [Reporting Fee Pool](#reporting-fee-pool) for that Fee Window. The Reporting Fee Pool is used to reward REP holders who participate in Augur’s reporting process. At the end of the Fee Window, the Reporting Fee Pool is paid out to holders of Participation Tokens in proportion to the Staked REP they hold.

Markets are placed into the next available Fee Window once the [Designated Reporter](#designated-reporter) or [First Public Reporter](#first-public-reporter) submits a [Report](#report). For example, if a Market's Designated Report is submitted at 12:00 AM EST on January 3rd, 2053 and a Fee Window was just started on January 1st 2053, the Market would move into the next Fee Window that would be starting on January 8th, 2053, or 7 days since the start of the January 1st Window.

Any REP holder can participate in a Fee Window. In fact, in some cases, someone without any REP is able to successfully Report on Markets in the [Open Reporting Phase](#open-reporting-phase). This case only occurs when the Market's Designated Reporter fails to Report during the [Designated Reporting Phase](#designated-reporting-phase). In this situation, the first person to submit a Report can do so and Stake 0 REP on the Report. This is the true because the [No-Show Bond](#no-show-bond) is added to the First Public Reporter's Stake, so in this case the Stake can be 0 as it will get the bond added to it. (The First Public Reporter must still pay the gas cost to submit the Report.) This creates a race to be the First Public Reporter so as to attempt to get free REP from reporting correctly and earning the No-Show Bond.
