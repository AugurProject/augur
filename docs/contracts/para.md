---
title: Para
---

<div class="contracts">

## Contracts

### `AMMExchange`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#AMMExchange.initialize(contract IMarket,contract IParaShareToken,uint256)"><code class="function-signature">initialize(contract IMarket _market, contract IParaShareToken _shareToken, uint256 _fee)</code></a></li><li><a href="#AMMExchange.addLiquidity(uint256,address)"><code class="function-signature">addLiquidity(uint256 _cash, address _recipient)</code></a></li><li><a href="#AMMExchange.addInitialLiquidity(uint256,uint256,bool,address)"><code class="function-signature">addInitialLiquidity(uint256 _cash, uint256 _ratioFactor, bool _keepYes, address _recipient)</code></a></li><li><a href="#AMMExchange.addLiquidityInternal(address,uint256,uint256,bool,address)"><code class="function-signature">addLiquidityInternal(address _user, uint256 _cash, uint256 _ratioFactor, bool _keepYes, address _recipient)</code></a></li><li><a href="#AMMExchange.rateAddLiquidity(uint256,uint256)"><code class="function-signature">rateAddLiquidity(uint256 _yesses, uint256 _nos)</code></a></li><li><a href="#AMMExchange.removeLiquidity(uint256,uint256)"><code class="function-signature">removeLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold)</code></a></li><li><a href="#AMMExchange.rateRemoveLiquidity(uint256,uint256)"><code class="function-signature">rateRemoveLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold)</code></a></li><li><a href="#AMMExchange.enterPosition(uint256,bool,uint256)"><code class="function-signature">enterPosition(uint256 _cashCost, bool _buyYes, uint256 _minShares)</code></a></li><li><a href="#AMMExchange.rateEnterPosition(uint256,bool)"><code class="function-signature">rateEnterPosition(uint256 _cashToSpend, bool _buyYes)</code></a></li><li><a href="#AMMExchange.exitAll(uint256)"><code class="function-signature">exitAll(uint256 _minCashPayout)</code></a></li><li><a href="#AMMExchange.exitPosition(uint256,uint256,uint256,uint256)"><code class="function-signature">exitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout)</code></a></li><li><a href="#AMMExchange.rateExitAll()"><code class="function-signature">rateExitAll()</code></a></li><li><a href="#AMMExchange.rateExitPosition(uint256,uint256,uint256)"><code class="function-signature">rateExitPosition(uint256 _invalidShares, uint256 _noSharesToSell, uint256 _yesSharesToSell)</code></a></li><li><a href="#AMMExchange.swap(uint256,bool,uint256)"><code class="function-signature">swap(uint256 _inputShares, bool _inputYes, uint256 _minOutputShares)</code></a></li><li><a href="#AMMExchange.rateSwap(uint256,bool)"><code class="function-signature">rateSwap(uint256 _inputShares, bool _inputYes)</code></a></li><li><a href="#AMMExchange.poolConstant(uint256,uint256)"><code class="function-signature">poolConstant(uint256 _poolYes, uint256 _poolNo)</code></a></li><li><a href="#AMMExchange.yesNoShareBalances(address)"><code class="function-signature">yesNoShareBalances(address _owner)</code></a></li><li><a href="#AMMExchange.quadratic(int256,int256,int256,uint256)"><code class="function-signature">quadratic(int256 _a, int256 _b, int256 _c, uint256 _maximum)</code></a></li><li><a href="#AMMExchange.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#AMMExchange.EnterPosition(address,uint256,uint256,bool)"><code class="function-signature">EnterPosition(address sender, uint256 cash, uint256 outputShares, bool buyYes)</code></a></li><li><a href="#AMMExchange.ExitPosition(address,uint256,uint256,uint256,uint256)"><code class="function-signature">ExitPosition(address sender, uint256 invalidShares, uint256 noShares, uint256 yesShares, uint256 cashPayout)</code></a></li><li><a href="#AMMExchange.AddLiquidity(address,uint256,uint256,uint256,uint256)"><code class="function-signature">AddLiquidity(address sender, uint256 cash, uint256 noShares, uint256 yesShares, uint256 lpTokens)</code></a></li><li><a href="#AMMExchange.RemoveLiquidity(address,uint256,uint256,uint256)"><code class="function-signature">RemoveLiquidity(address sender, uint256 cash, uint256 noShares, uint256 yesShares)</code></a></li><li><a href="#AMMExchange.SwapPosition(address,uint256,uint256,bool)"><code class="function-signature">SwapPosition(address sender, uint256 inputShares, uint256 outputShares, bool inputYes)</code></a></li><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="AMMExchange.initialize(contract IMarket,contract IParaShareToken,uint256)"></a><code class="function-signature">initialize(contract IMarket _market, contract IParaShareToken _shareToken, uint256 _fee)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.addLiquidity(uint256,address)"></a><code class="function-signature">addLiquidity(uint256 _cash, address _recipient) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.addInitialLiquidity(uint256,uint256,bool,address)"></a><code class="function-signature">addInitialLiquidity(uint256 _cash, uint256 _ratioFactor, bool _keepYes, address _recipient) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.addLiquidityInternal(address,uint256,uint256,bool,address)"></a><code class="function-signature">addLiquidityInternal(address _user, uint256 _cash, uint256 _ratioFactor, bool _keepYes, address _recipient) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.rateAddLiquidity(uint256,uint256)"></a><code class="function-signature">rateAddLiquidity(uint256 _yesses, uint256 _nos) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.removeLiquidity(uint256,uint256)"></a><code class="function-signature">removeLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.rateRemoveLiquidity(uint256,uint256)"></a><code class="function-signature">rateRemoveLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,uint256,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.enterPosition(uint256,bool,uint256)"></a><code class="function-signature">enterPosition(uint256 _cashCost, bool _buyYes, uint256 _minShares) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.rateEnterPosition(uint256,bool)"></a><code class="function-signature">rateEnterPosition(uint256 _cashToSpend, bool _buyYes) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.exitAll(uint256)"></a><code class="function-signature">exitAll(uint256 _minCashPayout) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.exitPosition(uint256,uint256,uint256,uint256)"></a><code class="function-signature">exitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.rateExitAll()"></a><code class="function-signature">rateExitAll() <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,int256,int256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.rateExitPosition(uint256,uint256,uint256)"></a><code class="function-signature">rateExitPosition(uint256 _invalidShares, uint256 _noSharesToSell, uint256 _yesSharesToSell) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,int256,int256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.swap(uint256,bool,uint256)"></a><code class="function-signature">swap(uint256 _inputShares, bool _inputYes, uint256 _minOutputShares) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.rateSwap(uint256,bool)"></a><code class="function-signature">rateSwap(uint256 _inputShares, bool _inputYes) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.poolConstant(uint256,uint256)"></a><code class="function-signature">poolConstant(uint256 _poolYes, uint256 _poolNo) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.yesNoShareBalances(address)"></a><code class="function-signature">yesNoShareBalances(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.quadratic(int256,int256,int256,uint256)"></a><code class="function-signature">quadratic(int256 _a, int256 _b, int256 _c, uint256 _maximum) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="AMMExchange.EnterPosition(address,uint256,uint256,bool)"></a><code class="function-signature">EnterPosition(address sender, uint256 cash, uint256 outputShares, bool buyYes)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.ExitPosition(address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">ExitPosition(address sender, uint256 invalidShares, uint256 noShares, uint256 yesShares, uint256 cashPayout)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.AddLiquidity(address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">AddLiquidity(address sender, uint256 cash, uint256 noShares, uint256 yesShares, uint256 lpTokens)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.RemoveLiquidity(address,uint256,uint256,uint256)"></a><code class="function-signature">RemoveLiquidity(address sender, uint256 cash, uint256 noShares, uint256 yesShares)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMExchange.SwapPosition(address,uint256,uint256,bool)"></a><code class="function-signature">SwapPosition(address sender, uint256 inputShares, uint256 outputShares, bool inputYes)</code><span class="function-visibility"></span></h4>





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

This is internal function is equivalent to [`approve`](reporting#ERC20.approve(address,uint256)), and can be used to
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







### `IAMMExchange`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAMMExchange.initialize(contract IMarket,contract IParaShareToken,uint256)"><code class="function-signature">initialize(contract IMarket _market, contract IParaShareToken _shareToken, uint256 _fee)</code></a></li><li><a href="#IAMMExchange.addLiquidity(uint256,address)"><code class="function-signature">addLiquidity(uint256 _cash, address _recipient)</code></a></li><li><a href="#IAMMExchange.addInitialLiquidity(uint256,uint256,bool,address)"><code class="function-signature">addInitialLiquidity(uint256 _cash, uint256 _ratioFactor, bool _keepYes, address _recipient)</code></a></li><li><a href="#IAMMExchange.rateAddLiquidity(uint256,uint256)"><code class="function-signature">rateAddLiquidity(uint256 _yesses, uint256 _nos)</code></a></li><li><a href="#IAMMExchange.removeLiquidity(uint256,uint256)"><code class="function-signature">removeLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold)</code></a></li><li><a href="#IAMMExchange.rateRemoveLiquidity(uint256,uint256)"><code class="function-signature">rateRemoveLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold)</code></a></li><li><a href="#IAMMExchange.enterPosition(uint256,bool,uint256)"><code class="function-signature">enterPosition(uint256 _cashCost, bool _buyYes, uint256 _minShares)</code></a></li><li><a href="#IAMMExchange.rateEnterPosition(uint256,bool)"><code class="function-signature">rateEnterPosition(uint256 _cashToSpend, bool _buyYes)</code></a></li><li><a href="#IAMMExchange.exitPosition(uint256,uint256,uint256,uint256)"><code class="function-signature">exitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout)</code></a></li><li><a href="#IAMMExchange.exitAll(uint256)"><code class="function-signature">exitAll(uint256 _minCashPayout)</code></a></li><li><a href="#IAMMExchange.rateExitPosition(uint256,uint256,uint256)"><code class="function-signature">rateExitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares)</code></a></li><li><a href="#IAMMExchange.rateExitAll()"><code class="function-signature">rateExitAll()</code></a></li><li><a href="#IAMMExchange.swap(uint256,bool,uint256)"><code class="function-signature">swap(uint256 _inputShares, bool _inputYes, uint256 _minOutputShares)</code></a></li><li><a href="#IAMMExchange.rateSwap(uint256,bool)"><code class="function-signature">rateSwap(uint256 _inputShares, bool _inputYes)</code></a></li><li><a href="#IAMMExchange.poolConstant(uint256,uint256)"><code class="function-signature">poolConstant(uint256 _poolYes, uint256 _poolNo)</code></a></li><li class="inherited"><a href="para#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="para#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="para#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="para#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="para#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.initialize(contract IMarket,contract IParaShareToken,uint256)"></a><code class="function-signature">initialize(contract IMarket _market, contract IParaShareToken _shareToken, uint256 _fee)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.addLiquidity(uint256,address)"></a><code class="function-signature">addLiquidity(uint256 _cash, address _recipient) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.addInitialLiquidity(uint256,uint256,bool,address)"></a><code class="function-signature">addInitialLiquidity(uint256 _cash, uint256 _ratioFactor, bool _keepYes, address _recipient) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.rateAddLiquidity(uint256,uint256)"></a><code class="function-signature">rateAddLiquidity(uint256 _yesses, uint256 _nos) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.removeLiquidity(uint256,uint256)"></a><code class="function-signature">removeLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.rateRemoveLiquidity(uint256,uint256)"></a><code class="function-signature">rateRemoveLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,uint256,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.enterPosition(uint256,bool,uint256)"></a><code class="function-signature">enterPosition(uint256 _cashCost, bool _buyYes, uint256 _minShares) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.rateEnterPosition(uint256,bool)"></a><code class="function-signature">rateEnterPosition(uint256 _cashToSpend, bool _buyYes) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.exitPosition(uint256,uint256,uint256,uint256)"></a><code class="function-signature">exitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.exitAll(uint256)"></a><code class="function-signature">exitAll(uint256 _minCashPayout) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.rateExitPosition(uint256,uint256,uint256)"></a><code class="function-signature">rateExitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,int256,int256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.rateExitAll()"></a><code class="function-signature">rateExitAll() <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,int256,int256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.swap(uint256,bool,uint256)"></a><code class="function-signature">swap(uint256 _inputShares, bool _inputYes, uint256 _minOutputShares) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.rateSwap(uint256,bool)"></a><code class="function-signature">rateSwap(uint256 _inputShares, bool _inputYes) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMExchange.poolConstant(uint256,uint256)"></a><code class="function-signature">poolConstant(uint256 _poolYes, uint256 _poolNo) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IAMMFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAMMFactory.addAMM(contract IMarket,contract IParaShareToken)"><code class="function-signature">addAMM(contract IMarket _market, contract IParaShareToken _para)</code></a></li><li><a href="#IAMMFactory.addAMMWithLiquidity(contract IMarket,contract IParaShareToken,uint256,uint256,bool)"><code class="function-signature">addAMMWithLiquidity(contract IMarket _market, contract IParaShareToken _para, uint256 _cash, uint256 _ratioFactor, bool _keepYes)</code></a></li><li><a href="#IAMMFactory.salt(contract IMarket,contract IParaShareToken)"><code class="function-signature">salt(contract IMarket _market, contract IParaShareToken _para)</code></a></li><li><a href="#IAMMFactory.transferCash(contract IMarket,contract IParaShareToken,address,address,uint256)"><code class="function-signature">transferCash(contract IMarket _market, contract IParaShareToken _para, address sender, address recipient, uint256 quantity)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAMMFactory.addAMM(contract IMarket,contract IParaShareToken)"></a><code class="function-signature">addAMM(contract IMarket _market, contract IParaShareToken _para) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMFactory.addAMMWithLiquidity(contract IMarket,contract IParaShareToken,uint256,uint256,bool)"></a><code class="function-signature">addAMMWithLiquidity(contract IMarket _market, contract IParaShareToken _para, uint256 _cash, uint256 _ratioFactor, bool _keepYes) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMFactory.salt(contract IMarket,contract IParaShareToken)"></a><code class="function-signature">salt(contract IMarket _market, contract IParaShareToken _para) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAMMFactory.transferCash(contract IMarket,contract IParaShareToken,address,address,uint256)"></a><code class="function-signature">transferCash(contract IMarket _market, contract IParaShareToken _para, address sender, address recipient, uint256 quantity)</code><span class="function-visibility">public</span></h4>







### `IAffiliateValidator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAffiliateValidator.validateReference(address,address)"><code class="function-signature">validateReference(address _account, address _referrer)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAffiliateValidator.validateReference(address,address)"></a><code class="function-signature">validateReference(address _account, address _referrer) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `IAugur`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugur.createChildUniverse(bytes32,uint256[])"><code class="function-signature">createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IAugur.isKnownUniverse(contract IUniverse)"><code class="function-signature">isKnownUniverse(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.trustedCashTransfer(address,address,uint256)"><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#IAugur.isTrustedSender(address)"><code class="function-signature">isTrustedSender(address _address)</code></a></li><li><a href="#IAugur.onCategoricalMarketCreated(uint256,string,contract IMarket,address,address,uint256,bytes32[])"><code class="function-signature">onCategoricalMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, bytes32[] _outcomes)</code></a></li><li><a href="#IAugur.onYesNoMarketCreated(uint256,string,contract IMarket,address,address,uint256)"><code class="function-signature">onYesNoMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash)</code></a></li><li><a href="#IAugur.onScalarMarketCreated(uint256,string,contract IMarket,address,address,uint256,int256[],uint256)"><code class="function-signature">onScalarMarketCreated(uint256 _endTime, string _extraInfo, contract IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feePerCashInAttoCash, int256[] _prices, uint256 _numTicks)</code></a></li><li><a href="#IAugur.logInitialReportSubmitted(contract IUniverse,address,address,address,uint256,bool,uint256[],string,uint256,uint256)"><code class="function-signature">logInitialReportSubmitted(contract IUniverse _universe, address _reporter, address _market, address _initialReporter, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string _description, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime)</code></a></li><li><a href="#IAugur.disputeCrowdsourcerCreated(contract IUniverse,address,address,uint256[],uint256,uint256)"><code class="function-signature">disputeCrowdsourcerCreated(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size, uint256 _disputeRound)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerContribution(contract IUniverse,address,address,address,uint256,string,uint256[],uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerContribution(contract IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string description, uint256[] _payoutNumerators, uint256 _currentStake, uint256 _stakeRemaining, uint256 _disputeRound)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerCompleted(contract IUniverse,address,address,uint256[],uint256,uint256,bool,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerCompleted(contract IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _nextWindowStartTime, uint256 _nextWindowEndTime, bool _pacingOn, uint256 _totalRepStakedInPayout, uint256 _totalRepStakedInMarket, uint256 _disputeRound)</code></a></li><li><a href="#IAugur.logInitialReporterRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logInitialReporterRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerRedeemed(contract IUniverse,address,address,uint256,uint256,uint256[])"><code class="function-signature">logDisputeCrowdsourcerRedeemed(contract IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] _payoutNumerators)</code></a></li><li><a href="#IAugur.logMarketFinalized(contract IUniverse,uint256[])"><code class="function-signature">logMarketFinalized(contract IUniverse _universe, uint256[] _winningPayoutNumerators)</code></a></li><li><a href="#IAugur.logMarketMigrated(contract IMarket,contract IUniverse)"><code class="function-signature">logMarketMigrated(contract IMarket _market, contract IUniverse _originalUniverse)</code></a></li><li><a href="#IAugur.logReportingParticipantDisavowed(contract IUniverse,contract IMarket)"><code class="function-signature">logReportingParticipantDisavowed(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IAugur.logMarketParticipantsDisavowed(contract IUniverse)"><code class="function-signature">logMarketParticipantsDisavowed(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets)</code></a></li><li><a href="#IAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees)</code></a></li><li><a href="#IAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IAugur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees)</code></a></li><li><a href="#IAugur.logUniverseForked(contract IMarket)"><code class="function-signature">logUniverseForked(contract IMarket _forkingMarket)</code></a></li><li><a href="#IAugur.logReputationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logReputationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logReputationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logReputationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeCrowdsourcerTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logDisputeCrowdsourcerTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logDisputeWindowCreated(contract IDisputeWindow,uint256,bool)"><code class="function-signature">logDisputeWindowCreated(contract IDisputeWindow _disputeWindow, uint256 _id, bool _initial)</code></a></li><li><a href="#IAugur.logParticipationTokensRedeemed(contract IUniverse,address,uint256,uint256)"><code class="function-signature">logParticipationTokensRedeemed(contract IUniverse universe, address _sender, uint256 _attoParticipationTokens, uint256 _feePayoutShare)</code></a></li><li><a href="#IAugur.logTimestampSet(uint256)"><code class="function-signature">logTimestampSet(uint256 _newTimestamp)</code></a></li><li><a href="#IAugur.logInitialReporterTransferred(contract IUniverse,contract IMarket,address,address)"><code class="function-signature">logInitialReporterTransferred(contract IUniverse _universe, contract IMarket _market, address _from, address _to)</code></a></li><li><a href="#IAugur.logMarketTransferred(contract IUniverse,address,address)"><code class="function-signature">logMarketTransferred(contract IUniverse _universe, address _from, address _to)</code></a></li><li><a href="#IAugur.logParticipationTokensTransferred(contract IUniverse,address,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensTransferred(contract IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance)</code></a></li><li><a href="#IAugur.logParticipationTokensBurned(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensBurned(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logParticipationTokensMinted(contract IUniverse,address,uint256,uint256,uint256)"><code class="function-signature">logParticipationTokensMinted(contract IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance)</code></a></li><li><a href="#IAugur.logMarketRepBondTransferred(address,address,address)"><code class="function-signature">logMarketRepBondTransferred(address _universe, address _from, address _to)</code></a></li><li><a href="#IAugur.logWarpSyncDataUpdated(address,uint256,uint256)"><code class="function-signature">logWarpSyncDataUpdated(address _universe, uint256 _warpSyncHash, uint256 _marketEndTime)</code></a></li><li><a href="#IAugur.isKnownFeeSender(address)"><code class="function-signature">isKnownFeeSender(address _feeSender)</code></a></li><li><a href="#IAugur.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#IAugur.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#IAugur.getMaximumMarketEndDate()"><code class="function-signature">getMaximumMarketEndDate()</code></a></li><li><a href="#IAugur.isKnownMarket(contract IMarket)"><code class="function-signature">isKnownMarket(contract IMarket _market)</code></a></li><li><a href="#IAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 numOutcomes)</code></a></li><li><a href="#IAugur.logValidityBondChanged(uint256)"><code class="function-signature">logValidityBondChanged(uint256 _validityBond)</code></a></li><li><a href="#IAugur.logDesignatedReportStakeChanged(uint256)"><code class="function-signature">logDesignatedReportStakeChanged(uint256 _designatedReportStake)</code></a></li><li><a href="#IAugur.logNoShowBondChanged(uint256)"><code class="function-signature">logNoShowBondChanged(uint256 _noShowBond)</code></a></li><li><a href="#IAugur.logReportingFeeChanged(uint256)"><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee)</code></a></li><li><a href="#IAugur.getUniverseForkIndex(contract IUniverse)"><code class="function-signature">getUniverseForkIndex(contract IUniverse _universe)</code></a></li><li><a href="#IAugur.getMarketType(contract IMarket)"><code class="function-signature">getMarketType(contract IMarket _market)</code></a></li><li><a href="#IAugur.getMarketOutcomes(contract IMarket)"><code class="function-signature">getMarketOutcomes(contract IMarket _market)</code></a></li></ul></div>



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





<h4><a class="anchor" aria-hidden="true" id="IAugur.getMarketType(contract IMarket)"></a><code class="function-signature">getMarketType(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">enum IMarket.MarketType</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugur.getMarketOutcomes(contract IMarket)"></a><code class="function-signature">getMarketOutcomes(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bytes32[]</span></code><span class="function-visibility">public</span></h4>







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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li class="inherited"><a href="para#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="para#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="para#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="para#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="para#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>





### `IDisputeWindow`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDisputeWindow.invalidMarketsTotal()"><code class="function-signature">invalidMarketsTotal()</code></a></li><li><a href="#IDisputeWindow.validityBondTotal()"><code class="function-signature">validityBondTotal()</code></a></li><li><a href="#IDisputeWindow.incorrectDesignatedReportTotal()"><code class="function-signature">incorrectDesignatedReportTotal()</code></a></li><li><a href="#IDisputeWindow.initialReportBondTotal()"><code class="function-signature">initialReportBondTotal()</code></a></li><li><a href="#IDisputeWindow.designatedReportNoShowsTotal()"><code class="function-signature">designatedReportNoShowsTotal()</code></a></li><li><a href="#IDisputeWindow.designatedReporterNoShowBondTotal()"><code class="function-signature">designatedReporterNoShowBondTotal()</code></a></li><li><a href="#IDisputeWindow.initialize(contract IAugur,contract IUniverse,uint256,bool,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _disputeWindowId, bool _participationTokensEnabled, uint256 _duration, uint256 _startTime)</code></a></li><li><a href="#IDisputeWindow.trustedBuy(address,uint256)"><code class="function-signature">trustedBuy(address _buyer, uint256 _attotokens)</code></a></li><li><a href="#IDisputeWindow.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IDisputeWindow.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IDisputeWindow.getStartTime()"><code class="function-signature">getStartTime()</code></a></li><li><a href="#IDisputeWindow.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IDisputeWindow.getWindowId()"><code class="function-signature">getWindowId()</code></a></li><li><a href="#IDisputeWindow.isActive()"><code class="function-signature">isActive()</code></a></li><li><a href="#IDisputeWindow.isOver()"><code class="function-signature">isOver()</code></a></li><li><a href="#IDisputeWindow.onMarketFinalized()"><code class="function-signature">onMarketFinalized()</code></a></li><li><a href="#IDisputeWindow.redeem(address)"><code class="function-signature">redeem(address _account)</code></a></li><li class="inherited"><a href="para#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="para#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="para#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="para#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="para#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="para#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



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





### `IFeePot`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IFeePot.depositFees(uint256)"><code class="function-signature">depositFees(uint256 _amount)</code></a></li><li><a href="#IFeePot.withdrawableFeesOf(address)"><code class="function-signature">withdrawableFeesOf(address _owner)</code></a></li><li><a href="#IFeePot.redeem()"><code class="function-signature">redeem()</code></a></li><li><a href="#IFeePot.cash()"><code class="function-signature">cash()</code></a></li><li class="inherited"><a href="para#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="para#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="para#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="para#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="para#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IFeePot.depositFees(uint256)"></a><code class="function-signature">depositFees(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFeePot.withdrawableFeesOf(address)"></a><code class="function-signature">withdrawableFeesOf(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFeePot.redeem()"></a><code class="function-signature">redeem() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFeePot.cash()"></a><code class="function-signature">cash() <span class="return-arrow">→</span> <span class="return-type">contract ICash</span></code><span class="function-visibility">external</span></h4>







### `IInitialReporter`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IInitialReporter.initialize(contract IAugur,contract IMarket,address)"><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.report(address,bytes32,uint256[],uint256)"><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code></a></li><li><a href="#IInitialReporter.designatedReporterShowed()"><code class="function-signature">designatedReporterShowed()</code></a></li><li><a href="#IInitialReporter.initialReporterWasCorrect()"><code class="function-signature">initialReporterWasCorrect()</code></a></li><li><a href="#IInitialReporter.getDesignatedReporter()"><code class="function-signature">getDesignatedReporter()</code></a></li><li><a href="#IInitialReporter.getReportTimestamp()"><code class="function-signature">getReportTimestamp()</code></a></li><li><a href="#IInitialReporter.migrateToNewUniverse(address)"><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code></a></li><li><a href="#IInitialReporter.returnRepFromDisavow()"><code class="function-signature">returnRepFromDisavow()</code></a></li><li class="inherited"><a href="para#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="para#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li class="inherited"><a href="para#IReportingParticipant.getStake()"><code class="function-signature">getStake()</code></a></li><li class="inherited"><a href="para#IReportingParticipant.getPayoutDistributionHash()"><code class="function-signature">getPayoutDistributionHash()</code></a></li><li class="inherited"><a href="para#IReportingParticipant.liquidateLosing()"><code class="function-signature">liquidateLosing()</code></a></li><li class="inherited"><a href="para#IReportingParticipant.redeem(address)"><code class="function-signature">redeem(address _redeemer)</code></a></li><li class="inherited"><a href="para#IReportingParticipant.isDisavowed()"><code class="function-signature">isDisavowed()</code></a></li><li class="inherited"><a href="para#IReportingParticipant.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li class="inherited"><a href="para#IReportingParticipant.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li class="inherited"><a href="para#IReportingParticipant.getMarket()"><code class="function-signature">getMarket()</code></a></li><li class="inherited"><a href="para#IReportingParticipant.getSize()"><code class="function-signature">getSize()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.initialize(contract IAugur,contract IMarket,address)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IMarket _market, address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.report(address,bytes32,uint256[],uint256)"></a><code class="function-signature">report(address _reporter, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, uint256 _initialReportStake)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.designatedReporterShowed()"></a><code class="function-signature">designatedReporterShowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.initialReporterWasCorrect()"></a><code class="function-signature">initialReporterWasCorrect() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getDesignatedReporter()"></a><code class="function-signature">getDesignatedReporter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.getReportTimestamp()"></a><code class="function-signature">getReportTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.migrateToNewUniverse(address)"></a><code class="function-signature">migrateToNewUniverse(address _designatedReporter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IInitialReporter.returnRepFromDisavow()"></a><code class="function-signature">returnRepFromDisavow()</code><span class="function-visibility">public</span></h4>







### `IMarket`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMarket.initialize(contract IAugur,contract IUniverse,uint256,uint256,contract IAffiliateValidator,uint256,address,address,uint256,uint256)"><code class="function-signature">initialize(contract IAugur _augur, contract IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#IMarket.derivePayoutDistributionHash(uint256[])"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators)</code></a></li><li><a href="#IMarket.doInitialReport(uint256[],string,uint256)"><code class="function-signature">doInitialReport(uint256[] _payoutNumerators, string _description, uint256 _additionalStake)</code></a></li><li><a href="#IMarket.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IMarket.getDisputeWindow()"><code class="function-signature">getDisputeWindow()</code></a></li><li><a href="#IMarket.getNumberOfOutcomes()"><code class="function-signature">getNumberOfOutcomes()</code></a></li><li><a href="#IMarket.getNumTicks()"><code class="function-signature">getNumTicks()</code></a></li><li><a href="#IMarket.getMarketCreatorSettlementFeeDivisor()"><code class="function-signature">getMarketCreatorSettlementFeeDivisor()</code></a></li><li><a href="#IMarket.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IMarket.getEndTime()"><code class="function-signature">getEndTime()</code></a></li><li><a href="#IMarket.getWinningPayoutDistributionHash()"><code class="function-signature">getWinningPayoutDistributionHash()</code></a></li><li><a href="#IMarket.getWinningPayoutNumerator(uint256)"><code class="function-signature">getWinningPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IMarket.getWinningReportingParticipant()"><code class="function-signature">getWinningReportingParticipant()</code></a></li><li><a href="#IMarket.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IMarket.getFinalizationTime()"><code class="function-signature">getFinalizationTime()</code></a></li><li><a href="#IMarket.getInitialReporter()"><code class="function-signature">getInitialReporter()</code></a></li><li><a href="#IMarket.getDesignatedReportingEndTime()"><code class="function-signature">getDesignatedReportingEndTime()</code></a></li><li><a href="#IMarket.getValidityBondAttoCash()"><code class="function-signature">getValidityBondAttoCash()</code></a></li><li><a href="#IMarket.affiliateFeeDivisor()"><code class="function-signature">affiliateFeeDivisor()</code></a></li><li><a href="#IMarket.getNumParticipants()"><code class="function-signature">getNumParticipants()</code></a></li><li><a href="#IMarket.getDisputePacingOn()"><code class="function-signature">getDisputePacingOn()</code></a></li><li><a href="#IMarket.deriveMarketCreatorFeeAmount(uint256)"><code class="function-signature">deriveMarketCreatorFeeAmount(uint256 _amount)</code></a></li><li><a href="#IMarket.recordMarketCreatorFees(uint256,address,bytes32)"><code class="function-signature">recordMarketCreatorFees(uint256 _marketCreatorFees, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#IMarket.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IMarket.isFinalizedAsInvalid()"><code class="function-signature">isFinalizedAsInvalid()</code></a></li><li><a href="#IMarket.finalize()"><code class="function-signature">finalize()</code></a></li><li><a href="#IMarket.isFinalized()"><code class="function-signature">isFinalized()</code></a></li><li><a href="#IMarket.getOpenInterest()"><code class="function-signature">getOpenInterest()</code></a></li><li class="inherited"><a href="para#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="para#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



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







### `IParaShareToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaShareToken.cash()"><code class="function-signature">cash()</code></a></li><li><a href="#IParaShareToken.augur()"><code class="function-signature">augur()</code></a></li><li><a href="#IParaShareToken.initialize(address,address)"><code class="function-signature">initialize(address _augur, address _originalShareToken)</code></a></li><li><a href="#IParaShareToken.approveUniverse(contract IParaUniverse)"><code class="function-signature">approveUniverse(contract IParaUniverse _paraUniverse)</code></a></li><li><a href="#IParaShareToken.buyCompleteSets(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#IParaShareToken.publicSellCompleteSets(contract IMarket,uint256)"><code class="function-signature">publicSellCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#IParaShareToken.publicBuyCompleteSets(contract IMarket,uint256)"><code class="function-signature">publicBuyCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#IParaShareToken.getTokenId(contract IMarket,uint256)"><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IParaShareToken.unsafeTransferFrom(address,address,uint256,uint256)"><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code></a></li><li><a href="#IParaShareToken.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address owner, uint256 id)</code></a></li><li><a href="#IParaShareToken.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids)</code></a></li><li><a href="#IParaShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.cash()"></a><code class="function-signature">cash() <span class="return-arrow">→</span> <span class="return-type">contract ICash</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.augur()"></a><code class="function-signature">augur() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.initialize(address,address)"></a><code class="function-signature">initialize(address _augur, address _originalShareToken)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.approveUniverse(contract IParaUniverse)"></a><code class="function-signature">approveUniverse(contract IParaUniverse _paraUniverse)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.buyCompleteSets(contract IMarket,address,uint256)"></a><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.publicSellCompleteSets(contract IMarket,uint256)"></a><code class="function-signature">publicSellCompleteSets(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.publicBuyCompleteSets(contract IMarket,uint256)"></a><code class="function-signature">publicBuyCompleteSets(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.getTokenId(contract IMarket,uint256)"></a><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.unsafeTransferFrom(address,address,uint256,uint256)"></a><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.balanceOf(address,uint256)"></a><code class="function-signature">balanceOf(address owner, uint256 id) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.balanceOfBatch(address[],uint256[])"></a><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"></a><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code><span class="function-visibility">external</span></h4>







### `IParaUniverse`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaUniverse.getFeePot()"><code class="function-signature">getFeePot()</code></a></li><li><a href="#IParaUniverse.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IParaUniverse.originUniverse()"><code class="function-signature">originUniverse()</code></a></li><li><a href="#IParaUniverse.setMarketFinalized(contract IMarket,uint256)"><code class="function-signature">setMarketFinalized(contract IMarket _market, uint256 _totalSupply)</code></a></li><li><a href="#IParaUniverse.withdraw(address,uint256,address)"><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market)</code></a></li><li><a href="#IParaUniverse.deposit(address,uint256,address)"><code class="function-signature">deposit(address _sender, uint256 _amount, address _market)</code></a></li><li><a href="#IParaUniverse.decrementOpenInterest(uint256)"><code class="function-signature">decrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IParaUniverse.incrementOpenInterest(uint256)"><code class="function-signature">incrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IParaUniverse.recordMarketCreatorFees(contract IMarket,uint256,address)"><code class="function-signature">recordMarketCreatorFees(contract IMarket _market, uint256 _marketCreatorFees, address _sourceAccount)</code></a></li><li><a href="#IParaUniverse.getMarketOpenInterest(contract IMarket)"><code class="function-signature">getMarketOpenInterest(contract IMarket _market)</code></a></li><li><a href="#IParaUniverse.getOrCacheReportingFeeDivisor()"><code class="function-signature">getOrCacheReportingFeeDivisor()</code></a></li><li><a href="#IParaUniverse.getReportingFeeDivisor()"><code class="function-signature">getReportingFeeDivisor()</code></a></li><li><a href="#IParaUniverse.setOrigin(contract IUniverse)"><code class="function-signature">setOrigin(contract IUniverse _originUniverse)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.getFeePot()"></a><code class="function-signature">getFeePot() <span class="return-arrow">→</span> <span class="return-type">contract IFeePot</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.originUniverse()"></a><code class="function-signature">originUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.setMarketFinalized(contract IMarket,uint256)"></a><code class="function-signature">setMarketFinalized(contract IMarket _market, uint256 _totalSupply) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.withdraw(address,uint256,address)"></a><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.deposit(address,uint256,address)"></a><code class="function-signature">deposit(address _sender, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.decrementOpenInterest(uint256)"></a><code class="function-signature">decrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.incrementOpenInterest(uint256)"></a><code class="function-signature">incrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.recordMarketCreatorFees(contract IMarket,uint256,address)"></a><code class="function-signature">recordMarketCreatorFees(contract IMarket _market, uint256 _marketCreatorFees, address _sourceAccount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.getMarketOpenInterest(contract IMarket)"></a><code class="function-signature">getMarketOpenInterest(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.getOrCacheReportingFeeDivisor()"></a><code class="function-signature">getOrCacheReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.getReportingFeeDivisor()"></a><code class="function-signature">getReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaUniverse.setOrigin(contract IUniverse)"></a><code class="function-signature">setOrigin(contract IUniverse _originUniverse)</code><span class="function-visibility">external</span></h4>







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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li><a href="#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li><a href="#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li><a href="#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li><a href="#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="para#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="para#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="para#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="para#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="para#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IShareToken.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#IShareToken.initializeMarket(contract IMarket,uint256,uint256)"><code class="function-signature">initializeMarket(contract IMarket _market, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#IShareToken.unsafeTransferFrom(address,address,uint256,uint256)"><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code></a></li><li><a href="#IShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code></a></li><li><a href="#IShareToken.claimTradingProceeds(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#IShareToken.getMarket(uint256)"><code class="function-signature">getMarket(uint256 _tokenId)</code></a></li><li><a href="#IShareToken.getOutcome(uint256)"><code class="function-signature">getOutcome(uint256 _tokenId)</code></a></li><li><a href="#IShareToken.getTokenId(contract IMarket,uint256)"><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IShareToken.getTokenIds(contract IMarket,uint256[])"><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes)</code></a></li><li><a href="#IShareToken.buyCompleteSets(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#IShareToken.buyCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address)"><code class="function-signature">buyCompleteSetsForTrade(contract IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient)</code></a></li><li><a href="#IShareToken.sellCompleteSets(contract IMarket,address,address,uint256,bytes32)"><code class="function-signature">sellCompleteSets(contract IMarket _market, address _holder, address _recipient, uint256 _amount, bytes32 _fingerprint)</code></a></li><li><a href="#IShareToken.sellCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address,address,address,uint256,address,bytes32)"><code class="function-signature">sellCompleteSetsForTrade(contract IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#IShareToken.totalSupplyForMarketOutcome(contract IMarket,uint256)"><code class="function-signature">totalSupplyForMarketOutcome(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#IShareToken.balanceOfMarketOutcome(contract IMarket,uint256,address)"><code class="function-signature">balanceOfMarketOutcome(contract IMarket _market, uint256 _outcome, address _account)</code></a></li><li><a href="#IShareToken.lowestBalanceOfMarketOutcomes(contract IMarket,uint256[],address)"><code class="function-signature">lowestBalanceOfMarketOutcomes(contract IMarket _market, uint256[] _outcomes, address _account)</code></a></li><li class="inherited"><a href="para#IERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="para#IERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="para#IERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li class="inherited"><a href="para#IERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address owner, address operator)</code></a></li><li class="inherited"><a href="para#IERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address owner, uint256 id)</code></a></li><li class="inherited"><a href="para#IERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li class="inherited"><a href="para#IERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids)</code></a></li><li class="inherited"><a href="para#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="para#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="para#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="para#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="para#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniverse.creationTime()"><code class="function-signature">creationTime()</code></a></li><li><a href="#IUniverse.marketBalance(address)"><code class="function-signature">marketBalance(address)</code></a></li><li><a href="#IUniverse.fork()"><code class="function-signature">fork()</code></a></li><li><a href="#IUniverse.updateForkValues()"><code class="function-signature">updateForkValues()</code></a></li><li><a href="#IUniverse.getParentUniverse()"><code class="function-signature">getParentUniverse()</code></a></li><li><a href="#IUniverse.createChildUniverse(uint256[])"><code class="function-signature">createChildUniverse(uint256[] _parentPayoutNumerators)</code></a></li><li><a href="#IUniverse.getChildUniverse(bytes32)"><code class="function-signature">getChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#IUniverse.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#IUniverse.getForkEndTime()"><code class="function-signature">getForkEndTime()</code></a></li><li><a href="#IUniverse.getForkReputationGoal()"><code class="function-signature">getForkReputationGoal()</code></a></li><li><a href="#IUniverse.getParentPayoutDistributionHash()"><code class="function-signature">getParentPayoutDistributionHash()</code></a></li><li><a href="#IUniverse.getDisputeRoundDurationInSeconds(bool)"><code class="function-signature">getDisputeRoundDurationInSeconds(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateDisputeWindowByTimestamp(uint256,bool)"><code class="function-signature">getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateCurrentDisputeWindow(bool)"><code class="function-signature">getOrCreateCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreateNextDisputeWindow(bool)"><code class="function-signature">getOrCreateNextDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOrCreatePreviousDisputeWindow(bool)"><code class="function-signature">getOrCreatePreviousDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getOpenInterestInAttoCash()"><code class="function-signature">getOpenInterestInAttoCash()</code></a></li><li><a href="#IUniverse.getTargetRepMarketCapInAttoCash()"><code class="function-signature">getTargetRepMarketCapInAttoCash()</code></a></li><li><a href="#IUniverse.getOrCacheValidityBond()"><code class="function-signature">getOrCacheValidityBond()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportStake()"><code class="function-signature">getOrCacheDesignatedReportStake()</code></a></li><li><a href="#IUniverse.getOrCacheDesignatedReportNoShowBond()"><code class="function-signature">getOrCacheDesignatedReportNoShowBond()</code></a></li><li><a href="#IUniverse.getOrCacheMarketRepBond()"><code class="function-signature">getOrCacheMarketRepBond()</code></a></li><li><a href="#IUniverse.getOrCacheReportingFeeDivisor()"><code class="function-signature">getOrCacheReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForFork()"><code class="function-signature">getDisputeThresholdForFork()</code></a></li><li><a href="#IUniverse.getDisputeThresholdForDisputePacing()"><code class="function-signature">getDisputeThresholdForDisputePacing()</code></a></li><li><a href="#IUniverse.getInitialReportMinValue()"><code class="function-signature">getInitialReportMinValue()</code></a></li><li><a href="#IUniverse.getPayoutNumerators()"><code class="function-signature">getPayoutNumerators()</code></a></li><li><a href="#IUniverse.getReportingFeeDivisor()"><code class="function-signature">getReportingFeeDivisor()</code></a></li><li><a href="#IUniverse.getPayoutNumerator(uint256)"><code class="function-signature">getPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IUniverse.getWinningChildPayoutNumerator(uint256)"><code class="function-signature">getWinningChildPayoutNumerator(uint256 _outcome)</code></a></li><li><a href="#IUniverse.isOpenInterestCash(address)"><code class="function-signature">isOpenInterestCash(address)</code></a></li><li><a href="#IUniverse.isForkingMarket()"><code class="function-signature">isForkingMarket()</code></a></li><li><a href="#IUniverse.getCurrentDisputeWindow(bool)"><code class="function-signature">getCurrentDisputeWindow(bool _initial)</code></a></li><li><a href="#IUniverse.getDisputeWindowStartTimeAndDuration(uint256,bool)"><code class="function-signature">getDisputeWindowStartTimeAndDuration(uint256 _timestamp, bool _initial)</code></a></li><li><a href="#IUniverse.isParentOf(contract IUniverse)"><code class="function-signature">isParentOf(contract IUniverse _shadyChild)</code></a></li><li><a href="#IUniverse.updateTentativeWinningChildUniverse(bytes32)"><code class="function-signature">updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash)</code></a></li><li><a href="#IUniverse.isContainerForDisputeWindow(contract IDisputeWindow)"><code class="function-signature">isContainerForDisputeWindow(contract IDisputeWindow _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForMarket(contract IMarket)"><code class="function-signature">isContainerForMarket(contract IMarket _shadyTarget)</code></a></li><li><a href="#IUniverse.isContainerForReportingParticipant(contract IReportingParticipant)"><code class="function-signature">isContainerForReportingParticipant(contract IReportingParticipant _reportingParticipant)</code></a></li><li><a href="#IUniverse.migrateMarketOut(contract IUniverse)"><code class="function-signature">migrateMarketOut(contract IUniverse _destinationUniverse)</code></a></li><li><a href="#IUniverse.migrateMarketIn(contract IMarket,uint256,uint256)"><code class="function-signature">migrateMarketIn(contract IMarket _market, uint256 _cashBalance, uint256 _marketOI)</code></a></li><li><a href="#IUniverse.decrementOpenInterest(uint256)"><code class="function-signature">decrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.decrementOpenInterestFromMarket(contract IMarket)"><code class="function-signature">decrementOpenInterestFromMarket(contract IMarket _market)</code></a></li><li><a href="#IUniverse.incrementOpenInterest(uint256)"><code class="function-signature">incrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#IUniverse.getWinningChildUniverse()"><code class="function-signature">getWinningChildUniverse()</code></a></li><li><a href="#IUniverse.isForking()"><code class="function-signature">isForking()</code></a></li><li><a href="#IUniverse.deposit(address,uint256,address)"><code class="function-signature">deposit(address _sender, uint256 _amount, address _market)</code></a></li><li><a href="#IUniverse.withdraw(address,uint256,address)"><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market)</code></a></li><li><a href="#IUniverse.pokeRepMarketCapInAttoCash()"><code class="function-signature">pokeRepMarketCapInAttoCash()</code></a></li><li><a href="#IUniverse.createScalarMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,int256[],uint256,string)"><code class="function-signature">createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] _prices, uint256 _numTicks, string _extraInfo)</code></a></li><li><a href="#IUniverse.createYesNoMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,string)"><code class="function-signature">createYesNoMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, string _extraInfo)</code></a></li><li><a href="#IUniverse.createCategoricalMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,bytes32[],string)"><code class="function-signature">createCategoricalMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32[] _outcomes, string _extraInfo)</code></a></li><li><a href="#IUniverse.runPeriodicals()"><code class="function-signature">runPeriodicals()</code></a></li></ul></div>



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





<h4><a class="anchor" aria-hidden="true" id="IUniverse.pokeRepMarketCapInAttoCash()"></a><code class="function-signature">pokeRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.createScalarMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,int256[],uint256,string)"></a><code class="function-signature">createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] _prices, uint256 _numTicks, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.createYesNoMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,string)"></a><code class="function-signature">createYesNoMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.createCategoricalMarket(uint256,uint256,contract IAffiliateValidator,uint256,address,bytes32[],string)"></a><code class="function-signature">createCategoricalMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, contract IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32[] _outcomes, string _extraInfo) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniverse.runPeriodicals()"></a><code class="function-signature">runPeriodicals() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `IV2ReputationToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IV2ReputationToken.parentUniverse()"><code class="function-signature">parentUniverse()</code></a></li><li><a href="#IV2ReputationToken.burnForMarket(uint256)"><code class="function-signature">burnForMarket(uint256 _amountToBurn)</code></a></li><li><a href="#IV2ReputationToken.mintForWarpSync(uint256,address)"><code class="function-signature">mintForWarpSync(uint256 _amountToMint, address _target)</code></a></li><li><a href="#IV2ReputationToken.getLegacyRepToken()"><code class="function-signature">getLegacyRepToken()</code></a></li><li><a href="#IV2ReputationToken.symbol()"><code class="function-signature">symbol()</code></a></li><li class="inherited"><a href="para#IReputationToken.migrateOutByPayout(uint256[],uint256)"><code class="function-signature">migrateOutByPayout(uint256[] _payoutNumerators, uint256 _attotokens)</code></a></li><li class="inherited"><a href="para#IReputationToken.migrateIn(address,uint256)"><code class="function-signature">migrateIn(address _reporter, uint256 _attotokens)</code></a></li><li class="inherited"><a href="para#IReputationToken.trustedReportingParticipantTransfer(address,address,uint256)"><code class="function-signature">trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="para#IReputationToken.trustedMarketTransfer(address,address,uint256)"><code class="function-signature">trustedMarketTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="para#IReputationToken.trustedUniverseTransfer(address,address,uint256)"><code class="function-signature">trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="para#IReputationToken.trustedDisputeWindowTransfer(address,address,uint256)"><code class="function-signature">trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens)</code></a></li><li class="inherited"><a href="para#IReputationToken.getUniverse()"><code class="function-signature">getUniverse()</code></a></li><li class="inherited"><a href="para#IReputationToken.getTotalMigrated()"><code class="function-signature">getTotalMigrated()</code></a></li><li class="inherited"><a href="para#IReputationToken.getTotalTheoreticalSupply()"><code class="function-signature">getTotalTheoreticalSupply()</code></a></li><li class="inherited"><a href="para#IReputationToken.mintForReportingParticipant(uint256)"><code class="function-signature">mintForReportingParticipant(uint256 _amountMigrated)</code></a></li><li class="inherited"><a href="para#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="para#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="para#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="para#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="para#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="para#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.parentUniverse()"></a><code class="function-signature">parentUniverse() <span class="return-arrow">→</span> <span class="return-type">contract IUniverse</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.burnForMarket(uint256)"></a><code class="function-signature">burnForMarket(uint256 _amountToBurn) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.mintForWarpSync(uint256,address)"></a><code class="function-signature">mintForWarpSync(uint256 _amountToMint, address _target) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.getLegacyRepToken()"></a><code class="function-signature">getLegacyRepToken() <span class="return-arrow">→</span> <span class="return-type">contract IERC20</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IV2ReputationToken.symbol()"></a><code class="function-signature">symbol() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">public</span></h4>







### `Order`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Order.create(contract IAugur,contract IAugurTrading,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32)"><code class="function-signature">create(contract IAugur _augur, contract IAugurTrading _augurTrading, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId)</code></a></li><li><a href="#Order.getOrderId(struct Order.Data,contract IOrders)"><code class="function-signature">getOrderId(struct Order.Data _orderData, contract IOrders _orders)</code></a></li><li><a href="#Order.calculateOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256)"><code class="function-signature">calculateOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed)</code></a></li><li><a href="#Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection)</code></a></li><li><a href="#Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection)</code></a></li><li><a href="#Order.saveOrder(struct Order.Data,bytes32,contract IOrders)"><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId, contract IOrders _orders)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Order.create(contract IAugur,contract IAugurTrading,address,uint256,enum Order.Types,uint256,uint256,contract IMarket,bytes32,bytes32)"></a><code class="function-signature">create(contract IAugur _augur, contract IAugurTrading _augurTrading, address _creator, uint256 _outcome, enum Order.Types _type, uint256 _attoshares, uint256 _price, contract IMarket _market, bytes32 _betterOrderId, bytes32 _worseOrderId) <span class="return-arrow">→</span> <span class="return-type">struct Order.Data</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderId(struct Order.Data,contract IOrders)"></a><code class="function-signature">getOrderId(struct Order.Data _orderData, contract IOrders _orders) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.calculateOrderId(enum Order.Types,contract IMarket,uint256,uint256,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calculateOrderId(enum Order.Types _type, contract IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _blockNumber, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromMakerDirection(enum Order.TradeDirections _creatorDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections)"></a><code class="function-signature">getOrderTradingTypeFromFillerDirection(enum Order.TradeDirections _fillerDirection) <span class="return-arrow">→</span> <span class="return-type">enum Order.Types</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Order.saveOrder(struct Order.Data,bytes32,contract IOrders)"></a><code class="function-signature">saveOrder(struct Order.Data _orderData, bytes32 _tradeGroupId, contract IOrders _orders) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>







### `SafeMathInt256`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMathInt256.mul(int256,int256)"><code class="function-signature">mul(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.div(int256,int256)"><code class="function-signature">div(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.sub(int256,int256)"><code class="function-signature">sub(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.add(int256,int256)"><code class="function-signature">add(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.min(int256,int256)"><code class="function-signature">min(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.max(int256,int256)"><code class="function-signature">max(int256 a, int256 b)</code></a></li><li><a href="#SafeMathInt256.abs(int256)"><code class="function-signature">abs(int256 a)</code></a></li><li><a href="#SafeMathInt256.getInt256Min()"><code class="function-signature">getInt256Min()</code></a></li><li><a href="#SafeMathInt256.getInt256Max()"><code class="function-signature">getInt256Max()</code></a></li><li><a href="#SafeMathInt256.fxpMul(int256,int256,int256)"><code class="function-signature">fxpMul(int256 a, int256 b, int256 base)</code></a></li><li><a href="#SafeMathInt256.fxpDiv(int256,int256,int256)"><code class="function-signature">fxpDiv(int256 a, int256 b, int256 base)</code></a></li><li><a href="#SafeMathInt256.sqrt(int256)"><code class="function-signature">sqrt(int256 y)</code></a></li></ul></div>



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





<h4><a class="anchor" aria-hidden="true" id="SafeMathInt256.sqrt(int256)"></a><code class="function-signature">sqrt(int256 y) <span class="return-arrow">→</span> <span class="return-type">int256</span></code><span class="function-visibility">internal</span></h4>







### `SafeMathUint256`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMathUint256.mul(uint256,uint256)"><code class="function-signature">mul(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.div(uint256,uint256)"><code class="function-signature">div(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.sub(uint256,uint256)"><code class="function-signature">sub(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.subS(uint256,uint256,string)"><code class="function-signature">subS(uint256 a, uint256 b, string message)</code></a></li><li><a href="#SafeMathUint256.add(uint256,uint256)"><code class="function-signature">add(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.min(uint256,uint256)"><code class="function-signature">min(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.max(uint256,uint256)"><code class="function-signature">max(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.sqrt(uint256)"><code class="function-signature">sqrt(uint256 y)</code></a></li><li><a href="#SafeMathUint256.getUint256Min()"><code class="function-signature">getUint256Min()</code></a></li><li><a href="#SafeMathUint256.getUint256Max()"><code class="function-signature">getUint256Max()</code></a></li><li><a href="#SafeMathUint256.isMultipleOf(uint256,uint256)"><code class="function-signature">isMultipleOf(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.fxpMul(uint256,uint256,uint256)"><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base)</code></a></li><li><a href="#SafeMathUint256.fxpDiv(uint256,uint256,uint256)"><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.mul(uint256,uint256)"></a><code class="function-signature">mul(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.div(uint256,uint256)"></a><code class="function-signature">div(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.subS(uint256,uint256,string)"></a><code class="function-signature">subS(uint256 a, uint256 b, string message) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.add(uint256,uint256)"></a><code class="function-signature">add(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.min(uint256,uint256)"></a><code class="function-signature">min(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.max(uint256,uint256)"></a><code class="function-signature">max(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.sqrt(uint256)"></a><code class="function-signature">sqrt(uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Min()"></a><code class="function-signature">getUint256Min() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Max()"></a><code class="function-signature">getUint256Max() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.isMultipleOf(uint256,uint256)"></a><code class="function-signature">isMultipleOf(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpMul(uint256,uint256,uint256)"></a><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpDiv(uint256,uint256,uint256)"></a><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `AMMFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#AMMFactory.constructor(address,uint256)"><code class="function-signature">constructor(address _proxyToClone, uint256 _fee)</code></a></li><li><a href="#AMMFactory.addAMM(contract IMarket,contract IParaShareToken)"><code class="function-signature">addAMM(contract IMarket _market, contract IParaShareToken _para)</code></a></li><li><a href="#AMMFactory.addAMMWithLiquidity(contract IMarket,contract IParaShareToken,uint256,uint256,bool)"><code class="function-signature">addAMMWithLiquidity(contract IMarket _market, contract IParaShareToken _para, uint256 _cash, uint256 _ratioFactor, bool _keepYes)</code></a></li><li><a href="#AMMFactory.salt(contract IMarket,contract IParaShareToken)"><code class="function-signature">salt(contract IMarket _market, contract IParaShareToken _para)</code></a></li><li><a href="#AMMFactory.transferCash(contract IMarket,contract IParaShareToken,address,address,uint256)"><code class="function-signature">transferCash(contract IMarket _market, contract IParaShareToken _para, address sender, address recipient, uint256 quantity)</code></a></li><li><a href="#AMMFactory.calculateAMMAddress(contract IMarket,contract IParaShareToken)"><code class="function-signature">calculateAMMAddress(contract IMarket _market, contract IParaShareToken _para)</code></a></li><li class="inherited"><a href="para#CloneFactory2.createClone2(address,uint256)"><code class="function-signature">createClone2(address target, uint256 salt)</code></a></li><li class="inherited"><a href="para#CloneFactory2.clone2Address(address,uint256,address)"><code class="function-signature">clone2Address(address target, uint256 salt, address creator)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="AMMFactory.constructor(address,uint256)"></a><code class="function-signature">constructor(address _proxyToClone, uint256 _fee)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMFactory.addAMM(contract IMarket,contract IParaShareToken)"></a><code class="function-signature">addAMM(contract IMarket _market, contract IParaShareToken _para) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMFactory.addAMMWithLiquidity(contract IMarket,contract IParaShareToken,uint256,uint256,bool)"></a><code class="function-signature">addAMMWithLiquidity(contract IMarket _market, contract IParaShareToken _para, uint256 _cash, uint256 _ratioFactor, bool _keepYes) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMFactory.salt(contract IMarket,contract IParaShareToken)"></a><code class="function-signature">salt(contract IMarket _market, contract IParaShareToken _para) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMFactory.transferCash(contract IMarket,contract IParaShareToken,address,address,uint256)"></a><code class="function-signature">transferCash(contract IMarket _market, contract IParaShareToken _para, address sender, address recipient, uint256 quantity)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AMMFactory.calculateAMMAddress(contract IMarket,contract IParaShareToken)"></a><code class="function-signature">calculateAMMAddress(contract IMarket _market, contract IParaShareToken _para) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `CloneFactory2`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#CloneFactory2.createClone2(address,uint256)"><code class="function-signature">createClone2(address target, uint256 salt)</code></a></li><li><a href="#CloneFactory2.clone2Address(address,uint256,address)"><code class="function-signature">clone2Address(address target, uint256 salt, address creator)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="CloneFactory2.createClone2(address,uint256)"></a><code class="function-signature">createClone2(address target, uint256 salt) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="CloneFactory2.clone2Address(address,uint256,address)"></a><code class="function-signature">clone2Address(address target, uint256 salt, address creator) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `FeePot`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#FeePot.initialize(contract IParaAugur,contract IParaUniverse)"><code class="function-signature">initialize(contract IParaAugur _augur, contract IParaUniverse _paraUniverse)</code></a></li><li><a href="#FeePot.symbol()"><code class="function-signature">symbol()</code></a></li><li><a href="#FeePot.depositFees(uint256)"><code class="function-signature">depositFees(uint256 _amount)</code></a></li><li><a href="#FeePot.withdrawableFeesOf(address)"><code class="function-signature">withdrawableFeesOf(address _owner)</code></a></li><li><a href="#FeePot.earnedFeesOf(address)"><code class="function-signature">earnedFeesOf(address _owner)</code></a></li><li><a href="#FeePot._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#FeePot.stake(uint256)"><code class="function-signature">stake(uint256 _amount)</code></a></li><li><a href="#FeePot.exit(uint256)"><code class="function-signature">exit(uint256 _amount)</code></a></li><li><a href="#FeePot.redeem()"><code class="function-signature">redeem()</code></a></li><li><a href="#FeePot.redeemInternal(address)"><code class="function-signature">redeemInternal(address _account)</code></a></li><li><a href="#FeePot.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="#IFeePot.cash()"><code class="function-signature">cash()</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li><li class="inherited"><a href="para#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="para#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="para#VariableSupplyToken.onMint(address,uint256)"><code class="function-signature">onMint(address, uint256)</code></a></li><li class="inherited"><a href="para#VariableSupplyToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address, uint256)</code></a></li><li class="inherited"><a href="para#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="para#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="para#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="para#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="para#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="FeePot.initialize(contract IParaAugur,contract IParaUniverse)"></a><code class="function-signature">initialize(contract IParaAugur _augur, contract IParaUniverse _paraUniverse)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot.symbol()"></a><code class="function-signature">symbol() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot.depositFees(uint256)"></a><code class="function-signature">depositFees(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot.withdrawableFeesOf(address)"></a><code class="function-signature">withdrawableFeesOf(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot.earnedFeesOf(address)"></a><code class="function-signature">earnedFeesOf(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot._transfer(address,address,uint256)"></a><code class="function-signature">_transfer(address _from, address _to, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot.stake(uint256)"></a><code class="function-signature">stake(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot.exit(uint256)"></a><code class="function-signature">exit(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot.redeem()"></a><code class="function-signature">redeem() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot.redeemInternal(address)"></a><code class="function-signature">redeemInternal(address _account)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePot.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>







### `IOINexus`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOINexus.getAttoCashPerRep(address,address)"><code class="function-signature">getAttoCashPerRep(address _cash, address _reputationToken)</code></a></li><li><a href="#IOINexus.universeReportingFeeDivisor(address)"><code class="function-signature">universeReportingFeeDivisor(address _universe)</code></a></li><li><a href="#IOINexus.addParaAugur(address)"><code class="function-signature">addParaAugur(address _paraAugur)</code></a></li><li><a href="#IOINexus.registerParaUniverse(contract IUniverse,contract IParaUniverse)"><code class="function-signature">registerParaUniverse(contract IUniverse _universe, contract IParaUniverse _paraUniverse)</code></a></li><li><a href="#IOINexus.recordParaUniverseValuesAndUpdateReportingFee(contract IUniverse,uint256,uint256)"><code class="function-signature">recordParaUniverseValuesAndUpdateReportingFee(contract IUniverse _universe, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOINexus.getAttoCashPerRep(address,address)"></a><code class="function-signature">getAttoCashPerRep(address _cash, address _reputationToken) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOINexus.universeReportingFeeDivisor(address)"></a><code class="function-signature">universeReportingFeeDivisor(address _universe) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOINexus.addParaAugur(address)"></a><code class="function-signature">addParaAugur(address _paraAugur) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOINexus.registerParaUniverse(contract IUniverse,contract IParaUniverse)"></a><code class="function-signature">registerParaUniverse(contract IUniverse _universe, contract IParaUniverse _paraUniverse)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOINexus.recordParaUniverseValuesAndUpdateReportingFee(contract IUniverse,uint256,uint256)"></a><code class="function-signature">recordParaUniverseValuesAndUpdateReportingFee(contract IUniverse _universe, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







### `IParaAugur`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaAugur.generateParaUniverse(contract IUniverse)"><code class="function-signature">generateParaUniverse(contract IUniverse _universe)</code></a></li><li><a href="#IParaAugur.registerContract(bytes32,address)"><code class="function-signature">registerContract(bytes32 _key, address _address)</code></a></li><li><a href="#IParaAugur.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#IParaAugur.isKnownUniverse(contract IUniverse)"><code class="function-signature">isKnownUniverse(contract IUniverse _universe)</code></a></li><li><a href="#IParaAugur.trustedCashTransfer(address,address,uint256)"><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#IParaAugur.isKnownMarket(contract IMarket)"><code class="function-signature">isKnownMarket(contract IMarket _market)</code></a></li><li><a href="#IParaAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets)</code></a></li><li><a href="#IParaAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees)</code></a></li><li><a href="#IParaAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#IParaAugur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees)</code></a></li><li><a href="#IParaAugur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance)</code></a></li><li><a href="#IParaAugur.logReportingFeeChanged(uint256)"><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee)</code></a></li><li><a href="#IParaAugur.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaAugur.generateParaUniverse(contract IUniverse)"></a><code class="function-signature">generateParaUniverse(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">contract IParaUniverse</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.registerContract(bytes32,address)"></a><code class="function-signature">registerContract(bytes32 _key, address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.isKnownUniverse(contract IUniverse)"></a><code class="function-signature">isKnownUniverse(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.trustedCashTransfer(address,address,uint256)"></a><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.isKnownMarket(contract IMarket)"></a><code class="function-signature">isKnownMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"></a><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"></a><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"></a><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"></a><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.logReportingFeeChanged(uint256)"></a><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugur.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `Initializable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Initializable.endInitialization()"></a><code class="function-signature">endInitialization()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Initializable.getInitialized()"></a><code class="function-signature">getInitialized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `VariableSupplyToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.onMint(address,uint256)"><code class="function-signature">onMint(address, uint256)</code></a></li><li><a href="#VariableSupplyToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address, uint256)</code></a></li><li class="inherited"><a href="para#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="para#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="para#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="para#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="para#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC20.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.mint(address,uint256)"></a><code class="function-signature">mint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.burn(address,uint256)"></a><code class="function-signature">burn(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onMint(address,uint256)"></a><code class="function-signature">onMint(address, uint256)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address, uint256)</code><span class="function-visibility">internal</span></h4>







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





### `OINexus`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#OINexus.constructor(address,address)"><code class="function-signature">constructor(address _weth, address _uniswapFactory)</code></a></li><li><a href="#OINexus.addParaAugur(address)"><code class="function-signature">addParaAugur(address _paraAugur)</code></a></li><li><a href="#OINexus.registerParaUniverse(contract IUniverse,contract IParaUniverse)"><code class="function-signature">registerParaUniverse(contract IUniverse _universe, contract IParaUniverse _paraUniverse)</code></a></li><li><a href="#OINexus.recordParaUniverseValuesAndUpdateReportingFee(contract IUniverse,uint256,uint256)"><code class="function-signature">recordParaUniverseValuesAndUpdateReportingFee(contract IUniverse _universe, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash)</code></a></li><li><a href="#OINexus.applyReportingFeeChanges(contract IUniverse,contract IParaUniverse,uint256,uint256,bool)"><code class="function-signature">applyReportingFeeChanges(contract IUniverse _universe, contract IParaUniverse _paraUniverse, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash, bool recalculate)</code></a></li><li><a href="#OINexus.getAttoCashPerRep(address,address)"><code class="function-signature">getAttoCashPerRep(address _cash, address _reputationToken)</code></a></li><li><a href="#OINexus.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li class="inherited"><a href="#IOINexus.universeReportingFeeDivisor(address)"><code class="function-signature">universeReportingFeeDivisor(address _universe)</code></a></li><li class="inherited"><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="OINexus.constructor(address,address)"></a><code class="function-signature">constructor(address _weth, address _uniswapFactory)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OINexus.addParaAugur(address)"></a><code class="function-signature">addParaAugur(address _paraAugur) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OINexus.registerParaUniverse(contract IUniverse,contract IParaUniverse)"></a><code class="function-signature">registerParaUniverse(contract IUniverse _universe, contract IParaUniverse _paraUniverse)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OINexus.recordParaUniverseValuesAndUpdateReportingFee(contract IUniverse,uint256,uint256)"></a><code class="function-signature">recordParaUniverseValuesAndUpdateReportingFee(contract IUniverse _universe, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OINexus.applyReportingFeeChanges(contract IUniverse,contract IParaUniverse,uint256,uint256,bool)"></a><code class="function-signature">applyReportingFeeChanges(contract IUniverse _universe, contract IParaUniverse _paraUniverse, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash, bool recalculate) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OINexus.getAttoCashPerRep(address,address)"></a><code class="function-signature">getAttoCashPerRep(address _cash, address _reputationToken) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OINexus.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







### `Ownable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li><a href="#Ownable.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Ownable.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>

The Ownable constructor sets the original `owner` of the contract to the sender
account.



<h4><a class="anchor" aria-hidden="true" id="Ownable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Ownable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Allows the current owner to transfer control of the contract to a newOwner.




<h4><a class="anchor" aria-hidden="true" id="Ownable.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







### `ParaOracle`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ParaOracle.constructor(address,address)"><code class="function-signature">constructor(address _weth, address _uniswapFactory)</code></a></li><li><a href="#ParaOracle.poke(address)"><code class="function-signature">poke(address _token)</code></a></li><li><a href="#ParaOracle.getExchange(address)"><code class="function-signature">getExchange(address _token)</code></a></li><li><a href="#ParaOracle.getLastUpdateTimestamp(address)"><code class="function-signature">getLastUpdateTimestamp(address _token)</code></a></li><li><a href="#ParaOracle.getPriceCumulativeLast(address)"><code class="function-signature">getPriceCumulativeLast(address _token)</code></a></li><li><a href="#ParaOracle.getPrice(address)"><code class="function-signature">getPrice(address _token)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ParaOracle.constructor(address,address)"></a><code class="function-signature">constructor(address _weth, address _uniswapFactory)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOracle.poke(address)"></a><code class="function-signature">poke(address _token) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOracle.getExchange(address)"></a><code class="function-signature">getExchange(address _token) <span class="return-arrow">→</span> <span class="return-type">contract IUniswapV2Pair</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOracle.getLastUpdateTimestamp(address)"></a><code class="function-signature">getLastUpdateTimestamp(address _token) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOracle.getPriceCumulativeLast(address)"></a><code class="function-signature">getPriceCumulativeLast(address _token) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOracle.getPrice(address)"></a><code class="function-signature">getPrice(address _token) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







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







### `UQ112x112`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#UQ112x112.encode(uint112)"><code class="function-signature">encode(uint112 y)</code></a></li><li><a href="#UQ112x112.uqdiv(uint224,uint112)"><code class="function-signature">uqdiv(uint224 x, uint112 y)</code></a></li><li><a href="#UQ112x112.uqmul(uint224,uint256)"><code class="function-signature">uqmul(uint224 x, uint256 y)</code></a></li><li><a href="#UQ112x112.decode(uint256)"><code class="function-signature">decode(uint256 y)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="UQ112x112.encode(uint112)"></a><code class="function-signature">encode(uint112 y) <span class="return-arrow">→</span> <span class="return-type">uint224</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UQ112x112.uqdiv(uint224,uint112)"></a><code class="function-signature">uqdiv(uint224 x, uint112 y) <span class="return-arrow">→</span> <span class="return-type">uint224</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UQ112x112.uqmul(uint224,uint256)"></a><code class="function-signature">uqmul(uint224 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UQ112x112.decode(uint256)"></a><code class="function-signature">decode(uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `ContractExists`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ContractExists.exists(address)"><code class="function-signature">exists(address _address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ContractExists.exists(address)"></a><code class="function-signature">exists(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `IAugurCreationDataGetter`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugurCreationDataGetter.getMarketCreationData(contract IMarket)"><code class="function-signature">getMarketCreationData(contract IMarket _market)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAugurCreationDataGetter.getMarketCreationData(contract IMarket)"></a><code class="function-signature">getMarketCreationData(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">struct IAugurCreationDataGetter.MarketCreationData</span></code><span class="function-visibility">public</span></h4>







### `IAugurMarketDataGetter`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAugurMarketDataGetter.getMarketType(contract IMarket)"><code class="function-signature">getMarketType(contract IMarket _market)</code></a></li><li><a href="#IAugurMarketDataGetter.getMarketOutcomes(contract IMarket)"><code class="function-signature">getMarketOutcomes(contract IMarket _market)</code></a></li><li><a href="#IAugurMarketDataGetter.getMarketRecommendedTradeInterval(contract IMarket)"><code class="function-signature">getMarketRecommendedTradeInterval(contract IMarket _market)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAugurMarketDataGetter.getMarketType(contract IMarket)"></a><code class="function-signature">getMarketType(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">enum IMarket.MarketType</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurMarketDataGetter.getMarketOutcomes(contract IMarket)"></a><code class="function-signature">getMarketOutcomes(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bytes32[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAugurMarketDataGetter.getMarketRecommendedTradeInterval(contract IMarket)"></a><code class="function-signature">getMarketRecommendedTradeInterval(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IParaUniverseFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaUniverseFactory.createParaUniverse(contract IParaAugur,contract IUniverse)"><code class="function-signature">createParaUniverse(contract IParaAugur _paraAugur, contract IUniverse _originUniverse)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaUniverseFactory.createParaUniverse(contract IParaAugur,contract IUniverse)"></a><code class="function-signature">createParaUniverse(contract IParaAugur _paraAugur, contract IUniverse _originUniverse) <span class="return-arrow">→</span> <span class="return-type">contract IParaUniverse</span></code><span class="function-visibility">external</span></h4>







### `ParaAugur`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ParaAugur.constructor(contract IAugur,uint256)"><code class="function-signature">constructor(contract IAugur _augur, uint256 _tradeIntervalModifier)</code></a></li><li><a href="#ParaAugur.registerContract(bytes32,address)"><code class="function-signature">registerContract(bytes32 _key, address _address)</code></a></li><li><a href="#ParaAugur.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#ParaAugur.finishDeployment()"><code class="function-signature">finishDeployment()</code></a></li><li><a href="#ParaAugur.genesisUniverse()"><code class="function-signature">genesisUniverse()</code></a></li><li><a href="#ParaAugur.isKnownUniverse(contract IUniverse)"><code class="function-signature">isKnownUniverse(contract IUniverse _universe)</code></a></li><li><a href="#ParaAugur.generateParaUniverse(contract IUniverse)"><code class="function-signature">generateParaUniverse(contract IUniverse _universe)</code></a></li><li><a href="#ParaAugur.isKnownParaUniverse(contract IParaUniverse)"><code class="function-signature">isKnownParaUniverse(contract IParaUniverse _universe)</code></a></li><li><a href="#ParaAugur.trustedCashTransfer(address,address,uint256)"><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#ParaAugur.isKnownMarket(contract IMarket)"><code class="function-signature">isKnownMarket(contract IMarket _market)</code></a></li><li><a href="#ParaAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets)</code></a></li><li><a href="#ParaAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees)</code></a></li><li><a href="#ParaAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market)</code></a></li><li><a href="#ParaAugur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees)</code></a></li><li><a href="#ParaAugur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance)</code></a></li><li><a href="#ParaAugur.logReportingFeeChanged(uint256)"><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee)</code></a></li><li><a href="#ParaAugur.getTimestamp()"><code class="function-signature">getTimestamp()</code></a></li><li><a href="#ParaAugur.getMarketRecommendedTradeInterval(contract IMarket)"><code class="function-signature">getMarketRecommendedTradeInterval(contract IMarket _market)</code></a></li><li><a href="#ParaAugur.getMarketCreationData(contract IMarket)"><code class="function-signature">getMarketCreationData(contract IMarket _market)</code></a></li><li><a href="#ParaAugur.getMaximumMarketEndDate()"><code class="function-signature">getMaximumMarketEndDate()</code></a></li><li><a href="#ParaAugur.getUniverseForkIndex(contract IUniverse)"><code class="function-signature">getUniverseForkIndex(contract IUniverse _universe)</code></a></li><li><a href="#ParaAugur.isKnownFeeSender(address)"><code class="function-signature">isKnownFeeSender(address _feeSender)</code></a></li><li><a href="#ParaAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 _numOutcomes)</code></a></li><li><a href="#ParaAugur.getMarketType(contract IMarket)"><code class="function-signature">getMarketType(contract IMarket _market)</code></a></li><li><a href="#ParaAugur.getMarketOutcomes(contract IMarket)"><code class="function-signature">getMarketOutcomes(contract IMarket _market)</code></a></li><li><a href="#ParaAugur.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li><a href="#ParaAugur.getOriginCash()"><code class="function-signature">getOriginCash()</code></a></li><li class="inherited"><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ParaAugur.CompleteSetsPurchased(address,address,address,uint256,uint256,address)"><code class="function-signature">CompleteSetsPurchased(address universe, address market, address account, uint256 numCompleteSets, uint256 timestamp, address para)</code></a></li><li><a href="#ParaAugur.CompleteSetsSold(address,address,address,uint256,uint256,uint256,address)"><code class="function-signature">CompleteSetsSold(address universe, address market, address account, uint256 numCompleteSets, uint256 fees, uint256 timestamp, address para)</code></a></li><li><a href="#ParaAugur.TradingProceedsClaimed(address,address,address,uint256,uint256,uint256,uint256,uint256,address)"><code class="function-signature">TradingProceedsClaimed(address universe, address sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 fees, uint256 timestamp, address para)</code></a></li><li><a href="#ParaAugur.MarketOIChanged(address,address,uint256,address)"><code class="function-signature">MarketOIChanged(address universe, address market, uint256 marketOI, address para)</code></a></li><li><a href="#ParaAugur.ReportingFeeChanged(address,uint256,address)"><code class="function-signature">ReportingFeeChanged(address universe, uint256 reportingFee, address para)</code></a></li><li><a href="#ParaAugur.ShareTokenBalanceChanged(address,address,address,uint256,uint256,address)"><code class="function-signature">ShareTokenBalanceChanged(address universe, address account, address market, uint256 outcome, uint256 balance, address para)</code></a></li><li><a href="#ParaAugur.RegisterContract(address,bytes32)"><code class="function-signature">RegisterContract(address contractAddress, bytes32 key)</code></a></li><li><a href="#ParaAugur.FinishDeployment()"><code class="function-signature">FinishDeployment()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ParaAugur.constructor(contract IAugur,uint256)"></a><code class="function-signature">constructor(contract IAugur _augur, uint256 _tradeIntervalModifier)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.registerContract(bytes32,address)"></a><code class="function-signature">registerContract(bytes32 _key, address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.finishDeployment()"></a><code class="function-signature">finishDeployment() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.genesisUniverse()"></a><code class="function-signature">genesisUniverse() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.isKnownUniverse(contract IUniverse)"></a><code class="function-signature">isKnownUniverse(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.generateParaUniverse(contract IUniverse)"></a><code class="function-signature">generateParaUniverse(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">contract IParaUniverse</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.isKnownParaUniverse(contract IParaUniverse)"></a><code class="function-signature">isKnownParaUniverse(contract IParaUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.trustedCashTransfer(address,address,uint256)"></a><code class="function-signature">trustedCashTransfer(address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.isKnownMarket(contract IMarket)"></a><code class="function-signature">isKnownMarket(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.logCompleteSetsPurchased(contract IUniverse,contract IMarket,address,uint256)"></a><code class="function-signature">logCompleteSetsPurchased(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.logCompleteSetsSold(contract IUniverse,contract IMarket,address,uint256,uint256)"></a><code class="function-signature">logCompleteSetsSold(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.logMarketOIChanged(contract IUniverse,contract IMarket)"></a><code class="function-signature">logMarketOIChanged(contract IUniverse _universe, contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.logTradingProceedsClaimed(contract IUniverse,address,address,uint256,uint256,uint256,uint256)"></a><code class="function-signature">logTradingProceedsClaimed(contract IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.logShareTokensBalanceChanged(address,contract IMarket,uint256,uint256)"></a><code class="function-signature">logShareTokensBalanceChanged(address _account, contract IMarket _market, uint256 _outcome, uint256 _balance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.logReportingFeeChanged(uint256)"></a><code class="function-signature">logReportingFeeChanged(uint256 _reportingFee) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.getTimestamp()"></a><code class="function-signature">getTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.getMarketRecommendedTradeInterval(contract IMarket)"></a><code class="function-signature">getMarketRecommendedTradeInterval(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.getMarketCreationData(contract IMarket)"></a><code class="function-signature">getMarketCreationData(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">struct IAugurCreationDataGetter.MarketCreationData</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.getMaximumMarketEndDate()"></a><code class="function-signature">getMaximumMarketEndDate() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.getUniverseForkIndex(contract IUniverse)"></a><code class="function-signature">getUniverseForkIndex(contract IUniverse _universe) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.isKnownFeeSender(address)"></a><code class="function-signature">isKnownFeeSender(address _feeSender) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.derivePayoutDistributionHash(uint256[],uint256,uint256)"></a><code class="function-signature">derivePayoutDistributionHash(uint256[] _payoutNumerators, uint256 _numTicks, uint256 _numOutcomes) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.getMarketType(contract IMarket)"></a><code class="function-signature">getMarketType(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">enum IMarket.MarketType</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.getMarketOutcomes(contract IMarket)"></a><code class="function-signature">getMarketOutcomes(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bytes32[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.getOriginCash()"></a><code class="function-signature">getOriginCash() <span class="return-arrow">→</span> <span class="return-type">contract ICash</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="ParaAugur.CompleteSetsPurchased(address,address,address,uint256,uint256,address)"></a><code class="function-signature">CompleteSetsPurchased(address universe, address market, address account, uint256 numCompleteSets, uint256 timestamp, address para)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.CompleteSetsSold(address,address,address,uint256,uint256,uint256,address)"></a><code class="function-signature">CompleteSetsSold(address universe, address market, address account, uint256 numCompleteSets, uint256 fees, uint256 timestamp, address para)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.TradingProceedsClaimed(address,address,address,uint256,uint256,uint256,uint256,uint256,address)"></a><code class="function-signature">TradingProceedsClaimed(address universe, address sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 fees, uint256 timestamp, address para)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.MarketOIChanged(address,address,uint256,address)"></a><code class="function-signature">MarketOIChanged(address universe, address market, uint256 marketOI, address para)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.ReportingFeeChanged(address,uint256,address)"></a><code class="function-signature">ReportingFeeChanged(address universe, uint256 reportingFee, address para)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.ShareTokenBalanceChanged(address,address,address,uint256,uint256,address)"></a><code class="function-signature">ShareTokenBalanceChanged(address universe, address account, address market, uint256 outcome, uint256 balance, address para)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.RegisterContract(address,bytes32)"></a><code class="function-signature">RegisterContract(address contractAddress, bytes32 key)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugur.FinishDeployment()"></a><code class="function-signature">FinishDeployment()</code><span class="function-visibility"></span></h4>





### `IProfitLoss`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IProfitLoss.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#IProfitLoss.recordFrozenFundChange(contract IUniverse,contract IMarket,address,uint256,int256)"><code class="function-signature">recordFrozenFundChange(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _outcome, int256 _frozenFundDelta)</code></a></li><li><a href="#IProfitLoss.adjustTraderProfitForFees(contract IMarket,address,uint256,uint256)"><code class="function-signature">adjustTraderProfitForFees(contract IMarket _market, address _trader, uint256 _outcome, uint256 _fees)</code></a></li><li><a href="#IProfitLoss.recordTrade(contract IUniverse,contract IMarket,address,address,uint256,int256,int256,uint256,uint256,uint256,uint256)"><code class="function-signature">recordTrade(contract IUniverse _universe, contract IMarket _market, address _longAddress, address _shortAddress, uint256 _outcome, int256 _amount, int256 _price, uint256 _numLongTokens, uint256 _numShortTokens, uint256 _numLongShares, uint256 _numShortShares)</code></a></li><li><a href="#IProfitLoss.recordClaim(contract IMarket,address,uint256[])"><code class="function-signature">recordClaim(contract IMarket _market, address _account, uint256[] _outcomeFees)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.recordFrozenFundChange(contract IUniverse,contract IMarket,address,uint256,int256)"></a><code class="function-signature">recordFrozenFundChange(contract IUniverse _universe, contract IMarket _market, address _account, uint256 _outcome, int256 _frozenFundDelta) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.adjustTraderProfitForFees(contract IMarket,address,uint256,uint256)"></a><code class="function-signature">adjustTraderProfitForFees(contract IMarket _market, address _trader, uint256 _outcome, uint256 _fees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.recordTrade(contract IUniverse,contract IMarket,address,address,uint256,int256,int256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">recordTrade(contract IUniverse _universe, contract IMarket _market, address _longAddress, address _shortAddress, uint256 _outcome, int256 _amount, int256 _price, uint256 _numLongTokens, uint256 _numShortTokens, uint256 _numLongShares, uint256 _numShortShares) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProfitLoss.recordClaim(contract IMarket,address,uint256[])"></a><code class="function-signature">recordClaim(contract IMarket _market, address _account, uint256[] _outcomeFees) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `ParaAugurTrading`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ParaAugurTrading.constructor(contract IAugur)"><code class="function-signature">constructor(contract IAugur _augur)</code></a></li><li><a href="#ParaAugurTrading.registerContract(bytes32,address)"><code class="function-signature">registerContract(bytes32 _key, address _address)</code></a></li><li><a href="#ParaAugurTrading.doApprovals()"><code class="function-signature">doApprovals()</code></a></li><li><a href="#ParaAugurTrading.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#ParaAugurTrading.finishDeployment()"><code class="function-signature">finishDeployment()</code></a></li><li><a href="#ParaAugurTrading.claimMarketsProceeds(contract IMarket[],address,bytes32)"><code class="function-signature">claimMarketsProceeds(contract IMarket[] _markets, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#ParaAugurTrading.claimTradingProceeds(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#ParaAugurTrading.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost)</code></a></li><li><a href="#ParaAugurTrading.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId)</code></a></li><li><a href="#ParaAugurTrading.logOrderCreated(contract IUniverse,bytes32,bytes32)"><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#ParaAugurTrading.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#ParaAugurTrading.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[],uint256)"><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes, uint256 _totalTrades)</code></a></li><li><a href="#ParaAugurTrading.logZeroXOrderFilled(contract IUniverse,contract IMarket,bytes32,bytes32,uint8,address[],uint256[])"><code class="function-signature">logZeroXOrderFilled(contract IUniverse _universe, contract IMarket _market, bytes32 _orderHash, bytes32 _tradeGroupId, uint8 _orderType, address[] _addressData, uint256[] _uint256Data)</code></a></li><li><a href="#ParaAugurTrading.logZeroXOrderCanceled(address,address,address,uint256,uint256,uint256,uint8,bytes32)"><code class="function-signature">logZeroXOrderCanceled(address _universe, address _market, address _account, uint256 _outcome, uint256 _price, uint256 _amount, uint8 _type, bytes32 _orderHash)</code></a></li><li><a href="#ParaAugurTrading.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li class="inherited"><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ParaAugurTrading.OrderEvent(address,address,enum ParaAugurTrading.OrderEventType,uint8,bytes32,bytes32,address[],uint256[],address)"><code class="function-signature">OrderEvent(address universe, address market, enum ParaAugurTrading.OrderEventType eventType, uint8 orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data, address para)</code></a></li><li><a href="#ParaAugurTrading.ProfitLossChanged(address,address,address,uint256,int256,uint256,int256,int256,int256,uint256,address)"><code class="function-signature">ProfitLossChanged(address universe, address market, address account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp, address para)</code></a></li><li><a href="#ParaAugurTrading.MarketVolumeChanged(address,address,uint256,uint256[],uint256,uint256,address)"><code class="function-signature">MarketVolumeChanged(address universe, address market, uint256 volume, uint256[] outcomeVolumes, uint256 totalTrades, uint256 timestamp, address para)</code></a></li><li><a href="#ParaAugurTrading.CancelZeroXOrder(address,address,address,uint256,uint256,uint256,uint8,bytes32,address)"><code class="function-signature">CancelZeroXOrder(address universe, address market, address account, uint256 outcome, uint256 price, uint256 amount, uint8 orderType, bytes32 orderHash, address para)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.constructor(contract IAugur)"></a><code class="function-signature">constructor(contract IAugur _augur)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.registerContract(bytes32,address)"></a><code class="function-signature">registerContract(bytes32 _key, address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.doApprovals()"></a><code class="function-signature">doApprovals() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.finishDeployment()"></a><code class="function-signature">finishDeployment() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.claimMarketsProceeds(contract IMarket[],address,bytes32)"></a><code class="function-signature">claimMarketsProceeds(contract IMarket[] _markets, address _shareHolder, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.claimTradingProceeds(contract IMarket,address,bytes32)"></a><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"></a><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"></a><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.logOrderCreated(contract IUniverse,bytes32,bytes32)"></a><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"></a><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[],uint256)"></a><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes, uint256 _totalTrades) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.logZeroXOrderFilled(contract IUniverse,contract IMarket,bytes32,bytes32,uint8,address[],uint256[])"></a><code class="function-signature">logZeroXOrderFilled(contract IUniverse _universe, contract IMarket _market, bytes32 _orderHash, bytes32 _tradeGroupId, uint8 _orderType, address[] _addressData, uint256[] _uint256Data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.logZeroXOrderCanceled(address,address,address,uint256,uint256,uint256,uint8,bytes32)"></a><code class="function-signature">logZeroXOrderCanceled(address _universe, address _market, address _account, uint256 _outcome, uint256 _price, uint256 _amount, uint8 _type, bytes32 _orderHash)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.OrderEvent(address,address,enum ParaAugurTrading.OrderEventType,uint8,bytes32,bytes32,address[],uint256[],address)"></a><code class="function-signature">OrderEvent(address universe, address market, enum ParaAugurTrading.OrderEventType eventType, uint8 orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data, address para)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.ProfitLossChanged(address,address,address,uint256,int256,uint256,int256,int256,int256,uint256,address)"></a><code class="function-signature">ProfitLossChanged(address universe, address market, address account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp, address para)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.MarketVolumeChanged(address,address,uint256,uint256[],uint256,uint256,address)"></a><code class="function-signature">MarketVolumeChanged(address universe, address market, uint256 volume, uint256[] outcomeVolumes, uint256 totalTrades, uint256 timestamp, address para)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaAugurTrading.CancelZeroXOrder(address,address,address,uint256,uint256,uint256,uint8,bytes32,address)"></a><code class="function-signature">CancelZeroXOrder(address universe, address market, address account, uint256 outcome, uint256 price, uint256 amount, uint8 orderType, bytes32 orderHash, address para)</code><span class="function-visibility"></span></h4>





### `ICancelOrderFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ICancelOrderFactory.createCancelOrder()"><code class="function-signature">createCancelOrder()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ICancelOrderFactory.createCancelOrder()"></a><code class="function-signature">createCancelOrder() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `ICreateOrderFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ICreateOrderFactory.createCreateOrder()"><code class="function-signature">createCreateOrder()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ICreateOrderFactory.createCreateOrder()"></a><code class="function-signature">createCreateOrder() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `IFillOrderFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IFillOrderFactory.createFillOrder()"><code class="function-signature">createFillOrder()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IFillOrderFactory.createFillOrder()"></a><code class="function-signature">createFillOrder() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `IOrdersFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOrdersFactory.createOrders()"><code class="function-signature">createOrders()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOrdersFactory.createOrders()"></a><code class="function-signature">createOrders() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `IParaAugurFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaAugurFactory.createParaAugur(contract IAugur,uint256)"><code class="function-signature">createParaAugur(contract IAugur _augur, uint256 _tradeIntervalModifier)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaAugurFactory.createParaAugur(contract IAugur,uint256)"></a><code class="function-signature">createParaAugur(contract IAugur _augur, uint256 _tradeIntervalModifier) <span class="return-arrow">→</span> <span class="return-type">contract IParaAugur</span></code><span class="function-visibility">public</span></h4>







### `IParaAugurTrading`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaAugurTrading.doApprovals()"><code class="function-signature">doApprovals()</code></a></li><li><a href="#IParaAugurTrading.registerContract(bytes32,address)"><code class="function-signature">registerContract(bytes32 _key, address _address)</code></a></li><li><a href="#IParaAugurTrading.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaAugurTrading.doApprovals()"></a><code class="function-signature">doApprovals() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugurTrading.registerContract(bytes32,address)"></a><code class="function-signature">registerContract(bytes32 _key, address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaAugurTrading.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>







### `IParaAugurTradingFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaAugurTradingFactory.createParaAugurTrading(contract IAugur)"><code class="function-signature">createParaAugurTrading(contract IAugur _augur)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaAugurTradingFactory.createParaAugurTrading(contract IAugur)"></a><code class="function-signature">createParaAugurTrading(contract IAugur _augur) <span class="return-arrow">→</span> <span class="return-type">contract IParaAugurTrading</span></code><span class="function-visibility">public</span></h4>







### `IParaShareTokenFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaShareTokenFactory.createParaShareToken()"><code class="function-signature">createParaShareToken()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaShareTokenFactory.createParaShareToken()"></a><code class="function-signature">createParaShareToken() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `IProfitLossFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IProfitLossFactory.createProfitLoss()"><code class="function-signature">createProfitLoss()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IProfitLossFactory.createProfitLoss()"></a><code class="function-signature">createProfitLoss() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `IRepOracle`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IRepOracle.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#IRepOracle.getLastUpdateTimestamp(address)"><code class="function-signature">getLastUpdateTimestamp(address _reputationToken)</code></a></li><li><a href="#IRepOracle.poke(address)"><code class="function-signature">poke(address _reputationTokenAddress)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IRepOracle.initialize(contract IAugur)"></a><code class="function-signature">initialize(contract IAugur _augur)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IRepOracle.getLastUpdateTimestamp(address)"></a><code class="function-signature">getLastUpdateTimestamp(address _reputationToken) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IRepOracle.poke(address)"></a><code class="function-signature">poke(address _reputationTokenAddress) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







### `ISimulateTradeFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ISimulateTradeFactory.createSimulateTrade()"><code class="function-signature">createSimulateTrade()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ISimulateTradeFactory.createSimulateTrade()"></a><code class="function-signature">createSimulateTrade() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `ITrade`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITrade.publicTrade(enum Order.TradeDirections,contract IMarket,uint256,uint256,uint256,bytes32,bytes32,uint256)"><code class="function-signature">publicTrade(enum Order.TradeDirections _direction, contract IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, uint256 _tradeGroupID)</code></a></li><li><a href="#ITrade.publicFillBestOrder(enum Order.TradeDirections,contract IMarket,uint256,uint256,uint256,uint256)"><code class="function-signature">publicFillBestOrder(enum Order.TradeDirections _direction, contract IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, uint256 _tradeGroupID)</code></a></li><li><a href="#ITrade.trade(address,enum Order.TradeDirections,contract IMarket,uint256,uint256,uint256,bytes32,bytes32,uint256)"><code class="function-signature">trade(address _sender, enum Order.TradeDirections _direction, contract IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, uint256 _tradeGroupID)</code></a></li><li><a href="#ITrade.fillBestOrder(address,enum Order.TradeDirections,contract IMarket,uint256,uint256,uint256,uint256)"><code class="function-signature">fillBestOrder(address _sender, enum Order.TradeDirections _direction, contract IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, uint256 _tradeGroupID)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITrade.publicTrade(enum Order.TradeDirections,contract IMarket,uint256,uint256,uint256,bytes32,bytes32,uint256)"></a><code class="function-signature">publicTrade(enum Order.TradeDirections _direction, contract IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, uint256 _tradeGroupID) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ITrade.publicFillBestOrder(enum Order.TradeDirections,contract IMarket,uint256,uint256,uint256,uint256)"></a><code class="function-signature">publicFillBestOrder(enum Order.TradeDirections _direction, contract IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, uint256 _tradeGroupID) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ITrade.trade(address,enum Order.TradeDirections,contract IMarket,uint256,uint256,uint256,bytes32,bytes32,uint256)"></a><code class="function-signature">trade(address _sender, enum Order.TradeDirections _direction, contract IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, bytes32 _betterOrderId, bytes32 _worseOrderId, uint256 _tradeGroupID) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ITrade.fillBestOrder(address,enum Order.TradeDirections,contract IMarket,uint256,uint256,uint256,uint256)"></a><code class="function-signature">fillBestOrder(address _sender, enum Order.TradeDirections _direction, contract IMarket _market, uint256 _outcome, uint256 _amount, uint256 _price, uint256 _tradeGroupID) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `ITradeFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITradeFactory.createTrade()"><code class="function-signature">createTrade()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITradeFactory.createTrade()"></a><code class="function-signature">createTrade() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `ITradingInitializable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITradingInitializable.initialize(contract IParaAugur,contract IParaAugurTrading)"><code class="function-signature">initialize(contract IParaAugur, contract IParaAugurTrading)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITradingInitializable.initialize(contract IParaAugur,contract IParaAugurTrading)"></a><code class="function-signature">initialize(contract IParaAugur, contract IParaAugurTrading)</code><span class="function-visibility">external</span></h4>







### `IZeroXTradeFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IZeroXTradeFactory.createZeroXTrade()"><code class="function-signature">createZeroXTrade()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IZeroXTradeFactory.createZeroXTrade()"></a><code class="function-signature">createZeroXTrade() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>







### `ParaDeployer`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ParaDeployer.constructor(contract IAugur,address,address,address,address,contract IOINexus,address,address,struct ParaDeployer.Factories)"><code class="function-signature">constructor(contract IAugur _augur, address _feePotFactory, address _paraUniverseFactory, address _openInterestCashFactory, address _OICash, contract IOINexus _OINexus, address _zeroXExchange, address _WETH9, struct ParaDeployer.Factories _factories)</code></a></li><li><a href="#ParaDeployer.addToken(address,uint256)"><code class="function-signature">addToken(address _token, uint256 _tradeIntervalModifier)</code></a></li><li><a href="#ParaDeployer.burnOwnership()"><code class="function-signature">burnOwnership()</code></a></li><li><a href="#ParaDeployer.progressDeployment(address)"><code class="function-signature">progressDeployment(address _token)</code></a></li><li><a href="#ParaDeployer.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li class="inherited"><a href="para#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="para#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="para#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ParaDeployer.ParaAugurDeployFinished(contract IParaAugur,contract IParaShareToken,contract ICash,contract IOINexus)"><code class="function-signature">ParaAugurDeployFinished(contract IParaAugur paraAugur, contract IParaShareToken shareToken, contract ICash cash, contract IOINexus OINexus)</code></a></li><li><a href="#ParaDeployer.ParaAugurTradingDeployed(contract IParaAugurTrading,contract ICash)"><code class="function-signature">ParaAugurTradingDeployed(contract IParaAugurTrading paraAugur, contract ICash cash)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ParaDeployer.constructor(contract IAugur,address,address,address,address,contract IOINexus,address,address,struct ParaDeployer.Factories)"></a><code class="function-signature">constructor(contract IAugur _augur, address _feePotFactory, address _paraUniverseFactory, address _openInterestCashFactory, address _OICash, contract IOINexus _OINexus, address _zeroXExchange, address _WETH9, struct ParaDeployer.Factories _factories)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaDeployer.addToken(address,uint256)"></a><code class="function-signature">addToken(address _token, uint256 _tradeIntervalModifier) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaDeployer.burnOwnership()"></a><code class="function-signature">burnOwnership() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaDeployer.progressDeployment(address)"></a><code class="function-signature">progressDeployment(address _token) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaDeployer.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="ParaDeployer.ParaAugurDeployFinished(contract IParaAugur,contract IParaShareToken,contract ICash,contract IOINexus)"></a><code class="function-signature">ParaAugurDeployFinished(contract IParaAugur paraAugur, contract IParaShareToken shareToken, contract ICash cash, contract IOINexus OINexus)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaDeployer.ParaAugurTradingDeployed(contract IParaAugurTrading,contract ICash)"></a><code class="function-signature">ParaAugurTradingDeployed(contract IParaAugurTrading paraAugur, contract ICash cash)</code><span class="function-visibility"></span></h4>





### `IParaOICash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaOICash.initialize(contract IParaAugur,contract IParaUniverse)"><code class="function-signature">initialize(contract IParaAugur _augur, contract IParaUniverse _universe)</code></a></li><li><a href="#IParaOICash.approveFeePot()"><code class="function-signature">approveFeePot()</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaOICash.initialize(contract IParaAugur,contract IParaUniverse)"></a><code class="function-signature">initialize(contract IParaAugur _augur, contract IParaUniverse _universe)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IParaOICash.approveFeePot()"></a><code class="function-signature">approveFeePot()</code><span class="function-visibility">external</span></h4>







### `ParaOICash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ParaOICash.initialize(contract IParaAugur,contract IParaUniverse)"><code class="function-signature">initialize(contract IParaAugur _augur, contract IParaUniverse _universe)</code></a></li><li><a href="#ParaOICash.approveFeePot()"><code class="function-signature">approveFeePot()</code></a></li><li><a href="#ParaOICash.deposit(uint256)"><code class="function-signature">deposit(uint256 _amount)</code></a></li><li><a href="#ParaOICash.withdraw(uint256)"><code class="function-signature">withdraw(uint256 _amount)</code></a></li><li><a href="#ParaOICash.payFees(uint256)"><code class="function-signature">payFees(uint256 _feeAmount)</code></a></li><li><a href="#ParaOICash.buyCompleteSets(contract IMarket,uint256)"><code class="function-signature">buyCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ParaOICash.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#ParaOICash.onMint(address,uint256)"><code class="function-signature">onMint(address _target, uint256 _amount)</code></a></li><li><a href="#ParaOICash.onBurn(address,uint256)"><code class="function-signature">onBurn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li><li class="inherited"><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ParaOICash.initialize(contract IParaAugur,contract IParaUniverse)"></a><code class="function-signature">initialize(contract IParaAugur _augur, contract IParaUniverse _universe)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOICash.approveFeePot()"></a><code class="function-signature">approveFeePot()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOICash.deposit(uint256)"></a><code class="function-signature">deposit(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOICash.withdraw(uint256)"></a><code class="function-signature">withdraw(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOICash.payFees(uint256)"></a><code class="function-signature">payFees(uint256 _feeAmount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOICash.buyCompleteSets(contract IMarket,uint256)"></a><code class="function-signature">buyCompleteSets(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOICash.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOICash.onMint(address,uint256)"></a><code class="function-signature">onMint(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaOICash.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>







### `AugurTrading`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#AugurTrading.constructor(contract IAugur)"><code class="function-signature">constructor(contract IAugur _augur)</code></a></li><li><a href="#AugurTrading.registerContract(bytes32,address)"><code class="function-signature">registerContract(bytes32 _key, address _address)</code></a></li><li><a href="#AugurTrading.doApprovals()"><code class="function-signature">doApprovals()</code></a></li><li><a href="#AugurTrading.lookup(bytes32)"><code class="function-signature">lookup(bytes32 _key)</code></a></li><li><a href="#AugurTrading.finishDeployment()"><code class="function-signature">finishDeployment()</code></a></li><li><a href="#AugurTrading.claimMarketsProceeds(contract IMarket[],address,bytes32)"><code class="function-signature">claimMarketsProceeds(contract IMarket[] _markets, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#AugurTrading.claimTradingProceeds(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#AugurTrading.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost)</code></a></li><li><a href="#AugurTrading.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId)</code></a></li><li><a href="#AugurTrading.logOrderCreated(contract IUniverse,bytes32,bytes32)"><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#AugurTrading.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId)</code></a></li><li><a href="#AugurTrading.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[],uint256)"><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes, uint256 _totalTrades)</code></a></li><li><a href="#AugurTrading.logZeroXOrderFilled(contract IUniverse,contract IMarket,bytes32,bytes32,uint8,address[],uint256[])"><code class="function-signature">logZeroXOrderFilled(contract IUniverse _universe, contract IMarket _market, bytes32 _orderHash, bytes32 _tradeGroupId, uint8 _orderType, address[] _addressData, uint256[] _uint256Data)</code></a></li><li><a href="#AugurTrading.logZeroXOrderCanceled(address,address,address,uint256,uint256,uint256,uint8,bytes32)"><code class="function-signature">logZeroXOrderCanceled(address _universe, address _market, address _account, uint256 _outcome, uint256 _price, uint256 _amount, uint8 _type, bytes32 _orderHash)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#AugurTrading.OrderEvent(address,address,enum AugurTrading.OrderEventType,uint8,bytes32,bytes32,address[],uint256[])"><code class="function-signature">OrderEvent(address universe, address market, enum AugurTrading.OrderEventType eventType, uint8 orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data)</code></a></li><li><a href="#AugurTrading.ProfitLossChanged(address,address,address,uint256,int256,uint256,int256,int256,int256,uint256)"><code class="function-signature">ProfitLossChanged(address universe, address market, address account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp)</code></a></li><li><a href="#AugurTrading.MarketVolumeChanged(address,address,uint256,uint256[],uint256,uint256)"><code class="function-signature">MarketVolumeChanged(address universe, address market, uint256 volume, uint256[] outcomeVolumes, uint256 totalTrades, uint256 timestamp)</code></a></li><li><a href="#AugurTrading.CancelZeroXOrder(address,address,address,uint256,uint256,uint256,uint8,bytes32)"><code class="function-signature">CancelZeroXOrder(address universe, address market, address account, uint256 outcome, uint256 price, uint256 amount, uint8 orderType, bytes32 orderHash)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="AugurTrading.constructor(contract IAugur)"></a><code class="function-signature">constructor(contract IAugur _augur)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.registerContract(bytes32,address)"></a><code class="function-signature">registerContract(bytes32 _key, address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.doApprovals()"></a><code class="function-signature">doApprovals() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.lookup(bytes32)"></a><code class="function-signature">lookup(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.finishDeployment()"></a><code class="function-signature">finishDeployment() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.claimMarketsProceeds(contract IMarket[],address,bytes32)"></a><code class="function-signature">claimMarketsProceeds(contract IMarket[] _markets, address _shareHolder, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.claimTradingProceeds(contract IMarket,address,bytes32)"></a><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.logProfitLossChanged(contract IMarket,address,uint256,int256,uint256,int256,int256,int256)"></a><code class="function-signature">logProfitLossChanged(contract IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.logOrderCanceled(contract IUniverse,contract IMarket,address,uint256,uint256,bytes32)"></a><code class="function-signature">logOrderCanceled(contract IUniverse _universe, contract IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.logOrderCreated(contract IUniverse,bytes32,bytes32)"></a><code class="function-signature">logOrderCreated(contract IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.logOrderFilled(contract IUniverse,address,address,uint256,uint256,uint256,bytes32,bytes32)"></a><code class="function-signature">logOrderFilled(contract IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.logMarketVolumeChanged(contract IUniverse,address,uint256,uint256[],uint256)"></a><code class="function-signature">logMarketVolumeChanged(contract IUniverse _universe, address _market, uint256 _volume, uint256[] _outcomeVolumes, uint256 _totalTrades) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.logZeroXOrderFilled(contract IUniverse,contract IMarket,bytes32,bytes32,uint8,address[],uint256[])"></a><code class="function-signature">logZeroXOrderFilled(contract IUniverse _universe, contract IMarket _market, bytes32 _orderHash, bytes32 _tradeGroupId, uint8 _orderType, address[] _addressData, uint256[] _uint256Data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.logZeroXOrderCanceled(address,address,address,uint256,uint256,uint256,uint8,bytes32)"></a><code class="function-signature">logZeroXOrderCanceled(address _universe, address _market, address _account, uint256 _outcome, uint256 _price, uint256 _amount, uint8 _type, bytes32 _orderHash)</code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="AugurTrading.OrderEvent(address,address,enum AugurTrading.OrderEventType,uint8,bytes32,bytes32,address[],uint256[])"></a><code class="function-signature">OrderEvent(address universe, address market, enum AugurTrading.OrderEventType eventType, uint8 orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.ProfitLossChanged(address,address,address,uint256,int256,uint256,int256,int256,int256,uint256)"></a><code class="function-signature">ProfitLossChanged(address universe, address market, address account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.MarketVolumeChanged(address,address,uint256,uint256[],uint256,uint256)"></a><code class="function-signature">MarketVolumeChanged(address universe, address market, uint256 volume, uint256[] outcomeVolumes, uint256 totalTrades, uint256 timestamp)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="AugurTrading.CancelZeroXOrder(address,address,address,uint256,uint256,uint256,uint8,bytes32)"></a><code class="function-signature">CancelZeroXOrder(address universe, address market, address account, uint256 outcome, uint256 price, uint256 amount, uint8 orderType, bytes32 orderHash)</code><span class="function-visibility"></span></h4>





### `ERC1155`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC1155.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#ERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address account, uint256 id)</code></a></li><li><a href="#ERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li><a href="#ERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] accounts, uint256[] ids)</code></a></li><li><a href="#ERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li><a href="#ERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address account, address operator)</code></a></li><li><a href="#ERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#ERC1155._transferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_transferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._internalTransferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_internalTransferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li><a href="#ERC1155._batchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_batchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._internalBatchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_internalBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._mint(address,uint256,uint256,bytes,bool)"><code class="function-signature">_mint(address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._mintBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_mintBatch(address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._burn(address,uint256,uint256,bytes,bool)"><code class="function-signature">_burn(address account, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._burnBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_burnBatch(address account, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._doSafeTransferAcceptanceCheck(address,address,address,uint256,uint256,bytes)"><code class="function-signature">_doSafeTransferAcceptanceCheck(address operator, address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#ERC1155._doSafeBatchTransferAcceptanceCheck(address,address,address,uint256[],uint256[],bytes)"><code class="function-signature">_doSafeBatchTransferAcceptanceCheck(address operator, address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li><a href="#ERC1155.onTokenTransfer(uint256,address,address,uint256)"><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code></a></li><li><a href="#ERC1155.onMint(uint256,address,uint256)"><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li><a href="#ERC1155.onBurn(uint256,address,uint256)"><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="para#ERC165._registerInterface(bytes4)"><code class="function-signature">_registerInterface(bytes4 interfaceId)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



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



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC1155Receiver.onERC1155Received(address,address,uint256,uint256,bytes)"><code class="function-signature">onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#IERC1155Receiver.onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"><code class="function-signature">onERC1155BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="para#IERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li></ul></div>



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





### `ParaShareToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ParaShareToken.initialize(address,contract ShareToken)"><code class="function-signature">initialize(address _augur, contract ShareToken _originalShareToken)</code></a></li><li><a href="#ParaShareToken.approveUniverse(contract IParaUniverse)"><code class="function-signature">approveUniverse(contract IParaUniverse _paraUniverse)</code></a></li><li><a href="#ParaShareToken.unsafeTransferFrom(address,address,uint256,uint256)"><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code></a></li><li><a href="#ParaShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code></a></li><li><a href="#ParaShareToken.initializeMarket(contract IMarket)"><code class="function-signature">initializeMarket(contract IMarket _market)</code></a></li><li><a href="#ParaShareToken.isMarketInitialized(contract IMarket)"><code class="function-signature">isMarketInitialized(contract IMarket _market)</code></a></li><li><a href="#ParaShareToken.publicBuyCompleteSets(contract IMarket,uint256)"><code class="function-signature">publicBuyCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ParaShareToken.buyCompleteSets(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#ParaShareToken.buyCompleteSetsInternal(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSetsInternal(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#ParaShareToken.buyCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address)"><code class="function-signature">buyCompleteSetsForTrade(contract IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient)</code></a></li><li><a href="#ParaShareToken.publicSellCompleteSets(contract IMarket,uint256)"><code class="function-signature">publicSellCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ParaShareToken.sellCompleteSets(contract IMarket,address,address,uint256,bytes32)"><code class="function-signature">sellCompleteSets(contract IMarket _market, address _holder, address _recipient, uint256 _amount, bytes32 _fingerprint)</code></a></li><li><a href="#ParaShareToken.sellCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address,address,address,uint256,address,bytes32)"><code class="function-signature">sellCompleteSetsForTrade(contract IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#ParaShareToken.claimTradingProceeds(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#ParaShareToken.claimTradingProceedsInternal(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceedsInternal(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#ParaShareToken.divideUpWinnings(contract IMarket,contract IParaUniverse,uint256,uint256)"><code class="function-signature">divideUpWinnings(contract IMarket _market, contract IParaUniverse _paraUniverse, uint256 _outcome, uint256 _numberOfShares)</code></a></li><li><a href="#ParaShareToken.calculateProceeds(contract IMarket,uint256,uint256)"><code class="function-signature">calculateProceeds(contract IMarket _market, uint256 _outcome, uint256 _numberOfShares)</code></a></li><li><a href="#ParaShareToken.calculateReportingFee(contract IParaUniverse,uint256)"><code class="function-signature">calculateReportingFee(contract IParaUniverse _paraUniverse, uint256 _amount)</code></a></li><li><a href="#ParaShareToken.calculateCreatorFee(contract IMarket,uint256)"><code class="function-signature">calculateCreatorFee(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ParaShareToken.getTypeName()"><code class="function-signature">getTypeName()</code></a></li><li><a href="#ParaShareToken.getMarket(uint256)"><code class="function-signature">getMarket(uint256 _tokenId)</code></a></li><li><a href="#ParaShareToken.getOutcome(uint256)"><code class="function-signature">getOutcome(uint256 _tokenId)</code></a></li><li><a href="#ParaShareToken.totalSupplyForMarketOutcome(contract IMarket,uint256)"><code class="function-signature">totalSupplyForMarketOutcome(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#ParaShareToken.balanceOfMarketOutcome(contract IMarket,uint256,address)"><code class="function-signature">balanceOfMarketOutcome(contract IMarket _market, uint256 _outcome, address _account)</code></a></li><li><a href="#ParaShareToken.lowestBalanceOfMarketOutcomes(contract IMarket,uint256[],address)"><code class="function-signature">lowestBalanceOfMarketOutcomes(contract IMarket _market, uint256[] _outcomes, address _account)</code></a></li><li><a href="#ParaShareToken.getTokenId(contract IMarket,uint256)"><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#ParaShareToken.getTokenIds(contract IMarket,uint256[])"><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes)</code></a></li><li><a href="#ParaShareToken.unpackTokenId(uint256)"><code class="function-signature">unpackTokenId(uint256 _tokenId)</code></a></li><li><a href="#ParaShareToken.onTokenTransfer(uint256,address,address,uint256)"><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code></a></li><li><a href="#ParaShareToken.onMint(uint256,address,uint256)"><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li><a href="#ParaShareToken.onBurn(uint256,address,uint256)"><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC1155.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="para#ERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address account, uint256 id)</code></a></li><li class="inherited"><a href="para#ERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li class="inherited"><a href="para#ERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] accounts, uint256[] ids)</code></a></li><li class="inherited"><a href="para#ERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li class="inherited"><a href="para#ERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address account, address operator)</code></a></li><li class="inherited"><a href="para#ERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="para#ERC1155._transferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_transferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._internalTransferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_internalTransferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="para#ERC1155._batchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_batchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._internalBatchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_internalBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._mint(address,uint256,uint256,bytes,bool)"><code class="function-signature">_mint(address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._mintBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_mintBatch(address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._burn(address,uint256,uint256,bytes,bool)"><code class="function-signature">_burn(address account, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._burnBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_burnBatch(address account, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._doSafeTransferAcceptanceCheck(address,address,address,uint256,uint256,bytes)"><code class="function-signature">_doSafeTransferAcceptanceCheck(address operator, address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="para#ERC1155._doSafeBatchTransferAcceptanceCheck(address,address,address,uint256[],uint256[],bytes)"><code class="function-signature">_doSafeBatchTransferAcceptanceCheck(address operator, address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="para#ERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="para#ERC165._registerInterface(bytes4)"><code class="function-signature">_registerInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.initialize(address,contract ShareToken)"></a><code class="function-signature">initialize(address _augur, contract ShareToken _originalShareToken)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.approveUniverse(contract IParaUniverse)"></a><code class="function-signature">approveUniverse(contract IParaUniverse _paraUniverse)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.unsafeTransferFrom(address,address,uint256,uint256)"></a><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code><span class="function-visibility">external</span></h4>

Transfers `value` amount of an `id` from the `from` address to the `to` address specified.
Caller must be approved to manage the tokens being transferred out of the `from` account.
Regardless of if the desintation is a contract or not this will not call `onERC1155Received` on `to`




<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"></a><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code><span class="function-visibility">external</span></h4>

Transfers `values` amount(s) of `ids` from the `from` address to the
`to` address specified. Caller must be approved to manage the tokens being
transferred out of the `from` account. Regardless of if the desintation is
a contract or not this will not call `onERC1155Received` on `to`




<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.initializeMarket(contract IMarket)"></a><code class="function-signature">initializeMarket(contract IMarket _market)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.isMarketInitialized(contract IMarket)"></a><code class="function-signature">isMarketInitialized(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.publicBuyCompleteSets(contract IMarket,uint256)"></a><code class="function-signature">publicBuyCompleteSets(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.buyCompleteSets(contract IMarket,address,uint256)"></a><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.buyCompleteSetsInternal(contract IMarket,address,uint256)"></a><code class="function-signature">buyCompleteSetsInternal(contract IMarket _market, address _account, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.buyCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address)"></a><code class="function-signature">buyCompleteSetsForTrade(contract IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.publicSellCompleteSets(contract IMarket,uint256)"></a><code class="function-signature">publicSellCompleteSets(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.sellCompleteSets(contract IMarket,address,address,uint256,bytes32)"></a><code class="function-signature">sellCompleteSets(contract IMarket _market, address _holder, address _recipient, uint256 _amount, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.sellCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address,address,address,uint256,address,bytes32)"></a><code class="function-signature">sellCompleteSetsForTrade(contract IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.claimTradingProceeds(contract IMarket,address,bytes32)"></a><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.claimTradingProceedsInternal(contract IMarket,address,bytes32)"></a><code class="function-signature">claimTradingProceedsInternal(contract IMarket _market, address _shareHolder, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.divideUpWinnings(contract IMarket,contract IParaUniverse,uint256,uint256)"></a><code class="function-signature">divideUpWinnings(contract IMarket _market, contract IParaUniverse _paraUniverse, uint256 _outcome, uint256 _numberOfShares) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.calculateProceeds(contract IMarket,uint256,uint256)"></a><code class="function-signature">calculateProceeds(contract IMarket _market, uint256 _outcome, uint256 _numberOfShares) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.calculateReportingFee(contract IParaUniverse,uint256)"></a><code class="function-signature">calculateReportingFee(contract IParaUniverse _paraUniverse, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.calculateCreatorFee(contract IMarket,uint256)"></a><code class="function-signature">calculateCreatorFee(contract IMarket _market, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.getMarket(uint256)"></a><code class="function-signature">getMarket(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.getOutcome(uint256)"></a><code class="function-signature">getOutcome(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.totalSupplyForMarketOutcome(contract IMarket,uint256)"></a><code class="function-signature">totalSupplyForMarketOutcome(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.balanceOfMarketOutcome(contract IMarket,uint256,address)"></a><code class="function-signature">balanceOfMarketOutcome(contract IMarket _market, uint256 _outcome, address _account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.lowestBalanceOfMarketOutcomes(contract IMarket,uint256[],address)"></a><code class="function-signature">lowestBalanceOfMarketOutcomes(contract IMarket _market, uint256[] _outcomes, address _account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.getTokenId(contract IMarket,uint256)"></a><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.getTokenIds(contract IMarket,uint256[])"></a><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.unpackTokenId(uint256)"></a><code class="function-signature">unpackTokenId(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">address,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.onTokenTransfer(uint256,address,address,uint256)"></a><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.onMint(uint256,address,uint256)"></a><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaShareToken.onBurn(uint256,address,uint256)"></a><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>







### `ReentrancyGuard`



<div class="contract-index"></div>





### `ShareToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ShareToken.initialize(contract IAugur)"><code class="function-signature">initialize(contract IAugur _augur)</code></a></li><li><a href="#ShareToken.unsafeTransferFrom(address,address,uint256,uint256)"><code class="function-signature">unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value)</code></a></li><li><a href="#ShareToken.unsafeBatchTransferFrom(address,address,uint256[],uint256[])"><code class="function-signature">unsafeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values)</code></a></li><li><a href="#ShareToken.initializeMarket(contract IMarket,uint256,uint256)"><code class="function-signature">initializeMarket(contract IMarket _market, uint256 _numOutcomes, uint256 _numTicks)</code></a></li><li><a href="#ShareToken.publicBuyCompleteSets(contract IMarket,uint256)"><code class="function-signature">publicBuyCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ShareToken.buyCompleteSets(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSets(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#ShareToken.buyCompleteSetsInternal(contract IMarket,address,uint256)"><code class="function-signature">buyCompleteSetsInternal(contract IMarket _market, address _account, uint256 _amount)</code></a></li><li><a href="#ShareToken.buyCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address)"><code class="function-signature">buyCompleteSetsForTrade(contract IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient)</code></a></li><li><a href="#ShareToken.publicSellCompleteSets(contract IMarket,uint256)"><code class="function-signature">publicSellCompleteSets(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ShareToken.sellCompleteSets(contract IMarket,address,address,uint256,bytes32)"><code class="function-signature">sellCompleteSets(contract IMarket _market, address _holder, address _recipient, uint256 _amount, bytes32 _fingerprint)</code></a></li><li><a href="#ShareToken.sellCompleteSetsForTrade(contract IMarket,uint256,uint256,address,address,address,address,uint256,address,bytes32)"><code class="function-signature">sellCompleteSetsForTrade(contract IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount, bytes32 _fingerprint)</code></a></li><li><a href="#ShareToken.claimTradingProceeds(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceeds(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#ShareToken.claimTradingProceedsInternal(contract IMarket,address,bytes32)"><code class="function-signature">claimTradingProceedsInternal(contract IMarket _market, address _shareHolder, bytes32 _fingerprint)</code></a></li><li><a href="#ShareToken.divideUpWinnings(contract IMarket,uint256,uint256)"><code class="function-signature">divideUpWinnings(contract IMarket _market, uint256 _outcome, uint256 _numberOfShares)</code></a></li><li><a href="#ShareToken.calculateProceeds(contract IMarket,uint256,uint256)"><code class="function-signature">calculateProceeds(contract IMarket _market, uint256 _outcome, uint256 _numberOfShares)</code></a></li><li><a href="#ShareToken.calculateReportingFee(contract IMarket,uint256)"><code class="function-signature">calculateReportingFee(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ShareToken.calculateCreatorFee(contract IMarket,uint256)"><code class="function-signature">calculateCreatorFee(contract IMarket _market, uint256 _amount)</code></a></li><li><a href="#ShareToken.getTypeName()"><code class="function-signature">getTypeName()</code></a></li><li><a href="#ShareToken.getMarket(uint256)"><code class="function-signature">getMarket(uint256 _tokenId)</code></a></li><li><a href="#ShareToken.getOutcome(uint256)"><code class="function-signature">getOutcome(uint256 _tokenId)</code></a></li><li><a href="#ShareToken.totalSupplyForMarketOutcome(contract IMarket,uint256)"><code class="function-signature">totalSupplyForMarketOutcome(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#ShareToken.balanceOfMarketOutcome(contract IMarket,uint256,address)"><code class="function-signature">balanceOfMarketOutcome(contract IMarket _market, uint256 _outcome, address _account)</code></a></li><li><a href="#ShareToken.lowestBalanceOfMarketOutcomes(contract IMarket,uint256[],address)"><code class="function-signature">lowestBalanceOfMarketOutcomes(contract IMarket _market, uint256[] _outcomes, address _account)</code></a></li><li><a href="#ShareToken.assertBalances(contract IMarket)"><code class="function-signature">assertBalances(contract IMarket _market)</code></a></li><li><a href="#ShareToken.getTokenId(contract IMarket,uint256)"><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#ShareToken.getTokenIds(contract IMarket,uint256[])"><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes)</code></a></li><li><a href="#ShareToken.unpackTokenId(uint256)"><code class="function-signature">unpackTokenId(uint256 _tokenId)</code></a></li><li><a href="#ShareToken.onTokenTransfer(uint256,address,address,uint256)"><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code></a></li><li><a href="#ShareToken.onMint(uint256,address,uint256)"><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li><a href="#ShareToken.onBurn(uint256,address,uint256)"><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="para#ERC1155.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="para#ERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address account, uint256 id)</code></a></li><li class="inherited"><a href="para#ERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li class="inherited"><a href="para#ERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] accounts, uint256[] ids)</code></a></li><li class="inherited"><a href="para#ERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li class="inherited"><a href="para#ERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address account, address operator)</code></a></li><li class="inherited"><a href="para#ERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="para#ERC1155._transferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_transferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._internalTransferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_internalTransferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="para#ERC1155._batchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_batchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._internalBatchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_internalBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._mint(address,uint256,uint256,bytes,bool)"><code class="function-signature">_mint(address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._mintBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_mintBatch(address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._burn(address,uint256,uint256,bytes,bool)"><code class="function-signature">_burn(address account, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._burnBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_burnBatch(address account, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li class="inherited"><a href="para#ERC1155._doSafeTransferAcceptanceCheck(address,address,address,uint256,uint256,bytes)"><code class="function-signature">_doSafeTransferAcceptanceCheck(address operator, address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="para#ERC1155._doSafeBatchTransferAcceptanceCheck(address,address,address,uint256[],uint256[],bytes)"><code class="function-signature">_doSafeBatchTransferAcceptanceCheck(address operator, address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="para#ERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="para#ERC165._registerInterface(bytes4)"><code class="function-signature">_registerInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



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





<h4><a class="anchor" aria-hidden="true" id="ShareToken.assertBalances(contract IMarket)"></a><code class="function-signature">assertBalances(contract IMarket _market)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.getTokenId(contract IMarket,uint256)"></a><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.getTokenIds(contract IMarket,uint256[])"></a><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.unpackTokenId(uint256)"></a><code class="function-signature">unpackTokenId(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">address,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.onTokenTransfer(uint256,address,address,uint256)"></a><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.onMint(uint256,address,uint256)"></a><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ShareToken.onBurn(uint256,address,uint256)"></a><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code><span class="function-visibility">internal</span></h4>







### `TokenId`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TokenId.getTokenId(address,uint256)"><code class="function-signature">getTokenId(address _market, uint256 _outcome)</code></a></li><li><a href="#TokenId.getTokenId(contract IMarket,uint256)"><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome)</code></a></li><li><a href="#TokenId.getTokenIds(address,uint256[])"><code class="function-signature">getTokenIds(address _market, uint256[] _outcomes)</code></a></li><li><a href="#TokenId.getTokenIds(contract IMarket,uint256[])"><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes)</code></a></li><li><a href="#TokenId.unpackTokenId(uint256)"><code class="function-signature">unpackTokenId(uint256 _tokenId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TokenId.getTokenId(address,uint256)"></a><code class="function-signature">getTokenId(address _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TokenId.getTokenId(contract IMarket,uint256)"></a><code class="function-signature">getTokenId(contract IMarket _market, uint256 _outcome) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TokenId.getTokenIds(address,uint256[])"></a><code class="function-signature">getTokenIds(address _market, uint256[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TokenId.getTokenIds(contract IMarket,uint256[])"></a><code class="function-signature">getTokenIds(contract IMarket _market, uint256[] _outcomes) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TokenId.unpackTokenId(uint256)"></a><code class="function-signature">unpackTokenId(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">address,uint256</span></code><span class="function-visibility">internal</span></h4>







### `IAffiliates`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAffiliates.setFingerprint(bytes32)"><code class="function-signature">setFingerprint(bytes32 _fingerprint)</code></a></li><li><a href="#IAffiliates.setReferrer(address)"><code class="function-signature">setReferrer(address _referrer)</code></a></li><li><a href="#IAffiliates.getAccountFingerprint(address)"><code class="function-signature">getAccountFingerprint(address _account)</code></a></li><li><a href="#IAffiliates.getReferrer(address)"><code class="function-signature">getReferrer(address _account)</code></a></li><li><a href="#IAffiliates.getAndValidateReferrer(address,contract IAffiliateValidator)"><code class="function-signature">getAndValidateReferrer(address _account, contract IAffiliateValidator affiliateValidator)</code></a></li><li><a href="#IAffiliates.affiliateValidators(address)"><code class="function-signature">affiliateValidators(address _affiliateValidator)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAffiliates.setFingerprint(bytes32)"></a><code class="function-signature">setFingerprint(bytes32 _fingerprint)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.setReferrer(address)"></a><code class="function-signature">setReferrer(address _referrer)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.getAccountFingerprint(address)"></a><code class="function-signature">getAccountFingerprint(address _account) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.getReferrer(address)"></a><code class="function-signature">getReferrer(address _account) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.getAndValidateReferrer(address,contract IAffiliateValidator)"></a><code class="function-signature">getAndValidateReferrer(address _account, contract IAffiliateValidator affiliateValidator) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAffiliates.affiliateValidators(address)"></a><code class="function-signature">affiliateValidators(address _affiliateValidator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `IFeePotFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IFeePotFactory.createFeePot(contract IParaAugur)"><code class="function-signature">createFeePot(contract IParaAugur _paraAugur)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IFeePotFactory.createFeePot(contract IParaAugur)"></a><code class="function-signature">createFeePot(contract IParaAugur _paraAugur) <span class="return-arrow">→</span> <span class="return-type">contract IFeePot</span></code><span class="function-visibility">external</span></h4>







### `IParaOICashFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IParaOICashFactory.createParaOICash(contract IParaAugur)"><code class="function-signature">createParaOICash(contract IParaAugur _augur)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IParaOICashFactory.createParaOICash(contract IParaAugur)"></a><code class="function-signature">createParaOICash(contract IParaAugur _augur) <span class="return-arrow">→</span> <span class="return-type">contract IParaOICash</span></code><span class="function-visibility">external</span></h4>







### `ParaUniverse`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ParaUniverse.initialize(contract IParaAugur,contract IUniverse)"><code class="function-signature">initialize(contract IParaAugur _augur, contract IUniverse _originUniverse)</code></a></li><li><a href="#ParaUniverse.isOpenInterestCash(address)"><code class="function-signature">isOpenInterestCash(address _address)</code></a></li><li><a href="#ParaUniverse.getReputationToken()"><code class="function-signature">getReputationToken()</code></a></li><li><a href="#ParaUniverse.getFeePot()"><code class="function-signature">getFeePot()</code></a></li><li><a href="#ParaUniverse.setOrigin(contract IUniverse)"><code class="function-signature">setOrigin(contract IUniverse _originUniverse)</code></a></li><li><a href="#ParaUniverse.deposit(address,uint256,address)"><code class="function-signature">deposit(address _sender, uint256 _amount, address _market)</code></a></li><li><a href="#ParaUniverse.withdraw(address,uint256,address)"><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market)</code></a></li><li><a href="#ParaUniverse.decrementOpenInterest(uint256)"><code class="function-signature">decrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#ParaUniverse.incrementOpenInterest(uint256)"><code class="function-signature">incrementOpenInterest(uint256 _amount)</code></a></li><li><a href="#ParaUniverse.getOpenInterestInAttoCash()"><code class="function-signature">getOpenInterestInAttoCash()</code></a></li><li><a href="#ParaUniverse.setMarketFinalized(contract IMarket,uint256)"><code class="function-signature">setMarketFinalized(contract IMarket _market, uint256 _totalSupply)</code></a></li><li><a href="#ParaUniverse.pokeRepMarketCapInAttoCash()"><code class="function-signature">pokeRepMarketCapInAttoCash()</code></a></li><li><a href="#ParaUniverse.getTargetRepMarketCapInAttoCash()"><code class="function-signature">getTargetRepMarketCapInAttoCash()</code></a></li><li><a href="#ParaUniverse.getOrCacheReportingFeeDivisor()"><code class="function-signature">getOrCacheReportingFeeDivisor()</code></a></li><li><a href="#ParaUniverse.getReportingFeeDivisor()"><code class="function-signature">getReportingFeeDivisor()</code></a></li><li><a href="#ParaUniverse.getMarketOpenInterest(contract IMarket)"><code class="function-signature">getMarketOpenInterest(contract IMarket _market)</code></a></li><li><a href="#ParaUniverse.recordMarketCreatorFees(contract IMarket,uint256,address)"><code class="function-signature">recordMarketCreatorFees(contract IMarket _market, uint256 _marketCreatorFees, address _sourceAccount)</code></a></li><li><a href="#ParaUniverse.getForkingMarket()"><code class="function-signature">getForkingMarket()</code></a></li><li><a href="#ParaUniverse.getDisputeThresholdForDisputePacing()"><code class="function-signature">getDisputeThresholdForDisputePacing()</code></a></li><li><a href="#ParaUniverse.getOrCacheDesignatedReportStake()"><code class="function-signature">getOrCacheDesignatedReportStake()</code></a></li><li><a href="#ParaUniverse.runPeriodicals()"><code class="function-signature">runPeriodicals()</code></a></li><li><a href="#ParaUniverse.getOrCacheValidityBond()"><code class="function-signature">getOrCacheValidityBond()</code></a></li><li><a href="#ParaUniverse.getOrCacheMarketRepBond()"><code class="function-signature">getOrCacheMarketRepBond()</code></a></li><li class="inherited"><a href="#IParaUniverse.originUniverse()"><code class="function-signature">originUniverse()</code></a></li><li class="inherited"><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.initialize(contract IParaAugur,contract IUniverse)"></a><code class="function-signature">initialize(contract IParaAugur _augur, contract IUniverse _originUniverse)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.isOpenInterestCash(address)"></a><code class="function-signature">isOpenInterestCash(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getReputationToken()"></a><code class="function-signature">getReputationToken() <span class="return-arrow">→</span> <span class="return-type">contract IV2ReputationToken</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getFeePot()"></a><code class="function-signature">getFeePot() <span class="return-arrow">→</span> <span class="return-type">contract IFeePot</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.setOrigin(contract IUniverse)"></a><code class="function-signature">setOrigin(contract IUniverse _originUniverse)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.deposit(address,uint256,address)"></a><code class="function-signature">deposit(address _sender, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.withdraw(address,uint256,address)"></a><code class="function-signature">withdraw(address _recipient, uint256 _amount, address _market) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.decrementOpenInterest(uint256)"></a><code class="function-signature">decrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.incrementOpenInterest(uint256)"></a><code class="function-signature">incrementOpenInterest(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getOpenInterestInAttoCash()"></a><code class="function-signature">getOpenInterestInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.setMarketFinalized(contract IMarket,uint256)"></a><code class="function-signature">setMarketFinalized(contract IMarket _market, uint256 _totalSupply) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.pokeRepMarketCapInAttoCash()"></a><code class="function-signature">pokeRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getTargetRepMarketCapInAttoCash()"></a><code class="function-signature">getTargetRepMarketCapInAttoCash() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getOrCacheReportingFeeDivisor()"></a><code class="function-signature">getOrCacheReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

this should be used in contracts so that the fee is actually set




<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getReportingFeeDivisor()"></a><code class="function-signature">getReportingFeeDivisor() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

this should be used for estimation purposes as it is a view and does not actually freeze or recalculate the rate




<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getMarketOpenInterest(contract IMarket)"></a><code class="function-signature">getMarketOpenInterest(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.recordMarketCreatorFees(contract IMarket,uint256,address)"></a><code class="function-signature">recordMarketCreatorFees(contract IMarket _market, uint256 _marketCreatorFees, address _sourceAccount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getForkingMarket()"></a><code class="function-signature">getForkingMarket() <span class="return-arrow">→</span> <span class="return-type">contract IMarket</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getDisputeThresholdForDisputePacing()"></a><code class="function-signature">getDisputeThresholdForDisputePacing() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getOrCacheDesignatedReportStake()"></a><code class="function-signature">getOrCacheDesignatedReportStake() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.runPeriodicals()"></a><code class="function-signature">runPeriodicals() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getOrCacheValidityBond()"></a><code class="function-signature">getOrCacheValidityBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaUniverse.getOrCacheMarketRepBond()"></a><code class="function-signature">getOrCacheMarketRepBond() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IExchange`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IExchange.protocolFeeMultiplier()"><code class="function-signature">protocolFeeMultiplier()</code></a></li><li><a href="#IExchange.getOrderInfo(struct IExchange.Order)"><code class="function-signature">getOrderInfo(struct IExchange.Order order)</code></a></li><li><a href="#IExchange.fillOrder(struct IExchange.Order,uint256,bytes)"><code class="function-signature">fillOrder(struct IExchange.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IExchange.protocolFeeMultiplier()"></a><code class="function-signature">protocolFeeMultiplier() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IExchange.getOrderInfo(struct IExchange.Order)"></a><code class="function-signature">getOrderInfo(struct IExchange.Order order) <span class="return-arrow">→</span> <span class="return-type">struct IExchange.OrderInfo</span></code><span class="function-visibility">public</span></h4>

Gets information about an order: status, hash, and amount filled.
 @param order Order to gather information on.
 @return OrderInfo Information about the order and its state.
         See LibOrder.OrderInfo for a complete description.



<h4><a class="anchor" aria-hidden="true" id="IExchange.fillOrder(struct IExchange.Order,uint256,bytes)"></a><code class="function-signature">fillOrder(struct IExchange.Order order, uint256 takerAssetFillAmount, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct IExchange.FillResults</span></code><span class="function-visibility">public</span></h4>

Fills the input order.
 @param order Order struct containing order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signature Proof that order has been created by maker.
 @return Amounts filled and fees paid by maker and taker.





### `IFillOrder`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IFillOrder.publicFillOrder(bytes32,uint256,bytes32,bytes32)"><code class="function-signature">publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, bytes32 _fingerprint)</code></a></li><li><a href="#IFillOrder.fillOrder(address,bytes32,uint256,bytes32,bytes32)"><code class="function-signature">fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 tradeGroupId, bytes32 _fingerprint)</code></a></li><li><a href="#IFillOrder.fillZeroXOrder(contract IMarket,uint256,uint256,enum Order.Types,address,uint256,bytes32,bytes32,address)"><code class="function-signature">fillZeroXOrder(contract IMarket _market, uint256 _outcome, uint256 _price, enum Order.Types _orderType, address _creator, uint256 _amount, bytes32 _fingerprint, bytes32 _tradeGroupId, address _filler)</code></a></li><li><a href="#IFillOrder.getMarketOutcomeValues(contract IMarket)"><code class="function-signature">getMarketOutcomeValues(contract IMarket _market)</code></a></li><li><a href="#IFillOrder.getMarketVolume(contract IMarket)"><code class="function-signature">getMarketVolume(contract IMarket _market)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IFillOrder.publicFillOrder(bytes32,uint256,bytes32,bytes32)"></a><code class="function-signature">publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFillOrder.fillOrder(address,bytes32,uint256,bytes32,bytes32)"></a><code class="function-signature">fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 tradeGroupId, bytes32 _fingerprint) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFillOrder.fillZeroXOrder(contract IMarket,uint256,uint256,enum Order.Types,address,uint256,bytes32,bytes32,address)"></a><code class="function-signature">fillZeroXOrder(contract IMarket _market, uint256 _outcome, uint256 _price, enum Order.Types _orderType, address _creator, uint256 _amount, bytes32 _fingerprint, bytes32 _tradeGroupId, address _filler) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFillOrder.getMarketOutcomeValues(contract IMarket)"></a><code class="function-signature">getMarketOutcomeValues(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFillOrder.getMarketVolume(contract IMarket)"></a><code class="function-signature">getMarketVolume(contract IMarket _market) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IWETH`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IWETH.deposit()"><code class="function-signature">deposit()</code></a></li><li><a href="#IWETH.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#IWETH.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 value)</code></a></li><li><a href="#IWETH.withdraw(uint256)"><code class="function-signature">withdraw(uint256)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IWETH.deposit()"></a><code class="function-signature">deposit()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IWETH.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IWETH.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IWETH.withdraw(uint256)"></a><code class="function-signature">withdraw(uint256)</code><span class="function-visibility">external</span></h4>







### `IZeroXTrade`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IZeroXTrade.parseOrderData(struct IExchange.Order)"><code class="function-signature">parseOrderData(struct IExchange.Order _order)</code></a></li><li><a href="#IZeroXTrade.unpackTokenId(uint256)"><code class="function-signature">unpackTokenId(uint256 _tokenId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IZeroXTrade.parseOrderData(struct IExchange.Order)"></a><code class="function-signature">parseOrderData(struct IExchange.Order _order) <span class="return-arrow">→</span> <span class="return-type">struct IZeroXTrade.AugurOrderData</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IZeroXTrade.unpackTokenId(uint256)"></a><code class="function-signature">unpackTokenId(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">address,uint256,uint8,uint8</span></code><span class="function-visibility">public</span></h4>







### `LibBytes`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibBytes.equals(bytes,bytes)"><code class="function-signature">equals(bytes lhs, bytes rhs)</code></a></li><li><a href="#LibBytes.contentAddress(bytes)"><code class="function-signature">contentAddress(bytes input)</code></a></li><li><a href="#LibBytes.memCopy(uint256,uint256,uint256)"><code class="function-signature">memCopy(uint256 dest, uint256 source, uint256 length)</code></a></li><li><a href="#LibBytes.slice(bytes,uint256,uint256)"><code class="function-signature">slice(bytes b, uint256 from, uint256 to)</code></a></li><li><a href="#LibBytes.sliceDestructive(bytes,uint256,uint256)"><code class="function-signature">sliceDestructive(bytes b, uint256 from, uint256 to)</code></a></li><li><a href="#LibBytes.popLastByte(bytes)"><code class="function-signature">popLastByte(bytes b)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibBytes.equals(bytes,bytes)"></a><code class="function-signature">equals(bytes lhs, bytes rhs) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Tests equality of two byte arrays.
 @param lhs First byte array to compare.
 @param rhs Second byte array to compare.
 @return True if arrays are the same. False otherwise.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.contentAddress(bytes)"></a><code class="function-signature">contentAddress(bytes input) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Gets the memory address for the contents of a byte array.
 @param input Byte array to lookup.
 @return memoryAddress Memory address of the contents of the byte array.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.memCopy(uint256,uint256,uint256)"></a><code class="function-signature">memCopy(uint256 dest, uint256 source, uint256 length)</code><span class="function-visibility">internal</span></h4>

Copies `length` bytes from memory location `source` to `dest`.
 @param dest memory address to copy bytes to.
 @param source memory address to copy bytes from.
 @param length number of bytes to copy.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.slice(bytes,uint256,uint256)"></a><code class="function-signature">slice(bytes b, uint256 from, uint256 to) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>

Returns a slices from a byte array.
 @param b The byte array to take a slice from.
 @param from The starting index for the slice (inclusive).
 @param to The final index for the slice (exclusive).
 @return result The slice containing bytes at indices [from, to)



<h4><a class="anchor" aria-hidden="true" id="LibBytes.sliceDestructive(bytes,uint256,uint256)"></a><code class="function-signature">sliceDestructive(bytes b, uint256 from, uint256 to) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>

Returns a slice from a byte array without preserving the input.
 @param b The byte array to take a slice from. Will be destroyed in the process.
 @param from The starting index for the slice (inclusive).
 @param to The final index for the slice (exclusive).
 @return result The slice containing bytes at indices [from, to)
 @dev When `from == 0`, the original array will match the slice. In other cases its state will be corrupted.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.popLastByte(bytes)"></a><code class="function-signature">popLastByte(bytes b) <span class="return-arrow">→</span> <span class="return-type">bytes1</span></code><span class="function-visibility">internal</span></h4>

Pops the last byte off of a byte array by modifying its length.
 @param b Byte array that will be modified.
 @return The byte that was popped off.





### `ParaZeroXTrade`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ParaZeroXTrade.initialize(contract IAugur,contract IAugurTrading)"><code class="function-signature">initialize(contract IAugur _augur, contract IAugurTrading _augurTrading)</code></a></li><li><a href="#ParaZeroXTrade.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#ParaZeroXTrade.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li><a href="#ParaZeroXTrade.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address owner, uint256 id)</code></a></li><li><a href="#ParaZeroXTrade.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li><a href="#ParaZeroXTrade.bidBalance(address,contract IMarket,uint8,uint256)"><code class="function-signature">bidBalance(address _owner, contract IMarket _market, uint8 _outcome, uint256 _price)</code></a></li><li><a href="#ParaZeroXTrade.askBalance(address,contract IMarket,uint8,uint256)"><code class="function-signature">askBalance(address _owner, contract IMarket _market, uint8 _outcome, uint256 _price)</code></a></li><li><a href="#ParaZeroXTrade.cashAvailableForTransferFrom(address,address)"><code class="function-signature">cashAvailableForTransferFrom(address _owner, address _sender)</code></a></li><li><a href="#ParaZeroXTrade.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids)</code></a></li><li><a href="#ParaZeroXTrade.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li><a href="#ParaZeroXTrade.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address owner, address operator)</code></a></li><li><a href="#ParaZeroXTrade.trade(uint256,bytes32,bytes32,uint256,uint256,struct IExchange.Order[],bytes[])"><code class="function-signature">trade(uint256 _requestedFillAmount, bytes32 _fingerprint, bytes32 _tradeGroupId, uint256 _unused, uint256 _maxTrades, struct IExchange.Order[] _orders, bytes[] _signatures)</code></a></li><li><a href="#ParaZeroXTrade.fillOrderNoThrow(struct IExchange.Order,uint256,bytes,uint256)"><code class="function-signature">fillOrderNoThrow(struct IExchange.Order _order, uint256 _takerAssetFillAmount, bytes _signature, uint256 _protocolFee)</code></a></li><li><a href="#ParaZeroXTrade.getAmountIn(uint256,uint256,uint256)"><code class="function-signature">getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut)</code></a></li><li><a href="#ParaZeroXTrade.validateOrder(struct IExchange.Order,uint256)"><code class="function-signature">validateOrder(struct IExchange.Order _order, uint256 _fillAmountRemaining)</code></a></li><li><a href="#ParaZeroXTrade.isOrderAmountValid(contract IMarket,uint256)"><code class="function-signature">isOrderAmountValid(contract IMarket _market, uint256 _orderAmount)</code></a></li><li><a href="#ParaZeroXTrade.cancelOrders(struct IExchange.Order[],bytes[],uint256)"><code class="function-signature">cancelOrders(struct IExchange.Order[] _orders, bytes[] _signatures, uint256 _unused)</code></a></li><li><a href="#ParaZeroXTrade.creatorHasFundsForTrade(struct IExchange.Order,uint256)"><code class="function-signature">creatorHasFundsForTrade(struct IExchange.Order _order, uint256 _amount)</code></a></li><li><a href="#ParaZeroXTrade.getTransferFromAllowed()"><code class="function-signature">getTransferFromAllowed()</code></a></li><li><a href="#ParaZeroXTrade.encodeAssetData(contract IMarket,uint256,uint8,uint8)"><code class="function-signature">encodeAssetData(contract IMarket _market, uint256 _price, uint8 _outcome, uint8 _type)</code></a></li><li><a href="#ParaZeroXTrade.getTokenId(address,uint256,uint8,uint8)"><code class="function-signature">getTokenId(address _market, uint256 _price, uint8 _outcome, uint8 _type)</code></a></li><li><a href="#ParaZeroXTrade.unpackTokenId(uint256)"><code class="function-signature">unpackTokenId(uint256 _tokenId)</code></a></li><li><a href="#ParaZeroXTrade.decodeAssetData(bytes)"><code class="function-signature">decodeAssetData(bytes _assetData)</code></a></li><li><a href="#ParaZeroXTrade.decodeTradeAssetData(bytes)"><code class="function-signature">decodeTradeAssetData(bytes _assetData)</code></a></li><li><a href="#ParaZeroXTrade.parseOrderData(struct IExchange.Order)"><code class="function-signature">parseOrderData(struct IExchange.Order _order)</code></a></li><li><a href="#ParaZeroXTrade.getZeroXTradeTokenData(bytes)"><code class="function-signature">getZeroXTradeTokenData(bytes _assetData)</code></a></li><li><a href="#ParaZeroXTrade.getTokenIdFromOrder(struct IExchange.Order)"><code class="function-signature">getTokenIdFromOrder(struct IExchange.Order _order)</code></a></li><li><a href="#ParaZeroXTrade.createZeroXOrder(uint8,uint256,uint256,address,uint8,uint256,uint256)"><code class="function-signature">createZeroXOrder(uint8 _type, uint256 _attoshares, uint256 _price, address _market, uint8 _outcome, uint256 _expirationTimeSeconds, uint256 _salt)</code></a></li><li><a href="#ParaZeroXTrade.createZeroXOrderFor(address,uint8,uint256,uint256,address,uint8,uint256,uint256)"><code class="function-signature">createZeroXOrderFor(address _maker, uint8 _type, uint256 _attoshares, uint256 _price, address _market, uint8 _outcome, uint256 _expirationTimeSeconds, uint256 _salt)</code></a></li><li><a href="#ParaZeroXTrade.encodeEIP1271OrderWithHash(struct IExchange.Order,bytes32)"><code class="function-signature">encodeEIP1271OrderWithHash(struct IExchange.Order _zeroXOrder, bytes32 _orderHash)</code></a></li><li><a href="#ParaZeroXTrade.fallback()"><code class="function-signature">fallback()</code></a></li><li class="inherited"><a href="para#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="para#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.initialize(contract IAugur,contract IAugurTrading)"></a><code class="function-signature">initialize(contract IAugur _augur, contract IAugurTrading _augurTrading)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.safeTransferFrom(address,address,uint256,uint256,bytes)"></a><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"></a><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.balanceOf(address,uint256)"></a><code class="function-signature">balanceOf(address owner, uint256 id) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.totalSupply(uint256)"></a><code class="function-signature">totalSupply(uint256 id) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.bidBalance(address,contract IMarket,uint8,uint256)"></a><code class="function-signature">bidBalance(address _owner, contract IMarket _market, uint8 _outcome, uint256 _price) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.askBalance(address,contract IMarket,uint8,uint256)"></a><code class="function-signature">askBalance(address _owner, contract IMarket _market, uint8 _outcome, uint256 _price) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.cashAvailableForTransferFrom(address,address)"></a><code class="function-signature">cashAvailableForTransferFrom(address _owner, address _sender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.balanceOfBatch(address[],uint256[])"></a><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.setApprovalForAll(address,bool)"></a><code class="function-signature">setApprovalForAll(address operator, bool approved)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.isApprovedForAll(address,address)"></a><code class="function-signature">isApprovedForAll(address owner, address operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.trade(uint256,bytes32,bytes32,uint256,uint256,struct IExchange.Order[],bytes[])"></a><code class="function-signature">trade(uint256 _requestedFillAmount, bytes32 _fingerprint, bytes32 _tradeGroupId, uint256 _unused, uint256 _maxTrades, struct IExchange.Order[] _orders, bytes[] _signatures) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.fillOrderNoThrow(struct IExchange.Order,uint256,bytes,uint256)"></a><code class="function-signature">fillOrderNoThrow(struct IExchange.Order _order, uint256 _takerAssetFillAmount, bytes _signature, uint256 _protocolFee) <span class="return-arrow">→</span> <span class="return-type">struct IExchange.FillResults</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.getAmountIn(uint256,uint256,uint256)"></a><code class="function-signature">getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.validateOrder(struct IExchange.Order,uint256)"></a><code class="function-signature">validateOrder(struct IExchange.Order _order, uint256 _fillAmountRemaining)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.isOrderAmountValid(contract IMarket,uint256)"></a><code class="function-signature">isOrderAmountValid(contract IMarket _market, uint256 _orderAmount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.cancelOrders(struct IExchange.Order[],bytes[],uint256)"></a><code class="function-signature">cancelOrders(struct IExchange.Order[] _orders, bytes[] _signatures, uint256 _unused) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.creatorHasFundsForTrade(struct IExchange.Order,uint256)"></a><code class="function-signature">creatorHasFundsForTrade(struct IExchange.Order _order, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.getTransferFromAllowed()"></a><code class="function-signature">getTransferFromAllowed() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.encodeAssetData(contract IMarket,uint256,uint8,uint8)"></a><code class="function-signature">encodeAssetData(contract IMarket _market, uint256 _price, uint8 _outcome, uint8 _type) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Encode MultiAsset proxy asset data into the format described in the AssetProxy contract specification.
 @param _market The address of the market to trade on
 @param _price The price used to trade
 @param _outcome The outcome to trade on
 @param _type Either BID == 0 or ASK == 1
 @return AssetProxy-compliant asset data describing the set of assets.



<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.getTokenId(address,uint256,uint8,uint8)"></a><code class="function-signature">getTokenId(address _market, uint256 _price, uint8 _outcome, uint8 _type) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.unpackTokenId(uint256)"></a><code class="function-signature">unpackTokenId(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">address,uint256,uint8,uint8</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.decodeAssetData(bytes)"></a><code class="function-signature">decodeAssetData(bytes _assetData) <span class="return-arrow">→</span> <span class="return-type">bytes4,address,uint256[],uint256[],bytes</span></code><span class="function-visibility">public</span></h4>

Decode MultiAsset asset data from the format described in the AssetProxy contract specification.
 @param _assetData AssetProxy-compliant asset data describing an ERC-1155 set of assets.
 @return The ERC-1155 AssetProxy identifier, the address of this ERC-1155
 contract hosting the assets, an array of the identifiers of the
 assets to be traded, an array of asset amounts to be traded, and
 callback data.  Each element of the arrays corresponds to the
 same-indexed element of the other array.  Return values specified as
 `memory` are returned as pointers to locations within the memory of
 the input parameter `assetData`.



<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.decodeTradeAssetData(bytes)"></a><code class="function-signature">decodeTradeAssetData(bytes _assetData) <span class="return-arrow">→</span> <span class="return-type">bytes4,address,uint256[],uint256[],bytes</span></code><span class="function-visibility">public</span></h4>

Decode ERC-1155 asset data from the format described in the AssetProxy contract specification.
 @param _assetData AssetProxy-compliant asset data describing an ERC-1155 set of assets.
 @return The ERC-1155 AssetProxy identifier, the address of this ERC-1155
 contract hosting the assets, an array of the identifiers of the
 assets to be traded, an array of asset amounts to be traded, and
 callback data.  Each element of the arrays corresponds to the
 same-indexed element of the other array.  Return values specified as
 `memory` are returned as pointers to locations within the memory of
 the input parameter `assetData`.



<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.parseOrderData(struct IExchange.Order)"></a><code class="function-signature">parseOrderData(struct IExchange.Order _order) <span class="return-arrow">→</span> <span class="return-type">struct IZeroXTrade.AugurOrderData</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.getZeroXTradeTokenData(bytes)"></a><code class="function-signature">getZeroXTradeTokenData(bytes _assetData) <span class="return-arrow">→</span> <span class="return-type">contract IERC1155,uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.getTokenIdFromOrder(struct IExchange.Order)"></a><code class="function-signature">getTokenIdFromOrder(struct IExchange.Order _order) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.createZeroXOrder(uint8,uint256,uint256,address,uint8,uint256,uint256)"></a><code class="function-signature">createZeroXOrder(uint8 _type, uint256 _attoshares, uint256 _price, address _market, uint8 _outcome, uint256 _expirationTimeSeconds, uint256 _salt) <span class="return-arrow">→</span> <span class="return-type">struct IExchange.Order,bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.createZeroXOrderFor(address,uint8,uint256,uint256,address,uint8,uint256,uint256)"></a><code class="function-signature">createZeroXOrderFor(address _maker, uint8 _type, uint256 _attoshares, uint256 _price, address _market, uint8 _outcome, uint256 _expirationTimeSeconds, uint256 _salt) <span class="return-arrow">→</span> <span class="return-type">struct IExchange.Order,bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.encodeEIP1271OrderWithHash(struct IExchange.Order,bytes32)"></a><code class="function-signature">encodeEIP1271OrderWithHash(struct IExchange.Order _zeroXOrder, bytes32 _orderHash) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ParaZeroXTrade.fallback()"></a><code class="function-signature">fallback()</code><span class="function-visibility">external</span></h4>







### `WETH9`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#WETH9.fallback()"><code class="function-signature">fallback()</code></a></li><li><a href="#WETH9.deposit()"><code class="function-signature">deposit()</code></a></li><li><a href="#WETH9.withdraw(uint256)"><code class="function-signature">withdraw(uint256 wad)</code></a></li><li><a href="#WETH9.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#WETH9.approve(address,uint256)"><code class="function-signature">approve(address guy, uint256 wad)</code></a></li><li><a href="#WETH9.transfer(address,uint256)"><code class="function-signature">transfer(address dst, uint256 wad)</code></a></li><li><a href="#WETH9.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address src, address dst, uint256 wad)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#WETH9.Approval(address,address,uint256)"><code class="function-signature">Approval(address _owner, address _spender, uint256 _value)</code></a></li><li><a href="#WETH9.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#WETH9.Deposit(address,uint256)"><code class="function-signature">Deposit(address _owner, uint256 _value)</code></a></li><li><a href="#WETH9.Withdrawal(address,uint256)"><code class="function-signature">Withdrawal(address _owner, uint256 _value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="WETH9.fallback()"></a><code class="function-signature">fallback()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WETH9.deposit()"></a><code class="function-signature">deposit()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WETH9.withdraw(uint256)"></a><code class="function-signature">withdraw(uint256 wad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WETH9.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WETH9.approve(address,uint256)"></a><code class="function-signature">approve(address guy, uint256 wad) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WETH9.transfer(address,uint256)"></a><code class="function-signature">transfer(address dst, uint256 wad) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WETH9.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address src, address dst, uint256 wad) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="WETH9.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address _owner, address _spender, uint256 _value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="WETH9.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address _from, address _to, uint256 _value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="WETH9.Deposit(address,uint256)"></a><code class="function-signature">Deposit(address _owner, uint256 _value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="WETH9.Withdrawal(address,uint256)"></a><code class="function-signature">Withdrawal(address _owner, uint256 _value)</code><span class="function-visibility"></span></h4>





### `WethWrapperForAMMExchange`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#WethWrapperForAMMExchange.constructor(contract IAMMExchange,contract WETH9)"><code class="function-signature">constructor(contract IAMMExchange _amm, contract WETH9 _weth)</code></a></li><li><a href="#WethWrapperForAMMExchange.addLiquidity(address)"><code class="function-signature">addLiquidity(address recipient)</code></a></li><li><a href="#WethWrapperForAMMExchange.addInitialLiquidity(uint256,bool,address)"><code class="function-signature">addInitialLiquidity(uint256 _ratioFactor, bool _keepYes, address _recipient)</code></a></li><li><a href="#WethWrapperForAMMExchange.removeLiquidity(uint256,uint256)"><code class="function-signature">removeLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold)</code></a></li><li><a href="#WethWrapperForAMMExchange.enterPosition(bool,uint256)"><code class="function-signature">enterPosition(bool _buyYes, uint256 _minShares)</code></a></li><li><a href="#WethWrapperForAMMExchange.exitPosition(uint256,uint256,uint256,uint256)"><code class="function-signature">exitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout)</code></a></li><li><a href="#WethWrapperForAMMExchange.exitAll(uint256)"><code class="function-signature">exitAll(uint256 _minCashPayout)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="WethWrapperForAMMExchange.constructor(contract IAMMExchange,contract WETH9)"></a><code class="function-signature">constructor(contract IAMMExchange _amm, contract WETH9 _weth)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WethWrapperForAMMExchange.addLiquidity(address)"></a><code class="function-signature">addLiquidity(address recipient) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WethWrapperForAMMExchange.addInitialLiquidity(uint256,bool,address)"></a><code class="function-signature">addInitialLiquidity(uint256 _ratioFactor, bool _keepYes, address _recipient) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WethWrapperForAMMExchange.removeLiquidity(uint256,uint256)"></a><code class="function-signature">removeLiquidity(uint256 _poolTokensToSell, uint256 _minSetsSold) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WethWrapperForAMMExchange.enterPosition(bool,uint256)"></a><code class="function-signature">enterPosition(bool _buyYes, uint256 _minShares) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WethWrapperForAMMExchange.exitPosition(uint256,uint256,uint256,uint256)"></a><code class="function-signature">exitPosition(uint256 _invalidShares, uint256 _noShares, uint256 _yesShares, uint256 _minCashPayout) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="WethWrapperForAMMExchange.exitAll(uint256)"></a><code class="function-signature">exitAll(uint256 _minCashPayout) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







</div>