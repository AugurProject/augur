---
title: Matic
---

<div class="contracts">

## Contracts

### `IOwnable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOwnable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOwnable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Ownable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li><a href="#Ownable.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Ownable.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>

The Ownable constructor sets the original `owner` of the contract to the sender
account.



<h4><a class="anchor" aria-hidden="true" id="Ownable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Ownable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Allows the current owner to transfer control of the contract to a newOwner.




<h4><a class="anchor" aria-hidden="true" id="Ownable.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







### `PredicateRegistry`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#PredicateRegistry.mapMarket(address,address,uint256,uint256)"><code class="function-signature">mapMarket(address childMarket, address rootMarket, uint256 numOutcomes, uint256 numTicks)</code></a></li><li><a href="#PredicateRegistry.setZeroXTrade(address)"><code class="function-signature">setZeroXTrade(address _zeroXTrade)</code></a></li><li><a href="#PredicateRegistry.setRootZeroXTrade(address)"><code class="function-signature">setRootZeroXTrade(address _zeroXTrade)</code></a></li><li><a href="#PredicateRegistry.setZeroXExchange(address,address,bool)"><code class="function-signature">setZeroXExchange(address childExchange, address rootExchange, bool isDefaultExchange)</code></a></li><li><a href="#PredicateRegistry.setCash(address)"><code class="function-signature">setCash(address _cash)</code></a></li><li><a href="#PredicateRegistry.setShareToken(address)"><code class="function-signature">setShareToken(address _shareToken)</code></a></li><li><a href="#PredicateRegistry.getDeprecationType(address)"><code class="function-signature">getDeprecationType(address addr)</code></a></li><li><a href="#PredicateRegistry.getContractType(address)"><code class="function-signature">getContractType(address addr)</code></a></li><li><a href="#PredicateRegistry.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li class="inherited"><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="PredicateRegistry.mapMarket(address,address,uint256,uint256)"></a><code class="function-signature">mapMarket(address childMarket, address rootMarket, uint256 numOutcomes, uint256 numTicks)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PredicateRegistry.setZeroXTrade(address)"></a><code class="function-signature">setZeroXTrade(address _zeroXTrade)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PredicateRegistry.setRootZeroXTrade(address)"></a><code class="function-signature">setRootZeroXTrade(address _zeroXTrade)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PredicateRegistry.setZeroXExchange(address,address,bool)"></a><code class="function-signature">setZeroXExchange(address childExchange, address rootExchange, bool isDefaultExchange)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PredicateRegistry.setCash(address)"></a><code class="function-signature">setCash(address _cash)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PredicateRegistry.setShareToken(address)"></a><code class="function-signature">setShareToken(address _shareToken)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PredicateRegistry.getDeprecationType(address)"></a><code class="function-signature">getDeprecationType(address addr) <span class="return-arrow">→</span> <span class="return-type">enum PredicateRegistry.DeprecationType</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PredicateRegistry.getContractType(address)"></a><code class="function-signature">getContractType(address addr) <span class="return-arrow">→</span> <span class="return-type">enum PredicateRegistry.ContractType</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PredicateRegistry.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







### `BaseStateSyncVerifier`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BaseStateSyncVerifier.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#BaseStateSyncVerifier.isOnlyStateSyncerContract()"><code class="function-signature">isOnlyStateSyncerContract()</code></a></li><li><a href="#BaseStateSyncVerifier.changeStateSyncerAddress(address)"><code class="function-signature">changeStateSyncerAddress(address newAddress)</code></a></li><li><a href="#BaseStateSyncVerifier.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li class="inherited"><a href="matic#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="matic#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#BaseStateSyncVerifier.StateSyncerAddressChanged(address,address)"><code class="function-signature">StateSyncerAddressChanged(address previousAddress, address newAddress)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BaseStateSyncVerifier.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BaseStateSyncVerifier.isOnlyStateSyncerContract()"></a><code class="function-signature">isOnlyStateSyncerContract() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Returns true if the caller is the state syncer contract
TODO: replace onlyOwner ownership with 0x1000 for validator majority



<h4><a class="anchor" aria-hidden="true" id="BaseStateSyncVerifier.changeStateSyncerAddress(address)"></a><code class="function-signature">changeStateSyncerAddress(address newAddress)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BaseStateSyncVerifier.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="BaseStateSyncVerifier.StateSyncerAddressChanged(address,address)"></a><code class="function-signature">StateSyncerAddressChanged(address previousAddress, address newAddress)</code><span class="function-visibility"></span></h4>





### `ERC20`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li><a href="#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li><a href="#ERC20.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li><a href="#ERC20.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li><a href="#ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li><a href="#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li><a href="#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li><a href="#ERC20._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li><a href="#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li><a href="#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li><a href="#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li><a href="#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li><a href="#ERC20.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="matic#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="matic#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="matic#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



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





### `IStateReceiver`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IStateReceiver.onStateReceive(uint256,bytes)"><code class="function-signature">onStateReceive(uint256 id, bytes data)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IStateReceiver.onStateReceive(uint256,bytes)"></a><code class="function-signature">onStateReceive(uint256 id, bytes data)</code><span class="function-visibility">external</span></h4>







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







### `TradingCash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#TradingCash.constructor(address)"><code class="function-signature">constructor(address _rootToken)</code></a></li><li><a href="#TradingCash.setWhitelistedSpender(address,bool)"><code class="function-signature">setWhitelistedSpender(address _spender, bool _value)</code></a></li><li><a href="#TradingCash.changeChildChain(address)"><code class="function-signature">changeChildChain(address newAddress)</code></a></li><li><a href="#TradingCash.deposit(address,uint256)"><code class="function-signature">deposit(address user, uint256 amount)</code></a></li><li><a href="#TradingCash.withdraw(uint256)"><code class="function-signature">withdraw(uint256 amount)</code></a></li><li><a href="#TradingCash.onStateReceive(uint256,bytes)"><code class="function-signature">onStateReceive(uint256, bytes data)</code></a></li><li><a href="#TradingCash.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount)</code></a></li><li><a href="#TradingCash._transfer(address,address,uint256)"><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code></a></li><li><a href="#TradingCash.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#TradingCash.allowance(address,address)"><code class="function-signature">allowance(address, address _sender)</code></a></li><li><a href="#TradingCash.approve(address,uint256)"><code class="function-signature">approve(address, uint256)</code></a></li><li class="inherited"><a href="matic#ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address _account)</code></a></li><li class="inherited"><a href="matic#ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="matic#ERC20.increaseAllowance(address,uint256)"><code class="function-signature">increaseAllowance(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="matic#ERC20.decreaseAllowance(address,uint256)"><code class="function-signature">decreaseAllowance(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="matic#ERC20._mint(address,uint256)"><code class="function-signature">_mint(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="matic#ERC20._burn(address,uint256)"><code class="function-signature">_burn(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="matic#ERC20._approve(address,address,uint256)"><code class="function-signature">_approve(address _owner, address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="matic#ERC20._burnFrom(address,uint256)"><code class="function-signature">_burnFrom(address _account, uint256 _amount)</code></a></li><li class="inherited"><a href="matic#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="matic#BaseStateSyncVerifier.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="matic#BaseStateSyncVerifier.isOnlyStateSyncerContract()"><code class="function-signature">isOnlyStateSyncerContract()</code></a></li><li class="inherited"><a href="matic#BaseStateSyncVerifier.changeStateSyncerAddress(address)"><code class="function-signature">changeStateSyncerAddress(address newAddress)</code></a></li><li class="inherited"><a href="matic#BaseStateSyncVerifier.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li class="inherited"><a href="matic#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="matic#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#TradingCash.Deposit(address,address,uint256,uint256,uint256)"><code class="function-signature">Deposit(address token, address from, uint256 amount, uint256 input1, uint256 output1)</code></a></li><li><a href="#TradingCash.Withdraw(address,address,uint256,uint256,uint256)"><code class="function-signature">Withdraw(address token, address from, uint256 amount, uint256 input1, uint256 output1)</code></a></li><li><a href="#TradingCash.LogTransfer(address,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">LogTransfer(address token, address from, address to, uint256 amount, uint256 input1, uint256 input2, uint256 output1, uint256 output2)</code></a></li><li><a href="#TradingCash.ChildChainChanged(address,address)"><code class="function-signature">ChildChainChanged(address previousAddress, address newAddress)</code></a></li><li class="inherited"><a href="matic#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="matic#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="matic#BaseStateSyncVerifier.StateSyncerAddressChanged(address,address)"><code class="function-signature">StateSyncerAddressChanged(address previousAddress, address newAddress)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="TradingCash.constructor(address)"></a><code class="function-signature">constructor(address _rootToken)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.setWhitelistedSpender(address,bool)"></a><code class="function-signature">setWhitelistedSpender(address _spender, bool _value)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.changeChildChain(address)"></a><code class="function-signature">changeChildChain(address newAddress)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.deposit(address,uint256)"></a><code class="function-signature">deposit(address user, uint256 amount)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.withdraw(uint256)"></a><code class="function-signature">withdraw(uint256 amount)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.onStateReceive(uint256,bytes)"></a><code class="function-signature">onStateReceive(uint256, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address _sender, address _recipient, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Override it to check if the sender is whitelisted



<h4><a class="anchor" aria-hidden="true" id="TradingCash._transfer(address,address,uint256)"></a><code class="function-signature">_transfer(address _sender, address _recipient, uint256 _amount)</code><span class="function-visibility">internal</span></h4>

Override to emit additional logs for proof creation



<h4><a class="anchor" aria-hidden="true" id="TradingCash.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.allowance(address,address)"></a><code class="function-signature">allowance(address, address _sender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.approve(address,uint256)"></a><code class="function-signature">approve(address, uint256) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="TradingCash.Deposit(address,address,uint256,uint256,uint256)"></a><code class="function-signature">Deposit(address token, address from, uint256 amount, uint256 input1, uint256 output1)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.Withdraw(address,address,uint256,uint256,uint256)"></a><code class="function-signature">Withdraw(address token, address from, uint256 amount, uint256 input1, uint256 output1)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.LogTransfer(address,address,address,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">LogTransfer(address token, address from, address to, uint256 amount, uint256 input1, uint256 input2, uint256 output1, uint256 output2)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="TradingCash.ChildChainChanged(address,address)"></a><code class="function-signature">ChildChainChanged(address previousAddress, address newAddress)</code><span class="function-visibility"></span></h4>





</div>