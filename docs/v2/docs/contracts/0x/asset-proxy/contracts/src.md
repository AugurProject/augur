---
title: Src
---

<div class="contracts">

## Contracts

### `ERC1155Proxy`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC1155Proxy.transferFrom(bytes,address,address,uint256)"><code class="function-signature">transferFrom(bytes assetData, address from, address to, uint256 amount)</code></a></li><li><a href="#ERC1155Proxy.getProxyId()"><code class="function-signature">getProxyId()</code></a></li><li class="inherited"><a href="#MixinAuthorizable.addAuthorizedAddress(address)"><code class="function-signature">addAuthorizedAddress(address target)</code></a></li><li class="inherited"><a href="#MixinAuthorizable.removeAuthorizedAddress(address)"><code class="function-signature">removeAuthorizedAddress(address target)</code></a></li><li class="inherited"><a href="#MixinAuthorizable.removeAuthorizedAddressAtIndex(address,uint256)"><code class="function-signature">removeAuthorizedAddressAtIndex(address target, uint256 index)</code></a></li><li class="inherited"><a href="#MixinAuthorizable.getAuthorizedAddresses()"><code class="function-signature">getAuthorizedAddresses()</code></a></li><li class="inherited"><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IAuthorizable.AuthorizedAddressAdded(address,address)"><code class="function-signature">AuthorizedAddressAdded(address target, address caller)</code></a></li><li class="inherited"><a href="#IAuthorizable.AuthorizedAddressRemoved(address,address)"><code class="function-signature">AuthorizedAddressRemoved(address target, address caller)</code></a></li><li class="inherited"><a href="#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC1155Proxy.transferFrom(bytes,address,address,uint256)"></a><code class="function-signature">transferFrom(bytes assetData, address from, address to, uint256 amount)</code><span class="function-visibility">external</span></h4>

Transfers batch of ERC1155 assets. Either succeeds or throws.
 @param assetData Byte array encoded with ERC1155 token address, array of ids, array of values, and callback data.
 @param from Address to transfer assets from.
 @param to Address to transfer assets to.
 @param amount Amount that will be multiplied with each element of `assetData.values` to scale the
        values that will be transferred.



<h4><a class="anchor" aria-hidden="true" id="ERC1155Proxy.getProxyId()"></a><code class="function-signature">getProxyId() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Gets the proxy id associated with the proxy address.
 @return Proxy id.





### `IAssetProxy`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAssetProxy.transferFrom(bytes,address,address,uint256)"><code class="function-signature">transferFrom(bytes assetData, address from, address to, uint256 amount)</code></a></li><li><a href="#IAssetProxy.getProxyId()"><code class="function-signature">getProxyId()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAssetProxy.transferFrom(bytes,address,address,uint256)"></a><code class="function-signature">transferFrom(bytes assetData, address from, address to, uint256 amount)</code><span class="function-visibility">external</span></h4>

Transfers assets. Either succeeds or throws.
 @param assetData Byte array encoded for the respective asset proxy.
 @param from Address to transfer asset from.
 @param to Address to transfer asset to.
 @param amount Amount of asset to transfer.



<h4><a class="anchor" aria-hidden="true" id="IAssetProxy.getProxyId()"></a><code class="function-signature">getProxyId() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Gets the proxy id associated with the proxy address.
 @return Proxy id.





### `IAuthorizable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAuthorizable.addAuthorizedAddress(address)"><code class="function-signature">addAuthorizedAddress(address target)</code></a></li><li><a href="#IAuthorizable.removeAuthorizedAddress(address)"><code class="function-signature">removeAuthorizedAddress(address target)</code></a></li><li><a href="#IAuthorizable.removeAuthorizedAddressAtIndex(address,uint256)"><code class="function-signature">removeAuthorizedAddressAtIndex(address target, uint256 index)</code></a></li><li><a href="#IAuthorizable.getAuthorizedAddresses()"><code class="function-signature">getAuthorizedAddresses()</code></a></li><li class="inherited"><a href="src#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IAuthorizable.AuthorizedAddressAdded(address,address)"><code class="function-signature">AuthorizedAddressAdded(address target, address caller)</code></a></li><li><a href="#IAuthorizable.AuthorizedAddressRemoved(address,address)"><code class="function-signature">AuthorizedAddressRemoved(address target, address caller)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAuthorizable.addAuthorizedAddress(address)"></a><code class="function-signature">addAuthorizedAddress(address target)</code><span class="function-visibility">external</span></h4>

Authorizes an address.
 @param target Address to authorize.



<h4><a class="anchor" aria-hidden="true" id="IAuthorizable.removeAuthorizedAddress(address)"></a><code class="function-signature">removeAuthorizedAddress(address target)</code><span class="function-visibility">external</span></h4>

Removes authorizion of an address.
 @param target Address to remove authorization from.



<h4><a class="anchor" aria-hidden="true" id="IAuthorizable.removeAuthorizedAddressAtIndex(address,uint256)"></a><code class="function-signature">removeAuthorizedAddressAtIndex(address target, uint256 index)</code><span class="function-visibility">external</span></h4>

Removes authorizion of an address.
 @param target Address to remove authorization from.
 @param index Index of target in authorities array.



<h4><a class="anchor" aria-hidden="true" id="IAuthorizable.getAuthorizedAddresses()"></a><code class="function-signature">getAuthorizedAddresses() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">external</span></h4>

Gets all authorized addresses.
 @return Array of authorized addresses.





<h4><a class="anchor" aria-hidden="true" id="IAuthorizable.AuthorizedAddressAdded(address,address)"></a><code class="function-signature">AuthorizedAddressAdded(address target, address caller)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IAuthorizable.AuthorizedAddressRemoved(address,address)"></a><code class="function-signature">AuthorizedAddressRemoved(address target, address caller)</code><span class="function-visibility"></span></h4>





### `IERC1155`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code></a></li><li><a href="#IERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code></a></li><li><a href="#IERC1155.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address operator, bool approved)</code></a></li><li><a href="#IERC1155.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address owner, address operator)</code></a></li><li><a href="#IERC1155.balanceOf(address,uint256)"><code class="function-signature">balanceOf(address owner, uint256 id)</code></a></li><li><a href="#IERC1155.balanceOfBatch(address[],uint256[])"><code class="function-signature">balanceOfBatch(address[] owners, uint256[] ids)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC1155.TransferSingle(address,address,address,uint256,uint256)"><code class="function-signature">TransferSingle(address operator, address from, address to, uint256 id, uint256 value)</code></a></li><li><a href="#IERC1155.TransferBatch(address,address,address,uint256[],uint256[])"><code class="function-signature">TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)</code></a></li><li><a href="#IERC1155.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address owner, address operator, bool approved)</code></a></li><li><a href="#IERC1155.URI(string,uint256)"><code class="function-signature">URI(string value, uint256 id)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC1155.safeTransferFrom(address,address,uint256,uint256,bytes)"></a><code class="function-signature">safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)"></a><code class="function-signature">safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] values, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.setApprovalForAll(address,bool)"></a><code class="function-signature">setApprovalForAll(address operator, bool approved)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.isApprovedForAll(address,address)"></a><code class="function-signature">isApprovedForAll(address owner, address operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC1155.balanceOf(address,uint256)"></a><code class="function-signature">balanceOf(address owner, uint256 id) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





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



### `IOwnable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOwnable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address newOwner)</code><span class="function-visibility">public</span></h4>

Transfers ownership of the contract to a new address.
 @param newOwner The address that will become the owner.





<h4><a class="anchor" aria-hidden="true" id="IOwnable.OwnershipTransferred(address,address)"></a><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code><span class="function-visibility"></span></h4>

Emitted by Ownable when ownership is transferred.
 @param previousOwner The previous owner of the contract.
 @param newOwner The new owner of the contract.



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





### `LibSafeMath`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibSafeMath.safeMul(uint256,uint256)"><code class="function-signature">safeMul(uint256 a, uint256 b)</code></a></li><li><a href="#LibSafeMath.safeDiv(uint256,uint256)"><code class="function-signature">safeDiv(uint256 a, uint256 b)</code></a></li><li><a href="#LibSafeMath.safeSub(uint256,uint256)"><code class="function-signature">safeSub(uint256 a, uint256 b)</code></a></li><li><a href="#LibSafeMath.safeAdd(uint256,uint256)"><code class="function-signature">safeAdd(uint256 a, uint256 b)</code></a></li><li><a href="#LibSafeMath.max256(uint256,uint256)"><code class="function-signature">max256(uint256 a, uint256 b)</code></a></li><li><a href="#LibSafeMath.min256(uint256,uint256)"><code class="function-signature">min256(uint256 a, uint256 b)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibSafeMath.safeMul(uint256,uint256)"></a><code class="function-signature">safeMul(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibSafeMath.safeDiv(uint256,uint256)"></a><code class="function-signature">safeDiv(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibSafeMath.safeSub(uint256,uint256)"></a><code class="function-signature">safeSub(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibSafeMath.safeAdd(uint256,uint256)"></a><code class="function-signature">safeAdd(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibSafeMath.max256(uint256,uint256)"></a><code class="function-signature">max256(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibSafeMath.min256(uint256,uint256)"></a><code class="function-signature">min256(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `LibSafeMathRichErrors`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibSafeMathRichErrors.Uint256BinOpError(enum LibSafeMathRichErrors.BinOpErrorCodes,uint256,uint256)"><code class="function-signature">Uint256BinOpError(enum LibSafeMathRichErrors.BinOpErrorCodes errorCode, uint256 a, uint256 b)</code></a></li><li><a href="#LibSafeMathRichErrors.Uint256DowncastError(enum LibSafeMathRichErrors.DowncastErrorCodes,uint256)"><code class="function-signature">Uint256DowncastError(enum LibSafeMathRichErrors.DowncastErrorCodes errorCode, uint256 a)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibSafeMathRichErrors.Uint256BinOpError(enum LibSafeMathRichErrors.BinOpErrorCodes,uint256,uint256)"></a><code class="function-signature">Uint256BinOpError(enum LibSafeMathRichErrors.BinOpErrorCodes errorCode, uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibSafeMathRichErrors.Uint256DowncastError(enum LibSafeMathRichErrors.DowncastErrorCodes,uint256)"></a><code class="function-signature">Uint256DowncastError(enum LibSafeMathRichErrors.DowncastErrorCodes errorCode, uint256 a) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>







### `MixinAuthorizable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinAuthorizable.addAuthorizedAddress(address)"><code class="function-signature">addAuthorizedAddress(address target)</code></a></li><li><a href="#MixinAuthorizable.removeAuthorizedAddress(address)"><code class="function-signature">removeAuthorizedAddress(address target)</code></a></li><li><a href="#MixinAuthorizable.removeAuthorizedAddressAtIndex(address,uint256)"><code class="function-signature">removeAuthorizedAddressAtIndex(address target, uint256 index)</code></a></li><li><a href="#MixinAuthorizable.getAuthorizedAddresses()"><code class="function-signature">getAuthorizedAddresses()</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IAuthorizable.AuthorizedAddressAdded(address,address)"><code class="function-signature">AuthorizedAddressAdded(address target, address caller)</code></a></li><li class="inherited"><a href="src#IAuthorizable.AuthorizedAddressRemoved(address,address)"><code class="function-signature">AuthorizedAddressRemoved(address target, address caller)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinAuthorizable.addAuthorizedAddress(address)"></a><code class="function-signature">addAuthorizedAddress(address target)</code><span class="function-visibility">external</span></h4>

Authorizes an address.
 @param target Address to authorize.



<h4><a class="anchor" aria-hidden="true" id="MixinAuthorizable.removeAuthorizedAddress(address)"></a><code class="function-signature">removeAuthorizedAddress(address target)</code><span class="function-visibility">external</span></h4>

Removes authorizion of an address.
 @param target Address to remove authorization from.



<h4><a class="anchor" aria-hidden="true" id="MixinAuthorizable.removeAuthorizedAddressAtIndex(address,uint256)"></a><code class="function-signature">removeAuthorizedAddressAtIndex(address target, uint256 index)</code><span class="function-visibility">external</span></h4>

Removes authorizion of an address.
 @param target Address to remove authorization from.
 @param index Index of target in authorities array.



<h4><a class="anchor" aria-hidden="true" id="MixinAuthorizable.getAuthorizedAddresses()"></a><code class="function-signature">getAuthorizedAddresses() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">external</span></h4>

Gets all authorized addresses.
 @return Array of authorized addresses.





### `Ownable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Ownable.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Ownable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address newOwner)</code><span class="function-visibility">public</span></h4>







### `ERC20Proxy`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC20Proxy.fallback()"><code class="function-signature">fallback()</code></a></li><li><a href="#ERC20Proxy.getProxyId()"><code class="function-signature">getProxyId()</code></a></li><li class="inherited"><a href="#MixinAuthorizable.addAuthorizedAddress(address)"><code class="function-signature">addAuthorizedAddress(address target)</code></a></li><li class="inherited"><a href="#MixinAuthorizable.removeAuthorizedAddress(address)"><code class="function-signature">removeAuthorizedAddress(address target)</code></a></li><li class="inherited"><a href="#MixinAuthorizable.removeAuthorizedAddressAtIndex(address,uint256)"><code class="function-signature">removeAuthorizedAddressAtIndex(address target, uint256 index)</code></a></li><li class="inherited"><a href="#MixinAuthorizable.getAuthorizedAddresses()"><code class="function-signature">getAuthorizedAddresses()</code></a></li><li class="inherited"><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IAuthorizable.AuthorizedAddressAdded(address,address)"><code class="function-signature">AuthorizedAddressAdded(address target, address caller)</code></a></li><li class="inherited"><a href="#IAuthorizable.AuthorizedAddressRemoved(address,address)"><code class="function-signature">AuthorizedAddressRemoved(address target, address caller)</code></a></li><li class="inherited"><a href="#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC20Proxy.fallback()"></a><code class="function-signature">fallback()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Proxy.getProxyId()"></a><code class="function-signature">getProxyId() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Gets the proxy id associated with the proxy address.
 @return Proxy id.





### `ERC721Proxy`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC721Proxy.fallback()"><code class="function-signature">fallback()</code></a></li><li><a href="#ERC721Proxy.getProxyId()"><code class="function-signature">getProxyId()</code></a></li><li class="inherited"><a href="#MixinAuthorizable.addAuthorizedAddress(address)"><code class="function-signature">addAuthorizedAddress(address target)</code></a></li><li class="inherited"><a href="#MixinAuthorizable.removeAuthorizedAddress(address)"><code class="function-signature">removeAuthorizedAddress(address target)</code></a></li><li class="inherited"><a href="#MixinAuthorizable.removeAuthorizedAddressAtIndex(address,uint256)"><code class="function-signature">removeAuthorizedAddressAtIndex(address target, uint256 index)</code></a></li><li class="inherited"><a href="#MixinAuthorizable.getAuthorizedAddresses()"><code class="function-signature">getAuthorizedAddresses()</code></a></li><li class="inherited"><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="#IAuthorizable.AuthorizedAddressAdded(address,address)"><code class="function-signature">AuthorizedAddressAdded(address target, address caller)</code></a></li><li class="inherited"><a href="#IAuthorizable.AuthorizedAddressRemoved(address,address)"><code class="function-signature">AuthorizedAddressRemoved(address target, address caller)</code></a></li><li class="inherited"><a href="#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC721Proxy.fallback()"></a><code class="function-signature">fallback()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC721Proxy.getProxyId()"></a><code class="function-signature">getProxyId() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Gets the proxy id associated with the proxy address.
 @return Proxy id.





### `IAssetProxyDispatcher`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li><a href="#IAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAssetProxyDispatcher.registerAssetProxy(address)"></a><code class="function-signature">registerAssetProxy(address assetProxy)</code><span class="function-visibility">external</span></h4>

Registers an asset proxy to its asset proxy id.
      Once an asset proxy is registered, it cannot be unregistered.
 @param assetProxy Address of new asset proxy to register.



<h4><a class="anchor" aria-hidden="true" id="IAssetProxyDispatcher.getAssetProxy(bytes4)"></a><code class="function-signature">getAssetProxy(bytes4 assetProxyId) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Gets an asset proxy.
 @param assetProxyId Id of the asset proxy.
 @return The asset proxy registered to assetProxyId. Returns 0x0 if no proxy is registered.





<h4><a class="anchor" aria-hidden="true" id="IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"></a><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code><span class="function-visibility"></span></h4>





### `MixinAssetProxyDispatcher`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li><a href="#MixinAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li><li><a href="#MixinAssetProxyDispatcher._dispatchTransferFrom(bytes,address,address,uint256)"><code class="function-signature">_dispatchTransferFrom(bytes assetData, address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinAssetProxyDispatcher.registerAssetProxy(address)"></a><code class="function-signature">registerAssetProxy(address assetProxy)</code><span class="function-visibility">external</span></h4>

Registers an asset proxy to its asset proxy id.
      Once an asset proxy is registered, it cannot be unregistered.
 @param assetProxy Address of new asset proxy to register.



<h4><a class="anchor" aria-hidden="true" id="MixinAssetProxyDispatcher.getAssetProxy(bytes4)"></a><code class="function-signature">getAssetProxy(bytes4 assetProxyId) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Gets an asset proxy.
 @param assetProxyId Id of the asset proxy.
 @return The asset proxy registered to assetProxyId. Returns 0x0 if no proxy is registered.



<h4><a class="anchor" aria-hidden="true" id="MixinAssetProxyDispatcher._dispatchTransferFrom(bytes,address,address,uint256)"></a><code class="function-signature">_dispatchTransferFrom(bytes assetData, address from, address to, uint256 amount)</code><span class="function-visibility">internal</span></h4>

Forwards arguments to assetProxy and calls `transferFrom`. Either succeeds or throws.
 @param assetData Byte array encoded for the asset.
 @param from Address to transfer token from.
 @param to Address to transfer token to.
 @param amount Amount of token to transfer.





### `MultiAssetProxy`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MultiAssetProxy.fallback()"><code class="function-signature">fallback()</code></a></li><li><a href="#MultiAssetProxy.getProxyId()"><code class="function-signature">getProxyId()</code></a></li><li class="inherited"><a href="src#MixinAuthorizable.addAuthorizedAddress(address)"><code class="function-signature">addAuthorizedAddress(address target)</code></a></li><li class="inherited"><a href="src#MixinAuthorizable.removeAuthorizedAddress(address)"><code class="function-signature">removeAuthorizedAddress(address target)</code></a></li><li class="inherited"><a href="src#MixinAuthorizable.removeAuthorizedAddressAtIndex(address,uint256)"><code class="function-signature">removeAuthorizedAddressAtIndex(address target, uint256 index)</code></a></li><li class="inherited"><a href="src#MixinAuthorizable.getAuthorizedAddresses()"><code class="function-signature">getAuthorizedAddresses()</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher._dispatchTransferFrom(bytes,address,address,uint256)"><code class="function-signature">_dispatchTransferFrom(bytes assetData, address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IAuthorizable.AuthorizedAddressAdded(address,address)"><code class="function-signature">AuthorizedAddressAdded(address target, address caller)</code></a></li><li class="inherited"><a href="src#IAuthorizable.AuthorizedAddressRemoved(address,address)"><code class="function-signature">AuthorizedAddressRemoved(address target, address caller)</code></a></li><li class="inherited"><a href="src#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MultiAssetProxy.fallback()"></a><code class="function-signature">fallback()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="MultiAssetProxy.getProxyId()"></a><code class="function-signature">getProxyId() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Gets the proxy id associated with the proxy address.
 @return Proxy id.





</div>