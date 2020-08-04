---
title: Utility
---

<div class="contracts">

## Contracts

### `AccountLoader`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#AccountLoader.initialize(contract Augur,contract IAugurTrading)"><code class="function-signature">initialize(contract Augur _augur, contract IAugurTrading _augurTrading)</code></a></li><li><a href="#AccountLoader.loadAccountData(address,contract IERC20,contract IERC20,contract IERC20)"><code class="function-signature">loadAccountData(address _account, contract IERC20 _reputationToken, contract IERC20 _USDC, contract IERC20 _USDT)</code></a></li><li><a href="#AccountLoader.getExchangeRate(address,address)"><code class="function-signature">getExchangeRate(address _firstToken, address _secondToken)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="AccountLoader.initialize(contract Augur,contract IAugurTrading)"></a><code class="function-signature">initialize(contract Augur _augur, contract IAugurTrading _augurTrading)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AccountLoader.loadAccountData(address,contract IERC20,contract IERC20,contract IERC20)"></a><code class="function-signature">loadAccountData(address _account, contract IERC20 _reputationToken, contract IERC20 _USDC, contract IERC20 _USDT) <span class="return-arrow">→</span> <span class="return-type">struct AccountLoader.AccountData</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AccountLoader.getExchangeRate(address,address)"></a><code class="function-signature">getExchangeRate(address _firstToken, address _secondToken) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `Augur`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Augur.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Augur.registerContract(bytes32,address)"><code class="function-signature">registerContract(bytes32 _key, address _address)</code></a></li><li><a href="#Augur.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#Augur.finishDeployment()"><code class="function-signature">finishDeployment()</code></a></li><li><a href="#Augur.createGenesisUniverse()"><code class="function-signature">createGenesisUniverse()</code></a></li><li><a href="#Augur.createChildUniverse(bytes32,uint256[])"><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#Augur.isKnownUniverse(contract IUniverse)"><code class="function-signature">isKnownUniverse(contract IUniverse _universe)</code></a></li><li><a href="#Augur.getUniverseForkIndex(contract IUniverse)"><code class="function-signature">getUniverseForkIndex(contract IUniverse _universe)</code></a></li><li><a href="#Augur.isKnownCrowdsourcer(contract IDisputeCrowdsourcer)"><code class="function-signature">isKnownCrowdsourcer(contract IDisputeCrowdsourcer _crowdsourcer)</code></a></li><li><a href="#Augur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256,uint256)"><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size, uint256 _disputeRound)</code></a></li><li><a href="#Augur.isKnownFeeSender(address)"><code class="function-signature">isKnownFeeSender(address _feeSender)</code></a></li><li><a href="#Augur.trustedCashTransfer(address,address,uint256)"><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#Augur.isTrustedSender(address)"><code class="function-signature">isTrustedSender(address _address)</code></a></li><li><a href="#Augur.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#Augur.isKnownMarket(contract IMarket)"><code class="function-signature">isKnownMarket(contract IMarket _market)</code></a></li><li><a href="#Augur.getMaximumMarketEndDate()"><code class="function-signature">getMaximumMarketEndDate()</code></a></li><li><a href="#Augur.derivePayoutDistributionHash(uint256[],uint256,uint256)"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 _numOutcomes)</code></a></li><li><a href="#Augur.getMarketCreationData(contract IMarket)"><code class="function-signature">getMarketCreationData(contract IMarket _market)</code></a></li><li><a href="#Augur.getMarketType(contract IMarket)"><code class="function-signature">getMarketType(contract IMarket _market)</code></a></li><li><a href="#Augur.getMarketOutcomes(contract IMarket)"><code class="function-signature">getMarketOutcomes(contract IMarket _market)</code></a></li><li><a href="#Augur.getMarketRecommendedTradeInterval(contract IMarket)"><code class="function-signature">getMarketRecommendedTradeInterval(contract IMarket _market)</code></a></li><li><a href="#Augur.onCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"><code class="function-signature">onCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, bytes32[] _outcomes)</code></a></li><li><a href="#Augur.onYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"><code class="function-signature">onYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash)</code></a></li><li><a href="#Augur.onScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"><code class="function-signature">onScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, int256[] _prices, uint256 _numTicks)</code></a></li><li><a href="#Augur.getTradeInterval(uint256,uint256)"><code class="function-signature">getTradeInterval(uint256 _displayRange, uint256 _numTicks)</code></a></li><li><a href="#Augur.logInitialReportSubmitted(contract IUniverse,address,address,address,uint256,bool,uint256[],string,uint256,uint256)"><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, address _initialReporter, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string _description, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string,uint256[],uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string _description, uint256[] _payoutNumerators, uint256 _currentStake, uint256 _stakeRemaining, uint256 _disputeRound)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256[],uint256,uint256,bool,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime, bool _pacingOn, uint256 _totalRepStakedInPayout, uint256 _totalRepStakedInMarket, uint256 _disputeRound)</code></a></li><li><a href="#Augur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#Augur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#Augur.logMarketParticipantsDisavowed(contract IUniverse)"><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe)</code></a></li><li><a href="#Augur.logMarketFinalized(contract IUniverse,uint256[])"><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators)</code></a></li><li><a href="#Augur.logMarketMigrated(contract IMarket,contract IUniverse)"><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse)</code></a></li><li><a href="#Augur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets)</code></a></li><li><a href="#Augur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees)</code></a></li><li><a href="#Augur.logMarketOIChanged(contract IUniverse,contract IMarket)"><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#Augur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees)</code></a></li><li><a href="#Augur.logUniverseForked(contract IMarket)"><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket)</code></a></li><li><a href="#Augur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#Augur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logDisputeWindowCreated(contract IDisputeWindow,uint256,bool)"><code class="function-signature">logDisputeWindowCreated(contract IDisputeWindow _disputeWindow, uint256 _id, bool _initial)</code></a></li><li><a href="#Augur.logParticipationTokensRedeemed(contract IUniverse,address,uint256,uint256)"><code class="function-signature">logParticipationTokensRedeemed(contract IUniverse _universe, address _account, uint256 _attoParticipationTokens, uint256 _feePayoutShare)</code></a></li><li><a href="#Augur.logTimestampSet(uint256)"><code class="function-signature">logTimestampSet(uint256 _newTimestamp)</code></a></li><li><a href="#Augur.logInitialReporterTransferred(contract IUniverse,contract IMarket,address,address)"><code class="function-signature">logInitialReporterTransferred(contract IUniverse _universe, contract IMarket _market, address _from, address _to)</code></a></li><li><a href="#Augur.logMarketTransferred(contract IUniverse,address,address)"><code class="function-signature">logMarketTransferred(contract IUniverse _universe, address _from, address _to)</code></a></li><li><a href="#Augur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#Augur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logValidityBondChanged(uint256)"><code class="function-signature">logValidityBondChanged(uint256 _validityBond)</code></a></li><li><a href="#Augur.logDesignatedReportStakeChanged(uint256)"><code class="function-signature">logDesignatedReportStakeChanged(uint256 _designatedReportStake)</code></a></li><li><a href="#Augur.logNoShowBondChanged(uint256)"><code class="function-signature">logNoShowBondChanged(uint256 _noShowBond)</code></a></li><li><a href="#Augur.logReportingFeeChanged(uint256)"><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee)</code></a></li><li><a href="#Augur.logMarketRepBondTransferred(address,address,address)"><code class="function-signature">logMarketRepBondTransferred(address _universe, address _from, address _to)</code></a></li><li><a href="#Augur.logWarpSyncDataUpdated(address,uint256,uint256)"><code class="function-signature">logWarpSyncDataUpdated(address _universe, uint256 _warpSyncHash, uint256 _marketEndTime)</code></a></li><li><a href="#Augur.getAndValidateUniverse(address)"><code class="function-signature">getAndValidateUniverse(address _untrustedUniverse)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#Augur.MarketCreated(contract IUniverse,uint256,string,contract IMarket,address,address,uint256,int256[],enum IMarket.MarketType,uint256,bytes32[],uint256,uint256)"><code class="function-signature">MarketCreated(contract IUniverse universe, uint256 endTime, string extraInfo, contract IMarket market, address marketCreator, address designatedReporter, uint256 feePerCashInAttoCash, int256[] prices, enum IMarket.MarketType marketType, uint256 numTicks, bytes32[] outcomes, uint256 noShowBond, uint256 timestamp)</code></a></li><li><a href="#Augur.InitialReportSubmitted(address,address,address,address,uint256,bool,uint256[],string,uint256,uint256,uint256)"><code class="function-signature">InitialReportSubmitted(address universe, address reporter, address market, address initialReporter, uint256 amountStaked, bool isDesignatedReporter, uint256[] payoutNumerators, string description, uint256 nextWindowStartTime, uint256 nextWindowEndTime, uint256 timestamp)</code></a></li><li><a href="#Augur.DisputeCrowdsourcerCreated(address,address,address,uint256[],uint256,uint256)"><code class="function-signature">DisputeCrowdsourcerCreated(address universe, address market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 size, uint256 disputeRound)</code></a></li><li><a href="#Augur.DisputeCrowdsourcerContribution(address,address,address,address,uint256,string,uint256[],uint256,uint256,uint256,uint256)"><code class="function-signature">DisputeCrowdsourcerContribution(address universe, address reporter, address market, address disputeCrowdsourcer, uint256 amountStaked, string description, uint256[] payoutNumerators, uint256 currentStake, uint256 stakeRemaining, uint256 disputeRound, uint256 timestamp)</code></a></li><li><a href="#Augur.DisputeCrowdsourcerCompleted(address,address,address,uint256[],uint256,uint256,bool,uint256,uint256,uint256,uint256)"><code class="function-signature">DisputeCrowdsourcerCompleted(address universe, address market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 nextWindowStartTime, uint256 nextWindowEndTime, bool pacingOn, uint256 totalRepStakedInPayout, uint256 totalRepStakedInMarket, uint256 disputeRound, uint256 timestamp)</code></a></li><li><a href="#Augur.InitialReporterRedeemed(address,address,address,address,uint256,uint256,uint256[],uint256)"><code class="function-signature">InitialReporterRedeemed(address universe, address reporter, address market, address initialReporter, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp)</code></a></li><li><a href="#Augur.DisputeCrowdsourcerRedeemed(address,address,address,address,uint256,uint256,uint256[],uint256)"><code class="function-signature">DisputeCrowdsourcerRedeemed(address universe, address reporter, address market, address disputeCrowdsourcer, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp)</code></a></li><li><a href="#Augur.ReportingParticipantDisavowed(address,address,address)"><code class="function-signature">ReportingParticipantDisavowed(address universe, address market, address reportingParticipant)</code></a></li><li><a href="#Augur.MarketParticipantsDisavowed(address,address)"><code class="function-signature">MarketParticipantsDisavowed(address universe, address market)</code></a></li><li><a href="#Augur.MarketFinalized(address,address,uint256,uint256[])"><code class="function-signature">MarketFinalized(address universe, address market, uint256 timestamp, uint256[] winningPayoutNumerators)</code></a></li><li><a href="#Augur.MarketMigrated(address,address,address)"><code class="function-signature">MarketMigrated(address market, address originalUniverse, address newUniverse)</code></a></li><li><a href="#Augur.UniverseForked(address,contract IMarket)"><code class="function-signature">UniverseForked(address universe, contract IMarket forkingMarket)</code></a></li><li><a href="#Augur.UniverseCreated(address,address,uint256[],uint256)"><code class="function-signature">UniverseCreated(address parentUniverse, address childUniverse, uint256[] payoutNumerators, uint256 creationTimestamp)</code></a></li><li><a href="#Augur.CompleteSetsPurchased(address,address,address,uint256,uint256)"><code class="function-signature">CompleteSetsPurchased(address universe, address market, address account, uint256 numCompleteSets, uint256 timestamp)</code></a></li><li><a href="#Augur.CompleteSetsSold(address,address,address,uint256,uint256,uint256)"><code class="function-signature">CompleteSetsSold(address universe, address market, address account, uint256 numCompleteSets, uint256 fees, uint256 timestamp)</code></a></li><li><a href="#Augur.TradingProceedsClaimed(address,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">TradingProceedsClaimed(address universe, address sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 fees, uint256 timestamp)</code></a></li><li><a href="#Augur.TokensTransferred(address,address,address,address,uint256,enum Augur.TokenType,address)"><code class="function-signature">TokensTransferred(address universe, address token, address from, address to, uint256 value, enum Augur.TokenType tokenType, address market)</code></a></li><li><a href="#Augur.TokensMinted(address,address,address,uint256,enum Augur.TokenType,address,uint256)"><code class="function-signature">TokensMinted(address universe, address token, address target, uint256 amount, enum Augur.TokenType tokenType, address market, uint256 totalSupply)</code></a></li><li><a href="#Augur.TokensBurned(address,address,address,uint256,enum Augur.TokenType,address,uint256)"><code class="function-signature">TokensBurned(address universe, address token, address target, uint256 amount, enum Augur.TokenType tokenType, address market, uint256 totalSupply)</code></a></li><li><a href="#Augur.TokenBalanceChanged(address,address,address,enum Augur.TokenType,address,uint256,uint256)"><code class="function-signature">TokenBalanceChanged(address universe, address owner, address token, enum Augur.TokenType tokenType, address market, uint256 balance, uint256 outcome)</code></a></li><li><a href="#Augur.DisputeWindowCreated(address,address,uint256,uint256,uint256,bool)"><code class="function-signature">DisputeWindowCreated(address universe, address disputeWindow, uint256 startTime, uint256 endTime, uint256 id, bool initial)</code></a></li><li><a href="#Augur.InitialReporterTransferred(address,address,address,address)"><code class="function-signature">InitialReporterTransferred(address universe, address market, address from, address to)</code></a></li><li><a href="#Augur.MarketTransferred(address,address,address,address)"><code class="function-signature">MarketTransferred(address universe, address market, address from, address to)</code></a></li><li><a href="#Augur.MarketOIChanged(address,address,uint256)"><code class="function-signature">MarketOIChanged(address universe, address market, uint256 marketOI)</code></a></li><li><a href="#Augur.ParticipationTokensRedeemed(address,address,address,uint256,uint256,uint256)"><code class="function-signature">ParticipationTokensRedeemed(address universe, address disputeWindow, address account, uint256 attoParticipationTokens, uint256 feePayoutShare, uint256 timestamp)</code></a></li><li><a href="#Augur.TimestampSet(uint256)"><code class="function-signature">TimestampSet(uint256 newTimestamp)</code></a></li><li><a href="#Augur.ValidityBondChanged(address,uint256)"><code class="function-signature">ValidityBondChanged(address universe, uint256 validityBond)</code></a></li><li><a href="#Augur.DesignatedReportStakeChanged(address,uint256)"><code class="function-signature">DesignatedReportStakeChanged(address universe, uint256 designatedReportStake)</code></a></li><li><a href="#Augur.NoShowBondChanged(address,uint256)"><code class="function-signature">NoShowBondChanged(address universe, uint256 noShowBond)</code></a></li><li><a href="#Augur.ReportingFeeChanged(address,uint256)"><code class="function-signature">ReportingFeeChanged(address universe, uint256 reportingFee)</code></a></li><li><a href="#Augur.ShareTokenBalanceChanged(address,address,address,uint256,uint256)"><code class="function-signature">ShareTokenBalanceChanged(address universe, address account, address market, uint256 outcome, uint256 balance)</code></a></li><li><a href="#Augur.MarketRepBondTransferred(address,address,address,address)"><code class="function-signature">MarketRepBondTransferred(address universe, address market, address from, address to)</code></a></li><li><a href="#Augur.WarpSyncDataUpdated(address,uint256,uint256)"><code class="function-signature">WarpSyncDataUpdated(address universe, uint256 warpSyncHash, uint256 marketEndTime)</code></a></li><li><a href="#Augur.RegisterContract(address,bytes32)"><code class="function-signature">RegisterContract(address contractAddress, bytes32 key)</code></a></li><li><a href="#Augur.FinishDeployment()"><code class="function-signature">FinishDeployment()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Augur.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.registerContract(bytes32,address)"></a><code class="function-signature">registerContract(bytes32 _key, address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.finishDeployment()"></a><code class="function-signature">finishDeployment() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.createGenesisUniverse()"></a><code class="function-signature">createGenesisUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.createChildUniverse(bytes32,uint256[])"></a><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isKnownUniverse(contract IUniverse)"></a><code class="function-signature">isKnownUniverse(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getUniverseForkIndex(contract IUniverse)"></a><code class="function-signature">getUniverseForkIndex(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isKnownCrowdsourcer(contract IDisputeCrowdsourcer)"></a><code class="function-signature">isKnownCrowdsourcer(contract IDisputeCrowdsourcer _crowdsourcer) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256,uint256)"></a><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size, uint256 _disputeRound) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isKnownFeeSender(address)"></a><code class="function-signature">isKnownFeeSender(address _feeSender) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.trustedCashTransfer(address,address,uint256)"></a><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isTrustedSender(address)"></a><code class="function-signature">isTrustedSender(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isKnownMarket(contract IMarket)"></a><code class="function-signature">isKnownMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getMaximumMarketEndDate()"></a><code class="function-signature">getMaximumMarketEndDate() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.derivePayoutDistributionHash(uint256[],uint256,uint256)"></a><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 _numOutcomes) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getMarketCreationData(contract IMarket)"></a><code class="function-signature">getMarketCreationData(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">struct IAugurCreationDataGetter.MarketCreationData</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getMarketType(contract IMarket)"></a><code class="function-signature">getMarketType(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">enum IMarket.MarketType</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getMarketOutcomes(contract IMarket)"></a><code class="function-signature">getMarketOutcomes(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bytes32[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getMarketRecommendedTradeInterval(contract IMarket)"></a><code class="function-signature">getMarketRecommendedTradeInterval(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.onCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"></a><code class="function-signature">onCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, bytes32[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.onYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"></a><code class="function-signature">onYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.onScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"></a><code class="function-signature">onScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, int256[] _prices, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getTradeInterval(uint256,uint256)"></a><code class="function-signature">getTradeInterval(uint256 _displayRange, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logInitialReportSubmitted(contract IUniverse,address,address,address,uint256,bool,uint256[],string,uint256,uint256)"></a><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, address _initialReporter, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string _description, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string,uint256[],uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string _description, uint256[] _payoutNumerators, uint256 _currentStake, uint256 _stakeRemaining, uint256 _disputeRound) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256[],uint256,uint256,bool,uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime, bool _pacingOn, uint256 _totalRepStakedInPayout, uint256 _totalRepStakedInMarket, uint256 _disputeRound) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"></a><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"></a><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"></a><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketParticipantsDisavowed(contract IUniverse)"></a><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketFinalized(contract IUniverse,uint256[])"></a><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketMigrated(contract IMarket,contract IUniverse)"></a><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"></a><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"></a><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketOIChanged(contract IUniverse,contract IMarket)"></a><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logUniverseForked(contract IMarket)"></a><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"></a><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeWindowCreated(contract IDisputeWindow,uint256,bool)"></a><code class="function-signature">logDisputeWindowCreated(contract IDisputeWindow _disputeWindow, uint256 _id, bool _initial) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logParticipationTokensRedeemed(contract IUniverse,address,uint256,uint256)"></a><code class="function-signature">logParticipationTokensRedeemed(contract IUniverse _universe, address _account, uint256 _attoParticipationTokens, uint256 _feePayoutShare) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logTimestampSet(uint256)"></a><code class="function-signature">logTimestampSet(uint256 _newTimestamp) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logInitialReporterTransferred(contract IUniverse,contract IMarket,address,address)"></a><code class="function-signature">logInitialReporterTransferred(contract IUniverse _universe, contract IMarket _market, address _from, address _to) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketTransferred(contract IUniverse,address,address)"></a><code class="function-signature">logMarketTransferred(contract IUniverse _universe, address _from, address _to) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logValidityBondChanged(uint256)"></a><code class="function-signature">logValidityBondChanged(uint256 _validityBond) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDesignatedReportStakeChanged(uint256)"></a><code class="function-signature">logDesignatedReportStakeChanged(uint256 _designatedReportStake) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logNoShowBondChanged(uint256)"></a><code class="function-signature">logNoShowBondChanged(uint256 _noShowBond) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logReportingFeeChanged(uint256)"></a><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketRepBondTransferred(address,address,address)"></a><code class="function-signature">logMarketRepBondTransferred(address _universe, address _from, address _to) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logWarpSyncDataUpdated(address,uint256,uint256)"></a><code class="function-signature">logWarpSyncDataUpdated(address _universe, uint256 _warpSyncHash, uint256 _marketEndTime) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getAndValidateUniverse(address)"></a><code class="function-signature">getAndValidateUniverse(address _untrustedUniverse) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="Augur.MarketCreated(contract IUniverse,uint256,string,contract IMarket,address,address,uint256,int256[],enum IMarket.MarketType,uint256,bytes32[],uint256,uint256)"></a><code class="function-signature">MarketCreated(contract IUniverse universe, uint256 endTime, string extraInfo, contract IMarket market, address marketCreator, address designatedReporter, uint256 feePerCashInAttoCash, int256[] prices, enum IMarket.MarketType marketType, uint256 numTicks, bytes32[] outcomes, uint256 noShowBond, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.InitialReportSubmitted(address,address,address,address,uint256,bool,uint256[],string,uint256,uint256,uint256)"></a><code class="function-signature">InitialReportSubmitted(address universe, address reporter, address market, address initialReporter, uint256 amountStaked, bool isDesignatedReporter, uint256[] payoutNumerators, string description, uint256 nextWindowStartTime, uint256 nextWindowEndTime, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeCrowdsourcerCreated(address,address,address,uint256[],uint256,uint256)"></a><code class="function-signature">DisputeCrowdsourcerCreated(address universe, address market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 size, uint256 disputeRound)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeCrowdsourcerContribution(address,address,address,address,uint256,string,uint256[],uint256,uint256,uint256,uint256)"></a><code class="function-signature">DisputeCrowdsourcerContribution(address universe, address reporter, address market, address disputeCrowdsourcer, uint256 amountStaked, string description, uint256[] payoutNumerators, uint256 currentStake, uint256 stakeRemaining, uint256 disputeRound, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeCrowdsourcerCompleted(address,address,address,uint256[],uint256,uint256,bool,uint256,uint256,uint256,uint256)"></a><code class="function-signature">DisputeCrowdsourcerCompleted(address universe, address market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 nextWindowStartTime, uint256 nextWindowEndTime, bool pacingOn, uint256 totalRepStakedInPayout, uint256 totalRepStakedInMarket, uint256 disputeRound, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.InitialReporterRedeemed(address,address,address,address,uint256,uint256,uint256[],uint256)"></a><code class="function-signature">InitialReporterRedeemed(address universe, address reporter, address market, address initialReporter, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeCrowdsourcerRedeemed(address,address,address,address,uint256,uint256,uint256[],uint256)"></a><code class="function-signature">DisputeCrowdsourcerRedeemed(address universe, address reporter, address market, address disputeCrowdsourcer, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.ReportingParticipantDisavowed(address,address,address)"></a><code class="function-signature">ReportingParticipantDisavowed(address universe, address market, address reportingParticipant)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketParticipantsDisavowed(address,address)"></a><code class="function-signature">MarketParticipantsDisavowed(address universe, address market)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketFinalized(address,address,uint256,uint256[])"></a><code class="function-signature">MarketFinalized(address universe, address market, uint256 timestamp, uint256[] winningPayoutNumerators)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketMigrated(address,address,address)"></a><code class="function-signature">MarketMigrated(address market, address originalUniverse, address newUniverse)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.UniverseForked(address,contract IMarket)"></a><code class="function-signature">UniverseForked(address universe, contract IMarket forkingMarket)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.UniverseCreated(address,address,uint256[],uint256)"></a><code class="function-signature">UniverseCreated(address parentUniverse, address childUniverse, uint256[] payoutNumerators, uint256 creationTimestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.CompleteSetsPurchased(address,address,address,uint256,uint256)"></a><code class="function-signature">CompleteSetsPurchased(address universe, address market, address account, uint256 numCompleteSets, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.CompleteSetsSold(address,address,address,uint256,uint256,uint256)"></a><code class="function-signature">CompleteSetsSold(address universe, address market, address account, uint256 numCompleteSets, uint256 fees, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TradingProceedsClaimed(address,address,address,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">TradingProceedsClaimed(address universe, address sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 fees, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TokensTransferred(address,address,address,address,uint256,enum Augur.TokenType,address)"></a><code class="function-signature">TokensTransferred(address universe, address token, address from, address to, uint256 value, enum Augur.TokenType tokenType, address market)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TokensMinted(address,address,address,uint256,enum Augur.TokenType,address,uint256)"></a><code class="function-signature">TokensMinted(address universe, address token, address target, uint256 amount, enum Augur.TokenType tokenType, address market, uint256 totalSupply)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TokensBurned(address,address,address,uint256,enum Augur.TokenType,address,uint256)"></a><code class="function-signature">TokensBurned(address universe, address token, address target, uint256 amount, enum Augur.TokenType tokenType, address market, uint256 totalSupply)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TokenBalanceChanged(address,address,address,enum Augur.TokenType,address,uint256,uint256)"></a><code class="function-signature">TokenBalanceChanged(address universe, address owner, address token, enum Augur.TokenType tokenType, address market, uint256 balance, uint256 outcome)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeWindowCreated(address,address,uint256,uint256,uint256,bool)"></a><code class="function-signature">DisputeWindowCreated(address universe, address disputeWindow, uint256 startTime, uint256 endTime, uint256 id, bool initial)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.InitialReporterTransferred(address,address,address,address)"></a><code class="function-signature">InitialReporterTransferred(address universe, address market, address from, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketTransferred(address,address,address,address)"></a><code class="function-signature">MarketTransferred(address universe, address market, address from, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketOIChanged(address,address,uint256)"></a><code class="function-signature">MarketOIChanged(address universe, address market, uint256 marketOI)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.ParticipationTokensRedeemed(address,address,address,uint256,uint256,uint256)"></a><code class="function-signature">ParticipationTokensRedeemed(address universe, address disputeWindow, address account, uint256 attoParticipationTokens, uint256 feePayoutShare, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TimestampSet(uint256)"></a><code class="function-signature">TimestampSet(uint256 newTimestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.ValidityBondChanged(address,uint256)"></a><code class="function-signature">ValidityBondChanged(address universe, uint256 validityBond)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DesignatedReportStakeChanged(address,uint256)"></a><code class="function-signature">DesignatedReportStakeChanged(address universe, uint256 designatedReportStake)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.NoShowBondChanged(address,uint256)"></a><code class="function-signature">NoShowBondChanged(address universe, uint256 noShowBond)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.ReportingFeeChanged(address,uint256)"></a><code class="function-signature">ReportingFeeChanged(address universe, uint256 reportingFee)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.ShareTokenBalanceChanged(address,address,address,uint256,uint256)"></a><code class="function-signature">ShareTokenBalanceChanged(address universe, address account, address market, uint256 outcome, uint256 balance)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketRepBondTransferred(address,address,address,address)"></a><code class="function-signature">MarketRepBondTransferred(address universe, address market, address from, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.WarpSyncDataUpdated(address,uint256,uint256)"></a><code class="function-signature">WarpSyncDataUpdated(address universe, uint256 warpSyncHash, uint256 marketEndTime)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.RegisterContract(address,bytes32)"></a><code class="function-signature">RegisterContract(address contractAddress, bytes32 key)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.FinishDeployment()"></a><code class="function-signature">FinishDeployment()</code><span class="function-visibility"></span></h4>





### `ContractExists`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ContractExists.exists(address)"><code class="function-signature">exists(address _address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ContractExists.exists(address)"></a><code class="function-signature">exists(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `IAffiliateValidator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAffiliateValidator.validateReference(address,address)"><code class="function-signature">validateReference(address _account, address _referrer)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAffiliateValidator.validateReference(address,address)"></a><code class="function-signature">validateReference(address _account, address _referrer) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `IAffiliates`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAffiliates.setFingerprint(bytes32)"><code class="function-signature">setFingerprint(bytes32 _fingerprint)</code></a></li><li><a href="#IAffiliates.setReferrer(address)"><code class="function-signature">setReferrer(address _referrer)</code></a></li><li><a href="#IAffiliates.getAccountFingerprint(address)"><code class="function-signature">getAccountFingerprint(address _account)</code></a></li><li><a href="#IAffiliates.getReferrer(address)"><code class="function-signature">getReferrer(address _account)</code></a></li><li><a href="#IAffiliates.getAndValidateReferrer(address,contract IAffiliateValidator)"><code class="function-signature">getAndValidateReferrer(address _account, contract IAffiliateValidator affiliateValidator)</code></a></li><li><a href="#IAffiliates.affiliateValidators(address)"><code class="function-signature">affiliateValidators(address _affiliateValidator)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAffiliates.setFingerprint(bytes32)"></a><code class="function-signature">setFingerprint(bytes32 _fingerprint)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.setReferrer(address)"></a><code class="function-signature">setReferrer(address _referrer)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.getAccountFingerprint(address)"></a><code class="function-signature">getAccountFingerprint(address _account) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.getReferrer(address)"></a><code class="function-signature">getReferrer(address _account) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.getAndValidateReferrer(address,contract IAffiliateValidator)"></a><code class="function-signature">getAndValidateReferrer(address _account, contract IAffiliateValidator affiliateValidator) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.affiliateValidators(address)"></a><code class="function-signature">affiliateValidators(address _affiliateValidator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `IAugur`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugur.createChildUniverse(bytes32,uint256[])"><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IAugur.isKnownUniverse(contract IUniverse)"><code class="function-signature">isKnownUniverse(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.trustedCashTransfer(address,address,uint256)"><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#IAugur.isTrustedSender(address)"><code class="function-signature">isTrustedSender(address _address)</code></a></li><li><a href="#IAugur.onCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"><code class="function-signature">onCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, bytes32[] _outcomes)</code></a></li><li><a href="#IAugur.onYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"><code class="function-signature">onYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash)</code></a></li><li><a href="#IAugur.onScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"><code class="function-signature">onScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, int256[] _prices, uint256 _numTicks)</code></a></li><li><a href="#IAugur.logInitialReportSubmitted(contract IUniverse,address,address,address,uint256,bool,uint256[],string,uint256,uint256)"><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, address _initialReporter, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string _description, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime)</code></a></li><li><a href="#IAugur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256,uint256)"><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size, uint256 _disputeRound)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string,uint256[],uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string description, uint256[] _payoutNumerators, uint256 _currentStake, uint256 _stakeRemaining, uint256 _disputeRound)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256[],uint256,uint256,bool,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime, bool _pacingOn, uint256 _totalRepStakedInPayout, uint256 _totalRepStakedInMarket, uint256 _disputeRound)</code></a></li><li><a href="#IAugur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logMarketFinalized(contract IUniverse,uint256[])"><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators)</code></a></li><li><a href="#IAugur.logMarketMigrated(contract IMarket,contract IUniverse)"><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse)</code></a></li><li><a href="#IAugur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IAugur.logMarketParticipantsDisavowed(contract IUniverse)"><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets)</code></a></li><li><a href="#IAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees)</code></a></li><li><a href="#IAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IAugur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees)</code></a></li><li><a href="#IAugur.logUniverseForked(contract IMarket)"><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket)</code></a></li><li><a href="#IAugur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeWindowCreated(contract IDisputeWindow,uint256,bool)"><code class="function-signature">logDisputeWindowCreated(contract IDisputeWindow _disputeWindow, uint256 _id, bool _initial)</code></a></li><li><a href="#IAugur.logParticipationTokensRedeemed(contract IUniverse,address,uint256,uint256)"><code class="function-signature">logParticipationTokensRedeemed(contract IUniverse universe, address _sender, uint256 _attoParticipationTokens, uint256 _feePayoutShare)</code></a></li><li><a href="#IAugur.logTimestampSet(uint256)"><code class="function-signature">logTimestampSet(uint256 _newTimestamp)</code></a></li><li><a href="#IAugur.logInitialReporterTransferred(contract IUniverse,contract IMarket,address,address)"><code class="function-signature">logInitialReporterTransferred(contract IUniverse _universe, contract IMarket _market, address _from, address _to)</code></a></li><li><a href="#IAugur.logMarketTransferred(contract IUniverse,address,address)"><code class="function-signature">logMarketTransferred(contract IUniverse _universe, address _from, address _to)</code></a></li><li><a href="#IAugur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logMarketRepBondTransferred(address,address,address)"><code class="function-signature">logMarketRepBondTransferred(address _universe, address _from, address _to)</code></a></li><li><a href="#IAugur.logWarpSyncDataUpdated(address,uint256,uint256)"><code class="function-signature">logWarpSyncDataUpdated(address _universe, uint256 _warpSyncHash, uint256 _marketEndTime)</code></a></li><li><a href="#IAugur.isKnownFeeSender(address)"><code class="function-signature">isKnownFeeSender(address _feeSender)</code></a></li><li><a href="#IAugur.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#IAugur.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#IAugur.getMaximumMarketEndDate()"><code class="function-signature">getMaximumMarketEndDate()</code></a></li><li><a href="#IAugur.isKnownMarket(contract IMarket)"><code class="function-signature">isKnownMarket(contract IMarket _market)</code></a></li><li><a href="#IAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 numOutcomes)</code></a></li><li><a href="#IAugur.logValidityBondChanged(uint256)"><code class="function-signature">logValidityBondChanged(uint256 _validityBond)</code></a></li><li><a href="#IAugur.logDesignatedReportStakeChanged(uint256)"><code class="function-signature">logDesignatedReportStakeChanged(uint256 _designatedReportStake)</code></a></li><li><a href="#IAugur.logNoShowBondChanged(uint256)"><code class="function-signature">logNoShowBondChanged(uint256 _noShowBond)</code></a></li><li><a href="#IAugur.logReportingFeeChanged(uint256)"><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee)</code></a></li><li><a href="#IAugur.getUniverseForkIndex(contract IUniverse)"><code class="function-signature">getUniverseForkIndex(contract IUniverse _universe)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAugur.createChildUniverse(bytes32,uint256[])"></a><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownUniverse(contract IUniverse)"></a><code class="function-signature">isKnownUniverse(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.trustedCashTransfer(address,address,uint256)"></a><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isTrustedSender(address)"></a><code class="function-signature">isTrustedSender(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.onCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"></a><code class="function-signature">onCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, bytes32[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.onYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"></a><code class="function-signature">onYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.onScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"></a><code class="function-signature">onScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, int256[] _prices, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logInitialReportSubmitted(contract IUniverse,address,address,address,uint256,bool,uint256[],string,uint256,uint256)"></a><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, address _initialReporter, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string _description, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256,uint256)"></a><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size, uint256 _disputeRound) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string,uint256[],uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string description, uint256[] _payoutNumerators, uint256 _currentStake, uint256 _stakeRemaining, uint256 _disputeRound) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256[],uint256,uint256,bool,uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime, bool _pacingOn, uint256 _totalRepStakedInPayout, uint256 _totalRepStakedInMarket, uint256 _disputeRound) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"></a><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"></a><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketFinalized(contract IUniverse,uint256[])"></a><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketMigrated(contract IMarket,contract IUniverse)"></a><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"></a><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketParticipantsDisavowed(contract IUniverse)"></a><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"></a><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"></a><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"></a><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logUniverseForked(contract IMarket)"></a><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"></a><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeCrowdsourcerTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeCrowdsourcerTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeWindowCreated(contract IDisputeWindow,uint256,bool)"></a><code class="function-signature">logDisputeWindowCreated(contract IDisputeWindow _disputeWindow, uint256 _id, bool _initial) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logParticipationTokensRedeemed(contract IUniverse,address,uint256,uint256)"></a><code class="function-signature">logParticipationTokensRedeemed(contract IUniverse universe, address _sender, uint256 _attoParticipationTokens, uint256 _feePayoutShare) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logTimestampSet(uint256)"></a><code class="function-signature">logTimestampSet(uint256 _newTimestamp) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logInitialReporterTransferred(contract IUniverse,contract IMarket,address,address)"></a><code class="function-signature">logInitialReporterTransferred(contract IUniverse _universe, contract IMarket _market, address _from, address _to) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketTransferred(contract IUniverse,address,address)"></a><code class="function-signature">logMarketTransferred(contract IUniverse _universe, address _from, address _to) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketRepBondTransferred(address,address,address)"></a><code class="function-signature">logMarketRepBondTransferred(address _universe, address _from, address _to) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logWarpSyncDataUpdated(address,uint256,uint256)"></a><code class="function-signature">logWarpSyncDataUpdated(address _universe, uint256 _warpSyncHash, uint256 _marketEndTime) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownFeeSender(address)"></a><code class="function-signature">isKnownFeeSender(address _feeSender) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.getMaximumMarketEndDate()"></a><code class="function-signature">getMaximumMarketEndDate() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownMarket(contract IMarket)"></a><code class="function-signature">isKnownMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"></a><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 numOutcomes) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logValidityBondChanged(uint256)"></a><code class="function-signature">logValidityBondChanged(uint256 _validityBond) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDesignatedReportStakeChanged(uint256)"></a><code class="function-signature">logDesignatedReportStakeChanged(uint256 _designatedReportStake) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logNoShowBondChanged(uint256)"></a><code class="function-signature">logNoShowBondChanged(uint256 _noShowBond) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logReportingFeeChanged(uint256)"></a><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.getUniverseForkIndex(contract IUniverse)"></a><code class="function-signature">getUniverseForkIndex(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IAugurCreationDataGetter`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugurCreationDataGetter.getMarketCreationData(contract IMarket)"><code class="function-signature">getMarketCreationData(contract IMarket _market)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAugurCreationDataGetter.getMarketCreationData(contract IMarket)"></a><code class="function-signature">getMarketCreationData(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">struct IAugurCreationDataGetter.MarketCreationData</span></code><span class="function-visibility">public</span></h4>







### `IAugurTrading`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugurTrading.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#IAugurTrading.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost)</code></a></li><li><a href="#IAugurTrading.logOrderCreated(contract IUniverse,bytes32,bytes32)"><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#IAugurTrading.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId)</code></a></li><li><a href="#IAugurTrading.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#IAugurTrading.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[],uint256)"><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes, uint256 _totalTrades)</code></a></li><li><a href="#IAugurTrading.logZeroXOrderFilled(contract IUniverse,contract IMarket,bytes32,bytes32,uint8,address[],uint256[])"><code class="function-signature">logZeroXOrderFilled(contract IUniverse _universe, contract IMarket _market, bytes32 _orderHash, bytes32 _tradeGroupId, uint8 _orderType, address[] _addressData, uint256[] _uint256Data)</code></a></li><li><a href="#IAugurTrading.logZeroXOrderCanceled(address,address,address,uint256,uint256,uint256,uint8,bytes32)"><code class="function-signature">logZeroXOrderCanceled(address _universe, address _market, address _account, uint256 _outcome, uint256 _price, uint256 _amount, uint8 _type, bytes32 _orderHash)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"></a><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logOrderCreated(contract IUniverse,bytes32,bytes32)"></a><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"></a><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"></a><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[],uint256)"></a><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes, uint256 _totalTrades) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logZeroXOrderFilled(contract IUniverse,contract IMarket,bytes32,bytes32,uint8,address[],uint256[])"></a><code class="function-signature">logZeroXOrderFilled(contract IUniverse _universe, contract IMarket _market, bytes32 _orderHash, bytes32 _tradeGroupId, uint8 _orderType, address[] _addressData, uint256[] _uint256Data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logZeroXOrderCanceled(address,address,address,uint256,uint256,uint256,uint8,bytes32)"></a><code class="function-signature">logZeroXOrderCanceled(address _universe, address _market, address _account, uint256 _outcome, uint256 _price, uint256 _amount, uint8 _type, bytes32 _orderHash)</code><span class="function-visibility">public</span></h4>







### `ICash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li class="inherited"><a href="utility#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="utility#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="utility#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="utility#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="utility#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>





### `IDisputeCrowdsourcer`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _crowdsourcerGeneration)</code></a></li><li><a href="#IDisputeCrowdsourcer.contribute(address,uint256,bool)"><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload)</code></a></li><li><a href="#IDisputeCrowdsourcer.setSize(uint256)"><code class="function-signature">setSize(uint256 _size)</code></a></li><li><a href="#IDisputeCrowdsourcer.getRemainingToFill()"><code class="function-signature">getRemainingToFill()</code></a></li><li><a href="#IDisputeCrowdsourcer.correctSize()"><code class="function-signature">correctSize()</code></a></li><li><a href="#IDisputeCrowdsourcer.getCrowdsourcerGeneration()"><code class="function-signature">getCrowdsourcerGeneration()</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li class="inherited"><a href="#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],uint256)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _crowdsourcerGeneration)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.contribute(address,uint256,bool)"></a><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.setSize(uint256)"></a><code class="function-signature">setSize(uint256 _size)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.getRemainingToFill()"></a><code class="function-signature">getRemainingToFill() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.correctSize()"></a><code class="function-signature">correctSize() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.getCrowdsourcerGeneration()"></a><code class="function-signature">getCrowdsourcerGeneration() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IDisputeWindow`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeWindow.invalidMarketsTotal()"><code class="function-signature">invalidMarketsTotal()</code></a></li><li><a href="#IDisputeWindow.validityBondTotal()"><code class="function-signature">validityBondTotal()</code></a></li><li><a href="#IDisputeWindow.incorrectDesignatedReportTotal()"><code class="function-signature">incorrectDesignatedReportTotal()</code></a></li><li><a href="#IDisputeWindow.initialReportBondTotal()"><code class="function-signature">initialReportBondTotal()</code></a></li><li><a href="#IDisputeWindow.designatedReportNoShowsTotal()"><code class="function-signature">designatedReportNoShowsTotal()</code></a></li><li><a href="#IDisputeWindow.designatedReporterNoShowBondTotal()"><code class="function-signature">designatedReporterNoShowBondTotal()</code></a></li><li><a href="#IDisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,bool,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, bool _participationTokensEnabled, uint256 _duration, uint256 _startTime)</code></a></li><li><a href="#IDisputeWindow.trustedBuy(address,uint256)"><code class="function-signature">trustedBuy(address _buyer, uint256 _attotokens)</code></a></li><li><a href="#IDisputeWindow.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IDisputeWindow.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IDisputeWindow.getStartTime()"><code class="function-signature">getStartTime()</code></a></li><li><a href="#IDisputeWindow.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IDisputeWindow.getWindowId()"><code class="function-signature">getWindowId()</code></a></li><li><a href="#IDisputeWindow.isActive()"><code class="function-signature">isActive()</code></a></li><li><a href="#IDisputeWindow.isOver()"><code class="function-signature">isOver()</code></a></li><li><a href="#IDisputeWindow.onMarketFinalized()"><code class="function-signature">onMarketFinalized()</code></a></li><li><a href="#IDisputeWindow.redeem(address)"><code class="function-signature">redeem(address _account)</code></a></li><li class="inherited"><a href="utility#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="utility#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="utility#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="utility#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="utility#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="utility#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.invalidMarketsTotal()"></a><code class="function-signature">invalidMarketsTotal() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.validityBondTotal()"></a><code class="function-signature">validityBondTotal() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.incorrectDesignatedReportTotal()"></a><code class="function-signature">incorrectDesignatedReportTotal() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.initialReportBondTotal()"></a><code class="function-signature">initialReportBondTotal() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.designatedReportNoShowsTotal()"></a><code class="function-signature">designatedReportNoShowsTotal() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.designatedReporterNoShowBondTotal()"></a><code class="function-signature">designatedReporterNoShowBondTotal() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,bool,uint256,uint256)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, bool _participationTokensEnabled, uint256 _duration, uint256 _startTime)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.trustedBuy(address,uint256)"></a><code class="function-signature">trustedBuy(address _buyer, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getStartTime()"></a><code class="function-signature">getStartTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getEndTime()"></a><code class="function-signature">getEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getWindowId()"></a><code class="function-signature">getWindowId() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.isActive()"></a><code class="function-signature">isActive() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.isOver()"></a><code class="function-signature">isOver() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.onMarketFinalized()"></a><code class="function-signature">onMarketFinalized()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.redeem(address)"></a><code class="function-signature">redeem(address _account) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IERC1155`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#IERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li><a href="#IERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li><a href="#IERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address owner, address operator)</code></a></li><li><a href="#IERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address owner, uint256 id)</code></a></li><li><a href="#IERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li><a href="#IERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li><a href="#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li><a href="#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li><a href="#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"></a><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"></a><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.setApprovalForAll(address,bool)"></a><code class="function-signature">setApprovalForAll(address operator, bool approved)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.isApprovedForAll(address,address)"></a><code class="function-signature">isApprovedForAll(address owner, address operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.balanceOf(address,uint256)"></a><code class="function-signature">balanceOf(address owner, uint256 id) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.totalSupply(uint256)"></a><code class="function-signature">totalSupply(uint256 id) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.balanceOfBatch(address[],uint256[])"></a><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IERC1155.TransferSingle(address,address,address,uint256,uint256)"></a><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code><span class="function-visibility"></span></h4>

Either TransferSingle or TransferBatch MUST emit when tokens are transferred,
      including zero value transfers as well as minting or burning.
 Operator will always be msg.sender.
 Either event from address `0x0` signifies a minting operation.
 An event to address `0x0` signifies a burning or melting operation.
 The total value transferred from address 0x0 minus the total value transferred to 0x0 may
 be used by clients and exchanges to be added to the &quot;circulating supply&quot; for a given token ID.
 To define a token ID with no initial balance, the contract SHOULD emit the TransferSingle event
 from `0x0` to `0x0`, with the token creator as `_operator`.



<h4><a class="anchor" aria-hidden="true" id="IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"></a><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code><span class="function-visibility"></span></h4>

Either TransferSingle or TransferBatch MUST emit when tokens are transferred,
      including zero value transfers as well as minting or burning.
Operator will always be msg.sender.
 Either event from address `0x0` signifies a minting operation.
 An event to address `0x0` signifies a burning or melting operation.
 The total value transferred from address 0x0 minus the total value transferred to 0x0 may
 be used by clients and exchanges to be added to the &quot;circulating supply&quot; for a given token ID.
 To define multiple token IDs with no initial balance, this SHOULD emit the TransferBatch event
 from `0x0` to `0x0`, with the token creator as `_operator`.



<h4><a class="anchor" aria-hidden="true" id="IERC1155.ApprovalForAll(address,address,bool)"></a><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code><span class="function-visibility"></span></h4>

MUST emit when an approval is updated.



<h4><a class="anchor" aria-hidden="true" id="IERC1155.URI(string,uint256)"></a><code class="function-signature">URI(string value, uint256 id)</code><span class="function-visibility"></span></h4>

MUST emit when the URI is updated for a token ID.
 URIs are defined in RFC 3986.
 The URI MUST point a JSON file that conforms to the &quot;ERC-1155 Metadata JSON Schema&quot;.



### `IERC20`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC20.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.allowance(address,address)"></a><code class="function-signature">allowance(address owner, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IERC20.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





### `IInitialReporter`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IInitialReporter.initialize(contract IAugur,contract IMarket,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.report(address,bytes32,uint256[],uint256)"><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code></a></li><li><a href="#IInitialReporter.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#IInitialReporter.initialReporterWasCorrect()"><code class="function-signature">initialReporterWasCorrect()</code></a></li><li><a href="#IInitialReporter.getDesignatedReporter()"><code class="function-signature">getDesignatedReporter()</code></a></li><li><a href="#IInitialReporter.getReportTimestamp()"><code class="function-signature">getReportTimestamp()</code></a></li><li><a href="#IInitialReporter.migrateToNewUniverse(address)"><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.returnRepFromDisavow()"><code class="function-signature">returnRepFromDisavow()</code></a></li><li class="inherited"><a href="utility#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="utility#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li class="inherited"><a href="utility#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="utility#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="utility#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="utility#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li class="inherited"><a href="utility#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="utility#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="utility#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="utility#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="utility#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.initialize(contract IAugur,contract IMarket,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.report(address,bytes32,uint256[],uint256)"></a><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.designatedReporterShowed()"></a><code class="function-signature">designatedReporterShowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.initialReporterWasCorrect()"></a><code class="function-signature">initialReporterWasCorrect() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getDesignatedReporter()"></a><code class="function-signature">getDesignatedReporter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getReportTimestamp()"></a><code class="function-signature">getReportTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.migrateToNewUniverse(address)"></a><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.returnRepFromDisavow()"></a><code class="function-signature">returnRepFromDisavow()</code><span class="function-visibility">public</span></h4>







### `IMarket`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMarket.initialize(contract IAugur,contract IUniverse,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#IMarket.derivePayoutDistributionHash(uint256[])"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators)</code></a></li><li><a href="#IMarket.doInitialReport(uint256[],string,uint256)"><code class="function-signature">doInitialReport(uint256[] _payoutNumerators, string _description, uint256 _additionalStake)</code></a></li><li><a href="#IMarket.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IMarket.getDisputeWindow()"><code class="function-signature">getDisputeWindow()</code></a></li><li><a href="#IMarket.getNumberOfOutcomes()"><code class="function-signature">getNumberOfOutcomes()</code></a></li><li><a href="#IMarket.getNumTicks()"><code class="function-signature">getNumTicks()</code></a></li><li><a href="#IMarket.getMarketCreatorSettlementFeeDivisor()"><code class="function-signature">getMarketCreatorSettlementFeeDivisor()</code></a></li><li><a href="#IMarket.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IMarket.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IMarket.getWinningPayoutDistributionHash()"><code class="function-signature">getWinningPayoutDistributionHash()</code></a></li><li><a href="#IMarket.getWinningPayoutNumerator(uint256)"><code class="function-signature">getWinningPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IMarket.getWinningReportingParticipant()"><code class="function-signature">getWinningReportingParticipant()</code></a></li><li><a href="#IMarket.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IMarket.getFinalizationTime()"><code class="function-signature">getFinalizationTime()</code></a></li><li><a href="#IMarket.getInitialReporter()"><code class="function-signature">getInitialReporter()</code></a></li><li><a href="#IMarket.getDesignatedReportingEndTime()"><code class="function-signature">getDesignatedReportingEndTime()</code></a></li><li><a href="#IMarket.getValidityBondAttoCash()"><code class="function-signature">getValidityBondAttoCash()</code></a></li><li><a href="#IMarket.affiliateFeeDivisor()"><code class="function-signature">affiliateFeeDivisor()</code></a></li><li><a href="#IMarket.getNumParticipants()"><code class="function-signature">getNumParticipants()</code></a></li><li><a href="#IMarket.getDisputePacingOn()"><code class="function-signature">getDisputePacingOn()</code></a></li><li><a href="#IMarket.deriveMarketCreatorFeeAmount(uint256)"><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount)</code></a></li><li><a href="#IMarket.recordMarketCreatorFees(uint256,address,bytes32)"><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#IMarket.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IMarket.isFinalizedAsInvalid()"><code class="function-signature">isFinalizedAsInvalid()</code></a></li><li><a href="#IMarket.finalize()"><code class="function-signature">finalize()</code></a></li><li><a href="#IMarket.isFinalized()"><code class="function-signature">isFinalized()</code></a></li><li><a href="#IMarket.getOpenInterest()"><code class="function-signature">getOpenInterest()</code></a></li><li class="inherited"><a href="utility#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="utility#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IMarket.initialize(contract IAugur,contract IUniverse,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.derivePayoutDistributionHash(uint256[])"></a><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.doInitialReport(uint256[],string,uint256)"></a><code class="function-signature">doInitialReport(uint256[] _payoutNumerators, string _description, uint256 _additionalStake) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getDisputeWindow()"></a><code class="function-signature">getDisputeWindow() <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getNumberOfOutcomes()"></a><code class="function-signature">getNumberOfOutcomes() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getNumTicks()"></a><code class="function-signature">getNumTicks() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getMarketCreatorSettlementFeeDivisor()"></a><code class="function-signature">getMarketCreatorSettlementFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getForkingMarket()"></a><code class="function-signature">getForkingMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getEndTime()"></a><code class="function-signature">getEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getWinningPayoutDistributionHash()"></a><code class="function-signature">getWinningPayoutDistributionHash() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getWinningPayoutNumerator(uint256)"></a><code class="function-signature">getWinningPayoutNumerator(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getWinningReportingParticipant()"></a><code class="function-signature">getWinningReportingParticipant() <span class="return-arrow">→</span> <span class="return-type">contract IReportingParticipant</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getFinalizationTime()"></a><code class="function-signature">getFinalizationTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getInitialReporter()"></a><code class="function-signature">getInitialReporter() <span class="return-arrow">→</span> <span class="return-type">contract IInitialReporter</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getDesignatedReportingEndTime()"></a><code class="function-signature">getDesignatedReportingEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getValidityBondAttoCash()"></a><code class="function-signature">getValidityBondAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.affiliateFeeDivisor()"></a><code class="function-signature">affiliateFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getNumParticipants()"></a><code class="function-signature">getNumParticipants() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getDisputePacingOn()"></a><code class="function-signature">getDisputePacingOn() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.deriveMarketCreatorFeeAmount(uint256)"></a><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.recordMarketCreatorFees(uint256,address,bytes32)"></a><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _sourceAccount, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isContainerForReportingParticipant(contract IReportingParticipant)"></a><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isFinalizedAsInvalid()"></a><code class="function-signature">isFinalizedAsInvalid() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.finalize()"></a><code class="function-signature">finalize() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isFinalized()"></a><code class="function-signature">isFinalized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getOpenInterest()"></a><code class="function-signature">getOpenInterest() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IOrders`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOrders.saveOrder(uint256[],bytes32[],enum Order.Types,contract IMarket,address)"><code class="function-signature">saveOrder(uint256[] _uints, bytes32[] _bytes32s, enum Order.Types _type, contract IMarket _market, address _sender)</code></a></li><li><a href="#IOrders.removeOrder(bytes32)"><code class="function-signature">removeOrder(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getMarket(bytes32)"><code class="function-signature">getMarket(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderType(bytes32)"><code class="function-signature">getOrderType(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOutcome(bytes32)"><code class="function-signature">getOutcome(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getAmount(bytes32)"><code class="function-signature">getAmount(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getPrice(bytes32)"><code class="function-signature">getPrice(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderCreator(bytes32)"><code class="function-signature">getOrderCreator(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderSharesEscrowed(bytes32)"><code class="function-signature">getOrderSharesEscrowed(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderMoneyEscrowed(bytes32)"><code class="function-signature">getOrderMoneyEscrowed(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderDataForCancel(bytes32)"><code class="function-signature">getOrderDataForCancel(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderDataForLogs(bytes32)"><code class="function-signature">getOrderDataForLogs(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getBetterOrderId(bytes32)"><code class="function-signature">getBetterOrderId(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getWorseOrderId(bytes32)"><code class="function-signature">getWorseOrderId(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getBestOrderId(enum Order.Types,contract IMarket,uint256)"><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IOrders.getWorstOrderId(enum Order.Types,contract IMarket,uint256)"><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IOrders.getLastOutcomePrice(contract IMarket,uint256)"><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IOrders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256)"><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed)</code></a></li><li><a href="#IOrders.getTotalEscrowed(contract IMarket)"><code class="function-signature">getTotalEscrowed(contract IMarket _market)</code></a></li><li><a href="#IOrders.isBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#IOrders.isWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#IOrders.assertIsNotBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _betterOrderId)</code></a></li><li><a href="#IOrders.assertIsNotWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _worseOrderId)</code></a></li><li><a href="#IOrders.recordFillOrder(bytes32,uint256,uint256,uint256)"><code class="function-signature">recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill)</code></a></li><li><a href="#IOrders.setPrice(contract IMarket,uint256,uint256)"><code class="function-signature">setPrice(contract IMarket _market, uint256 _outcome, uint256 _price)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOrders.saveOrder(uint256[],bytes32[],enum Order.Types,contract IMarket,address)"></a><code class="function-signature">saveOrder(uint256[] _uints, bytes32[] _bytes32s, enum Order.Types _type, contract IMarket _market, address _sender) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.removeOrder(bytes32)"></a><code class="function-signature">removeOrder(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getMarket(bytes32)"></a><code class="function-signature">getMarket(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderType(bytes32)"></a><code class="function-signature">getOrderType(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOutcome(bytes32)"></a><code class="function-signature">getOutcome(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getAmount(bytes32)"></a><code class="function-signature">getAmount(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getPrice(bytes32)"></a><code class="function-signature">getPrice(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderCreator(bytes32)"></a><code class="function-signature">getOrderCreator(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderSharesEscrowed(bytes32)"></a><code class="function-signature">getOrderSharesEscrowed(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderMoneyEscrowed(bytes32)"></a><code class="function-signature">getOrderMoneyEscrowed(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderDataForCancel(bytes32)"></a><code class="function-signature">getOrderDataForCancel(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,enum Order.Types,contract IMarket,uint256,address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderDataForLogs(bytes32)"></a><code class="function-signature">getOrderDataForLogs(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types,address[],uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getBetterOrderId(bytes32)"></a><code class="function-signature">getBetterOrderId(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getWorseOrderId(bytes32)"></a><code class="function-signature">getWorseOrderId(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getBestOrderId(enum Order.Types,contract IMarket,uint256)"></a><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getWorstOrderId(enum Order.Types,contract IMarket,uint256)"></a><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getLastOutcomePrice(contract IMarket,uint256)"></a><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getTotalEscrowed(contract IMarket)"></a><code class="function-signature">getTotalEscrowed(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.isBetterPrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">isBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.isWorsePrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">isWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.assertIsNotBetterPrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">assertIsNotBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _betterOrderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.assertIsNotWorsePrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">assertIsNotWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _worseOrderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.recordFillOrder(bytes32,uint256,uint256,uint256)"></a><code class="function-signature">recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.setPrice(contract IMarket,uint256,uint256)"></a><code class="function-signature">setPrice(contract IMarket _market, uint256 _outcome, uint256 _price) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `IOwnable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOwnable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOwnable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IReportingParticipant`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li><a href="#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li><a href="#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li><a href="#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li><a href="#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li><a href="#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li><a href="#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li><a href="#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getStake()"></a><code class="function-signature">getStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getPayoutDistributionHash()"></a><code class="function-signature">getPayoutDistributionHash() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.liquidateLosing()"></a><code class="function-signature">liquidateLosing()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.redeem(address)"></a><code class="function-signature">redeem(address _redeemer) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.isDisavowed()"></a><code class="function-signature">isDisavowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getPayoutNumerator(uint256)"></a><code class="function-signature">getPayoutNumerator(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getPayoutNumerators()"></a><code class="function-signature">getPayoutNumerators() <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getMarket()"></a><code class="function-signature">getMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getSize()"></a><code class="function-signature">getSize() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li><a href="#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li><a href="#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="utility#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="utility#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="utility#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="utility#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="utility#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IReputationToken.migrateOutByPayout(uint256[],uint256)"></a><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReputationToken.migrateIn(address,uint256)"></a><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"></a><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReputationToken.trustedMarketTransfer(address,address,uint256)"></a><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReputationToken.trustedUniverseTransfer(address,address,uint256)"></a><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"></a><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReputationToken.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReputationToken.getTotalMigrated()"></a><code class="function-signature">getTotalMigrated() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReputationToken.getTotalTheoreticalSupply()"></a><code class="function-signature">getTotalTheoreticalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReputationToken.mintForReportingParticipant(uint256)"></a><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IShareToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IShareToken.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#IShareToken.initializeMarket(contract IMarket,uint256,uint256)"><code class="function-signature">initializeMarket(contract IMarket _market, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#IShareToken.unsafeTransferFrom(address,address,uint256,uint256)"><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code></a></li><li><a href="#IShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code></a></li><li><a href="#IShareToken.claimTradingProceeds(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#IShareToken.getMarket(uint256)"><code class="function-signature">getMarket(uint256 _tokenId)</code></a></li><li><a href="#IShareToken.getOutcome(uint256)"><code class="function-signature">getOutcome(uint256 _tokenId)</code></a></li><li><a href="#IShareToken.getTokenId(contract IMarket,uint256)"><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IShareToken.getTokenIds(contract IMarket,uint256[])"><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes)</code></a></li><li><a href="#IShareToken.buyCompleteSets(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#IShareToken.buyCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address)"><code class="function-signature">buyCompleteSetsForTrade(contract IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient)</code></a></li><li><a href="#IShareToken.sellCompleteSets(contract IMarket,address,address,uint256,bytes32)"><code class="function-signature">sellCompleteSets(contract IMarket _market, address _holder, address _recipient, uint256 _amount, bytes32 _fingerprint)</code></a></li><li><a href="#IShareToken.sellCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address,address,address,uint256,address,bytes32)"><code class="function-signature">sellCompleteSetsForTrade(contract IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#IShareToken.totalSupplyForMarketOutcome(contract IMarket,uint256)"><code class="function-signature">totalSupplyForMarketOutcome(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IShareToken.balanceOfMarketOutcome(contract IMarket,uint256,address)"><code class="function-signature">balanceOfMarketOutcome(contract IMarket _market, uint256 _outcome, address _account)</code></a></li><li><a href="#IShareToken.lowestBalanceOfMarketOutcomes(contract IMarket,uint256[],address)"><code class="function-signature">lowestBalanceOfMarketOutcomes(contract IMarket _market, uint256[] _outcomes, address _account)</code></a></li><li class="inherited"><a href="utility#IERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="utility#IERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="utility#IERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li class="inherited"><a href="utility#IERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address owner, address operator)</code></a></li><li class="inherited"><a href="utility#IERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address owner, uint256 id)</code></a></li><li class="inherited"><a href="utility#IERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li class="inherited"><a href="utility#IERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids)</code></a></li><li class="inherited"><a href="utility#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="utility#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="utility#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="utility#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="utility#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IShareToken.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.initializeMarket(contract IMarket,uint256,uint256)"></a><code class="function-signature">initializeMarket(contract IMarket _market, uint256 _numOutcomes, uint256 _numTicks)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.unsafeTransferFrom(address,address,uint256,uint256)"></a><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"></a><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.claimTradingProceeds(contract IMarket,address,bytes32)"></a><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.getMarket(uint256)"></a><code class="function-signature">getMarket(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.getOutcome(uint256)"></a><code class="function-signature">getOutcome(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.getTokenId(contract IMarket,uint256)"></a><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.getTokenIds(contract IMarket,uint256[])"></a><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.buyCompleteSets(contract IMarket,address,uint256)"></a><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.buyCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address)"></a><code class="function-signature">buyCompleteSetsForTrade(contract IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.sellCompleteSets(contract IMarket,address,address,uint256,bytes32)"></a><code class="function-signature">sellCompleteSets(contract IMarket _market, address _holder, address _recipient, uint256 _amount, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.sellCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address,address,address,uint256,address,bytes32)"></a><code class="function-signature">sellCompleteSetsForTrade(contract IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.totalSupplyForMarketOutcome(contract IMarket,uint256)"></a><code class="function-signature">totalSupplyForMarketOutcome(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.balanceOfMarketOutcome(contract IMarket,uint256,address)"></a><code class="function-signature">balanceOfMarketOutcome(contract IMarket _market, uint256 _outcome, address _account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.lowestBalanceOfMarketOutcomes(contract IMarket,uint256[],address)"></a><code class="function-signature">lowestBalanceOfMarketOutcomes(contract IMarket _market, uint256[] _outcomes, address _account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `ITime`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITime.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li class="inherited"><a href="#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITime.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







### `ITyped`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITyped.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







### `IUniswapV2Factory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniswapV2Factory.feeTo()"><code class="function-signature">feeTo()</code></a></li><li><a href="#IUniswapV2Factory.feeToSetter()"><code class="function-signature">feeToSetter()</code></a></li><li><a href="#IUniswapV2Factory.getPair(address,address)"><code class="function-signature">getPair(address tokenA, address tokenB)</code></a></li><li><a href="#IUniswapV2Factory.allPairs(uint256)"><code class="function-signature">allPairs(uint256)</code></a></li><li><a href="#IUniswapV2Factory.allPairsLength()"><code class="function-signature">allPairsLength()</code></a></li><li><a href="#IUniswapV2Factory.createPair(address,address)"><code class="function-signature">createPair(address tokenA, address tokenB)</code></a></li><li><a href="#IUniswapV2Factory.setFeeTo(address)"><code class="function-signature">setFeeTo(address)</code></a></li><li><a href="#IUniswapV2Factory.setFeeToSetter(address)"><code class="function-signature">setFeeToSetter(address)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IUniswapV2Factory.PairCreated(address,address,address,uint256)"><code class="function-signature">PairCreated(address token0, address token1, address pair, uint256)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.feeTo()"></a><code class="function-signature">feeTo() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.feeToSetter()"></a><code class="function-signature">feeToSetter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.getPair(address,address)"></a><code class="function-signature">getPair(address tokenA, address tokenB) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.allPairs(uint256)"></a><code class="function-signature">allPairs(uint256) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.allPairsLength()"></a><code class="function-signature">allPairsLength() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.createPair(address,address)"></a><code class="function-signature">createPair(address tokenA, address tokenB) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.setFeeTo(address)"></a><code class="function-signature">setFeeTo(address)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.setFeeToSetter(address)"></a><code class="function-signature">setFeeToSetter(address)</code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.PairCreated(address,address,address,uint256)"></a><code class="function-signature">PairCreated(address token0, address token1, address pair, uint256)</code><span class="function-visibility"></span></h4>





### `IUniswapV2Pair`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniswapV2Pair.name()"><code class="function-signature">name()</code></a></li><li><a href="#IUniswapV2Pair.symbol()"><code class="function-signature">symbol()</code></a></li><li><a href="#IUniswapV2Pair.decimals()"><code class="function-signature">decimals()</code></a></li><li><a href="#IUniswapV2Pair.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IUniswapV2Pair.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#IUniswapV2Pair.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li><a href="#IUniswapV2Pair.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li><a href="#IUniswapV2Pair.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 value)</code></a></li><li><a href="#IUniswapV2Pair.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 value)</code></a></li><li><a href="#IUniswapV2Pair.DOMAIN_SEPARATOR()"><code class="function-signature">DOMAIN_SEPARATOR()</code></a></li><li><a href="#IUniswapV2Pair.PERMIT_TYPEHASH()"><code class="function-signature">PERMIT_TYPEHASH()</code></a></li><li><a href="#IUniswapV2Pair.nonces(address)"><code class="function-signature">nonces(address owner)</code></a></li><li><a href="#IUniswapV2Pair.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"><code class="function-signature">permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)</code></a></li><li><a href="#IUniswapV2Pair.MINIMUM_LIQUIDITY()"><code class="function-signature">MINIMUM_LIQUIDITY()</code></a></li><li><a href="#IUniswapV2Pair.factory()"><code class="function-signature">factory()</code></a></li><li><a href="#IUniswapV2Pair.token0()"><code class="function-signature">token0()</code></a></li><li><a href="#IUniswapV2Pair.token1()"><code class="function-signature">token1()</code></a></li><li><a href="#IUniswapV2Pair.getReserves()"><code class="function-signature">getReserves()</code></a></li><li><a href="#IUniswapV2Pair.price0CumulativeLast()"><code class="function-signature">price0CumulativeLast()</code></a></li><li><a href="#IUniswapV2Pair.price1CumulativeLast()"><code class="function-signature">price1CumulativeLast()</code></a></li><li><a href="#IUniswapV2Pair.kLast()"><code class="function-signature">kLast()</code></a></li><li><a href="#IUniswapV2Pair.mint(address)"><code class="function-signature">mint(address to)</code></a></li><li><a href="#IUniswapV2Pair.burn(address)"><code class="function-signature">burn(address to)</code></a></li><li><a href="#IUniswapV2Pair.swap(uint256,uint256,address,bytes)"><code class="function-signature">swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)</code></a></li><li><a href="#IUniswapV2Pair.skim(address)"><code class="function-signature">skim(address to)</code></a></li><li><a href="#IUniswapV2Pair.sync()"><code class="function-signature">sync()</code></a></li><li><a href="#IUniswapV2Pair.initialize(address,address)"><code class="function-signature">initialize(address, address)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IUniswapV2Pair.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li><a href="#IUniswapV2Pair.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li><a href="#IUniswapV2Pair.Mint(address,uint256,uint256)"><code class="function-signature">Mint(address sender, uint256 amount0, uint256 amount1)</code></a></li><li><a href="#IUniswapV2Pair.Burn(address,uint256,uint256,address)"><code class="function-signature">Burn(address sender, uint256 amount0, uint256 amount1, address to)</code></a></li><li><a href="#IUniswapV2Pair.Swap(address,uint256,uint256,uint256,uint256,address)"><code class="function-signature">Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)</code></a></li><li><a href="#IUniswapV2Pair.Sync(uint112,uint112)"><code class="function-signature">Sync(uint112 reserve0, uint112 reserve1)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.name()"></a><code class="function-signature">name() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.symbol()"></a><code class="function-signature">symbol() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.decimals()"></a><code class="function-signature">decimals() <span class="return-arrow">→</span> <span class="return-type">uint8</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.allowance(address,address)"></a><code class="function-signature">allowance(address owner, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.DOMAIN_SEPARATOR()"></a><code class="function-signature">DOMAIN_SEPARATOR() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.PERMIT_TYPEHASH()"></a><code class="function-signature">PERMIT_TYPEHASH() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.nonces(address)"></a><code class="function-signature">nonces(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"></a><code class="function-signature">permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.MINIMUM_LIQUIDITY()"></a><code class="function-signature">MINIMUM_LIQUIDITY() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.factory()"></a><code class="function-signature">factory() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.token0()"></a><code class="function-signature">token0() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.token1()"></a><code class="function-signature">token1() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.getReserves()"></a><code class="function-signature">getReserves() <span class="return-arrow">→</span> <span class="return-type">uint112,uint112,uint32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.price0CumulativeLast()"></a><code class="function-signature">price0CumulativeLast() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.price1CumulativeLast()"></a><code class="function-signature">price1CumulativeLast() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.kLast()"></a><code class="function-signature">kLast() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.mint(address)"></a><code class="function-signature">mint(address to) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.burn(address)"></a><code class="function-signature">burn(address to) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.swap(uint256,uint256,address,bytes)"></a><code class="function-signature">swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.skim(address)"></a><code class="function-signature">skim(address to)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.sync()"></a><code class="function-signature">sync()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.initialize(address,address)"></a><code class="function-signature">initialize(address, address)</code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.Mint(address,uint256,uint256)"></a><code class="function-signature">Mint(address sender, uint256 amount0, uint256 amount1)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.Burn(address,uint256,uint256,address)"></a><code class="function-signature">Burn(address sender, uint256 amount0, uint256 amount1, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.Swap(address,uint256,uint256,uint256,uint256,address)"></a><code class="function-signature">Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Pair.Sync(uint112,uint112)"></a><code class="function-signature">Sync(uint112 reserve0, uint112 reserve1)</code><span class="function-visibility"></span></h4>





### `IUniverse`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniverse.creationTime()"><code class="function-signature">creationTime()</code></a></li><li><a href="#IUniverse.marketBalance(address)"><code class="function-signature">marketBalance(address)</code></a></li><li><a href="#IUniverse.fork()"><code class="function-signature">fork()</code></a></li><li><a href="#IUniverse.updateForkValues()"><code class="function-signature">updateForkValues()</code></a></li><li><a href="#IUniverse.getParentUniverse()"><code class="function-signature">getParentUniverse()</code></a></li><li><a href="#IUniverse.createChildUniverse(uint256[])"><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IUniverse.getChildUniverse(bytes32)"><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IUniverse.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IUniverse.getForkEndTime()"><code class="function-signature">getForkEndTime()</code></a></li><li><a href="#IUniverse.getForkReputationGoal()"><code class="function-signature">getForkReputationGoal()</code></a></li><li><a href="#IUniverse.getParentPayoutDistributionHash()"><code class="function-signature">getParentPayoutDistributionHash()</code></a></li><li><a href="#IUniverse.getDisputeRoundDurationInSeconds(bool)"><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateDisputeWindowByTimestamp(uint256,bool)"><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateCurrentDisputeWindow(bool)"><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateNextDisputeWindow(bool)"><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreatePreviousDisputeWindow(bool)"><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOpenInterestInAttoCash()"><code class="function-signature">getOpenInterestInAttoCash()</code></a></li><li><a href="#IUniverse.getTargetRepMarketCapInAttoCash()"><code class="function-signature">getTargetRepMarketCapInAttoCash()</code></a></li><li><a href="#IUniverse.getOrCacheValidityBond()"><code class="function-signature">getOrCacheValidityBond()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportStake()"><code class="function-signature">getOrCacheDesignatedReportStake()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportNoShowBond()"><code class="function-signature">getOrCacheDesignatedReportNoShowBond()</code></a></li><li><a href="#IUniverse.getOrCacheMarketRepBond()"><code class="function-signature">getOrCacheMarketRepBond()</code></a></li><li><a href="#IUniverse.getOrCacheReportingFeeDivisor()"><code class="function-signature">getOrCacheReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForFork()"><code class="function-signature">getDisputeThresholdForFork()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForDisputePacing()"><code class="function-signature">getDisputeThresholdForDisputePacing()</code></a></li><li><a href="#IUniverse.getInitialReportMinValue()"><code class="function-signature">getInitialReportMinValue()</code></a></li><li><a href="#IUniverse.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li><a href="#IUniverse.getReportingFeeDivisor()"><code class="function-signature">getReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IUniverse.getWinningChildPayoutNumerator(uint256)"><code class="function-signature">getWinningChildPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IUniverse.isOpenInterestCash(address)"><code class="function-signature">isOpenInterestCash(address)</code></a></li><li><a href="#IUniverse.isForkingMarket()"><code class="function-signature">isForkingMarket()</code></a></li><li><a href="#IUniverse.getCurrentDisputeWindow(bool)"><code class="function-signature">getCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getDisputeWindowStartTimeAndDuration(uint256,bool)"><code class="function-signature">getDisputeWindowStartTimeAndDuration(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#IUniverse.isParentOf(contract IUniverse)"><code class="function-signature">isParentOf(contract IUniverse _shadyChild)</code></a></li><li><a href="#IUniverse.updateTentativeWinningChildUniverse(bytes32)"><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.isContainerForDisputeWindow(contract IDisputeWindow)"><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForMarket(contract IMarket)"><code class="function-signature">isContainerForMarket(contract IMarket _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IUniverse.migrateMarketOut(contract IUniverse)"><code class="function-signature">migrateMarketOut(contract IUniverse _destinationUniverse)</code></a></li><li><a href="#IUniverse.migrateMarketIn(contract IMarket,uint256,uint256)"><code class="function-signature">migrateMarketIn(contract IMarket _market, uint256 _cashBalance, uint256 _marketOI)</code></a></li><li><a href="#IUniverse.decrementOpenInterest(uint256)"><code class="function-signature">decrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.decrementOpenInterestFromMarket(contract IMarket)"><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market)</code></a></li><li><a href="#IUniverse.incrementOpenInterest(uint256)"><code class="function-signature">incrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.getWinningChildUniverse()"><code class="function-signature">getWinningChildUniverse()</code></a></li><li><a href="#IUniverse.isForking()"><code class="function-signature">isForking()</code></a></li><li><a href="#IUniverse.deposit(address,uint256,address)"><code class="function-signature">deposit(address _sender, uint256 _amount, address _market)</code></a></li><li><a href="#IUniverse.withdraw(address,uint256,address)"><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market)</code></a></li><li><a href="#IUniverse.createScalarMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,int256[],uint256,string)"><code class="function-signature">createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] _prices, uint256 _numTicks, string _extraInfo)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniverse.creationTime()"></a><code class="function-signature">creationTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.marketBalance(address)"></a><code class="function-signature">marketBalance(address) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.fork()"></a><code class="function-signature">fork() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.updateForkValues()"></a><code class="function-signature">updateForkValues() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getParentUniverse()"></a><code class="function-signature">getParentUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.createChildUniverse(uint256[])"></a><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getChildUniverse(bytes32)"></a><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getForkingMarket()"></a><code class="function-signature">getForkingMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getForkEndTime()"></a><code class="function-signature">getForkEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getForkReputationGoal()"></a><code class="function-signature">getForkReputationGoal() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getParentPayoutDistributionHash()"></a><code class="function-signature">getParentPayoutDistributionHash() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getDisputeRoundDurationInSeconds(bool)"></a><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCreateDisputeWindowByTimestamp(uint256,bool)"></a><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCreateCurrentDisputeWindow(bool)"></a><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCreateNextDisputeWindow(bool)"></a><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCreatePreviousDisputeWindow(bool)"></a><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOpenInterestInAttoCash()"></a><code class="function-signature">getOpenInterestInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getTargetRepMarketCapInAttoCash()"></a><code class="function-signature">getTargetRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCacheValidityBond()"></a><code class="function-signature">getOrCacheValidityBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCacheDesignatedReportStake()"></a><code class="function-signature">getOrCacheDesignatedReportStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCacheDesignatedReportNoShowBond()"></a><code class="function-signature">getOrCacheDesignatedReportNoShowBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCacheMarketRepBond()"></a><code class="function-signature">getOrCacheMarketRepBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCacheReportingFeeDivisor()"></a><code class="function-signature">getOrCacheReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getDisputeThresholdForFork()"></a><code class="function-signature">getDisputeThresholdForFork() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getDisputeThresholdForDisputePacing()"></a><code class="function-signature">getDisputeThresholdForDisputePacing() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getInitialReportMinValue()"></a><code class="function-signature">getInitialReportMinValue() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getPayoutNumerators()"></a><code class="function-signature">getPayoutNumerators() <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getReportingFeeDivisor()"></a><code class="function-signature">getReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getPayoutNumerator(uint256)"></a><code class="function-signature">getPayoutNumerator(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getWinningChildPayoutNumerator(uint256)"></a><code class="function-signature">getWinningChildPayoutNumerator(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isOpenInterestCash(address)"></a><code class="function-signature">isOpenInterestCash(address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isForkingMarket()"></a><code class="function-signature">isForkingMarket() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getCurrentDisputeWindow(bool)"></a><code class="function-signature">getCurrentDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getDisputeWindowStartTimeAndDuration(uint256,bool)"></a><code class="function-signature">getDisputeWindowStartTimeAndDuration(uint256 _timestamp, bool _initial) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isParentOf(contract IUniverse)"></a><code class="function-signature">isParentOf(contract IUniverse _shadyChild) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.updateTentativeWinningChildUniverse(bytes32)"></a><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForDisputeWindow(contract IDisputeWindow)"></a><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyTarget) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForMarket(contract IMarket)"></a><code class="function-signature">isContainerForMarket(contract IMarket _shadyTarget) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForReportingParticipant(contract IReportingParticipant)"></a><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.migrateMarketOut(contract IUniverse)"></a><code class="function-signature">migrateMarketOut(contract IUniverse _destinationUniverse) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.migrateMarketIn(contract IMarket,uint256,uint256)"></a><code class="function-signature">migrateMarketIn(contract IMarket _market, uint256 _cashBalance, uint256 _marketOI) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.decrementOpenInterest(uint256)"></a><code class="function-signature">decrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.decrementOpenInterestFromMarket(contract IMarket)"></a><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.incrementOpenInterest(uint256)"></a><code class="function-signature">incrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getWinningChildUniverse()"></a><code class="function-signature">getWinningChildUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isForking()"></a><code class="function-signature">isForking() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.deposit(address,uint256,address)"></a><code class="function-signature">deposit(address _sender, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.withdraw(address,uint256,address)"></a><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.createScalarMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,int256[],uint256,string)"></a><code class="function-signature">createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] _prices, uint256 _numTicks, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>







### `IUniverseFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniverseFactory.createUniverse(contract IUniverse,bytes32,uint256[])"><code class="function-signature">createUniverse(contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniverseFactory.createUniverse(contract IUniverse,bytes32,uint256[])"></a><code class="function-signature">createUniverse(contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>







### `IV2ReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IV2ReputationToken.parentUniverse()"><code class="function-signature">parentUniverse()</code></a></li><li><a href="#IV2ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li><a href="#IV2ReputationToken.mintForWarpSync(uint256,address)"><code class="function-signature">mintForWarpSync(uint256 _amountToMint, address _target)</code></a></li><li><a href="#IV2ReputationToken.getLegacyRepToken()"><code class="function-signature">getLegacyRepToken()</code></a></li><li class="inherited"><a href="utility#IReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li class="inherited"><a href="utility#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li class="inherited"><a href="utility#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="utility#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="utility#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="utility#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="utility#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li class="inherited"><a href="utility#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li class="inherited"><a href="utility#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="utility#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="utility#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="utility#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="utility#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="utility#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="utility#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="utility#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.parentUniverse()"></a><code class="function-signature">parentUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.burnForMarket(uint256)"></a><code class="function-signature">burnForMarket(uint256 _amountToBurn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.mintForWarpSync(uint256,address)"></a><code class="function-signature">mintForWarpSync(uint256 _amountToMint, address _target) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.getLegacyRepToken()"></a><code class="function-signature">getLegacyRepToken() <span class="return-arrow">→</span> <span class="return-type">contract IERC20</span></code><span class="function-visibility">public</span></h4>







### `Initializable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Initializable.endInitialization()"></a><code class="function-signature">endInitialization()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Initializable.getInitialized()"></a><code class="function-signature">getInitialized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Order`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Order.create(contract IAugur,contract IAugurTrading,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32)"><code class="function-signature">create(contract IAugur _augur, contract IAugurTrading _augurTrading, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId)</code></a></li><li><a href="#Order.getOrderId(struct Order.Data,contract IOrders)"><code class="function-signature">getOrderId(struct Order.Data _orderData, contract IOrders _orders)</code></a></li><li><a href="#Order.calculateOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256)"><code class="function-signature">calculateOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed)</code></a></li><li><a href="#Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection)</code></a></li><li><a href="#Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection)</code></a></li><li><a href="#Order.saveOrder(struct Order.Data,bytes32,contract IOrders)"><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId, contract IOrders _orders)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Order.create(contract IAugur,contract IAugurTrading,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32)"></a><code class="function-signature">create(contract IAugur _augur, contract IAugurTrading _augurTrading, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId) <span class="return-arrow">→</span> <span class="return-type">struct Order.Data</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderId(struct Order.Data,contract IOrders)"></a><code class="function-signature">getOrderId(struct Order.Data _orderData, contract IOrders _orders) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.calculateOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calculateOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.saveOrder(struct Order.Data,bytes32,contract IOrders)"></a><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId, contract IOrders _orders) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>







### `Reporting`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Reporting.getDesignatedReportingDurationSeconds()"><code class="function-signature">getDesignatedReportingDurationSeconds()</code></a></li><li><a href="#Reporting.getInitialDisputeRoundDurationSeconds()"><code class="function-signature">getInitialDisputeRoundDurationSeconds()</code></a></li><li><a href="#Reporting.getDisputeWindowBufferSeconds()"><code class="function-signature">getDisputeWindowBufferSeconds()</code></a></li><li><a href="#Reporting.getDisputeRoundDurationSeconds()"><code class="function-signature">getDisputeRoundDurationSeconds()</code></a></li><li><a href="#Reporting.getForkDurationSeconds()"><code class="function-signature">getForkDurationSeconds()</code></a></li><li><a href="#Reporting.getBaseMarketDurationMaximum()"><code class="function-signature">getBaseMarketDurationMaximum()</code></a></li><li><a href="#Reporting.getUpgradeCadence()"><code class="function-signature">getUpgradeCadence()</code></a></li><li><a href="#Reporting.getInitialUpgradeTimestamp()"><code class="function-signature">getInitialUpgradeTimestamp()</code></a></li><li><a href="#Reporting.getDefaultValidityBond()"><code class="function-signature">getDefaultValidityBond()</code></a></li><li><a href="#Reporting.getValidityBondFloor()"><code class="function-signature">getValidityBondFloor()</code></a></li><li><a href="#Reporting.getTargetInvalidMarketsDivisor()"><code class="function-signature">getTargetInvalidMarketsDivisor()</code></a></li><li><a href="#Reporting.getTargetIncorrectDesignatedReportMarketsDivisor()"><code class="function-signature">getTargetIncorrectDesignatedReportMarketsDivisor()</code></a></li><li><a href="#Reporting.getTargetDesignatedReportNoShowsDivisor()"><code class="function-signature">getTargetDesignatedReportNoShowsDivisor()</code></a></li><li><a href="#Reporting.getTargetRepMarketCapMultiplier()"><code class="function-signature">getTargetRepMarketCapMultiplier()</code></a></li><li><a href="#Reporting.getMaximumReportingFeeDivisor()"><code class="function-signature">getMaximumReportingFeeDivisor()</code></a></li><li><a href="#Reporting.getMinimumReportingFeeDivisor()"><code class="function-signature">getMinimumReportingFeeDivisor()</code></a></li><li><a href="#Reporting.getDefaultReportingFeeDivisor()"><code class="function-signature">getDefaultReportingFeeDivisor()</code></a></li><li><a href="#Reporting.getInitialREPSupply()"><code class="function-signature">getInitialREPSupply()</code></a></li><li><a href="#Reporting.getAffiliateSourceCutDivisor()"><code class="function-signature">getAffiliateSourceCutDivisor()</code></a></li><li><a href="#Reporting.getForkThresholdDivisor()"><code class="function-signature">getForkThresholdDivisor()</code></a></li><li><a href="#Reporting.getMaximumDisputeRounds()"><code class="function-signature">getMaximumDisputeRounds()</code></a></li><li><a href="#Reporting.getMinimumSlowRounds()"><code class="function-signature">getMinimumSlowRounds()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Reporting.getDesignatedReportingDurationSeconds()"></a><code class="function-signature">getDesignatedReportingDurationSeconds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getInitialDisputeRoundDurationSeconds()"></a><code class="function-signature">getInitialDisputeRoundDurationSeconds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getDisputeWindowBufferSeconds()"></a><code class="function-signature">getDisputeWindowBufferSeconds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getDisputeRoundDurationSeconds()"></a><code class="function-signature">getDisputeRoundDurationSeconds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getForkDurationSeconds()"></a><code class="function-signature">getForkDurationSeconds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getBaseMarketDurationMaximum()"></a><code class="function-signature">getBaseMarketDurationMaximum() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getUpgradeCadence()"></a><code class="function-signature">getUpgradeCadence() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getInitialUpgradeTimestamp()"></a><code class="function-signature">getInitialUpgradeTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getDefaultValidityBond()"></a><code class="function-signature">getDefaultValidityBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getValidityBondFloor()"></a><code class="function-signature">getValidityBondFloor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getTargetInvalidMarketsDivisor()"></a><code class="function-signature">getTargetInvalidMarketsDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getTargetIncorrectDesignatedReportMarketsDivisor()"></a><code class="function-signature">getTargetIncorrectDesignatedReportMarketsDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getTargetDesignatedReportNoShowsDivisor()"></a><code class="function-signature">getTargetDesignatedReportNoShowsDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getTargetRepMarketCapMultiplier()"></a><code class="function-signature">getTargetRepMarketCapMultiplier() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getMaximumReportingFeeDivisor()"></a><code class="function-signature">getMaximumReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getMinimumReportingFeeDivisor()"></a><code class="function-signature">getMinimumReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getDefaultReportingFeeDivisor()"></a><code class="function-signature">getDefaultReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getInitialREPSupply()"></a><code class="function-signature">getInitialREPSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getAffiliateSourceCutDivisor()"></a><code class="function-signature">getAffiliateSourceCutDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getForkThresholdDivisor()"></a><code class="function-signature">getForkThresholdDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getMaximumDisputeRounds()"></a><code class="function-signature">getMaximumDisputeRounds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getMinimumSlowRounds()"></a><code class="function-signature">getMinimumSlowRounds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `SafeMathUint256`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMathUint256.mul(uint256,uint256)"><code class="function-signature">mul(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.div(uint256,uint256)"><code class="function-signature">div(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.sub(uint256,uint256)"><code class="function-signature">sub(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.add(uint256,uint256)"><code class="function-signature">add(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.min(uint256,uint256)"><code class="function-signature">min(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.max(uint256,uint256)"><code class="function-signature">max(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.sqrt(uint256)"><code class="function-signature">sqrt(uint256 y)</code></a></li><li><a href="#SafeMathUint256.getUint256Min()"><code class="function-signature">getUint256Min()</code></a></li><li><a href="#SafeMathUint256.getUint256Max()"><code class="function-signature">getUint256Max()</code></a></li><li><a href="#SafeMathUint256.isMultipleOf(uint256,uint256)"><code class="function-signature">isMultipleOf(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.fxpMul(uint256,uint256,uint256)"><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base)</code></a></li><li><a href="#SafeMathUint256.fxpDiv(uint256,uint256,uint256)"><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.mul(uint256,uint256)"></a><code class="function-signature">mul(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.div(uint256,uint256)"></a><code class="function-signature">div(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.add(uint256,uint256)"></a><code class="function-signature">add(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.min(uint256,uint256)"></a><code class="function-signature">min(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.max(uint256,uint256)"></a><code class="function-signature">max(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.sqrt(uint256)"></a><code class="function-signature">sqrt(uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Min()"></a><code class="function-signature">getUint256Min() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Max()"></a><code class="function-signature">getUint256Max() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.isMultipleOf(uint256,uint256)"></a><code class="function-signature">isMultipleOf(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpMul(uint256,uint256,uint256)"></a><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpDiv(uint256,uint256,uint256)"></a><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `AuditFunds`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#AuditFunds.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#AuditFunds.getAvailableShareData(address,uint256,uint256)"><code class="function-signature">getAvailableShareData(address _account, uint256 _offset, uint256 _num)</code></a></li><li><a href="#AuditFunds.getAvailableReports(address,uint256,uint256)"><code class="function-signature">getAvailableReports(address _account, uint256 _offset, uint256 _num)</code></a></li><li><a href="#AuditFunds.getAvailableDisputes(address,uint256,uint256)"><code class="function-signature">getAvailableDisputes(address _account, uint256 _offset, uint256 _num)</code></a></li><li><a href="#AuditFunds.addressFrom(address,uint256)"><code class="function-signature">addressFrom(address _origin, uint256 _nonce)</code></a></li><li class="inherited"><a href="utility#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="utility#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="AuditFunds.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AuditFunds.getAvailableShareData(address,uint256,uint256)"></a><code class="function-signature">getAvailableShareData(address _account, uint256 _offset, uint256 _num) <span class="return-arrow">→</span> <span class="return-type">struct AuditFunds.ShareData[],bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AuditFunds.getAvailableReports(address,uint256,uint256)"></a><code class="function-signature">getAvailableReports(address _account, uint256 _offset, uint256 _num) <span class="return-arrow">→</span> <span class="return-type">struct AuditFunds.StakeData[],bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AuditFunds.getAvailableDisputes(address,uint256,uint256)"></a><code class="function-signature">getAvailableDisputes(address _account, uint256 _offset, uint256 _num) <span class="return-arrow">→</span> <span class="return-type">struct AuditFunds.StakeData[],bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AuditFunds.addressFrom(address,uint256)"></a><code class="function-signature">addressFrom(address _origin, uint256 _nonce) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `BuyParticipationTokens`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BuyParticipationTokens.buyParticipationTokens(contract IUniverse,uint256)"><code class="function-signature">buyParticipationTokens(contract IUniverse _universe, uint256 _attotokens)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BuyParticipationTokens.buyParticipationTokens(contract IUniverse,uint256)"></a><code class="function-signature">buyParticipationTokens(contract IUniverse _universe, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Formulas`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Formulas.calculateValidityBond(contract IDisputeWindow,uint256)"><code class="function-signature">calculateValidityBond(contract IDisputeWindow _previousDisputeWindow, uint256 _previousValidityBondInAttoCash)</code></a></li><li><a href="#Formulas.calculateDesignatedReportStake(contract IDisputeWindow,uint256,uint256)"><code class="function-signature">calculateDesignatedReportStake(contract IDisputeWindow _previousDisputeWindow, uint256 _previousDesignatedReportStakeInAttoRep, uint256 _initialReportMinValue)</code></a></li><li><a href="#Formulas.calculateDesignatedReportNoShowBond(contract IDisputeWindow,uint256,uint256)"><code class="function-signature">calculateDesignatedReportNoShowBond(contract IDisputeWindow _previousDisputeWindow, uint256 _previousDesignatedReportNoShowBondInAttoRep, uint256 _initialReportMinValue)</code></a></li><li><a href="#Formulas.calculateFloatingValue(uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calculateFloatingValue(uint256 _totalBad, uint256 _total, uint256 _targetDivisor, uint256 _previousValue, uint256 _floor)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Formulas.calculateValidityBond(contract IDisputeWindow,uint256)"></a><code class="function-signature">calculateValidityBond(contract IDisputeWindow _previousDisputeWindow, uint256 _previousValidityBondInAttoCash) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Formulas.calculateDesignatedReportStake(contract IDisputeWindow,uint256,uint256)"></a><code class="function-signature">calculateDesignatedReportStake(contract IDisputeWindow _previousDisputeWindow, uint256 _previousDesignatedReportStakeInAttoRep, uint256 _initialReportMinValue) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Formulas.calculateDesignatedReportNoShowBond(contract IDisputeWindow,uint256,uint256)"></a><code class="function-signature">calculateDesignatedReportNoShowBond(contract IDisputeWindow _previousDisputeWindow, uint256 _previousDesignatedReportNoShowBondInAttoRep, uint256 _initialReportMinValue) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Formulas.calculateFloatingValue(uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calculateFloatingValue(uint256 _totalBad, uint256 _total, uint256 _targetDivisor, uint256 _previousValue, uint256 _floor) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `HotLoading`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#HotLoading.getMarketData(contract IAugur,contract IMarket,contract IFillOrder,contract IOrders)"><code class="function-signature">getMarketData(contract IAugur _augur, contract IMarket _market, contract IFillOrder _fillOrder, contract IOrders _orders)</code></a></li><li><a href="#HotLoading.getMarketsData(contract IAugur,contract IMarket[],contract IFillOrder,contract IOrders)"><code class="function-signature">getMarketsData(contract IAugur _augur, contract IMarket[] _markets, contract IFillOrder _fillOrder, contract IOrders _orders)</code></a></li><li><a href="#HotLoading.getLastTradedPrices(contract IMarket,uint256,contract IOrders)"><code class="function-signature">getLastTradedPrices(contract IMarket _market, uint256 _numOutcomes, contract IOrders _orders)</code></a></li><li><a href="#HotLoading.getReportingState(contract IAugur,contract IMarket)"><code class="function-signature">getReportingState(contract IAugur _augur, contract IMarket _market)</code></a></li><li><a href="#HotLoading.getCurrentDisputeWindowData(contract IAugur,contract IUniverse)"><code class="function-signature">getCurrentDisputeWindowData(contract IAugur _augur, contract IUniverse _universe)</code></a></li><li><a href="#HotLoading.getTotalValidityBonds(contract IMarket[])"><code class="function-signature">getTotalValidityBonds(contract IMarket[] _markets)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="HotLoading.getMarketData(contract IAugur,contract IMarket,contract IFillOrder,contract IOrders)"></a><code class="function-signature">getMarketData(contract IAugur _augur, contract IMarket _market, contract IFillOrder _fillOrder, contract IOrders _orders) <span class="return-arrow">→</span> <span class="return-type">struct HotLoading.MarketData</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="HotLoading.getMarketsData(contract IAugur,contract IMarket[],contract IFillOrder,contract IOrders)"></a><code class="function-signature">getMarketsData(contract IAugur _augur, contract IMarket[] _markets, contract IFillOrder _fillOrder, contract IOrders _orders) <span class="return-arrow">→</span> <span class="return-type">struct HotLoading.MarketData[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="HotLoading.getLastTradedPrices(contract IMarket,uint256,contract IOrders)"></a><code class="function-signature">getLastTradedPrices(contract IMarket _market, uint256 _numOutcomes, contract IOrders _orders) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="HotLoading.getReportingState(contract IAugur,contract IMarket)"></a><code class="function-signature">getReportingState(contract IAugur _augur, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">enum HotLoading.ReportingState</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="HotLoading.getCurrentDisputeWindowData(contract IAugur,contract IUniverse)"></a><code class="function-signature">getCurrentDisputeWindowData(contract IAugur _augur, contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">struct HotLoading.DisputeWindowData</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="HotLoading.getTotalValidityBonds(contract IMarket[])"></a><code class="function-signature">getTotalValidityBonds(contract IMarket[] _markets) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







### `IFillOrder`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IFillOrder.publicFillOrder(bytes32,uint256,bytes32,bytes32)"><code class="function-signature">publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, bytes32 _fingerprint)</code></a></li><li><a href="#IFillOrder.fillOrder(address,bytes32,uint256,bytes32,bytes32)"><code class="function-signature">fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 tradeGroupId, bytes32 _fingerprint)</code></a></li><li><a href="#IFillOrder.fillZeroXOrder(contract IMarket,uint256,uint256,enum Order.Types,address,uint256,bytes32,bytes32,address)"><code class="function-signature">fillZeroXOrder(contract IMarket _market, uint256 _outcome, uint256 _price, enum Order.Types _orderType, address _creator, uint256 _amount, bytes32 _fingerprint, bytes32 _tradeGroupId, address _filler)</code></a></li><li><a href="#IFillOrder.getMarketOutcomeValues(contract IMarket)"><code class="function-signature">getMarketOutcomeValues(contract IMarket _market)</code></a></li><li><a href="#IFillOrder.getMarketVolume(contract IMarket)"><code class="function-signature">getMarketVolume(contract IMarket _market)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IFillOrder.publicFillOrder(bytes32,uint256,bytes32,bytes32)"></a><code class="function-signature">publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFillOrder.fillOrder(address,bytes32,uint256,bytes32,bytes32)"></a><code class="function-signature">fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 tradeGroupId, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFillOrder.fillZeroXOrder(contract IMarket,uint256,uint256,enum Order.Types,address,uint256,bytes32,bytes32,address)"></a><code class="function-signature">fillZeroXOrder(contract IMarket _market, uint256 _outcome, uint256 _price, enum Order.Types _orderType, address _creator, uint256 _amount, bytes32 _fingerprint, bytes32 _tradeGroupId, address _filler) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFillOrder.getMarketOutcomeValues(contract IMarket)"></a><code class="function-signature">getMarketOutcomeValues(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFillOrder.getMarketVolume(contract IMarket)"></a><code class="function-signature">getMarketVolume(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `RedeemStake`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#RedeemStake.redeemStake(contract IReportingParticipant[],contract IDisputeWindow[])"><code class="function-signature">redeemStake(contract IReportingParticipant[] _reportingParticipants, contract IDisputeWindow[] _disputeWindows)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="RedeemStake.redeemStake(contract IReportingParticipant[],contract IDisputeWindow[])"></a><code class="function-signature">redeemStake(contract IReportingParticipant[] _reportingParticipants, contract IDisputeWindow[] _disputeWindows) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `BytesToString`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BytesToString.bytes32ToString(bytes32)"><code class="function-signature">bytes32ToString(bytes32 _bytes32)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BytesToString.bytes32ToString(bytes32)"></a><code class="function-signature">bytes32ToString(bytes32 _bytes32) <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">internal</span></h4>







### `IAugurMarketDataGetter`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugurMarketDataGetter.getMarketType(contract IMarket)"><code class="function-signature">getMarketType(contract IMarket _market)</code></a></li><li><a href="#IAugurMarketDataGetter.getMarketOutcomes(contract IMarket)"><code class="function-signature">getMarketOutcomes(contract IMarket _market)</code></a></li><li><a href="#IAugurMarketDataGetter.getMarketRecommendedTradeInterval(contract IMarket)"><code class="function-signature">getMarketRecommendedTradeInterval(contract IMarket _market)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAugurMarketDataGetter.getMarketType(contract IMarket)"></a><code class="function-signature">getMarketType(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">enum IMarket.MarketType</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurMarketDataGetter.getMarketOutcomes(contract IMarket)"></a><code class="function-signature">getMarketOutcomes(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bytes32[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurMarketDataGetter.getMarketRecommendedTradeInterval(contract IMarket)"></a><code class="function-signature">getMarketRecommendedTradeInterval(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IRepSymbol`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IRepSymbol.getRepSymbol(address,address)"><code class="function-signature">getRepSymbol(address _augur, address _universe)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IRepSymbol.getRepSymbol(address,address)"></a><code class="function-signature">getRepSymbol(address _augur, address _universe) <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>







### `RepSymbol`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#RepSymbol.getRepSymbol(address,address)"><code class="function-signature">getRepSymbol(address _augurAddress, address _universeAddress)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="RepSymbol.getRepSymbol(address,address)"></a><code class="function-signature">getRepSymbol(address _augurAddress, address _universeAddress) <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>







### `UintToString`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#UintToString.uint2str(uint256)"><code class="function-signature">uint2str(uint256 _i)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="UintToString.uint2str(uint256)"></a><code class="function-signature">uint2str(uint256 _i) <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">internal</span></h4>







</div>