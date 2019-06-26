---
title: Collections
---

<div class="contracts">

## Contracts

### `IMap`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMap.initialize(address)"><code class="function-signature">initialize(address _owner)</code></a></li><li><a href="#IMap.add(bytes32,address)"><code class="function-signature">add(bytes32 _key, address _value)</code></a></li><li><a href="#IMap.remove(bytes32)"><code class="function-signature">remove(bytes32 _key)</code></a></li><li><a href="#IMap.get(bytes32)"><code class="function-signature">get(bytes32 _key)</code></a></li><li><a href="#IMap.getAsAddressOrZero(bytes32)"><code class="function-signature">getAsAddressOrZero(bytes32 _key)</code></a></li><li><a href="#IMap.contains(bytes32)"><code class="function-signature">contains(bytes32 _key)</code></a></li><li><a href="#IMap.getCount()"><code class="function-signature">getCount()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IMap.initialize(address)"></a><code class="function-signature">initialize(address _owner)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.add(bytes32,address)"></a><code class="function-signature">add(bytes32 _key, address _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.remove(bytes32)"></a><code class="function-signature">remove(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.get(bytes32)"></a><code class="function-signature">get(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.getAsAddressOrZero(bytes32)"></a><code class="function-signature">getAsAddressOrZero(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.contains(bytes32)"></a><code class="function-signature">contains(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IMap.getCount()"></a><code class="function-signature">getCount() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `IOwnable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOwnable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOwnable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Initializable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Initializable.endInitialization()"></a><code class="function-signature">endInitialization()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Initializable.getInitialized()"></a><code class="function-signature">getInitialized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Map`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Map.initialize(address)"><code class="function-signature">initialize(address _owner)</code></a></li><li><a href="#Map.add(bytes32,address)"><code class="function-signature">add(bytes32 _key, address _value)</code></a></li><li><a href="#Map.remove(bytes32)"><code class="function-signature">remove(bytes32 _key)</code></a></li><li><a href="#Map.get(bytes32)"><code class="function-signature">get(bytes32 _key)</code></a></li><li><a href="#Map.getAsAddressOrZero(bytes32)"><code class="function-signature">getAsAddressOrZero(bytes32 _key)</code></a></li><li><a href="#Map.contains(bytes32)"><code class="function-signature">contains(bytes32 _key)</code></a></li><li><a href="#Map.getCount()"><code class="function-signature">getCount()</code></a></li><li><a href="#Map.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li class="inherited"><a href="collections#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li class="inherited"><a href="collections#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li><li class="inherited"><a href="collections#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="collections#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="collections#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Map.initialize(address)"></a><code class="function-signature">initialize(address _owner)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Map.add(bytes32,address)"></a><code class="function-signature">add(bytes32 _key, address _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Map.remove(bytes32)"></a><code class="function-signature">remove(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Map.get(bytes32)"></a><code class="function-signature">get(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Map.getAsAddressOrZero(bytes32)"></a><code class="function-signature">getAsAddressOrZero(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Map.contains(bytes32)"></a><code class="function-signature">contains(bytes32 _key) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Map.getCount()"></a><code class="function-signature">getCount() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Map.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







### `Ownable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li><a href="#Ownable.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Ownable.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>

The Ownable constructor sets the original `owner` of the contract to the sender
account.



<h4><a class="anchor" aria-hidden="true" id="Ownable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Ownable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Allows the current owner to transfer control of the contract to a newOwner.




<h4><a class="anchor" aria-hidden="true" id="Ownable.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







</div>