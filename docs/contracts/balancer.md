---
title: Balancer
---

<div class="contracts">

## Contracts

### `BBronze`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BBronze.getColor()"><code class="function-signature">getColor()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BBronze.getColor()"></a><code class="function-signature">getColor() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>







### `BColor`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BColor.getColor()"><code class="function-signature">getColor()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BColor.getColor()"></a><code class="function-signature">getColor() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>







### `BConst`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li class="inherited"><a href="balancer#BBronze.getColor()"><code class="function-signature">getColor()</code></a></li></ul></div>





### `BFactory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BFactory.isBPool(address)"><code class="function-signature">isBPool(address b)</code></a></li><li><a href="#BFactory.newBPool()"><code class="function-signature">newBPool()</code></a></li><li><a href="#BFactory.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#BFactory.getBLabs()"><code class="function-signature">getBLabs()</code></a></li><li><a href="#BFactory.setBLabs(address)"><code class="function-signature">setBLabs(address b)</code></a></li><li><a href="#BFactory.collect(contract BPool)"><code class="function-signature">collect(contract BPool pool)</code></a></li><li class="inherited"><a href="#BBronze.getColor()"><code class="function-signature">getColor()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#BFactory.LOG_NEW_POOL(address,address)"><code class="function-signature">LOG_NEW_POOL(address caller, address pool)</code></a></li><li><a href="#BFactory.LOG_BLABS(address,address)"><code class="function-signature">LOG_BLABS(address caller, address blabs)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BFactory.isBPool(address)"></a><code class="function-signature">isBPool(address b) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BFactory.newBPool()"></a><code class="function-signature">newBPool() <span class="return-arrow">→</span> <span class="return-type">contract BPool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BFactory.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BFactory.getBLabs()"></a><code class="function-signature">getBLabs() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BFactory.setBLabs(address)"></a><code class="function-signature">setBLabs(address b)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BFactory.collect(contract BPool)"></a><code class="function-signature">collect(contract BPool pool)</code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="BFactory.LOG_NEW_POOL(address,address)"></a><code class="function-signature">LOG_NEW_POOL(address caller, address pool)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="BFactory.LOG_BLABS(address,address)"></a><code class="function-signature">LOG_BLABS(address caller, address blabs)</code><span class="function-visibility"></span></h4>





### `BMath`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BMath.calcSpotPrice(uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcSpotPrice(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 swapFee)</code></a></li><li><a href="#BMath.calcOutGivenIn(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcOutGivenIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountIn, uint256 swapFee)</code></a></li><li><a href="#BMath.calcInGivenOut(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcInGivenOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountOut, uint256 swapFee)</code></a></li><li><a href="#BMath.calcPoolOutGivenSingleIn(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcPoolOutGivenSingleIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountIn, uint256 swapFee)</code></a></li><li><a href="#BMath.calcSingleInGivenPoolOut(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcSingleInGivenPoolOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountOut, uint256 swapFee)</code></a></li><li><a href="#BMath.calcSingleOutGivenPoolIn(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcSingleOutGivenPoolIn(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountIn, uint256 swapFee)</code></a></li><li><a href="#BMath.calcPoolInGivenSingleOut(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcPoolInGivenSingleOut(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountOut, uint256 swapFee)</code></a></li><li class="inherited"><a href="balancer#BNum.btoi(uint256)"><code class="function-signature">btoi(uint256 a)</code></a></li><li class="inherited"><a href="balancer#BNum.bfloor(uint256)"><code class="function-signature">bfloor(uint256 a)</code></a></li><li class="inherited"><a href="balancer#BNum.badd(uint256,uint256)"><code class="function-signature">badd(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bsub(uint256,uint256)"><code class="function-signature">bsub(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bsubSign(uint256,uint256)"><code class="function-signature">bsubSign(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bmul(uint256,uint256)"><code class="function-signature">bmul(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bdiv(uint256,uint256)"><code class="function-signature">bdiv(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bpowi(uint256,uint256)"><code class="function-signature">bpowi(uint256 a, uint256 n)</code></a></li><li class="inherited"><a href="balancer#BNum.bpow(uint256,uint256)"><code class="function-signature">bpow(uint256 base, uint256 exp)</code></a></li><li class="inherited"><a href="balancer#BNum.bpowApprox(uint256,uint256,uint256)"><code class="function-signature">bpowApprox(uint256 base, uint256 exp, uint256 precision)</code></a></li><li class="inherited"><a href="balancer#BBronze.getColor()"><code class="function-signature">getColor()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BMath.calcSpotPrice(uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calcSpotPrice(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 swapFee) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BMath.calcOutGivenIn(uint256,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calcOutGivenIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountIn, uint256 swapFee) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BMath.calcInGivenOut(uint256,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calcInGivenOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountOut, uint256 swapFee) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BMath.calcPoolOutGivenSingleIn(uint256,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calcPoolOutGivenSingleIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountIn, uint256 swapFee) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BMath.calcSingleInGivenPoolOut(uint256,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calcSingleInGivenPoolOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountOut, uint256 swapFee) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BMath.calcSingleOutGivenPoolIn(uint256,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calcSingleOutGivenPoolIn(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountIn, uint256 swapFee) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BMath.calcPoolInGivenSingleOut(uint256,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">calcPoolInGivenSingleOut(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountOut, uint256 swapFee) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







### `BNum`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BNum.btoi(uint256)"><code class="function-signature">btoi(uint256 a)</code></a></li><li><a href="#BNum.bfloor(uint256)"><code class="function-signature">bfloor(uint256 a)</code></a></li><li><a href="#BNum.badd(uint256,uint256)"><code class="function-signature">badd(uint256 a, uint256 b)</code></a></li><li><a href="#BNum.bsub(uint256,uint256)"><code class="function-signature">bsub(uint256 a, uint256 b)</code></a></li><li><a href="#BNum.bsubSign(uint256,uint256)"><code class="function-signature">bsubSign(uint256 a, uint256 b)</code></a></li><li><a href="#BNum.bmul(uint256,uint256)"><code class="function-signature">bmul(uint256 a, uint256 b)</code></a></li><li><a href="#BNum.bdiv(uint256,uint256)"><code class="function-signature">bdiv(uint256 a, uint256 b)</code></a></li><li><a href="#BNum.bpowi(uint256,uint256)"><code class="function-signature">bpowi(uint256 a, uint256 n)</code></a></li><li><a href="#BNum.bpow(uint256,uint256)"><code class="function-signature">bpow(uint256 base, uint256 exp)</code></a></li><li><a href="#BNum.bpowApprox(uint256,uint256,uint256)"><code class="function-signature">bpowApprox(uint256 base, uint256 exp, uint256 precision)</code></a></li><li class="inherited"><a href="balancer#BBronze.getColor()"><code class="function-signature">getColor()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BNum.btoi(uint256)"></a><code class="function-signature">btoi(uint256 a) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BNum.bfloor(uint256)"></a><code class="function-signature">bfloor(uint256 a) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BNum.badd(uint256,uint256)"></a><code class="function-signature">badd(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BNum.bsub(uint256,uint256)"></a><code class="function-signature">bsub(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BNum.bsubSign(uint256,uint256)"></a><code class="function-signature">bsubSign(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256,bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BNum.bmul(uint256,uint256)"></a><code class="function-signature">bmul(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BNum.bdiv(uint256,uint256)"></a><code class="function-signature">bdiv(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BNum.bpowi(uint256,uint256)"></a><code class="function-signature">bpowi(uint256 a, uint256 n) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BNum.bpow(uint256,uint256)"></a><code class="function-signature">bpow(uint256 base, uint256 exp) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BNum.bpowApprox(uint256,uint256,uint256)"></a><code class="function-signature">bpowApprox(uint256 base, uint256 exp, uint256 precision) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `BPool`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BPool.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#BPool.isPublicSwap()"><code class="function-signature">isPublicSwap()</code></a></li><li><a href="#BPool.isFinalized()"><code class="function-signature">isFinalized()</code></a></li><li><a href="#BPool.isBound(address)"><code class="function-signature">isBound(address t)</code></a></li><li><a href="#BPool.getNumTokens()"><code class="function-signature">getNumTokens()</code></a></li><li><a href="#BPool.getCurrentTokens()"><code class="function-signature">getCurrentTokens()</code></a></li><li><a href="#BPool.getFinalTokens()"><code class="function-signature">getFinalTokens()</code></a></li><li><a href="#BPool.getDenormalizedWeight(address)"><code class="function-signature">getDenormalizedWeight(address token)</code></a></li><li><a href="#BPool.getTotalDenormalizedWeight()"><code class="function-signature">getTotalDenormalizedWeight()</code></a></li><li><a href="#BPool.getNormalizedWeight(address)"><code class="function-signature">getNormalizedWeight(address token)</code></a></li><li><a href="#BPool.getBalance(address)"><code class="function-signature">getBalance(address token)</code></a></li><li><a href="#BPool.getSwapFee()"><code class="function-signature">getSwapFee()</code></a></li><li><a href="#BPool.getController()"><code class="function-signature">getController()</code></a></li><li><a href="#BPool.setSwapFee(uint256)"><code class="function-signature">setSwapFee(uint256 swapFee)</code></a></li><li><a href="#BPool.setController(address)"><code class="function-signature">setController(address manager)</code></a></li><li><a href="#BPool.setPublicSwap(bool)"><code class="function-signature">setPublicSwap(bool public_)</code></a></li><li><a href="#BPool.finalize()"><code class="function-signature">finalize()</code></a></li><li><a href="#BPool.bind(address,uint256,uint256)"><code class="function-signature">bind(address token, uint256 balance, uint256 denorm)</code></a></li><li><a href="#BPool.rebind(address,uint256,uint256)"><code class="function-signature">rebind(address token, uint256 balance, uint256 denorm)</code></a></li><li><a href="#BPool.unbind(address)"><code class="function-signature">unbind(address token)</code></a></li><li><a href="#BPool.gulp(address)"><code class="function-signature">gulp(address token)</code></a></li><li><a href="#BPool.getSpotPrice(address,address)"><code class="function-signature">getSpotPrice(address tokenIn, address tokenOut)</code></a></li><li><a href="#BPool.getSpotPriceSansFee(address,address)"><code class="function-signature">getSpotPriceSansFee(address tokenIn, address tokenOut)</code></a></li><li><a href="#BPool.joinPool(uint256,uint256[])"><code class="function-signature">joinPool(uint256 poolAmountOut, uint256[] maxAmountsIn)</code></a></li><li><a href="#BPool.exitPool(uint256,uint256[])"><code class="function-signature">exitPool(uint256 poolAmountIn, uint256[] minAmountsOut)</code></a></li><li><a href="#BPool.calcExitPool(uint256,uint256[])"><code class="function-signature">calcExitPool(uint256 poolAmountIn, uint256[] minAmountsOut)</code></a></li><li><a href="#BPool.swapExactAmountIn(address,uint256,address,uint256,uint256)"><code class="function-signature">swapExactAmountIn(address tokenIn, uint256 tokenAmountIn, address tokenOut, uint256 minAmountOut, uint256 maxPrice)</code></a></li><li><a href="#BPool.swapExactAmountOut(address,uint256,address,uint256,uint256)"><code class="function-signature">swapExactAmountOut(address tokenIn, uint256 maxAmountIn, address tokenOut, uint256 tokenAmountOut, uint256 maxPrice)</code></a></li><li><a href="#BPool.joinswapExternAmountIn(address,uint256,uint256)"><code class="function-signature">joinswapExternAmountIn(address tokenIn, uint256 tokenAmountIn, uint256 minPoolAmountOut)</code></a></li><li><a href="#BPool.joinswapPoolAmountOut(address,uint256,uint256)"><code class="function-signature">joinswapPoolAmountOut(address tokenIn, uint256 poolAmountOut, uint256 maxAmountIn)</code></a></li><li><a href="#BPool.exitswapPoolAmountIn(address,uint256,uint256)"><code class="function-signature">exitswapPoolAmountIn(address tokenOut, uint256 poolAmountIn, uint256 minAmountOut)</code></a></li><li><a href="#BPool.exitswapExternAmountOut(address,uint256,uint256)"><code class="function-signature">exitswapExternAmountOut(address tokenOut, uint256 tokenAmountOut, uint256 maxPoolAmountIn)</code></a></li><li><a href="#BPool._pullUnderlying(address,address,uint256)"><code class="function-signature">_pullUnderlying(address erc20, address from, uint256 amount)</code></a></li><li><a href="#BPool._pushUnderlying(address,address,uint256)"><code class="function-signature">_pushUnderlying(address erc20, address to, uint256 amount)</code></a></li><li><a href="#BPool._pullPoolShare(address,uint256)"><code class="function-signature">_pullPoolShare(address from, uint256 amount)</code></a></li><li><a href="#BPool._pushPoolShare(address,uint256)"><code class="function-signature">_pushPoolShare(address to, uint256 amount)</code></a></li><li><a href="#BPool._mintPoolShare(uint256)"><code class="function-signature">_mintPoolShare(uint256 amount)</code></a></li><li><a href="#BPool._burnPoolShare(uint256)"><code class="function-signature">_burnPoolShare(uint256 amount)</code></a></li><li class="inherited"><a href="balancer#BMath.calcSpotPrice(uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcSpotPrice(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 swapFee)</code></a></li><li class="inherited"><a href="balancer#BMath.calcOutGivenIn(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcOutGivenIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountIn, uint256 swapFee)</code></a></li><li class="inherited"><a href="balancer#BMath.calcInGivenOut(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcInGivenOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountOut, uint256 swapFee)</code></a></li><li class="inherited"><a href="balancer#BMath.calcPoolOutGivenSingleIn(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcPoolOutGivenSingleIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountIn, uint256 swapFee)</code></a></li><li class="inherited"><a href="balancer#BMath.calcSingleInGivenPoolOut(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcSingleInGivenPoolOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountOut, uint256 swapFee)</code></a></li><li class="inherited"><a href="balancer#BMath.calcSingleOutGivenPoolIn(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcSingleOutGivenPoolIn(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountIn, uint256 swapFee)</code></a></li><li class="inherited"><a href="balancer#BMath.calcPoolInGivenSingleOut(uint256,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">calcPoolInGivenSingleOut(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountOut, uint256 swapFee)</code></a></li><li class="inherited"><a href="balancer#BToken.name()"><code class="function-signature">name()</code></a></li><li class="inherited"><a href="balancer#BToken.symbol()"><code class="function-signature">symbol()</code></a></li><li class="inherited"><a href="balancer#BToken.decimals()"><code class="function-signature">decimals()</code></a></li><li class="inherited"><a href="balancer#BToken.allowance(address,address)"><code class="function-signature">allowance(address src, address dst)</code></a></li><li class="inherited"><a href="balancer#BToken.balanceOf(address)"><code class="function-signature">balanceOf(address whom)</code></a></li><li class="inherited"><a href="balancer#BToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="balancer#BToken.approve(address,uint256)"><code class="function-signature">approve(address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BToken.transfer(address,uint256)"><code class="function-signature">transfer(address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address src, address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._mint(uint256)"><code class="function-signature">_mint(uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._burn(uint256)"><code class="function-signature">_burn(uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._move(address,address,uint256)"><code class="function-signature">_move(address src, address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._push(address,uint256)"><code class="function-signature">_push(address to, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._pull(address,uint256)"><code class="function-signature">_pull(address from, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BNum.btoi(uint256)"><code class="function-signature">btoi(uint256 a)</code></a></li><li class="inherited"><a href="balancer#BNum.bfloor(uint256)"><code class="function-signature">bfloor(uint256 a)</code></a></li><li class="inherited"><a href="balancer#BNum.badd(uint256,uint256)"><code class="function-signature">badd(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bsub(uint256,uint256)"><code class="function-signature">bsub(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bsubSign(uint256,uint256)"><code class="function-signature">bsubSign(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bmul(uint256,uint256)"><code class="function-signature">bmul(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bdiv(uint256,uint256)"><code class="function-signature">bdiv(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bpowi(uint256,uint256)"><code class="function-signature">bpowi(uint256 a, uint256 n)</code></a></li><li class="inherited"><a href="balancer#BNum.bpow(uint256,uint256)"><code class="function-signature">bpow(uint256 base, uint256 exp)</code></a></li><li class="inherited"><a href="balancer#BNum.bpowApprox(uint256,uint256,uint256)"><code class="function-signature">bpowApprox(uint256 base, uint256 exp, uint256 precision)</code></a></li><li class="inherited"><a href="balancer#BBronze.getColor()"><code class="function-signature">getColor()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#BPool.LOG_SWAP(address,address,address,uint256,uint256)"><code class="function-signature">LOG_SWAP(address caller, address tokenIn, address tokenOut, uint256 tokenAmountIn, uint256 tokenAmountOut)</code></a></li><li><a href="#BPool.LOG_JOIN(address,address,uint256)"><code class="function-signature">LOG_JOIN(address caller, address tokenIn, uint256 tokenAmountIn)</code></a></li><li><a href="#BPool.LOG_EXIT(address,address,uint256)"><code class="function-signature">LOG_EXIT(address caller, address tokenOut, uint256 tokenAmountOut)</code></a></li><li><a href="#BPool.LOG_CALL(bytes4,address,bytes)"><code class="function-signature">LOG_CALL(bytes4 sig, address caller, bytes data)</code></a></li><li class="inherited"><a href="balancer#IERC20Balancer.Approval(address,address,uint256)"><code class="function-signature">Approval(address src, address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#IERC20Balancer.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address src, address dst, uint256 amt)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BPool.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.isPublicSwap()"></a><code class="function-signature">isPublicSwap() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.isFinalized()"></a><code class="function-signature">isFinalized() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.isBound(address)"></a><code class="function-signature">isBound(address t) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getNumTokens()"></a><code class="function-signature">getNumTokens() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getCurrentTokens()"></a><code class="function-signature">getCurrentTokens() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getFinalTokens()"></a><code class="function-signature">getFinalTokens() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getDenormalizedWeight(address)"></a><code class="function-signature">getDenormalizedWeight(address token) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getTotalDenormalizedWeight()"></a><code class="function-signature">getTotalDenormalizedWeight() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getNormalizedWeight(address)"></a><code class="function-signature">getNormalizedWeight(address token) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getBalance(address)"></a><code class="function-signature">getBalance(address token) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getSwapFee()"></a><code class="function-signature">getSwapFee() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getController()"></a><code class="function-signature">getController() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.setSwapFee(uint256)"></a><code class="function-signature">setSwapFee(uint256 swapFee)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.setController(address)"></a><code class="function-signature">setController(address manager)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.setPublicSwap(bool)"></a><code class="function-signature">setPublicSwap(bool public_)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.finalize()"></a><code class="function-signature">finalize()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.bind(address,uint256,uint256)"></a><code class="function-signature">bind(address token, uint256 balance, uint256 denorm)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.rebind(address,uint256,uint256)"></a><code class="function-signature">rebind(address token, uint256 balance, uint256 denorm)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.unbind(address)"></a><code class="function-signature">unbind(address token)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.gulp(address)"></a><code class="function-signature">gulp(address token)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getSpotPrice(address,address)"></a><code class="function-signature">getSpotPrice(address tokenIn, address tokenOut) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.getSpotPriceSansFee(address,address)"></a><code class="function-signature">getSpotPriceSansFee(address tokenIn, address tokenOut) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.joinPool(uint256,uint256[])"></a><code class="function-signature">joinPool(uint256 poolAmountOut, uint256[] maxAmountsIn)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.exitPool(uint256,uint256[])"></a><code class="function-signature">exitPool(uint256 poolAmountIn, uint256[] minAmountsOut)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.calcExitPool(uint256,uint256[])"></a><code class="function-signature">calcExitPool(uint256 poolAmountIn, uint256[] minAmountsOut) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.swapExactAmountIn(address,uint256,address,uint256,uint256)"></a><code class="function-signature">swapExactAmountIn(address tokenIn, uint256 tokenAmountIn, address tokenOut, uint256 minAmountOut, uint256 maxPrice) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.swapExactAmountOut(address,uint256,address,uint256,uint256)"></a><code class="function-signature">swapExactAmountOut(address tokenIn, uint256 maxAmountIn, address tokenOut, uint256 tokenAmountOut, uint256 maxPrice) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.joinswapExternAmountIn(address,uint256,uint256)"></a><code class="function-signature">joinswapExternAmountIn(address tokenIn, uint256 tokenAmountIn, uint256 minPoolAmountOut) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.joinswapPoolAmountOut(address,uint256,uint256)"></a><code class="function-signature">joinswapPoolAmountOut(address tokenIn, uint256 poolAmountOut, uint256 maxAmountIn) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.exitswapPoolAmountIn(address,uint256,uint256)"></a><code class="function-signature">exitswapPoolAmountIn(address tokenOut, uint256 poolAmountIn, uint256 minAmountOut) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.exitswapExternAmountOut(address,uint256,uint256)"></a><code class="function-signature">exitswapExternAmountOut(address tokenOut, uint256 tokenAmountOut, uint256 maxPoolAmountIn) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool._pullUnderlying(address,address,uint256)"></a><code class="function-signature">_pullUnderlying(address erc20, address from, uint256 amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool._pushUnderlying(address,address,uint256)"></a><code class="function-signature">_pushUnderlying(address erc20, address to, uint256 amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool._pullPoolShare(address,uint256)"></a><code class="function-signature">_pullPoolShare(address from, uint256 amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool._pushPoolShare(address,uint256)"></a><code class="function-signature">_pushPoolShare(address to, uint256 amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool._mintPoolShare(uint256)"></a><code class="function-signature">_mintPoolShare(uint256 amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool._burnPoolShare(uint256)"></a><code class="function-signature">_burnPoolShare(uint256 amount)</code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="BPool.LOG_SWAP(address,address,address,uint256,uint256)"></a><code class="function-signature">LOG_SWAP(address caller, address tokenIn, address tokenOut, uint256 tokenAmountIn, uint256 tokenAmountOut)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.LOG_JOIN(address,address,uint256)"></a><code class="function-signature">LOG_JOIN(address caller, address tokenIn, uint256 tokenAmountIn)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.LOG_EXIT(address,address,uint256)"></a><code class="function-signature">LOG_EXIT(address caller, address tokenOut, uint256 tokenAmountOut)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="BPool.LOG_CALL(bytes4,address,bytes)"></a><code class="function-signature">LOG_CALL(bytes4 sig, address caller, bytes data)</code><span class="function-visibility"></span></h4>





### `BToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BToken.name()"><code class="function-signature">name()</code></a></li><li><a href="#BToken.symbol()"><code class="function-signature">symbol()</code></a></li><li><a href="#BToken.decimals()"><code class="function-signature">decimals()</code></a></li><li><a href="#BToken.allowance(address,address)"><code class="function-signature">allowance(address src, address dst)</code></a></li><li><a href="#BToken.balanceOf(address)"><code class="function-signature">balanceOf(address whom)</code></a></li><li><a href="#BToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#BToken.approve(address,uint256)"><code class="function-signature">approve(address dst, uint256 amt)</code></a></li><li><a href="#BToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address dst, uint256 amt)</code></a></li><li><a href="#BToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address dst, uint256 amt)</code></a></li><li><a href="#BToken.transfer(address,uint256)"><code class="function-signature">transfer(address dst, uint256 amt)</code></a></li><li><a href="#BToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address src, address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._mint(uint256)"><code class="function-signature">_mint(uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._burn(uint256)"><code class="function-signature">_burn(uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._move(address,address,uint256)"><code class="function-signature">_move(address src, address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._push(address,uint256)"><code class="function-signature">_push(address to, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BTokenBase._pull(address,uint256)"><code class="function-signature">_pull(address from, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BNum.btoi(uint256)"><code class="function-signature">btoi(uint256 a)</code></a></li><li class="inherited"><a href="balancer#BNum.bfloor(uint256)"><code class="function-signature">bfloor(uint256 a)</code></a></li><li class="inherited"><a href="balancer#BNum.badd(uint256,uint256)"><code class="function-signature">badd(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bsub(uint256,uint256)"><code class="function-signature">bsub(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bsubSign(uint256,uint256)"><code class="function-signature">bsubSign(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bmul(uint256,uint256)"><code class="function-signature">bmul(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bdiv(uint256,uint256)"><code class="function-signature">bdiv(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bpowi(uint256,uint256)"><code class="function-signature">bpowi(uint256 a, uint256 n)</code></a></li><li class="inherited"><a href="balancer#BNum.bpow(uint256,uint256)"><code class="function-signature">bpow(uint256 base, uint256 exp)</code></a></li><li class="inherited"><a href="balancer#BNum.bpowApprox(uint256,uint256,uint256)"><code class="function-signature">bpowApprox(uint256 base, uint256 exp, uint256 precision)</code></a></li><li class="inherited"><a href="balancer#BBronze.getColor()"><code class="function-signature">getColor()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="balancer#IERC20Balancer.Approval(address,address,uint256)"><code class="function-signature">Approval(address src, address dst, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#IERC20Balancer.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address src, address dst, uint256 amt)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BToken.name()"></a><code class="function-signature">name() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.symbol()"></a><code class="function-signature">symbol() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.decimals()"></a><code class="function-signature">decimals() <span class="return-arrow">→</span> <span class="return-type">uint8</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.allowance(address,address)"></a><code class="function-signature">allowance(address src, address dst) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.balanceOf(address)"></a><code class="function-signature">balanceOf(address whom) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.approve(address,uint256)"></a><code class="function-signature">approve(address dst, uint256 amt) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.increaseApproval(address,uint256)"></a><code class="function-signature">increaseApproval(address dst, uint256 amt) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.decreaseApproval(address,uint256)"></a><code class="function-signature">decreaseApproval(address dst, uint256 amt) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.transfer(address,uint256)"></a><code class="function-signature">transfer(address dst, uint256 amt) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BToken.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address src, address dst, uint256 amt) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `BTokenBase`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#BTokenBase._mint(uint256)"><code class="function-signature">_mint(uint256 amt)</code></a></li><li><a href="#BTokenBase._burn(uint256)"><code class="function-signature">_burn(uint256 amt)</code></a></li><li><a href="#BTokenBase._move(address,address,uint256)"><code class="function-signature">_move(address src, address dst, uint256 amt)</code></a></li><li><a href="#BTokenBase._push(address,uint256)"><code class="function-signature">_push(address to, uint256 amt)</code></a></li><li><a href="#BTokenBase._pull(address,uint256)"><code class="function-signature">_pull(address from, uint256 amt)</code></a></li><li class="inherited"><a href="balancer#BNum.btoi(uint256)"><code class="function-signature">btoi(uint256 a)</code></a></li><li class="inherited"><a href="balancer#BNum.bfloor(uint256)"><code class="function-signature">bfloor(uint256 a)</code></a></li><li class="inherited"><a href="balancer#BNum.badd(uint256,uint256)"><code class="function-signature">badd(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bsub(uint256,uint256)"><code class="function-signature">bsub(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bsubSign(uint256,uint256)"><code class="function-signature">bsubSign(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bmul(uint256,uint256)"><code class="function-signature">bmul(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bdiv(uint256,uint256)"><code class="function-signature">bdiv(uint256 a, uint256 b)</code></a></li><li class="inherited"><a href="balancer#BNum.bpowi(uint256,uint256)"><code class="function-signature">bpowi(uint256 a, uint256 n)</code></a></li><li class="inherited"><a href="balancer#BNum.bpow(uint256,uint256)"><code class="function-signature">bpow(uint256 base, uint256 exp)</code></a></li><li class="inherited"><a href="balancer#BNum.bpowApprox(uint256,uint256,uint256)"><code class="function-signature">bpowApprox(uint256 base, uint256 exp, uint256 precision)</code></a></li><li class="inherited"><a href="balancer#BBronze.getColor()"><code class="function-signature">getColor()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#BTokenBase.Approval(address,address,uint256)"><code class="function-signature">Approval(address src, address dst, uint256 amt)</code></a></li><li><a href="#BTokenBase.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address src, address dst, uint256 amt)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="BTokenBase._mint(uint256)"></a><code class="function-signature">_mint(uint256 amt)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BTokenBase._burn(uint256)"></a><code class="function-signature">_burn(uint256 amt)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BTokenBase._move(address,address,uint256)"></a><code class="function-signature">_move(address src, address dst, uint256 amt)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BTokenBase._push(address,uint256)"></a><code class="function-signature">_push(address to, uint256 amt)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="BTokenBase._pull(address,uint256)"></a><code class="function-signature">_pull(address from, uint256 amt)</code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="BTokenBase.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address src, address dst, uint256 amt)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="BTokenBase.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address src, address dst, uint256 amt)</code><span class="function-visibility"></span></h4>





### `IERC20Balancer`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC20Balancer.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IERC20Balancer.balanceOf(address)"><code class="function-signature">balanceOf(address whom)</code></a></li><li><a href="#IERC20Balancer.allowance(address,address)"><code class="function-signature">allowance(address src, address dst)</code></a></li><li><a href="#IERC20Balancer.approve(address,uint256)"><code class="function-signature">approve(address dst, uint256 amt)</code></a></li><li><a href="#IERC20Balancer.transfer(address,uint256)"><code class="function-signature">transfer(address dst, uint256 amt)</code></a></li><li><a href="#IERC20Balancer.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address src, address dst, uint256 amt)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC20Balancer.Approval(address,address,uint256)"><code class="function-signature">Approval(address src, address dst, uint256 amt)</code></a></li><li><a href="#IERC20Balancer.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address src, address dst, uint256 amt)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC20Balancer.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20Balancer.balanceOf(address)"></a><code class="function-signature">balanceOf(address whom) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20Balancer.allowance(address,address)"></a><code class="function-signature">allowance(address src, address dst) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20Balancer.approve(address,uint256)"></a><code class="function-signature">approve(address dst, uint256 amt) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20Balancer.transfer(address,uint256)"></a><code class="function-signature">transfer(address dst, uint256 amt) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20Balancer.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address src, address dst, uint256 amt) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IERC20Balancer.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address src, address dst, uint256 amt)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20Balancer.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address src, address dst, uint256 amt)</code><span class="function-visibility"></span></h4>





</div>