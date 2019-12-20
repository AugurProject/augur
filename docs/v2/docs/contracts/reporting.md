---
title: Reporting
---

<div class="contracts">

## Contracts

### `Affiliates`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Affiliates.setFingerprint(bytes32)"><code class="function-signature">setFingerprint(bytes32 _fingerprint)</code></a></li><li><a href="#Affiliates.setReferrer(address)"><code class="function-signature">setReferrer(address _referrer)</code></a></li><li><a href="#Affiliates.getAccountFingerprint(address)"><code class="function-signature">getAccountFingerprint(address _account)</code></a></li><li><a href="#Affiliates.getReferrer(address)"><code class="function-signature">getReferrer(address _account)</code></a></li><li><a href="#Affiliates.getAndValidateReferrer(address,contract IAffiliateValidator)"><code class="function-signature">getAndValidateReferrer(address _account, contract IAffiliateValidator _affiliateValidator)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Affiliates.setFingerprint(bytes32)"></a><code class="function-signature">setFingerprint(bytes32 _fingerprint)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Affiliates.setReferrer(address)"></a><code class="function-signature">setReferrer(address _referrer)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Affiliates.getAccountFingerprint(address)"></a><code class="function-signature">getAccountFingerprint(address _account) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Affiliates.getReferrer(address)"></a><code class="function-signature">getReferrer(address _account) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Affiliates.getAndValidateReferrer(address,contract IAffiliateValidator)"></a><code class="function-signature">getAndValidateReferrer(address _account, contract IAffiliateValidator _affiliateValidator) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>







### `IAffiliateValidator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAffiliateValidator.validateReference(address,address)"><code class="function-signature">validateReference(address _account, address _referrer)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAffiliateValidator.validateReference(address,address)"></a><code class="function-signature">validateReference(address _account, address _referrer)</code><span class="function-visibility">external</span></h4>







### `BaseReportingParticipant`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BaseReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li><a href="#BaseReportingParticipant.fork()"><code class="function-signature">fork()</code></a></li><li><a href="#BaseReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li><li><a href="#BaseReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li><a href="#BaseReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li><a href="#BaseReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li><a href="#BaseReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#BaseReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BaseReportingParticipant.liquidateLosing()"></a><code class="function-signature">liquidateLosing()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BaseReportingParticipant.fork()"></a><code class="function-signature">fork()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BaseReportingParticipant.getSize()"></a><code class="function-signature">getSize() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BaseReportingParticipant.getPayoutDistributionHash()"></a><code class="function-signature">getPayoutDistributionHash() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BaseReportingParticipant.getMarket()"></a><code class="function-signature">getMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BaseReportingParticipant.isDisavowed()"></a><code class="function-signature">isDisavowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BaseReportingParticipant.getPayoutNumerator(uint256)"></a><code class="function-signature">getPayoutNumerator(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BaseReportingParticipant.getPayoutNumerators()"></a><code class="function-signature">getPayoutNumerators() <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>







### `DisputeCrowdsourcer`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#DisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _crowdsourcerGeneration)</code></a></li><li><a href="#DisputeCrowdsourcer.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li><a href="#DisputeCrowdsourcer.contribute(address,uint256,bool)"><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload)</code></a></li><li><a href="#DisputeCrowdsourcer.forkAndRedeem()"><code class="function-signature">forkAndRedeem()</code></a></li><li><a href="#DisputeCrowdsourcer.getRemainingToFill()"><code class="function-signature">getRemainingToFill()</code></a></li><li><a href="#DisputeCrowdsourcer.setSize(uint256)"><code class="function-signature">setSize(uint256 _size)</code></a></li><li><a href="#DisputeCrowdsourcer.getStake()"><code class="function-signature">getStake()</code></a></li><li><a href="#DisputeCrowdsourcer.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#DisputeCrowdsourcer.onMint(address,uint256)"><code class="function-signature">onMint(address _target, uint256 _amount)</code></a></li><li><a href="#DisputeCrowdsourcer.onBurn(address,uint256)"><code class="function-signature">onBurn(address _target, uint256 _amount)</code></a></li><li><a href="#DisputeCrowdsourcer.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#DisputeCrowdsourcer.correctSize()"><code class="function-signature">correctSize()</code></a></li><li><a href="#DisputeCrowdsourcer.getCrowdsourcerGeneration()"><code class="function-signature">getCrowdsourcerGeneration()</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li><li class="inherited"><a href="#BaseReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="#BaseReportingParticipant.fork()"><code class="function-signature">fork()</code></a></li><li class="inherited"><a href="#BaseReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li><li class="inherited"><a href="#BaseReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="#BaseReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="#BaseReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="#BaseReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="#BaseReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],uint256)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _crowdsourcerGeneration)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.redeem(address)"></a><code class="function-signature">redeem(address _redeemer) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.contribute(address,uint256,bool)"></a><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.forkAndRedeem()"></a><code class="function-signature">forkAndRedeem() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.getRemainingToFill()"></a><code class="function-signature">getRemainingToFill() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.setSize(uint256)"></a><code class="function-signature">setSize(uint256 _size)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.getStake()"></a><code class="function-signature">getStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.onMint(address,uint256)"></a><code class="function-signature">onMint(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.correctSize()"></a><code class="function-signature">correctSize() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeCrowdsourcer.getCrowdsourcerGeneration()"></a><code class="function-signature">getCrowdsourcerGeneration() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `ERC20`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li><a href="#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li><a href="#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li><a href="#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li><a href="#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li><a href="#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li><a href="#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li><a href="#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li><a href="#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li><a href="#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li><a href="#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li><a href="#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li><a href="#ERC20.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC20.balanceOf(address)"></a><code class="function-signature">balanceOf(address _account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

See {IERC20-balanceOf}.



<h4><a class="anchor" aria-hidden="true" id="ERC20.transfer(address,uint256)"></a><code class="function-signature">transfer(address _recipient, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See {IERC20-transfer}.

Requirements:

- `recipient` cannot be the zero address.
- the caller must have a balance of at least `amount`.



<h4><a class="anchor" aria-hidden="true" id="ERC20.allowance(address,address)"></a><code class="function-signature">allowance(address _owner, address _spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

See {IERC20-allowance}.



<h4><a class="anchor" aria-hidden="true" id="ERC20.approve(address,uint256)"></a><code class="function-signature">approve(address _spender, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See {IERC20-approve}.

Requirements:

- `spender` cannot be the zero address.



<h4><a class="anchor" aria-hidden="true" id="ERC20.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See {IERC20-transferFrom}.

Emits an {Approval} event indicating the updated allowance. This is not
required by the EIP. See the note at the beginning of {ERC20};

Requirements:
- `sender` and `recipient` cannot be the zero address.
- `sender` must have a balance of at least `amount`.
- the caller must have allowance for `sender`&#x27;s tokens of at least
`amount`.



<h4><a class="anchor" aria-hidden="true" id="ERC20.increaseAllowance(address,uint256)"></a><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Atomically increases the allowance granted to `spender` by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {Approval} event indicating the updated allowance.

Requirements:

- `spender` cannot be the zero address.



<h4><a class="anchor" aria-hidden="true" id="ERC20.decreaseAllowance(address,uint256)"></a><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Atomically decreases the allowance granted to `spender` by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {Approval} event indicating the updated allowance.

Requirements:

- `spender` cannot be the zero address.
- `spender` must have allowance for the caller of at least
`subtractedValue`.



<h4><a class="anchor" aria-hidden="true" id="ERC20._transfer(address,address,uint256)"></a><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code><span class="function-visibility">internal</span></h4>

Moves tokens `amount` from `sender` to `recipient`.

This is internal function is equivalent to {transfer}, and can be used to
e.g. implement automatic token fees, slashing mechanisms, etc.

Emits a {Transfer} event.

Requirements:

- `sender` cannot be the zero address.
- `recipient` cannot be the zero address.
- `sender` must have a balance of at least `amount`.



<h4><a class="anchor" aria-hidden="true" id="ERC20._mint(address,uint256)"></a><code class="function-signature">_mint(address _account, uint256 _amount)</code><span class="function-visibility">internal</span></h4>

Creates `amount` tokens and assigns them to `account`, increasing
the total supply.

Emits a {Transfer} event with `from` set to the zero address.

Requirements

- `to` cannot be the zero address.



<h4><a class="anchor" aria-hidden="true" id="ERC20._burn(address,uint256)"></a><code class="function-signature">_burn(address _account, uint256 _amount)</code><span class="function-visibility">internal</span></h4>

Destroys `amount` tokens from `account`, reducing the
total supply.

Emits a {Transfer} event with `to` set to the zero address.

Requirements

- `account` cannot be the zero address.
- `account` must have at least `amount` tokens.



<h4><a class="anchor" aria-hidden="true" id="ERC20._approve(address,address,uint256)"></a><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code><span class="function-visibility">internal</span></h4>

Sets `amount` as the allowance of `spender` over the `owner`s tokens.

This is internal function is equivalent to [`approve`](#ERC20.approve(address,uint256)), and can be used to
e.g. set automatic allowances for certain subsystems, etc.

Emits an {Approval} event.

Requirements:

- `owner` cannot be the zero address.
- `spender` cannot be the zero address.



<h4><a class="anchor" aria-hidden="true" id="ERC20._burnFrom(address,uint256)"></a><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code><span class="function-visibility">internal</span></h4>

Destroys `amount` tokens from `account`.`amount` is then deducted
from the caller&#x27;s allowance.

See {_burn} and {_approve}.



<h4><a class="anchor" aria-hidden="true" id="ERC20.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>







### `IAugur`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugur.createChildUniverse(bytes32,uint256[])"><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IAugur.isKnownUniverse(contract IUniverse)"><code class="function-signature">isKnownUniverse(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.trustedCashTransfer(address,address,uint256)"><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#IAugur.isTrustedSender(address)"><code class="function-signature">isTrustedSender(address _address)</code></a></li><li><a href="#IAugur.onCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"><code class="function-signature">onCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, bytes32[] _outcomes)</code></a></li><li><a href="#IAugur.onYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"><code class="function-signature">onYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash)</code></a></li><li><a href="#IAugur.onScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"><code class="function-signature">onScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, int256[] _prices, uint256 _numTicks)</code></a></li><li><a href="#IAugur.logInitialReportSubmitted(contract IUniverse,address,address,address,uint256,bool,uint256[],string,uint256,uint256)"><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, address _initialReporter, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string _description, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime)</code></a></li><li><a href="#IAugur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256,uint256)"><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size, uint256 _disputeRound)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string,uint256[],uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string description, uint256[] _payoutNumerators, uint256 _currentStake, uint256 _stakeRemaining, uint256 _disputeRound)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256[],uint256,uint256,bool,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime, bool _pacingOn, uint256 _totalRepStakedInPayout, uint256 _totalRepStakedInMarket, uint256 _disputeRound)</code></a></li><li><a href="#IAugur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logMarketFinalized(contract IUniverse,uint256[])"><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators)</code></a></li><li><a href="#IAugur.logMarketMigrated(contract IMarket,contract IUniverse)"><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse)</code></a></li><li><a href="#IAugur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IAugur.logMarketParticipantsDisavowed(contract IUniverse)"><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets)</code></a></li><li><a href="#IAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees)</code></a></li><li><a href="#IAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IAugur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees)</code></a></li><li><a href="#IAugur.logUniverseForked(contract IMarket)"><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket)</code></a></li><li><a href="#IAugur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeWindowCreated(contract IDisputeWindow,uint256,bool)"><code class="function-signature">logDisputeWindowCreated(contract IDisputeWindow _disputeWindow, uint256 _id, bool _initial)</code></a></li><li><a href="#IAugur.logParticipationTokensRedeemed(contract IUniverse,address,uint256,uint256)"><code class="function-signature">logParticipationTokensRedeemed(contract IUniverse universe, address _sender, uint256 _attoParticipationTokens, uint256 _feePayoutShare)</code></a></li><li><a href="#IAugur.logTimestampSet(uint256)"><code class="function-signature">logTimestampSet(uint256 _newTimestamp)</code></a></li><li><a href="#IAugur.logInitialReporterTransferred(contract IUniverse,contract IMarket,address,address)"><code class="function-signature">logInitialReporterTransferred(contract IUniverse _universe, contract IMarket _market, address _from, address _to)</code></a></li><li><a href="#IAugur.logMarketTransferred(contract IUniverse,address,address)"><code class="function-signature">logMarketTransferred(contract IUniverse _universe, address _from, address _to)</code></a></li><li><a href="#IAugur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.isKnownFeeSender(address)"><code class="function-signature">isKnownFeeSender(address _feeSender)</code></a></li><li><a href="#IAugur.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#IAugur.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#IAugur.getMaximumMarketEndDate()"><code class="function-signature">getMaximumMarketEndDate()</code></a></li><li><a href="#IAugur.isKnownMarket(contract IMarket)"><code class="function-signature">isKnownMarket(contract IMarket _market)</code></a></li><li><a href="#IAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 numOutcomes)</code></a></li><li><a href="#IAugur.logValidityBondChanged(uint256)"><code class="function-signature">logValidityBondChanged(uint256 _validityBond)</code></a></li><li><a href="#IAugur.logDesignatedReportStakeChanged(uint256)"><code class="function-signature">logDesignatedReportStakeChanged(uint256 _designatedReportStake)</code></a></li><li><a href="#IAugur.logNoShowBondChanged(uint256)"><code class="function-signature">logNoShowBondChanged(uint256 _noShowBond)</code></a></li><li><a href="#IAugur.logReportingFeeChanged(uint256)"><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee)</code></a></li><li><a href="#IAugur.getUniverseForkIndex(contract IUniverse)"><code class="function-signature">getUniverseForkIndex(contract IUniverse _universe)</code></a></li></ul></div>



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







### `IAugurTrading`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugurTrading.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#IAugurTrading.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost)</code></a></li><li><a href="#IAugurTrading.logOrderCreated(contract IUniverse,bytes32,bytes32)"><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#IAugurTrading.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId)</code></a></li><li><a href="#IAugurTrading.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#IAugurTrading.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[])"><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes)</code></a></li><li><a href="#IAugurTrading.logZeroXOrderFilled(contract IUniverse,contract IMarket,bytes32,uint8,address[],uint256[])"><code class="function-signature">logZeroXOrderFilled(contract IUniverse _universe, contract IMarket _market, bytes32 _tradeGroupId, uint8 _orderType, address[] _addressData, uint256[] _uint256Data)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"></a><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logOrderCreated(contract IUniverse,bytes32,bytes32)"></a><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"></a><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"></a><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[])"></a><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurTrading.logZeroXOrderFilled(contract IUniverse,contract IMarket,bytes32,uint8,address[],uint256[])"></a><code class="function-signature">logZeroXOrderFilled(contract IUniverse _universe, contract IMarket _market, bytes32 _tradeGroupId, uint8 _orderType, address[] _addressData, uint256[] _uint256Data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `ICash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ICash.joinMint(address,uint256)"><code class="function-signature">joinMint(address usr, uint256 wad)</code></a></li><li><a href="#ICash.joinBurn(address,uint256)"><code class="function-signature">joinBurn(address usr, uint256 wad)</code></a></li><li class="inherited"><a href="reporting#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="reporting#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="reporting#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="reporting#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="reporting#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ICash.joinMint(address,uint256)"></a><code class="function-signature">joinMint(address usr, uint256 wad) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ICash.joinBurn(address,uint256)"></a><code class="function-signature">joinBurn(address usr, uint256 wad) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IDisputeCrowdsourcer`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _crowdsourcerGeneration)</code></a></li><li><a href="#IDisputeCrowdsourcer.contribute(address,uint256,bool)"><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload)</code></a></li><li><a href="#IDisputeCrowdsourcer.setSize(uint256)"><code class="function-signature">setSize(uint256 _size)</code></a></li><li><a href="#IDisputeCrowdsourcer.getRemainingToFill()"><code class="function-signature">getRemainingToFill()</code></a></li><li><a href="#IDisputeCrowdsourcer.correctSize()"><code class="function-signature">correctSize()</code></a></li><li><a href="#IDisputeCrowdsourcer.getCrowdsourcerGeneration()"><code class="function-signature">getCrowdsourcerGeneration()</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li class="inherited"><a href="#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.initialize(contract IAugur,contract IMarket,uint256,bytes32,uint256[],uint256)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _crowdsourcerGeneration)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.contribute(address,uint256,bool)"></a><code class="function-signature">contribute(address _participant, uint256 _amount, bool _overload) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.setSize(uint256)"></a><code class="function-signature">setSize(uint256 _size)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.getRemainingToFill()"></a><code class="function-signature">getRemainingToFill() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.correctSize()"></a><code class="function-signature">correctSize() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcer.getCrowdsourcerGeneration()"></a><code class="function-signature">getCrowdsourcerGeneration() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IDisputeWindow`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeWindow.invalidMarketsTotal()"><code class="function-signature">invalidMarketsTotal()</code></a></li><li><a href="#IDisputeWindow.validityBondTotal()"><code class="function-signature">validityBondTotal()</code></a></li><li><a href="#IDisputeWindow.incorrectDesignatedReportTotal()"><code class="function-signature">incorrectDesignatedReportTotal()</code></a></li><li><a href="#IDisputeWindow.initialReportBondTotal()"><code class="function-signature">initialReportBondTotal()</code></a></li><li><a href="#IDisputeWindow.designatedReportNoShowsTotal()"><code class="function-signature">designatedReportNoShowsTotal()</code></a></li><li><a href="#IDisputeWindow.designatedReporterNoShowBondTotal()"><code class="function-signature">designatedReporterNoShowBondTotal()</code></a></li><li><a href="#IDisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,bool,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, bool _participationTokensEnabled, uint256 _duration, uint256 _startTime)</code></a></li><li><a href="#IDisputeWindow.trustedBuy(address,uint256)"><code class="function-signature">trustedBuy(address _buyer, uint256 _attotokens)</code></a></li><li><a href="#IDisputeWindow.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IDisputeWindow.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IDisputeWindow.getStartTime()"><code class="function-signature">getStartTime()</code></a></li><li><a href="#IDisputeWindow.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IDisputeWindow.getWindowId()"><code class="function-signature">getWindowId()</code></a></li><li><a href="#IDisputeWindow.isActive()"><code class="function-signature">isActive()</code></a></li><li><a href="#IDisputeWindow.isOver()"><code class="function-signature">isOver()</code></a></li><li><a href="#IDisputeWindow.onMarketFinalized()"><code class="function-signature">onMarketFinalized()</code></a></li><li><a href="#IDisputeWindow.redeem(address)"><code class="function-signature">redeem(address _account)</code></a></li><li class="inherited"><a href="reporting#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="reporting#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="reporting#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="reporting#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="reporting#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="reporting#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IInitialReporter.initialize(contract IAugur,contract IMarket,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.report(address,bytes32,uint256[],uint256)"><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code></a></li><li><a href="#IInitialReporter.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#IInitialReporter.initialReporterWasCorrect()"><code class="function-signature">initialReporterWasCorrect()</code></a></li><li><a href="#IInitialReporter.getDesignatedReporter()"><code class="function-signature">getDesignatedReporter()</code></a></li><li><a href="#IInitialReporter.getReportTimestamp()"><code class="function-signature">getReportTimestamp()</code></a></li><li><a href="#IInitialReporter.migrateToNewUniverse(address)"><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.returnRepFromDisavow()"><code class="function-signature">returnRepFromDisavow()</code></a></li><li class="inherited"><a href="reporting#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="reporting#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li class="inherited"><a href="reporting#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="reporting#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="reporting#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="reporting#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li class="inherited"><a href="reporting#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="reporting#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="reporting#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="reporting#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="reporting#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.initialize(contract IAugur,contract IMarket,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.report(address,bytes32,uint256[],uint256)"></a><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.designatedReporterShowed()"></a><code class="function-signature">designatedReporterShowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.initialReporterWasCorrect()"></a><code class="function-signature">initialReporterWasCorrect() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getDesignatedReporter()"></a><code class="function-signature">getDesignatedReporter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getReportTimestamp()"></a><code class="function-signature">getReportTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.migrateToNewUniverse(address)"></a><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.returnRepFromDisavow()"></a><code class="function-signature">returnRepFromDisavow()</code><span class="function-visibility">public</span></h4>







### `IMarket`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMarket.initialize(contract IAugur,contract IUniverse,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#IMarket.derivePayoutDistributionHash(uint256[])"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators)</code></a></li><li><a href="#IMarket.doInitialReport(uint256[],string,uint256)"><code class="function-signature">doInitialReport(uint256[] _payoutNumerators, string _description, uint256 _additionalStake)</code></a></li><li><a href="#IMarket.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IMarket.getDisputeWindow()"><code class="function-signature">getDisputeWindow()</code></a></li><li><a href="#IMarket.getNumberOfOutcomes()"><code class="function-signature">getNumberOfOutcomes()</code></a></li><li><a href="#IMarket.getNumTicks()"><code class="function-signature">getNumTicks()</code></a></li><li><a href="#IMarket.getMarketCreatorSettlementFeeDivisor()"><code class="function-signature">getMarketCreatorSettlementFeeDivisor()</code></a></li><li><a href="#IMarket.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IMarket.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IMarket.getWinningPayoutDistributionHash()"><code class="function-signature">getWinningPayoutDistributionHash()</code></a></li><li><a href="#IMarket.getWinningPayoutNumerator(uint256)"><code class="function-signature">getWinningPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IMarket.getWinningReportingParticipant()"><code class="function-signature">getWinningReportingParticipant()</code></a></li><li><a href="#IMarket.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IMarket.getFinalizationTime()"><code class="function-signature">getFinalizationTime()</code></a></li><li><a href="#IMarket.getInitialReporter()"><code class="function-signature">getInitialReporter()</code></a></li><li><a href="#IMarket.getDesignatedReportingEndTime()"><code class="function-signature">getDesignatedReportingEndTime()</code></a></li><li><a href="#IMarket.getValidityBondAttoCash()"><code class="function-signature">getValidityBondAttoCash()</code></a></li><li><a href="#IMarket.getAffiliateFeeDivisor()"><code class="function-signature">getAffiliateFeeDivisor()</code></a></li><li><a href="#IMarket.getNumParticipants()"><code class="function-signature">getNumParticipants()</code></a></li><li><a href="#IMarket.getDesignatedReporter()"><code class="function-signature">getDesignatedReporter()</code></a></li><li><a href="#IMarket.getDisputePacingOn()"><code class="function-signature">getDisputePacingOn()</code></a></li><li><a href="#IMarket.deriveMarketCreatorFeeAmount(uint256)"><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount)</code></a></li><li><a href="#IMarket.recordMarketCreatorFees(uint256,address,bytes32)"><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#IMarket.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IMarket.isInvalid()"><code class="function-signature">isInvalid()</code></a></li><li><a href="#IMarket.finalize()"><code class="function-signature">finalize()</code></a></li><li><a href="#IMarket.initialReporterWasCorrect()"><code class="function-signature">initialReporterWasCorrect()</code></a></li><li><a href="#IMarket.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#IMarket.isFinalized()"><code class="function-signature">isFinalized()</code></a></li><li><a href="#IMarket.assertBalances()"><code class="function-signature">assertBalances()</code></a></li><li><a href="#IMarket.getOpenInterest()"><code class="function-signature">getOpenInterest()</code></a></li><li class="inherited"><a href="reporting#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="reporting#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



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





<h4><a class="anchor" aria-hidden="true" id="IMarket.getAffiliateFeeDivisor()"></a><code class="function-signature">getAffiliateFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getNumParticipants()"></a><code class="function-signature">getNumParticipants() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getDesignatedReporter()"></a><code class="function-signature">getDesignatedReporter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getDisputePacingOn()"></a><code class="function-signature">getDisputePacingOn() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.deriveMarketCreatorFeeAmount(uint256)"></a><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.recordMarketCreatorFees(uint256,address,bytes32)"></a><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _sourceAccount, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isContainerForReportingParticipant(contract IReportingParticipant)"></a><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isInvalid()"></a><code class="function-signature">isInvalid() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.finalize()"></a><code class="function-signature">finalize() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.initialReporterWasCorrect()"></a><code class="function-signature">initialReporterWasCorrect() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.designatedReporterShowed()"></a><code class="function-signature">designatedReporterShowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.isFinalized()"></a><code class="function-signature">isFinalized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.assertBalances()"></a><code class="function-signature">assertBalances() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMarket.getOpenInterest()"></a><code class="function-signature">getOpenInterest() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IOrders`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOrders.saveOrder(uint256[],bytes32[],enum Order.Types,contract IMarket,address,contract IERC20)"><code class="function-signature">saveOrder(uint256[] _uints, bytes32[] _bytes32s, enum Order.Types _type, contract IMarket _market, address _sender, contract IERC20 _kycToken)</code></a></li><li><a href="#IOrders.removeOrder(bytes32)"><code class="function-signature">removeOrder(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getMarket(bytes32)"><code class="function-signature">getMarket(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderType(bytes32)"><code class="function-signature">getOrderType(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOutcome(bytes32)"><code class="function-signature">getOutcome(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getAmount(bytes32)"><code class="function-signature">getAmount(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getPrice(bytes32)"><code class="function-signature">getPrice(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderCreator(bytes32)"><code class="function-signature">getOrderCreator(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderSharesEscrowed(bytes32)"><code class="function-signature">getOrderSharesEscrowed(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderMoneyEscrowed(bytes32)"><code class="function-signature">getOrderMoneyEscrowed(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderDataForCancel(bytes32)"><code class="function-signature">getOrderDataForCancel(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getOrderDataForLogs(bytes32)"><code class="function-signature">getOrderDataForLogs(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getBetterOrderId(bytes32)"><code class="function-signature">getBetterOrderId(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getWorseOrderId(bytes32)"><code class="function-signature">getWorseOrderId(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getKYCToken(bytes32)"><code class="function-signature">getKYCToken(bytes32 _orderId)</code></a></li><li><a href="#IOrders.getBestOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"><code class="function-signature">getBestOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken)</code></a></li><li><a href="#IOrders.getWorstOrderId(enum Order.Types,contract IMarket,uint256,contract IERC20)"><code class="function-signature">getWorstOrderId(enum Order.Types _type, contract IMarket _market, uint256 _outcome, contract IERC20 _kycToken)</code></a></li><li><a href="#IOrders.getLastOutcomePrice(contract IMarket,uint256)"><code class="function-signature">getLastOutcomePrice(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IOrders.getOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract IERC20)"><code class="function-signature">getOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract IERC20 _kycToken)</code></a></li><li><a href="#IOrders.getTotalEscrowed(contract IMarket)"><code class="function-signature">getTotalEscrowed(contract IMarket _market)</code></a></li><li><a href="#IOrders.isBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#IOrders.isWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">isWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _orderId)</code></a></li><li><a href="#IOrders.assertIsNotBetterPrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotBetterPrice(enum Order.Types _type, uint256 _price, bytes32 _betterOrderId)</code></a></li><li><a href="#IOrders.assertIsNotWorsePrice(enum Order.Types,uint256,bytes32)"><code class="function-signature">assertIsNotWorsePrice(enum Order.Types _type, uint256 _price, bytes32 _worseOrderId)</code></a></li><li><a href="#IOrders.recordFillOrder(bytes32,uint256,uint256,uint256)"><code class="function-signature">recordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill)</code></a></li><li><a href="#IOrders.setPrice(contract IMarket,uint256,uint256)"><code class="function-signature">setPrice(contract IMarket _market, uint256 _outcome, uint256 _price)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOrders.saveOrder(uint256[],bytes32[],enum Order.Types,contract IMarket,address,contract IERC20)"></a><code class="function-signature">saveOrder(uint256[] _uints, bytes32[] _bytes32s, enum Order.Types _type, contract IMarket _market, address _sender, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li><a href="#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li><a href="#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="reporting#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="reporting#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="reporting#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="reporting#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="reporting#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IShareToken.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#IShareToken.initializeMarket(contract IMarket,uint256,uint256)"><code class="function-signature">initializeMarket(contract IMarket _market, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#IShareToken.unsafeTransferFrom(address,address,uint256,uint256)"><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code></a></li><li><a href="#IShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code></a></li><li><a href="#IShareToken.claimTradingProceeds(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#IShareToken.getMarket(uint256)"><code class="function-signature">getMarket(uint256 _tokenId)</code></a></li><li><a href="#IShareToken.getOutcome(uint256)"><code class="function-signature">getOutcome(uint256 _tokenId)</code></a></li><li><a href="#IShareToken.getTokenId(contract IMarket,uint256)"><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IShareToken.getTokenIds(contract IMarket,uint256[])"><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes)</code></a></li><li><a href="#IShareToken.buyCompleteSets(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#IShareToken.buyCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address)"><code class="function-signature">buyCompleteSetsForTrade(contract IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient)</code></a></li><li><a href="#IShareToken.sellCompleteSets(contract IMarket,address,address,uint256,bytes32)"><code class="function-signature">sellCompleteSets(contract IMarket _market, address _holder, address _recipient, uint256 _amount, bytes32 _fingerprint)</code></a></li><li><a href="#IShareToken.sellCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address,address,address,uint256,address,bytes32)"><code class="function-signature">sellCompleteSetsForTrade(contract IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#IShareToken.totalSupplyForMarketOutcome(contract IMarket,uint256)"><code class="function-signature">totalSupplyForMarketOutcome(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IShareToken.balanceOfMarketOutcome(contract IMarket,uint256,address)"><code class="function-signature">balanceOfMarketOutcome(contract IMarket _market, uint256 _outcome, address _account)</code></a></li><li><a href="#IShareToken.lowestBalanceOfMarketOutcomes(contract IMarket,uint256[],address)"><code class="function-signature">lowestBalanceOfMarketOutcomes(contract IMarket _market, uint256[] _outcomes, address _account)</code></a></li><li class="inherited"><a href="reporting#IERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="reporting#IERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="reporting#IERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li class="inherited"><a href="reporting#IERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address owner, address operator)</code></a></li><li class="inherited"><a href="reporting#IERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address owner, uint256 id)</code></a></li><li class="inherited"><a href="reporting#IERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li class="inherited"><a href="reporting#IERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids)</code></a></li><li class="inherited"><a href="reporting#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="reporting#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="reporting#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="reporting#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="reporting#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



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







### `ITyped`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITyped.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







### `IUniverse`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniverse.creationTime()"><code class="function-signature">creationTime()</code></a></li><li><a href="#IUniverse.marketBalance(address)"><code class="function-signature">marketBalance(address)</code></a></li><li><a href="#IUniverse.fork()"><code class="function-signature">fork()</code></a></li><li><a href="#IUniverse.updateForkValues()"><code class="function-signature">updateForkValues()</code></a></li><li><a href="#IUniverse.getParentUniverse()"><code class="function-signature">getParentUniverse()</code></a></li><li><a href="#IUniverse.createChildUniverse(uint256[])"><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IUniverse.getChildUniverse(bytes32)"><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IUniverse.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IUniverse.getForkEndTime()"><code class="function-signature">getForkEndTime()</code></a></li><li><a href="#IUniverse.getForkReputationGoal()"><code class="function-signature">getForkReputationGoal()</code></a></li><li><a href="#IUniverse.getParentPayoutDistributionHash()"><code class="function-signature">getParentPayoutDistributionHash()</code></a></li><li><a href="#IUniverse.getDisputeRoundDurationInSeconds(bool)"><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateDisputeWindowByTimestamp(uint256,bool)"><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateCurrentDisputeWindow(bool)"><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateNextDisputeWindow(bool)"><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreatePreviousDisputeWindow(bool)"><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOpenInterestInAttoCash()"><code class="function-signature">getOpenInterestInAttoCash()</code></a></li><li><a href="#IUniverse.getRepMarketCapInAttoCash()"><code class="function-signature">getRepMarketCapInAttoCash()</code></a></li><li><a href="#IUniverse.getTargetRepMarketCapInAttoCash()"><code class="function-signature">getTargetRepMarketCapInAttoCash()</code></a></li><li><a href="#IUniverse.getOrCacheValidityBond()"><code class="function-signature">getOrCacheValidityBond()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportStake()"><code class="function-signature">getOrCacheDesignatedReportStake()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportNoShowBond()"><code class="function-signature">getOrCacheDesignatedReportNoShowBond()</code></a></li><li><a href="#IUniverse.getOrCacheMarketRepBond()"><code class="function-signature">getOrCacheMarketRepBond()</code></a></li><li><a href="#IUniverse.getOrCacheReportingFeeDivisor()"><code class="function-signature">getOrCacheReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForFork()"><code class="function-signature">getDisputeThresholdForFork()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForDisputePacing()"><code class="function-signature">getDisputeThresholdForDisputePacing()</code></a></li><li><a href="#IUniverse.getInitialReportMinValue()"><code class="function-signature">getInitialReportMinValue()</code></a></li><li><a href="#IUniverse.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li><a href="#IUniverse.getReportingFeeDivisor()"><code class="function-signature">getReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IUniverse.getWinningChildPayoutNumerator(uint256)"><code class="function-signature">getWinningChildPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IUniverse.isOpenInterestCash(address)"><code class="function-signature">isOpenInterestCash(address)</code></a></li><li><a href="#IUniverse.isForkingMarket()"><code class="function-signature">isForkingMarket()</code></a></li><li><a href="#IUniverse.getCurrentDisputeWindow(bool)"><code class="function-signature">getCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getDisputeWindowStartTimeAndDuration(uint256,bool)"><code class="function-signature">getDisputeWindowStartTimeAndDuration(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#IUniverse.isParentOf(contract IUniverse)"><code class="function-signature">isParentOf(contract IUniverse _shadyChild)</code></a></li><li><a href="#IUniverse.updateTentativeWinningChildUniverse(bytes32)"><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.isContainerForDisputeWindow(contract IDisputeWindow)"><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForMarket(contract IMarket)"><code class="function-signature">isContainerForMarket(contract IMarket _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IUniverse.migrateMarketOut(contract IUniverse)"><code class="function-signature">migrateMarketOut(contract IUniverse _destinationUniverse)</code></a></li><li><a href="#IUniverse.migrateMarketIn(contract IMarket,uint256,uint256)"><code class="function-signature">migrateMarketIn(contract IMarket _market, uint256 _cashBalance, uint256 _marketOI)</code></a></li><li><a href="#IUniverse.decrementOpenInterest(uint256)"><code class="function-signature">decrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.decrementOpenInterestFromMarket(contract IMarket)"><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market)</code></a></li><li><a href="#IUniverse.incrementOpenInterest(uint256)"><code class="function-signature">incrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.getWinningChildUniverse()"><code class="function-signature">getWinningChildUniverse()</code></a></li><li><a href="#IUniverse.isForking()"><code class="function-signature">isForking()</code></a></li><li><a href="#IUniverse.deposit(address,uint256,address)"><code class="function-signature">deposit(address _sender, uint256 _amount, address _market)</code></a></li><li><a href="#IUniverse.withdraw(address,uint256,address)"><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market)</code></a></li><li><a href="#IUniverse.createScalarMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,int256[],uint256,string)"><code class="function-signature">createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] _prices, uint256 _numTicks, string _extraInfo)</code></a></li></ul></div>



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







### `IV2ReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IV2ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li><a href="#IV2ReputationToken.mintForWarpSync(uint256,address)"><code class="function-signature">mintForWarpSync(uint256 _amountToMint, address _target)</code></a></li><li class="inherited"><a href="reporting#IReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li class="inherited"><a href="reporting#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li class="inherited"><a href="reporting#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="reporting#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="reporting#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="reporting#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="reporting#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li class="inherited"><a href="reporting#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li class="inherited"><a href="reporting#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="reporting#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="reporting#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="reporting#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="reporting#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="reporting#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="reporting#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.burnForMarket(uint256)"></a><code class="function-signature">burnForMarket(uint256 _amountToBurn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.mintForWarpSync(uint256,address)"></a><code class="function-signature">mintForWarpSync(uint256 _amountToMint, address _target) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Initializable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Initializable.endInitialization()"></a><code class="function-signature">endInitialization()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Initializable.getInitialized()"></a><code class="function-signature">getInitialized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Order`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Order.create(contract IAugur,contract IAugurTrading,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32,contract IERC20)"><code class="function-signature">create(contract IAugur _augur, contract IAugurTrading _augurTrading, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId, contract IERC20 _kycToken)</code></a></li><li><a href="#Order.getOrderId(struct Order.Data,contract IOrders)"><code class="function-signature">getOrderId(struct Order.Data _orderData, contract IOrders _orders)</code></a></li><li><a href="#Order.calculateOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract IERC20)"><code class="function-signature">calculateOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract IERC20 _kycToken)</code></a></li><li><a href="#Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection)</code></a></li><li><a href="#Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection)</code></a></li><li><a href="#Order.saveOrder(struct Order.Data,bytes32,contract IOrders)"><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId, contract IOrders _orders)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Order.create(contract IAugur,contract IAugurTrading,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32,contract IERC20)"></a><code class="function-signature">create(contract IAugur _augur, contract IAugurTrading _augurTrading, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">struct Order.Data</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderId(struct Order.Data,contract IOrders)"></a><code class="function-signature">getOrderId(struct Order.Data _orderData, contract IOrders _orders) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.calculateOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256,contract IERC20)"></a><code class="function-signature">calculateOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, contract IERC20 _kycToken) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.saveOrder(struct Order.Data,bytes32,contract IOrders)"></a><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId, contract IOrders _orders) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>







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







### `VariableSupplyToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.onMint(address,uint256)"><code class="function-signature">onMint(address, uint256)</code></a></li><li><a href="#VariableSupplyToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address, uint256)</code></a></li><li class="inherited"><a href="reporting#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="reporting#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="reporting#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="reporting#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="reporting#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.mint(address,uint256)"></a><code class="function-signature">mint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.burn(address,uint256)"></a><code class="function-signature">burn(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onMint(address,uint256)"></a><code class="function-signature">onMint(address, uint256)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address, uint256)</code><span class="function-visibility">internal</span></h4>







### `CashSender`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#CashSender.initializeCashSender(address,address)"><code class="function-signature">initializeCashSender(address _vat, address _cash)</code></a></li><li><a href="#CashSender.cashTransfer(address,uint256)"><code class="function-signature">cashTransfer(address _to, uint256 _amount)</code></a></li><li><a href="#CashSender.cashTransferFrom(address,address,uint256)"><code class="function-signature">cashTransferFrom(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#CashSender.shutdownTransfer(address,address,uint256)"><code class="function-signature">shutdownTransfer(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#CashSender.vatDaiToDai(uint256)"><code class="function-signature">vatDaiToDai(uint256 _vDaiAmount)</code></a></li><li><a href="#CashSender.daiToVatDai(uint256)"><code class="function-signature">daiToVatDai(uint256 _daiAmount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="CashSender.initializeCashSender(address,address)"></a><code class="function-signature">initializeCashSender(address _vat, address _cash)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="CashSender.cashTransfer(address,uint256)"></a><code class="function-signature">cashTransfer(address _to, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="CashSender.cashTransferFrom(address,address,uint256)"></a><code class="function-signature">cashTransferFrom(address _from, address _to, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="CashSender.shutdownTransfer(address,address,uint256)"></a><code class="function-signature">shutdownTransfer(address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="CashSender.vatDaiToDai(uint256)"></a><code class="function-signature">vatDaiToDai(uint256 _vDaiAmount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="CashSender.daiToVatDai(uint256)"></a><code class="function-signature">daiToVatDai(uint256 _daiAmount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `CloneFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="CloneFactory.createClone(address)"></a><code class="function-signature">createClone(address target) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>







### `DisputeWindow`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#DisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,bool,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, bool _participationTokensEnabled, uint256 _duration, uint256 _startTime)</code></a></li><li><a href="#DisputeWindow.onMarketFinalized()"><code class="function-signature">onMarketFinalized()</code></a></li><li><a href="#DisputeWindow.buy(uint256)"><code class="function-signature">buy(uint256 _attotokens)</code></a></li><li><a href="#DisputeWindow.trustedBuy(address,uint256)"><code class="function-signature">trustedBuy(address _buyer, uint256 _attotokens)</code></a></li><li><a href="#DisputeWindow.redeem(address)"><code class="function-signature">redeem(address _account)</code></a></li><li><a href="#DisputeWindow.getTypeName()"><code class="function-signature">getTypeName()</code></a></li><li><a href="#DisputeWindow.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#DisputeWindow.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#DisputeWindow.getStartTime()"><code class="function-signature">getStartTime()</code></a></li><li><a href="#DisputeWindow.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#DisputeWindow.getWindowId()"><code class="function-signature">getWindowId()</code></a></li><li><a href="#DisputeWindow.isActive()"><code class="function-signature">isActive()</code></a></li><li><a href="#DisputeWindow.isOver()"><code class="function-signature">isOver()</code></a></li><li><a href="#DisputeWindow.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#DisputeWindow.onMint(address,uint256)"><code class="function-signature">onMint(address _target, uint256 _amount)</code></a></li><li><a href="#DisputeWindow.onBurn(address,uint256)"><code class="function-signature">onBurn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.initializeCashSender(address,address)"><code class="function-signature">initializeCashSender(address _vat, address _cash)</code></a></li><li class="inherited"><a href="#CashSender.cashTransfer(address,uint256)"><code class="function-signature">cashTransfer(address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.cashTransferFrom(address,address,uint256)"><code class="function-signature">cashTransferFrom(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.shutdownTransfer(address,address,uint256)"><code class="function-signature">shutdownTransfer(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.vatDaiToDai(uint256)"><code class="function-signature">vatDaiToDai(uint256 _vDaiAmount)</code></a></li><li class="inherited"><a href="#CashSender.daiToVatDai(uint256)"><code class="function-signature">daiToVatDai(uint256 _daiAmount)</code></a></li><li class="inherited"><a href="#IDisputeWindow.invalidMarketsTotal()"><code class="function-signature">invalidMarketsTotal()</code></a></li><li class="inherited"><a href="#IDisputeWindow.validityBondTotal()"><code class="function-signature">validityBondTotal()</code></a></li><li class="inherited"><a href="#IDisputeWindow.incorrectDesignatedReportTotal()"><code class="function-signature">incorrectDesignatedReportTotal()</code></a></li><li class="inherited"><a href="#IDisputeWindow.initialReportBondTotal()"><code class="function-signature">initialReportBondTotal()</code></a></li><li class="inherited"><a href="#IDisputeWindow.designatedReportNoShowsTotal()"><code class="function-signature">designatedReportNoShowsTotal()</code></a></li><li class="inherited"><a href="#IDisputeWindow.designatedReporterNoShowBondTotal()"><code class="function-signature">designatedReporterNoShowBondTotal()</code></a></li><li class="inherited"><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,bool,uint256,uint256)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, bool _participationTokensEnabled, uint256 _duration, uint256 _startTime)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.onMarketFinalized()"></a><code class="function-signature">onMarketFinalized()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.buy(uint256)"></a><code class="function-signature">buy(uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.trustedBuy(address,uint256)"></a><code class="function-signature">trustedBuy(address _buyer, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.redeem(address)"></a><code class="function-signature">redeem(address _account) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.getStartTime()"></a><code class="function-signature">getStartTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.getEndTime()"></a><code class="function-signature">getEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.getWindowId()"></a><code class="function-signature">getWindowId() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.isActive()"></a><code class="function-signature">isActive() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.isOver()"></a><code class="function-signature">isOver() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.onMint(address,uint256)"></a><code class="function-signature">onMint(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DisputeWindow.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>







### `IDaiVat`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiVat.hope(address)"><code class="function-signature">hope(address usr)</code></a></li><li><a href="#IDaiVat.move(address,address,uint256)"><code class="function-signature">move(address src, address dst, uint256 rad)</code></a></li><li><a href="#IDaiVat.suck(address,address,uint256)"><code class="function-signature">suck(address u, address v, uint256 rad)</code></a></li><li><a href="#IDaiVat.frob(bytes32,address,address,address,int256,int256)"><code class="function-signature">frob(bytes32 i, address u, address v, address w, int256 dink, int256 dart)</code></a></li><li><a href="#IDaiVat.faucet(address,uint256)"><code class="function-signature">faucet(address _target, uint256 _amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiVat.hope(address)"></a><code class="function-signature">hope(address usr)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.move(address,address,uint256)"></a><code class="function-signature">move(address src, address dst, uint256 rad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.suck(address,address,uint256)"></a><code class="function-signature">suck(address u, address v, uint256 rad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.frob(bytes32,address,address,address,int256,int256)"></a><code class="function-signature">frob(bytes32 i, address u, address v, address w, int256 dink, int256 dart)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.faucet(address,uint256)"></a><code class="function-signature">faucet(address _target, uint256 _amount)</code><span class="function-visibility">public</span></h4>







### `IMarketFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMarketFactory.createMarket(contract IAugur,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"><code class="function-signature">createMarket(contract IAugur _augur, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IMarketFactory.createMarket(contract IAugur,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"></a><code class="function-signature">createMarket(contract IAugur _augur, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>







### `MarketFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MarketFactory.createMarket(contract IAugur,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"><code class="function-signature">createMarket(contract IAugur _augur, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li class="inherited"><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MarketFactory.createMarket(contract IAugur,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"></a><code class="function-signature">createMarket(contract IAugur _augur, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>







### `InitialReporter`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#InitialReporter.initialize(contract IAugur,contract IMarket,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code></a></li><li><a href="#InitialReporter.redeem(address)"><code class="function-signature">redeem(address)</code></a></li><li><a href="#InitialReporter.report(address,bytes32,uint256[],uint256)"><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code></a></li><li><a href="#InitialReporter.returnRepFromDisavow()"><code class="function-signature">returnRepFromDisavow()</code></a></li><li><a href="#InitialReporter.migrateToNewUniverse(address)"><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code></a></li><li><a href="#InitialReporter.forkAndRedeem()"><code class="function-signature">forkAndRedeem()</code></a></li><li><a href="#InitialReporter.getStake()"><code class="function-signature">getStake()</code></a></li><li><a href="#InitialReporter.getDesignatedReporter()"><code class="function-signature">getDesignatedReporter()</code></a></li><li><a href="#InitialReporter.getReportTimestamp()"><code class="function-signature">getReportTimestamp()</code></a></li><li><a href="#InitialReporter.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#InitialReporter.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#InitialReporter.initialReporterWasCorrect()"><code class="function-signature">initialReporterWasCorrect()</code></a></li><li><a href="#InitialReporter.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address _owner, address _newOwner)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li><li class="inherited"><a href="reporting#BaseReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="reporting#BaseReportingParticipant.fork()"><code class="function-signature">fork()</code></a></li><li class="inherited"><a href="reporting#BaseReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li><li class="inherited"><a href="reporting#BaseReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="reporting#BaseReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="reporting#BaseReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="reporting#BaseReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="reporting#BaseReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="InitialReporter.initialize(contract IAugur,contract IMarket,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.redeem(address)"></a><code class="function-signature">redeem(address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

The address argument is ignored. There is only ever one owner of this bond, but the signature needs to match Dispute Crowdsourcer&#x27;s redeem for code simplicity




<h4><a class="anchor" aria-hidden="true" id="InitialReporter.report(address,bytes32,uint256[],uint256)"></a><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.returnRepFromDisavow()"></a><code class="function-signature">returnRepFromDisavow()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.migrateToNewUniverse(address)"></a><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.forkAndRedeem()"></a><code class="function-signature">forkAndRedeem() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.getStake()"></a><code class="function-signature">getStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.getDesignatedReporter()"></a><code class="function-signature">getDesignatedReporter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.getReportTimestamp()"></a><code class="function-signature">getReportTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.designatedReporterShowed()"></a><code class="function-signature">designatedReporterShowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.initialReporterWasCorrect()"></a><code class="function-signature">initialReporterWasCorrect() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="InitialReporter.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address _owner, address _newOwner)</code><span class="function-visibility">internal</span></h4>







### `Ownable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li><a href="#Ownable.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Ownable.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>

The Ownable constructor sets the original `owner` of the contract to the sender
account.



<h4><a class="anchor" aria-hidden="true" id="Ownable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Ownable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Allows the current owner to transfer control of the contract to a newOwner.




<h4><a class="anchor" aria-hidden="true" id="Ownable.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







### `IAffiliates`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAffiliates.setFingerprint(bytes32)"><code class="function-signature">setFingerprint(bytes32 _fingerprint)</code></a></li><li><a href="#IAffiliates.setReferrer(address)"><code class="function-signature">setReferrer(address _referrer)</code></a></li><li><a href="#IAffiliates.getAccountFingerprint(address)"><code class="function-signature">getAccountFingerprint(address _account)</code></a></li><li><a href="#IAffiliates.getReferrer(address)"><code class="function-signature">getReferrer(address _account)</code></a></li><li><a href="#IAffiliates.getAndValidateReferrer(address,contract IAffiliateValidator)"><code class="function-signature">getAndValidateReferrer(address _account, contract IAffiliateValidator affiliateValidator)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAffiliates.setFingerprint(bytes32)"></a><code class="function-signature">setFingerprint(bytes32 _fingerprint)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.setReferrer(address)"></a><code class="function-signature">setReferrer(address _referrer)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.getAccountFingerprint(address)"></a><code class="function-signature">getAccountFingerprint(address _account) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.getReferrer(address)"></a><code class="function-signature">getReferrer(address _account) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.getAndValidateReferrer(address,contract IAffiliateValidator)"></a><code class="function-signature">getAndValidateReferrer(address _account, contract IAffiliateValidator affiliateValidator) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>







### `IDisputeCrowdsourcerFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeCrowdsourcerFactory.createDisputeCrowdsourcer(contract IAugur,uint256,bytes32,uint256[],uint256)"><code class="function-signature">createDisputeCrowdsourcer(contract IAugur _augur, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _crowdsourcerGeneration)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeCrowdsourcerFactory.createDisputeCrowdsourcer(contract IAugur,uint256,bytes32,uint256[],uint256)"></a><code class="function-signature">createDisputeCrowdsourcer(contract IAugur _augur, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _crowdsourcerGeneration) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeCrowdsourcer</span></code><span class="function-visibility">public</span></h4>







### `IWarpSync`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IWarpSync.notifyMarketFinalized()"><code class="function-signature">notifyMarketFinalized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IWarpSync.notifyMarketFinalized()"></a><code class="function-signature">notifyMarketFinalized()</code><span class="function-visibility">public</span></h4>







### `InitialReporterFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#InitialReporterFactory.createInitialReporter(contract IAugur,address)"><code class="function-signature">createInitialReporter(contract IAugur _augur, address _designatedReporter)</code></a></li><li class="inherited"><a href="reporting#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="InitialReporterFactory.createInitialReporter(contract IAugur,address)"></a><code class="function-signature">createInitialReporter(contract IAugur _augur, address _designatedReporter) <span class="return-arrow">→</span> <span class="return-type">contract IInitialReporter</span></code><span class="function-visibility">public</span></h4>







### `Market`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Market.initialize(contract IAugur,contract IUniverse,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#Market.increaseValidityBond(uint256)"><code class="function-signature">increaseValidityBond(uint256 _attoCash)</code></a></li><li><a href="#Market.doInitialReport(uint256[],string,uint256)"><code class="function-signature">doInitialReport(uint256[] _payoutNumerators, string _description, uint256 _additionalStake)</code></a></li><li><a href="#Market.contributeToTentative(uint256[],uint256,string)"><code class="function-signature">contributeToTentative(uint256[] _payoutNumerators, uint256 _amount, string _description)</code></a></li><li><a href="#Market.contribute(uint256[],uint256,string)"><code class="function-signature">contribute(uint256[] _payoutNumerators, uint256 _amount, string _description)</code></a></li><li><a href="#Market.internalContribute(address,bytes32,uint256[],uint256,bool,string)"><code class="function-signature">internalContribute(address _contributor, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _amount, bool _overload, string _description)</code></a></li><li><a href="#Market.finalize()"><code class="function-signature">finalize()</code></a></li><li><a href="#Market.getMarketCreatorSettlementFeeDivisor()"><code class="function-signature">getMarketCreatorSettlementFeeDivisor()</code></a></li><li><a href="#Market.deriveMarketCreatorFeeAmount(uint256)"><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount)</code></a></li><li><a href="#Market.recordMarketCreatorFees(uint256,address,bytes32)"><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#Market.withdrawAffiliateFees(address)"><code class="function-signature">withdrawAffiliateFees(address _affiliate)</code></a></li><li><a href="#Market.migrateThroughOneFork(uint256[],string)"><code class="function-signature">migrateThroughOneFork(uint256[] _payoutNumerators, string _description)</code></a></li><li><a href="#Market.disavowCrowdsourcers()"><code class="function-signature">disavowCrowdsourcers()</code></a></li><li><a href="#Market.getHighestNonTentativeParticipantStake()"><code class="function-signature">getHighestNonTentativeParticipantStake()</code></a></li><li><a href="#Market.getParticipantStake()"><code class="function-signature">getParticipantStake()</code></a></li><li><a href="#Market.getStakeInOutcome(bytes32)"><code class="function-signature">getStakeInOutcome(bytes32 _payoutDistributionHash)</code></a></li><li><a href="#Market.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#Market.getWinningPayoutDistributionHash()"><code class="function-signature">getWinningPayoutDistributionHash()</code></a></li><li><a href="#Market.isFinalized()"><code class="function-signature">isFinalized()</code></a></li><li><a href="#Market.getDesignatedReporter()"><code class="function-signature">getDesignatedReporter()</code></a></li><li><a href="#Market.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#Market.initialReporterWasCorrect()"><code class="function-signature">initialReporterWasCorrect()</code></a></li><li><a href="#Market.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#Market.isInvalid()"><code class="function-signature">isInvalid()</code></a></li><li><a href="#Market.getInitialReporter()"><code class="function-signature">getInitialReporter()</code></a></li><li><a href="#Market.getReportingParticipant(uint256)"><code class="function-signature">getReportingParticipant(uint256 _index)</code></a></li><li><a href="#Market.getCrowdsourcer(bytes32)"><code class="function-signature">getCrowdsourcer(bytes32 _payoutDistributionHash)</code></a></li><li><a href="#Market.getWinningReportingParticipant()"><code class="function-signature">getWinningReportingParticipant()</code></a></li><li><a href="#Market.getWinningPayoutNumerator(uint256)"><code class="function-signature">getWinningPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#Market.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#Market.getDisputeWindow()"><code class="function-signature">getDisputeWindow()</code></a></li><li><a href="#Market.getFinalizationTime()"><code class="function-signature">getFinalizationTime()</code></a></li><li><a href="#Market.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#Market.getNumberOfOutcomes()"><code class="function-signature">getNumberOfOutcomes()</code></a></li><li><a href="#Market.getNumTicks()"><code class="function-signature">getNumTicks()</code></a></li><li><a href="#Market.getAffiliateFeeDivisor()"><code class="function-signature">getAffiliateFeeDivisor()</code></a></li><li><a href="#Market.getDesignatedReportingEndTime()"><code class="function-signature">getDesignatedReportingEndTime()</code></a></li><li><a href="#Market.getNumParticipants()"><code class="function-signature">getNumParticipants()</code></a></li><li><a href="#Market.getValidityBondAttoCash()"><code class="function-signature">getValidityBondAttoCash()</code></a></li><li><a href="#Market.getDisputePacingOn()"><code class="function-signature">getDisputePacingOn()</code></a></li><li><a href="#Market.derivePayoutDistributionHash(uint256[])"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators)</code></a></li><li><a href="#Market.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _shadyReportingParticipant)</code></a></li><li><a href="#Market.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address _owner, address _newOwner)</code></a></li><li><a href="#Market.transferRepBondOwnership(address)"><code class="function-signature">transferRepBondOwnership(address _newOwner)</code></a></li><li><a href="#Market.assertBalances()"><code class="function-signature">assertBalances()</code></a></li><li><a href="#Market.isForkingMarket()"><code class="function-signature">isForkingMarket()</code></a></li><li><a href="#Market.getWinningChildPayout(uint256)"><code class="function-signature">getWinningChildPayout(uint256 _outcome)</code></a></li><li><a href="#Market.getOpenInterest()"><code class="function-signature">getOpenInterest()</code></a></li><li class="inherited"><a href="reporting#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="reporting#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="reporting#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Market.initialize(contract IAugur,contract IUniverse,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.increaseValidityBond(uint256)"></a><code class="function-signature">increaseValidityBond(uint256 _attoCash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.doInitialReport(uint256[],string,uint256)"></a><code class="function-signature">doInitialReport(uint256[] _payoutNumerators, string _description, uint256 _additionalStake) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.contributeToTentative(uint256[],uint256,string)"></a><code class="function-signature">contributeToTentative(uint256[] _payoutNumerators, uint256 _amount, string _description) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

This will escrow REP in a bond which will be active immediately if the tentative outcome is successfully disputed.




<h4><a class="anchor" aria-hidden="true" id="Market.contribute(uint256[],uint256,string)"></a><code class="function-signature">contribute(uint256[] _payoutNumerators, uint256 _amount, string _description) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.internalContribute(address,bytes32,uint256[],uint256,bool,string)"></a><code class="function-signature">internalContribute(address _contributor, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _amount, bool _overload, string _description)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.finalize()"></a><code class="function-signature">finalize() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getMarketCreatorSettlementFeeDivisor()"></a><code class="function-signature">getMarketCreatorSettlementFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.deriveMarketCreatorFeeAmount(uint256)"></a><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.recordMarketCreatorFees(uint256,address,bytes32)"></a><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _sourceAccount, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.withdrawAffiliateFees(address)"></a><code class="function-signature">withdrawAffiliateFees(address _affiliate) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Will fail if the market is Invalid




<h4><a class="anchor" aria-hidden="true" id="Market.migrateThroughOneFork(uint256[],string)"></a><code class="function-signature">migrateThroughOneFork(uint256[] _payoutNumerators, string _description) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

This will extract a new REP no show bond from whoever calls this and if the market is in the reporting phase will require a report be made as well




<h4><a class="anchor" aria-hidden="true" id="Market.disavowCrowdsourcers()"></a><code class="function-signature">disavowCrowdsourcers() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getHighestNonTentativeParticipantStake()"></a><code class="function-signature">getHighestNonTentativeParticipantStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getParticipantStake()"></a><code class="function-signature">getParticipantStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getStakeInOutcome(bytes32)"></a><code class="function-signature">getStakeInOutcome(bytes32 _payoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getForkingMarket()"></a><code class="function-signature">getForkingMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getWinningPayoutDistributionHash()"></a><code class="function-signature">getWinningPayoutDistributionHash() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.isFinalized()"></a><code class="function-signature">isFinalized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getDesignatedReporter()"></a><code class="function-signature">getDesignatedReporter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.designatedReporterShowed()"></a><code class="function-signature">designatedReporterShowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.initialReporterWasCorrect()"></a><code class="function-signature">initialReporterWasCorrect() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getEndTime()"></a><code class="function-signature">getEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.isInvalid()"></a><code class="function-signature">isInvalid() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getInitialReporter()"></a><code class="function-signature">getInitialReporter() <span class="return-arrow">→</span> <span class="return-type">contract IInitialReporter</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getReportingParticipant(uint256)"></a><code class="function-signature">getReportingParticipant(uint256 _index) <span class="return-arrow">→</span> <span class="return-type">contract IReportingParticipant</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getCrowdsourcer(bytes32)"></a><code class="function-signature">getCrowdsourcer(bytes32 _payoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeCrowdsourcer</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getWinningReportingParticipant()"></a><code class="function-signature">getWinningReportingParticipant() <span class="return-arrow">→</span> <span class="return-type">contract IReportingParticipant</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getWinningPayoutNumerator(uint256)"></a><code class="function-signature">getWinningPayoutNumerator(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getUniverse()"></a><code class="function-signature">getUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getDisputeWindow()"></a><code class="function-signature">getDisputeWindow() <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getFinalizationTime()"></a><code class="function-signature">getFinalizationTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getNumberOfOutcomes()"></a><code class="function-signature">getNumberOfOutcomes() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getNumTicks()"></a><code class="function-signature">getNumTicks() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getAffiliateFeeDivisor()"></a><code class="function-signature">getAffiliateFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getDesignatedReportingEndTime()"></a><code class="function-signature">getDesignatedReportingEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getNumParticipants()"></a><code class="function-signature">getNumParticipants() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getValidityBondAttoCash()"></a><code class="function-signature">getValidityBondAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getDisputePacingOn()"></a><code class="function-signature">getDisputePacingOn() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.derivePayoutDistributionHash(uint256[])"></a><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.isContainerForReportingParticipant(contract IReportingParticipant)"></a><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _shadyReportingParticipant) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address _owner, address _newOwner)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.transferRepBondOwnership(address)"></a><code class="function-signature">transferRepBondOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.assertBalances()"></a><code class="function-signature">assertBalances() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.isForkingMarket()"></a><code class="function-signature">isForkingMarket() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getWinningChildPayout(uint256)"></a><code class="function-signature">getWinningChildPayout(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Market.getOpenInterest()"></a><code class="function-signature">getOpenInterest() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







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







### `IOICash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOICash.initialize(contract IAugur,contract IUniverse)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe)</code></a></li><li class="inherited"><a href="reporting#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="reporting#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="reporting#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="reporting#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="reporting#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="reporting#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOICash.initialize(contract IAugur,contract IUniverse)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe)</code><span class="function-visibility">external</span></h4>







### `OICash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#OICash.initialize(contract IAugur,contract IUniverse)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe)</code></a></li><li><a href="#OICash.deposit(uint256)"><code class="function-signature">deposit(uint256 _amount)</code></a></li><li><a href="#OICash.withdraw(uint256)"><code class="function-signature">withdraw(uint256 _amount)</code></a></li><li><a href="#OICash.payFees(uint256)"><code class="function-signature">payFees(uint256 _feeAmount)</code></a></li><li><a href="#OICash.buyCompleteSets(contract IMarket,uint256)"><code class="function-signature">buyCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#OICash.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#OICash.onMint(address,uint256)"><code class="function-signature">onMint(address _target, uint256 _amount)</code></a></li><li><a href="#OICash.onBurn(address,uint256)"><code class="function-signature">onBurn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.initializeCashSender(address,address)"><code class="function-signature">initializeCashSender(address _vat, address _cash)</code></a></li><li class="inherited"><a href="#CashSender.cashTransfer(address,uint256)"><code class="function-signature">cashTransfer(address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.cashTransferFrom(address,address,uint256)"><code class="function-signature">cashTransferFrom(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.shutdownTransfer(address,address,uint256)"><code class="function-signature">shutdownTransfer(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.vatDaiToDai(uint256)"><code class="function-signature">vatDaiToDai(uint256 _vDaiAmount)</code></a></li><li class="inherited"><a href="#CashSender.daiToVatDai(uint256)"><code class="function-signature">daiToVatDai(uint256 _daiAmount)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li><li class="inherited"><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="OICash.initialize(contract IAugur,contract IUniverse)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OICash.deposit(uint256)"></a><code class="function-signature">deposit(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OICash.withdraw(uint256)"></a><code class="function-signature">withdraw(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OICash.payFees(uint256)"></a><code class="function-signature">payFees(uint256 _feeAmount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OICash.buyCompleteSets(contract IMarket,uint256)"></a><code class="function-signature">buyCompleteSets(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OICash.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OICash.onMint(address,uint256)"></a><code class="function-signature">onMint(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OICash.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>







### `IRepPriceOracle`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IRepPriceOracle.pokeRepPriceInAttoCash(contract IV2ReputationToken)"><code class="function-signature">pokeRepPriceInAttoCash(contract IV2ReputationToken _reputationToken)</code></a></li><li><a href="#IRepPriceOracle.getRepPriceInAttoCash(contract IV2ReputationToken)"><code class="function-signature">getRepPriceInAttoCash(contract IV2ReputationToken _reputationToken)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IRepPriceOracle.pokeRepPriceInAttoCash(contract IV2ReputationToken)"></a><code class="function-signature">pokeRepPriceInAttoCash(contract IV2ReputationToken _reputationToken) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IRepPriceOracle.getRepPriceInAttoCash(contract IV2ReputationToken)"></a><code class="function-signature">getRepPriceInAttoCash(contract IV2ReputationToken _reputationToken) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







### `IUniswapV2`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniswapV2.getReservesCumulative()"><code class="function-signature">getReservesCumulative()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniswapV2.getReservesCumulative()"></a><code class="function-signature">getReservesCumulative() <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>







### `IUniswapV2Factory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniswapV2Factory.getExchange(address,address)"><code class="function-signature">getExchange(address tokenA, address tokenB)</code></a></li><li><a href="#IUniswapV2Factory.createExchange(address,address)"><code class="function-signature">createExchange(address tokenA, address tokenB)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.getExchange(address,address)"></a><code class="function-signature">getExchange(address tokenA, address tokenB) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.createExchange(address,address)"></a><code class="function-signature">createExchange(address tokenA, address tokenB) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>







### `RepPriceOracle`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#RepPriceOracle.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#RepPriceOracle.pokeRepPriceInAttoCash(contract IV2ReputationToken)"><code class="function-signature">pokeRepPriceInAttoCash(contract IV2ReputationToken _reputationToken)</code></a></li><li><a href="#RepPriceOracle.getRepPriceInAttoCash(contract IV2ReputationToken)"><code class="function-signature">getRepPriceInAttoCash(contract IV2ReputationToken _reputationToken)</code></a></li><li><a href="#RepPriceOracle.getWeight(uint256)"><code class="function-signature">getWeight(uint256 _blockDelta)</code></a></li><li><a href="#RepPriceOracle.getOrCreateUniswapExchange(contract IV2ReputationToken)"><code class="function-signature">getOrCreateUniswapExchange(contract IV2ReputationToken _reputationToken)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="RepPriceOracle.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RepPriceOracle.pokeRepPriceInAttoCash(contract IV2ReputationToken)"></a><code class="function-signature">pokeRepPriceInAttoCash(contract IV2ReputationToken _reputationToken) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RepPriceOracle.getRepPriceInAttoCash(contract IV2ReputationToken)"></a><code class="function-signature">getRepPriceInAttoCash(contract IV2ReputationToken _reputationToken) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RepPriceOracle.getWeight(uint256)"></a><code class="function-signature">getWeight(uint256 _blockDelta) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RepPriceOracle.getOrCreateUniswapExchange(contract IV2ReputationToken)"></a><code class="function-signature">getOrCreateUniswapExchange(contract IV2ReputationToken _reputationToken) <span class="return-arrow">→</span> <span class="return-type">contract IUniswapV2</span></code><span class="function-visibility">public</span></h4>







### `IRepSymbol`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IRepSymbol.getRepSymbol(address,address)"><code class="function-signature">getRepSymbol(address _augur, address _universe)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IRepSymbol.getRepSymbol(address,address)"></a><code class="function-signature">getRepSymbol(address _augur, address _universe) <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>







### `ReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse)"><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse)</code></a></li><li><a href="#ReputationToken.symbol()"><code class="function-signature">symbol()</code></a></li><li><a href="#ReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li><a href="#ReputationToken.mintForWarpSync(uint256,address)"><code class="function-signature">mintForWarpSync(uint256 _amountToMint, address _target)</code></a></li><li><a href="#ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li><a href="#ReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#ReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#ReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li><a href="#ReputationToken.getLegacyRepToken()"><code class="function-signature">getLegacyRepToken()</code></a></li><li><a href="#ReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li><a href="#ReputationToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#ReputationToken.onMint(address,uint256)"><code class="function-signature">onMint(address _target, uint256 _amount)</code></a></li><li><a href="#ReputationToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address _target, uint256 _amount)</code></a></li><li><a href="#ReputationToken.migrateFromLegacyReputationToken()"><code class="function-signature">migrateFromLegacyReputationToken()</code></a></li><li class="inherited"><a href="reporting#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="reporting#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="reporting#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="reporting#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="reporting#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ReputationToken.constructor(contract IAugur,contract IUniverse,contract IUniverse)"></a><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _universe, contract IUniverse _parentUniverse)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.symbol()"></a><code class="function-signature">symbol() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.migrateOutByPayout(uint256[],uint256)"></a><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.migrateIn(address,uint256)"></a><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.mintForReportingParticipant(uint256)"></a><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReputationToken.mintForWarpSync(uint256,address)"></a><code class="function-signature">mintForWarpSync(uint256 _amountToMint, address _target) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





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






### `ContractExists`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ContractExists.exists(address)"><code class="function-signature">exists(address _address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ContractExists.exists(address)"></a><code class="function-signature">exists(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `ERC1155`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC1155.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#ERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address account, uint256 id)</code></a></li><li><a href="#ERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li><a href="#ERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] accounts, uint256[] ids)</code></a></li><li><a href="#ERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li><a href="#ERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address account, address operator)</code></a></li><li><a href="#ERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#ERC1155._transferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_transferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._internalTransferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_internalTransferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li><a href="#ERC1155._batchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_batchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._internalBatchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_internalBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._mint(address,uint256,uint256,bytes,bool)"><code class="function-signature">_mint(address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._mintBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_mintBatch(address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._burn(address,uint256,uint256,bytes,bool)"><code class="function-signature">_burn(address account, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._burnBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_burnBatch(address account, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._doSafeTransferAcceptanceCheck(address,address,address,uint256,uint256,bytes)"><code class="function-signature">_doSafeTransferAcceptanceCheck(address operator, address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#ERC1155._doSafeBatchTransferAcceptanceCheck(address,address,address,uint256[],uint256[],bytes)"><code class="function-signature">_doSafeBatchTransferAcceptanceCheck(address operator, address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li><a href="#ERC1155.onTokenTransfer(uint256,address,address,uint256)"><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code></a></li><li><a href="#ERC1155.onMint(uint256,address,uint256)"><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li><a href="#ERC1155.onBurn(uint256,address,uint256)"><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#ERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="reporting#ERC165._registerInterface(bytes4)"><code class="function-signature">_registerInterface(bytes4 interfaceId)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC1155.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155.balanceOf(address,uint256)"></a><code class="function-signature">balanceOf(address account, uint256 id) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

Get the specified address&#x27; balance for token with specified ID.
Attempting to query the zero account for a balance will result in a revert.




<h4><a class="anchor" aria-hidden="true" id="ERC1155.totalSupply(uint256)"></a><code class="function-signature">totalSupply(uint256 id) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155.balanceOfBatch(address[],uint256[])"></a><code class="function-signature">balanceOfBatch(address[] accounts, uint256[] ids) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>

Get the balance of multiple account/token pairs.
If any of the query accounts is the zero account, this query will revert.




<h4><a class="anchor" aria-hidden="true" id="ERC1155.setApprovalForAll(address,bool)"></a><code class="function-signature">setApprovalForAll(address operator, bool approved)</code><span class="function-visibility">external</span></h4>

Sets or unsets the approval of a given operator.

An operator is allowed to transfer all tokens of the sender on their behalf.

Because an account already has operator privileges for itself, this function will revert
if the account attempts to set the approval status for itself.





<h4><a class="anchor" aria-hidden="true" id="ERC1155.isApprovedForAll(address,address)"></a><code class="function-signature">isApprovedForAll(address account, address operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"></a><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code><span class="function-visibility">external</span></h4>

Transfers `value` amount of an `id` from the `from` address to the `to` address specified.
Caller must be approved to manage the tokens being transferred out of the `from` account.
If `to` is a smart contract, will call `onERC1155Received` on `to` and act appropriately.




<h4><a class="anchor" aria-hidden="true" id="ERC1155._transferFrom(address,address,uint256,uint256,bytes,bool)"></a><code class="function-signature">_transferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155._internalTransferFrom(address,address,uint256,uint256,bytes,bool)"></a><code class="function-signature">_internalTransferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"></a><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code><span class="function-visibility">external</span></h4>

Transfers `values` amount(s) of `ids` from the `from` address to the
`to` address specified. Caller must be approved to manage the tokens being
transferred out of the `from` account. If `to` is a smart contract, will
call `onERC1155BatchReceived` on `to` and act appropriately.




<h4><a class="anchor" aria-hidden="true" id="ERC1155._batchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"></a><code class="function-signature">_batchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155._internalBatchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"></a><code class="function-signature">_internalBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155._mint(address,uint256,uint256,bytes,bool)"></a><code class="function-signature">_mint(address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code><span class="function-visibility">internal</span></h4>

Internal function to mint an amount of a token with the given ID




<h4><a class="anchor" aria-hidden="true" id="ERC1155._mintBatch(address,uint256[],uint256[],bytes,bool)"></a><code class="function-signature">_mintBatch(address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code><span class="function-visibility">internal</span></h4>

Internal function to batch mint amounts of tokens with the given IDs




<h4><a class="anchor" aria-hidden="true" id="ERC1155._burn(address,uint256,uint256,bytes,bool)"></a><code class="function-signature">_burn(address account, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code><span class="function-visibility">internal</span></h4>

Internal function to burn an amount of a token with the given ID




<h4><a class="anchor" aria-hidden="true" id="ERC1155._burnBatch(address,uint256[],uint256[],bytes,bool)"></a><code class="function-signature">_burnBatch(address account, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code><span class="function-visibility">internal</span></h4>

Internal function to batch burn an amounts of tokens with the given IDs




<h4><a class="anchor" aria-hidden="true" id="ERC1155._doSafeTransferAcceptanceCheck(address,address,address,uint256,uint256,bytes)"></a><code class="function-signature">_doSafeTransferAcceptanceCheck(address operator, address from, address to, uint256 id, uint256 value, bytes data)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155._doSafeBatchTransferAcceptanceCheck(address,address,address,uint256[],uint256[],bytes)"></a><code class="function-signature">_doSafeBatchTransferAcceptanceCheck(address operator, address from, address to, uint256[] ids, uint256[] values, bytes data)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155.onTokenTransfer(uint256,address,address,uint256)"></a><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155.onMint(uint256,address,uint256)"></a><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155.onBurn(uint256,address,uint256)"></a><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>







### `ERC165`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC165.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#ERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li><li><a href="#ERC165._registerInterface(bytes4)"><code class="function-signature">_registerInterface(bytes4 interfaceId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC165.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC165.supportsInterface(bytes4)"></a><code class="function-signature">supportsInterface(bytes4 interfaceId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

See {IERC165-supportsInterface}.

Time complexity O(1), guaranteed to always use less than 30 000 gas.



<h4><a class="anchor" aria-hidden="true" id="ERC165._registerInterface(bytes4)"></a><code class="function-signature">_registerInterface(bytes4 interfaceId)</code><span class="function-visibility">internal</span></h4>

Registers the contract as an implementer of the interface defined by
`interfaceId`. Support of the actual ERC165 interface is automatic and
registering its interface id is not required.

See {IERC165-supportsInterface}.

Requirements:

- `interfaceId` cannot be the ERC165 invalid interface (`0xffffffff`).





### `IERC1155Receiver`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC1155Receiver.onERC1155Received(address,address,uint256,uint256,bytes)"><code class="function-signature">onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#IERC1155Receiver.onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"><code class="function-signature">onERC1155BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="reporting#IERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC1155Receiver.onERC1155Received(address,address,uint256,uint256,bytes)"></a><code class="function-signature">onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes data) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Handles the receipt of a single ERC1155 token type. This function is
called at the end of a `safeTransferFrom` after the balance has been updated.
To accept the transfer, this must return
`bytes4(keccak256(&quot;onERC1155Received(address,address,uint256,uint256,bytes)&quot;))`
(i.e. 0xf23a6e61, or its own function selector).




<h4><a class="anchor" aria-hidden="true" id="IERC1155Receiver.onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"></a><code class="function-signature">onERC1155BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Handles the receipt of a multiple ERC1155 token types. This function
is called at the end of a `safeBatchTransferFrom` after the balances have
been updated. To accept the transfer(s), this must return
`bytes4(keccak256(&quot;onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)&quot;))`
(i.e. 0xbc197c81, or its own function selector).






### `IERC165`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC165.supportsInterface(bytes4)"></a><code class="function-signature">supportsInterface(bytes4 interfaceId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

Returns true if this contract implements the interface defined by
`interfaceId`. See the corresponding
https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
to learn more about how these ids are created.

This function call must use less than 30 000 gas.





### `ReentrancyGuard`



<div class="contract-index"></div>





### `ShareToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ShareToken.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#ShareToken.unsafeTransferFrom(address,address,uint256,uint256)"><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code></a></li><li><a href="#ShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code></a></li><li><a href="#ShareToken.initializeMarket(contract IMarket,uint256,uint256)"><code class="function-signature">initializeMarket(contract IMarket _market, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#ShareToken.publicBuyCompleteSets(contract IMarket,uint256)"><code class="function-signature">publicBuyCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ShareToken.buyCompleteSets(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#ShareToken.buyCompleteSetsInternal(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSetsInternal(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#ShareToken.buyCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address)"><code class="function-signature">buyCompleteSetsForTrade(contract IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient)</code></a></li><li><a href="#ShareToken.publicSellCompleteSets(contract IMarket,uint256)"><code class="function-signature">publicSellCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ShareToken.sellCompleteSets(contract IMarket,address,address,uint256,bytes32)"><code class="function-signature">sellCompleteSets(contract IMarket _market, address _holder, address _recipient, uint256 _amount, bytes32 _fingerprint)</code></a></li><li><a href="#ShareToken.sellCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address,address,address,uint256,address,bytes32)"><code class="function-signature">sellCompleteSetsForTrade(contract IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#ShareToken.claimTradingProceeds(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#ShareToken.claimTradingProceedsInternal(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceedsInternal(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#ShareToken.divideUpWinnings(contract IMarket,uint256,uint256)"><code class="function-signature">divideUpWinnings(contract IMarket _market, uint256 _outcome, uint256 _numberOfShares)</code></a></li><li><a href="#ShareToken.calculateProceeds(contract IMarket,uint256,uint256)"><code class="function-signature">calculateProceeds(contract IMarket _market, uint256 _outcome, uint256 _numberOfShares)</code></a></li><li><a href="#ShareToken.calculateReportingFee(contract IMarket,uint256)"><code class="function-signature">calculateReportingFee(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ShareToken.calculateCreatorFee(contract IMarket,uint256)"><code class="function-signature">calculateCreatorFee(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ShareToken.getTypeName()"><code class="function-signature">getTypeName()</code></a></li><li><a href="#ShareToken.getMarket(uint256)"><code class="function-signature">getMarket(uint256 _tokenId)</code></a></li><li><a href="#ShareToken.getOutcome(uint256)"><code class="function-signature">getOutcome(uint256 _tokenId)</code></a></li><li><a href="#ShareToken.totalSupplyForMarketOutcome(contract IMarket,uint256)"><code class="function-signature">totalSupplyForMarketOutcome(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#ShareToken.balanceOfMarketOutcome(contract IMarket,uint256,address)"><code class="function-signature">balanceOfMarketOutcome(contract IMarket _market, uint256 _outcome, address _account)</code></a></li><li><a href="#ShareToken.lowestBalanceOfMarketOutcomes(contract IMarket,uint256[],address)"><code class="function-signature">lowestBalanceOfMarketOutcomes(contract IMarket _market, uint256[] _outcomes, address _account)</code></a></li><li><a href="#ShareToken.getTokenId(contract IMarket,uint256)"><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#ShareToken.getTokenIds(contract IMarket,uint256[])"><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes)</code></a></li><li><a href="#ShareToken.unpackTokenId(uint256)"><code class="function-signature">unpackTokenId(uint256 _tokenId)</code></a></li><li><a href="#ShareToken.onTokenTransfer(uint256,address,address,uint256)"><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code></a></li><li><a href="#ShareToken.onMint(uint256,address,uint256)"><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li><a href="#ShareToken.onBurn(uint256,address,uint256)"><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.initializeCashSender(address,address)"><code class="function-signature">initializeCashSender(address _vat, address _cash)</code></a></li><li class="inherited"><a href="#CashSender.cashTransfer(address,uint256)"><code class="function-signature">cashTransfer(address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.cashTransferFrom(address,address,uint256)"><code class="function-signature">cashTransferFrom(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.shutdownTransfer(address,address,uint256)"><code class="function-signature">shutdownTransfer(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="#CashSender.vatDaiToDai(uint256)"><code class="function-signature">vatDaiToDai(uint256 _vDaiAmount)</code></a></li><li class="inherited"><a href="#CashSender.daiToVatDai(uint256)"><code class="function-signature">daiToVatDai(uint256 _daiAmount)</code></a></li><li class="inherited"><a href="reporting#ERC1155.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="reporting#ERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address account, uint256 id)</code></a></li><li class="inherited"><a href="reporting#ERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li class="inherited"><a href="reporting#ERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] accounts, uint256[] ids)</code></a></li><li class="inherited"><a href="reporting#ERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li class="inherited"><a href="reporting#ERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address account, address operator)</code></a></li><li class="inherited"><a href="reporting#ERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="reporting#ERC1155._transferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_transferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="reporting#ERC1155._internalTransferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_internalTransferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="reporting#ERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="reporting#ERC1155._batchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_batchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="reporting#ERC1155._internalBatchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_internalBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="reporting#ERC1155._mint(address,uint256,uint256,bytes,bool)"><code class="function-signature">_mint(address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="reporting#ERC1155._mintBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_mintBatch(address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="reporting#ERC1155._burn(address,uint256,uint256,bytes,bool)"><code class="function-signature">_burn(address account, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="reporting#ERC1155._burnBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_burnBatch(address account, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="reporting#ERC1155._doSafeTransferAcceptanceCheck(address,address,address,uint256,uint256,bytes)"><code class="function-signature">_doSafeTransferAcceptanceCheck(address operator, address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="reporting#ERC1155._doSafeBatchTransferAcceptanceCheck(address,address,address,uint256[],uint256[],bytes)"><code class="function-signature">_doSafeBatchTransferAcceptanceCheck(address operator, address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="reporting#ERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="reporting#ERC165._registerInterface(bytes4)"><code class="function-signature">_registerInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="reporting#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="reporting#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ShareToken.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.unsafeTransferFrom(address,address,uint256,uint256)"></a><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code><span class="function-visibility">public</span></h4>

Transfers `value` amount of an `id` from the `from` address to the `to` address specified.
Caller must be approved to manage the tokens being transferred out of the `from` account.
Regardless of if the desintation is a contract or not this will not call `onERC1155Received` on `to`




<h4><a class="anchor" aria-hidden="true" id="ShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"></a><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code><span class="function-visibility">public</span></h4>

Transfers `values` amount(s) of `ids` from the `from` address to the
`to` address specified. Caller must be approved to manage the tokens being
transferred out of the `from` account. Regardless of if the desintation is
a contract or not this will not call `onERC1155Received` on `to`




<h4><a class="anchor" aria-hidden="true" id="ShareToken.initializeMarket(contract IMarket,uint256,uint256)"></a><code class="function-signature">initializeMarket(contract IMarket _market, uint256 _numOutcomes, uint256 _numTicks)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.publicBuyCompleteSets(contract IMarket,uint256)"></a><code class="function-signature">publicBuyCompleteSets(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.buyCompleteSets(contract IMarket,address,uint256)"></a><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.buyCompleteSetsInternal(contract IMarket,address,uint256)"></a><code class="function-signature">buyCompleteSetsInternal(contract IMarket _market, address _account, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.buyCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address)"></a><code class="function-signature">buyCompleteSetsForTrade(contract IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.publicSellCompleteSets(contract IMarket,uint256)"></a><code class="function-signature">publicSellCompleteSets(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.sellCompleteSets(contract IMarket,address,address,uint256,bytes32)"></a><code class="function-signature">sellCompleteSets(contract IMarket _market, address _holder, address _recipient, uint256 _amount, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.sellCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address,address,address,uint256,address,bytes32)"></a><code class="function-signature">sellCompleteSetsForTrade(contract IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.claimTradingProceeds(contract IMarket,address,bytes32)"></a><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.claimTradingProceedsInternal(contract IMarket,address,bytes32)"></a><code class="function-signature">claimTradingProceedsInternal(contract IMarket _market, address _shareHolder, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.divideUpWinnings(contract IMarket,uint256,uint256)"></a><code class="function-signature">divideUpWinnings(contract IMarket _market, uint256 _outcome, uint256 _numberOfShares) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.calculateProceeds(contract IMarket,uint256,uint256)"></a><code class="function-signature">calculateProceeds(contract IMarket _market, uint256 _outcome, uint256 _numberOfShares) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.calculateReportingFee(contract IMarket,uint256)"></a><code class="function-signature">calculateReportingFee(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.calculateCreatorFee(contract IMarket,uint256)"></a><code class="function-signature">calculateCreatorFee(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.getMarket(uint256)"></a><code class="function-signature">getMarket(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.getOutcome(uint256)"></a><code class="function-signature">getOutcome(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.totalSupplyForMarketOutcome(contract IMarket,uint256)"></a><code class="function-signature">totalSupplyForMarketOutcome(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.balanceOfMarketOutcome(contract IMarket,uint256,address)"></a><code class="function-signature">balanceOfMarketOutcome(contract IMarket _market, uint256 _outcome, address _account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.lowestBalanceOfMarketOutcomes(contract IMarket,uint256[],address)"></a><code class="function-signature">lowestBalanceOfMarketOutcomes(contract IMarket _market, uint256[] _outcomes, address _account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.getTokenId(contract IMarket,uint256)"></a><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.getTokenIds(contract IMarket,uint256[])"></a><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.unpackTokenId(uint256)"></a><code class="function-signature">unpackTokenId(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">address,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.onTokenTransfer(uint256,address,address,uint256)"></a><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.onMint(uint256,address,uint256)"></a><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.onBurn(uint256,address,uint256)"></a><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>







### `TokenId`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TokenId.getTokenId(contract IMarket,uint256)"><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#TokenId.getTokenIds(contract IMarket,uint256[])"><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes)</code></a></li><li><a href="#TokenId.unpackTokenId(uint256)"><code class="function-signature">unpackTokenId(uint256 _tokenId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TokenId.getTokenId(contract IMarket,uint256)"></a><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TokenId.getTokenIds(contract IMarket,uint256[])"></a><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TokenId.unpackTokenId(uint256)"></a><code class="function-signature">unpackTokenId(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">address,uint256</span></code><span class="function-visibility">internal</span></h4>







### `IDaiJoin`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiJoin.join(address,uint256)"><code class="function-signature">join(address urn, uint256 wad)</code></a></li><li><a href="#IDaiJoin.exit(address,uint256)"><code class="function-signature">exit(address usr, uint256 wad)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiJoin.join(address,uint256)"></a><code class="function-signature">join(address urn, uint256 wad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiJoin.exit(address,uint256)"></a><code class="function-signature">exit(address usr, uint256 wad)</code><span class="function-visibility">public</span></h4>







### `IDaiPot`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiPot.drip()"><code class="function-signature">drip()</code></a></li><li><a href="#IDaiPot.join(uint256)"><code class="function-signature">join(uint256 wad)</code></a></li><li><a href="#IDaiPot.exit(uint256)"><code class="function-signature">exit(uint256 wad)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiPot.drip()"></a><code class="function-signature">drip() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiPot.join(uint256)"></a><code class="function-signature">join(uint256 wad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiPot.exit(uint256)"></a><code class="function-signature">exit(uint256 wad)</code><span class="function-visibility">public</span></h4>







### `IDisputeWindowFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeWindowFactory.createDisputeWindow(contract IAugur,uint256,uint256,uint256,bool)"><code class="function-signature">createDisputeWindow(contract IAugur _augur, uint256 _disputeWindowId, uint256 _windowDuration, uint256 _startTime, bool _participationTokensEnabled)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDisputeWindowFactory.createDisputeWindow(contract IAugur,uint256,uint256,uint256,bool)"></a><code class="function-signature">createDisputeWindow(contract IAugur _augur, uint256 _disputeWindowId, uint256 _windowDuration, uint256 _startTime, bool _participationTokensEnabled) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>







### `IFormulas`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IFormulas.calculateFloatingValue(uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calculateFloatingValue(uint256 _totalBad, uint256 _total, uint256 _targetDivisor, uint256 _previousValue, uint256 _floor)</code></a></li><li><a href="#IFormulas.calculateValidityBond(contract IDisputeWindow,uint256)"><code class="function-signature">calculateValidityBond(contract IDisputeWindow _previousDisputeWindow, uint256 _previousValidityBondInAttoCash)</code></a></li><li><a href="#IFormulas.calculateDesignatedReportStake(contract IDisputeWindow,uint256,uint256)"><code class="function-signature">calculateDesignatedReportStake(contract IDisputeWindow _previousDisputeWindow, uint256 _previousDesignatedReportStakeInAttoRep, uint256 _initialReportMinValue)</code></a></li><li><a href="#IFormulas.calculateDesignatedReportNoShowBond(contract IDisputeWindow,uint256,uint256)"><code class="function-signature">calculateDesignatedReportNoShowBond(contract IDisputeWindow _previousDisputeWindow, uint256 _previousDesignatedReportNoShowBondInAttoRep, uint256 _initialReportMinValue)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IFormulas.calculateFloatingValue(uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calculateFloatingValue(uint256 _totalBad, uint256 _total, uint256 _targetDivisor, uint256 _previousValue, uint256 _floor) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFormulas.calculateValidityBond(contract IDisputeWindow,uint256)"></a><code class="function-signature">calculateValidityBond(contract IDisputeWindow _previousDisputeWindow, uint256 _previousValidityBondInAttoCash) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFormulas.calculateDesignatedReportStake(contract IDisputeWindow,uint256,uint256)"></a><code class="function-signature">calculateDesignatedReportStake(contract IDisputeWindow _previousDisputeWindow, uint256 _previousDesignatedReportStakeInAttoRep, uint256 _initialReportMinValue) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFormulas.calculateDesignatedReportNoShowBond(contract IDisputeWindow,uint256,uint256)"></a><code class="function-signature">calculateDesignatedReportNoShowBond(contract IDisputeWindow _previousDisputeWindow, uint256 _previousDesignatedReportNoShowBondInAttoRep, uint256 _initialReportMinValue) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IOICashFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOICashFactory.createOICash(contract IAugur)"><code class="function-signature">createOICash(contract IAugur _augur)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOICashFactory.createOICash(contract IAugur)"></a><code class="function-signature">createOICash(contract IAugur _augur) <span class="return-arrow">→</span> <span class="return-type">contract IOICash</span></code><span class="function-visibility">public</span></h4>







### `IReputationTokenFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IReputationTokenFactory.createReputationToken(contract IAugur,contract IUniverse)"><code class="function-signature">createReputationToken(contract IAugur _augur, contract IUniverse _parentUniverse)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IReputationTokenFactory.createReputationToken(contract IAugur,contract IUniverse)"></a><code class="function-signature">createReputationToken(contract IAugur _augur, contract IUniverse _parentUniverse) <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">public</span></h4>







### `Universe`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Universe.constructor(contract IAugur,contract IUniverse,bytes32,uint256[])"><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators)</code></a></li><li><a href="#Universe.fork()"><code class="function-signature">fork()</code></a></li><li><a href="#Universe.updateForkValues()"><code class="function-signature">updateForkValues()</code></a></li><li><a href="#Universe.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#Universe.getWinningChildPayoutNumerator(uint256)"><code class="function-signature">getWinningChildPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#Universe.getParentUniverse()"><code class="function-signature">getParentUniverse()</code></a></li><li><a href="#Universe.getParentPayoutDistributionHash()"><code class="function-signature">getParentPayoutDistributionHash()</code></a></li><li><a href="#Universe.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#Universe.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#Universe.getForkEndTime()"><code class="function-signature">getForkEndTime()</code></a></li><li><a href="#Universe.getForkReputationGoal()"><code class="function-signature">getForkReputationGoal()</code></a></li><li><a href="#Universe.getDisputeThresholdForFork()"><code class="function-signature">getDisputeThresholdForFork()</code></a></li><li><a href="#Universe.getDisputeThresholdForDisputePacing()"><code class="function-signature">getDisputeThresholdForDisputePacing()</code></a></li><li><a href="#Universe.getInitialReportMinValue()"><code class="function-signature">getInitialReportMinValue()</code></a></li><li><a href="#Universe.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li><a href="#Universe.getDisputeWindow(uint256)"><code class="function-signature">getDisputeWindow(uint256 _disputeWindowId)</code></a></li><li><a href="#Universe.isForking()"><code class="function-signature">isForking()</code></a></li><li><a href="#Universe.isForkingMarket()"><code class="function-signature">isForkingMarket()</code></a></li><li><a href="#Universe.getChildUniverse(bytes32)"><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#Universe.getDisputeWindowId(uint256,bool)"><code class="function-signature">getDisputeWindowId(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#Universe.getDisputeRoundDurationInSeconds(bool)"><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial)</code></a></li><li><a href="#Universe.getOrCreateDisputeWindowByTimestamp(uint256,bool)"><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#Universe.getDisputeWindowStartTimeAndDuration(uint256,bool)"><code class="function-signature">getDisputeWindowStartTimeAndDuration(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#Universe.getDisputeWindowByTimestamp(uint256,bool)"><code class="function-signature">getDisputeWindowByTimestamp(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#Universe.getOrCreatePreviousPreviousDisputeWindow(bool)"><code class="function-signature">getOrCreatePreviousPreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getOrCreatePreviousDisputeWindow(bool)"><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getOrCreateCurrentDisputeWindow(bool)"><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getCurrentDisputeWindow(bool)"><code class="function-signature">getCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.getOrCreateNextDisputeWindow(bool)"><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial)</code></a></li><li><a href="#Universe.createChildUniverse(uint256[])"><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#Universe.updateTentativeWinningChildUniverse(bytes32)"><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#Universe.getWinningChildUniverse()"><code class="function-signature">getWinningChildUniverse()</code></a></li><li><a href="#Universe.isContainerForDisputeWindow(contract IDisputeWindow)"><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyDisputeWindow)</code></a></li><li><a href="#Universe.isContainerForMarket(contract IMarket)"><code class="function-signature">isContainerForMarket(contract IMarket _shadyMarket)</code></a></li><li><a href="#Universe.migrateMarketOut(contract IUniverse)"><code class="function-signature">migrateMarketOut(contract IUniverse _destinationUniverse)</code></a></li><li><a href="#Universe.migrateMarketIn(contract IMarket,uint256,uint256)"><code class="function-signature">migrateMarketIn(contract IMarket _market, uint256 _cashBalance, uint256 _marketOI)</code></a></li><li><a href="#Universe.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _shadyReportingParticipant)</code></a></li><li><a href="#Universe.isParentOf(contract IUniverse)"><code class="function-signature">isParentOf(contract IUniverse _shadyChild)</code></a></li><li><a href="#Universe.decrementOpenInterest(uint256)"><code class="function-signature">decrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#Universe.decrementOpenInterestFromMarket(contract IMarket)"><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market)</code></a></li><li><a href="#Universe.incrementOpenInterest(uint256)"><code class="function-signature">incrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#Universe.getOpenInterestInAttoCash()"><code class="function-signature">getOpenInterestInAttoCash()</code></a></li><li><a href="#Universe.isOpenInterestCash(address)"><code class="function-signature">isOpenInterestCash(address _address)</code></a></li><li><a href="#Universe.getRepMarketCapInAttoCash()"><code class="function-signature">getRepMarketCapInAttoCash()</code></a></li><li><a href="#Universe.pokeRepMarketCapInAttoCash()"><code class="function-signature">pokeRepMarketCapInAttoCash()</code></a></li><li><a href="#Universe.getTargetRepMarketCapInAttoCash()"><code class="function-signature">getTargetRepMarketCapInAttoCash()</code></a></li><li><a href="#Universe.getOrCacheValidityBond()"><code class="function-signature">getOrCacheValidityBond()</code></a></li><li><a href="#Universe.getOrCacheDesignatedReportStake()"><code class="function-signature">getOrCacheDesignatedReportStake()</code></a></li><li><a href="#Universe.getOrCacheDesignatedReportNoShowBond()"><code class="function-signature">getOrCacheDesignatedReportNoShowBond()</code></a></li><li><a href="#Universe.getOrCacheMarketRepBond()"><code class="function-signature">getOrCacheMarketRepBond()</code></a></li><li><a href="#Universe.getOrCacheReportingFeeDivisor()"><code class="function-signature">getOrCacheReportingFeeDivisor()</code></a></li><li><a href="#Universe.getReportingFeeDivisor()"><code class="function-signature">getReportingFeeDivisor()</code></a></li><li><a href="#Universe.pokeReportingFeeDivisor()"><code class="function-signature">pokeReportingFeeDivisor()</code></a></li><li><a href="#Universe.calculateReportingFeeDivisor()"><code class="function-signature">calculateReportingFeeDivisor()</code></a></li><li><a href="#Universe.createYesNoMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,string)"><code class="function-signature">createYesNoMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, string _extraInfo)</code></a></li><li><a href="#Universe.createCategoricalMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,bytes32[],string)"><code class="function-signature">createCategoricalMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32[] _outcomes, string _extraInfo)</code></a></li><li><a href="#Universe.createScalarMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,int256[],uint256,string)"><code class="function-signature">createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] _prices, uint256 _numTicks, string _extraInfo)</code></a></li><li><a href="#Universe.deposit(address,uint256,address)"><code class="function-signature">deposit(address _sender, uint256 _amount, address _market)</code></a></li><li><a href="#Universe.withdraw(address,uint256,address)"><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market)</code></a></li><li><a href="#Universe.sweepInterest()"><code class="function-signature">sweepInterest()</code></a></li><li class="inherited"><a href="reporting#CashSender.initializeCashSender(address,address)"><code class="function-signature">initializeCashSender(address _vat, address _cash)</code></a></li><li class="inherited"><a href="reporting#CashSender.cashTransfer(address,uint256)"><code class="function-signature">cashTransfer(address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#CashSender.cashTransferFrom(address,address,uint256)"><code class="function-signature">cashTransferFrom(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#CashSender.shutdownTransfer(address,address,uint256)"><code class="function-signature">shutdownTransfer(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="reporting#CashSender.vatDaiToDai(uint256)"><code class="function-signature">vatDaiToDai(uint256 _vDaiAmount)</code></a></li><li class="inherited"><a href="reporting#CashSender.daiToVatDai(uint256)"><code class="function-signature">daiToVatDai(uint256 _daiAmount)</code></a></li><li class="inherited"><a href="reporting#IUniverse.creationTime()"><code class="function-signature">creationTime()</code></a></li><li class="inherited"><a href="reporting#IUniverse.marketBalance(address)"><code class="function-signature">marketBalance(address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Universe.constructor(contract IAugur,contract IUniverse,bytes32,uint256[])"></a><code class="function-signature">constructor(contract IAugur _augur, contract IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] _payoutNumerators)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.fork()"></a><code class="function-signature">fork() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.updateForkValues()"></a><code class="function-signature">updateForkValues() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getPayoutNumerator(uint256)"></a><code class="function-signature">getPayoutNumerator(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getWinningChildPayoutNumerator(uint256)"></a><code class="function-signature">getWinningChildPayoutNumerator(uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getParentUniverse()"></a><code class="function-signature">getParentUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getParentPayoutDistributionHash()"></a><code class="function-signature">getParentPayoutDistributionHash() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getForkingMarket()"></a><code class="function-signature">getForkingMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getForkEndTime()"></a><code class="function-signature">getForkEndTime() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getForkReputationGoal()"></a><code class="function-signature">getForkReputationGoal() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeThresholdForFork()"></a><code class="function-signature">getDisputeThresholdForFork() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeThresholdForDisputePacing()"></a><code class="function-signature">getDisputeThresholdForDisputePacing() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getInitialReportMinValue()"></a><code class="function-signature">getInitialReportMinValue() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getPayoutNumerators()"></a><code class="function-signature">getPayoutNumerators() <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeWindow(uint256)"></a><code class="function-signature">getDisputeWindow(uint256 _disputeWindowId) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isForking()"></a><code class="function-signature">isForking() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isForkingMarket()"></a><code class="function-signature">isForkingMarket() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getChildUniverse(bytes32)"></a><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeWindowId(uint256,bool)"></a><code class="function-signature">getDisputeWindowId(uint256 _timestamp, bool _initial) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeRoundDurationInSeconds(bool)"></a><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreateDisputeWindowByTimestamp(uint256,bool)"></a><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeWindowStartTimeAndDuration(uint256,bool)"></a><code class="function-signature">getDisputeWindowStartTimeAndDuration(uint256 _timestamp, bool _initial) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getDisputeWindowByTimestamp(uint256,bool)"></a><code class="function-signature">getDisputeWindowByTimestamp(uint256 _timestamp, bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreatePreviousPreviousDisputeWindow(bool)"></a><code class="function-signature">getOrCreatePreviousPreviousDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreatePreviousDisputeWindow(bool)"></a><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreateCurrentDisputeWindow(bool)"></a><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getCurrentDisputeWindow(bool)"></a><code class="function-signature">getCurrentDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCreateNextDisputeWindow(bool)"></a><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial) <span class="return-arrow">→</span> <span class="return-type">contract IDisputeWindow</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.createChildUniverse(uint256[])"></a><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators) <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.updateTentativeWinningChildUniverse(bytes32)"></a><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getWinningChildUniverse()"></a><code class="function-signature">getWinningChildUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isContainerForDisputeWindow(contract IDisputeWindow)"></a><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyDisputeWindow) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isContainerForMarket(contract IMarket)"></a><code class="function-signature">isContainerForMarket(contract IMarket _shadyMarket) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.migrateMarketOut(contract IUniverse)"></a><code class="function-signature">migrateMarketOut(contract IUniverse _destinationUniverse) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.migrateMarketIn(contract IMarket,uint256,uint256)"></a><code class="function-signature">migrateMarketIn(contract IMarket _market, uint256 _cashBalance, uint256 _marketOI) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isContainerForReportingParticipant(contract IReportingParticipant)"></a><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _shadyReportingParticipant) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isParentOf(contract IUniverse)"></a><code class="function-signature">isParentOf(contract IUniverse _shadyChild) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.decrementOpenInterest(uint256)"></a><code class="function-signature">decrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.decrementOpenInterestFromMarket(contract IMarket)"></a><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.incrementOpenInterest(uint256)"></a><code class="function-signature">incrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOpenInterestInAttoCash()"></a><code class="function-signature">getOpenInterestInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.isOpenInterestCash(address)"></a><code class="function-signature">isOpenInterestCash(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getRepMarketCapInAttoCash()"></a><code class="function-signature">getRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.pokeRepMarketCapInAttoCash()"></a><code class="function-signature">pokeRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getTargetRepMarketCapInAttoCash()"></a><code class="function-signature">getTargetRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheValidityBond()"></a><code class="function-signature">getOrCacheValidityBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheDesignatedReportStake()"></a><code class="function-signature">getOrCacheDesignatedReportStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheDesignatedReportNoShowBond()"></a><code class="function-signature">getOrCacheDesignatedReportNoShowBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheMarketRepBond()"></a><code class="function-signature">getOrCacheMarketRepBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.getOrCacheReportingFeeDivisor()"></a><code class="function-signature">getOrCacheReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

this should be used in contracts so that the fee is actually set




<h4><a class="anchor" aria-hidden="true" id="Universe.getReportingFeeDivisor()"></a><code class="function-signature">getReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

this should be used for estimation purposes as it is a view and does not actually freeze the rate




<h4><a class="anchor" aria-hidden="true" id="Universe.pokeReportingFeeDivisor()"></a><code class="function-signature">pokeReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.calculateReportingFeeDivisor()"></a><code class="function-signature">calculateReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.createYesNoMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,string)"></a><code class="function-signature">createYesNoMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.createCategoricalMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,bytes32[],string)"></a><code class="function-signature">createCategoricalMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32[] _outcomes, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.createScalarMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,int256[],uint256,string)"></a><code class="function-signature">createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] _prices, uint256 _numTicks, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.deposit(address,uint256,address)"></a><code class="function-signature">deposit(address _sender, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.withdraw(address,uint256,address)"></a><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Universe.sweepInterest()"></a><code class="function-signature">sweepInterest() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







</div>