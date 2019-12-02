---
title: Token
---

<div class="contracts">

## Contracts

### `ContractExists`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ContractExists.exists(address)"><code class="function-signature">exists(address _address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ContractExists.exists(address)"></a><code class="function-signature">exists(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `ERC1155`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC1155.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#ERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address account, uint256 id)</code></a></li><li><a href="#ERC1155.totalSupply(uint256)"><code class="function-signature">totalSupply(uint256 id)</code></a></li><li><a href="#ERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] accounts, uint256[] ids)</code></a></li><li><a href="#ERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li><a href="#ERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address account, address operator)</code></a></li><li><a href="#ERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#ERC1155._transferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_transferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._internalTransferFrom(address,address,uint256,uint256,bytes,bool)"><code class="function-signature">_internalTransferFrom(address from, address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li><a href="#ERC1155._batchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_batchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._internalBatchTransferFrom(address,address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_internalBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._mint(address,uint256,uint256,bytes,bool)"><code class="function-signature">_mint(address to, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._mintBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_mintBatch(address to, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._burn(address,uint256,uint256,bytes,bool)"><code class="function-signature">_burn(address account, uint256 id, uint256 value, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._burnBatch(address,uint256[],uint256[],bytes,bool)"><code class="function-signature">_burnBatch(address account, uint256[] ids, uint256[] values, bytes data, bool doAcceptanceCheck)</code></a></li><li><a href="#ERC1155._doSafeTransferAcceptanceCheck(address,address,address,uint256,uint256,bytes)"><code class="function-signature">_doSafeTransferAcceptanceCheck(address operator, address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#ERC1155._doSafeBatchTransferAcceptanceCheck(address,address,address,uint256[],uint256[],bytes)"><code class="function-signature">_doSafeBatchTransferAcceptanceCheck(address operator, address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li><a href="#ERC1155.onTokenTransfer(uint256,address,address,uint256)"><code class="function-signature">onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value)</code></a></li><li><a href="#ERC1155.onMint(uint256,address,uint256)"><code class="function-signature">onMint(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li><a href="#ERC1155.onBurn(uint256,address,uint256)"><code class="function-signature">onBurn(uint256 _tokenId, address _target, uint256 _amount)</code></a></li><li class="inherited"><a href="#ERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="#ERC165._registerInterface(bytes4)"><code class="function-signature">_registerInterface(bytes4 interfaceId)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li class="inherited"><a href="#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li class="inherited"><a href="#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li class="inherited"><a href="#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



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



### `IERC1155Receiver`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC1155Receiver.onERC1155Received(address,address,uint256,uint256,bytes)"><code class="function-signature">onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#IERC1155Receiver.onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"><code class="function-signature">onERC1155BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="token#IERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li></ul></div>



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







### `ERC1155Holder`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC1155Holder.onERC1155Received(address,address,uint256,uint256,bytes)"><code class="function-signature">onERC1155Received(address, address, uint256, uint256, bytes)</code></a></li><li><a href="#ERC1155Holder.onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"><code class="function-signature">onERC1155BatchReceived(address, address, uint256[], uint256[], bytes)</code></a></li><li class="inherited"><a href="#ERC1155Receiver.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#ERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="#ERC165._registerInterface(bytes4)"><code class="function-signature">_registerInterface(bytes4 interfaceId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC1155Holder.onERC1155Received(address,address,uint256,uint256,bytes)"></a><code class="function-signature">onERC1155Received(address, address, uint256, uint256, bytes) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC1155Holder.onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"></a><code class="function-signature">onERC1155BatchReceived(address, address, uint256[], uint256[], bytes) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>







### `ERC1155Receiver`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC1155Receiver.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#IERC1155Receiver.onERC1155Received(address,address,uint256,uint256,bytes)"><code class="function-signature">onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes data)</code></a></li><li class="inherited"><a href="#IERC1155Receiver.onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"><code class="function-signature">onERC1155BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data)</code></a></li><li class="inherited"><a href="token#ERC165.supportsInterface(bytes4)"><code class="function-signature">supportsInterface(bytes4 interfaceId)</code></a></li><li class="inherited"><a href="token#ERC165._registerInterface(bytes4)"><code class="function-signature">_registerInterface(bytes4 interfaceId)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC1155Receiver.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>







### `ERC777`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li><a href="#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li><a href="#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li><a href="#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li><a href="#ERC777.transfer(address,uint256)"><code class="function-signature">transfer(address recipient, uint256 amount)</code></a></li><li><a href="#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li><a href="#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li><a href="#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li><a href="#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li><a href="#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li><a href="#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li><a href="#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li><a href="#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li><a href="#ERC777.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount)</code></a></li><li><a href="#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li><a href="#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li><a href="#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li><li><a href="#ERC777.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="token#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="token#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="token#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777.initialize1820InterfaceImplementations()"></a><code class="function-signature">initialize1820InterfaceImplementations() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777.granularity()"></a><code class="function-signature">granularity() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

See [`IERC777.granularity`](../reporting#IERC777.granularity()).

This implementation always returns `1`.



<h4><a class="anchor" aria-hidden="true" id="ERC777.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

See [`IERC777.totalSupply`](../reporting#IERC777.totalSupply()).



<h4><a class="anchor" aria-hidden="true" id="ERC777.balanceOf(address)"></a><code class="function-signature">balanceOf(address tokenHolder) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

Returns the amount of tokens owned by an account (`tokenHolder`).



<h4><a class="anchor" aria-hidden="true" id="ERC777.send(address,uint256,bytes)"></a><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code><span class="function-visibility">external</span></h4>

See [`IERC777.send`](../reporting#IERC777.send(address,uint256,bytes)).

Also emits a [`Transfer`](../reporting#ERC777.Transfer(address,address,uint256)) event for ERC20 compatibility.



<h4><a class="anchor" aria-hidden="true" id="ERC777.transfer(address,uint256)"></a><code class="function-signature">transfer(address recipient, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See [`IERC20.transfer`](../utility#IERC20.transfer(address,uint256)).

Unlike [`send`](../reporting#ERC777.send(address,uint256,bytes)), `recipient` is _not_ required to implement the `tokensReceived`
interface if it is a contract.

Also emits a [`Sent`](../reporting#ERC777.Sent(address,address,address,uint256,bytes,bytes)) event.



<h4><a class="anchor" aria-hidden="true" id="ERC777._transfer(address,address,uint256,bool)"></a><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777.isOperatorFor(address,address)"></a><code class="function-signature">isOperatorFor(address operator, address tokenHolder) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See [`IERC777.isOperatorFor`](../reporting#IERC777.isOperatorFor(address,address)).



<h4><a class="anchor" aria-hidden="true" id="ERC777.authorizeOperator(address)"></a><code class="function-signature">authorizeOperator(address operator)</code><span class="function-visibility">external</span></h4>

See [`IERC777.authorizeOperator`](../reporting#IERC777.authorizeOperator(address)).



<h4><a class="anchor" aria-hidden="true" id="ERC777.revokeOperator(address)"></a><code class="function-signature">revokeOperator(address operator)</code><span class="function-visibility">external</span></h4>

See [`IERC777.revokeOperator`](../reporting#IERC777.revokeOperator(address)).



<h4><a class="anchor" aria-hidden="true" id="ERC777.defaultOperators()"></a><code class="function-signature">defaultOperators() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">public</span></h4>

See [`IERC777.defaultOperators`](../reporting#IERC777.defaultOperators()).



<h4><a class="anchor" aria-hidden="true" id="ERC777.operatorSend(address,address,uint256,bytes,bytes)"></a><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code><span class="function-visibility">external</span></h4>

See [`IERC777.operatorSend`](../reporting#IERC777.operatorSend(address,address,uint256,bytes,bytes)).

Emits [`Sent`](../reporting#ERC777.Sent(address,address,address,uint256,bytes,bytes)) and [`Transfer`](../reporting#ERC777.Transfer(address,address,uint256)) events.



<h4><a class="anchor" aria-hidden="true" id="ERC777.allowance(address,address)"></a><code class="function-signature">allowance(address holder, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

See [`IERC20.allowance`](../utility#IERC20.allowance(address,address)).

Note that operator and allowance concepts are orthogonal: operators may
not have allowance, and accounts with allowance may not be operators
themselves.



<h4><a class="anchor" aria-hidden="true" id="ERC777.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See [`IERC20.approve`](../utility#IERC20.approve(address,uint256)).

Note that accounts cannot have allowance issued by their operators.



<h4><a class="anchor" aria-hidden="true" id="ERC777.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

See [`IERC20.transferFrom`](../utility#IERC20.transferFrom(address,address,uint256)).

Note that operator and allowance concepts are orthogonal: operators cannot
call [`transferFrom`](../reporting#ERC777.transferFrom(address,address,uint256)) (unless they have allowance), and accounts with
allowance cannot call [`operatorSend`](../reporting#ERC777.operatorSend(address,address,uint256,bytes,bytes)) (unless they are operators).

Emits [`Sent`](../reporting#ERC777.Sent(address,address,address,uint256,bytes,bytes)) and [`Transfer`](../reporting#ERC777.Transfer(address,address,uint256)) events.



<h4><a class="anchor" aria-hidden="true" id="ERC777._mint(address,address,uint256,bytes,bytes,bool)"></a><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code><span class="function-visibility">internal</span></h4>

Creates `amount` tokens and assigns them to `account`, increasing
the total supply.

If a send hook is registered for `raccount`, the corresponding function
will be called with `operator`, `data` and `operatorData`.

See [`IERC777Sender`](../reporting#ierc777sender) and [`IERC777Recipient`](../reporting#ierc777recipient).

Emits [`Sent`](../reporting#ERC777.Sent(address,address,address,uint256,bytes,bytes)) and [`Transfer`](../reporting#ERC777.Transfer(address,address,uint256)) events.

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

Emits a [`ManagerChanged`](../reporting#IERC1820Registry.ManagerChanged(address,address)) event.

Requirements:

- the caller must be the current manager for `account`.



<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.getManager(address)"></a><code class="function-signature">getManager(address account) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Returns the manager for `account`.

See [`setManager`](../reporting#IERC1820Registry.setManager(address,address)).



<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.setInterfaceImplementer(address,bytes32,address)"></a><code class="function-signature">setInterfaceImplementer(address account, bytes32 interfaceHash, address implementer)</code><span class="function-visibility">external</span></h4>

Sets the `implementer` contract as `account`&#x27;s implementer for
[`interfaceHash`](../reporting#IERC1820Registry.interfaceHash(string)).

`account` being the zero address is an alias for the caller&#x27;s address.
The zero address can also be used in `implementer` to remove an old one.

See [`interfaceHash`](../reporting#IERC1820Registry.interfaceHash(string)) to learn how these are created.

Emits an [`InterfaceImplementerSet`](../reporting#IERC1820Registry.InterfaceImplementerSet(address,bytes32,address)) event.

Requirements:

- the caller must be the current manager for `account`.
- [`interfaceHash`](../reporting#IERC1820Registry.interfaceHash(string)) must not be an [`IERC165`](../reporting#ierc165) interface id (i.e. it must not
end in 28 zeroes).
- `implementer` must implement [`IERC1820Implementer`](.#ierc1820implementer) and return true when
queried for support, unless `implementer` is the caller. See
[`IERC1820Implementer.canImplementInterfaceForAddress`](.#IERC1820Implementer.canImplementInterfaceForAddress(bytes32,address)).



<h4><a class="anchor" aria-hidden="true" id="IERC1820Registry.getInterfaceImplementer(address,bytes32)"></a><code class="function-signature">getInterfaceImplementer(address account, bytes32 interfaceHash) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Returns the implementer of [`interfaceHash`](../reporting#IERC1820Registry.interfaceHash(string)) for `account`. If no such
implementer is registered, returns the zero address.

If [`interfaceHash`](../reporting#IERC1820Registry.interfaceHash(string)) is an [`IERC165`](../reporting#ierc165) interface id (i.e. it ends with 28
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
`operatorData`. See [`IERC777Sender`](../reporting#ierc777sender) and [`IERC777Recipient`](../reporting#ierc777recipient).

Emits a [`Sent`](../reporting#IERC777.Sent(address,address,address,uint256,bytes,bytes)) event.

Requirements

- the caller must have at least `amount` tokens.
- `recipient` cannot be the zero address.
- if `recipient` is a contract, it must implement the `tokensReceived`
interface.



<h4><a class="anchor" aria-hidden="true" id="IERC777.isOperatorFor(address,address)"></a><code class="function-signature">isOperatorFor(address operator, address tokenHolder) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

Returns true if an account is an operator of `tokenHolder`.
Operators can send and burn tokens on behalf of their owners. All
accounts are their own operator.

See [`operatorSend`](../reporting#IERC777.operatorSend(address,address,uint256,bytes,bytes)) and `operatorBurn`.



<h4><a class="anchor" aria-hidden="true" id="IERC777.authorizeOperator(address)"></a><code class="function-signature">authorizeOperator(address operator)</code><span class="function-visibility">external</span></h4>

Make an account an operator of the caller.

See [`isOperatorFor`](../reporting#IERC777.isOperatorFor(address,address)).

Emits an [`AuthorizedOperator`](../reporting#IERC777.AuthorizedOperator(address,address)) event.

Requirements

- `operator` cannot be calling address.



<h4><a class="anchor" aria-hidden="true" id="IERC777.revokeOperator(address)"></a><code class="function-signature">revokeOperator(address operator)</code><span class="function-visibility">external</span></h4>

Make an account an operator of the caller.

See [`isOperatorFor`](../reporting#IERC777.isOperatorFor(address,address)) and [`defaultOperators`](../reporting#IERC777.defaultOperators()).

Emits a [`RevokedOperator`](../reporting#IERC777.RevokedOperator(address,address)) event.

Requirements

- `operator` cannot be calling address.



<h4><a class="anchor" aria-hidden="true" id="IERC777.defaultOperators()"></a><code class="function-signature">defaultOperators() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">external</span></h4>

Returns the list of default operators. These accounts are operators
for all token holders, even if [`authorizeOperator`](../reporting#IERC777.authorizeOperator(address)) was never called on
them.

This list is immutable, but individual holders may revoke these via
[`revokeOperator`](../reporting#IERC777.revokeOperator(address)), in which case [`isOperatorFor`](../reporting#IERC777.isOperatorFor(address,address)) will return false.



<h4><a class="anchor" aria-hidden="true" id="IERC777.operatorSend(address,address,uint256,bytes,bytes)"></a><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code><span class="function-visibility">external</span></h4>

Moves `amount` tokens from `sender` to `recipient`. The caller must
be an operator of `sender`.

If send or receive hooks are registered for `sender` and `recipient`,
the corresponding functions will be called with `data` and
`operatorData`. See [`IERC777Sender`](../reporting#ierc777sender) and [`IERC777Recipient`](../reporting#ierc777recipient).

Emits a [`Sent`](../reporting#IERC777.Sent(address,address,address,uint256,bytes,bytes)) event.

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

Called by an [`IERC777`](../reporting#ierc777) token contract whenever tokens are being
moved or created into a registered account (`to`). The type of operation
is conveyed by `from` being the zero address or not.

This call occurs _after_ the token contract&#x27;s state is updated, so
[`IERC777.balanceOf`](../reporting#IERC777.balanceOf(address)), etc., can be used to query the post-operation state.

This function may revert to prevent the operation from being executed.





### `IERC777Sender`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC777Sender.tokensToSend(address,address,address,uint256,bytes,bytes)"><code class="function-signature">tokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC777Sender.tokensToSend(address,address,address,uint256,bytes,bytes)"></a><code class="function-signature">tokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData)</code><span class="function-visibility">external</span></h4>

Called by an [`IERC777`](../reporting#ierc777) token contract whenever a registered holder&#x27;s
(`from`) tokens are about to be moved or destroyed. The type of operation
is conveyed by `to` being the zero address or not.

This call occurs _before_ the token contract&#x27;s state is updated, so
[`IERC777.balanceOf`](../reporting#IERC777.balanceOf(address)), etc., can be used to query the pre-operation state.

This function may revert to prevent the operation from being executed.





### `IStandardToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IStandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address recipient, uint256 amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IStandardToken.noHooksTransfer(address,uint256)"></a><code class="function-signature">noHooksTransfer(address recipient, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `StandardToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#StandardToken.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li><a href="#StandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount)</code></a></li><li><a href="#StandardToken.internalNoHooksTransfer(address,address,uint256)"><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount)</code></a></li><li><a href="#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li><a href="#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="token#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li class="inherited"><a href="token#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="token#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li class="inherited"><a href="token#ERC777.transfer(address,uint256)"><code class="function-signature">transfer(address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="token#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li class="inherited"><a href="token#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li class="inherited"><a href="token#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li class="inherited"><a href="token#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="token#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li class="inherited"><a href="token#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li class="inherited"><a href="token#ERC777.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="token#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li class="inherited"><a href="token#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li class="inherited"><a href="token#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li><li class="inherited"><a href="token#ERC777.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="token#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="token#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="token#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="StandardToken.initialize1820InterfaceImplementations()"></a><code class="function-signature">initialize1820InterfaceImplementations() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.noHooksTransfer(address,uint256)"></a><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.internalNoHooksTransfer(address,address,uint256)"></a><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.increaseApproval(address,uint256)"></a><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.decreaseApproval(address,uint256)"></a><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `VariableSupplyToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.onMint(address,uint256)"><code class="function-signature">onMint(address, uint256)</code></a></li><li><a href="#VariableSupplyToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address, uint256)</code></a></li><li class="inherited"><a href="token#StandardToken.initialize1820InterfaceImplementations()"><code class="function-signature">initialize1820InterfaceImplementations()</code></a></li><li class="inherited"><a href="token#StandardToken.noHooksTransfer(address,uint256)"><code class="function-signature">noHooksTransfer(address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="token#StandardToken.internalNoHooksTransfer(address,address,uint256)"><code class="function-signature">internalNoHooksTransfer(address _from, address _recipient, uint256 _amount)</code></a></li><li class="inherited"><a href="token#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="token#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="token#ERC777.granularity()"><code class="function-signature">granularity()</code></a></li><li class="inherited"><a href="token#ERC777.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="token#ERC777.balanceOf(address)"><code class="function-signature">balanceOf(address tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777.send(address,uint256,bytes)"><code class="function-signature">send(address recipient, uint256 amount, bytes data)</code></a></li><li class="inherited"><a href="token#ERC777.transfer(address,uint256)"><code class="function-signature">transfer(address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="token#ERC777._transfer(address,address,uint256,bool)"><code class="function-signature">_transfer(address from, address recipient, uint256 amount, bool callHooks)</code></a></li><li class="inherited"><a href="token#ERC777.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address operator)</code></a></li><li class="inherited"><a href="token#ERC777.revokeOperator(address)"><code class="function-signature">revokeOperator(address operator)</code></a></li><li class="inherited"><a href="token#ERC777.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="token#ERC777.operatorSend(address,address,uint256,bytes,bytes)"><code class="function-signature">operatorSend(address sender, address recipient, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#ERC777.allowance(address,address)"><code class="function-signature">allowance(address holder, address spender)</code></a></li><li class="inherited"><a href="token#ERC777.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li class="inherited"><a href="token#ERC777.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address holder, address recipient, uint256 amount)</code></a></li><li class="inherited"><a href="token#ERC777._mint(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_mint(address operator, address account, uint256 amount, bytes userData, bytes operatorData, bool requireReceptionAck)</code></a></li><li class="inherited"><a href="token#ERC777._burn(address,address,uint256,bytes,bytes,bool)"><code class="function-signature">_burn(address operator, address from, uint256 amount, bytes data, bytes operatorData, bool callHooks)</code></a></li><li class="inherited"><a href="token#ERC777._approve(address,address,uint256)"><code class="function-signature">_approve(address holder, address spender, uint256 value)</code></a></li><li class="inherited"><a href="token#ERC777.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="token#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="token#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="token#IERC777.Sent(address,address,address,uint256,bytes,bytes)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#IERC777.Minted(address,address,uint256,bytes,bytes)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#IERC777.Burned(address,address,uint256,bytes,bytes)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes data, bytes operatorData)</code></a></li><li class="inherited"><a href="token#IERC777.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#IERC777.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.mint(address,uint256)"></a><code class="function-signature">mint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.burn(address,uint256)"></a><code class="function-signature">burn(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onMint(address,uint256)"></a><code class="function-signature">onMint(address, uint256)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address, uint256)</code><span class="function-visibility">internal</span></h4>







</div>