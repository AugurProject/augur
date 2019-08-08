---
title: Contracts
---

<div class="contracts">

## Contracts

### `Augur`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Augur.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Augur.registerContract(bytes32,address)"><code class="function-signature">registerContract(bytes32 _key, address _address)</code></a></li><li><a href="#Augur.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#Augur.finishDeployment()"><code class="function-signature">finishDeployment()</code></a></li><li><a href="#Augur.createGenesisUniverse()"><code class="function-signature">createGenesisUniverse()</code></a></li><li><a href="#Augur.createChildUniverse(bytes32,uint256[])"><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#Augur.isKnownUniverse(contract IUniverse)"><code class="function-signature">isKnownUniverse(contract IUniverse _universe)</code></a></li><li><a href="#Augur.isKnownCrowdsourcer(contract IDisputeCrowdsourcer)"><code class="function-signature">isKnownCrowdsourcer(contract IDisputeCrowdsourcer _crowdsourcer)</code></a></li><li><a href="#Augur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256)"><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size)</code></a></li><li><a href="#Augur.isKnownShareToken(contract IShareToken)"><code class="function-signature">isKnownShareToken(contract IShareToken _token)</code></a></li><li><a href="#Augur.isKnownFeeSender(address)"><code class="function-signature">isKnownFeeSender(address _feeSender)</code></a></li><li><a href="#Augur.trustedTransfer(contract IERC20,address,address,uint256)"><code class="function-signature">trustedTransfer(contract IERC20 _token, address _from, address _to, uint256 _amount)</code></a></li><li><a href="#Augur.isTrustedSender(address)"><code class="function-signature">isTrustedSender(address _address)</code></a></li><li><a href="#Augur.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#Augur.isKnownMarket(contract IMarket)"><code class="function-signature">isKnownMarket(contract IMarket _market)</code></a></li><li><a href="#Augur.getMaximumMarketEndDate()"><code class="function-signature">getMaximumMarketEndDate()</code></a></li><li><a href="#Augur.derivePayoutDistributionHash(uint256[],uint256,uint256)"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 _numOutcomes)</code></a></li><li><a href="#Augur.logCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"><code class="function-signature">logCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, bytes32[] _outcomes)</code></a></li><li><a href="#Augur.logYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"><code class="function-signature">logYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor)</code></a></li><li><a href="#Augur.logScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"><code class="function-signature">logScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] _prices, uint256 _numTicks)</code></a></li><li><a href="#Augur.logInitialReportSubmitted(contract IUniverse,address,address,uint256,bool,uint256[],string)"><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string _description)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string)"><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string _description)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256,bool)"><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256 _nextWindowStartTime, bool _pacingOn)</code></a></li><li><a href="#Augur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#Augur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#Augur.logMarketParticipantsDisavowed(contract IUniverse)"><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe)</code></a></li><li><a href="#Augur.logMarketFinalized(contract IUniverse,uint256[])"><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators)</code></a></li><li><a href="#Augur.logMarketMigrated(contract IMarket,contract IUniverse)"><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse)</code></a></li><li><a href="#Augur.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId)</code></a></li><li><a href="#Augur.logOrderCreated(contract IUniverse,bytes32,bytes32)"><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#Augur.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#Augur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets)</code></a></li><li><a href="#Augur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees)</code></a></li><li><a href="#Augur.logMarketOIChanged(contract IUniverse,contract IMarket)"><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#Augur.getMarketOpenInterest(contract IMarket)"><code class="function-signature">getMarketOpenInterest(contract IMarket _market)</code></a></li><li><a href="#Augur.logTradingProceedsClaimed(contract IUniverse,address,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _shareToken, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _finalTokenBalance, uint256 _fees)</code></a></li><li><a href="#Augur.logUniverseForked(contract IMarket)"><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket)</code></a></li><li><a href="#Augur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#Augur.logShareTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logShareTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance, uint256 _outcome)</code></a></li><li><a href="#Augur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logShareTokensBurned(contract IUniverse,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logShareTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome)</code></a></li><li><a href="#Augur.logShareTokensMinted(contract IUniverse,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logShareTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logDisputeCrowdsourcerTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logDisputeWindowCreated(contract IDisputeWindow,uint256,bool)"><code class="function-signature">logDisputeWindowCreated(contract IDisputeWindow _disputeWindow, uint256 _id, bool _initial)</code></a></li><li><a href="#Augur.logParticipationTokensRedeemed(contract IUniverse,address,uint256,uint256)"><code class="function-signature">logParticipationTokensRedeemed(contract IUniverse _universe, address _account, uint256 _attoParticipationTokens, uint256 _feePayoutShare)</code></a></li><li><a href="#Augur.logTimestampSet(uint256)"><code class="function-signature">logTimestampSet(uint256 _newTimestamp)</code></a></li><li><a href="#Augur.logInitialReporterTransferred(contract IUniverse,contract IMarket,address,address)"><code class="function-signature">logInitialReporterTransferred(contract IUniverse _universe, contract IMarket _market, address _from, address _to)</code></a></li><li><a href="#Augur.logMarketTransferred(contract IUniverse,address,address)"><code class="function-signature">logMarketTransferred(contract IUniverse _universe, address _from, address _to)</code></a></li><li><a href="#Augur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#Augur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#Augur.logOrderPriceChanged(contract IUniverse,bytes32)"><code class="function-signature">logOrderPriceChanged(contract IUniverse _universe, bytes32 _orderId)</code></a></li><li><a href="#Augur.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[])"><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes)</code></a></li><li><a href="#Augur.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#Augur.MarketCreated(contract IUniverse,uint256,string,contract IMarket,address,address,uint256,int256[],enum IMarket.MarketType,uint256,bytes32[],uint256)"><code class="function-signature">MarketCreated(contract IUniverse universe, uint256 endTime, string extraInfo, contract IMarket market, address marketCreator, address designatedReporter, uint256 feeDivisor, int256[] prices, enum IMarket.MarketType marketType, uint256 numTicks, bytes32[] outcomes, uint256 timestamp)</code></a></li><li><a href="#Augur.InitialReportSubmitted(address,address,address,uint256,bool,uint256[],string,uint256)"><code class="function-signature">InitialReportSubmitted(address universe, address reporter, address market, uint256 amountStaked, bool isDesignatedReporter, uint256[] payoutNumerators, string description, uint256 timestamp)</code></a></li><li><a href="#Augur.DisputeCrowdsourcerCreated(address,address,address,uint256[],uint256)"><code class="function-signature">DisputeCrowdsourcerCreated(address universe, address market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 size)</code></a></li><li><a href="#Augur.DisputeCrowdsourcerContribution(address,address,address,address,uint256,string,uint256)"><code class="function-signature">DisputeCrowdsourcerContribution(address universe, address reporter, address market, address disputeCrowdsourcer, uint256 amountStaked, string description, uint256 timestamp)</code></a></li><li><a href="#Augur.DisputeCrowdsourcerCompleted(address,address,address,uint256,bool)"><code class="function-signature">DisputeCrowdsourcerCompleted(address universe, address market, address disputeCrowdsourcer, uint256 nextWindowStartTime, bool pacingOn)</code></a></li><li><a href="#Augur.InitialReporterRedeemed(address,address,address,uint256,uint256,uint256[],uint256)"><code class="function-signature">InitialReporterRedeemed(address universe, address reporter, address market, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp)</code></a></li><li><a href="#Augur.DisputeCrowdsourcerRedeemed(address,address,address,address,uint256,uint256,uint256[],uint256)"><code class="function-signature">DisputeCrowdsourcerRedeemed(address universe, address reporter, address market, address disputeCrowdsourcer, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp)</code></a></li><li><a href="#Augur.ReportingParticipantDisavowed(address,address,address)"><code class="function-signature">ReportingParticipantDisavowed(address universe, address market, address reportingParticipant)</code></a></li><li><a href="#Augur.MarketParticipantsDisavowed(address,address)"><code class="function-signature">MarketParticipantsDisavowed(address universe, address market)</code></a></li><li><a href="#Augur.MarketFinalized(address,address,uint256,uint256[])"><code class="function-signature">MarketFinalized(address universe, address market, uint256 timestamp, uint256[] winningPayoutNumerators)</code></a></li><li><a href="#Augur.MarketMigrated(address,address,address)"><code class="function-signature">MarketMigrated(address market, address originalUniverse, address newUniverse)</code></a></li><li><a href="#Augur.UniverseForked(address,contract IMarket)"><code class="function-signature">UniverseForked(address universe, contract IMarket forkingMarket)</code></a></li><li><a href="#Augur.UniverseCreated(address,address,uint256[])"><code class="function-signature">UniverseCreated(address parentUniverse, address childUniverse, uint256[] payoutNumerators)</code></a></li><li><a href="#Augur.OrderEvent(address,address,enum Augur.OrderEventType,enum Order.Types,bytes32,bytes32,address[],uint256[])"><code class="function-signature">OrderEvent(address universe, address market, enum Augur.OrderEventType eventType, enum Order.Types orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data)</code></a></li><li><a href="#Augur.CompleteSetsPurchased(address,address,address,uint256,uint256)"><code class="function-signature">CompleteSetsPurchased(address universe, address market, address account, uint256 numCompleteSets, uint256 timestamp)</code></a></li><li><a href="#Augur.CompleteSetsSold(address,address,address,uint256,uint256,uint256)"><code class="function-signature">CompleteSetsSold(address universe, address market, address account, uint256 numCompleteSets, uint256 fees, uint256 timestamp)</code></a></li><li><a href="#Augur.TradingProceedsClaimed(address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">TradingProceedsClaimed(address universe, address shareToken, address sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance, uint256 fees, uint256 timestamp)</code></a></li><li><a href="#Augur.TokensTransferred(address,address,address,address,uint256,enum Augur.TokenType,address)"><code class="function-signature">TokensTransferred(address universe, address token, address from, address to, uint256 value, enum Augur.TokenType tokenType, address market)</code></a></li><li><a href="#Augur.TokensMinted(address,address,address,uint256,enum Augur.TokenType,address,uint256)"><code class="function-signature">TokensMinted(address universe, address token, address target, uint256 amount, enum Augur.TokenType tokenType, address market, uint256 totalSupply)</code></a></li><li><a href="#Augur.TokensBurned(address,address,address,uint256,enum Augur.TokenType,address,uint256)"><code class="function-signature">TokensBurned(address universe, address token, address target, uint256 amount, enum Augur.TokenType tokenType, address market, uint256 totalSupply)</code></a></li><li><a href="#Augur.TokenBalanceChanged(address,address,address,enum Augur.TokenType,address,uint256,uint256)"><code class="function-signature">TokenBalanceChanged(address universe, address owner, address token, enum Augur.TokenType tokenType, address market, uint256 balance, uint256 outcome)</code></a></li><li><a href="#Augur.DisputeWindowCreated(address,address,uint256,uint256,uint256,bool)"><code class="function-signature">DisputeWindowCreated(address universe, address disputeWindow, uint256 startTime, uint256 endTime, uint256 id, bool initial)</code></a></li><li><a href="#Augur.InitialReporterTransferred(address,address,address,address)"><code class="function-signature">InitialReporterTransferred(address universe, address market, address from, address to)</code></a></li><li><a href="#Augur.MarketTransferred(address,address,address,address)"><code class="function-signature">MarketTransferred(address universe, address market, address from, address to)</code></a></li><li><a href="#Augur.MarketVolumeChanged(address,address,uint256,uint256[])"><code class="function-signature">MarketVolumeChanged(address universe, address market, uint256 volume, uint256[] outcomeVolumes)</code></a></li><li><a href="#Augur.MarketOIChanged(address,address,uint256)"><code class="function-signature">MarketOIChanged(address universe, address market, uint256 marketOI)</code></a></li><li><a href="#Augur.ProfitLossChanged(address,address,address,uint256,int256,uint256,int256,int256,int256,uint256)"><code class="function-signature">ProfitLossChanged(address universe, address market, address account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp)</code></a></li><li><a href="#Augur.ParticipationTokensRedeemed(address,address,address,uint256,uint256,uint256)"><code class="function-signature">ParticipationTokensRedeemed(address universe, address disputeWindow, address account, uint256 attoParticipationTokens, uint256 feePayoutShare, uint256 timestamp)</code></a></li><li><a href="#Augur.TimestampSet(uint256)"><code class="function-signature">TimestampSet(uint256 newTimestamp)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Augur.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.registerContract(bytes32,address)"></a><code class="function-signature">registerContract(bytes32 _key, address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.finishDeployment()"></a><code class="function-signature">finishDeployment() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.createGenesisUniverse()"></a><code class="function-signature">createGenesisUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.createChildUniverse(bytes32,uint256[])"></a><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isKnownUniverse(contract IUniverse)"></a><code class="function-signature">isKnownUniverse(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isKnownCrowdsourcer(contract IDisputeCrowdsourcer)"></a><code class="function-signature">isKnownCrowdsourcer(contract IDisputeCrowdsourcer _crowdsourcer) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256)"></a><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isKnownShareToken(contract IShareToken)"></a><code class="function-signature">isKnownShareToken(contract IShareToken _token) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isKnownFeeSender(address)"></a><code class="function-signature">isKnownFeeSender(address _feeSender) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.trustedTransfer(contract IERC20,address,address,uint256)"></a><code class="function-signature">trustedTransfer(contract IERC20 _token, address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isTrustedSender(address)"></a><code class="function-signature">isTrustedSender(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.isKnownMarket(contract IMarket)"></a><code class="function-signature">isKnownMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getMaximumMarketEndDate()"></a><code class="function-signature">getMaximumMarketEndDate() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.derivePayoutDistributionHash(uint256[],uint256,uint256)"></a><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 _numOutcomes) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"></a><code class="function-signature">logCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, bytes32[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"></a><code class="function-signature">logYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"></a><code class="function-signature">logScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] _prices, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logInitialReportSubmitted(contract IUniverse,address,address,uint256,bool,uint256[],string)"></a><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string _description) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string)"></a><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string _description) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256,bool)"></a><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256 _nextWindowStartTime, bool _pacingOn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"></a><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"></a><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"></a><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketParticipantsDisavowed(contract IUniverse)"></a><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketFinalized(contract IUniverse,uint256[])"></a><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketMigrated(contract IMarket,contract IUniverse)"></a><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"></a><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logOrderCreated(contract IUniverse,bytes32,bytes32)"></a><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"></a><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"></a><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"></a><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketOIChanged(contract IUniverse,contract IMarket)"></a><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.getMarketOpenInterest(contract IMarket)"></a><code class="function-signature">getMarketOpenInterest(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logTradingProceedsClaimed(contract IUniverse,address,address,address,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _shareToken, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _finalTokenBalance, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logUniverseForked(contract IMarket)"></a><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logShareTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logShareTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logShareTokensBurned(contract IUniverse,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logShareTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logShareTokensMinted(contract IUniverse,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logShareTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





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





<h4><a class="anchor" aria-hidden="true" id="Augur.logOrderPriceChanged(contract IUniverse,bytes32)"></a><code class="function-signature">logOrderPriceChanged(contract IUniverse _universe, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[])"></a><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"></a><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="Augur.MarketCreated(contract IUniverse,uint256,string,contract IMarket,address,address,uint256,int256[],enum IMarket.MarketType,uint256,bytes32[],uint256)"></a><code class="function-signature">MarketCreated(contract IUniverse universe, uint256 endTime, string extraInfo, contract IMarket market, address marketCreator, address designatedReporter, uint256 feeDivisor, int256[] prices, enum IMarket.MarketType marketType, uint256 numTicks, bytes32[] outcomes, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.InitialReportSubmitted(address,address,address,uint256,bool,uint256[],string,uint256)"></a><code class="function-signature">InitialReportSubmitted(address universe, address reporter, address market, uint256 amountStaked, bool isDesignatedReporter, uint256[] payoutNumerators, string description, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeCrowdsourcerCreated(address,address,address,uint256[],uint256)"></a><code class="function-signature">DisputeCrowdsourcerCreated(address universe, address market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 size)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeCrowdsourcerContribution(address,address,address,address,uint256,string,uint256)"></a><code class="function-signature">DisputeCrowdsourcerContribution(address universe, address reporter, address market, address disputeCrowdsourcer, uint256 amountStaked, string description, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeCrowdsourcerCompleted(address,address,address,uint256,bool)"></a><code class="function-signature">DisputeCrowdsourcerCompleted(address universe, address market, address disputeCrowdsourcer, uint256 nextWindowStartTime, bool pacingOn)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.InitialReporterRedeemed(address,address,address,uint256,uint256,uint256[],uint256)"></a><code class="function-signature">InitialReporterRedeemed(address universe, address reporter, address market, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeCrowdsourcerRedeemed(address,address,address,address,uint256,uint256,uint256[],uint256)"></a><code class="function-signature">DisputeCrowdsourcerRedeemed(address universe, address reporter, address market, address disputeCrowdsourcer, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.ReportingParticipantDisavowed(address,address,address)"></a><code class="function-signature">ReportingParticipantDisavowed(address universe, address market, address reportingParticipant)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketParticipantsDisavowed(address,address)"></a><code class="function-signature">MarketParticipantsDisavowed(address universe, address market)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketFinalized(address,address,uint256,uint256[])"></a><code class="function-signature">MarketFinalized(address universe, address market, uint256 timestamp, uint256[] winningPayoutNumerators)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketMigrated(address,address,address)"></a><code class="function-signature">MarketMigrated(address market, address originalUniverse, address newUniverse)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.UniverseForked(address,contract IMarket)"></a><code class="function-signature">UniverseForked(address universe, contract IMarket forkingMarket)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.UniverseCreated(address,address,uint256[])"></a><code class="function-signature">UniverseCreated(address parentUniverse, address childUniverse, uint256[] payoutNumerators)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.OrderEvent(address,address,enum Augur.OrderEventType,enum Order.Types,bytes32,bytes32,address[],uint256[])"></a><code class="function-signature">OrderEvent(address universe, address market, enum Augur.OrderEventType eventType, enum Order.Types orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.CompleteSetsPurchased(address,address,address,uint256,uint256)"></a><code class="function-signature">CompleteSetsPurchased(address universe, address market, address account, uint256 numCompleteSets, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.CompleteSetsSold(address,address,address,uint256,uint256,uint256)"></a><code class="function-signature">CompleteSetsSold(address universe, address market, address account, uint256 numCompleteSets, uint256 fees, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TradingProceedsClaimed(address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">TradingProceedsClaimed(address universe, address shareToken, address sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance, uint256 fees, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TokensTransferred(address,address,address,address,uint256,enum Augur.TokenType,address)"></a><code class="function-signature">TokensTransferred(address universe, address token, address from, address to, uint256 value, enum Augur.TokenType tokenType, address market)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TokensMinted(address,address,address,uint256,enum Augur.TokenType,address,uint256)"></a><code class="function-signature">TokensMinted(address universe, address token, address target, uint256 amount, enum Augur.TokenType tokenType, address market, uint256 totalSupply)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TokensBurned(address,address,address,uint256,enum Augur.TokenType,address,uint256)"></a><code class="function-signature">TokensBurned(address universe, address token, address target, uint256 amount, enum Augur.TokenType tokenType, address market, uint256 totalSupply)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TokenBalanceChanged(address,address,address,enum Augur.TokenType,address,uint256,uint256)"></a><code class="function-signature">TokenBalanceChanged(address universe, address owner, address token, enum Augur.TokenType tokenType, address market, uint256 balance, uint256 outcome)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.DisputeWindowCreated(address,address,uint256,uint256,uint256,bool)"></a><code class="function-signature">DisputeWindowCreated(address universe, address disputeWindow, uint256 startTime, uint256 endTime, uint256 id, bool initial)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.InitialReporterTransferred(address,address,address,address)"></a><code class="function-signature">InitialReporterTransferred(address universe, address market, address from, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketTransferred(address,address,address,address)"></a><code class="function-signature">MarketTransferred(address universe, address market, address from, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketVolumeChanged(address,address,uint256,uint256[])"></a><code class="function-signature">MarketVolumeChanged(address universe, address market, uint256 volume, uint256[] outcomeVolumes)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.MarketOIChanged(address,address,uint256)"></a><code class="function-signature">MarketOIChanged(address universe, address market, uint256 marketOI)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.ProfitLossChanged(address,address,address,uint256,int256,uint256,int256,int256,int256,uint256)"></a><code class="function-signature">ProfitLossChanged(address universe, address market, address account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.ParticipationTokensRedeemed(address,address,address,uint256,uint256,uint256)"></a><code class="function-signature">ParticipationTokensRedeemed(address universe, address disputeWindow, address account, uint256 attoParticipationTokens, uint256 feePayoutShare, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Augur.TimestampSet(uint256)"></a><code class="function-signature">TimestampSet(uint256 newTimestamp)</code><span class="function-visibility"></span></h4>





### `ContractExists`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ContractExists.exists(address)"><code class="function-signature">exists(address _address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ContractExists.exists(address)"></a><code class="function-signature">exists(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `IAugur`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugur.createChildUniverse(bytes32,uint256[])"><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IAugur.isKnownUniverse(contract IUniverse)"><code class="function-signature">isKnownUniverse(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.trustedTransfer(contract IERC20,address,address,uint256)"><code class="function-signature">trustedTransfer(contract IERC20 _token, address _from, address _to, uint256 _amount)</code></a></li><li><a href="#IAugur.isTrustedSender(address)"><code class="function-signature">isTrustedSender(address _address)</code></a></li><li><a href="#IAugur.logCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"><code class="function-signature">logCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, bytes32[] _outcomes)</code></a></li><li><a href="#IAugur.logYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"><code class="function-signature">logYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor)</code></a></li><li><a href="#IAugur.logScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"><code class="function-signature">logScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] _prices, uint256 _numTicks)</code></a></li><li><a href="#IAugur.logInitialReportSubmitted(contract IUniverse,address,address,uint256,bool,uint256[],string)"><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string description)</code></a></li><li><a href="#IAugur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256)"><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string)"><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string description)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256,bool)"><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256 _nextWindowStartTime, bool _pacingOn)</code></a></li><li><a href="#IAugur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logMarketFinalized(contract IUniverse,uint256[])"><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators)</code></a></li><li><a href="#IAugur.logMarketMigrated(contract IMarket,contract IUniverse)"><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse)</code></a></li><li><a href="#IAugur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IAugur.logMarketParticipantsDisavowed(contract IUniverse)"><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId)</code></a></li><li><a href="#IAugur.logOrderCreated(contract IUniverse,bytes32,bytes32)"><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#IAugur.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#IAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets)</code></a></li><li><a href="#IAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees)</code></a></li><li><a href="#IAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IAugur.logTradingProceedsClaimed(contract IUniverse,address,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _shareToken, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _finalTokenBalance, uint256 _fees)</code></a></li><li><a href="#IAugur.logUniverseForked(contract IMarket)"><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket)</code></a></li><li><a href="#IAugur.logShareTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logShareTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance, uint256 _outcome)</code></a></li><li><a href="#IAugur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logShareTokensBurned(contract IUniverse,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logShareTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome)</code></a></li><li><a href="#IAugur.logShareTokensMinted(contract IUniverse,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logShareTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeWindowCreated(contract IDisputeWindow,uint256,bool)"><code class="function-signature">logDisputeWindowCreated(contract IDisputeWindow _disputeWindow, uint256 _id, bool _initial)</code></a></li><li><a href="#IAugur.logParticipationTokensRedeemed(contract IUniverse,address,uint256,uint256)"><code class="function-signature">logParticipationTokensRedeemed(contract IUniverse universe, address _sender, uint256 _attoParticipationTokens, uint256 _feePayoutShare)</code></a></li><li><a href="#IAugur.logTimestampSet(uint256)"><code class="function-signature">logTimestampSet(uint256 _newTimestamp)</code></a></li><li><a href="#IAugur.logInitialReporterTransferred(contract IUniverse,contract IMarket,address,address)"><code class="function-signature">logInitialReporterTransferred(contract IUniverse _universe, contract IMarket _market, address _from, address _to)</code></a></li><li><a href="#IAugur.logMarketTransferred(contract IUniverse,address,address)"><code class="function-signature">logMarketTransferred(contract IUniverse _universe, address _from, address _to)</code></a></li><li><a href="#IAugur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logOrderPriceChanged(contract IUniverse,bytes32)"><code class="function-signature">logOrderPriceChanged(contract IUniverse _universe, bytes32 _orderId)</code></a></li><li><a href="#IAugur.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[])"><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes)</code></a></li><li><a href="#IAugur.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost)</code></a></li><li><a href="#IAugur.isKnownFeeSender(address)"><code class="function-signature">isKnownFeeSender(address _feeSender)</code></a></li><li><a href="#IAugur.isKnownShareToken(contract IShareToken)"><code class="function-signature">isKnownShareToken(contract IShareToken _token)</code></a></li><li><a href="#IAugur.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#IAugur.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#IAugur.getMaximumMarketEndDate()"><code class="function-signature">getMaximumMarketEndDate()</code></a></li><li><a href="#IAugur.isKnownMarket(contract IMarket)"><code class="function-signature">isKnownMarket(contract IMarket _market)</code></a></li><li><a href="#IAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 numOutcomes)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAugur.createChildUniverse(bytes32,uint256[])"></a><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownUniverse(contract IUniverse)"></a><code class="function-signature">isKnownUniverse(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.trustedTransfer(contract IERC20,address,address,uint256)"></a><code class="function-signature">trustedTransfer(contract IERC20 _token, address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isTrustedSender(address)"></a><code class="function-signature">isTrustedSender(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"></a><code class="function-signature">logCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, bytes32[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"></a><code class="function-signature">logYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"></a><code class="function-signature">logScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] _prices, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logInitialReportSubmitted(contract IUniverse,address,address,uint256,bool,uint256[],string)"></a><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string description) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256)"></a><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string)"></a><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string description) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256,bool)"></a><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256 _nextWindowStartTime, bool _pacingOn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"></a><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"></a><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketFinalized(contract IUniverse,uint256[])"></a><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketMigrated(contract IMarket,contract IUniverse)"></a><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"></a><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketParticipantsDisavowed(contract IUniverse)"></a><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"></a><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logOrderCreated(contract IUniverse,bytes32,bytes32)"></a><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"></a><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"></a><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"></a><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"></a><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logTradingProceedsClaimed(contract IUniverse,address,address,address,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _shareToken, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _finalTokenBalance, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logUniverseForked(contract IMarket)"></a><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logShareTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logShareTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logShareTokensBurned(contract IUniverse,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logShareTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logShareTokensMinted(contract IUniverse,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logShareTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





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





<h4><a class="anchor" aria-hidden="true" id="IAugur.logOrderPriceChanged(contract IUniverse,bytes32)"></a><code class="function-signature">logOrderPriceChanged(contract IUniverse _universe, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[])"></a><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"></a><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownFeeSender(address)"></a><code class="function-signature">isKnownFeeSender(address _feeSender) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownShareToken(contract IShareToken)"></a><code class="function-signature">isKnownShareToken(contract IShareToken _token) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.getMaximumMarketEndDate()"></a><code class="function-signature">getMaximumMarketEndDate() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownMarket(contract IMarket)"></a><code class="function-signature">isKnownMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"></a><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 numOutcomes) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







### `ICash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ICash.joinMint(address,uint256)"><code class="function-signature">joinMint(address usr, uint256 wad)</code></a></li><li><a href="#ICash.joinBurn(address,uint256)"><code class="function-signature">joinBurn(address usr, uint256 wad)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ICash.joinMint(address,uint256)"></a><code class="function-signature">joinMint(address usr, uint256 wad) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ICash.joinBurn(address,uint256)"></a><code class="function-signature">joinBurn(address usr, uint256 wad) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IDisputeCrowdsourcer`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, address _erc1820RegistryAddress)</code></a></li><li><a href="#IDisputeCrowdsourcer.contribute(address,uint256,bool)"><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload)</code></a></li><li><a href="#IDisputeCrowdsourcer.setSize(uint256)"><code class="function-signature">setSize(uint256 _size)</code></a></li><li><a href="#IDisputeCrowdsourcer.getRemainingToFill()"><code class="function-signature">getRemainingToFill()</code></a></li><li><a href="#IDisputeCrowdsourcer.correctSize()"><code class="function-signature">correctSize()</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li class="inherited"><a href="#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, address _erc1820RegistryAddress)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.contribute(address,uint256,bool)"></a><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.setSize(uint256)"></a><code class="function-signature">setSize(uint256 _size)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.getRemainingToFill()"></a><code class="function-signature">getRemainingToFill() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.correctSize()"></a><code class="function-signature">correctSize() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IDisputeWindow`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,uint256,uint256,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, uint256 _duration, uint256 _startTime, address _erc1820RegistryAddress)</code></a></li><li><a href="#IDisputeWindow.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IDisputeWindow.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IDisputeWindow.getStartTime()"><code class="function-signature">getStartTime()</code></a></li><li><a href="#IDisputeWindow.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IDisputeWindow.getWindowId()"><code class="function-signature">getWindowId()</code></a></li><li><a href="#IDisputeWindow.isActive()"><code class="function-signature">isActive()</code></a></li><li><a href="#IDisputeWindow.isOver()"><code class="function-signature">isOver()</code></a></li><li><a href="#IDisputeWindow.onMarketFinalized()"><code class="function-signature">onMarketFinalized()</code></a></li><li><a href="#IDisputeWindow.redeem(address)"><code class="function-signature">redeem(address _account)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,uint256,uint256,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, uint256 _duration, uint256 _startTime, address _erc1820RegistryAddress)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getStartTime()"></a><code class="function-signature">getStartTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getEndTime()"></a><code class="function-signature">getEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getWindowId()"></a><code class="function-signature">getWindowId() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.isActive()"></a><code class="function-signature">isActive() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.isOver()"></a><code class="function-signature">isOver() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.onMarketFinalized()"></a><code class="function-signature">onMarketFinalized()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.redeem(address)"></a><code class="function-signature">redeem(address _account) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IERC20`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC20.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.allowance(address,address)"></a><code class="function-signature">allowance(address owner, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IERC20.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





### `IInitialReporter`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IInitialReporter.initialize(contract IAugur,contract IMarket,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.report(address,bytes32,uint256[],uint256)"><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code></a></li><li><a href="#IInitialReporter.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#IInitialReporter.designatedReporterWasCorrect()"><code class="function-signature">designatedReporterWasCorrect()</code></a></li><li><a href="#IInitialReporter.getDesignatedReporter()"><code class="function-signature">getDesignatedReporter()</code></a></li><li><a href="#IInitialReporter.getReportTimestamp()"><code class="function-signature">getReportTimestamp()</code></a></li><li><a href="#IInitialReporter.migrateToNewUniverse(address)"><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.returnRepFromDisavow()"><code class="function-signature">returnRepFromDisavow()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li class="inherited"><a href="#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.initialize(contract IAugur,contract IMarket,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.report(address,bytes32,uint256[],uint256)"></a><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.designatedReporterShowed()"></a><code class="function-signature">designatedReporterShowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.designatedReporterWasCorrect()"></a><code class="function-signature">designatedReporterWasCorrect() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getDesignatedReporter()"></a><code class="function-signature">getDesignatedReporter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getReportTimestamp()"></a><code class="function-signature">getReportTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.migrateToNewUniverse(address)"></a><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.returnRepFromDisavow()"></a><code class="function-signature">returnRepFromDisavow()</code><span class="function-visibility">public</span></h4>







### `IMarket`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMarket.initialize(contract IAugur,contract IUniverse,uint256,uint256,uint256,address,address,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#IMarket.derivePayoutDistributionHash(uint256[])"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators)</code></a></li><li><a href="#IMarket.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IMarket.getDisputeWindow()"><code class="function-signature">getDisputeWindow()</code></a></li><li><a href="#IMarket.getNumberOfOutcomes()"><code class="function-signature">getNumberOfOutcomes()</code></a></li><li><a href="#IMarket.getNumTicks()"><code class="function-signature">getNumTicks()</code></a></li><li><a href="#IMarket.getShareToken(uint256)"><code class="function-signature">getShareToken(uint256 _outcome)</code></a></li><li><a href="#IMarket.getMarketCreatorSettlementFeeDivisor()"><code class="function-signature">getMarketCreatorSettlementFeeDivisor()</code></a></li><li><a href="#IMarket.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IMarket.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IMarket.getWinningPayoutDistributionHash()"><code class="function-signature">getWinningPayoutDistributionHash()</code></a></li><li><a href="#IMarket.getWinningPayoutNumerator(uint256)"><code class="function-signature">getWinningPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IMarket.getWinningReportingParticipant()"><code class="function-signature">getWinningReportingParticipant()</code></a></li><li><a href="#IMarket.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IMarket.getFinalizationTime()"><code class="function-signature">getFinalizationTime()</code></a></li><li><a href="#IMarket.getInitialReporter()"><code class="function-signature">getInitialReporter()</code></a></li><li><a href="#IMarket.getDesignatedReportingEndTime()"><code class="function-signature">getDesignatedReportingEndTime()</code></a></li><li><a href="#IMarket.getValidityBondAttoCash()"><code class="function-signature">getValidityBondAttoCash()</code></a></li><li><a href="#IMarket.deriveMarketCreatorFeeAmount(uint256)"><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount)</code></a></li><li><a href="#IMarket.recordMarketCreatorFees(uint256,address)"><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _affiliateAddress)</code></a></li><li><a href="#IMarket.isContainerForShareToken(contract IShareToken)"><code class="function-signature">isContainerForShareToken(contract IShareToken _shadyTarget)</code></a></li><li><a href="#IMarket.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IMarket.isInvalid()"><code class="function-signature">isInvalid()</code></a></li><li><a href="#IMarket.finalize()"><code class="function-signature">finalize()</code></a></li><li><a href="#IMarket.designatedReporterWasCorrect()"><code class="function-signature">designatedReporterWasCorrect()</code></a></li><li><a href="#IMarket.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#IMarket.isFinalized()"><code class="function-signature">isFinalized()</code></a></li><li><a href="#IMarket.assertBalances()"><code class="function-signature">assertBalances()</code></a></li><li class="inherited"><a href="#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IMarket.initialize(contract IAugur,contract IUniverse,uint256,uint256,uint256,address,address,uint256,uint256)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.derivePayoutDistributionHash(uint256[])"></a><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getDisputeWindow()"></a><code class="function-signature">getDisputeWindow() <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getNumberOfOutcomes()"></a><code class="function-signature">getNumberOfOutcomes() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getNumTicks()"></a><code class="function-signature">getNumTicks() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getShareToken(uint256)"></a><code class="function-signature">getShareToken(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">contract IShareToken</span></code><span class="function-visibility">public</span></h4>





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





<h4><a class="anchor" aria-hidden="true" id="IMarket.deriveMarketCreatorFeeAmount(uint256)"></a><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.recordMarketCreatorFees(uint256,address)"></a><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _affiliateAddress) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isContainerForShareToken(contract IShareToken)"></a><code class="function-signature">isContainerForShareToken(contract IShareToken _shadyTarget) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isContainerForReportingParticipant(contract IReportingParticipant)"></a><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isInvalid()"></a><code class="function-signature">isInvalid() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.finalize()"></a><code class="function-signature">finalize() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.designatedReporterWasCorrect()"></a><code class="function-signature">designatedReporterWasCorrect() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.designatedReporterShowed()"></a><code class="function-signature">designatedReporterShowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isFinalized()"></a><code class="function-signature">isFinalized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.assertBalances()"></a><code class="function-signature">assertBalances() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IOrders`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOrders.saveOrder(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,bytes32,bytes32,bytes32,contract IERC20)"><code class="function-signature">saveOrder(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, contract IERC20 _kycToken)</code></a></li><li><a href="#IOrders.removeOrder(bytes32)"><code class="function-signature">removeOrder(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getMarket(bytes32)"><code class="function-signature">getMarket(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderType(bytes32)"><code class="function-signature">getOrderType(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOutcome(bytes32)"><code class="function-signature">getOutcome(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getAmount(bytes32)"><code class="function-signature">getAmount(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getPrice(bytes32)"><code class="function-signature">getPrice(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderCreator(bytes32)"><code class="function-signature">getOrderCreator(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderSharesEscrowed(bytes32)"><code class="function-signature">getOrderSharesEscrowed(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderMoneyEscrowed(bytes32)"><code class="function-signature">getOrderMoneyEscrowed(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderDataForLogs(bytes32)"><code class="function-signature">getOrderDataForLogs(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getBetterOrderId(bytes32)"><code class="function-signature">getBetterOrderId(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getWorseOrderId(bytes32)"><code class="function-signature">getWorseOrderId(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getKYCToken(bytes32)"><code class="function-signature">getKYCToken(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getBestOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken)</code></a></li><li><a href="#IOrders.getWorstOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken)</code></a></li><li><a href="#IOrders.getLastOutcomePrice(contract IMarket,uint256)"><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IOrders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract IERC20)"><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract IERC20 _kycToken)</code></a></li><li><a href="#IOrders.getTotalEscrowed(contract IMarket)"><code class="function-signature">getTotalEscrowed(contract IMarket _market)</code></a></li><li><a href="#IOrders.isBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#IOrders.isWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#IOrders.assertIsNotBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _betterOrderId)</code></a></li><li><a href="#IOrders.assertIsNotWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _worseOrderId)</code></a></li><li><a href="#IOrders.recordFillOrder(bytes32,uint256,uint256,uint256)"><code class="function-signature">recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill)</code></a></li><li><a href="#IOrders.setPrice(contract IMarket,uint256,uint256)"><code class="function-signature">setPrice(contract IMarket _market, uint256 _outcome, uint256 _price)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOrders.saveOrder(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,bytes32,bytes32,bytes32,contract IERC20)"></a><code class="function-signature">saveOrder(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.removeOrder(bytes32)"></a><code class="function-signature">removeOrder(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getMarket(bytes32)"></a><code class="function-signature">getMarket(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderType(bytes32)"></a><code class="function-signature">getOrderType(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOutcome(bytes32)"></a><code class="function-signature">getOutcome(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getAmount(bytes32)"></a><code class="function-signature">getAmount(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getPrice(bytes32)"></a><code class="function-signature">getPrice(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderCreator(bytes32)"></a><code class="function-signature">getOrderCreator(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderSharesEscrowed(bytes32)"></a><code class="function-signature">getOrderSharesEscrowed(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderMoneyEscrowed(bytes32)"></a><code class="function-signature">getOrderMoneyEscrowed(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderDataForLogs(bytes32)"></a><code class="function-signature">getOrderDataForLogs(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types,address[],uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getBetterOrderId(bytes32)"></a><code class="function-signature">getBetterOrderId(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getWorseOrderId(bytes32)"></a><code class="function-signature">getWorseOrderId(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getKYCToken(bytes32)"></a><code class="function-signature">getKYCToken(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">contract IERC20</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getBestOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"></a><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getWorstOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"></a><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getLastOutcomePrice(contract IMarket,uint256)"></a><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract IERC20)"></a><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li><a href="#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li><a href="#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IShareToken.initialize(contract IAugur,contract IMarket,uint256,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, uint256 _outcome, address _erc1820RegistryAddress)</code></a></li><li><a href="#IShareToken.createShares(address,uint256)"><code class="function-signature">createShares(address _owner, uint256 _amount)</code></a></li><li><a href="#IShareToken.destroyShares(address,uint256)"><code class="function-signature">destroyShares(address, uint256 balance)</code></a></li><li><a href="#IShareToken.getMarket()"><code class="function-signature">getMarket()</code></a></li><li><a href="#IShareToken.getOutcome()"><code class="function-signature">getOutcome()</code></a></li><li><a href="#IShareToken.trustedOrderTransfer(address,address,uint256)"><code class="function-signature">trustedOrderTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IShareToken.trustedFillOrderTransfer(address,address,uint256)"><code class="function-signature">trustedFillOrderTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IShareToken.trustedCancelOrderTransfer(address,address,uint256)"><code class="function-signature">trustedCancelOrderTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IShareToken.initialize(contract IAugur,contract IMarket,uint256,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, uint256 _outcome, address _erc1820RegistryAddress)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.createShares(address,uint256)"></a><code class="function-signature">createShares(address _owner, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.destroyShares(address,uint256)"></a><code class="function-signature">destroyShares(address, uint256 balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.getMarket()"></a><code class="function-signature">getMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.getOutcome()"></a><code class="function-signature">getOutcome() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.trustedOrderTransfer(address,address,uint256)"></a><code class="function-signature">trustedOrderTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.trustedFillOrderTransfer(address,address,uint256)"></a><code class="function-signature">trustedFillOrderTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.trustedCancelOrderTransfer(address,address,uint256)"></a><code class="function-signature">trustedCancelOrderTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IStandardToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IStandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address recipient, uint256 amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IStandardToken.noHooksTransfer(address,uint256)"></a><code class="function-signature">noHooksTransfer(address recipient, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `ITime`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITime.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li class="inherited"><a href="#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITime.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







### `ITyped`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITyped.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







### `IUniverse`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniverse.fork()"><code class="function-signature">fork()</code></a></li><li><a href="#IUniverse.updateForkValues()"><code class="function-signature">updateForkValues()</code></a></li><li><a href="#IUniverse.getParentUniverse()"><code class="function-signature">getParentUniverse()</code></a></li><li><a href="#IUniverse.createChildUniverse(uint256[])"><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IUniverse.getChildUniverse(bytes32)"><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IUniverse.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IUniverse.getForkEndTime()"><code class="function-signature">getForkEndTime()</code></a></li><li><a href="#IUniverse.getForkReputationGoal()"><code class="function-signature">getForkReputationGoal()</code></a></li><li><a href="#IUniverse.getParentPayoutDistributionHash()"><code class="function-signature">getParentPayoutDistributionHash()</code></a></li><li><a href="#IUniverse.getDisputeRoundDurationInSeconds(bool)"><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateDisputeWindowByTimestamp(uint256,bool)"><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateCurrentDisputeWindow(bool)"><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateNextDisputeWindow(bool)"><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreatePreviousDisputeWindow(bool)"><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOpenInterestInAttoCash()"><code class="function-signature">getOpenInterestInAttoCash()</code></a></li><li><a href="#IUniverse.getRepMarketCapInAttoCash()"><code class="function-signature">getRepMarketCapInAttoCash()</code></a></li><li><a href="#IUniverse.getTargetRepMarketCapInAttoCash()"><code class="function-signature">getTargetRepMarketCapInAttoCash()</code></a></li><li><a href="#IUniverse.getOrCacheValidityBond()"><code class="function-signature">getOrCacheValidityBond()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportStake()"><code class="function-signature">getOrCacheDesignatedReportStake()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportNoShowBond()"><code class="function-signature">getOrCacheDesignatedReportNoShowBond()</code></a></li><li><a href="#IUniverse.getOrCacheMarketRepBond()"><code class="function-signature">getOrCacheMarketRepBond()</code></a></li><li><a href="#IUniverse.getOrCacheReportingFeeDivisor()"><code class="function-signature">getOrCacheReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForFork()"><code class="function-signature">getDisputeThresholdForFork()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForDisputePacing()"><code class="function-signature">getDisputeThresholdForDisputePacing()</code></a></li><li><a href="#IUniverse.getInitialReportMinValue()"><code class="function-signature">getInitialReportMinValue()</code></a></li><li><a href="#IUniverse.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li><a href="#IUniverse.getReportingFeeDivisor()"><code class="function-signature">getReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IUniverse.getWinningChildPayoutNumerator(uint256)"><code class="function-signature">getWinningChildPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IUniverse.isForkingMarket()"><code class="function-signature">isForkingMarket()</code></a></li><li><a href="#IUniverse.getCurrentDisputeWindow(bool)"><code class="function-signature">getCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.isParentOf(contract IUniverse)"><code class="function-signature">isParentOf(contract IUniverse _shadyChild)</code></a></li><li><a href="#IUniverse.updateTentativeWinningChildUniverse(bytes32)"><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.isContainerForDisputeWindow(contract IDisputeWindow)"><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForMarket(contract IMarket)"><code class="function-signature">isContainerForMarket(contract IMarket _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IUniverse.isContainerForShareToken(contract IShareToken)"><code class="function-signature">isContainerForShareToken(contract IShareToken _shadyTarget)</code></a></li><li><a href="#IUniverse.migrateMarketOut(contract IUniverse)"><code class="function-signature">migrateMarketOut(contract IUniverse _destinationUniverse)</code></a></li><li><a href="#IUniverse.migrateMarketIn(contract IMarket,uint256,uint256)"><code class="function-signature">migrateMarketIn(contract IMarket _market, uint256 _cashBalance, uint256 _marketOI)</code></a></li><li><a href="#IUniverse.decrementOpenInterest(uint256)"><code class="function-signature">decrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.decrementOpenInterestFromMarket(contract IMarket)"><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market)</code></a></li><li><a href="#IUniverse.incrementOpenInterest(uint256)"><code class="function-signature">incrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.getWinningChildUniverse()"><code class="function-signature">getWinningChildUniverse()</code></a></li><li><a href="#IUniverse.isForking()"><code class="function-signature">isForking()</code></a></li><li><a href="#IUniverse.assertMarketBalance()"><code class="function-signature">assertMarketBalance()</code></a></li><li><a href="#IUniverse.deposit(address,uint256,address)"><code class="function-signature">deposit(address _sender, uint256 _amount, address _market)</code></a></li><li><a href="#IUniverse.withdraw(address,uint256,address)"><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market)</code></a></li></ul></div>



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





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getRepMarketCapInAttoCash()"></a><code class="function-signature">getRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





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





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isForkingMarket()"></a><code class="function-signature">isForkingMarket() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getCurrentDisputeWindow(bool)"></a><code class="function-signature">getCurrentDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isParentOf(contract IUniverse)"></a><code class="function-signature">isParentOf(contract IUniverse _shadyChild) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.updateTentativeWinningChildUniverse(bytes32)"></a><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForDisputeWindow(contract IDisputeWindow)"></a><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyTarget) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForMarket(contract IMarket)"></a><code class="function-signature">isContainerForMarket(contract IMarket _shadyTarget) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForReportingParticipant(contract IReportingParticipant)"></a><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForShareToken(contract IShareToken)"></a><code class="function-signature">isContainerForShareToken(contract IShareToken _shadyTarget) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.migrateMarketOut(contract IUniverse)"></a><code class="function-signature">migrateMarketOut(contract IUniverse _destinationUniverse) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.migrateMarketIn(contract IMarket,uint256,uint256)"></a><code class="function-signature">migrateMarketIn(contract IMarket _market, uint256 _cashBalance, uint256 _marketOI) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.decrementOpenInterest(uint256)"></a><code class="function-signature">decrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.decrementOpenInterestFromMarket(contract IMarket)"></a><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.incrementOpenInterest(uint256)"></a><code class="function-signature">incrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getWinningChildUniverse()"></a><code class="function-signature">getWinningChildUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isForking()"></a><code class="function-signature">isForking() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.assertMarketBalance()"></a><code class="function-signature">assertMarketBalance() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.deposit(address,uint256,address)"></a><code class="function-signature">deposit(address _sender, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.withdraw(address,uint256,address)"></a><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IUniverseFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniverseFactory.createUniverse(contract IUniverse,bytes32,uint256[])"><code class="function-signature">createUniverse(contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniverseFactory.createUniverse(contract IUniverse,bytes32,uint256[])"></a><code class="function-signature">createUniverse(contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>







### `IV2ReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IV2ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li><a href="#IV2ReputationToken.mintForUniverse(uint256,address)"><code class="function-signature">mintForUniverse(uint256 _amountToMint, address _target)</code></a></li><li class="inherited"><a href="#IStandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="#IReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li class="inherited"><a href="#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li class="inherited"><a href="#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.burnForMarket(uint256)"></a><code class="function-signature">burnForMarket(uint256 _amountToBurn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.mintForUniverse(uint256,address)"></a><code class="function-signature">mintForUniverse(uint256 _amountToMint, address _target) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Order`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Order.create(contract IAugur,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32,bool,contract IERC20)"><code class="function-signature">create(contract IAugur _augur, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId, bool _ignoreShares, contract IERC20 _kycToken)</code></a></li><li><a href="#Order.getOrderId(struct Order.Data)"><code class="function-signature">getOrderId(struct Order.Data _orderData)</code></a></li><li><a href="#Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection)</code></a></li><li><a href="#Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection)</code></a></li><li><a href="#Order.escrowFunds(struct Order.Data)"><code class="function-signature">escrowFunds(struct Order.Data _orderData)</code></a></li><li><a href="#Order.saveOrder(struct Order.Data,bytes32)"><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Order.create(contract IAugur,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32,bool,contract IERC20)"></a><code class="function-signature">create(contract IAugur _augur, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId, bool _ignoreShares, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">struct Order.Data</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderId(struct Order.Data)"></a><code class="function-signature">getOrderId(struct Order.Data _orderData) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.escrowFunds(struct Order.Data)"></a><code class="function-signature">escrowFunds(struct Order.Data _orderData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.saveOrder(struct Order.Data,bytes32)"></a><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>







### `Reporting`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Reporting.getDesignatedReportingDurationSeconds()"><code class="function-signature">getDesignatedReportingDurationSeconds()</code></a></li><li><a href="#Reporting.getInitialDisputeRoundDurationSeconds()"><code class="function-signature">getInitialDisputeRoundDurationSeconds()</code></a></li><li><a href="#Reporting.getDisputeRoundDurationSeconds()"><code class="function-signature">getDisputeRoundDurationSeconds()</code></a></li><li><a href="#Reporting.getForkDurationSeconds()"><code class="function-signature">getForkDurationSeconds()</code></a></li><li><a href="#Reporting.getBaseMarketDurationMaximum()"><code class="function-signature">getBaseMarketDurationMaximum()</code></a></li><li><a href="#Reporting.getUpgradeCadence()"><code class="function-signature">getUpgradeCadence()</code></a></li><li><a href="#Reporting.getInitialUpgradeTimestamp()"><code class="function-signature">getInitialUpgradeTimestamp()</code></a></li><li><a href="#Reporting.getDefaultValidityBond()"><code class="function-signature">getDefaultValidityBond()</code></a></li><li><a href="#Reporting.getValidityBondFloor()"><code class="function-signature">getValidityBondFloor()</code></a></li><li><a href="#Reporting.getTargetInvalidMarketsDivisor()"><code class="function-signature">getTargetInvalidMarketsDivisor()</code></a></li><li><a href="#Reporting.getTargetIncorrectDesignatedReportMarketsDivisor()"><code class="function-signature">getTargetIncorrectDesignatedReportMarketsDivisor()</code></a></li><li><a href="#Reporting.getTargetDesignatedReportNoShowsDivisor()"><code class="function-signature">getTargetDesignatedReportNoShowsDivisor()</code></a></li><li><a href="#Reporting.getTargetRepMarketCapMultiplier()"><code class="function-signature">getTargetRepMarketCapMultiplier()</code></a></li><li><a href="#Reporting.getMaximumReportingFeeDivisor()"><code class="function-signature">getMaximumReportingFeeDivisor()</code></a></li><li><a href="#Reporting.getMinimumReportingFeeDivisor()"><code class="function-signature">getMinimumReportingFeeDivisor()</code></a></li><li><a href="#Reporting.getDefaultReportingFeeDivisor()"><code class="function-signature">getDefaultReportingFeeDivisor()</code></a></li><li><a href="#Reporting.getInitialREPSupply()"><code class="function-signature">getInitialREPSupply()</code></a></li><li><a href="#Reporting.getForkThresholdDivisor()"><code class="function-signature">getForkThresholdDivisor()</code></a></li><li><a href="#Reporting.getMaximumDisputeRounds()"><code class="function-signature">getMaximumDisputeRounds()</code></a></li><li><a href="#Reporting.getMinimumSlowRounds()"><code class="function-signature">getMinimumSlowRounds()</code></a></li><li><a href="#Reporting.getDSRToggleRewardInAttoREP()"><code class="function-signature">getDSRToggleRewardInAttoREP()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Reporting.getDesignatedReportingDurationSeconds()"></a><code class="function-signature">getDesignatedReportingDurationSeconds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getInitialDisputeRoundDurationSeconds()"></a><code class="function-signature">getInitialDisputeRoundDurationSeconds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





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





<h4><a class="anchor" aria-hidden="true" id="Reporting.getForkThresholdDivisor()"></a><code class="function-signature">getForkThresholdDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getMaximumDisputeRounds()"></a><code class="function-signature">getMaximumDisputeRounds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getMinimumSlowRounds()"></a><code class="function-signature">getMinimumSlowRounds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getDSRToggleRewardInAttoREP()"></a><code class="function-signature">getDSRToggleRewardInAttoREP() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `SafeMathUint256`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMathUint256.mul(uint256,uint256)"><code class="function-signature">mul(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.div(uint256,uint256)"><code class="function-signature">div(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.sub(uint256,uint256)"><code class="function-signature">sub(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.add(uint256,uint256)"><code class="function-signature">add(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.min(uint256,uint256)"><code class="function-signature">min(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.max(uint256,uint256)"><code class="function-signature">max(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.getUint256Min()"><code class="function-signature">getUint256Min()</code></a></li><li><a href="#SafeMathUint256.getUint256Max()"><code class="function-signature">getUint256Max()</code></a></li><li><a href="#SafeMathUint256.isMultipleOf(uint256,uint256)"><code class="function-signature">isMultipleOf(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.fxpMul(uint256,uint256,uint256)"><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base)</code></a></li><li><a href="#SafeMathUint256.fxpDiv(uint256,uint256,uint256)"><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.mul(uint256,uint256)"></a><code class="function-signature">mul(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.div(uint256,uint256)"></a><code class="function-signature">div(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.add(uint256,uint256)"></a><code class="function-signature">add(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.min(uint256,uint256)"></a><code class="function-signature">min(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.max(uint256,uint256)"></a><code class="function-signature">max(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Min()"></a><code class="function-signature">getUint256Min() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Max()"></a><code class="function-signature">getUint256Max() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.isMultipleOf(uint256,uint256)"></a><code class="function-signature">isMultipleOf(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpMul(uint256,uint256,uint256)"></a><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpDiv(uint256,uint256,uint256)"></a><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `Cash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Cash.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#Cash.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _amount)</code></a></li><li><a href="#Cash.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#Cash.internalTransfer(address,address,uint256)"><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#Cash.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#Cash.balanceOf(address)"><code class="function-signature">balanceOf(address _owner)</code></a></li><li><a href="#Cash.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li><a href="#Cash.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li><a href="#Cash.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li><a href="#Cash.approveInternal(address,address,uint256)"><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance)</code></a></li><li><a href="#Cash.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li><a href="#Cash.faucet(uint256)"><code class="function-signature">faucet(uint256 _amount)</code></a></li><li><a href="#Cash.sub(uint256,uint256)"><code class="function-signature">sub(uint256 x, uint256 y)</code></a></li><li><a href="#Cash.joinMint(address,uint256)"><code class="function-signature">joinMint(address usr, uint256 wad)</code></a></li><li><a href="#Cash.joinBurn(address,uint256)"><code class="function-signature">joinBurn(address usr, uint256 wad)</code></a></li><li><a href="#Cash.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li><a href="#Cash.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li><a href="#Cash.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#Cash.Mint(address,uint256)"><code class="function-signature">Mint(address target, uint256 value)</code></a></li><li><a href="#Cash.Burn(address,uint256)"><code class="function-signature">Burn(address target, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Cash.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.transfer(address,uint256)"></a><code class="function-signature">transfer(address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.internalTransfer(address,address,uint256)"></a><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.balanceOf(address)"></a><code class="function-signature">balanceOf(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.approve(address,uint256)"></a><code class="function-signature">approve(address _spender, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.increaseApproval(address,uint256)"></a><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.decreaseApproval(address,uint256)"></a><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.approveInternal(address,address,uint256)"></a><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.allowance(address,address)"></a><code class="function-signature">allowance(address _owner, address _spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.faucet(uint256)"></a><code class="function-signature">faucet(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.joinMint(address,uint256)"></a><code class="function-signature">joinMint(address usr, uint256 wad) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.joinBurn(address,uint256)"></a><code class="function-signature">joinBurn(address usr, uint256 wad) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.mint(address,uint256)"></a><code class="function-signature">mint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.burn(address,uint256)"></a><code class="function-signature">burn(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="Cash.Mint(address,uint256)"></a><code class="function-signature">Mint(address target, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Cash.Burn(address,uint256)"></a><code class="function-signature">Burn(address target, uint256 value)</code><span class="function-visibility"></span></h4>





### `IDaiJoin`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiJoin.join(address,uint256)"><code class="function-signature">join(address urn, uint256 wad)</code></a></li><li><a href="#IDaiJoin.exit(address,uint256)"><code class="function-signature">exit(address usr, uint256 wad)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiJoin.join(address,uint256)"></a><code class="function-signature">join(address urn, uint256 wad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiJoin.exit(address,uint256)"></a><code class="function-signature">exit(address usr, uint256 wad)</code><span class="function-visibility">public</span></h4>







### `IDaiVat`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiVat.hope(address)"><code class="function-signature">hope(address usr)</code></a></li><li><a href="#IDaiVat.move(address,address,uint256)"><code class="function-signature">move(address src, address dst, uint256 rad)</code></a></li><li><a href="#IDaiVat.suck(address,address,uint256)"><code class="function-signature">suck(address u, address v, uint256 rad)</code></a></li><li><a href="#IDaiVat.faucet(address,uint256)"><code class="function-signature">faucet(address _target, uint256 _amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiVat.hope(address)"></a><code class="function-signature">hope(address usr)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.move(address,address,uint256)"></a><code class="function-signature">move(address src, address dst, uint256 rad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.suck(address,address,uint256)"></a><code class="function-signature">suck(address u, address v, uint256 rad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.faucet(address,uint256)"></a><code class="function-signature">faucet(address _target, uint256 _amount)</code><span class="function-visibility">public</span></h4>







### `ERC1820ImplementerInterface`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC1820ImplementerInterface.canImplementInterfaceForAddress(bytes32,address)"><code class="function-signature">canImplementInterfaceForAddress(bytes32 interfaceHash, address addr)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC1820ImplementerInterface.canImplementInterfaceForAddress(bytes32,address)"></a><code class="function-signature">canImplementInterfaceForAddress(bytes32 interfaceHash, address addr) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>







### `ERC1820Registry`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC1820Registry.getInterfaceImplementer(address,bytes32)"><code class="function-signature">getInterfaceImplementer(address _addr, bytes32 _interfaceHash)</code></a></li><li><a href="#ERC1820Registry.setInterfaceImplementer(address,bytes32,address)"><code class="function-signature">setInterfaceImplementer(address _addr, bytes32 _interfaceHash, address _implementer)</code></a></li><li><a href="#ERC1820Registry.setManager(address,address)"><code class="function-signature">setManager(address _addr, address _newManager)</code></a></li><li><a href="#ERC1820Registry.getManager(address)"><code class="function-signature">getManager(address _addr)</code></a></li><li><a href="#ERC1820Registry.interfaceHash(string)"><code class="function-signature">interfaceHash(string _interfaceName)</code></a></li><li><a href="#ERC1820Registry.updateERC165Cache(address,bytes4)"><code class="function-signature">updateERC165Cache(address _contract, bytes4 _interfaceId)</code></a></li><li><a href="#ERC1820Registry.implementsERC165Interface(address,bytes4)"><code class="function-signature">implementsERC165Interface(address _contract, bytes4 _interfaceId)</code></a></li><li><a href="#ERC1820Registry.implementsERC165InterfaceNoCache(address,bytes4)"><code class="function-signature">implementsERC165InterfaceNoCache(address _contract, bytes4 _interfaceId)</code></a></li><li><a href="#ERC1820Registry.isERC165Interface(bytes32)"><code class="function-signature">isERC165Interface(bytes32 _interfaceHash)</code></a></li><li><a href="#ERC1820Registry.noThrowCall(address,bytes4)"><code class="function-signature">noThrowCall(address _contract, bytes4 _interfaceId)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ERC1820Registry.InterfaceImplementerSet(address,bytes32,address)"><code class="function-signature">InterfaceImplementerSet(address addr, bytes32 interfaceHash, address implementer)</code></a></li><li><a href="#ERC1820Registry.ManagerChanged(address,address)"><code class="function-signature">ManagerChanged(address addr, address newManager)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.getInterfaceImplementer(address,bytes32)"></a><code class="function-signature">getInterfaceImplementer(address _addr, bytes32 _interfaceHash) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.setInterfaceImplementer(address,bytes32,address)"></a><code class="function-signature">setInterfaceImplementer(address _addr, bytes32 _interfaceHash, address _implementer)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.setManager(address,address)"></a><code class="function-signature">setManager(address _addr, address _newManager)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.getManager(address)"></a><code class="function-signature">getManager(address _addr) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.interfaceHash(string)"></a><code class="function-signature">interfaceHash(string _interfaceName) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.updateERC165Cache(address,bytes4)"></a><code class="function-signature">updateERC165Cache(address _contract, bytes4 _interfaceId)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.implementsERC165Interface(address,bytes4)"></a><code class="function-signature">implementsERC165Interface(address _contract, bytes4 _interfaceId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.implementsERC165InterfaceNoCache(address,bytes4)"></a><code class="function-signature">implementsERC165InterfaceNoCache(address _contract, bytes4 _interfaceId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.isERC165Interface(bytes32)"></a><code class="function-signature">isERC165Interface(bytes32 _interfaceHash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.noThrowCall(address,bytes4)"></a><code class="function-signature">noThrowCall(address _contract, bytes4 _interfaceId) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">internal</span></h4>

Make a call on a contract without throwing if the function does not exist.





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.InterfaceImplementerSet(address,bytes32,address)"></a><code class="function-signature">InterfaceImplementerSet(address addr, bytes32 interfaceHash, address implementer)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1820Registry.ManagerChanged(address,address)"></a><code class="function-signature">ManagerChanged(address addr, address newManager)</code><span class="function-visibility"></span></h4>





### `BaseSafe`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BaseSafe.setupSafe(address[],uint256,address,bytes)"><code class="function-signature">setupSafe(address[] _owners, uint256 _threshold, address to, bytes data)</code></a></li><li class="inherited"><a href="#OwnerManager.setupOwners(address[],uint256)"><code class="function-signature">setupOwners(address[] _owners, uint256 _threshold)</code></a></li><li class="inherited"><a href="#OwnerManager.addOwnerWithThreshold(address,uint256)"><code class="function-signature">addOwnerWithThreshold(address owner, uint256 _threshold)</code></a></li><li class="inherited"><a href="#OwnerManager.removeOwner(address,address,uint256)"><code class="function-signature">removeOwner(address prevOwner, address owner, uint256 _threshold)</code></a></li><li class="inherited"><a href="#OwnerManager.swapOwner(address,address,address)"><code class="function-signature">swapOwner(address prevOwner, address oldOwner, address newOwner)</code></a></li><li class="inherited"><a href="#OwnerManager.changeThreshold(uint256)"><code class="function-signature">changeThreshold(uint256 _threshold)</code></a></li><li class="inherited"><a href="#OwnerManager.getThreshold()"><code class="function-signature">getThreshold()</code></a></li><li class="inherited"><a href="#OwnerManager.isOwner(address)"><code class="function-signature">isOwner(address owner)</code></a></li><li class="inherited"><a href="#OwnerManager.getOwners()"><code class="function-signature">getOwners()</code></a></li><li class="inherited"><a href="#ModuleManager.setupModules(address,bytes)"><code class="function-signature">setupModules(address to, bytes data)</code></a></li><li class="inherited"><a href="#ModuleManager.enableModule(contract Module)"><code class="function-signature">enableModule(contract Module module)</code></a></li><li class="inherited"><a href="#ModuleManager.disableModule(contract Module,contract Module)"><code class="function-signature">disableModule(contract Module prevModule, contract Module module)</code></a></li><li class="inherited"><a href="#ModuleManager.execTransactionFromModule(address,uint256,bytes,enum Enum.Operation)"><code class="function-signature">execTransactionFromModule(address to, uint256 value, bytes data, enum Enum.Operation operation)</code></a></li><li class="inherited"><a href="#ModuleManager.getModules()"><code class="function-signature">getModules()</code></a></li><li class="inherited"><a href="#Executor.execute(address,uint256,bytes,enum Enum.Operation,uint256)"><code class="function-signature">execute(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 txGas)</code></a></li><li class="inherited"><a href="#Executor.executeCall(address,uint256,bytes,uint256)"><code class="function-signature">executeCall(address to, uint256 value, bytes data, uint256 txGas)</code></a></li><li class="inherited"><a href="#Executor.executeDelegateCall(address,bytes,uint256)"><code class="function-signature">executeDelegateCall(address to, bytes data, uint256 txGas)</code></a></li><li class="inherited"><a href="#Executor.executeCreate(bytes)"><code class="function-signature">executeCreate(bytes data)</code></a></li><li class="inherited"><a href="#EtherPaymentFallback.fallback()"><code class="function-signature">fallback()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#OwnerManager.AddedOwner(address)"><code class="function-signature">AddedOwner(address owner)</code></a></li><li class="inherited"><a href="#OwnerManager.RemovedOwner(address)"><code class="function-signature">RemovedOwner(address owner)</code></a></li><li class="inherited"><a href="#OwnerManager.ChangedThreshold(uint256)"><code class="function-signature">ChangedThreshold(uint256 threshold)</code></a></li><li class="inherited"><a href="#ModuleManager.EnabledModule(contract Module)"><code class="function-signature">EnabledModule(contract Module module)</code></a></li><li class="inherited"><a href="#ModuleManager.DisabledModule(contract Module)"><code class="function-signature">DisabledModule(contract Module module)</code></a></li><li class="inherited"><a href="#Executor.ContractCreation(address)"><code class="function-signature">ContractCreation(address newContract)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BaseSafe.setupSafe(address[],uint256,address,bytes)"></a><code class="function-signature">setupSafe(address[] _owners, uint256 _threshold, address to, bytes data)</code><span class="function-visibility">internal</span></h4>

Setup function sets initial storage of contract.
 @param _owners List of Safe owners.
 @param _threshold Number of required confirmations for a Safe transaction.
 @param to Contract address for optional delegate call.
 @param data Data payload for optional delegate call.





### `Enum`



<div class="contract-index"></div>





### `EtherPaymentFallback`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#EtherPaymentFallback.fallback()"><code class="function-signature">fallback()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="EtherPaymentFallback.fallback()"></a><code class="function-signature">fallback()</code><span class="function-visibility">external</span></h4>

Fallback function accepts Ether transactions.





### `Executor`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Executor.execute(address,uint256,bytes,enum Enum.Operation,uint256)"><code class="function-signature">execute(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 txGas)</code></a></li><li><a href="#Executor.executeCall(address,uint256,bytes,uint256)"><code class="function-signature">executeCall(address to, uint256 value, bytes data, uint256 txGas)</code></a></li><li><a href="#Executor.executeDelegateCall(address,bytes,uint256)"><code class="function-signature">executeDelegateCall(address to, bytes data, uint256 txGas)</code></a></li><li><a href="#Executor.executeCreate(bytes)"><code class="function-signature">executeCreate(bytes data)</code></a></li><li class="inherited"><a href="#EtherPaymentFallback.fallback()"><code class="function-signature">fallback()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#Executor.ContractCreation(address)"><code class="function-signature">ContractCreation(address newContract)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Executor.execute(address,uint256,bytes,enum Enum.Operation,uint256)"></a><code class="function-signature">execute(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 txGas) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Executor.executeCall(address,uint256,bytes,uint256)"></a><code class="function-signature">executeCall(address to, uint256 value, bytes data, uint256 txGas) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Executor.executeDelegateCall(address,bytes,uint256)"></a><code class="function-signature">executeDelegateCall(address to, bytes data, uint256 txGas) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Executor.executeCreate(bytes)"></a><code class="function-signature">executeCreate(bytes data) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="Executor.ContractCreation(address)"></a><code class="function-signature">ContractCreation(address newContract)</code><span class="function-visibility"></span></h4>





### `GnosisSafe`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#GnosisSafe.setup(address[],uint256,address,bytes,address,uint256,address payable)"><code class="function-signature">setup(address[] _owners, uint256 _threshold, address to, bytes data, address paymentToken, uint256 payment, address payable paymentReceiver)</code></a></li><li><a href="#GnosisSafe.execTransaction(address,uint256,bytes,enum Enum.Operation,uint256,uint256,uint256,address,address payable,bytes)"><code class="function-signature">execTransaction(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address payable refundReceiver, bytes signatures)</code></a></li><li><a href="#GnosisSafe.checkSignatures(bytes32,bytes,bytes,bool)"><code class="function-signature">checkSignatures(bytes32 dataHash, bytes data, bytes signatures, bool consumeHash)</code></a></li><li><a href="#GnosisSafe.requiredTxGas(address,uint256,bytes,enum Enum.Operation)"><code class="function-signature">requiredTxGas(address to, uint256 value, bytes data, enum Enum.Operation operation)</code></a></li><li><a href="#GnosisSafe.approveHash(bytes32)"><code class="function-signature">approveHash(bytes32 hashToApprove)</code></a></li><li><a href="#GnosisSafe.signMessage(bytes)"><code class="function-signature">signMessage(bytes _data)</code></a></li><li><a href="#GnosisSafe.isValidSignature(bytes,bytes)"><code class="function-signature">isValidSignature(bytes _data, bytes _signature)</code></a></li><li><a href="#GnosisSafe.getMessageHash(bytes)"><code class="function-signature">getMessageHash(bytes message)</code></a></li><li><a href="#GnosisSafe.encodeTransactionData(address,uint256,bytes,enum Enum.Operation,uint256,uint256,uint256,address,address,uint256)"><code class="function-signature">encodeTransactionData(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce)</code></a></li><li><a href="#GnosisSafe.getTransactionHash(address,uint256,bytes,enum Enum.Operation,uint256,uint256,uint256,address,address,uint256)"><code class="function-signature">getTransactionHash(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce)</code></a></li><li class="inherited"><a href="#SecuredTokenTransfer.transferToken(address,address,uint256)"><code class="function-signature">transferToken(address token, address receiver, uint256 amount)</code></a></li><li class="inherited"><a href="#SignatureDecoder.recoverKey(bytes32,bytes,uint256)"><code class="function-signature">recoverKey(bytes32 messageHash, bytes messageSignature, uint256 pos)</code></a></li><li class="inherited"><a href="#SignatureDecoder.signatureSplit(bytes,uint256)"><code class="function-signature">signatureSplit(bytes signatures, uint256 pos)</code></a></li><li class="inherited"><a href="#BaseSafe.setupSafe(address[],uint256,address,bytes)"><code class="function-signature">setupSafe(address[] _owners, uint256 _threshold, address to, bytes data)</code></a></li><li class="inherited"><a href="#OwnerManager.setupOwners(address[],uint256)"><code class="function-signature">setupOwners(address[] _owners, uint256 _threshold)</code></a></li><li class="inherited"><a href="#OwnerManager.addOwnerWithThreshold(address,uint256)"><code class="function-signature">addOwnerWithThreshold(address owner, uint256 _threshold)</code></a></li><li class="inherited"><a href="#OwnerManager.removeOwner(address,address,uint256)"><code class="function-signature">removeOwner(address prevOwner, address owner, uint256 _threshold)</code></a></li><li class="inherited"><a href="#OwnerManager.swapOwner(address,address,address)"><code class="function-signature">swapOwner(address prevOwner, address oldOwner, address newOwner)</code></a></li><li class="inherited"><a href="#OwnerManager.changeThreshold(uint256)"><code class="function-signature">changeThreshold(uint256 _threshold)</code></a></li><li class="inherited"><a href="#OwnerManager.getThreshold()"><code class="function-signature">getThreshold()</code></a></li><li class="inherited"><a href="#OwnerManager.isOwner(address)"><code class="function-signature">isOwner(address owner)</code></a></li><li class="inherited"><a href="#OwnerManager.getOwners()"><code class="function-signature">getOwners()</code></a></li><li class="inherited"><a href="#ModuleManager.setupModules(address,bytes)"><code class="function-signature">setupModules(address to, bytes data)</code></a></li><li class="inherited"><a href="#ModuleManager.enableModule(contract Module)"><code class="function-signature">enableModule(contract Module module)</code></a></li><li class="inherited"><a href="#ModuleManager.disableModule(contract Module,contract Module)"><code class="function-signature">disableModule(contract Module prevModule, contract Module module)</code></a></li><li class="inherited"><a href="#ModuleManager.execTransactionFromModule(address,uint256,bytes,enum Enum.Operation)"><code class="function-signature">execTransactionFromModule(address to, uint256 value, bytes data, enum Enum.Operation operation)</code></a></li><li class="inherited"><a href="#ModuleManager.getModules()"><code class="function-signature">getModules()</code></a></li><li class="inherited"><a href="#Executor.execute(address,uint256,bytes,enum Enum.Operation,uint256)"><code class="function-signature">execute(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 txGas)</code></a></li><li class="inherited"><a href="#Executor.executeCall(address,uint256,bytes,uint256)"><code class="function-signature">executeCall(address to, uint256 value, bytes data, uint256 txGas)</code></a></li><li class="inherited"><a href="#Executor.executeDelegateCall(address,bytes,uint256)"><code class="function-signature">executeDelegateCall(address to, bytes data, uint256 txGas)</code></a></li><li class="inherited"><a href="#Executor.executeCreate(bytes)"><code class="function-signature">executeCreate(bytes data)</code></a></li><li class="inherited"><a href="#EtherPaymentFallback.fallback()"><code class="function-signature">fallback()</code></a></li><li class="inherited"><a href="#MasterCopy.changeMasterCopy(address)"><code class="function-signature">changeMasterCopy(address _masterCopy)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#GnosisSafe.ExecutionFailed(bytes32)"><code class="function-signature">ExecutionFailed(bytes32 txHash)</code></a></li><li class="inherited"><a href="#OwnerManager.AddedOwner(address)"><code class="function-signature">AddedOwner(address owner)</code></a></li><li class="inherited"><a href="#OwnerManager.RemovedOwner(address)"><code class="function-signature">RemovedOwner(address owner)</code></a></li><li class="inherited"><a href="#OwnerManager.ChangedThreshold(uint256)"><code class="function-signature">ChangedThreshold(uint256 threshold)</code></a></li><li class="inherited"><a href="#ModuleManager.EnabledModule(contract Module)"><code class="function-signature">EnabledModule(contract Module module)</code></a></li><li class="inherited"><a href="#ModuleManager.DisabledModule(contract Module)"><code class="function-signature">DisabledModule(contract Module module)</code></a></li><li class="inherited"><a href="#Executor.ContractCreation(address)"><code class="function-signature">ContractCreation(address newContract)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.setup(address[],uint256,address,bytes,address,uint256,address payable)"></a><code class="function-signature">setup(address[] _owners, uint256 _threshold, address to, bytes data, address paymentToken, uint256 payment, address payable paymentReceiver)</code><span class="function-visibility">external</span></h4>

Setup function sets initial storage of contract.
 @param _owners List of Safe owners.
 @param _threshold Number of required confirmations for a Safe transaction.
 @param to Contract address for optional delegate call.
 @param data Data payload for optional delegate call.
 @param paymentToken Token that should be used for the payment (0 is ETH)
 @param payment Value that should be paid
 @param paymentReceiver Adddress that should receive the payment (or 0 if tx.origin)



<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.execTransaction(address,uint256,bytes,enum Enum.Operation,uint256,uint256,uint256,address,address payable,bytes)"></a><code class="function-signature">execTransaction(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address payable refundReceiver, bytes signatures) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

Allows to execute a Safe transaction confirmed by required number of owners and then pays the account that submitted the transaction.
      Note: The fees are always transfered, even if the user transaction fails.
 @param to Destination address of Safe transaction.
 @param value Ether value of Safe transaction.
 @param data Data payload of Safe transaction.
 @param operation Operation type of Safe transaction.
 @param safeTxGas Gas that should be used for the Safe transaction.
 @param baseGas Gas costs for that are indipendent of the transaction execution(e.g. base transaction fee, signature check, payment of the refund)
 @param gasPrice Gas price that should be used for the payment calculation.
 @param gasToken Token address (or 0 if ETH) that is used for the payment.
 @param refundReceiver Address of receiver of gas payment (or 0 if tx.origin).
 @param signatures Packed signature data ({bytes32 r}{bytes32 s}{uint8 v})



<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.checkSignatures(bytes32,bytes,bytes,bool)"></a><code class="function-signature">checkSignatures(bytes32 dataHash, bytes data, bytes signatures, bool consumeHash)</code><span class="function-visibility">internal</span></h4>

Checks whether the signature provided is valid for the provided data, hash. Will revert otherwise.




<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.requiredTxGas(address,uint256,bytes,enum Enum.Operation)"></a><code class="function-signature">requiredTxGas(address to, uint256 value, bytes data, enum Enum.Operation operation) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Allows to estimate a Safe transaction.
      This method is only meant for estimation purpose, therfore two different protection mechanism against execution in a transaction have been made:
      1.) The method can only be called from the safe itself
      2.) The response is returned with a revert
      When estimating set `from` to the address of the safe.
      Since the `estimateGas` function includes refunds, call this method to get an estimated of the costs that are deducted from the safe with [`execTransaction`](.#GnosisSafe.execTransaction(address,uint256,bytes,enum%20Enum.Operation,uint256,uint256,uint256,address,address%20payable,bytes))
 @param to Destination address of Safe transaction.
 @param value Ether value of Safe transaction.
 @param data Data payload of Safe transaction.
 @param operation Operation type of Safe transaction.
 @return Estimate without refunds and overhead fees (base transaction and payload data gas costs).



<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.approveHash(bytes32)"></a><code class="function-signature">approveHash(bytes32 hashToApprove)</code><span class="function-visibility">external</span></h4>

Marks a hash as approved. This can be used to validate a hash that is used by a signature.




<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.signMessage(bytes)"></a><code class="function-signature">signMessage(bytes _data)</code><span class="function-visibility">external</span></h4>

Marks a message as signed




<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.isValidSignature(bytes,bytes)"></a><code class="function-signature">isValidSignature(bytes _data, bytes _signature) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Should return whether the signature provided is valid for the provided data




<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.getMessageHash(bytes)"></a><code class="function-signature">getMessageHash(bytes message) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>

Returns hash of a message that can be signed by owners.
 @param message Message that should be hashed
 @return Message hash.



<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.encodeTransactionData(address,uint256,bytes,enum Enum.Operation,uint256,uint256,uint256,address,address,uint256)"></a><code class="function-signature">encodeTransactionData(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Returns the bytes that are hashed to be signed by owners.
 @param to Destination address.
 @param value Ether value.
 @param data Data payload.
 @param operation Operation type.
 @param safeTxGas Fas that should be used for the safe transaction.
 @param baseGas Gas costs for data used to trigger the safe transaction.
 @param gasPrice Maximum gas price that should be used for this transaction.
 @param gasToken Token address (or 0 if ETH) that is used for the payment.
 @param refundReceiver Address of receiver of gas payment (or 0 if tx.origin).
 @param _nonce Transaction nonce.
 @return Transaction hash bytes.



<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.getTransactionHash(address,uint256,bytes,enum Enum.Operation,uint256,uint256,uint256,address,address,uint256)"></a><code class="function-signature">getTransactionHash(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, uint256 _nonce) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>

Returns hash to be signed by owners.
 @param to Destination address.
 @param value Ether value.
 @param data Data payload.
 @param operation Operation type.
 @param safeTxGas Fas that should be used for the safe transaction.
 @param baseGas Gas costs for data used to trigger the safe transaction.
 @param gasPrice Maximum gas price that should be used for this transaction.
 @param gasToken Token address (or 0 if ETH) that is used for the payment.
 @param refundReceiver Address of receiver of gas payment (or 0 if tx.origin).
 @param _nonce Transaction nonce.
 @return Transaction hash.





<h4><a class="anchor" aria-hidden="true" id="GnosisSafe.ExecutionFailed(bytes32)"></a><code class="function-signature">ExecutionFailed(bytes32 txHash)</code><span class="function-visibility"></span></h4>





### `ISignatureValidator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ISignatureValidator.isValidSignature(bytes,bytes)"><code class="function-signature">isValidSignature(bytes _data, bytes _signature)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ISignatureValidator.isValidSignature(bytes,bytes)"></a><code class="function-signature">isValidSignature(bytes _data, bytes _signature) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Should return whether the signature provided is valid for the provided data






### `MasterCopy`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MasterCopy.changeMasterCopy(address)"><code class="function-signature">changeMasterCopy(address _masterCopy)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MasterCopy.changeMasterCopy(address)"></a><code class="function-signature">changeMasterCopy(address _masterCopy)</code><span class="function-visibility">public</span></h4>

Allows to upgrade the contract. This can only be done via a Safe transaction.
 @param _masterCopy New contract address.





### `Module`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Module.setManager()"><code class="function-signature">setManager()</code></a></li><li class="inherited"><a href="#MasterCopy.changeMasterCopy(address)"><code class="function-signature">changeMasterCopy(address _masterCopy)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Module.setManager()"></a><code class="function-signature">setManager()</code><span class="function-visibility">internal</span></h4>







### `ModuleManager`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ModuleManager.setupModules(address,bytes)"><code class="function-signature">setupModules(address to, bytes data)</code></a></li><li><a href="#ModuleManager.enableModule(contract Module)"><code class="function-signature">enableModule(contract Module module)</code></a></li><li><a href="#ModuleManager.disableModule(contract Module,contract Module)"><code class="function-signature">disableModule(contract Module prevModule, contract Module module)</code></a></li><li><a href="#ModuleManager.execTransactionFromModule(address,uint256,bytes,enum Enum.Operation)"><code class="function-signature">execTransactionFromModule(address to, uint256 value, bytes data, enum Enum.Operation operation)</code></a></li><li><a href="#ModuleManager.getModules()"><code class="function-signature">getModules()</code></a></li><li class="inherited"><a href="#Executor.execute(address,uint256,bytes,enum Enum.Operation,uint256)"><code class="function-signature">execute(address to, uint256 value, bytes data, enum Enum.Operation operation, uint256 txGas)</code></a></li><li class="inherited"><a href="#Executor.executeCall(address,uint256,bytes,uint256)"><code class="function-signature">executeCall(address to, uint256 value, bytes data, uint256 txGas)</code></a></li><li class="inherited"><a href="#Executor.executeDelegateCall(address,bytes,uint256)"><code class="function-signature">executeDelegateCall(address to, bytes data, uint256 txGas)</code></a></li><li class="inherited"><a href="#Executor.executeCreate(bytes)"><code class="function-signature">executeCreate(bytes data)</code></a></li><li class="inherited"><a href="#EtherPaymentFallback.fallback()"><code class="function-signature">fallback()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ModuleManager.EnabledModule(contract Module)"><code class="function-signature">EnabledModule(contract Module module)</code></a></li><li><a href="#ModuleManager.DisabledModule(contract Module)"><code class="function-signature">DisabledModule(contract Module module)</code></a></li><li class="inherited"><a href="#Executor.ContractCreation(address)"><code class="function-signature">ContractCreation(address newContract)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ModuleManager.setupModules(address,bytes)"></a><code class="function-signature">setupModules(address to, bytes data)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ModuleManager.enableModule(contract Module)"></a><code class="function-signature">enableModule(contract Module module)</code><span class="function-visibility">public</span></h4>

Allows to add a module to the whitelist.
      This can only be done via a Safe transaction.
 @param module Module to be whitelisted.



<h4><a class="anchor" aria-hidden="true" id="ModuleManager.disableModule(contract Module,contract Module)"></a><code class="function-signature">disableModule(contract Module prevModule, contract Module module)</code><span class="function-visibility">public</span></h4>

Allows to remove a module from the whitelist.
      This can only be done via a Safe transaction.
 @param prevModule Module that pointed to the module to be removed in the linked list
 @param module Module to be removed.



<h4><a class="anchor" aria-hidden="true" id="ModuleManager.execTransactionFromModule(address,uint256,bytes,enum Enum.Operation)"></a><code class="function-signature">execTransactionFromModule(address to, uint256 value, bytes data, enum Enum.Operation operation) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Allows a Module to execute a Safe transaction without any further confirmations.
 @param to Destination address of module transaction.
 @param value Ether value of module transaction.
 @param data Data payload of module transaction.
 @param operation Operation type of module transaction.



<h4><a class="anchor" aria-hidden="true" id="ModuleManager.getModules()"></a><code class="function-signature">getModules() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">public</span></h4>

Returns array of modules.
 @return Array of modules.





<h4><a class="anchor" aria-hidden="true" id="ModuleManager.EnabledModule(contract Module)"></a><code class="function-signature">EnabledModule(contract Module module)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ModuleManager.DisabledModule(contract Module)"></a><code class="function-signature">DisabledModule(contract Module module)</code><span class="function-visibility"></span></h4>





### `OwnerManager`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#OwnerManager.setupOwners(address[],uint256)"><code class="function-signature">setupOwners(address[] _owners, uint256 _threshold)</code></a></li><li><a href="#OwnerManager.addOwnerWithThreshold(address,uint256)"><code class="function-signature">addOwnerWithThreshold(address owner, uint256 _threshold)</code></a></li><li><a href="#OwnerManager.removeOwner(address,address,uint256)"><code class="function-signature">removeOwner(address prevOwner, address owner, uint256 _threshold)</code></a></li><li><a href="#OwnerManager.swapOwner(address,address,address)"><code class="function-signature">swapOwner(address prevOwner, address oldOwner, address newOwner)</code></a></li><li><a href="#OwnerManager.changeThreshold(uint256)"><code class="function-signature">changeThreshold(uint256 _threshold)</code></a></li><li><a href="#OwnerManager.getThreshold()"><code class="function-signature">getThreshold()</code></a></li><li><a href="#OwnerManager.isOwner(address)"><code class="function-signature">isOwner(address owner)</code></a></li><li><a href="#OwnerManager.getOwners()"><code class="function-signature">getOwners()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#OwnerManager.AddedOwner(address)"><code class="function-signature">AddedOwner(address owner)</code></a></li><li><a href="#OwnerManager.RemovedOwner(address)"><code class="function-signature">RemovedOwner(address owner)</code></a></li><li><a href="#OwnerManager.ChangedThreshold(uint256)"><code class="function-signature">ChangedThreshold(uint256 threshold)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="OwnerManager.setupOwners(address[],uint256)"></a><code class="function-signature">setupOwners(address[] _owners, uint256 _threshold)</code><span class="function-visibility">internal</span></h4>

Setup function sets initial storage of contract.
 @param _owners List of Safe owners.
 @param _threshold Number of required confirmations for a Safe transaction.



<h4><a class="anchor" aria-hidden="true" id="OwnerManager.addOwnerWithThreshold(address,uint256)"></a><code class="function-signature">addOwnerWithThreshold(address owner, uint256 _threshold)</code><span class="function-visibility">public</span></h4>

Allows to add a new owner to the Safe and update the threshold at the same time.
      This can only be done via a Safe transaction.
 @param owner New owner address.
 @param _threshold New threshold.



<h4><a class="anchor" aria-hidden="true" id="OwnerManager.removeOwner(address,address,uint256)"></a><code class="function-signature">removeOwner(address prevOwner, address owner, uint256 _threshold)</code><span class="function-visibility">public</span></h4>

Allows to remove an owner from the Safe and update the threshold at the same time.
      This can only be done via a Safe transaction.
 @param prevOwner Owner that pointed to the owner to be removed in the linked list
 @param owner Owner address to be removed.
 @param _threshold New threshold.



<h4><a class="anchor" aria-hidden="true" id="OwnerManager.swapOwner(address,address,address)"></a><code class="function-signature">swapOwner(address prevOwner, address oldOwner, address newOwner)</code><span class="function-visibility">public</span></h4>

Allows to swap/replace an owner from the Safe with another address.
      This can only be done via a Safe transaction.
 @param prevOwner Owner that pointed to the owner to be replaced in the linked list
 @param oldOwner Owner address to be replaced.
 @param newOwner New owner address.



<h4><a class="anchor" aria-hidden="true" id="OwnerManager.changeThreshold(uint256)"></a><code class="function-signature">changeThreshold(uint256 _threshold)</code><span class="function-visibility">public</span></h4>

Allows to update the number of required confirmations by Safe owners.
      This can only be done via a Safe transaction.
 @param _threshold New threshold.



<h4><a class="anchor" aria-hidden="true" id="OwnerManager.getThreshold()"></a><code class="function-signature">getThreshold() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OwnerManager.isOwner(address)"></a><code class="function-signature">isOwner(address owner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OwnerManager.getOwners()"></a><code class="function-signature">getOwners() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">public</span></h4>

Returns array of owners.
 @return Array of Safe owners.





<h4><a class="anchor" aria-hidden="true" id="OwnerManager.AddedOwner(address)"></a><code class="function-signature">AddedOwner(address owner)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="OwnerManager.RemovedOwner(address)"></a><code class="function-signature">RemovedOwner(address owner)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="OwnerManager.ChangedThreshold(uint256)"></a><code class="function-signature">ChangedThreshold(uint256 threshold)</code><span class="function-visibility"></span></h4>





### `SafeMath`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMath.mul(uint256,uint256)"><code class="function-signature">mul(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMath.div(uint256,uint256)"><code class="function-signature">div(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMath.sub(uint256,uint256)"><code class="function-signature">sub(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMath.add(uint256,uint256)"><code class="function-signature">add(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMath.mod(uint256,uint256)"><code class="function-signature">mod(uint256 a, uint256 b)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SafeMath.mul(uint256,uint256)"></a><code class="function-signature">mul(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Multiplies two numbers, reverts on overflow.



<h4><a class="anchor" aria-hidden="true" id="SafeMath.div(uint256,uint256)"></a><code class="function-signature">div(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Integer division of two numbers truncating the quotient, reverts on division by zero.



<h4><a class="anchor" aria-hidden="true" id="SafeMath.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).



<h4><a class="anchor" aria-hidden="true" id="SafeMath.add(uint256,uint256)"></a><code class="function-signature">add(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Adds two numbers, reverts on overflow.



<h4><a class="anchor" aria-hidden="true" id="SafeMath.mod(uint256,uint256)"></a><code class="function-signature">mod(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Divides two numbers and returns the remainder (unsigned integer modulo),
reverts when dividing by zero.





### `SecuredTokenTransfer`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SecuredTokenTransfer.transferToken(address,address,uint256)"><code class="function-signature">transferToken(address token, address receiver, uint256 amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SecuredTokenTransfer.transferToken(address,address,uint256)"></a><code class="function-signature">transferToken(address token, address receiver, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Transfers a token and returns if it was a success
 @param token Token that should be transferred
 @param receiver Receiver to whom the token should be transferred
 @param amount The amount of tokens that should be transferred





### `SelfAuthorized`



<div class="contract-index"></div>





### `SignatureDecoder`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SignatureDecoder.recoverKey(bytes32,bytes,uint256)"><code class="function-signature">recoverKey(bytes32 messageHash, bytes messageSignature, uint256 pos)</code></a></li><li><a href="#SignatureDecoder.signatureSplit(bytes,uint256)"><code class="function-signature">signatureSplit(bytes signatures, uint256 pos)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SignatureDecoder.recoverKey(bytes32,bytes,uint256)"></a><code class="function-signature">recoverKey(bytes32 messageHash, bytes messageSignature, uint256 pos) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

Recovers address who signed the message
 @param messageHash operation ethereum signed message hash
 @param messageSignature message `txHash` signature
 @param pos which signature to read



<h4><a class="anchor" aria-hidden="true" id="SignatureDecoder.signatureSplit(bytes,uint256)"></a><code class="function-signature">signatureSplit(bytes signatures, uint256 pos) <span class="return-arrow">→</span> <span class="return-type">uint8,bytes32,bytes32</span></code><span class="function-visibility">internal</span></h4>

divides bytes signature into `uint8 v, bytes32 r, bytes32 s`.
 @notice Make sure to peform a bounds check for @param pos, to avoid out of bounds access on @param signatures
 @param pos which signature to read. A prior bounds check of this parameter should be performed, to avoid out of bounds access
 @param signatures concatenated rsv signatures





### `DelegationTarget`



<div class="contract-index"></div>





### `ERC777`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li><a href="#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li><a href="#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li><a href="#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li><a href="#ERC777.transfer(address,uint256)"><code class="function-signature">transfer(address recipient, uint256 amount)</code></a></li><li><a href="#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li><a href="#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li><a href="#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li><a href="#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li><a href="#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li><a href="#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li><a href="#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li><a href="#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li><a href="#ERC777.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount)</code></a></li><li><a href="#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li><a href="#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li><a href="#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li><li><a href="#ERC777.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777.initialize1820InterfaceImplementations()"></a><code class="function-signature">initialize1820InterfaceImplementations() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777.granularity()"></a><code class="function-signature">granularity() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

See [`IERC777.granularity`](trading#IERC777.granularity()).

This implementation always returns `1`.



<h4><a class="anchor" aria-hidden="true" id="ERC777.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

See [`IERC777.totalSupply`](trading#IERC777.totalSupply()).



<h4><a class="anchor" aria-hidden="true" id="ERC777.balanceOf(address)"></a><code class="function-signature">balanceOf(address tokenHolder) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

Returns the amount of tokens owned by an account (`tokenHolder`).



<h4><a class="anchor" aria-hidden="true" id="ERC777.send(address,uint256,bytes)"></a><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code><span class="function-visibility">external</span></h4>

See [`IERC777.send`](trading#IERC777.send(address,uint256,bytes)).

Also emits a [`Transfer`](trading#ERC777.Transfer(address,address,uint256)) event for ERC20 compatibility.



<h4><a class="anchor" aria-hidden="true" id="ERC777.transfer(address,uint256)"></a><code class="function-signature">transfer(address recipient, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See [`IERC20.transfer`](utility#IERC20.transfer(address,uint256)).

Unlike [`send`](trading#ERC777.send(address,uint256,bytes)), `recipient` is _not_ required to implement the `tokensReceived`
interface if it is a contract.

Also emits a [`Sent`](trading#ERC777.Sent(address,address,address,uint256,bytes,bytes)) event.



<h4><a class="anchor" aria-hidden="true" id="ERC777._transfer(address,address,uint256,bool)"></a><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777.isOperatorFor(address,address)"></a><code class="function-signature">isOperatorFor(address operator, address tokenHolder) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See [`IERC777.isOperatorFor`](trading#IERC777.isOperatorFor(address,address)).



<h4><a class="anchor" aria-hidden="true" id="ERC777.authorizeOperator(address)"></a><code class="function-signature">authorizeOperator(address operator)</code><span class="function-visibility">external</span></h4>

See [`IERC777.authorizeOperator`](trading#IERC777.authorizeOperator(address)).



<h4><a class="anchor" aria-hidden="true" id="ERC777.revokeOperator(address)"></a><code class="function-signature">revokeOperator(address operator)</code><span class="function-visibility">external</span></h4>

See [`IERC777.revokeOperator`](trading#IERC777.revokeOperator(address)).



<h4><a class="anchor" aria-hidden="true" id="ERC777.defaultOperators()"></a><code class="function-signature">defaultOperators() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">public</span></h4>

See [`IERC777.defaultOperators`](trading#IERC777.defaultOperators()).



<h4><a class="anchor" aria-hidden="true" id="ERC777.operatorSend(address,address,uint256,bytes,bytes)"></a><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code><span class="function-visibility">external</span></h4>

See [`IERC777.operatorSend`](trading#IERC777.operatorSend(address,address,uint256,bytes,bytes)).

Emits [`Sent`](trading#ERC777.Sent(address,address,address,uint256,bytes,bytes)) and [`Transfer`](trading#ERC777.Transfer(address,address,uint256)) events.



<h4><a class="anchor" aria-hidden="true" id="ERC777.allowance(address,address)"></a><code class="function-signature">allowance(address holder, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

See [`IERC20.allowance`](utility#IERC20.allowance(address,address)).

Note that operator and allowance concepts are orthogonal: operators may
not have allowance, and accounts with allowance may not be operators
themselves.



<h4><a class="anchor" aria-hidden="true" id="ERC777.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See [`IERC20.approve`](utility#IERC20.approve(address,uint256)).

Note that accounts cannot have allowance issued by their operators.



<h4><a class="anchor" aria-hidden="true" id="ERC777.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See [`IERC20.transferFrom`](utility#IERC20.transferFrom(address,address,uint256)).

Note that operator and allowance concepts are orthogonal: operators cannot
call [`transferFrom`](trading#ERC777.transferFrom(address,address,uint256)) (unless they have allowance), and accounts with
allowance cannot call [`operatorSend`](trading#ERC777.operatorSend(address,address,uint256,bytes,bytes)) (unless they are operators).

Emits [`Sent`](trading#ERC777.Sent(address,address,address,uint256,bytes,bytes)) and [`Transfer`](trading#ERC777.Transfer(address,address,uint256)) events.



<h4><a class="anchor" aria-hidden="true" id="ERC777._mint(address,address,uint256,bytes,bytes,bool)"></a><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code><span class="function-visibility">internal</span></h4>

Creates `amount` tokens and assigns them to `account`, increasing
the total supply.

If a send hook is registered for `raccount`, the corresponding function
will be called with `operator`, `data` and `operatorData`.

See [`IERC777Sender`](trading#ierc777sender) and [`IERC777Recipient`](trading#ierc777recipient).

Emits [`Sent`](trading#ERC777.Sent(address,address,address,uint256,bytes,bytes)) and [`Transfer`](trading#ERC777.Transfer(address,address,uint256)) events.

Requirements

- `account` cannot be the zero address.
- if `account` is a contract, it must implement the `tokensReceived`
interface.



<h4><a class="anchor" aria-hidden="true" id="ERC777._burn(address,address,uint256,bytes,bytes,bool)"></a><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code><span class="function-visibility">internal</span></h4>

Burn tokens




<h4><a class="anchor" aria-hidden="true" id="ERC777._approve(address,address,uint256)"></a><code class="function-signature">_approve(address holder, address spender, uint256 value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>







### `IERC1820Registry`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC1820Registry.setManager(address,address)"><code class="function-signature">setManager(address account, address newManager)</code></a></li><li><a href="#IERC1820Registry.getManager(address)"><code class="function-signature">getManager(address account)</code></a></li><li><a href="#IERC1820Registry.setInterfaceImplementer(address,bytes32,address)"><code class="function-signature">setInterfaceImplementer(address account, bytes32 interfaceHash, address implementer)</code></a></li><li><a href="#IERC1820Registry.getInterfaceImplementer(address,bytes32)"><code class="function-signature">getInterfaceImplementer(address account, bytes32 interfaceHash)</code></a></li><li><a href="#IERC1820Registry.interfaceHash(string)"><code class="function-signature">interfaceHash(string interfaceName)</code></a></li><li><a href="#IERC1820Registry.updateERC165Cache(address,bytes4)"><code class="function-signature">updateERC165Cache(address account, bytes4 interfaceId)</code></a></li><li><a href="#IERC1820Registry.implementsERC165Interface(address,bytes4)"><code class="function-signature">implementsERC165Interface(address account, bytes4 interfaceId)</code></a></li><li><a href="#IERC1820Registry.implementsERC165InterfaceNoCache(address,bytes4)"><code class="function-signature">implementsERC165InterfaceNoCache(address account, bytes4 interfaceId)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC1820Registry.InterfaceImplementerSet(address,bytes32,address)"><code class="function-signature">InterfaceImplementerSet(address account, bytes32 interfaceHash, address implementer)</code></a></li><li><a href="#IERC1820Registry.ManagerChanged(address,address)"><code class="function-signature">ManagerChanged(address account, address newManager)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.setManager(address,address)"></a><code class="function-signature">setManager(address account, address newManager)</code><span class="function-visibility">external</span></h4>

Sets `newManager` as the manager for `account`. A manager of an
account is able to set interface implementers for it.

By default, each account is its own manager. Passing a value of `0x0` in
`newManager` will reset the manager to this initial state.

Emits a [`ManagerChanged`](trading#IERC1820Registry.ManagerChanged(address,address)) event.

Requirements:

- the caller must be the current manager for `account`.



<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.getManager(address)"></a><code class="function-signature">getManager(address account) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Returns the manager for `account`.

See [`setManager`](trading#IERC1820Registry.setManager(address,address)).



<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.setInterfaceImplementer(address,bytes32,address)"></a><code class="function-signature">setInterfaceImplementer(address account, bytes32 interfaceHash, address implementer)</code><span class="function-visibility">external</span></h4>

Sets the `implementer` contract as `account`&#x27;s implementer for
[`interfaceHash`](trading#IERC1820Registry.interfaceHash(string)).

`account` being the zero address is an alias for the caller&#x27;s address.
The zero address can also be used in `implementer` to remove an old one.

See [`interfaceHash`](trading#IERC1820Registry.interfaceHash(string)) to learn how these are created.

Emits an [`InterfaceImplementerSet`](trading#IERC1820Registry.InterfaceImplementerSet(address,bytes32,address)) event.

Requirements:

- the caller must be the current manager for `account`.
- [`interfaceHash`](trading#IERC1820Registry.interfaceHash(string)) must not be an `IERC165` interface id (i.e. it must not
end in 28 zeroes).
- `implementer` must implement [`IERC1820Implementer`](libraries#ierc1820implementer) and return true when
queried for support, unless `implementer` is the caller. See
[`IERC1820Implementer.canImplementInterfaceForAddress`](libraries#IERC1820Implementer.canImplementInterfaceForAddress(bytes32,address)).



<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.getInterfaceImplementer(address,bytes32)"></a><code class="function-signature">getInterfaceImplementer(address account, bytes32 interfaceHash) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Returns the implementer of [`interfaceHash`](trading#IERC1820Registry.interfaceHash(string)) for `account`. If no such
implementer is registered, returns the zero address.

If [`interfaceHash`](trading#IERC1820Registry.interfaceHash(string)) is an `IERC165` interface id (i.e. it ends with 28
zeroes), `account` will be queried for support of it.

`account` being the zero address is an alias for the caller&#x27;s address.



<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.interfaceHash(string)"></a><code class="function-signature">interfaceHash(string interfaceName) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>

Returns the interface hash for an `interfaceName`, as defined in the
corresponding
[section of the EIP](https://eips.ethereum.org/EIPS/eip-1820#interface-name).



<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.updateERC165Cache(address,bytes4)"></a><code class="function-signature">updateERC165Cache(address account, bytes4 interfaceId)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.implementsERC165Interface(address,bytes4)"></a><code class="function-signature">implementsERC165Interface(address account, bytes4 interfaceId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.implementsERC165InterfaceNoCache(address,bytes4)"></a><code class="function-signature">implementsERC165InterfaceNoCache(address account, bytes4 interfaceId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.InterfaceImplementerSet(address,bytes32,address)"></a><code class="function-signature">InterfaceImplementerSet(address account, bytes32 interfaceHash, address implementer)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.ManagerChanged(address,address)"></a><code class="function-signature">ManagerChanged(address account, address newManager)</code><span class="function-visibility"></span></h4>





### `IERC777`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li><a href="#IERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IERC777.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#IERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li><a href="#IERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li><a href="#IERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li><a href="#IERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li><a href="#IERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li><a href="#IERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li><a href="#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li><a href="#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li><a href="#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li><a href="#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC777.granularity()"></a><code class="function-signature">granularity() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns the smallest part of the token that is not divisible. This
means all token operations (creation, movement and destruction) must have
amounts that are a multiple of this number.

For most token contracts, this value will equal 1.



<h4><a class="anchor" aria-hidden="true" id="IERC777.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns the amount of tokens in existence.



<h4><a class="anchor" aria-hidden="true" id="IERC777.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns the amount of tokens owned by an account (`owner`).



<h4><a class="anchor" aria-hidden="true" id="IERC777.send(address,uint256,bytes)"></a><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code><span class="function-visibility">external</span></h4>

Moves `amount` tokens from the caller&#x27;s account to `recipient`.

If send or receive hooks are registered for the caller and `recipient`,
the corresponding functions will be called with `data` and empty
`operatorData`. See [`IERC777Sender`](trading#ierc777sender) and [`IERC777Recipient`](trading#ierc777recipient).

Emits a [`Sent`](trading#IERC777.Sent(address,address,address,uint256,bytes,bytes)) event.

Requirements

- the caller must have at least `amount` tokens.
- `recipient` cannot be the zero address.
- if `recipient` is a contract, it must implement the `tokensReceived`
interface.



<h4><a class="anchor" aria-hidden="true" id="IERC777.isOperatorFor(address,address)"></a><code class="function-signature">isOperatorFor(address operator, address tokenHolder) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

Returns true if an account is an operator of `tokenHolder`.
Operators can send and burn tokens on behalf of their owners. All
accounts are their own operator.

See [`operatorSend`](trading#IERC777.operatorSend(address,address,uint256,bytes,bytes)) and `operatorBurn`.



<h4><a class="anchor" aria-hidden="true" id="IERC777.authorizeOperator(address)"></a><code class="function-signature">authorizeOperator(address operator)</code><span class="function-visibility">external</span></h4>

Make an account an operator of the caller.

See [`isOperatorFor`](trading#IERC777.isOperatorFor(address,address)).

Emits an [`AuthorizedOperator`](trading#IERC777.AuthorizedOperator(address,address)) event.

Requirements

- `operator` cannot be calling address.



<h4><a class="anchor" aria-hidden="true" id="IERC777.revokeOperator(address)"></a><code class="function-signature">revokeOperator(address operator)</code><span class="function-visibility">external</span></h4>

Make an account an operator of the caller.

See [`isOperatorFor`](trading#IERC777.isOperatorFor(address,address)) and [`defaultOperators`](trading#IERC777.defaultOperators()).

Emits a [`RevokedOperator`](trading#IERC777.RevokedOperator(address,address)) event.

Requirements

- `operator` cannot be calling address.



<h4><a class="anchor" aria-hidden="true" id="IERC777.defaultOperators()"></a><code class="function-signature">defaultOperators() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">external</span></h4>

Returns the list of default operators. These accounts are operators
for all token holders, even if [`authorizeOperator`](trading#IERC777.authorizeOperator(address)) was never called on
them.

This list is immutable, but individual holders may revoke these via
[`revokeOperator`](trading#IERC777.revokeOperator(address)), in which case [`isOperatorFor`](trading#IERC777.isOperatorFor(address,address)) will return false.



<h4><a class="anchor" aria-hidden="true" id="IERC777.operatorSend(address,address,uint256,bytes,bytes)"></a><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code><span class="function-visibility">external</span></h4>

Moves `amount` tokens from `sender` to `recipient`. The caller must
be an operator of `sender`.

If send or receive hooks are registered for `sender` and `recipient`,
the corresponding functions will be called with `data` and
`operatorData`. See [`IERC777Sender`](trading#ierc777sender) and [`IERC777Recipient`](trading#ierc777recipient).

Emits a [`Sent`](trading#IERC777.Sent(address,address,address,uint256,bytes,bytes)) event.

Requirements

- `sender` cannot be the zero address.
- `sender` must have at least `amount` tokens.
- the caller must be an operator for `sender`.
- `recipient` cannot be the zero address.
- if `recipient` is a contract, it must implement the `tokensReceived`
interface.





<h4><a class="anchor" aria-hidden="true" id="IERC777.Sent(address,address,address,uint256,bytes,bytes)"></a><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC777.Minted(address,address,uint256,bytes,bytes)"></a><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC777.Burned(address,address,uint256,bytes,bytes)"></a><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC777.AuthorizedOperator(address,address)"></a><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC777.RevokedOperator(address,address)"></a><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code><span class="function-visibility"></span></h4>





### `IERC777Recipient`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC777Recipient.tokensReceived(address,address,address,uint256,bytes,bytes)"><code class="function-signature">tokensReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC777Recipient.tokensReceived(address,address,address,uint256,bytes,bytes)"></a><code class="function-signature">tokensReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData)</code><span class="function-visibility">external</span></h4>

Called by an [`IERC777`](trading#ierc777) token contract whenever tokens are being
moved or created into a registered account (`to`). The type of operation
is conveyed by `from` being the zero address or not.

This call occurs _after_ the token contract&#x27;s state is updated, so
[`IERC777.balanceOf`](trading#IERC777.balanceOf(address)), etc., can be used to query the post-operation state.

This function may revert to prevent the operation from being executed.





### `IERC777Sender`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC777Sender.tokensToSend(address,address,address,uint256,bytes,bytes)"><code class="function-signature">tokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC777Sender.tokensToSend(address,address,address,uint256,bytes,bytes)"></a><code class="function-signature">tokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData)</code><span class="function-visibility">external</span></h4>

Called by an [`IERC777`](trading#ierc777) token contract whenever a registered holder&#x27;s
(`from`) tokens are about to be moved or destroyed. The type of operation
is conveyed by `to` being the zero address or not.

This call occurs _before_ the token contract&#x27;s state is updated, so
[`IERC777.balanceOf`](trading#IERC777.balanceOf(address)), etc., can be used to query the pre-operation state.

This function may revert to prevent the operation from being executed.





### `Initializable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Initializable.endInitialization()"></a><code class="function-signature">endInitialization()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Initializable.getInitialized()"></a><code class="function-signature">getInitialized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `LegacyReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LegacyReputationToken.initializeERC1820(contract IAugur)"><code class="function-signature">initializeERC1820(contract IAugur _augur)</code></a></li><li><a href="#LegacyReputationToken.faucet(uint256)"><code class="function-signature">faucet(uint256 _amount)</code></a></li><li><a href="#LegacyReputationToken.onMint(address,uint256)"><code class="function-signature">onMint(address, uint256)</code></a></li><li><a href="#LegacyReputationToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address, uint256)</code></a></li><li><a href="#LegacyReputationToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address, address, uint256)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.initialize(contract IUniverse)"><code class="function-signature">initialize(contract IUniverse _universe)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.migrateOut(contract IReputationToken,uint256)"><code class="function-signature">migrateOut(contract IReputationToken _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _value)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.getTypeName()"><code class="function-signature">getTypeName()</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.getLegacyRepToken()"><code class="function-signature">getLegacyRepToken()</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.updateSiblingMigrationTotal(contract IReputationToken)"><code class="function-signature">updateSiblingMigrationTotal(contract IReputationToken _token)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.updateParentTotalTheoreticalSupply()"><code class="function-signature">updateParentTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.migrateBalancesFromLegacyRep(address[])"><code class="function-signature">migrateBalancesFromLegacyRep(address[] _holders)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.migrateAllowancesFromLegacyRep(address[],address[])"><code class="function-signature">migrateAllowancesFromLegacyRep(address[] _owners, address[] _spenders)</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.getIsMigratingFromLegacy()"><code class="function-signature">getIsMigratingFromLegacy()</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.getTargetSupply()"><code class="function-signature">getTargetSupply()</code></a></li><li class="inherited"><a href="#OldLegacyReputationToken.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li class="inherited"><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li class="inherited"><a href="#StandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.internalNoHooksTransfer(address,address,uint256)"><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li class="inherited"><a href="#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li class="inherited"><a href="#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li class="inherited"><a href="#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li class="inherited"><a href="#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li class="inherited"><a href="#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#LegacyReputationToken.FundedAccount(address,address,uint256,uint256)"><code class="function-signature">FundedAccount(address _universe, address _sender, uint256 _repBalance, uint256 _timestamp)</code></a></li><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LegacyReputationToken.initializeERC1820(contract IAugur)"></a><code class="function-signature">initializeERC1820(contract IAugur _augur) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LegacyReputationToken.faucet(uint256)"></a><code class="function-signature">faucet(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LegacyReputationToken.onMint(address,uint256)"></a><code class="function-signature">onMint(address, uint256)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LegacyReputationToken.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address, uint256)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LegacyReputationToken.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address, address, uint256)</code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="LegacyReputationToken.FundedAccount(address,address,uint256,uint256)"></a><code class="function-signature">FundedAccount(address _universe, address _sender, uint256 _repBalance, uint256 _timestamp)</code><span class="function-visibility"></span></h4>





### `OldLegacyReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#OldLegacyReputationToken.initialize(contract IUniverse)"><code class="function-signature">initialize(contract IUniverse _universe)</code></a></li><li><a href="#OldLegacyReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li><a href="#OldLegacyReputationToken.migrateOut(contract IReputationToken,uint256)"><code class="function-signature">migrateOut(contract IReputationToken _destination, uint256 _attotokens)</code></a></li><li><a href="#OldLegacyReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li><a href="#OldLegacyReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li><a href="#OldLegacyReputationToken.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _value)</code></a></li><li><a href="#OldLegacyReputationToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _value)</code></a></li><li><a href="#OldLegacyReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#OldLegacyReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#OldLegacyReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#OldLegacyReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#OldLegacyReputationToken.getTypeName()"><code class="function-signature">getTypeName()</code></a></li><li><a href="#OldLegacyReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#OldLegacyReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li><a href="#OldLegacyReputationToken.getLegacyRepToken()"><code class="function-signature">getLegacyRepToken()</code></a></li><li><a href="#OldLegacyReputationToken.updateSiblingMigrationTotal(contract IReputationToken)"><code class="function-signature">updateSiblingMigrationTotal(contract IReputationToken _token)</code></a></li><li><a href="#OldLegacyReputationToken.updateParentTotalTheoreticalSupply()"><code class="function-signature">updateParentTotalTheoreticalSupply()</code></a></li><li><a href="#OldLegacyReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li><a href="#OldLegacyReputationToken.migrateBalancesFromLegacyRep(address[])"><code class="function-signature">migrateBalancesFromLegacyRep(address[] _holders)</code></a></li><li><a href="#OldLegacyReputationToken.migrateAllowancesFromLegacyRep(address[],address[])"><code class="function-signature">migrateAllowancesFromLegacyRep(address[] _owners, address[] _spenders)</code></a></li><li><a href="#OldLegacyReputationToken.getIsMigratingFromLegacy()"><code class="function-signature">getIsMigratingFromLegacy()</code></a></li><li><a href="#OldLegacyReputationToken.getTargetSupply()"><code class="function-signature">getTargetSupply()</code></a></li><li><a href="#OldLegacyReputationToken.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li class="inherited"><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.onMint(address,uint256)"><code class="function-signature">onMint(address, uint256)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address, uint256)</code></a></li><li class="inherited"><a href="#StandardToken.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li class="inherited"><a href="#StandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.internalNoHooksTransfer(address,address,uint256)"><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li class="inherited"><a href="#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li class="inherited"><a href="#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li class="inherited"><a href="#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li class="inherited"><a href="#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li class="inherited"><a href="#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#ERC777.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.initialize(contract IUniverse)"></a><code class="function-signature">initialize(contract IUniverse _universe)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.migrateOutByPayout(uint256[],uint256)"></a><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.migrateOut(contract IReputationToken,uint256)"></a><code class="function-signature">migrateOut(contract IReputationToken _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.migrateIn(address,uint256)"></a><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.mintForReportingParticipant(uint256)"></a><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.transfer(address,uint256)"></a><code class="function-signature">transfer(address _to, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address _from, address _to, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.trustedUniverseTransfer(address,address,uint256)"></a><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.trustedMarketTransfer(address,address,uint256)"></a><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"></a><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"></a><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.getTotalMigrated()"></a><code class="function-signature">getTotalMigrated() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.getLegacyRepToken()"></a><code class="function-signature">getLegacyRepToken() <span class="return-arrow">→</span> <span class="return-type">contract IERC20</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.updateSiblingMigrationTotal(contract IReputationToken)"></a><code class="function-signature">updateSiblingMigrationTotal(contract IReputationToken _token) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.updateParentTotalTheoreticalSupply()"></a><code class="function-signature">updateParentTotalTheoreticalSupply() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.getTotalTheoreticalSupply()"></a><code class="function-signature">getTotalTheoreticalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.migrateBalancesFromLegacyRep(address[])"></a><code class="function-signature">migrateBalancesFromLegacyRep(address[] _holders) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Copies the balance of a batch of addresses from the legacy contract




<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.migrateAllowancesFromLegacyRep(address[],address[])"></a><code class="function-signature">migrateAllowancesFromLegacyRep(address[] _owners, address[] _spenders) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Copies the allowances of a batch of addresses from the legacy contract. This is an optional step which may only be done before the migration is complete but is not required to complete it.




<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.getIsMigratingFromLegacy()"></a><code class="function-signature">getIsMigratingFromLegacy() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.getTargetSupply()"></a><code class="function-signature">getTargetSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OldLegacyReputationToken.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `StandardToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#StandardToken.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li><a href="#StandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount)</code></a></li><li><a href="#StandardToken.internalNoHooksTransfer(address,address,uint256)"><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount)</code></a></li><li><a href="#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li><a href="#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li class="inherited"><a href="#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li class="inherited"><a href="#ERC777.transfer(address,uint256)"><code class="function-signature">transfer(address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li class="inherited"><a href="#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li class="inherited"><a href="#ERC777.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li class="inherited"><a href="#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#ERC777.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="StandardToken.initialize1820InterfaceImplementations()"></a><code class="function-signature">initialize1820InterfaceImplementations() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.noHooksTransfer(address,uint256)"></a><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.internalNoHooksTransfer(address,address,uint256)"></a><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.increaseApproval(address,uint256)"></a><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.decreaseApproval(address,uint256)"></a><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `VariableSupplyToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.onMint(address,uint256)"><code class="function-signature">onMint(address, uint256)</code></a></li><li><a href="#VariableSupplyToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address, uint256)</code></a></li><li class="inherited"><a href="#StandardToken.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li class="inherited"><a href="#StandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.internalNoHooksTransfer(address,address,uint256)"><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li class="inherited"><a href="#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li class="inherited"><a href="#ERC777.transfer(address,uint256)"><code class="function-signature">transfer(address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li class="inherited"><a href="#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li class="inherited"><a href="#ERC777.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li class="inherited"><a href="#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#ERC777.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.mint(address,uint256)"></a><code class="function-signature">mint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.burn(address,uint256)"></a><code class="function-signature">burn(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onMint(address,uint256)"></a><code class="function-signature">onMint(address, uint256)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address, uint256)</code><span class="function-visibility">internal</span></h4>







### `Proxy`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Proxy.constructor(address)"><code class="function-signature">constructor(address _masterCopy)</code></a></li><li><a href="#Proxy.fallback()"><code class="function-signature">fallback()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Proxy.constructor(address)"></a><code class="function-signature">constructor(address _masterCopy)</code><span class="function-visibility">public</span></h4>

Constructor function sets address of master copy contract.
 @param _masterCopy Master copy address.



<h4><a class="anchor" aria-hidden="true" id="Proxy.fallback()"></a><code class="function-signature">fallback()</code><span class="function-visibility">external</span></h4>

Fallback function forwards all transactions and returns all received return data.





### `ProxyFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ProxyFactory.createProxy(address,bytes)"><code class="function-signature">createProxy(address masterCopy, bytes data)</code></a></li><li><a href="#ProxyFactory.proxyRuntimeCode()"><code class="function-signature">proxyRuntimeCode()</code></a></li><li><a href="#ProxyFactory.proxyCreationCode()"><code class="function-signature">proxyCreationCode()</code></a></li><li><a href="#ProxyFactory.deployProxyWithNonce(address,bytes,uint256)"><code class="function-signature">deployProxyWithNonce(address _mastercopy, bytes initializer, uint256 saltNonce)</code></a></li><li><a href="#ProxyFactory.createProxyWithNonce(address,bytes,uint256)"><code class="function-signature">createProxyWithNonce(address _mastercopy, bytes initializer, uint256 saltNonce)</code></a></li><li><a href="#ProxyFactory.calculateCreateProxyWithNonceAddress(address,bytes,uint256)"><code class="function-signature">calculateCreateProxyWithNonceAddress(address _mastercopy, bytes initializer, uint256 saltNonce)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ProxyFactory.ProxyCreation(contract Proxy)"><code class="function-signature">ProxyCreation(contract Proxy proxy)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ProxyFactory.createProxy(address,bytes)"></a><code class="function-signature">createProxy(address masterCopy, bytes data) <span class="return-arrow">→</span> <span class="return-type">contract Proxy</span></code><span class="function-visibility">public</span></h4>

Allows to create new proxy contact and execute a message call to the new proxy within one transaction.
 @param masterCopy Address of master copy.
 @param data Payload for message call sent to new proxy contract.



<h4><a class="anchor" aria-hidden="true" id="ProxyFactory.proxyRuntimeCode()"></a><code class="function-signature">proxyRuntimeCode() <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Allows to retrieve the runtime code of a deployed Proxy. This can be used to check that the expected Proxy was deployed.



<h4><a class="anchor" aria-hidden="true" id="ProxyFactory.proxyCreationCode()"></a><code class="function-signature">proxyCreationCode() <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Allows to retrieve the creation code used for the Proxy deployment. With this it is easily possible to calculate predicted address.



<h4><a class="anchor" aria-hidden="true" id="ProxyFactory.deployProxyWithNonce(address,bytes,uint256)"></a><code class="function-signature">deployProxyWithNonce(address _mastercopy, bytes initializer, uint256 saltNonce) <span class="return-arrow">→</span> <span class="return-type">contract Proxy</span></code><span class="function-visibility">internal</span></h4>

Allows to create new proxy contact using CREATE2 but it doesn&#x27;t run the initializer.
      This method is only meant as an utility to be called from other methods
 @param _mastercopy Address of master copy.
 @param initializer Payload for message call sent to new proxy contract.
 @param saltNonce Nonce that will be used to generate the salt to calculate the address of the new proxy contract.



<h4><a class="anchor" aria-hidden="true" id="ProxyFactory.createProxyWithNonce(address,bytes,uint256)"></a><code class="function-signature">createProxyWithNonce(address _mastercopy, bytes initializer, uint256 saltNonce) <span class="return-arrow">→</span> <span class="return-type">contract Proxy</span></code><span class="function-visibility">public</span></h4>

Allows to create new proxy contact and execute a message call to the new proxy within one transaction.
 @param _mastercopy Address of master copy.
 @param initializer Payload for message call sent to new proxy contract.
 @param saltNonce Nonce that will be used to generate the salt to calculate the address of the new proxy contract.



<h4><a class="anchor" aria-hidden="true" id="ProxyFactory.calculateCreateProxyWithNonceAddress(address,bytes,uint256)"></a><code class="function-signature">calculateCreateProxyWithNonceAddress(address _mastercopy, bytes initializer, uint256 saltNonce) <span class="return-arrow">→</span> <span class="return-type">contract Proxy</span></code><span class="function-visibility">external</span></h4>

Allows to get the address for a new proxy contact created via [`createProxyWithNonce`](.#ProxyFactory.createProxyWithNonce(address,bytes,uint256))
      This method is only meant for address calculation purpose when you use an initializer that would revert,
      therefore the response is returned with a revert. When calling this method set `from` to the address of the proxy factory.
 @param _mastercopy Address of master copy.
 @param initializer Payload for message call sent to new proxy contract.
 @param saltNonce Nonce that will be used to generate the salt to calculate the address of the new proxy contract.





<h4><a class="anchor" aria-hidden="true" id="ProxyFactory.ProxyCreation(contract Proxy)"></a><code class="function-signature">ProxyCreation(contract Proxy proxy)</code><span class="function-visibility"></span></h4>





### `IRepPriceOracle`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IRepPriceOracle.getRepPriceInAttoCash()"><code class="function-signature">getRepPriceInAttoCash()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IRepPriceOracle.getRepPriceInAttoCash()"></a><code class="function-signature">getRepPriceInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







### `RepPriceOracle`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#RepPriceOracle.setRepPriceInAttoCash(uint256)"><code class="function-signature">setRepPriceInAttoCash(uint256 _repPriceinAttoCash)</code></a></li><li><a href="#RepPriceOracle.getRepPriceInAttoCash()"><code class="function-signature">getRepPriceInAttoCash()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="RepPriceOracle.setRepPriceInAttoCash(uint256)"></a><code class="function-signature">setRepPriceInAttoCash(uint256 _repPriceinAttoCash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RepPriceOracle.getRepPriceInAttoCash()"></a><code class="function-signature">getRepPriceInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







### `TestNetDaiJoin`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TestNetDaiJoin.constructor(address,address)"><code class="function-signature">constructor(address vat_, address dai_)</code></a></li><li><a href="#TestNetDaiJoin.mul(uint256,uint256)"><code class="function-signature">mul(uint256 x, uint256 y)</code></a></li><li><a href="#TestNetDaiJoin.join(address,uint256)"><code class="function-signature">join(address urn, uint256 wad)</code></a></li><li><a href="#TestNetDaiJoin.exit(address,uint256)"><code class="function-signature">exit(address usr, uint256 wad)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TestNetDaiJoin.constructor(address,address)"></a><code class="function-signature">constructor(address vat_, address dai_)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiJoin.mul(uint256,uint256)"></a><code class="function-signature">mul(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiJoin.join(address,uint256)"></a><code class="function-signature">join(address urn, uint256 wad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiJoin.exit(address,uint256)"></a><code class="function-signature">exit(address usr, uint256 wad)</code><span class="function-visibility">public</span></h4>







### `IDaiPot`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiPot.drip()"><code class="function-signature">drip()</code></a></li><li><a href="#IDaiPot.join(uint256)"><code class="function-signature">join(uint256 wad)</code></a></li><li><a href="#IDaiPot.exit(uint256)"><code class="function-signature">exit(uint256 wad)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiPot.drip()"></a><code class="function-signature">drip()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiPot.join(uint256)"></a><code class="function-signature">join(uint256 wad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiPot.exit(uint256)"></a><code class="function-signature">exit(uint256 wad)</code><span class="function-visibility">public</span></h4>







### `TestNetDaiPot`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TestNetDaiPot.constructor(address,contract ITime)"><code class="function-signature">constructor(address vat_, contract ITime _time)</code></a></li><li><a href="#TestNetDaiPot.rpow(uint256,uint256,uint256)"><code class="function-signature">rpow(uint256 x, uint256 n, uint256 base)</code></a></li><li><a href="#TestNetDaiPot.rmul(uint256,uint256)"><code class="function-signature">rmul(uint256 x, uint256 y)</code></a></li><li><a href="#TestNetDaiPot.Add(uint256,uint256)"><code class="function-signature">Add(uint256 x, uint256 y)</code></a></li><li><a href="#TestNetDaiPot.Sub(uint256,uint256)"><code class="function-signature">Sub(uint256 x, uint256 y)</code></a></li><li><a href="#TestNetDaiPot.Mul(uint256,uint256)"><code class="function-signature">Mul(uint256 x, uint256 y)</code></a></li><li><a href="#TestNetDaiPot.drip()"><code class="function-signature">drip()</code></a></li><li><a href="#TestNetDaiPot.setDSR(uint256)"><code class="function-signature">setDSR(uint256 _dsr)</code></a></li><li><a href="#TestNetDaiPot.join(uint256)"><code class="function-signature">join(uint256 wad)</code></a></li><li><a href="#TestNetDaiPot.exit(uint256)"><code class="function-signature">exit(uint256 wad)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.constructor(address,contract ITime)"></a><code class="function-signature">constructor(address vat_, contract ITime _time)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.rpow(uint256,uint256,uint256)"></a><code class="function-signature">rpow(uint256 x, uint256 n, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.rmul(uint256,uint256)"></a><code class="function-signature">rmul(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.Add(uint256,uint256)"></a><code class="function-signature">Add(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.Sub(uint256,uint256)"></a><code class="function-signature">Sub(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.Mul(uint256,uint256)"></a><code class="function-signature">Mul(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.drip()"></a><code class="function-signature">drip()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.setDSR(uint256)"></a><code class="function-signature">setDSR(uint256 _dsr) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.join(uint256)"></a><code class="function-signature">join(uint256 wad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiPot.exit(uint256)"></a><code class="function-signature">exit(uint256 wad)</code><span class="function-visibility">public</span></h4>







### `TestNetDaiVat`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TestNetDaiVat.add(uint256,uint256)"><code class="function-signature">add(uint256 x, uint256 y)</code></a></li><li><a href="#TestNetDaiVat.sub(uint256,uint256)"><code class="function-signature">sub(uint256 x, uint256 y)</code></a></li><li><a href="#TestNetDaiVat.hope(address)"><code class="function-signature">hope(address usr)</code></a></li><li><a href="#TestNetDaiVat.nope(address)"><code class="function-signature">nope(address usr)</code></a></li><li><a href="#TestNetDaiVat.wish(address,address)"><code class="function-signature">wish(address bit, address usr)</code></a></li><li><a href="#TestNetDaiVat.suck(address,address,uint256)"><code class="function-signature">suck(address, address v, uint256 rad)</code></a></li><li><a href="#TestNetDaiVat.move(address,address,uint256)"><code class="function-signature">move(address src, address dst, uint256 rad)</code></a></li><li><a href="#TestNetDaiVat.faucet(address,uint256)"><code class="function-signature">faucet(address _target, uint256 _amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TestNetDaiVat.add(uint256,uint256)"></a><code class="function-signature">add(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiVat.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiVat.hope(address)"></a><code class="function-signature">hope(address usr)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiVat.nope(address)"></a><code class="function-signature">nope(address usr)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiVat.wish(address,address)"></a><code class="function-signature">wish(address bit, address usr) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiVat.suck(address,address,uint256)"></a><code class="function-signature">suck(address, address v, uint256 rad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiVat.move(address,address,uint256)"></a><code class="function-signature">move(address src, address dst, uint256 rad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetDaiVat.faucet(address,uint256)"></a><code class="function-signature">faucet(address _target, uint256 _amount)</code><span class="function-visibility">public</span></h4>







### `ReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse,address)"><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse, address _erc1820RegistryAddress)</code></a></li><li><a href="#ReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li><a href="#ReputationToken.mintForUniverse(uint256,address)"><code class="function-signature">mintForUniverse(uint256 _amountToMint, address _target)</code></a></li><li><a href="#ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li><a href="#ReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#ReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li><a href="#ReputationToken.getLegacyRepToken()"><code class="function-signature">getLegacyRepToken()</code></a></li><li><a href="#ReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li><a href="#ReputationToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#ReputationToken.onMint(address,uint256)"><code class="function-signature">onMint(address _target, uint256 _amount)</code></a></li><li><a href="#ReputationToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address _target, uint256 _amount)</code></a></li><li><a href="#ReputationToken.migrateFromLegacyReputationToken()"><code class="function-signature">migrateFromLegacyReputationToken()</code></a></li><li class="inherited"><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li class="inherited"><a href="#StandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.internalNoHooksTransfer(address,address,uint256)"><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li class="inherited"><a href="#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li class="inherited"><a href="#ERC777.transfer(address,uint256)"><code class="function-signature">transfer(address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li class="inherited"><a href="#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li class="inherited"><a href="#ERC777.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li class="inherited"><a href="#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse,address)"></a><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse, address _erc1820RegistryAddress)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.migrateOutByPayout(uint256[],uint256)"></a><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.migrateIn(address,uint256)"></a><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.mintForReportingParticipant(uint256)"></a><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.mintForUniverse(uint256,address)"></a><code class="function-signature">mintForUniverse(uint256 _amountToMint, address _target) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.burnForMarket(uint256)"></a><code class="function-signature">burnForMarket(uint256 _amountToBurn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.trustedUniverseTransfer(address,address,uint256)"></a><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.trustedMarketTransfer(address,address,uint256)"></a><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"></a><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"></a><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.getTotalMigrated()"></a><code class="function-signature">getTotalMigrated() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.getLegacyRepToken()"></a><code class="function-signature">getLegacyRepToken() <span class="return-arrow">→</span> <span class="return-type">contract IERC20</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.getTotalTheoreticalSupply()"></a><code class="function-signature">getTotalTheoreticalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.onMint(address,uint256)"></a><code class="function-signature">onMint(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.migrateFromLegacyReputationToken()"></a><code class="function-signature">migrateFromLegacyReputationToken() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

This can only be done for the Genesis Universe in V2. If a fork occurs and the window ends V1 REP is stuck in V1 forever






### `TestNetReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TestNetReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse,address)"><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse, address _erc1820RegistryAddress)</code></a></li><li><a href="#TestNetReputationToken.faucet(uint256)"><code class="function-signature">faucet(uint256 _amount)</code></a></li><li class="inherited"><a href="#ReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#ReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#ReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="#ReputationToken.mintForUniverse(uint256,address)"><code class="function-signature">mintForUniverse(uint256 _amountToMint, address _target)</code></a></li><li class="inherited"><a href="#ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li class="inherited"><a href="#ReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#ReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#ReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#ReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="#ReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li class="inherited"><a href="#ReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li class="inherited"><a href="#ReputationToken.getLegacyRepToken()"><code class="function-signature">getLegacyRepToken()</code></a></li><li class="inherited"><a href="#ReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="#ReputationToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="#ReputationToken.onMint(address,uint256)"><code class="function-signature">onMint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#ReputationToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#ReputationToken.migrateFromLegacyReputationToken()"><code class="function-signature">migrateFromLegacyReputationToken()</code></a></li><li class="inherited"><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li class="inherited"><a href="#StandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.internalNoHooksTransfer(address,address,uint256)"><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li class="inherited"><a href="#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li class="inherited"><a href="#ERC777.transfer(address,uint256)"><code class="function-signature">transfer(address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li class="inherited"><a href="#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li class="inherited"><a href="#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li class="inherited"><a href="#ERC777.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li class="inherited"><a href="#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li class="inherited"><a href="#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TestNetReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse,address)"></a><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse, address _erc1820RegistryAddress)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetReputationToken.faucet(uint256)"></a><code class="function-signature">faucet(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IProfitLoss`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IProfitLoss.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#IProfitLoss.recordFrozenFundChange(contract IMarket,address,uint256,int256)"><code class="function-signature">recordFrozenFundChange(contract IMarket _market, address _account, uint256 _outcome, int256 _frozenFundDelta)</code></a></li><li><a href="#IProfitLoss.recordTrade(contract IMarket,address,address,uint256,int256,int256,uint256,uint256,uint256,uint256)"><code class="function-signature">recordTrade(contract IMarket _market, address _longAddress, address _shortAddress, uint256 _outcome, int256 _amount, int256 _price, uint256 _numLongTokens, uint256 _numShortTokens, uint256 _numLongShares, uint256 _numShortShares)</code></a></li><li><a href="#IProfitLoss.recordClaim(contract IMarket,address)"><code class="function-signature">recordClaim(contract IMarket _market, address _account)</code></a></li><li><a href="#IProfitLoss.recordExternalTransfer(address,address,uint256)"><code class="function-signature">recordExternalTransfer(address _source, address _destination, uint256 _value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.recordFrozenFundChange(contract IMarket,address,uint256,int256)"></a><code class="function-signature">recordFrozenFundChange(contract IMarket _market, address _account, uint256 _outcome, int256 _frozenFundDelta) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.recordTrade(contract IMarket,address,address,uint256,int256,int256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">recordTrade(contract IMarket _market, address _longAddress, address _shortAddress, uint256 _outcome, int256 _amount, int256 _price, uint256 _numLongTokens, uint256 _numShortTokens, uint256 _numLongShares, uint256 _numShortShares) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.recordClaim(contract IMarket,address)"></a><code class="function-signature">recordClaim(contract IMarket _market, address _account) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.recordExternalTransfer(address,address,uint256)"></a><code class="function-signature">recordExternalTransfer(address _source, address _destination, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Orders`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Orders.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#Orders.getMarket(bytes32)"><code class="function-signature">getMarket(bytes32 _orderId)</code></a></li><li><a href="#Orders.getOrderType(bytes32)"><code class="function-signature">getOrderType(bytes32 _orderId)</code></a></li><li><a href="#Orders.getOutcome(bytes32)"><code class="function-signature">getOutcome(bytes32 _orderId)</code></a></li><li><a href="#Orders.getKYCToken(bytes32)"><code class="function-signature">getKYCToken(bytes32 _orderId)</code></a></li><li><a href="#Orders.getAmount(bytes32)"><code class="function-signature">getAmount(bytes32 _orderId)</code></a></li><li><a href="#Orders.getPrice(bytes32)"><code class="function-signature">getPrice(bytes32 _orderId)</code></a></li><li><a href="#Orders.getOrderCreator(bytes32)"><code class="function-signature">getOrderCreator(bytes32 _orderId)</code></a></li><li><a href="#Orders.getOrderSharesEscrowed(bytes32)"><code class="function-signature">getOrderSharesEscrowed(bytes32 _orderId)</code></a></li><li><a href="#Orders.getOrderMoneyEscrowed(bytes32)"><code class="function-signature">getOrderMoneyEscrowed(bytes32 _orderId)</code></a></li><li><a href="#Orders.getOrderDataForLogs(bytes32)"><code class="function-signature">getOrderDataForLogs(bytes32 _orderId)</code></a></li><li><a href="#Orders.getTotalEscrowed(contract IMarket)"><code class="function-signature">getTotalEscrowed(contract IMarket _market)</code></a></li><li><a href="#Orders.getLastOutcomePrice(contract IMarket,uint256)"><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#Orders.getBetterOrderId(bytes32)"><code class="function-signature">getBetterOrderId(bytes32 _orderId)</code></a></li><li><a href="#Orders.getWorseOrderId(bytes32)"><code class="function-signature">getWorseOrderId(bytes32 _orderId)</code></a></li><li><a href="#Orders.getBestOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken)</code></a></li><li><a href="#Orders.getWorstOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken)</code></a></li><li><a href="#Orders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract IERC20)"><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract IERC20 _kycToken)</code></a></li><li><a href="#Orders.isBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#Orders.isWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#Orders.assertIsNotBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _betterOrderId)</code></a></li><li><a href="#Orders.assertIsNotWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _worseOrderId)</code></a></li><li><a href="#Orders.saveOrder(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,bytes32,bytes32,bytes32,contract IERC20)"><code class="function-signature">saveOrder(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, contract IERC20 _kycToken)</code></a></li><li><a href="#Orders.removeOrder(bytes32)"><code class="function-signature">removeOrder(bytes32 _orderId)</code></a></li><li><a href="#Orders.recordFillOrder(bytes32,uint256,uint256,uint256)"><code class="function-signature">recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill)</code></a></li><li><a href="#Orders.setPrice(contract IMarket,uint256,uint256)"><code class="function-signature">setPrice(contract IMarket _market, uint256 _outcome, uint256 _price)</code></a></li><li><a href="#Orders.setOrderPrice(bytes32,uint256,bytes32,bytes32)"><code class="function-signature">setOrderPrice(bytes32 _orderId, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId)</code></a></li><li><a href="#Orders.ascendOrderList(enum Order.Types,uint256,bytes32)"><code class="function-signature">ascendOrderList(enum Order.Types _type, uint256 _price, bytes32 _lowestOrderId)</code></a></li><li><a href="#Orders.descendOrderList(enum Order.Types,uint256,bytes32)"><code class="function-signature">descendOrderList(enum Order.Types _type, uint256 _price, bytes32 _highestOrderId)</code></a></li><li><a href="#Orders.findBoundingOrders(enum Order.Types,uint256,bytes32,bytes32,bytes32,bytes32)"><code class="function-signature">findBoundingOrders(enum Order.Types _type, uint256 _price, bytes32 _bestOrderId, bytes32 _worstOrderId, bytes32 _betterOrderId, bytes32 _worseOrderId)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Orders.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getMarket(bytes32)"></a><code class="function-signature">getMarket(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getOrderType(bytes32)"></a><code class="function-signature">getOrderType(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getOutcome(bytes32)"></a><code class="function-signature">getOutcome(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getKYCToken(bytes32)"></a><code class="function-signature">getKYCToken(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">contract IERC20</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getAmount(bytes32)"></a><code class="function-signature">getAmount(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getPrice(bytes32)"></a><code class="function-signature">getPrice(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getOrderCreator(bytes32)"></a><code class="function-signature">getOrderCreator(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getOrderSharesEscrowed(bytes32)"></a><code class="function-signature">getOrderSharesEscrowed(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getOrderMoneyEscrowed(bytes32)"></a><code class="function-signature">getOrderMoneyEscrowed(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getOrderDataForLogs(bytes32)"></a><code class="function-signature">getOrderDataForLogs(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types,address[],uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getTotalEscrowed(contract IMarket)"></a><code class="function-signature">getTotalEscrowed(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getLastOutcomePrice(contract IMarket,uint256)"></a><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getBetterOrderId(bytes32)"></a><code class="function-signature">getBetterOrderId(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getWorseOrderId(bytes32)"></a><code class="function-signature">getWorseOrderId(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getBestOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"></a><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getWorstOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"></a><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract IERC20)"></a><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.isBetterPrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">isBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.isWorsePrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">isWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.assertIsNotBetterPrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">assertIsNotBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _betterOrderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.assertIsNotWorsePrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">assertIsNotWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _worseOrderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.saveOrder(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,bytes32,bytes32,bytes32,contract IERC20)"></a><code class="function-signature">saveOrder(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.removeOrder(bytes32)"></a><code class="function-signature">removeOrder(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.recordFillOrder(bytes32,uint256,uint256,uint256)"></a><code class="function-signature">recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.setPrice(contract IMarket,uint256,uint256)"></a><code class="function-signature">setPrice(contract IMarket _market, uint256 _outcome, uint256 _price) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.setOrderPrice(bytes32,uint256,bytes32,bytes32)"></a><code class="function-signature">setOrderPrice(bytes32 _orderId, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.ascendOrderList(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">ascendOrderList(enum Order.Types _type, uint256 _price, bytes32 _lowestOrderId) <span class="return-arrow">→</span> <span class="return-type">bytes32,bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.descendOrderList(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">descendOrderList(enum Order.Types _type, uint256 _price, bytes32 _highestOrderId) <span class="return-arrow">→</span> <span class="return-type">bytes32,bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Orders.findBoundingOrders(enum Order.Types,uint256,bytes32,bytes32,bytes32,bytes32)"></a><code class="function-signature">findBoundingOrders(enum Order.Types _type, uint256 _price, bytes32 _bestOrderId, bytes32 _worstOrderId, bytes32 _betterOrderId, bytes32 _worseOrderId) <span class="return-arrow">→</span> <span class="return-type">bytes32,bytes32</span></code><span class="function-visibility">public</span></h4>







### `SafeMathInt256`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMathInt256.mul(int256,int256)"><code class="function-signature">mul(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.div(int256,int256)"><code class="function-signature">div(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.sub(int256,int256)"><code class="function-signature">sub(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.add(int256,int256)"><code class="function-signature">add(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.min(int256,int256)"><code class="function-signature">min(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.max(int256,int256)"><code class="function-signature">max(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.abs(int256)"><code class="function-signature">abs(int256 a)</code></a></li><li><a href="#SafeMathInt256.getInt256Min()"><code class="function-signature">getInt256Min()</code></a></li><li><a href="#SafeMathInt256.getInt256Max()"><code class="function-signature">getInt256Max()</code></a></li><li><a href="#SafeMathInt256.fxpMul(int256,int256,int256)"><code class="function-signature">fxpMul(int256 a, int256 b, int256 base)</code></a></li><li><a href="#SafeMathInt256.fxpDiv(int256,int256,int256)"><code class="function-signature">fxpDiv(int256 a, int256 b, int256 base)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.mul(int256,int256)"></a><code class="function-signature">mul(int256 a, int256 b) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.div(int256,int256)"></a><code class="function-signature">div(int256 a, int256 b) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.sub(int256,int256)"></a><code class="function-signature">sub(int256 a, int256 b) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.add(int256,int256)"></a><code class="function-signature">add(int256 a, int256 b) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.min(int256,int256)"></a><code class="function-signature">min(int256 a, int256 b) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.max(int256,int256)"></a><code class="function-signature">max(int256 a, int256 b) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.abs(int256)"></a><code class="function-signature">abs(int256 a) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.getInt256Min()"></a><code class="function-signature">getInt256Min() <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.getInt256Max()"></a><code class="function-signature">getInt256Max() <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.fxpMul(int256,int256,int256)"></a><code class="function-signature">fxpMul(int256 a, int256 b, int256 base) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.fxpDiv(int256,int256,int256)"></a><code class="function-signature">fxpDiv(int256 a, int256 b, int256 base) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>







### `TestOrders`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TestOrders.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#TestOrders.testSaveOrder(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,bytes32,bytes32,bytes32,contract IERC20)"><code class="function-signature">testSaveOrder(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, contract IERC20 _kycToken)</code></a></li><li><a href="#TestOrders.testRemoveOrder(bytes32)"><code class="function-signature">testRemoveOrder(bytes32 _orderId)</code></a></li><li><a href="#TestOrders.testRecordFillOrder(bytes32,uint256,uint256,uint256)"><code class="function-signature">testRecordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill)</code></a></li><li class="inherited"><a href="#Orders.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li class="inherited"><a href="#Orders.getMarket(bytes32)"><code class="function-signature">getMarket(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getOrderType(bytes32)"><code class="function-signature">getOrderType(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getOutcome(bytes32)"><code class="function-signature">getOutcome(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getKYCToken(bytes32)"><code class="function-signature">getKYCToken(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getAmount(bytes32)"><code class="function-signature">getAmount(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getPrice(bytes32)"><code class="function-signature">getPrice(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getOrderCreator(bytes32)"><code class="function-signature">getOrderCreator(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getOrderSharesEscrowed(bytes32)"><code class="function-signature">getOrderSharesEscrowed(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getOrderMoneyEscrowed(bytes32)"><code class="function-signature">getOrderMoneyEscrowed(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getOrderDataForLogs(bytes32)"><code class="function-signature">getOrderDataForLogs(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getTotalEscrowed(contract IMarket)"><code class="function-signature">getTotalEscrowed(contract IMarket _market)</code></a></li><li class="inherited"><a href="#Orders.getLastOutcomePrice(contract IMarket,uint256)"><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome)</code></a></li><li class="inherited"><a href="#Orders.getBetterOrderId(bytes32)"><code class="function-signature">getBetterOrderId(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getWorseOrderId(bytes32)"><code class="function-signature">getWorseOrderId(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.getBestOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken)</code></a></li><li class="inherited"><a href="#Orders.getWorstOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken)</code></a></li><li class="inherited"><a href="#Orders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract IERC20)"><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract IERC20 _kycToken)</code></a></li><li class="inherited"><a href="#Orders.isBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.isWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.assertIsNotBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _betterOrderId)</code></a></li><li class="inherited"><a href="#Orders.assertIsNotWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _worseOrderId)</code></a></li><li class="inherited"><a href="#Orders.saveOrder(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,bytes32,bytes32,bytes32,contract IERC20)"><code class="function-signature">saveOrder(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, contract IERC20 _kycToken)</code></a></li><li class="inherited"><a href="#Orders.removeOrder(bytes32)"><code class="function-signature">removeOrder(bytes32 _orderId)</code></a></li><li class="inherited"><a href="#Orders.recordFillOrder(bytes32,uint256,uint256,uint256)"><code class="function-signature">recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill)</code></a></li><li class="inherited"><a href="#Orders.setPrice(contract IMarket,uint256,uint256)"><code class="function-signature">setPrice(contract IMarket _market, uint256 _outcome, uint256 _price)</code></a></li><li class="inherited"><a href="#Orders.setOrderPrice(bytes32,uint256,bytes32,bytes32)"><code class="function-signature">setOrderPrice(bytes32 _orderId, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId)</code></a></li><li class="inherited"><a href="#Orders.ascendOrderList(enum Order.Types,uint256,bytes32)"><code class="function-signature">ascendOrderList(enum Order.Types _type, uint256 _price, bytes32 _lowestOrderId)</code></a></li><li class="inherited"><a href="#Orders.descendOrderList(enum Order.Types,uint256,bytes32)"><code class="function-signature">descendOrderList(enum Order.Types _type, uint256 _price, bytes32 _highestOrderId)</code></a></li><li class="inherited"><a href="#Orders.findBoundingOrders(enum Order.Types,uint256,bytes32,bytes32,bytes32,bytes32)"><code class="function-signature">findBoundingOrders(enum Order.Types _type, uint256 _price, bytes32 _bestOrderId, bytes32 _worstOrderId, bytes32 _betterOrderId, bytes32 _worseOrderId)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TestOrders.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestOrders.testSaveOrder(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,bytes32,bytes32,bytes32,contract IERC20)"></a><code class="function-signature">testSaveOrder(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestOrders.testRemoveOrder(bytes32)"></a><code class="function-signature">testRemoveOrder(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestOrders.testRecordFillOrder(bytes32,uint256,uint256,uint256)"></a><code class="function-signature">testRecordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Time`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Time.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#Time.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Time.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Time.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







### `TimeControlled`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TimeControlled.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#TimeControlled.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#TimeControlled.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#TimeControlled.incrementTimestamp(uint256)"><code class="function-signature">incrementTimestamp(uint256 _amount)</code></a></li><li><a href="#TimeControlled.setTimestamp(uint256)"><code class="function-signature">setTimestamp(uint256 _timestamp)</code></a></li><li><a href="#TimeControlled.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TimeControlled.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TimeControlled.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TimeControlled.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TimeControlled.incrementTimestamp(uint256)"></a><code class="function-signature">incrementTimestamp(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TimeControlled.setTimestamp(uint256)"></a><code class="function-signature">setTimestamp(uint256 _timestamp) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TimeControlled.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







</div>