---
title: External
---

<div class="contracts">

## Contracts

### `IDaiFaucet`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiFaucet.gulp(address)"><code class="function-signature">gulp(address gem)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiFaucet.gulp(address)"></a><code class="function-signature">gulp(address gem)</code><span class="function-visibility">public</span></h4>







### `IDaiJoin`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiJoin.join(address,uint256)"><code class="function-signature">join(address urn, uint256 wad)</code></a></li><li><a href="#IDaiJoin.exit(address,uint256)"><code class="function-signature">exit(address usr, uint256 wad)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiJoin.join(address,uint256)"></a><code class="function-signature">join(address urn, uint256 wad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiJoin.exit(address,uint256)"></a><code class="function-signature">exit(address usr, uint256 wad)</code><span class="function-visibility">public</span></h4>







### `IDaiPot`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiPot.drip()"><code class="function-signature">drip()</code></a></li><li><a href="#IDaiPot.join(uint256)"><code class="function-signature">join(uint256 wad)</code></a></li><li><a href="#IDaiPot.exit(uint256)"><code class="function-signature">exit(uint256 wad)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiPot.drip()"></a><code class="function-signature">drip()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiPot.join(uint256)"></a><code class="function-signature">join(uint256 wad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiPot.exit(uint256)"></a><code class="function-signature">exit(uint256 wad)</code><span class="function-visibility">public</span></h4>







### `IDaiVat`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IDaiVat.hope(address)"><code class="function-signature">hope(address usr)</code></a></li><li><a href="#IDaiVat.move(address,address,uint256)"><code class="function-signature">move(address src, address dst, uint256 rad)</code></a></li><li><a href="#IDaiVat.suck(address,address,uint256)"><code class="function-signature">suck(address u, address v, uint256 rad)</code></a></li><li><a href="#IDaiVat.frob(bytes32,address,address,address,int256,int256)"><code class="function-signature">frob(bytes32 i, address u, address v, address w, int256 dink, int256 dart)</code></a></li><li><a href="#IDaiVat.faucet(address,uint256)"><code class="function-signature">faucet(address _target, uint256 _amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IDaiVat.hope(address)"></a><code class="function-signature">hope(address usr)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.move(address,address,uint256)"></a><code class="function-signature">move(address src, address dst, uint256 rad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.suck(address,address,uint256)"></a><code class="function-signature">suck(address u, address v, uint256 rad)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.frob(bytes32,address,address,address,int256,int256)"></a><code class="function-signature">frob(bytes32 i, address u, address v, address w, int256 dink, int256 dart)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IDaiVat.faucet(address,uint256)"></a><code class="function-signature">faucet(address _target, uint256 _amount)</code><span class="function-visibility">public</span></h4>







### `IExchange`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IExchange.getOrderInfo(struct IExchange.Order)"><code class="function-signature">getOrderInfo(struct IExchange.Order order)</code></a></li><li><a href="#IExchange.fillOrder(struct IExchange.Order,uint256,bytes)"><code class="function-signature">fillOrder(struct IExchange.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li><a href="#IExchange.fillOrderNoThrow(struct IExchange.Order,uint256,bytes)"><code class="function-signature">fillOrderNoThrow(struct IExchange.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li></ul></div>



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



<h4><a class="anchor" aria-hidden="true" id="IExchange.fillOrderNoThrow(struct IExchange.Order,uint256,bytes)"></a><code class="function-signature">fillOrderNoThrow(struct IExchange.Order order, uint256 takerAssetFillAmount, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct IExchange.FillResults</span></code><span class="function-visibility">public</span></h4>

Fills an order with specified parameters and ECDSA signature.
      Returns false if the transaction would otherwise revert.
 @param order Order struct containing order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signature Proof that order has been created by maker.
 @return Amounts filled and fees paid by maker and taker.





### `IGnosisSafe`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IGnosisSafe.getThreshold()"><code class="function-signature">getThreshold()</code></a></li><li><a href="#IGnosisSafe.getOwners()"><code class="function-signature">getOwners()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IGnosisSafe.getThreshold()"></a><code class="function-signature">getThreshold() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IGnosisSafe.getOwners()"></a><code class="function-signature">getOwners() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">public</span></h4>







### `IProxy`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IProxy.masterCopy()"><code class="function-signature">masterCopy()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IProxy.masterCopy()"></a><code class="function-signature">masterCopy() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>







### `IProxyFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IProxyFactory.proxyRuntimeCode()"><code class="function-signature">proxyRuntimeCode()</code></a></li><li><a href="#IProxyFactory.proxyCreationCode()"><code class="function-signature">proxyCreationCode()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IProxyFactory.proxyRuntimeCode()"></a><code class="function-signature">proxyRuntimeCode() <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProxyFactory.proxyCreationCode()"></a><code class="function-signature">proxyCreationCode() <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>







### `IWallet`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IWallet.isValidSignature(bytes32,bytes)"><code class="function-signature">isValidSignature(bytes32 hash, bytes signature)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IWallet.isValidSignature(bytes32,bytes)"></a><code class="function-signature">isValidSignature(bytes32 hash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

Verifies that a signature is valid.
 @param hash Message hash that is signed.
 @param signature Proof of signing.
 @return Validity of order signature.





</div>