---
title: Factories
---

<div class="contracts">

## Contracts

### `Auction`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Auction.initialize(contract IAugur,contract IUniverse,contract IV2ReputationToken)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, contract IV2ReputationToken _reputationToken)</code></a></li><li><a href="#Auction.initializeNewAuction()"><code class="function-signature">initializeNewAuction()</code></a></li><li><a href="#Auction.tradeRepForCash(uint256)"><code class="function-signature">tradeRepForCash(uint256 _attoCashAmount)</code></a></li><li><a href="#Auction.tradeCashForRep(uint256)"><code class="function-signature">tradeCashForRep(uint256 _attoRepAmount)</code></a></li><li><a href="#Auction.getRepSalePriceInAttoCash()"><code class="function-signature">getRepSalePriceInAttoCash()</code></a></li><li><a href="#Auction.getCashSalePriceInAttoRep()"><code class="function-signature">getCashSalePriceInAttoRep()</code></a></li><li><a href="#Auction.getCurrentAttoRepBalance()"><code class="function-signature">getCurrentAttoRepBalance()</code></a></li><li><a href="#Auction.getCurrentAttoCashBalance()"><code class="function-signature">getCurrentAttoCashBalance()</code></a></li><li><a href="#Auction.auctionOver(contract IAuctionToken)"><code class="function-signature">auctionOver(contract IAuctionToken _auctionToken)</code></a></li><li><a href="#Auction.getDerivedRepPriceInAttoCash()"><code class="function-signature">getDerivedRepPriceInAttoCash()</code></a></li><li><a href="#Auction.getRepPriceInAttoCash()"><code class="function-signature">getRepPriceInAttoCash()</code></a></li><li><a href="#Auction.getAuctionIndexForCurrentTime()"><code class="function-signature">getAuctionIndexForCurrentTime()</code></a></li><li><a href="#Auction.isActive()"><code class="function-signature">isActive()</code></a></li><li><a href="#Auction.getRoundType()"><code class="function-signature">getRoundType()</code></a></li><li><a href="#Auction.getAuctionStartTime()"><code class="function-signature">getAuctionStartTime()</code></a></li><li><a href="#Auction.getAuctionEndTime()"><code class="function-signature">getAuctionEndTime()</code></a></li><li><a href="#Auction.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#Auction.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li class="inherited"><a href="factories#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="factories#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Auction.initialize(contract IAugur,contract IUniverse,contract IV2ReputationToken)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, contract IV2ReputationToken _reputationToken) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.initializeNewAuction()"></a><code class="function-signature">initializeNewAuction() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.tradeRepForCash(uint256)"></a><code class="function-signature">tradeRepForCash(uint256 _attoCashAmount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.tradeCashForRep(uint256)"></a><code class="function-signature">tradeCashForRep(uint256 _attoRepAmount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getRepSalePriceInAttoCash()"></a><code class="function-signature">getRepSalePriceInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getCashSalePriceInAttoRep()"></a><code class="function-signature">getCashSalePriceInAttoRep() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getCurrentAttoRepBalance()"></a><code class="function-signature">getCurrentAttoRepBalance() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getCurrentAttoCashBalance()"></a><code class="function-signature">getCurrentAttoCashBalance() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.auctionOver(contract IAuctionToken)"></a><code class="function-signature">auctionOver(contract IAuctionToken _auctionToken) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getDerivedRepPriceInAttoCash()"></a><code class="function-signature">getDerivedRepPriceInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getRepPriceInAttoCash()"></a><code class="function-signature">getRepPriceInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getAuctionIndexForCurrentTime()"></a><code class="function-signature">getAuctionIndexForCurrentTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.isActive()"></a><code class="function-signature">isActive() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getRoundType()"></a><code class="function-signature">getRoundType() <span class="return-arrow">→</span> <span class="return-type">enum Auction.RoundType</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getAuctionStartTime()"></a><code class="function-signature">getAuctionStartTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getAuctionEndTime()"></a><code class="function-signature">getAuctionEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Auction.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IReputationToken</span></code><span class="function-visibility">public</span></h4>







### `AuctionFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#AuctionFactory.createAuction(contract IAugur,contract IUniverse,contract IV2ReputationToken)"><code class="function-signature">createAuction(contract IAugur _augur, contract IUniverse _universe, contract IV2ReputationToken _reputationToken)</code></a></li><li class="inherited"><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="AuctionFactory.createAuction(contract IAugur,contract IUniverse,contract IV2ReputationToken)"></a><code class="function-signature">createAuction(contract IAugur _augur, contract IUniverse _universe, contract IV2ReputationToken _reputationToken) <span class="return-arrow">→</span> <span class="return-type">contract IAuction</span></code><span class="function-visibility">public</span></h4>







### `AuctionTokenFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#AuctionTokenFactory.createAuctionToken(contract IAugur,contract IAuction,contract ERC20Token,uint256)"><code class="function-signature">createAuctionToken(contract IAugur _augur, contract IAuction _auction, contract ERC20Token _redemptionToken, uint256 _auctionIndex)</code></a></li><li class="inherited"><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="AuctionTokenFactory.createAuctionToken(contract IAugur,contract IAuction,contract ERC20Token,uint256)"></a><code class="function-signature">createAuctionToken(contract IAugur _augur, contract IAuction _auction, contract ERC20Token _redemptionToken, uint256 _auctionIndex) <span class="return-arrow">→</span> <span class="return-type">contract IAuctionToken</span></code><span class="function-visibility">public</span></h4>







### `CloneFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="CloneFactory.createClone(address)"></a><code class="function-signature">createClone(address target) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>







### `ERC20Token`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#ERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#ERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li><a href="#ERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li><a href="#ERC20Token.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li><a href="#ERC20Token.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li><a href="#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC20Token.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.allowance(address,address)"></a><code class="function-signature">allowance(address owner, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="ERC20Token.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





### `IAuction`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAuction.initialize(contract IAugur,contract IUniverse,contract IV2ReputationToken)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, contract IV2ReputationToken _reputationToken)</code></a></li><li><a href="#IAuction.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IAuction.getAuctionIndexForCurrentTime()"><code class="function-signature">getAuctionIndexForCurrentTime()</code></a></li><li><a href="#IAuction.auctionOver(contract IAuctionToken)"><code class="function-signature">auctionOver(contract IAuctionToken _auctionToken)</code></a></li><li class="inherited"><a href="factories#IRepPriceOracle.getRepPriceInAttoCash()"><code class="function-signature">getRepPriceInAttoCash()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAuction.initialize(contract IAugur,contract IUniverse,contract IV2ReputationToken)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, contract IV2ReputationToken _reputationToken) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAuction.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAuction.getAuctionIndexForCurrentTime()"></a><code class="function-signature">getAuctionIndexForCurrentTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAuction.auctionOver(contract IAuctionToken)"></a><code class="function-signature">auctionOver(contract IAuctionToken _auctionToken) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IAuctionToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAuctionToken.initialize(contract IAugur,contract IAuction,contract ERC20Token,uint256,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IAuction _auction, contract ERC20Token _redemptionToken, uint256 _auctionIndex, address _erc820RegistryAddress)</code></a></li><li><a href="#IAuctionToken.mintForPurchaser(address,uint256)"><code class="function-signature">mintForPurchaser(address _purchaser, uint256 _amount)</code></a></li><li><a href="#IAuctionToken.retrieveFunds()"><code class="function-signature">retrieveFunds()</code></a></li><li class="inherited"><a href="factories#ERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="factories#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAuctionToken.initialize(contract IAugur,contract IAuction,contract ERC20Token,uint256,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IAuction _auction, contract ERC20Token _redemptionToken, uint256 _auctionIndex, address _erc820RegistryAddress) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAuctionToken.mintForPurchaser(address,uint256)"></a><code class="function-signature">mintForPurchaser(address _purchaser, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAuctionToken.retrieveFunds()"></a><code class="function-signature">retrieveFunds() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IAugur`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugur.createChildUniverse(bytes32,uint256[])"><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IAugur.isKnownUniverse(contract IUniverse)"><code class="function-signature">isKnownUniverse(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.trustedTransfer(contract ERC20Token,address,address,uint256)"><code class="function-signature">trustedTransfer(contract ERC20Token _token, address _from, address _to, uint256 _amount)</code></a></li><li><a href="#IAugur.logMarketCreated(uint256,bytes32,string,contract IMarket,address,address,uint256,int256[],enum IMarket.MarketType,bytes32[])"><code class="function-signature">logMarketCreated(uint256 _endTime, bytes32 _topic, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] _prices, enum IMarket.MarketType _marketType, bytes32[] _outcomes)</code></a></li><li><a href="#IAugur.logMarketCreated(uint256,bytes32,string,contract IMarket,address,address,uint256,int256[],enum IMarket.MarketType,uint256)"><code class="function-signature">logMarketCreated(uint256 _endTime, bytes32 _topic, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] _prices, enum IMarket.MarketType _marketType, uint256 _numTicks)</code></a></li><li><a href="#IAugur.logInitialReportSubmitted(contract IUniverse,address,address,uint256,bool,uint256[],string)"><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string description)</code></a></li><li><a href="#IAugur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256)"><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string)"><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string description)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256,bool)"><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256 _nextWindowStartTime, bool _pacingOn)</code></a></li><li><a href="#IAugur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logMarketFinalized(contract IUniverse,uint256[])"><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators)</code></a></li><li><a href="#IAugur.logMarketMigrated(contract IMarket,contract IUniverse)"><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse)</code></a></li><li><a href="#IAugur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IAugur.logMarketParticipantsDisavowed(contract IUniverse)"><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId)</code></a></li><li><a href="#IAugur.logOrderCreated(contract IUniverse,bytes32,bytes32)"><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#IAugur.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#IAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets)</code></a></li><li><a href="#IAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees)</code></a></li><li><a href="#IAugur.logTradingProceedsClaimed(contract IUniverse,address,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _shareToken, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _finalTokenBalance, uint256 _fees)</code></a></li><li><a href="#IAugur.logUniverseForked(contract IMarket)"><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket)</code></a></li><li><a href="#IAugur.logShareTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logShareTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance, uint256 _outcome)</code></a></li><li><a href="#IAugur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logShareTokensBurned(contract IUniverse,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logShareTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome)</code></a></li><li><a href="#IAugur.logShareTokensMinted(contract IUniverse,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logShareTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeWindowCreated(contract IDisputeWindow,uint256,bool)"><code class="function-signature">logDisputeWindowCreated(contract IDisputeWindow _disputeWindow, uint256 _id, bool _initial)</code></a></li><li><a href="#IAugur.logParticipationTokensRedeemed(contract IUniverse,address,uint256,uint256)"><code class="function-signature">logParticipationTokensRedeemed(contract IUniverse universe, address _sender, uint256 _attoParticipationTokens, uint256 _feePayoutShare)</code></a></li><li><a href="#IAugur.logTimestampSet(uint256)"><code class="function-signature">logTimestampSet(uint256 _newTimestamp)</code></a></li><li><a href="#IAugur.logInitialReporterTransferred(contract IUniverse,contract IMarket,address,address)"><code class="function-signature">logInitialReporterTransferred(contract IUniverse _universe, contract IMarket _market, address _from, address _to)</code></a></li><li><a href="#IAugur.logMarketTransferred(contract IUniverse,address,address)"><code class="function-signature">logMarketTransferred(contract IUniverse _universe, address _from, address _to)</code></a></li><li><a href="#IAugur.logAuctionTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logAuctionTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logAuctionTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logAuctionTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logAuctionTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logAuctionTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logOrderPriceChanged(contract IUniverse,bytes32)"><code class="function-signature">logOrderPriceChanged(contract IUniverse _universe, bytes32 _orderId)</code></a></li><li><a href="#IAugur.logMarketVolumeChanged(contract IUniverse,address,uint256)"><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume)</code></a></li><li><a href="#IAugur.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost)</code></a></li><li><a href="#IAugur.recordAuctionTokens(contract IUniverse)"><code class="function-signature">recordAuctionTokens(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.isKnownFeeSender(address)"><code class="function-signature">isKnownFeeSender(address _feeSender)</code></a></li><li><a href="#IAugur.isKnownShareToken(contract IShareToken)"><code class="function-signature">isKnownShareToken(contract IShareToken _token)</code></a></li><li><a href="#IAugur.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#IAugur.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#IAugur.getMaximumMarketEndDate()"><code class="function-signature">getMaximumMarketEndDate()</code></a></li><li><a href="#IAugur.isValidMarket(contract IMarket)"><code class="function-signature">isValidMarket(contract IMarket _market)</code></a></li><li><a href="#IAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 numOutcomes)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAugur.createChildUniverse(bytes32,uint256[])"></a><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownUniverse(contract IUniverse)"></a><code class="function-signature">isKnownUniverse(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.trustedTransfer(contract ERC20Token,address,address,uint256)"></a><code class="function-signature">trustedTransfer(contract ERC20Token _token, address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketCreated(uint256,bytes32,string,contract IMarket,address,address,uint256,int256[],enum IMarket.MarketType,bytes32[])"></a><code class="function-signature">logMarketCreated(uint256 _endTime, bytes32 _topic, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] _prices, enum IMarket.MarketType _marketType, bytes32[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketCreated(uint256,bytes32,string,contract IMarket,address,address,uint256,int256[],enum IMarket.MarketType,uint256)"></a><code class="function-signature">logMarketCreated(uint256 _endTime, bytes32 _topic, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] _prices, enum IMarket.MarketType _marketType, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





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





<h4><a class="anchor" aria-hidden="true" id="IAugur.logAuctionTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logAuctionTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logAuctionTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logAuctionTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logAuctionTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logAuctionTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"></a><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"></a><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logOrderPriceChanged(contract IUniverse,bytes32)"></a><code class="function-signature">logOrderPriceChanged(contract IUniverse _universe, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logMarketVolumeChanged(contract IUniverse,address,uint256)"></a><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"></a><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.recordAuctionTokens(contract IUniverse)"></a><code class="function-signature">recordAuctionTokens(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownFeeSender(address)"></a><code class="function-signature">isKnownFeeSender(address _feeSender) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isKnownShareToken(contract IShareToken)"></a><code class="function-signature">isKnownShareToken(contract IShareToken _token) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.getMaximumMarketEndDate()"></a><code class="function-signature">getMaximumMarketEndDate() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.isValidMarket(contract IMarket)"></a><code class="function-signature">isValidMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"></a><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 numOutcomes) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







### `ICash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li class="inherited"><a href="factories#ERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>





### `IDisputeCrowdsourcer`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, address _erc820RegistryAddress)</code></a></li><li><a href="#IDisputeCrowdsourcer.contribute(address,uint256,bool)"><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload)</code></a></li><li><a href="#IDisputeCrowdsourcer.setSize(uint256)"><code class="function-signature">setSize(uint256 _size)</code></a></li><li><a href="#IDisputeCrowdsourcer.getRemainingToFill()"><code class="function-signature">getRemainingToFill()</code></a></li><li><a href="#IDisputeCrowdsourcer.correctSize()"><code class="function-signature">correctSize()</code></a></li><li class="inherited"><a href="factories#ERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, address _erc820RegistryAddress) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.contribute(address,uint256,bool)"></a><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.setSize(uint256)"></a><code class="function-signature">setSize(uint256 _size) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.getRemainingToFill()"></a><code class="function-signature">getRemainingToFill() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.correctSize()"></a><code class="function-signature">correctSize() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IDisputeWindow`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,uint256,uint256,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, uint256 _duration, uint256 _startTime, address _erc820RegistryAddress)</code></a></li><li><a href="#IDisputeWindow.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IDisputeWindow.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IDisputeWindow.getStartTime()"><code class="function-signature">getStartTime()</code></a></li><li><a href="#IDisputeWindow.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IDisputeWindow.getWindowId()"><code class="function-signature">getWindowId()</code></a></li><li><a href="#IDisputeWindow.isActive()"><code class="function-signature">isActive()</code></a></li><li><a href="#IDisputeWindow.isOver()"><code class="function-signature">isOver()</code></a></li><li><a href="#IDisputeWindow.onMarketFinalized()"><code class="function-signature">onMarketFinalized()</code></a></li><li><a href="#IDisputeWindow.redeem(address)"><code class="function-signature">redeem(address _account)</code></a></li><li class="inherited"><a href="factories#ERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="factories#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,uint256,uint256,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, uint256 _duration, uint256 _startTime, address _erc820RegistryAddress) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getStartTime()"></a><code class="function-signature">getStartTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getEndTime()"></a><code class="function-signature">getEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.getWindowId()"></a><code class="function-signature">getWindowId() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.isActive()"></a><code class="function-signature">isActive() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.isOver()"></a><code class="function-signature">isOver() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.onMarketFinalized()"></a><code class="function-signature">onMarketFinalized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeWindow.redeem(address)"></a><code class="function-signature">redeem(address _account) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IInitialReporter`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IInitialReporter.initialize(contract IAugur,contract IMarket,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.report(address,bytes32,uint256[],uint256)"><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code></a></li><li><a href="#IInitialReporter.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#IInitialReporter.designatedReporterWasCorrect()"><code class="function-signature">designatedReporterWasCorrect()</code></a></li><li><a href="#IInitialReporter.getDesignatedReporter()"><code class="function-signature">getDesignatedReporter()</code></a></li><li><a href="#IInitialReporter.getReportTimestamp()"><code class="function-signature">getReportTimestamp()</code></a></li><li><a href="#IInitialReporter.migrateToNewUniverse(address)"><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.returnRepFromDisavow()"><code class="function-signature">returnRepFromDisavow()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="factories#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.initialize(contract IAugur,contract IMarket,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.report(address,bytes32,uint256[],uint256)"></a><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.designatedReporterShowed()"></a><code class="function-signature">designatedReporterShowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.designatedReporterWasCorrect()"></a><code class="function-signature">designatedReporterWasCorrect() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getDesignatedReporter()"></a><code class="function-signature">getDesignatedReporter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getReportTimestamp()"></a><code class="function-signature">getReportTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.migrateToNewUniverse(address)"></a><code class="function-signature">migrateToNewUniverse(address _designatedReporter) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.returnRepFromDisavow()"></a><code class="function-signature">returnRepFromDisavow() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IMarket`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMarket.initialize(contract IAugur,contract IUniverse,uint256,uint256,uint256,address,address,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#IMarket.derivePayoutDistributionHash(uint256[])"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators)</code></a></li><li><a href="#IMarket.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IMarket.getDisputeWindow()"><code class="function-signature">getDisputeWindow()</code></a></li><li><a href="#IMarket.getNumberOfOutcomes()"><code class="function-signature">getNumberOfOutcomes()</code></a></li><li><a href="#IMarket.getNumTicks()"><code class="function-signature">getNumTicks()</code></a></li><li><a href="#IMarket.getShareToken(uint256)"><code class="function-signature">getShareToken(uint256 _outcome)</code></a></li><li><a href="#IMarket.getMarketCreatorSettlementFeeDivisor()"><code class="function-signature">getMarketCreatorSettlementFeeDivisor()</code></a></li><li><a href="#IMarket.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IMarket.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IMarket.getWinningPayoutDistributionHash()"><code class="function-signature">getWinningPayoutDistributionHash()</code></a></li><li><a href="#IMarket.getWinningPayoutNumerator(uint256)"><code class="function-signature">getWinningPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IMarket.getWinningReportingParticipant()"><code class="function-signature">getWinningReportingParticipant()</code></a></li><li><a href="#IMarket.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IMarket.getFinalizationTime()"><code class="function-signature">getFinalizationTime()</code></a></li><li><a href="#IMarket.getInitialReporter()"><code class="function-signature">getInitialReporter()</code></a></li><li><a href="#IMarket.getDesignatedReportingEndTime()"><code class="function-signature">getDesignatedReportingEndTime()</code></a></li><li><a href="#IMarket.getValidityBondAttoCash()"><code class="function-signature">getValidityBondAttoCash()</code></a></li><li><a href="#IMarket.deriveMarketCreatorFeeAmount(uint256)"><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount)</code></a></li><li><a href="#IMarket.recordMarketCreatorFees(uint256,address)"><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _affiliateAddress)</code></a></li><li><a href="#IMarket.isContainerForShareToken(contract IShareToken)"><code class="function-signature">isContainerForShareToken(contract IShareToken _shadyTarget)</code></a></li><li><a href="#IMarket.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IMarket.isInvalid()"><code class="function-signature">isInvalid()</code></a></li><li><a href="#IMarket.finalize()"><code class="function-signature">finalize()</code></a></li><li><a href="#IMarket.designatedReporterWasCorrect()"><code class="function-signature">designatedReporterWasCorrect()</code></a></li><li><a href="#IMarket.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#IMarket.isFinalized()"><code class="function-signature">isFinalized()</code></a></li><li><a href="#IMarket.assertBalances()"><code class="function-signature">assertBalances()</code></a></li><li class="inherited"><a href="factories#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="factories#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IMarket.initialize(contract IAugur,contract IUniverse,uint256,uint256,uint256,address,address,uint256,uint256)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOrders.saveOrder(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,bytes32,bytes32,bytes32,contract ERC20Token)"><code class="function-signature">saveOrder(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, contract ERC20Token _kycToken)</code></a></li><li><a href="#IOrders.removeOrder(bytes32)"><code class="function-signature">removeOrder(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getMarket(bytes32)"><code class="function-signature">getMarket(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderType(bytes32)"><code class="function-signature">getOrderType(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOutcome(bytes32)"><code class="function-signature">getOutcome(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getAmount(bytes32)"><code class="function-signature">getAmount(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getPrice(bytes32)"><code class="function-signature">getPrice(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderCreator(bytes32)"><code class="function-signature">getOrderCreator(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderSharesEscrowed(bytes32)"><code class="function-signature">getOrderSharesEscrowed(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderMoneyEscrowed(bytes32)"><code class="function-signature">getOrderMoneyEscrowed(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderDataForLogs(bytes32)"><code class="function-signature">getOrderDataForLogs(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getBetterOrderId(bytes32)"><code class="function-signature">getBetterOrderId(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getWorseOrderId(bytes32)"><code class="function-signature">getWorseOrderId(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getKYCToken(bytes32)"><code class="function-signature">getKYCToken(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getBestOrderId(enum Order.Types,contract IMarket,uint256,contract ERC20Token)"><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract ERC20Token _kycToken)</code></a></li><li><a href="#IOrders.getWorstOrderId(enum Order.Types,contract IMarket,uint256,contract ERC20Token)"><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract ERC20Token _kycToken)</code></a></li><li><a href="#IOrders.getLastOutcomePrice(contract IMarket,uint256)"><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IOrders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract ERC20Token)"><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract ERC20Token _kycToken)</code></a></li><li><a href="#IOrders.getTotalEscrowed(contract IMarket)"><code class="function-signature">getTotalEscrowed(contract IMarket _market)</code></a></li><li><a href="#IOrders.isBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#IOrders.isWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#IOrders.assertIsNotBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _betterOrderId)</code></a></li><li><a href="#IOrders.assertIsNotWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _worseOrderId)</code></a></li><li><a href="#IOrders.recordFillOrder(bytes32,uint256,uint256,uint256)"><code class="function-signature">recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill)</code></a></li><li><a href="#IOrders.setPrice(contract IMarket,uint256,uint256)"><code class="function-signature">setPrice(contract IMarket _market, uint256 _outcome, uint256 _price)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOrders.saveOrder(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,bytes32,bytes32,bytes32,contract ERC20Token)"></a><code class="function-signature">saveOrder(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, contract ERC20Token _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





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





<h4><a class="anchor" aria-hidden="true" id="IOrders.getKYCToken(bytes32)"></a><code class="function-signature">getKYCToken(bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">contract ERC20Token</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getBestOrderId(enum Order.Types,contract IMarket,uint256,contract ERC20Token)"></a><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract ERC20Token _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getWorstOrderId(enum Order.Types,contract IMarket,uint256,contract ERC20Token)"></a><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract ERC20Token _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getLastOutcomePrice(contract IMarket,uint256)"></a><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract ERC20Token)"></a><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract ERC20Token _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.getTotalEscrowed(contract IMarket)"></a><code class="function-signature">getTotalEscrowed(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.isBetterPrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">isBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.isWorsePrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">isWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.assertIsNotBetterPrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">assertIsNotBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _betterOrderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.assertIsNotWorsePrice(enum Order.Types,uint256,bytes32)"></a><code class="function-signature">assertIsNotWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _worseOrderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.recordFillOrder(bytes32,uint256,uint256,uint256)"></a><code class="function-signature">recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOrders.setPrice(contract IMarket,uint256,uint256)"></a><code class="function-signature">setPrice(contract IMarket _market, uint256 _outcome, uint256 _price) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `IOwnable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOwnable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOwnable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IRepPriceOracle`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IRepPriceOracle.getRepPriceInAttoCash()"><code class="function-signature">getRepPriceInAttoCash()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IRepPriceOracle.getRepPriceInAttoCash()"></a><code class="function-signature">getRepPriceInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IReportingParticipant`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li><a href="#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li><a href="#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li><a href="#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li><a href="#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li><a href="#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li><a href="#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li><a href="#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getStake()"></a><code class="function-signature">getStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getPayoutDistributionHash()"></a><code class="function-signature">getPayoutDistributionHash() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.liquidateLosing()"></a><code class="function-signature">liquidateLosing() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.redeem(address)"></a><code class="function-signature">redeem(address _redeemer) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.isDisavowed()"></a><code class="function-signature">isDisavowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getPayoutNumerator(uint256)"></a><code class="function-signature">getPayoutNumerator(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getPayoutNumerators()"></a><code class="function-signature">getPayoutNumerators() <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getMarket()"></a><code class="function-signature">getMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IReportingParticipant.getSize()"></a><code class="function-signature">getSize() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IReputationToken.migrateOut(contract IReputationToken,uint256)"><code class="function-signature">migrateOut(contract IReputationToken _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li><a href="#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li><a href="#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="factories#ERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="factories#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IReputationToken.migrateOut(contract IReputationToken,uint256)"></a><code class="function-signature">migrateOut(contract IReputationToken _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IShareToken.initialize(contract IAugur,contract IMarket,uint256,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, uint256 _outcome, address _erc820RegistryAddress)</code></a></li><li><a href="#IShareToken.createShares(address,uint256)"><code class="function-signature">createShares(address _owner, uint256 _amount)</code></a></li><li><a href="#IShareToken.destroyShares(address,uint256)"><code class="function-signature">destroyShares(address, uint256 balance)</code></a></li><li><a href="#IShareToken.getMarket()"><code class="function-signature">getMarket()</code></a></li><li><a href="#IShareToken.getOutcome()"><code class="function-signature">getOutcome()</code></a></li><li><a href="#IShareToken.trustedOrderTransfer(address,address,uint256)"><code class="function-signature">trustedOrderTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IShareToken.trustedFillOrderTransfer(address,address,uint256)"><code class="function-signature">trustedFillOrderTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IShareToken.trustedCancelOrderTransfer(address,address,uint256)"><code class="function-signature">trustedCancelOrderTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#ERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="factories#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IShareToken.initialize(contract IAugur,contract IMarket,uint256,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, uint256 _outcome, address _erc820RegistryAddress) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.createShares(address,uint256)"></a><code class="function-signature">createShares(address _owner, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.destroyShares(address,uint256)"></a><code class="function-signature">destroyShares(address, uint256 balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.getMarket()"></a><code class="function-signature">getMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.getOutcome()"></a><code class="function-signature">getOutcome() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.trustedOrderTransfer(address,address,uint256)"></a><code class="function-signature">trustedOrderTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.trustedFillOrderTransfer(address,address,uint256)"></a><code class="function-signature">trustedFillOrderTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IShareToken.trustedCancelOrderTransfer(address,address,uint256)"></a><code class="function-signature">trustedCancelOrderTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `ITyped`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITyped.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







### `IUniverse`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniverse.fork()"><code class="function-signature">fork()</code></a></li><li><a href="#IUniverse.getParentUniverse()"><code class="function-signature">getParentUniverse()</code></a></li><li><a href="#IUniverse.createChildUniverse(uint256[])"><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IUniverse.getChildUniverse(bytes32)"><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IUniverse.getAuction()"><code class="function-signature">getAuction()</code></a></li><li><a href="#IUniverse.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IUniverse.getForkEndTime()"><code class="function-signature">getForkEndTime()</code></a></li><li><a href="#IUniverse.getForkReputationGoal()"><code class="function-signature">getForkReputationGoal()</code></a></li><li><a href="#IUniverse.getParentPayoutDistributionHash()"><code class="function-signature">getParentPayoutDistributionHash()</code></a></li><li><a href="#IUniverse.getDisputeRoundDurationInSeconds(bool)"><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateDisputeWindowByTimestamp(uint256,bool)"><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateCurrentDisputeWindow(bool)"><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateNextDisputeWindow(bool)"><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreatePreviousDisputeWindow(bool)"><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOpenInterestInAttoCash()"><code class="function-signature">getOpenInterestInAttoCash()</code></a></li><li><a href="#IUniverse.getRepMarketCapInAttoCash()"><code class="function-signature">getRepMarketCapInAttoCash()</code></a></li><li><a href="#IUniverse.getTargetRepMarketCapInAttoCash()"><code class="function-signature">getTargetRepMarketCapInAttoCash()</code></a></li><li><a href="#IUniverse.getOrCacheValidityBond()"><code class="function-signature">getOrCacheValidityBond()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportStake()"><code class="function-signature">getOrCacheDesignatedReportStake()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportNoShowBond()"><code class="function-signature">getOrCacheDesignatedReportNoShowBond()</code></a></li><li><a href="#IUniverse.getOrCacheMarketRepBond()"><code class="function-signature">getOrCacheMarketRepBond()</code></a></li><li><a href="#IUniverse.getOrCacheReportingFeeDivisor()"><code class="function-signature">getOrCacheReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForFork()"><code class="function-signature">getDisputeThresholdForFork()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForDisputePacing()"><code class="function-signature">getDisputeThresholdForDisputePacing()</code></a></li><li><a href="#IUniverse.getInitialReportMinValue()"><code class="function-signature">getInitialReportMinValue()</code></a></li><li><a href="#IUniverse.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li><a href="#IUniverse.getReportingFeeDivisor()"><code class="function-signature">getReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.calculateFloatingValue(uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calculateFloatingValue(uint256 _badMarkets, uint256 _totalMarkets, uint256 _targetDivisor, uint256 _previousValue, uint256 _floor)</code></a></li><li><a href="#IUniverse.getOrCacheMarketCreationCost()"><code class="function-signature">getOrCacheMarketCreationCost()</code></a></li><li><a href="#IUniverse.getCurrentDisputeWindow(bool)"><code class="function-signature">getCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.isParentOf(contract IUniverse)"><code class="function-signature">isParentOf(contract IUniverse _shadyChild)</code></a></li><li><a href="#IUniverse.updateTentativeWinningChildUniverse(bytes32)"><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.isContainerForDisputeWindow(contract IDisputeWindow)"><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForMarket(contract IMarket)"><code class="function-signature">isContainerForMarket(contract IMarket _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IUniverse.isContainerForShareToken(contract IShareToken)"><code class="function-signature">isContainerForShareToken(contract IShareToken _shadyTarget)</code></a></li><li><a href="#IUniverse.addMarketTo()"><code class="function-signature">addMarketTo()</code></a></li><li><a href="#IUniverse.removeMarketFrom()"><code class="function-signature">removeMarketFrom()</code></a></li><li><a href="#IUniverse.decrementOpenInterest(uint256)"><code class="function-signature">decrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.decrementOpenInterestFromMarket(contract IMarket)"><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market)</code></a></li><li><a href="#IUniverse.incrementOpenInterest(uint256)"><code class="function-signature">incrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.incrementOpenInterestFromMarket(contract IMarket)"><code class="function-signature">incrementOpenInterestFromMarket(contract IMarket _market)</code></a></li><li><a href="#IUniverse.getWinningChildUniverse()"><code class="function-signature">getWinningChildUniverse()</code></a></li><li><a href="#IUniverse.isForking()"><code class="function-signature">isForking()</code></a></li><li><a href="#IUniverse.assertMarketBalance()"><code class="function-signature">assertMarketBalance()</code></a></li><li class="inherited"><a href="factories#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniverse.fork()"></a><code class="function-signature">fork() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getParentUniverse()"></a><code class="function-signature">getParentUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.createChildUniverse(uint256[])"></a><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getChildUniverse(bytes32)"></a><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getAuction()"></a><code class="function-signature">getAuction() <span class="return-arrow">→</span> <span class="return-type">contract IAuction</span></code><span class="function-visibility">public</span></h4>





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





<h4><a class="anchor" aria-hidden="true" id="IUniverse.calculateFloatingValue(uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calculateFloatingValue(uint256 _badMarkets, uint256 _totalMarkets, uint256 _targetDivisor, uint256 _previousValue, uint256 _floor) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getOrCacheMarketCreationCost()"></a><code class="function-signature">getOrCacheMarketCreationCost() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getCurrentDisputeWindow(bool)"></a><code class="function-signature">getCurrentDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isParentOf(contract IUniverse)"></a><code class="function-signature">isParentOf(contract IUniverse _shadyChild) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.updateTentativeWinningChildUniverse(bytes32)"></a><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForDisputeWindow(contract IDisputeWindow)"></a><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyTarget) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForMarket(contract IMarket)"></a><code class="function-signature">isContainerForMarket(contract IMarket _shadyTarget) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForReportingParticipant(contract IReportingParticipant)"></a><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isContainerForShareToken(contract IShareToken)"></a><code class="function-signature">isContainerForShareToken(contract IShareToken _shadyTarget) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.addMarketTo()"></a><code class="function-signature">addMarketTo() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.removeMarketFrom()"></a><code class="function-signature">removeMarketFrom() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.decrementOpenInterest(uint256)"></a><code class="function-signature">decrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.decrementOpenInterestFromMarket(contract IMarket)"></a><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.incrementOpenInterest(uint256)"></a><code class="function-signature">incrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.incrementOpenInterestFromMarket(contract IMarket)"></a><code class="function-signature">incrementOpenInterestFromMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.getWinningChildUniverse()"></a><code class="function-signature">getWinningChildUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.isForking()"></a><code class="function-signature">isForking() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.assertMarketBalance()"></a><code class="function-signature">assertMarketBalance() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IV2ReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IV2ReputationToken.trustedAuctionTransfer(address,address,uint256)"><code class="function-signature">trustedAuctionTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IV2ReputationToken.mintForAuction(uint256)"><code class="function-signature">mintForAuction(uint256 _amountToMint)</code></a></li><li><a href="#IV2ReputationToken.burnForAuction(uint256)"><code class="function-signature">burnForAuction(uint256 _amountToMint)</code></a></li><li><a href="#IV2ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li class="inherited"><a href="factories#IReputationToken.migrateOut(contract IReputationToken,uint256)"><code class="function-signature">migrateOut(contract IReputationToken _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li class="inherited"><a href="factories#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li class="inherited"><a href="factories#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="factories#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="factories#ERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="factories#ERC20Token.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="factories#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.trustedAuctionTransfer(address,address,uint256)"></a><code class="function-signature">trustedAuctionTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.mintForAuction(uint256)"></a><code class="function-signature">mintForAuction(uint256 _amountToMint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.burnForAuction(uint256)"></a><code class="function-signature">burnForAuction(uint256 _amountToMint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.burnForMarket(uint256)"></a><code class="function-signature">burnForMarket(uint256 _amountToBurn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Initializable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Initializable.endInitialization()"></a><code class="function-signature">endInitialization() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Initializable.getInitialized()"></a><code class="function-signature">getInitialized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Order`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Order.create(contract IAugur,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32,bool,contract ERC20Token)"><code class="function-signature">create(contract IAugur _augur, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId, bool _ignoreShares, contract ERC20Token _kycToken)</code></a></li><li><a href="#Order.getOrderId(struct Order.Data)"><code class="function-signature">getOrderId(struct Order.Data _orderData)</code></a></li><li><a href="#Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection)</code></a></li><li><a href="#Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection)</code></a></li><li><a href="#Order.escrowFunds(struct Order.Data)"><code class="function-signature">escrowFunds(struct Order.Data _orderData)</code></a></li><li><a href="#Order.saveOrder(struct Order.Data,bytes32)"><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Order.create(contract IAugur,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32,bool,contract ERC20Token)"></a><code class="function-signature">create(contract IAugur _augur, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId, bool _ignoreShares, contract ERC20Token _kycToken) <span class="return-arrow">→</span> <span class="return-type">struct Order.Data</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderId(struct Order.Data)"></a><code class="function-signature">getOrderId(struct Order.Data _orderData) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.escrowFunds(struct Order.Data)"></a><code class="function-signature">escrowFunds(struct Order.Data _orderData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.saveOrder(struct Order.Data,bytes32)"></a><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>







### `Reporting`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Reporting.getDesignatedReportingDurationSeconds()"><code class="function-signature">getDesignatedReportingDurationSeconds()</code></a></li><li><a href="#Reporting.getInitialDisputeRoundDurationSeconds()"><code class="function-signature">getInitialDisputeRoundDurationSeconds()</code></a></li><li><a href="#Reporting.getDisputeRoundDurationSeconds()"><code class="function-signature">getDisputeRoundDurationSeconds()</code></a></li><li><a href="#Reporting.getForkDurationSeconds()"><code class="function-signature">getForkDurationSeconds()</code></a></li><li><a href="#Reporting.getBaseMarketDurationMaximum()"><code class="function-signature">getBaseMarketDurationMaximum()</code></a></li><li><a href="#Reporting.getUpgradeCadence()"><code class="function-signature">getUpgradeCadence()</code></a></li><li><a href="#Reporting.getInitialUpgradeTimestamp()"><code class="function-signature">getInitialUpgradeTimestamp()</code></a></li><li><a href="#Reporting.getDefaultValidityBond()"><code class="function-signature">getDefaultValidityBond()</code></a></li><li><a href="#Reporting.getValidityBondFloor()"><code class="function-signature">getValidityBondFloor()</code></a></li><li><a href="#Reporting.getTargetInvalidMarketsDivisor()"><code class="function-signature">getTargetInvalidMarketsDivisor()</code></a></li><li><a href="#Reporting.getTargetIncorrectDesignatedReportMarketsDivisor()"><code class="function-signature">getTargetIncorrectDesignatedReportMarketsDivisor()</code></a></li><li><a href="#Reporting.getTargetDesignatedReportNoShowsDivisor()"><code class="function-signature">getTargetDesignatedReportNoShowsDivisor()</code></a></li><li><a href="#Reporting.getTargetRepMarketCapMultiplier()"><code class="function-signature">getTargetRepMarketCapMultiplier()</code></a></li><li><a href="#Reporting.getTargetRepMarketCapDivisor()"><code class="function-signature">getTargetRepMarketCapDivisor()</code></a></li><li><a href="#Reporting.getMaximumReportingFeeDivisor()"><code class="function-signature">getMaximumReportingFeeDivisor()</code></a></li><li><a href="#Reporting.getMinimumReportingFeeDivisor()"><code class="function-signature">getMinimumReportingFeeDivisor()</code></a></li><li><a href="#Reporting.getDefaultReportingFeeDivisor()"><code class="function-signature">getDefaultReportingFeeDivisor()</code></a></li><li><a href="#Reporting.getInitialREPSupply()"><code class="function-signature">getInitialREPSupply()</code></a></li><li><a href="#Reporting.getAuctionInitialRepPrice()"><code class="function-signature">getAuctionInitialRepPrice()</code></a></li><li><a href="#Reporting.getAuctionTargetSupplyDivisor()"><code class="function-signature">getAuctionTargetSupplyDivisor()</code></a></li><li><a href="#Reporting.getAuctionInitialPriceMultiplier()"><code class="function-signature">getAuctionInitialPriceMultiplier()</code></a></li><li><a href="#Reporting.getAuctionDuration()"><code class="function-signature">getAuctionDuration()</code></a></li></ul></div>



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





<h4><a class="anchor" aria-hidden="true" id="Reporting.getTargetRepMarketCapDivisor()"></a><code class="function-signature">getTargetRepMarketCapDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getMaximumReportingFeeDivisor()"></a><code class="function-signature">getMaximumReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getMinimumReportingFeeDivisor()"></a><code class="function-signature">getMinimumReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getDefaultReportingFeeDivisor()"></a><code class="function-signature">getDefaultReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getInitialREPSupply()"></a><code class="function-signature">getInitialREPSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getAuctionInitialRepPrice()"></a><code class="function-signature">getAuctionInitialRepPrice() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getAuctionTargetSupplyDivisor()"></a><code class="function-signature">getAuctionTargetSupplyDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getAuctionInitialPriceMultiplier()"></a><code class="function-signature">getAuctionInitialPriceMultiplier() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Reporting.getAuctionDuration()"></a><code class="function-signature">getAuctionDuration() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







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







### `DisputeCrowdsourcerFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#DisputeCrowdsourcerFactory.createDisputeCrowdsourcer(contract IAugur,contract IMarket,uint256,bytes32,uint256[])"><code class="function-signature">createDisputeCrowdsourcer(contract IAugur _augur, contract IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators)</code></a></li><li class="inherited"><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcerFactory.createDisputeCrowdsourcer(contract IAugur,contract IMarket,uint256,bytes32,uint256[])"></a><code class="function-signature">createDisputeCrowdsourcer(contract IAugur _augur, contract IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeCrowdsourcer</span></code><span class="function-visibility">public</span></h4>







### `DisputeWindowFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#DisputeWindowFactory.createDisputeWindow(contract IAugur,contract IUniverse,uint256,uint256,uint256)"><code class="function-signature">createDisputeWindow(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, uint256 _windowDuration, uint256 _startTime)</code></a></li><li class="inherited"><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="DisputeWindowFactory.createDisputeWindow(contract IAugur,contract IUniverse,uint256,uint256,uint256)"></a><code class="function-signature">createDisputeWindow(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, uint256 _windowDuration, uint256 _startTime) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>







### `IDisputeWindowFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeWindowFactory.createDisputeWindow(contract IAugur,contract IUniverse,uint256,uint256,uint256)"><code class="function-signature">createDisputeWindow(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, uint256 _windowDuration, uint256 _startTime)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeWindowFactory.createDisputeWindow(contract IAugur,contract IUniverse,uint256,uint256,uint256)"></a><code class="function-signature">createDisputeWindow(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, uint256 _windowDuration, uint256 _startTime) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>







### `IAuctionFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAuctionFactory.createAuction(contract IAugur,contract IUniverse,contract IReputationToken)"><code class="function-signature">createAuction(contract IAugur _augur, contract IUniverse _universe, contract IReputationToken _reputationToken)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAuctionFactory.createAuction(contract IAugur,contract IUniverse,contract IReputationToken)"></a><code class="function-signature">createAuction(contract IAugur _augur, contract IUniverse _universe, contract IReputationToken _reputationToken) <span class="return-arrow">→</span> <span class="return-type">contract IAuction</span></code><span class="function-visibility">public</span></h4>







### `IMarketFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMarketFactory.createMarket(contract IAugur,contract IUniverse,uint256,uint256,uint256,address,address,uint256,uint256)"><code class="function-signature">createMarket(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IMarketFactory.createMarket(contract IAugur,contract IUniverse,uint256,uint256,uint256,address,address,uint256,uint256)"></a><code class="function-signature">createMarket(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>







### `IReputationTokenFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IReputationTokenFactory.createReputationToken(contract IAugur,contract IUniverse,contract IUniverse)"><code class="function-signature">createReputationToken(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IReputationTokenFactory.createReputationToken(contract IAugur,contract IUniverse,contract IUniverse)"></a><code class="function-signature">createReputationToken(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse) <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">public</span></h4>







### `IUniverseFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniverseFactory.createUniverse(contract IAugur,contract IUniverse,bytes32,uint256[])"><code class="function-signature">createUniverse(contract IAugur _augur, contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniverseFactory.createUniverse(contract IAugur,contract IUniverse,bytes32,uint256[])"></a><code class="function-signature">createUniverse(contract IAugur _augur, contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>







### `InitialReporterFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#InitialReporterFactory.createInitialReporter(contract IAugur,contract IMarket,address)"><code class="function-signature">createInitialReporter(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code></a></li><li class="inherited"><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="InitialReporterFactory.createInitialReporter(contract IAugur,contract IMarket,address)"></a><code class="function-signature">createInitialReporter(contract IAugur _augur, contract IMarket _market, address _designatedReporter) <span class="return-arrow">→</span> <span class="return-type">contract IInitialReporter</span></code><span class="function-visibility">public</span></h4>







### `IMap`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMap.initialize(address)"><code class="function-signature">initialize(address _owner)</code></a></li><li><a href="#IMap.add(bytes32,address)"><code class="function-signature">add(bytes32 _key, address _value)</code></a></li><li><a href="#IMap.remove(bytes32)"><code class="function-signature">remove(bytes32 _key)</code></a></li><li><a href="#IMap.get(bytes32)"><code class="function-signature">get(bytes32 _key)</code></a></li><li><a href="#IMap.getAsAddressOrZero(bytes32)"><code class="function-signature">getAsAddressOrZero(bytes32 _key)</code></a></li><li><a href="#IMap.contains(bytes32)"><code class="function-signature">contains(bytes32 _key)</code></a></li><li><a href="#IMap.getCount()"><code class="function-signature">getCount()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IMap.initialize(address)"></a><code class="function-signature">initialize(address _owner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.add(bytes32,address)"></a><code class="function-signature">add(bytes32 _key, address _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.remove(bytes32)"></a><code class="function-signature">remove(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.get(bytes32)"></a><code class="function-signature">get(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.getAsAddressOrZero(bytes32)"></a><code class="function-signature">getAsAddressOrZero(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.contains(bytes32)"></a><code class="function-signature">contains(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.getCount()"></a><code class="function-signature">getCount() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `MapFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MapFactory.createMap(contract IAugur,address)"><code class="function-signature">createMap(contract IAugur _augur, address _owner)</code></a></li><li class="inherited"><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MapFactory.createMap(contract IAugur,address)"></a><code class="function-signature">createMap(contract IAugur _augur, address _owner) <span class="return-arrow">→</span> <span class="return-type">contract IMap</span></code><span class="function-visibility">public</span></h4>







### `MarketFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MarketFactory.createMarket(contract IAugur,contract IUniverse,uint256,uint256,uint256,address,address,uint256,uint256)"><code class="function-signature">createMarket(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li class="inherited"><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MarketFactory.createMarket(contract IAugur,contract IUniverse,uint256,uint256,uint256,address,address,uint256,uint256)"></a><code class="function-signature">createMarket(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>







### `ContractExists`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ContractExists.exists(address)"><code class="function-signature">exists(address _address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ContractExists.exists(address)"></a><code class="function-signature">exists(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `ERC777BaseToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777BaseToken.initialize820InterfaceImplementations()"><code class="function-signature">initialize820InterfaceImplementations()</code></a></li><li><a href="#ERC777BaseToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#ERC777BaseToken.balanceOf(address)"><code class="function-signature">balanceOf(address _tokenHolder)</code></a></li><li><a href="#ERC777BaseToken.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li><a href="#ERC777BaseToken.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li><a href="#ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data)</code></a></li><li><a href="#ERC777BaseToken.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li><a href="#ERC777BaseToken.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li><a href="#ERC777BaseToken.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li><a href="#ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li><a href="#ERC777BaseToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks)</code></a></li><li><a href="#ERC777BaseToken.doBurn(address,address,uint256,bytes32,bytes32)"><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li><a href="#ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking)</code></a></li><li><a href="#ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.setInterfaceImplementation(string,address)"><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.interfaceAddr(address,string)"><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.initialize820InterfaceImplementations()"></a><code class="function-signature">initialize820InterfaceImplementations() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.balanceOf(address)"></a><code class="function-signature">balanceOf(address _tokenHolder) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.defaultOperators()"></a><code class="function-signature">defaultOperators() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.send(address,uint256,bytes32)"></a><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"></a><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.authorizeOperator(address)"></a><code class="function-signature">authorizeOperator(address _operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.revokeOperator(address)"></a><code class="function-signature">revokeOperator(address _operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.isOperatorFor(address,address)"></a><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"></a><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.doBurn(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"></a><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `ERC777Token`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#ERC777Token.balanceOf(address)"><code class="function-signature">balanceOf(address _owner)</code></a></li><li><a href="#ERC777Token.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li><a href="#ERC777Token.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li><a href="#ERC777Token.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li><a href="#ERC777Token.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li><a href="#ERC777Token.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li><a href="#ERC777Token.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li><a href="#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li><a href="#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li><a href="#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li><a href="#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777Token.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.balanceOf(address)"></a><code class="function-signature">balanceOf(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.defaultOperators()"></a><code class="function-signature">defaultOperators() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.isOperatorFor(address,address)"></a><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.authorizeOperator(address)"></a><code class="function-signature">authorizeOperator(address _operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.revokeOperator(address)"></a><code class="function-signature">revokeOperator(address _operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.send(address,uint256,bytes32)"></a><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.operatorSend(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.Minted(address,address,uint256,bytes32)"></a><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.AuthorizedOperator(address,address)"></a><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.RevokedOperator(address,address)"></a><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code><span class="function-visibility"></span></h4>





### `ERC777TokensRecipient`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777TokensRecipient.tokensReceived(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">tokensReceived(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777TokensRecipient.tokensReceived(address,address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">tokensReceived(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code><span class="function-visibility">external</span></h4>







### `ERC777TokensSender`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777TokensSender.tokensToSend(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">tokensToSend(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777TokensSender.tokensToSend(address,address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">tokensToSend(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code><span class="function-visibility">external</span></h4>







### `ERC820Implementer`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC820Implementer.setInterfaceImplementation(string,address)"><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl)</code></a></li><li><a href="#ERC820Implementer.interfaceAddr(address,string)"><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC820Implementer.setInterfaceImplementation(string,address)"></a><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC820Implementer.interfaceAddr(address,string)"></a><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>







### `IERC820Registry`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC820Registry.getManager(address)"><code class="function-signature">getManager(address _address)</code></a></li><li><a href="#IERC820Registry.setManager(address,address)"><code class="function-signature">setManager(address _address, address _newManager)</code></a></li><li><a href="#IERC820Registry.getInterfaceImplementer(address,bytes32)"><code class="function-signature">getInterfaceImplementer(address _address, bytes32 _iHash)</code></a></li><li><a href="#IERC820Registry.setInterfaceImplementer(address,bytes32,address)"><code class="function-signature">setInterfaceImplementer(address _address, bytes32 _iHash, address _implementer)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC820Registry.getManager(address)"></a><code class="function-signature">getManager(address _address) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC820Registry.setManager(address,address)"></a><code class="function-signature">setManager(address _address, address _newManager)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC820Registry.getInterfaceImplementer(address,bytes32)"></a><code class="function-signature">getInterfaceImplementer(address _address, bytes32 _iHash) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC820Registry.setInterfaceImplementer(address,bytes32,address)"></a><code class="function-signature">setInterfaceImplementer(address _address, bytes32 _iHash, address _implementer)</code><span class="function-visibility">public</span></h4>







### `ReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse,address)"><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse, address _erc820RegistryAddress)</code></a></li><li><a href="#ReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.migrateOut(contract IReputationToken,uint256)"><code class="function-signature">migrateOut(contract IReputationToken _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li><a href="#ReputationToken.mintForAuction(uint256)"><code class="function-signature">mintForAuction(uint256 _amountToMint)</code></a></li><li><a href="#ReputationToken.burnForAuction(uint256)"><code class="function-signature">burnForAuction(uint256 _amountToBurn)</code></a></li><li><a href="#ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li><a href="#ReputationToken.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _value)</code></a></li><li><a href="#ReputationToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _value)</code></a></li><li><a href="#ReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedAuctionTransfer(address,address,uint256)"><code class="function-signature">trustedAuctionTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.getTypeName()"><code class="function-signature">getTypeName()</code></a></li><li><a href="#ReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#ReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li><a href="#ReputationToken.getLegacyRepToken()"><code class="function-signature">getLegacyRepToken()</code></a></li><li><a href="#ReputationToken.updateTotalTheoreticalSupply()"><code class="function-signature">updateTotalTheoreticalSupply()</code></a></li><li><a href="#ReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li><a href="#ReputationToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#ReputationToken.onMint(address,uint256)"><code class="function-signature">onMint(address _target, uint256 _amount)</code></a></li><li><a href="#ReputationToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address _target, uint256 _amount)</code></a></li><li><a href="#ReputationToken.migrateFromLegacyReputationToken()"><code class="function-signature">migrateFromLegacyReputationToken()</code></a></li><li class="inherited"><a href="factories#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#StandardToken.initialize820InterfaceImplementations()"><code class="function-signature">initialize820InterfaceImplementations()</code></a></li><li class="inherited"><a href="factories#StandardToken.internalTransfer(address,address,uint256,bool)"><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount, bool _callHooks)</code></a></li><li class="inherited"><a href="factories#StandardToken.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="factories#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="factories#StandardToken.approveInternal(address,address,uint256)"><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance)</code></a></li><li class="inherited"><a href="factories#StandardToken.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="factories#StandardToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks)</code></a></li><li class="inherited"><a href="factories#StandardToken.doBurn(address,address,uint256,bytes32,bytes32)"><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.balanceOf(address)"><code class="function-signature">balanceOf(address _tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.setInterfaceImplementation(string,address)"><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.interfaceAddr(address,string)"><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#VariableSupplyToken.Mint(address,uint256)"><code class="function-signature">Mint(address target, uint256 value)</code></a></li><li class="inherited"><a href="factories#VariableSupplyToken.Burn(address,uint256)"><code class="function-signature">Burn(address target, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse,address)"></a><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse, address _erc820RegistryAddress)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.migrateOutByPayout(uint256[],uint256)"></a><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.migrateOut(contract IReputationToken,uint256)"></a><code class="function-signature">migrateOut(contract IReputationToken _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.migrateIn(address,uint256)"></a><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.mintForReportingParticipant(uint256)"></a><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.mintForAuction(uint256)"></a><code class="function-signature">mintForAuction(uint256 _amountToMint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.burnForAuction(uint256)"></a><code class="function-signature">burnForAuction(uint256 _amountToBurn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.burnForMarket(uint256)"></a><code class="function-signature">burnForMarket(uint256 _amountToBurn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.transfer(address,uint256)"></a><code class="function-signature">transfer(address _to, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address _from, address _to, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.trustedUniverseTransfer(address,address,uint256)"></a><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.trustedMarketTransfer(address,address,uint256)"></a><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"></a><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.trustedAuctionTransfer(address,address,uint256)"></a><code class="function-signature">trustedAuctionTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"></a><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.getTotalMigrated()"></a><code class="function-signature">getTotalMigrated() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.getLegacyRepToken()"></a><code class="function-signature">getLegacyRepToken() <span class="return-arrow">→</span> <span class="return-type">contract ERC20Token</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.updateTotalTheoreticalSupply()"></a><code class="function-signature">updateTotalTheoreticalSupply() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.getTotalTheoreticalSupply()"></a><code class="function-signature">getTotalTheoreticalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.onMint(address,uint256)"></a><code class="function-signature">onMint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.migrateFromLegacyReputationToken()"></a><code class="function-signature">migrateFromLegacyReputationToken() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `ReputationTokenFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ReputationTokenFactory.createReputationToken(contract IAugur,contract IUniverse,contract IUniverse)"><code class="function-signature">createReputationToken(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ReputationTokenFactory.createReputationToken(contract IAugur,contract IUniverse,contract IUniverse)"></a><code class="function-signature">createReputationToken(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse) <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">public</span></h4>







### `StandardToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#StandardToken.initialize820InterfaceImplementations()"><code class="function-signature">initialize820InterfaceImplementations()</code></a></li><li><a href="#StandardToken.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _amount)</code></a></li><li><a href="#StandardToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#StandardToken.internalTransfer(address,address,uint256,bool)"><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount, bool _callHooks)</code></a></li><li><a href="#StandardToken.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li><a href="#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li><a href="#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li><a href="#StandardToken.approveInternal(address,address,uint256)"><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance)</code></a></li><li><a href="#StandardToken.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li><a href="#StandardToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks)</code></a></li><li><a href="#StandardToken.doBurn(address,address,uint256,bytes32,bytes32)"><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li><a href="#StandardToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.balanceOf(address)"><code class="function-signature">balanceOf(address _tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.setInterfaceImplementation(string,address)"><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.interfaceAddr(address,string)"><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="StandardToken.initialize820InterfaceImplementations()"></a><code class="function-signature">initialize820InterfaceImplementations() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.transfer(address,uint256)"></a><code class="function-signature">transfer(address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.internalTransfer(address,address,uint256,bool)"></a><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount, bool _callHooks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.approve(address,uint256)"></a><code class="function-signature">approve(address _spender, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.increaseApproval(address,uint256)"></a><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.decreaseApproval(address,uint256)"></a><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.approveInternal(address,address,uint256)"></a><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.allowance(address,address)"></a><code class="function-signature">allowance(address _owner, address _spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"></a><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.doBurn(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `VariableSupplyToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.onMint(address,uint256)"><code class="function-signature">onMint(address, uint256)</code></a></li><li><a href="#VariableSupplyToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address, uint256)</code></a></li><li class="inherited"><a href="factories#StandardToken.initialize820InterfaceImplementations()"><code class="function-signature">initialize820InterfaceImplementations()</code></a></li><li class="inherited"><a href="factories#StandardToken.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#StandardToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#StandardToken.internalTransfer(address,address,uint256,bool)"><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount, bool _callHooks)</code></a></li><li class="inherited"><a href="factories#StandardToken.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="factories#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="factories#StandardToken.approveInternal(address,address,uint256)"><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance)</code></a></li><li class="inherited"><a href="factories#StandardToken.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="factories#StandardToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks)</code></a></li><li class="inherited"><a href="factories#StandardToken.doBurn(address,address,uint256,bytes32,bytes32)"><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#StandardToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.balanceOf(address)"><code class="function-signature">balanceOf(address _tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.setInterfaceImplementation(string,address)"><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.interfaceAddr(address,string)"><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#VariableSupplyToken.Mint(address,uint256)"><code class="function-signature">Mint(address target, uint256 value)</code></a></li><li><a href="#VariableSupplyToken.Burn(address,uint256)"><code class="function-signature">Burn(address target, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.mint(address,uint256)"></a><code class="function-signature">mint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.burn(address,uint256)"></a><code class="function-signature">burn(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onMint(address,uint256)"></a><code class="function-signature">onMint(address, uint256) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address, uint256) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.Mint(address,uint256)"></a><code class="function-signature">Mint(address target, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.Burn(address,uint256)"></a><code class="function-signature">Burn(address target, uint256 value)</code><span class="function-visibility"></span></h4>





### `ShareTokenFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ShareTokenFactory.createShareToken(contract IAugur,contract IMarket,uint256)"><code class="function-signature">createShareToken(contract IAugur _augur, contract IMarket _market, uint256 _outcome)</code></a></li><li class="inherited"><a href="factories#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ShareTokenFactory.createShareToken(contract IAugur,contract IMarket,uint256)"></a><code class="function-signature">createShareToken(contract IAugur _augur, contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">contract IShareToken</span></code><span class="function-visibility">public</span></h4>







### `TestNetReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TestNetReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse,address)"><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse, address _erc820RegistryAddress)</code></a></li><li><a href="#TestNetReputationToken.faucet(uint256)"><code class="function-signature">faucet(uint256 _amount)</code></a></li><li class="inherited"><a href="factories#ReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#ReputationToken.migrateOut(contract IReputationToken,uint256)"><code class="function-signature">migrateOut(contract IReputationToken _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#ReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#ReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="factories#ReputationToken.mintForAuction(uint256)"><code class="function-signature">mintForAuction(uint256 _amountToMint)</code></a></li><li class="inherited"><a href="factories#ReputationToken.burnForAuction(uint256)"><code class="function-signature">burnForAuction(uint256 _amountToBurn)</code></a></li><li class="inherited"><a href="factories#ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li class="inherited"><a href="factories#ReputationToken.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _value)</code></a></li><li class="inherited"><a href="factories#ReputationToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="factories#ReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#ReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#ReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#ReputationToken.trustedAuctionTransfer(address,address,uint256)"><code class="function-signature">trustedAuctionTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#ReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="factories#ReputationToken.getTypeName()"><code class="function-signature">getTypeName()</code></a></li><li class="inherited"><a href="factories#ReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li class="inherited"><a href="factories#ReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li class="inherited"><a href="factories#ReputationToken.getLegacyRepToken()"><code class="function-signature">getLegacyRepToken()</code></a></li><li class="inherited"><a href="factories#ReputationToken.updateTotalTheoreticalSupply()"><code class="function-signature">updateTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="factories#ReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="factories#ReputationToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="factories#ReputationToken.onMint(address,uint256)"><code class="function-signature">onMint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#ReputationToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#ReputationToken.migrateFromLegacyReputationToken()"><code class="function-signature">migrateFromLegacyReputationToken()</code></a></li><li class="inherited"><a href="factories#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#StandardToken.initialize820InterfaceImplementations()"><code class="function-signature">initialize820InterfaceImplementations()</code></a></li><li class="inherited"><a href="factories#StandardToken.internalTransfer(address,address,uint256,bool)"><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount, bool _callHooks)</code></a></li><li class="inherited"><a href="factories#StandardToken.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="factories#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="factories#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="factories#StandardToken.approveInternal(address,address,uint256)"><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance)</code></a></li><li class="inherited"><a href="factories#StandardToken.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="factories#StandardToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks)</code></a></li><li class="inherited"><a href="factories#StandardToken.doBurn(address,address,uint256,bytes32,bytes32)"><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.balanceOf(address)"><code class="function-signature">balanceOf(address _tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking)</code></a></li><li class="inherited"><a href="factories#ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.setInterfaceImplementation(string,address)"><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl)</code></a></li><li class="inherited"><a href="factories#ERC820Implementer.interfaceAddr(address,string)"><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="factories#VariableSupplyToken.Mint(address,uint256)"><code class="function-signature">Mint(address target, uint256 value)</code></a></li><li class="inherited"><a href="factories#VariableSupplyToken.Burn(address,uint256)"><code class="function-signature">Burn(address target, uint256 value)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="factories#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="factories#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TestNetReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse,address)"></a><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse, address _erc820RegistryAddress)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TestNetReputationToken.faucet(uint256)"></a><code class="function-signature">faucet(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `TestNetReputationTokenFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TestNetReputationTokenFactory.createReputationToken(contract IAugur,contract IUniverse,contract IUniverse)"><code class="function-signature">createReputationToken(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TestNetReputationTokenFactory.createReputationToken(contract IAugur,contract IUniverse,contract IUniverse)"></a><code class="function-signature">createReputationToken(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse) <span class="return-arrow">→</span> <span class="return-type">contract IReputationToken</span></code><span class="function-visibility">public</span></h4>







### `Universe`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Universe.constructor(contract IAugur,contract IUniverse,bytes32,uint256[])"><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators)</code></a></li><li><a href="#Universe.fork()"><code class="function-signature">fork()</code></a></li><li><a href="#Universe.updateForkValues()"><code class="function-signature">updateForkValues()</code></a></li><li><a href="#Universe.getTypeName()"><code class="function-signature">getTypeName()</code></a></li><li><a href="#Universe.getParentUniverse()"><code class="function-signature">getParentUniverse()</code></a></li><li><a href="#Universe.getParentPayoutDistributionHash()"><code class="function-signature">getParentPayoutDistributionHash()</code></a></li><li><a href="#Universe.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#Universe.getAuction()"><code class="function-signature">getAuction()</code></a></li><li><a href="#Universe.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#Universe.getForkEndTime()"><code class="function-signature">getForkEndTime()</code></a></li><li><a href="#Universe.getForkReputationGoal()"><code class="function-signature">getForkReputationGoal()</code></a></li><li><a href="#Universe.getDisputeThresholdForFork()"><code class="function-signature">getDisputeThresholdForFork()</code></a></li><li><a href="#Universe.getDisputeThresholdForDisputePacing()"><code class="function-signature">getDisputeThresholdForDisputePacing()</code></a></li><li><a href="#Universe.getInitialReportMinValue()"><code class="function-signature">getInitialReportMinValue()</code></a></li><li><a href="#Universe.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li><a href="#Universe.getDisputeWindow(uint256)"><code class="function-signature">getDisputeWindow(uint256 _disputeWindowId)</code></a></li><li><a href="#Universe.isForking()"><code class="function-signature">isForking()</code></a></li><li><a href="#Universe.getChildUniverse(bytes32)"><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#Universe.getDisputeWindowId(uint256,bool)"><code class="function-signature">getDisputeWindowId(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#Universe.getDisputeRoundDurationInSeconds(bool)"><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial)</code></a></li><li><a href="#Universe.getOrCreateDisputeWindowByTimestamp(uint256,bool)"><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#Universe.getDisputeWindowByTimestamp(uint256,bool)"><code class="function-signature">getDisputeWindowByTimestamp(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#Universe.getOrCreatePreviousPreviousDisputeWindow(bool)"><code class="function-signature">getOrCreatePreviousPreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getOrCreatePreviousDisputeWindow(bool)"><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getPreviousDisputeWindow(bool)"><code class="function-signature">getPreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getOrCreateCurrentDisputeWindow(bool)"><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getCurrentDisputeWindow(bool)"><code class="function-signature">getCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getOrCreateNextDisputeWindow(bool)"><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getNextDisputeWindow(bool)"><code class="function-signature">getNextDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.createChildUniverse(uint256[])"><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#Universe.updateTentativeWinningChildUniverse(bytes32)"><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#Universe.getWinningChildUniverse()"><code class="function-signature">getWinningChildUniverse()</code></a></li><li><a href="#Universe.isContainerForDisputeWindow(contract IDisputeWindow)"><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyDisputeWindow)</code></a></li><li><a href="#Universe.isContainerForMarket(contract IMarket)"><code class="function-signature">isContainerForMarket(contract IMarket _shadyMarket)</code></a></li><li><a href="#Universe.addMarketTo()"><code class="function-signature">addMarketTo()</code></a></li><li><a href="#Universe.removeMarketFrom()"><code class="function-signature">removeMarketFrom()</code></a></li><li><a href="#Universe.isContainerForShareToken(contract IShareToken)"><code class="function-signature">isContainerForShareToken(contract IShareToken _shadyShareToken)</code></a></li><li><a href="#Universe.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _shadyReportingParticipant)</code></a></li><li><a href="#Universe.isParentOf(contract IUniverse)"><code class="function-signature">isParentOf(contract IUniverse _shadyChild)</code></a></li><li><a href="#Universe.decrementOpenInterest(uint256)"><code class="function-signature">decrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#Universe.decrementOpenInterestFromMarket(contract IMarket)"><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market)</code></a></li><li><a href="#Universe.incrementOpenInterest(uint256)"><code class="function-signature">incrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#Universe.incrementOpenInterestFromMarket(contract IMarket)"><code class="function-signature">incrementOpenInterestFromMarket(contract IMarket _market)</code></a></li><li><a href="#Universe.getOpenInterestInAttoCash()"><code class="function-signature">getOpenInterestInAttoCash()</code></a></li><li><a href="#Universe.getRepMarketCapInAttoCash()"><code class="function-signature">getRepMarketCapInAttoCash()</code></a></li><li><a href="#Universe.getTargetRepMarketCapInAttoCash()"><code class="function-signature">getTargetRepMarketCapInAttoCash()</code></a></li><li><a href="#Universe.getOrCacheValidityBond()"><code class="function-signature">getOrCacheValidityBond()</code></a></li><li><a href="#Universe.getOrCacheDesignatedReportStake()"><code class="function-signature">getOrCacheDesignatedReportStake()</code></a></li><li><a href="#Universe.getOrCacheDesignatedReportNoShowBond()"><code class="function-signature">getOrCacheDesignatedReportNoShowBond()</code></a></li><li><a href="#Universe.getOrCacheMarketRepBond()"><code class="function-signature">getOrCacheMarketRepBond()</code></a></li><li><a href="#Universe.calculateFloatingValue(uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calculateFloatingValue(uint256 _totalBad, uint256 _total, uint256 _targetDivisor, uint256 _previousValue, uint256 _floor)</code></a></li><li><a href="#Universe.getOrCacheReportingFeeDivisor()"><code class="function-signature">getOrCacheReportingFeeDivisor()</code></a></li><li><a href="#Universe.getReportingFeeDivisor()"><code class="function-signature">getReportingFeeDivisor()</code></a></li><li><a href="#Universe.calculateReportingFeeDivisor()"><code class="function-signature">calculateReportingFeeDivisor()</code></a></li><li><a href="#Universe.getOrCacheMarketCreationCost()"><code class="function-signature">getOrCacheMarketCreationCost()</code></a></li><li><a href="#Universe.getInitialReportStakeSize()"><code class="function-signature">getInitialReportStakeSize()</code></a></li><li><a href="#Universe.createYesNoMarket(uint256,uint256,uint256,address,bytes32,string)"><code class="function-signature">createYesNoMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32 _topic, string _extraInfo)</code></a></li><li><a href="#Universe.createCategoricalMarket(uint256,uint256,uint256,address,bytes32[],bytes32,string)"><code class="function-signature">createCategoricalMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32[] _outcomes, bytes32 _topic, string _extraInfo)</code></a></li><li><a href="#Universe.createScalarMarket(uint256,uint256,uint256,address,int256[],uint256,bytes32,string)"><code class="function-signature">createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] _prices, uint256 _numTicks, bytes32 _topic, string _extraInfo)</code></a></li><li><a href="#Universe.redeemStake(contract IReportingParticipant[],contract IDisputeWindow[])"><code class="function-signature">redeemStake(contract IReportingParticipant[] _reportingParticipants, contract IDisputeWindow[] _disputeWindows)</code></a></li><li><a href="#Universe.assertMarketBalance()"><code class="function-signature">assertMarketBalance()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Universe.constructor(contract IAugur,contract IUniverse,bytes32,uint256[])"></a><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.fork()"></a><code class="function-signature">fork() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.updateForkValues()"></a><code class="function-signature">updateForkValues() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getParentUniverse()"></a><code class="function-signature">getParentUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getParentPayoutDistributionHash()"></a><code class="function-signature">getParentPayoutDistributionHash() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getAuction()"></a><code class="function-signature">getAuction() <span class="return-arrow">→</span> <span class="return-type">contract IAuction</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getForkingMarket()"></a><code class="function-signature">getForkingMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getForkEndTime()"></a><code class="function-signature">getForkEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getForkReputationGoal()"></a><code class="function-signature">getForkReputationGoal() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeThresholdForFork()"></a><code class="function-signature">getDisputeThresholdForFork() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeThresholdForDisputePacing()"></a><code class="function-signature">getDisputeThresholdForDisputePacing() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getInitialReportMinValue()"></a><code class="function-signature">getInitialReportMinValue() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getPayoutNumerators()"></a><code class="function-signature">getPayoutNumerators() <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeWindow(uint256)"></a><code class="function-signature">getDisputeWindow(uint256 _disputeWindowId) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isForking()"></a><code class="function-signature">isForking() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getChildUniverse(bytes32)"></a><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeWindowId(uint256,bool)"></a><code class="function-signature">getDisputeWindowId(uint256 _timestamp, bool _initial) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeRoundDurationInSeconds(bool)"></a><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreateDisputeWindowByTimestamp(uint256,bool)"></a><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeWindowByTimestamp(uint256,bool)"></a><code class="function-signature">getDisputeWindowByTimestamp(uint256 _timestamp, bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreatePreviousPreviousDisputeWindow(bool)"></a><code class="function-signature">getOrCreatePreviousPreviousDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreatePreviousDisputeWindow(bool)"></a><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getPreviousDisputeWindow(bool)"></a><code class="function-signature">getPreviousDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreateCurrentDisputeWindow(bool)"></a><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getCurrentDisputeWindow(bool)"></a><code class="function-signature">getCurrentDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreateNextDisputeWindow(bool)"></a><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getNextDisputeWindow(bool)"></a><code class="function-signature">getNextDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.createChildUniverse(uint256[])"></a><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.updateTentativeWinningChildUniverse(bytes32)"></a><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getWinningChildUniverse()"></a><code class="function-signature">getWinningChildUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isContainerForDisputeWindow(contract IDisputeWindow)"></a><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyDisputeWindow) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isContainerForMarket(contract IMarket)"></a><code class="function-signature">isContainerForMarket(contract IMarket _shadyMarket) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.addMarketTo()"></a><code class="function-signature">addMarketTo() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.removeMarketFrom()"></a><code class="function-signature">removeMarketFrom() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isContainerForShareToken(contract IShareToken)"></a><code class="function-signature">isContainerForShareToken(contract IShareToken _shadyShareToken) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isContainerForReportingParticipant(contract IReportingParticipant)"></a><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _shadyReportingParticipant) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isParentOf(contract IUniverse)"></a><code class="function-signature">isParentOf(contract IUniverse _shadyChild) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.decrementOpenInterest(uint256)"></a><code class="function-signature">decrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.decrementOpenInterestFromMarket(contract IMarket)"></a><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.incrementOpenInterest(uint256)"></a><code class="function-signature">incrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.incrementOpenInterestFromMarket(contract IMarket)"></a><code class="function-signature">incrementOpenInterestFromMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOpenInterestInAttoCash()"></a><code class="function-signature">getOpenInterestInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getRepMarketCapInAttoCash()"></a><code class="function-signature">getRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getTargetRepMarketCapInAttoCash()"></a><code class="function-signature">getTargetRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheValidityBond()"></a><code class="function-signature">getOrCacheValidityBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheDesignatedReportStake()"></a><code class="function-signature">getOrCacheDesignatedReportStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheDesignatedReportNoShowBond()"></a><code class="function-signature">getOrCacheDesignatedReportNoShowBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheMarketRepBond()"></a><code class="function-signature">getOrCacheMarketRepBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.calculateFloatingValue(uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calculateFloatingValue(uint256 _totalBad, uint256 _total, uint256 _targetDivisor, uint256 _previousValue, uint256 _floor) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheReportingFeeDivisor()"></a><code class="function-signature">getOrCacheReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getReportingFeeDivisor()"></a><code class="function-signature">getReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.calculateReportingFeeDivisor()"></a><code class="function-signature">calculateReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheMarketCreationCost()"></a><code class="function-signature">getOrCacheMarketCreationCost() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getInitialReportStakeSize()"></a><code class="function-signature">getInitialReportStakeSize() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.createYesNoMarket(uint256,uint256,uint256,address,bytes32,string)"></a><code class="function-signature">createYesNoMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32 _topic, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.createCategoricalMarket(uint256,uint256,uint256,address,bytes32[],bytes32,string)"></a><code class="function-signature">createCategoricalMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32[] _outcomes, bytes32 _topic, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.createScalarMarket(uint256,uint256,uint256,address,int256[],uint256,bytes32,string)"></a><code class="function-signature">createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] _prices, uint256 _numTicks, bytes32 _topic, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.redeemStake(contract IReportingParticipant[],contract IDisputeWindow[])"></a><code class="function-signature">redeemStake(contract IReportingParticipant[] _reportingParticipants, contract IDisputeWindow[] _disputeWindows) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.assertMarketBalance()"></a><code class="function-signature">assertMarketBalance() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `UniverseFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#UniverseFactory.createUniverse(contract IAugur,contract IUniverse,bytes32,uint256[])"><code class="function-signature">createUniverse(contract IAugur _augur, contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="UniverseFactory.createUniverse(contract IAugur,contract IUniverse,bytes32,uint256[])"></a><code class="function-signature">createUniverse(contract IAugur _augur, contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>







</div>