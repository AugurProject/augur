---
title: Registry
---

<div class="contracts">

## Contracts

### `CoordinatorRegistry`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#CoordinatorRegistry.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="registry#MixinCoordinatorRegistryCore.setCoordinatorEndpoint(string)"><code class="function-signature">setCoordinatorEndpoint(string coordinatorEndpoint)</code></a></li><li class="inherited"><a href="registry#MixinCoordinatorRegistryCore.getCoordinatorEndpoint(address)"><code class="function-signature">getCoordinatorEndpoint(address coordinatorOperator)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="registry#ICoordinatorRegistryCore.CoordinatorEndpointSet(address,string)"><code class="function-signature">CoordinatorEndpointSet(address coordinatorOperator, string coordinatorEndpoint)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="CoordinatorRegistry.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>







### `ICoordinatorRegistryCore`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ICoordinatorRegistryCore.setCoordinatorEndpoint(string)"><code class="function-signature">setCoordinatorEndpoint(string coordinatorEndpoint)</code></a></li><li><a href="#ICoordinatorRegistryCore.getCoordinatorEndpoint(address)"><code class="function-signature">getCoordinatorEndpoint(address coordinatorOperator)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ICoordinatorRegistryCore.CoordinatorEndpointSet(address,string)"><code class="function-signature">CoordinatorEndpointSet(address coordinatorOperator, string coordinatorEndpoint)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ICoordinatorRegistryCore.setCoordinatorEndpoint(string)"></a><code class="function-signature">setCoordinatorEndpoint(string coordinatorEndpoint)</code><span class="function-visibility">external</span></h4>

Called by a Coordinator operator to set the endpoint of their Coordinator.
 @param coordinatorEndpoint Endpoint of the Coordinator as a string.



<h4><a class="anchor" aria-hidden="true" id="ICoordinatorRegistryCore.getCoordinatorEndpoint(address)"></a><code class="function-signature">getCoordinatorEndpoint(address coordinatorOperator) <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>

Gets the endpoint for a Coordinator.
 @param coordinatorOperator Operator of the Coordinator endpoint.
 @return coordinatorEndpoint Endpoint of the Coordinator as a string.





<h4><a class="anchor" aria-hidden="true" id="ICoordinatorRegistryCore.CoordinatorEndpointSet(address,string)"></a><code class="function-signature">CoordinatorEndpointSet(address coordinatorOperator, string coordinatorEndpoint)</code><span class="function-visibility"></span></h4>

Emitted when a Coordinator endpoint is set.



### `MixinCoordinatorRegistryCore`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinCoordinatorRegistryCore.setCoordinatorEndpoint(string)"><code class="function-signature">setCoordinatorEndpoint(string coordinatorEndpoint)</code></a></li><li><a href="#MixinCoordinatorRegistryCore.getCoordinatorEndpoint(address)"><code class="function-signature">getCoordinatorEndpoint(address coordinatorOperator)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="registry#ICoordinatorRegistryCore.CoordinatorEndpointSet(address,string)"><code class="function-signature">CoordinatorEndpointSet(address coordinatorOperator, string coordinatorEndpoint)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinCoordinatorRegistryCore.setCoordinatorEndpoint(string)"></a><code class="function-signature">setCoordinatorEndpoint(string coordinatorEndpoint)</code><span class="function-visibility">external</span></h4>

Called by a Coordinator operator to set the endpoint of their Coordinator.
 @param coordinatorEndpoint Endpoint of the Coordinator as a string.



<h4><a class="anchor" aria-hidden="true" id="MixinCoordinatorRegistryCore.getCoordinatorEndpoint(address)"></a><code class="function-signature">getCoordinatorEndpoint(address coordinatorOperator) <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>

Gets the endpoint for a Coordinator.
 @param coordinatorOperator Operator of the Coordinator endpoint.
 @return coordinatorEndpoint Endpoint of the Coordinator as a string.





</div>