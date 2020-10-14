---
title: Ens
---

<div class="contracts">

## Contracts

### `ENSRegistry`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ENSRegistry.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#ENSRegistry.setOwner(bytes32,address)"><code class="function-signature">setOwner(bytes32 node, address owner)</code></a></li><li><a href="#ENSRegistry.setSubnodeOwner(bytes32,bytes32,address)"><code class="function-signature">setSubnodeOwner(bytes32 node, bytes32 label, address owner)</code></a></li><li><a href="#ENSRegistry.setResolver(bytes32,address)"><code class="function-signature">setResolver(bytes32 node, address resolver)</code></a></li><li><a href="#ENSRegistry.setTTL(bytes32,uint64)"><code class="function-signature">setTTL(bytes32 node, uint64 ttl)</code></a></li><li><a href="#ENSRegistry.owner(bytes32)"><code class="function-signature">owner(bytes32 node)</code></a></li><li><a href="#ENSRegistry.resolver(bytes32)"><code class="function-signature">resolver(bytes32 node)</code></a></li><li><a href="#ENSRegistry.ttl(bytes32)"><code class="function-signature">ttl(bytes32 node)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="ens#IENSRegistry.NewOwner(bytes32,bytes32,address)"><code class="function-signature">NewOwner(bytes32 node, bytes32 label, address owner)</code></a></li><li class="inherited"><a href="ens#IENSRegistry.Transfer(bytes32,address)"><code class="function-signature">Transfer(bytes32 node, address owner)</code></a></li><li class="inherited"><a href="ens#IENSRegistry.NewResolver(bytes32,address)"><code class="function-signature">NewResolver(bytes32 node, address resolver)</code></a></li><li class="inherited"><a href="ens#IENSRegistry.NewTTL(bytes32,uint64)"><code class="function-signature">NewTTL(bytes32 node, uint64 ttl)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ENSRegistry.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>

Constructs a new ENS registrar.



<h4><a class="anchor" aria-hidden="true" id="ENSRegistry.setOwner(bytes32,address)"></a><code class="function-signature">setOwner(bytes32 node, address owner)</code><span class="function-visibility">external</span></h4>

Transfers ownership of a node to a new address. May only be called by the current owner of the node.




<h4><a class="anchor" aria-hidden="true" id="ENSRegistry.setSubnodeOwner(bytes32,bytes32,address)"></a><code class="function-signature">setSubnodeOwner(bytes32 node, bytes32 label, address owner)</code><span class="function-visibility">external</span></h4>

Transfers ownership of a subnode keccak256(node, label) to a new address. May only be called by the owner of the parent node.




<h4><a class="anchor" aria-hidden="true" id="ENSRegistry.setResolver(bytes32,address)"></a><code class="function-signature">setResolver(bytes32 node, address resolver)</code><span class="function-visibility">external</span></h4>

Sets the resolver address for the specified node.




<h4><a class="anchor" aria-hidden="true" id="ENSRegistry.setTTL(bytes32,uint64)"></a><code class="function-signature">setTTL(bytes32 node, uint64 ttl)</code><span class="function-visibility">external</span></h4>

Sets the TTL for the specified node.




<h4><a class="anchor" aria-hidden="true" id="ENSRegistry.owner(bytes32)"></a><code class="function-signature">owner(bytes32 node) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Returns the address that owns the specified node.




<h4><a class="anchor" aria-hidden="true" id="ENSRegistry.resolver(bytes32)"></a><code class="function-signature">resolver(bytes32 node) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Returns the address of the resolver for the specified node.




<h4><a class="anchor" aria-hidden="true" id="ENSRegistry.ttl(bytes32)"></a><code class="function-signature">ttl(bytes32 node) <span class="return-arrow">→</span> <span class="return-type">uint64</span></code><span class="function-visibility">external</span></h4>

Returns the TTL of a node, and any records associated with it.






### `IENSRegistry`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IENSRegistry.setSubnodeOwner(bytes32,bytes32,address)"><code class="function-signature">setSubnodeOwner(bytes32 node, bytes32 label, address owner)</code></a></li><li><a href="#IENSRegistry.setResolver(bytes32,address)"><code class="function-signature">setResolver(bytes32 node, address resolver)</code></a></li><li><a href="#IENSRegistry.setOwner(bytes32,address)"><code class="function-signature">setOwner(bytes32 node, address owner)</code></a></li><li><a href="#IENSRegistry.setTTL(bytes32,uint64)"><code class="function-signature">setTTL(bytes32 node, uint64 ttl)</code></a></li><li><a href="#IENSRegistry.owner(bytes32)"><code class="function-signature">owner(bytes32 node)</code></a></li><li><a href="#IENSRegistry.resolver(bytes32)"><code class="function-signature">resolver(bytes32 node)</code></a></li><li><a href="#IENSRegistry.ttl(bytes32)"><code class="function-signature">ttl(bytes32 node)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IENSRegistry.NewOwner(bytes32,bytes32,address)"><code class="function-signature">NewOwner(bytes32 node, bytes32 label, address owner)</code></a></li><li><a href="#IENSRegistry.Transfer(bytes32,address)"><code class="function-signature">Transfer(bytes32 node, address owner)</code></a></li><li><a href="#IENSRegistry.NewResolver(bytes32,address)"><code class="function-signature">NewResolver(bytes32 node, address resolver)</code></a></li><li><a href="#IENSRegistry.NewTTL(bytes32,uint64)"><code class="function-signature">NewTTL(bytes32 node, uint64 ttl)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.setSubnodeOwner(bytes32,bytes32,address)"></a><code class="function-signature">setSubnodeOwner(bytes32 node, bytes32 label, address owner)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.setResolver(bytes32,address)"></a><code class="function-signature">setResolver(bytes32 node, address resolver)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.setOwner(bytes32,address)"></a><code class="function-signature">setOwner(bytes32 node, address owner)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.setTTL(bytes32,uint64)"></a><code class="function-signature">setTTL(bytes32 node, uint64 ttl)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.owner(bytes32)"></a><code class="function-signature">owner(bytes32 node) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.resolver(bytes32)"></a><code class="function-signature">resolver(bytes32 node) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.ttl(bytes32)"></a><code class="function-signature">ttl(bytes32 node) <span class="return-arrow">→</span> <span class="return-type">uint64</span></code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.NewOwner(bytes32,bytes32,address)"></a><code class="function-signature">NewOwner(bytes32 node, bytes32 label, address owner)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.Transfer(bytes32,address)"></a><code class="function-signature">Transfer(bytes32 node, address owner)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.NewResolver(bytes32,address)"></a><code class="function-signature">NewResolver(bytes32 node, address resolver)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IENSRegistry.NewTTL(bytes32,uint64)"></a><code class="function-signature">NewTTL(bytes32 node, uint64 ttl)</code><span class="function-visibility"></span></h4>





</div>