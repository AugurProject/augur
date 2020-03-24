---
title: Uniswap
---

<div class="contracts">

## Contracts

### `IERC20`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC20.name()"><code class="function-signature">name()</code></a></li><li><a href="#IERC20.symbol()"><code class="function-signature">symbol()</code></a></li><li><a href="#IERC20.decimals()"><code class="function-signature">decimals()</code></a></li><li><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 value)</code></a></li><li><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 value)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC20.name()"></a><code class="function-signature">name() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.symbol()"></a><code class="function-signature">symbol() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.decimals()"></a><code class="function-signature">decimals() <span class="return-arrow">→</span> <span class="return-type">uint8</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.allowance(address,address)"></a><code class="function-signature">allowance(address owner, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IERC20.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





### `IUniswapV2Callee`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniswapV2Callee.uniswapV2Call(address,uint256,uint256,bytes)"><code class="function-signature">uniswapV2Call(address sender, uint256 amount0, uint256 amount1, bytes data)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Callee.uniswapV2Call(address,uint256,uint256,bytes)"></a><code class="function-signature">uniswapV2Call(address sender, uint256 amount0, uint256 amount1, bytes data)</code><span class="function-visibility">external</span></h4>







### `IUniswapV2ERC20`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniswapV2ERC20.name()"><code class="function-signature">name()</code></a></li><li><a href="#IUniswapV2ERC20.symbol()"><code class="function-signature">symbol()</code></a></li><li><a href="#IUniswapV2ERC20.decimals()"><code class="function-signature">decimals()</code></a></li><li><a href="#IUniswapV2ERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IUniswapV2ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#IUniswapV2ERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li><a href="#IUniswapV2ERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li><a href="#IUniswapV2ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 value)</code></a></li><li><a href="#IUniswapV2ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 value)</code></a></li><li><a href="#IUniswapV2ERC20.DOMAIN_SEPARATOR()"><code class="function-signature">DOMAIN_SEPARATOR()</code></a></li><li><a href="#IUniswapV2ERC20.PERMIT_TYPEHASH()"><code class="function-signature">PERMIT_TYPEHASH()</code></a></li><li><a href="#IUniswapV2ERC20.nonces(address)"><code class="function-signature">nonces(address owner)</code></a></li><li><a href="#IUniswapV2ERC20.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"><code class="function-signature">permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IUniswapV2ERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li><a href="#IUniswapV2ERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.name()"></a><code class="function-signature">name() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.symbol()"></a><code class="function-signature">symbol() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.decimals()"></a><code class="function-signature">decimals() <span class="return-arrow">→</span> <span class="return-type">uint8</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.allowance(address,address)"></a><code class="function-signature">allowance(address owner, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.DOMAIN_SEPARATOR()"></a><code class="function-signature">DOMAIN_SEPARATOR() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.PERMIT_TYPEHASH()"></a><code class="function-signature">PERMIT_TYPEHASH() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.nonces(address)"></a><code class="function-signature">nonces(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"></a><code class="function-signature">permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)</code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2ERC20.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





### `IUniswapV2Exchange`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniswapV2Exchange.name()"><code class="function-signature">name()</code></a></li><li><a href="#IUniswapV2Exchange.symbol()"><code class="function-signature">symbol()</code></a></li><li><a href="#IUniswapV2Exchange.decimals()"><code class="function-signature">decimals()</code></a></li><li><a href="#IUniswapV2Exchange.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IUniswapV2Exchange.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#IUniswapV2Exchange.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li><a href="#IUniswapV2Exchange.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li><a href="#IUniswapV2Exchange.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 value)</code></a></li><li><a href="#IUniswapV2Exchange.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 value)</code></a></li><li><a href="#IUniswapV2Exchange.DOMAIN_SEPARATOR()"><code class="function-signature">DOMAIN_SEPARATOR()</code></a></li><li><a href="#IUniswapV2Exchange.PERMIT_TYPEHASH()"><code class="function-signature">PERMIT_TYPEHASH()</code></a></li><li><a href="#IUniswapV2Exchange.nonces(address)"><code class="function-signature">nonces(address owner)</code></a></li><li><a href="#IUniswapV2Exchange.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"><code class="function-signature">permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)</code></a></li><li><a href="#IUniswapV2Exchange.MINIMUM_LIQUIDITY()"><code class="function-signature">MINIMUM_LIQUIDITY()</code></a></li><li><a href="#IUniswapV2Exchange.factory()"><code class="function-signature">factory()</code></a></li><li><a href="#IUniswapV2Exchange.token0()"><code class="function-signature">token0()</code></a></li><li><a href="#IUniswapV2Exchange.token1()"><code class="function-signature">token1()</code></a></li><li><a href="#IUniswapV2Exchange.getReserves()"><code class="function-signature">getReserves()</code></a></li><li><a href="#IUniswapV2Exchange.price0CumulativeLast()"><code class="function-signature">price0CumulativeLast()</code></a></li><li><a href="#IUniswapV2Exchange.price1CumulativeLast()"><code class="function-signature">price1CumulativeLast()</code></a></li><li><a href="#IUniswapV2Exchange.kLast()"><code class="function-signature">kLast()</code></a></li><li><a href="#IUniswapV2Exchange.mint(address)"><code class="function-signature">mint(address to)</code></a></li><li><a href="#IUniswapV2Exchange.burn(address)"><code class="function-signature">burn(address to)</code></a></li><li><a href="#IUniswapV2Exchange.swap(uint256,uint256,address,bytes)"><code class="function-signature">swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)</code></a></li><li><a href="#IUniswapV2Exchange.skim(address)"><code class="function-signature">skim(address to)</code></a></li><li><a href="#IUniswapV2Exchange.sync()"><code class="function-signature">sync()</code></a></li><li><a href="#IUniswapV2Exchange.initialize(address,address)"><code class="function-signature">initialize(address, address)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IUniswapV2Exchange.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li><a href="#IUniswapV2Exchange.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li><a href="#IUniswapV2Exchange.Mint(address,uint256,uint256)"><code class="function-signature">Mint(address sender, uint256 amount0, uint256 amount1)</code></a></li><li><a href="#IUniswapV2Exchange.Burn(address,uint256,uint256,address)"><code class="function-signature">Burn(address sender, uint256 amount0, uint256 amount1, address to)</code></a></li><li><a href="#IUniswapV2Exchange.Swap(address,uint256,uint256,uint256,uint256,address)"><code class="function-signature">Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)</code></a></li><li><a href="#IUniswapV2Exchange.Sync(uint112,uint112)"><code class="function-signature">Sync(uint112 reserve0, uint112 reserve1)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.name()"></a><code class="function-signature">name() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.symbol()"></a><code class="function-signature">symbol() <span class="return-arrow">→</span> <span class="return-type">string</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.decimals()"></a><code class="function-signature">decimals() <span class="return-arrow">→</span> <span class="return-type">uint8</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.allowance(address,address)"></a><code class="function-signature">allowance(address owner, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.DOMAIN_SEPARATOR()"></a><code class="function-signature">DOMAIN_SEPARATOR() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.PERMIT_TYPEHASH()"></a><code class="function-signature">PERMIT_TYPEHASH() <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.nonces(address)"></a><code class="function-signature">nonces(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"></a><code class="function-signature">permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.MINIMUM_LIQUIDITY()"></a><code class="function-signature">MINIMUM_LIQUIDITY() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.factory()"></a><code class="function-signature">factory() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.token0()"></a><code class="function-signature">token0() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.token1()"></a><code class="function-signature">token1() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.getReserves()"></a><code class="function-signature">getReserves() <span class="return-arrow">→</span> <span class="return-type">uint112,uint112,uint32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.price0CumulativeLast()"></a><code class="function-signature">price0CumulativeLast() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.price1CumulativeLast()"></a><code class="function-signature">price1CumulativeLast() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.kLast()"></a><code class="function-signature">kLast() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.mint(address)"></a><code class="function-signature">mint(address to) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.burn(address)"></a><code class="function-signature">burn(address to) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.swap(uint256,uint256,address,bytes)"></a><code class="function-signature">swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.skim(address)"></a><code class="function-signature">skim(address to)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.sync()"></a><code class="function-signature">sync()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.initialize(address,address)"></a><code class="function-signature">initialize(address, address)</code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.Mint(address,uint256,uint256)"></a><code class="function-signature">Mint(address sender, uint256 amount0, uint256 amount1)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.Burn(address,uint256,uint256,address)"></a><code class="function-signature">Burn(address sender, uint256 amount0, uint256 amount1, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.Swap(address,uint256,uint256,uint256,uint256,address)"></a><code class="function-signature">Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Exchange.Sync(uint112,uint112)"></a><code class="function-signature">Sync(uint112 reserve0, uint112 reserve1)</code><span class="function-visibility"></span></h4>





### `IUniswapV2Factory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IUniswapV2Factory.feeTo()"><code class="function-signature">feeTo()</code></a></li><li><a href="#IUniswapV2Factory.feeToSetter()"><code class="function-signature">feeToSetter()</code></a></li><li><a href="#IUniswapV2Factory.getExchange(address,address)"><code class="function-signature">getExchange(address tokenA, address tokenB)</code></a></li><li><a href="#IUniswapV2Factory.allExchanges(uint256)"><code class="function-signature">allExchanges(uint256)</code></a></li><li><a href="#IUniswapV2Factory.allExchangesLength()"><code class="function-signature">allExchangesLength()</code></a></li><li><a href="#IUniswapV2Factory.createExchange(address,address)"><code class="function-signature">createExchange(address tokenA, address tokenB)</code></a></li><li><a href="#IUniswapV2Factory.setFeeTo(address)"><code class="function-signature">setFeeTo(address)</code></a></li><li><a href="#IUniswapV2Factory.setFeeToSetter(address)"><code class="function-signature">setFeeToSetter(address)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IUniswapV2Factory.ExchangeCreated(address,address,address,uint256)"><code class="function-signature">ExchangeCreated(address token0, address token1, address exchange, uint256)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.feeTo()"></a><code class="function-signature">feeTo() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.feeToSetter()"></a><code class="function-signature">feeToSetter() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.getExchange(address,address)"></a><code class="function-signature">getExchange(address tokenA, address tokenB) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.allExchanges(uint256)"></a><code class="function-signature">allExchanges(uint256) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.allExchangesLength()"></a><code class="function-signature">allExchangesLength() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.createExchange(address,address)"></a><code class="function-signature">createExchange(address tokenA, address tokenB) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.setFeeTo(address)"></a><code class="function-signature">setFeeTo(address)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.setFeeToSetter(address)"></a><code class="function-signature">setFeeToSetter(address)</code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IUniswapV2Factory.ExchangeCreated(address,address,address,uint256)"></a><code class="function-signature">ExchangeCreated(address token0, address token1, address exchange, uint256)</code><span class="function-visibility"></span></h4>





### `Math`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Math.min(uint256,uint256)"><code class="function-signature">min(uint256 x, uint256 y)</code></a></li><li><a href="#Math.sqrt(uint256)"><code class="function-signature">sqrt(uint256 y)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Math.min(uint256,uint256)"></a><code class="function-signature">min(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Math.sqrt(uint256)"></a><code class="function-signature">sqrt(uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `SafeMath`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMath.add(uint256,uint256)"><code class="function-signature">add(uint256 x, uint256 y)</code></a></li><li><a href="#SafeMath.sub(uint256,uint256)"><code class="function-signature">sub(uint256 x, uint256 y)</code></a></li><li><a href="#SafeMath.mul(uint256,uint256)"><code class="function-signature">mul(uint256 x, uint256 y)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SafeMath.add(uint256,uint256)"></a><code class="function-signature">add(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMath.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMath.mul(uint256,uint256)"></a><code class="function-signature">mul(uint256 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `UQ112x112`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#UQ112x112.encode(uint112)"><code class="function-signature">encode(uint112 y)</code></a></li><li><a href="#UQ112x112.uqdiv(uint224,uint112)"><code class="function-signature">uqdiv(uint224 x, uint112 y)</code></a></li><li><a href="#UQ112x112.uqmul(uint224,uint256)"><code class="function-signature">uqmul(uint224 x, uint256 y)</code></a></li><li><a href="#UQ112x112.decode(uint256)"><code class="function-signature">decode(uint256 y)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="UQ112x112.encode(uint112)"></a><code class="function-signature">encode(uint112 y) <span class="return-arrow">→</span> <span class="return-type">uint224</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UQ112x112.uqdiv(uint224,uint112)"></a><code class="function-signature">uqdiv(uint224 x, uint112 y) <span class="return-arrow">→</span> <span class="return-type">uint224</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UQ112x112.uqmul(uint224,uint256)"></a><code class="function-signature">uqmul(uint224 x, uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UQ112x112.decode(uint256)"></a><code class="function-signature">decode(uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `UniswapV2ERC20`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#UniswapV2ERC20.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#UniswapV2ERC20._mint(address,uint256)"><code class="function-signature">_mint(address to, uint256 value)</code></a></li><li><a href="#UniswapV2ERC20._burn(address,uint256)"><code class="function-signature">_burn(address from, uint256 value)</code></a></li><li><a href="#UniswapV2ERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li><a href="#UniswapV2ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 value)</code></a></li><li><a href="#UniswapV2ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 value)</code></a></li><li><a href="#UniswapV2ERC20.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"><code class="function-signature">permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.name()"><code class="function-signature">name()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.symbol()"><code class="function-signature">symbol()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.decimals()"><code class="function-signature">decimals()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.DOMAIN_SEPARATOR()"><code class="function-signature">DOMAIN_SEPARATOR()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.PERMIT_TYPEHASH()"><code class="function-signature">PERMIT_TYPEHASH()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.nonces(address)"><code class="function-signature">nonces(address owner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#UniswapV2ERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li><a href="#UniswapV2ERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="UniswapV2ERC20.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2ERC20._mint(address,uint256)"></a><code class="function-signature">_mint(address to, uint256 value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2ERC20._burn(address,uint256)"></a><code class="function-signature">_burn(address from, uint256 value)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2ERC20.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2ERC20.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2ERC20.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2ERC20.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"></a><code class="function-signature">permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)</code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="UniswapV2ERC20.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2ERC20.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





### `UniswapV2Exchange`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#UniswapV2Exchange.getReserves()"><code class="function-signature">getReserves()</code></a></li><li><a href="#UniswapV2Exchange.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#UniswapV2Exchange.initialize(address,address)"><code class="function-signature">initialize(address _token0, address _token1)</code></a></li><li><a href="#UniswapV2Exchange.mint(address)"><code class="function-signature">mint(address to)</code></a></li><li><a href="#UniswapV2Exchange.burn(address)"><code class="function-signature">burn(address to)</code></a></li><li><a href="#UniswapV2Exchange.swap(uint256,uint256,address,bytes)"><code class="function-signature">swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)</code></a></li><li><a href="#UniswapV2Exchange.skim(address)"><code class="function-signature">skim(address to)</code></a></li><li><a href="#UniswapV2Exchange.sync()"><code class="function-signature">sync()</code></a></li><li class="inherited"><a href="uniswap#UniswapV2ERC20._mint(address,uint256)"><code class="function-signature">_mint(address to, uint256 value)</code></a></li><li class="inherited"><a href="uniswap#UniswapV2ERC20._burn(address,uint256)"><code class="function-signature">_burn(address from, uint256 value)</code></a></li><li class="inherited"><a href="uniswap#UniswapV2ERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 value)</code></a></li><li class="inherited"><a href="uniswap#UniswapV2ERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 value)</code></a></li><li class="inherited"><a href="uniswap#UniswapV2ERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="uniswap#UniswapV2ERC20.permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"><code class="function-signature">permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.name()"><code class="function-signature">name()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.symbol()"><code class="function-signature">symbol()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.decimals()"><code class="function-signature">decimals()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.DOMAIN_SEPARATOR()"><code class="function-signature">DOMAIN_SEPARATOR()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.PERMIT_TYPEHASH()"><code class="function-signature">PERMIT_TYPEHASH()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2ERC20.nonces(address)"><code class="function-signature">nonces(address owner)</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Exchange.MINIMUM_LIQUIDITY()"><code class="function-signature">MINIMUM_LIQUIDITY()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Exchange.factory()"><code class="function-signature">factory()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Exchange.token0()"><code class="function-signature">token0()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Exchange.token1()"><code class="function-signature">token1()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Exchange.price0CumulativeLast()"><code class="function-signature">price0CumulativeLast()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Exchange.price1CumulativeLast()"><code class="function-signature">price1CumulativeLast()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Exchange.kLast()"><code class="function-signature">kLast()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#UniswapV2Exchange.Mint(address,uint256,uint256)"><code class="function-signature">Mint(address sender, uint256 amount0, uint256 amount1)</code></a></li><li><a href="#UniswapV2Exchange.Burn(address,uint256,uint256,address)"><code class="function-signature">Burn(address sender, uint256 amount0, uint256 amount1, address to)</code></a></li><li><a href="#UniswapV2Exchange.Swap(address,uint256,uint256,uint256,uint256,address)"><code class="function-signature">Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)</code></a></li><li><a href="#UniswapV2Exchange.Sync(uint112,uint112)"><code class="function-signature">Sync(uint112 reserve0, uint112 reserve1)</code></a></li><li class="inherited"><a href="uniswap#UniswapV2ERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li><li class="inherited"><a href="uniswap#UniswapV2ERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.getReserves()"></a><code class="function-signature">getReserves() <span class="return-arrow">→</span> <span class="return-type">uint112,uint112,uint32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.initialize(address,address)"></a><code class="function-signature">initialize(address _token0, address _token1)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.mint(address)"></a><code class="function-signature">mint(address to) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.burn(address)"></a><code class="function-signature">burn(address to) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.swap(uint256,uint256,address,bytes)"></a><code class="function-signature">swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.skim(address)"></a><code class="function-signature">skim(address to)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.sync()"></a><code class="function-signature">sync()</code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.Mint(address,uint256,uint256)"></a><code class="function-signature">Mint(address sender, uint256 amount0, uint256 amount1)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.Burn(address,uint256,uint256,address)"></a><code class="function-signature">Burn(address sender, uint256 amount0, uint256 amount1, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.Swap(address,uint256,uint256,uint256,uint256,address)"></a><code class="function-signature">Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Exchange.Sync(uint112,uint112)"></a><code class="function-signature">Sync(uint112 reserve0, uint112 reserve1)</code><span class="function-visibility"></span></h4>





### `UniswapV2Factory`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#UniswapV2Factory.constructor(address)"><code class="function-signature">constructor(address _feeToSetter)</code></a></li><li><a href="#UniswapV2Factory.allExchangesLength()"><code class="function-signature">allExchangesLength()</code></a></li><li><a href="#UniswapV2Factory.createExchange(address,address)"><code class="function-signature">createExchange(address tokenA, address tokenB)</code></a></li><li><a href="#UniswapV2Factory.setFeeTo(address)"><code class="function-signature">setFeeTo(address _feeTo)</code></a></li><li><a href="#UniswapV2Factory.setFeeToSetter(address)"><code class="function-signature">setFeeToSetter(address _feeToSetter)</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Factory.feeTo()"><code class="function-signature">feeTo()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Factory.feeToSetter()"><code class="function-signature">feeToSetter()</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Factory.getExchange(address,address)"><code class="function-signature">getExchange(address tokenA, address tokenB)</code></a></li><li class="inherited"><a href="uniswap#IUniswapV2Factory.allExchanges(uint256)"><code class="function-signature">allExchanges(uint256)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#UniswapV2Factory.ExchangeCreated(address,address,address,uint256)"><code class="function-signature">ExchangeCreated(address token0, address token1, address exchange, uint256)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="UniswapV2Factory.constructor(address)"></a><code class="function-signature">constructor(address _feeToSetter)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Factory.allExchangesLength()"></a><code class="function-signature">allExchangesLength() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Factory.createExchange(address,address)"></a><code class="function-signature">createExchange(address tokenA, address tokenB) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Factory.setFeeTo(address)"></a><code class="function-signature">setFeeTo(address _feeTo)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="UniswapV2Factory.setFeeToSetter(address)"></a><code class="function-signature">setFeeToSetter(address _feeToSetter)</code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="UniswapV2Factory.ExchangeCreated(address,address,address,uint256)"></a><code class="function-signature">ExchangeCreated(address token0, address token1, address exchange, uint256)</code><span class="function-visibility"></span></h4>





</div>