---
title: Gsn
---

<div class="contracts">

## Contracts

### `ECDSA`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ECDSA.recover(bytes32,bytes)"><code class="function-signature">recover(bytes32 hash, bytes signature)</code></a></li><li><a href="#ECDSA.toEthSignedMessageHash(bytes32)"><code class="function-signature">toEthSignedMessageHash(bytes32 hash)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ECDSA.recover(bytes32,bytes)"></a><code class="function-signature">recover(bytes32 hash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

Returns the address that signed a hashed message (`hash`) with
`signature`. This address can then be used for verification purposes.

The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
this function rejects them by requiring the `s` value to be in the lower
half order, and the `v` value to be either 27 or 28.

(.note) This call _does not revert_ if the signature is invalid, or
if the signer is otherwise unable to be retrieved. In those scenarios,
the zero address is returned.

(.warning) `hash` _must_ be the result of a hash operation for the
verification to be secure: it is possible to craft signatures that
recover to arbitrary addresses for non-hashed data. A safe way to ensure
this is by receiving a hash of the original message (which may otherwise)
be too long), and then calling [`toEthSignedMessageHash`](#ECDSA.toEthSignedMessageHash(bytes32)) on it.



<h4><a class="anchor" aria-hidden="true" id="ECDSA.toEthSignedMessageHash(bytes32)"></a><code class="function-signature">toEthSignedMessageHash(bytes32 hash) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>

Returns an Ethereum Signed Message, created from a `hash`. This
replicates the behavior of the
[`eth_sign`](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign)
JSON-RPC method.

See [`recover`](#ECDSA.recover(bytes32,bytes)).





### `GsnUtils`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#GsnUtils.getMethodSig(bytes)"><code class="function-signature">getMethodSig(bytes msgData)</code></a></li><li><a href="#GsnUtils.getParam(bytes,uint256)"><code class="function-signature">getParam(bytes msgData, uint256 index)</code></a></li><li><a href="#GsnUtils.getBytesParam(bytes,uint256)"><code class="function-signature">getBytesParam(bytes msgData, uint256 index)</code></a></li><li><a href="#GsnUtils.getStringParam(bytes,uint256)"><code class="function-signature">getStringParam(bytes msgData, uint256 index)</code></a></li><li><a href="#GsnUtils.checkSig(address,bytes32,bytes)"><code class="function-signature">checkSig(address signer, bytes32 hash, bytes sig)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="GsnUtils.getMethodSig(bytes)"></a><code class="function-signature">getMethodSig(bytes msgData) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GsnUtils.getParam(bytes,uint256)"></a><code class="function-signature">getParam(bytes msgData, uint256 index) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GsnUtils.getBytesParam(bytes,uint256)"></a><code class="function-signature">getBytesParam(bytes msgData, uint256 index) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GsnUtils.getStringParam(bytes,uint256)"></a><code class="function-signature">getStringParam(bytes msgData, uint256 index) <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GsnUtils.checkSig(address,bytes32,bytes)"></a><code class="function-signature">checkSig(address signer, bytes32 hash, bytes sig) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `IRelayHub`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IRelayHub.stake(address,uint256)"><code class="function-signature">stake(address relayaddr, uint256 unstakeDelay)</code></a></li><li><a href="#IRelayHub.registerRelay(uint256,string)"><code class="function-signature">registerRelay(uint256 transactionFee, string url)</code></a></li><li><a href="#IRelayHub.removeRelayByOwner(address)"><code class="function-signature">removeRelayByOwner(address relay)</code></a></li><li><a href="#IRelayHub.unstake(address)"><code class="function-signature">unstake(address relay)</code></a></li><li><a href="#IRelayHub.getRelay(address)"><code class="function-signature">getRelay(address relay)</code></a></li><li><a href="#IRelayHub.depositFor(address)"><code class="function-signature">depositFor(address target)</code></a></li><li><a href="#IRelayHub.balanceOf(address)"><code class="function-signature">balanceOf(address target)</code></a></li><li><a href="#IRelayHub.withdraw(uint256,address payable)"><code class="function-signature">withdraw(uint256 amount, address payable dest)</code></a></li><li><a href="#IRelayHub.canRelay(address,address,address,bytes,uint256,uint256,uint256,uint256,bytes,bytes)"><code class="function-signature">canRelay(address relay, address from, address to, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes signature, bytes approvalData)</code></a></li><li><a href="#IRelayHub.relayCall(address,address,bytes,uint256,uint256,uint256,uint256,bytes,bytes)"><code class="function-signature">relayCall(address from, address to, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes signature, bytes approvalData)</code></a></li><li><a href="#IRelayHub.requiredGas(uint256)"><code class="function-signature">requiredGas(uint256 relayedCallStipend)</code></a></li><li><a href="#IRelayHub.maxPossibleCharge(uint256,uint256,uint256)"><code class="function-signature">maxPossibleCharge(uint256 relayedCallStipend, uint256 gasPrice, uint256 transactionFee)</code></a></li><li><a href="#IRelayHub.penalizeRepeatedNonce(bytes,bytes,bytes,bytes)"><code class="function-signature">penalizeRepeatedNonce(bytes unsignedTx1, bytes signature1, bytes unsignedTx2, bytes signature2)</code></a></li><li><a href="#IRelayHub.penalizeIllegalTransaction(bytes,bytes)"><code class="function-signature">penalizeIllegalTransaction(bytes unsignedTx, bytes signature)</code></a></li><li><a href="#IRelayHub.getNonce(address)"><code class="function-signature">getNonce(address from)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IRelayHub.Staked(address,uint256,uint256)"><code class="function-signature">Staked(address relay, uint256 stake, uint256 unstakeDelay)</code></a></li><li><a href="#IRelayHub.RelayAdded(address,address,uint256,uint256,uint256,string)"><code class="function-signature">RelayAdded(address relay, address owner, uint256 transactionFee, uint256 stake, uint256 unstakeDelay, string url)</code></a></li><li><a href="#IRelayHub.RelayRemoved(address,uint256)"><code class="function-signature">RelayRemoved(address relay, uint256 unstakeTime)</code></a></li><li><a href="#IRelayHub.Unstaked(address,uint256)"><code class="function-signature">Unstaked(address relay, uint256 stake)</code></a></li><li><a href="#IRelayHub.Deposited(address,address,uint256)"><code class="function-signature">Deposited(address recipient, address from, uint256 amount)</code></a></li><li><a href="#IRelayHub.Withdrawn(address,address,uint256)"><code class="function-signature">Withdrawn(address account, address dest, uint256 amount)</code></a></li><li><a href="#IRelayHub.CanRelayFailed(address,address,address,bytes4,uint256)"><code class="function-signature">CanRelayFailed(address relay, address from, address to, bytes4 selector, uint256 reason)</code></a></li><li><a href="#IRelayHub.TransactionRelayed(address,address,address,bytes4,enum IRelayHub.RelayCallStatus,uint256)"><code class="function-signature">TransactionRelayed(address relay, address from, address to, bytes4 selector, enum IRelayHub.RelayCallStatus status, uint256 charge)</code></a></li><li><a href="#IRelayHub.Penalized(address,address,uint256)"><code class="function-signature">Penalized(address relay, address sender, uint256 amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.stake(address,uint256)"></a><code class="function-signature">stake(address relayaddr, uint256 unstakeDelay)</code><span class="function-visibility">external</span></h4>

Adds stake to a relay and sets its `unstakeDelay`. If the relay does not exist, it is created, and the caller
of this function becomes its owner. If the relay already exists, only the owner can call this function. A relay
cannot be its own owner.

All Ether in this function call will be added to the relay&#x27;s stake.
Its unstake delay will be assigned to `unstakeDelay`, but the new value must be greater or equal to the current one.

Emits a {Staked} event.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.registerRelay(uint256,string)"></a><code class="function-signature">registerRelay(uint256 transactionFee, string url)</code><span class="function-visibility">external</span></h4>

Registers the caller as a relay.
The relay must be staked for, and not be a contract (i.e. this function must be called directly from an EOA).

This function can be called multiple times, emitting new {RelayAdded} events. Note that the received
`transactionFee` is not enforced by {relayCall}.

Emits a {RelayAdded} event.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.removeRelayByOwner(address)"></a><code class="function-signature">removeRelayByOwner(address relay)</code><span class="function-visibility">external</span></h4>

Removes (deregisters) a relay. Unregistered (but staked for) relays can also be removed.

Can only be called by the owner of the relay. After the relay&#x27;s `unstakeDelay` has elapsed, {unstake} will be
callable.

Emits a {RelayRemoved} event.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.unstake(address)"></a><code class="function-signature">unstake(address relay)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IRelayHub.getRelay(address)"></a><code class="function-signature">getRelay(address relay) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,address payable,enum IRelayHub.RelayState</span></code><span class="function-visibility">external</span></h4>

Returns a relay&#x27;s status. Note that relays can be deleted when unstaked or penalized, causing this function
to return an empty entry.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.depositFor(address)"></a><code class="function-signature">depositFor(address target)</code><span class="function-visibility">external</span></h4>

Deposits Ether for a contract, so that it can receive (and pay for) relayed transactions.

Unused balance can only be withdrawn by the contract itself, by calling {withdraw}.

Emits a {Deposited} event.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.balanceOf(address)"></a><code class="function-signature">balanceOf(address target) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns an account&#x27;s deposits. These can be either a contracts&#x27;s funds, or a relay owner&#x27;s revenue.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.withdraw(uint256,address payable)"></a><code class="function-signature">withdraw(uint256 amount, address payable dest)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IRelayHub.canRelay(address,address,address,bytes,uint256,uint256,uint256,uint256,bytes,bytes)"></a><code class="function-signature">canRelay(address relay, address from, address to, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes signature, bytes approvalData) <span class="return-arrow">→</span> <span class="return-type">uint256,bytes</span></code><span class="function-visibility">external</span></h4>

Checks if the [`RelayHub`](#relayhub) will accept a relayed operation.
Multiple things must be true for this to happen:
 - all arguments must be signed for by the sender (`from`)
 - the sender&#x27;s nonce must be the current one
 - the recipient must accept this transaction (via {acceptRelayedCall})

Returns a `PreconditionCheck` value (`OK` when the transaction can be relayed), or a recipient-specific error
code if it returns one in {acceptRelayedCall}.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.relayCall(address,address,bytes,uint256,uint256,uint256,uint256,bytes,bytes)"></a><code class="function-signature">relayCall(address from, address to, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes signature, bytes approvalData)</code><span class="function-visibility">external</span></h4>

Relays a transaction.

For this to succeed, multiple conditions must be met:
 - {canRelay} must `return PreconditionCheck.OK`
 - the sender must be a registered relay
 - the transaction&#x27;s gas price must be larger or equal to the one that was requested by the sender
 - the transaction must have enough gas to not run out of gas if all internal transactions (calls to the
recipient) use all gas available to them
 - the recipient must have enough balance to pay the relay for the worst-case scenario (i.e. when all gas is
spent)

If all conditions are met, the call will be relayed and the recipient charged. {preRelayedCall}, the encoded
function and {postRelayedCall} will be called in that order.

Parameters:
 - `from`: the client originating the request
 - `to`: the target {IRelayRecipient} contract
 - `encodedFunction`: the function call to relay, including data
 - `transactionFee`: fee (%) the relay takes over actual gas cost
 - `gasPrice`: gas price the client is willing to pay
 - `gasLimit`: gas to forward when calling the encoded function
 - `nonce`: client&#x27;s nonce
 - `signature`: client&#x27;s signature over all previous params, plus the relay and RelayHub addresses
 - `approvalData`: dapp-specific data forwared to {acceptRelayedCall}. This value is *not* verified by the
[`RelayHub`](#relayhub), but it still can be used for e.g. a signature.

Emits a {TransactionRelayed} event.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.requiredGas(uint256)"></a><code class="function-signature">requiredGas(uint256 relayedCallStipend) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns how much gas should be forwarded to a call to {relayCall}, in order to relay a transaction that will
spend up to `relayedCallStipend` gas.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.maxPossibleCharge(uint256,uint256,uint256)"></a><code class="function-signature">maxPossibleCharge(uint256 relayedCallStipend, uint256 gasPrice, uint256 transactionFee) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns the maximum recipient charge, given the amount of gas forwarded, gas price and relay fee.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.penalizeRepeatedNonce(bytes,bytes,bytes,bytes)"></a><code class="function-signature">penalizeRepeatedNonce(bytes unsignedTx1, bytes signature1, bytes unsignedTx2, bytes signature2)</code><span class="function-visibility">external</span></h4>

Penalize a relay that signed two transactions using the same nonce (making only the first one valid) and
different data (gas price, gas limit, etc. may be different).

The (unsigned) transaction data and signature for both transactions must be provided.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.penalizeIllegalTransaction(bytes,bytes)"></a><code class="function-signature">penalizeIllegalTransaction(bytes unsignedTx, bytes signature)</code><span class="function-visibility">external</span></h4>

Penalize a relay that sent a transaction that didn&#x27;t target [`RelayHub`](#relayhub)&#x27;s {registerRelay} or {relayCall}.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.getNonce(address)"></a><code class="function-signature">getNonce(address from) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns an account&#x27;s nonce in [`RelayHub`](#relayhub).





<h4><a class="anchor" aria-hidden="true" id="IRelayHub.Staked(address,uint256,uint256)"></a><code class="function-signature">Staked(address relay, uint256 stake, uint256 unstakeDelay)</code><span class="function-visibility"></span></h4>

Emitted when a relay&#x27;s stake or unstakeDelay are increased



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.RelayAdded(address,address,uint256,uint256,uint256,string)"></a><code class="function-signature">RelayAdded(address relay, address owner, uint256 transactionFee, uint256 stake, uint256 unstakeDelay, string url)</code><span class="function-visibility"></span></h4>

Emitted when a relay is registered or re-registerd. Looking at these events (and filtering out
{RelayRemoved} events) lets a client discover the list of available relays.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.RelayRemoved(address,uint256)"></a><code class="function-signature">RelayRemoved(address relay, uint256 unstakeTime)</code><span class="function-visibility"></span></h4>

Emitted when a relay is removed (deregistered). `unstakeTime` is the time when unstake will be callable.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.Unstaked(address,uint256)"></a><code class="function-signature">Unstaked(address relay, uint256 stake)</code><span class="function-visibility"></span></h4>

Emitted when a relay is unstaked for, including the returned stake.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.Deposited(address,address,uint256)"></a><code class="function-signature">Deposited(address recipient, address from, uint256 amount)</code><span class="function-visibility"></span></h4>

Emitted when {depositFor} is called, including the amount and account that was funded.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.Withdrawn(address,address,uint256)"></a><code class="function-signature">Withdrawn(address account, address dest, uint256 amount)</code><span class="function-visibility"></span></h4>

Emitted when an account withdraws funds from [`RelayHub`](#relayhub).



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.CanRelayFailed(address,address,address,bytes4,uint256)"></a><code class="function-signature">CanRelayFailed(address relay, address from, address to, bytes4 selector, uint256 reason)</code><span class="function-visibility"></span></h4>

Emitted when an attempt to relay a call failed.

This can happen due to incorrect {relayCall} arguments, or the recipient not accepting the relayed call. The
actual relayed call was not executed, and the recipient not charged.

The `reason` parameter contains an error code: values 1-10 correspond to `PreconditionCheck` entries, and values
over 10 are custom recipient error codes returned from {acceptRelayedCall}.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.TransactionRelayed(address,address,address,bytes4,enum IRelayHub.RelayCallStatus,uint256)"></a><code class="function-signature">TransactionRelayed(address relay, address from, address to, bytes4 selector, enum IRelayHub.RelayCallStatus status, uint256 charge)</code><span class="function-visibility"></span></h4>

Emitted when a transaction is relayed.
Useful when monitoring a relay&#x27;s operation and relayed calls to a contract

Note that the actual encoded function might be reverted: this is indicated in the `status` parameter.

`charge` is the Ether value deducted from the recipient&#x27;s balance, paid to the relay&#x27;s owner.



<h4><a class="anchor" aria-hidden="true" id="IRelayHub.Penalized(address,address,uint256)"></a><code class="function-signature">Penalized(address relay, address sender, uint256 amount)</code><span class="function-visibility"></span></h4>

Emitted when a relay is penalized.



### `IRelayRecipient`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IRelayRecipient.getHubAddr()"><code class="function-signature">getHubAddr()</code></a></li><li><a href="#IRelayRecipient.acceptRelayedCall(address,address,bytes,uint256,uint256,uint256,uint256,bytes,uint256)"><code class="function-signature">acceptRelayedCall(address relay, address from, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes approvalData, uint256 maxPossibleCharge)</code></a></li><li><a href="#IRelayRecipient.preRelayedCall(bytes)"><code class="function-signature">preRelayedCall(bytes context)</code></a></li><li><a href="#IRelayRecipient.postRelayedCall(bytes,bool,uint256,bytes32)"><code class="function-signature">postRelayedCall(bytes context, bool success, uint256 actualCharge, bytes32 preRetVal)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IRelayRecipient.getHubAddr()"></a><code class="function-signature">getHubAddr() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Returns the address of the {IRelayHub} instance this recipient interacts with.



<h4><a class="anchor" aria-hidden="true" id="IRelayRecipient.acceptRelayedCall(address,address,bytes,uint256,uint256,uint256,uint256,bytes,uint256)"></a><code class="function-signature">acceptRelayedCall(address relay, address from, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes approvalData, uint256 maxPossibleCharge) <span class="return-arrow">→</span> <span class="return-type">uint256,bytes</span></code><span class="function-visibility">external</span></h4>

Called by {IRelayHub} to validate if this recipient accepts being charged for a relayed call. Note that the
recipient will be charged regardless of the execution result of the relayed call (i.e. if it reverts or not).

The relay request was originated by `from` and will be served by `relay`. `encodedFunction` is the relayed call
calldata, so its first four bytes are the function selector. The relayed call will be forwarded `gasLimit` gas,
and the transaction executed with a gas price of at least `gasPrice`. `relay`&#x27;s fee is `transactionFee`, and the
recipient will be charged at most `maxPossibleCharge` (in wei). `nonce` is the sender&#x27;s (`from`) nonce for
replay attack protection in {IRelayHub}, and `approvalData` is a optional parameter that can be used to hold a signature
over all or some of the previous values.

Returns a tuple, where the first value is used to indicate approval (0) or rejection (custom non-zero error code,
values 1 to 10 are reserved) and the second one is data to be passed to the other {IRelayRecipient} functions.

{acceptRelayedCall} is called with 50k gas: if it runs out during execution, the request will be considered
rejected. A regular revert will also trigger a rejection.



<h4><a class="anchor" aria-hidden="true" id="IRelayRecipient.preRelayedCall(bytes)"></a><code class="function-signature">preRelayedCall(bytes context) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>

Called by {IRelayHub} on approved relay call requests, before the relayed call is executed. This allows to e.g.
pre-charge the sender of the transaction.

`context` is the second value returned in the tuple by {acceptRelayedCall}.

Returns a value to be passed to {postRelayedCall}.

{preRelayedCall} is called with 100k gas: if it runs out during exection or otherwise reverts, the relayed call
will not be executed, but the recipient will still be charged for the transaction&#x27;s cost.



<h4><a class="anchor" aria-hidden="true" id="IRelayRecipient.postRelayedCall(bytes,bool,uint256,bytes32)"></a><code class="function-signature">postRelayedCall(bytes context, bool success, uint256 actualCharge, bytes32 preRetVal)</code><span class="function-visibility">external</span></h4>

Called by {IRelayHub} on approved relay call requests, after the relayed call is executed. This allows to e.g.
charge the user for the relayed call costs, return any overcharges from {preRelayedCall}, or perform
contract-specific bookkeeping.

`context` is the second value returned in the tuple by {acceptRelayedCall}. `success` is the execution status of
the relayed call. `actualCharge` is an estimate of how much the recipient will be charged for the transaction,
not including any gas used by {postRelayedCall} itself. `preRetVal` is {preRelayedCall}&#x27;s return value.

{postRelayedCall} is called with 100k gas: if it runs out during execution or otherwise reverts, the relayed call
and the call to {preRelayedCall} will be reverted retroactively, but the recipient will still be charged for the
transaction&#x27;s cost.





### `LibBytes`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibBytes.rawAddress(bytes)"><code class="function-signature">rawAddress(bytes input)</code></a></li><li><a href="#LibBytes.contentAddress(bytes)"><code class="function-signature">contentAddress(bytes input)</code></a></li><li><a href="#LibBytes.memCopy(uint256,uint256,uint256)"><code class="function-signature">memCopy(uint256 dest, uint256 source, uint256 length)</code></a></li><li><a href="#LibBytes.slice(bytes,uint256,uint256)"><code class="function-signature">slice(bytes b, uint256 from, uint256 to)</code></a></li><li><a href="#LibBytes.sliceDestructive(bytes,uint256,uint256)"><code class="function-signature">sliceDestructive(bytes b, uint256 from, uint256 to)</code></a></li><li><a href="#LibBytes.popLastByte(bytes)"><code class="function-signature">popLastByte(bytes b)</code></a></li><li><a href="#LibBytes.equals(bytes,bytes)"><code class="function-signature">equals(bytes lhs, bytes rhs)</code></a></li><li><a href="#LibBytes.readAddress(bytes,uint256)"><code class="function-signature">readAddress(bytes b, uint256 index)</code></a></li><li><a href="#LibBytes.writeAddress(bytes,uint256,address)"><code class="function-signature">writeAddress(bytes b, uint256 index, address input)</code></a></li><li><a href="#LibBytes.readBytes32(bytes,uint256)"><code class="function-signature">readBytes32(bytes b, uint256 index)</code></a></li><li><a href="#LibBytes.writeBytes32(bytes,uint256,bytes32)"><code class="function-signature">writeBytes32(bytes b, uint256 index, bytes32 input)</code></a></li><li><a href="#LibBytes.readUint256(bytes,uint256)"><code class="function-signature">readUint256(bytes b, uint256 index)</code></a></li><li><a href="#LibBytes.writeUint256(bytes,uint256,uint256)"><code class="function-signature">writeUint256(bytes b, uint256 index, uint256 input)</code></a></li><li><a href="#LibBytes.readBytes4(bytes,uint256)"><code class="function-signature">readBytes4(bytes b, uint256 index)</code></a></li><li><a href="#LibBytes.writeLength(bytes,uint256)"><code class="function-signature">writeLength(bytes b, uint256 length)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibBytes.rawAddress(bytes)"></a><code class="function-signature">rawAddress(bytes input) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Gets the memory address for a byte array.
 @param input Byte array to lookup.
 @return memoryAddress Memory address of byte array. This
         points to the header of the byte array which contains
         the length.



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



<h4><a class="anchor" aria-hidden="true" id="LibBytes.equals(bytes,bytes)"></a><code class="function-signature">equals(bytes lhs, bytes rhs) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Tests equality of two byte arrays.
 @param lhs First byte array to compare.
 @param rhs Second byte array to compare.
 @return True if arrays are the same. False otherwise.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.readAddress(bytes,uint256)"></a><code class="function-signature">readAddress(bytes b, uint256 index) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

Reads an address from a position in a byte array.
 @param b Byte array containing an address.
 @param index Index in byte array of address.
 @return address from byte array.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.writeAddress(bytes,uint256,address)"></a><code class="function-signature">writeAddress(bytes b, uint256 index, address input)</code><span class="function-visibility">internal</span></h4>

Writes an address into a specific position in a byte array.
 @param b Byte array to insert address into.
 @param index Index in byte array of address.
 @param input Address to put into byte array.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.readBytes32(bytes,uint256)"></a><code class="function-signature">readBytes32(bytes b, uint256 index) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>

Reads a bytes32 value from a position in a byte array.
 @param b Byte array containing a bytes32 value.
 @param index Index in byte array of bytes32 value.
 @return bytes32 value from byte array.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.writeBytes32(bytes,uint256,bytes32)"></a><code class="function-signature">writeBytes32(bytes b, uint256 index, bytes32 input)</code><span class="function-visibility">internal</span></h4>

Writes a bytes32 into a specific position in a byte array.
 @param b Byte array to insert &lt;input&gt; into.
 @param index Index in byte array of &lt;input&gt;.
 @param input bytes32 to put into byte array.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.readUint256(bytes,uint256)"></a><code class="function-signature">readUint256(bytes b, uint256 index) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Reads a uint256 value from a position in a byte array.
 @param b Byte array containing a uint256 value.
 @param index Index in byte array of uint256 value.
 @return uint256 value from byte array.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.writeUint256(bytes,uint256,uint256)"></a><code class="function-signature">writeUint256(bytes b, uint256 index, uint256 input)</code><span class="function-visibility">internal</span></h4>

Writes a uint256 into a specific position in a byte array.
 @param b Byte array to insert &lt;input&gt; into.
 @param index Index in byte array of &lt;input&gt;.
 @param input uint256 to put into byte array.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.readBytes4(bytes,uint256)"></a><code class="function-signature">readBytes4(bytes b, uint256 index) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>

Reads an unpadded bytes4 value from a position in a byte array.
 @param b Byte array containing a bytes4 value.
 @param index Index in byte array of bytes4 value.
 @return bytes4 value from byte array.



<h4><a class="anchor" aria-hidden="true" id="LibBytes.writeLength(bytes,uint256)"></a><code class="function-signature">writeLength(bytes b, uint256 length)</code><span class="function-visibility">internal</span></h4>

Writes a new length to a byte array.
      Decreasing length will lead to removing the corresponding lower order bytes from the byte array.
      Increasing length may lead to appending adjacent in-memory bytes to the end of the byte array.
 @param b Bytes array to write new length to.
 @param length New length of byte array.





### `RLPReader`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#RLPReader.decodeTransaction(bytes)"><code class="function-signature">decodeTransaction(bytes rawTransaction)</code></a></li><li><a href="#RLPReader.toRlpItem(bytes)"><code class="function-signature">toRlpItem(bytes item)</code></a></li><li><a href="#RLPReader.toList(struct RLPReader.RLPItem)"><code class="function-signature">toList(struct RLPReader.RLPItem item)</code></a></li><li><a href="#RLPReader.isList(struct RLPReader.RLPItem)"><code class="function-signature">isList(struct RLPReader.RLPItem item)</code></a></li><li><a href="#RLPReader.numItems(struct RLPReader.RLPItem)"><code class="function-signature">numItems(struct RLPReader.RLPItem item)</code></a></li><li><a href="#RLPReader._itemLength(uint256)"><code class="function-signature">_itemLength(uint256 memPtr)</code></a></li><li><a href="#RLPReader._payloadOffset(uint256)"><code class="function-signature">_payloadOffset(uint256 memPtr)</code></a></li><li><a href="#RLPReader.toRlpBytes(struct RLPReader.RLPItem)"><code class="function-signature">toRlpBytes(struct RLPReader.RLPItem item)</code></a></li><li><a href="#RLPReader.toBoolean(struct RLPReader.RLPItem)"><code class="function-signature">toBoolean(struct RLPReader.RLPItem item)</code></a></li><li><a href="#RLPReader.toAddress(struct RLPReader.RLPItem)"><code class="function-signature">toAddress(struct RLPReader.RLPItem item)</code></a></li><li><a href="#RLPReader.toUint(struct RLPReader.RLPItem)"><code class="function-signature">toUint(struct RLPReader.RLPItem item)</code></a></li><li><a href="#RLPReader.toBytes(struct RLPReader.RLPItem)"><code class="function-signature">toBytes(struct RLPReader.RLPItem item)</code></a></li><li><a href="#RLPReader.copy(uint256,uint256,uint256)"><code class="function-signature">copy(uint256 src, uint256 dest, uint256 len)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="RLPReader.decodeTransaction(bytes)"></a><code class="function-signature">decodeTransaction(bytes rawTransaction) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,address,uint256,bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.toRlpItem(bytes)"></a><code class="function-signature">toRlpItem(bytes item) <span class="return-arrow">→</span> <span class="return-type">struct RLPReader.RLPItem</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.toList(struct RLPReader.RLPItem)"></a><code class="function-signature">toList(struct RLPReader.RLPItem item) <span class="return-arrow">→</span> <span class="return-type">struct RLPReader.RLPItem[]</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.isList(struct RLPReader.RLPItem)"></a><code class="function-signature">isList(struct RLPReader.RLPItem item) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.numItems(struct RLPReader.RLPItem)"></a><code class="function-signature">numItems(struct RLPReader.RLPItem item) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader._itemLength(uint256)"></a><code class="function-signature">_itemLength(uint256 memPtr) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader._payloadOffset(uint256)"></a><code class="function-signature">_payloadOffset(uint256 memPtr) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.toRlpBytes(struct RLPReader.RLPItem)"></a><code class="function-signature">toRlpBytes(struct RLPReader.RLPItem item) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.toBoolean(struct RLPReader.RLPItem)"></a><code class="function-signature">toBoolean(struct RLPReader.RLPItem item) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.toAddress(struct RLPReader.RLPItem)"></a><code class="function-signature">toAddress(struct RLPReader.RLPItem item) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.toUint(struct RLPReader.RLPItem)"></a><code class="function-signature">toUint(struct RLPReader.RLPItem item) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.toBytes(struct RLPReader.RLPItem)"></a><code class="function-signature">toBytes(struct RLPReader.RLPItem item) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RLPReader.copy(uint256,uint256,uint256)"></a><code class="function-signature">copy(uint256 src, uint256 dest, uint256 len)</code><span class="function-visibility">internal</span></h4>







### `RelayHub`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#RelayHub.stake(address,uint256)"><code class="function-signature">stake(address relay, uint256 unstakeDelay)</code></a></li><li><a href="#RelayHub.registerRelay(uint256,string)"><code class="function-signature">registerRelay(uint256 transactionFee, string url)</code></a></li><li><a href="#RelayHub.removeRelayByOwner(address)"><code class="function-signature">removeRelayByOwner(address relay)</code></a></li><li><a href="#RelayHub.unstake(address)"><code class="function-signature">unstake(address relay)</code></a></li><li><a href="#RelayHub.getRelay(address)"><code class="function-signature">getRelay(address relay)</code></a></li><li><a href="#RelayHub.depositFor(address)"><code class="function-signature">depositFor(address target)</code></a></li><li><a href="#RelayHub.balanceOf(address)"><code class="function-signature">balanceOf(address target)</code></a></li><li><a href="#RelayHub.withdraw(uint256,address payable)"><code class="function-signature">withdraw(uint256 amount, address payable dest)</code></a></li><li><a href="#RelayHub.getNonce(address)"><code class="function-signature">getNonce(address from)</code></a></li><li><a href="#RelayHub.canUnstake(address)"><code class="function-signature">canUnstake(address relay)</code></a></li><li><a href="#RelayHub.canRelay(address,address,address,bytes,uint256,uint256,uint256,uint256,bytes,bytes)"><code class="function-signature">canRelay(address relay, address from, address to, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes signature, bytes approvalData)</code></a></li><li><a href="#RelayHub.relayCall(address,address,bytes,uint256,uint256,uint256,uint256,bytes,bytes)"><code class="function-signature">relayCall(address from, address recipient, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes signature, bytes approvalData)</code></a></li><li><a href="#RelayHub.recipientCallsAtomic(address,bytes,uint256,uint256,uint256,uint256,bytes)"><code class="function-signature">recipientCallsAtomic(address recipient, bytes encodedFunctionWithFrom, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 preChecksGas, bytes recipientContext)</code></a></li><li><a href="#RelayHub.requiredGas(uint256)"><code class="function-signature">requiredGas(uint256 relayedCallStipend)</code></a></li><li><a href="#RelayHub.maxPossibleCharge(uint256,uint256,uint256)"><code class="function-signature">maxPossibleCharge(uint256 relayedCallStipend, uint256 gasPrice, uint256 transactionFee)</code></a></li><li><a href="#RelayHub.penalizeRepeatedNonce(bytes,bytes,bytes,bytes)"><code class="function-signature">penalizeRepeatedNonce(bytes unsignedTx1, bytes signature1, bytes unsignedTx2, bytes signature2)</code></a></li><li><a href="#RelayHub.penalizeIllegalTransaction(bytes,bytes)"><code class="function-signature">penalizeIllegalTransaction(bytes unsignedTx, bytes signature)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="gsn#IRelayHub.Staked(address,uint256,uint256)"><code class="function-signature">Staked(address relay, uint256 stake, uint256 unstakeDelay)</code></a></li><li class="inherited"><a href="gsn#IRelayHub.RelayAdded(address,address,uint256,uint256,uint256,string)"><code class="function-signature">RelayAdded(address relay, address owner, uint256 transactionFee, uint256 stake, uint256 unstakeDelay, string url)</code></a></li><li class="inherited"><a href="gsn#IRelayHub.RelayRemoved(address,uint256)"><code class="function-signature">RelayRemoved(address relay, uint256 unstakeTime)</code></a></li><li class="inherited"><a href="gsn#IRelayHub.Unstaked(address,uint256)"><code class="function-signature">Unstaked(address relay, uint256 stake)</code></a></li><li class="inherited"><a href="gsn#IRelayHub.Deposited(address,address,uint256)"><code class="function-signature">Deposited(address recipient, address from, uint256 amount)</code></a></li><li class="inherited"><a href="gsn#IRelayHub.Withdrawn(address,address,uint256)"><code class="function-signature">Withdrawn(address account, address dest, uint256 amount)</code></a></li><li class="inherited"><a href="gsn#IRelayHub.CanRelayFailed(address,address,address,bytes4,uint256)"><code class="function-signature">CanRelayFailed(address relay, address from, address to, bytes4 selector, uint256 reason)</code></a></li><li class="inherited"><a href="gsn#IRelayHub.TransactionRelayed(address,address,address,bytes4,enum IRelayHub.RelayCallStatus,uint256)"><code class="function-signature">TransactionRelayed(address relay, address from, address to, bytes4 selector, enum IRelayHub.RelayCallStatus status, uint256 charge)</code></a></li><li class="inherited"><a href="gsn#IRelayHub.Penalized(address,address,uint256)"><code class="function-signature">Penalized(address relay, address sender, uint256 amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="RelayHub.stake(address,uint256)"></a><code class="function-signature">stake(address relay, uint256 unstakeDelay)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.registerRelay(uint256,string)"></a><code class="function-signature">registerRelay(uint256 transactionFee, string url)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.removeRelayByOwner(address)"></a><code class="function-signature">removeRelayByOwner(address relay)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.unstake(address)"></a><code class="function-signature">unstake(address relay)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.getRelay(address)"></a><code class="function-signature">getRelay(address relay) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256,uint256,address payable,enum IRelayHub.RelayState</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.depositFor(address)"></a><code class="function-signature">depositFor(address target)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.balanceOf(address)"></a><code class="function-signature">balanceOf(address target) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.withdraw(uint256,address payable)"></a><code class="function-signature">withdraw(uint256 amount, address payable dest)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.getNonce(address)"></a><code class="function-signature">getNonce(address from) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.canUnstake(address)"></a><code class="function-signature">canUnstake(address relay) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.canRelay(address,address,address,bytes,uint256,uint256,uint256,uint256,bytes,bytes)"></a><code class="function-signature">canRelay(address relay, address from, address to, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes signature, bytes approvalData) <span class="return-arrow">→</span> <span class="return-type">uint256,bytes</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.relayCall(address,address,bytes,uint256,uint256,uint256,uint256,bytes,bytes)"></a><code class="function-signature">relayCall(address from, address recipient, bytes encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes signature, bytes approvalData)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.recipientCallsAtomic(address,bytes,uint256,uint256,uint256,uint256,bytes)"></a><code class="function-signature">recipientCallsAtomic(address recipient, bytes encodedFunctionWithFrom, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 preChecksGas, bytes recipientContext) <span class="return-arrow">→</span> <span class="return-type">enum IRelayHub.RelayCallStatus</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.requiredGas(uint256)"></a><code class="function-signature">requiredGas(uint256 relayedCallStipend) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.maxPossibleCharge(uint256,uint256,uint256)"></a><code class="function-signature">maxPossibleCharge(uint256 relayedCallStipend, uint256 gasPrice, uint256 transactionFee) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.penalizeRepeatedNonce(bytes,bytes,bytes,bytes)"></a><code class="function-signature">penalizeRepeatedNonce(bytes unsignedTx1, bytes signature1, bytes unsignedTx2, bytes signature2)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="RelayHub.penalizeIllegalTransaction(bytes,bytes)"></a><code class="function-signature">penalizeIllegalTransaction(bytes unsignedTx, bytes signature)</code><span class="function-visibility">public</span></h4>







### `SafeMath`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMath.add(uint256,uint256)"><code class="function-signature">add(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMath.sub(uint256,uint256)"><code class="function-signature">sub(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMath.mul(uint256,uint256)"><code class="function-signature">mul(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMath.div(uint256,uint256)"><code class="function-signature">div(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMath.mod(uint256,uint256)"><code class="function-signature">mod(uint256 a, uint256 b)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SafeMath.add(uint256,uint256)"></a><code class="function-signature">add(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Returns the addition of two unsigned integers, reverting on
overflow.

Counterpart to Solidity&#x27;s `+` operator.

Requirements:
- Addition cannot overflow.



<h4><a class="anchor" aria-hidden="true" id="SafeMath.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Returns the subtraction of two unsigned integers, reverting on
overflow (when the result is negative).

Counterpart to Solidity&#x27;s `-` operator.

Requirements:
- Subtraction cannot overflow.



<h4><a class="anchor" aria-hidden="true" id="SafeMath.mul(uint256,uint256)"></a><code class="function-signature">mul(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Returns the multiplication of two unsigned integers, reverting on
overflow.

Counterpart to Solidity&#x27;s `*` operator.

Requirements:
- Multiplication cannot overflow.



<h4><a class="anchor" aria-hidden="true" id="SafeMath.div(uint256,uint256)"></a><code class="function-signature">div(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Returns the integer division of two unsigned integers. Reverts on
division by zero. The result is rounded towards zero.

Counterpart to Solidity&#x27;s `/` operator. Note: this function uses a
`revert` opcode (which leaves remaining gas untouched) while Solidity
uses an invalid opcode to revert (consuming all remaining gas).

Requirements:
- The divisor cannot be zero.



<h4><a class="anchor" aria-hidden="true" id="SafeMath.mod(uint256,uint256)"></a><code class="function-signature">mod(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
Reverts when dividing by zero.

Counterpart to Solidity&#x27;s `%` operator. This function uses a `revert`
opcode (which leaves remaining gas untouched) while Solidity uses an
invalid opcode to revert (consuming all remaining gas).

Requirements:
- The divisor cannot be zero.





</div>