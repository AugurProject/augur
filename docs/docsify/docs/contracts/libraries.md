---
title: Libraries
---

<div class="contracts">

## Contracts

### `CloneFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#CloneFactory.createClone(address)"><code class="function-signature">createClone(address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="CloneFactory.createClone(address)"></a><code class="function-signature">createClone(address target) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>







### `ContractExists`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ContractExists.exists(address)"><code class="function-signature">exists(address _address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ContractExists.exists(address)"></a><code class="function-signature">exists(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







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







### `IOwnable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOwnable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOwnable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `ITyped`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITyped.getTypeName()"><code class="function-signature">getTypeName()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITyped.getTypeName()"></a><code class="function-signature">getTypeName() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







### `Initializable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Initializable.endInitialization()"><code class="function-signature">endInitialization()</code></a></li><li><a href="#Initializable.getInitialized()"><code class="function-signature">getInitialized()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Initializable.endInitialization()"></a><code class="function-signature">endInitialization() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Initializable.getInitialized()"></a><code class="function-signature">getInitialized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `Ownable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li><a href="#Ownable.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Ownable.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>

The Ownable constructor sets the original `owner` of the contract to the sender
account.



<h4><a class="anchor" aria-hidden="true" id="Ownable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Ownable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Allows the current owner to transfer control of the contract to a newOwner.




<h4><a class="anchor" aria-hidden="true" id="Ownable.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `ReentrancyGuard`



<div class="contract-index"></div>





</div>