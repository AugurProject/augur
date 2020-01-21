---
title: Bridges
---

<div class="contracts">

## Contracts

### `ChaiBridge`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ChaiBridge.bridgeTransferFrom(address,address,address,uint256,bytes)"><code class="function-signature">bridgeTransferFrom(address, address from, address to, uint256 amount, bytes)</code></a></li><li class="inherited"><a href="bridges#DeploymentConstants._getKyberNetworkProxyAddress()"><code class="function-signature">_getKyberNetworkProxyAddress()</code></a></li><li class="inherited"><a href="bridges#DeploymentConstants._getWethAddress()"><code class="function-signature">_getWethAddress()</code></a></li><li class="inherited"><a href="bridges#DeploymentConstants._getUniswapExchangeFactoryAddress()"><code class="function-signature">_getUniswapExchangeFactoryAddress()</code></a></li><li class="inherited"><a href="bridges#DeploymentConstants._getEth2DaiAddress()"><code class="function-signature">_getEth2DaiAddress()</code></a></li><li class="inherited"><a href="bridges#DeploymentConstants._getERC20BridgeProxyAddress()"><code class="function-signature">_getERC20BridgeProxyAddress()</code></a></li><li class="inherited"><a href="bridges#DeploymentConstants._getDaiAddress()"><code class="function-signature">_getDaiAddress()</code></a></li><li class="inherited"><a href="bridges#DeploymentConstants._getChaiAddress()"><code class="function-signature">_getChaiAddress()</code></a></li><li class="inherited"><a href="bridges#DeploymentConstants._getDevUtilsAddress()"><code class="function-signature">_getDevUtilsAddress()</code></a></li><li class="inherited"><a href="bridges#DeploymentConstants._getDydxAddress()"><code class="function-signature">_getDydxAddress()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ChaiBridge.bridgeTransferFrom(address,address,address,uint256,bytes)"></a><code class="function-signature">bridgeTransferFrom(address, address from, address to, uint256 amount, bytes) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Withdraws `amount` of `from` address&#x27;s Dai from the Chai contract.
      Transfers `amount` of Dai to `to` address.
 @param from Address to transfer asset from.
 @param to Address to transfer asset to.
 @param amount Amount of asset to transfer.
 @return success The magic bytes `0x37708e9b` if successful.





### `DeploymentConstants`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#DeploymentConstants._getKyberNetworkProxyAddress()"><code class="function-signature">_getKyberNetworkProxyAddress()</code></a></li><li><a href="#DeploymentConstants._getWethAddress()"><code class="function-signature">_getWethAddress()</code></a></li><li><a href="#DeploymentConstants._getUniswapExchangeFactoryAddress()"><code class="function-signature">_getUniswapExchangeFactoryAddress()</code></a></li><li><a href="#DeploymentConstants._getEth2DaiAddress()"><code class="function-signature">_getEth2DaiAddress()</code></a></li><li><a href="#DeploymentConstants._getERC20BridgeProxyAddress()"><code class="function-signature">_getERC20BridgeProxyAddress()</code></a></li><li><a href="#DeploymentConstants._getDaiAddress()"><code class="function-signature">_getDaiAddress()</code></a></li><li><a href="#DeploymentConstants._getChaiAddress()"><code class="function-signature">_getChaiAddress()</code></a></li><li><a href="#DeploymentConstants._getDevUtilsAddress()"><code class="function-signature">_getDevUtilsAddress()</code></a></li><li><a href="#DeploymentConstants._getDydxAddress()"><code class="function-signature">_getDydxAddress()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getKyberNetworkProxyAddress()"></a><code class="function-signature">_getKyberNetworkProxyAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

Overridable way to get the `KyberNetworkProxy` address.
 @return kyberAddress The `IKyberNetworkProxy` address.



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getWethAddress()"></a><code class="function-signature">_getWethAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

Overridable way to get the WETH address.
 @return wethAddress The WETH address.



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getUniswapExchangeFactoryAddress()"></a><code class="function-signature">_getUniswapExchangeFactoryAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

Overridable way to get the `UniswapExchangeFactory` address.
 @return uniswapAddress The `UniswapExchangeFactory` address.



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getEth2DaiAddress()"></a><code class="function-signature">_getEth2DaiAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

An overridable way to retrieve the Eth2Dai `MatchingMarket` contract.
 @return eth2daiAddress The Eth2Dai `MatchingMarket` contract.



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getERC20BridgeProxyAddress()"></a><code class="function-signature">_getERC20BridgeProxyAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

An overridable way to retrieve the `ERC20BridgeProxy` contract.
 @return erc20BridgeProxyAddress The `ERC20BridgeProxy` contract.



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getDaiAddress()"></a><code class="function-signature">_getDaiAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

An overridable way to retrieve the `Dai` contract.
 @return daiAddress The `Dai` contract.



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getChaiAddress()"></a><code class="function-signature">_getChaiAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

An overridable way to retrieve the `Chai` contract.
 @return chaiAddress The `Chai` contract.



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getDevUtilsAddress()"></a><code class="function-signature">_getDevUtilsAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

An overridable way to retrieve the 0x [`DevUtils`](../../../dev-utils/contracts/src#devutils) contract address.
 @return devUtils The 0x [`DevUtils`](../../../dev-utils/contracts/src#devutils) contract address.



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getDydxAddress()"></a><code class="function-signature">_getDydxAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

Overridable way to get the DyDx contract.
 @return exchange The DyDx exchange contract.





### `IChai`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IChai.draw(address,uint256)"><code class="function-signature">draw(address src, uint256 wad)</code></a></li><li><a href="#IChai.dai(address)"><code class="function-signature">dai(address usr)</code></a></li><li><a href="#IChai.pot()"><code class="function-signature">pot()</code></a></li><li><a href="#IChai.join(address,uint256)"><code class="function-signature">join(address dst, uint256 wad)</code></a></li><li class="inherited"><a href="bridges#IERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _value)</code></a></li><li class="inherited"><a href="bridges#IERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="bridges#IERC20Token.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _value)</code></a></li><li class="inherited"><a href="bridges#IERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="bridges#IERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address _owner)</code></a></li><li class="inherited"><a href="bridges#IERC20Token.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="bridges#IERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="bridges#IERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address _owner, address _spender, uint256 _value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IChai.draw(address,uint256)"></a><code class="function-signature">draw(address src, uint256 wad)</code><span class="function-visibility">external</span></h4>

Withdraws Dai owned by `src`
 @param src Address that owns Dai.
 @param wad Amount of Dai to withdraw.



<h4><a class="anchor" aria-hidden="true" id="IChai.dai(address)"></a><code class="function-signature">dai(address usr) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Queries Dai balance of Chai holder.
 @param usr Address of Chai holder.
 @return Dai balance.



<h4><a class="anchor" aria-hidden="true" id="IChai.pot()"></a><code class="function-signature">pot() <span class="return-arrow">→</span> <span class="return-type">contract PotLike</span></code><span class="function-visibility">external</span></h4>

Queries the Pot contract used by the Chai contract.



<h4><a class="anchor" aria-hidden="true" id="IChai.join(address,uint256)"></a><code class="function-signature">join(address dst, uint256 wad)</code><span class="function-visibility">external</span></h4>

Deposits Dai in exchange for Chai
 @param dst Address to receive Chai.
 @param wad Amount of Dai to deposit.





### `IERC20Bridge`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC20Bridge.bridgeTransferFrom(address,address,address,uint256,bytes)"><code class="function-signature">bridgeTransferFrom(address tokenAddress, address from, address to, uint256 amount, bytes bridgeData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC20Bridge.bridgeTransferFrom(address,address,address,uint256,bytes)"></a><code class="function-signature">bridgeTransferFrom(address tokenAddress, address from, address to, uint256 amount, bytes bridgeData) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Transfers `amount` of the ERC20 `tokenAddress` from `from` to `to`.
 @param tokenAddress The address of the ERC20 token to transfer.
 @param from Address to transfer asset from.
 @param to Address to transfer asset to.
 @param amount Amount of asset to transfer.
 @param bridgeData Arbitrary asset data needed by the bridge contract.
 @return success The magic bytes `0x37708e9b` if successful.





### `IERC20Token`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _value)</code></a></li><li><a href="#IERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _value)</code></a></li><li><a href="#IERC20Token.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _value)</code></a></li><li><a href="#IERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address _owner)</code></a></li><li><a href="#IERC20Token.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address _from, address _to, uint256 _value)</code></a></li><li><a href="#IERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address _owner, address _spender, uint256 _value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC20Token.transfer(address,uint256)"></a><code class="function-signature">transfer(address _to, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

send `value` token to `to` from `msg.sender`
 @param _to The address of the recipient
 @param _value The amount of token to be transferred
 @return True if transfer was successful



<h4><a class="anchor" aria-hidden="true" id="IERC20Token.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address _from, address _to, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

send `value` token to `to` from `from` on the condition it is approved by `from`
 @param _from The address of the sender
 @param _to The address of the recipient
 @param _value The amount of token to be transferred
 @return True if transfer was successful



<h4><a class="anchor" aria-hidden="true" id="IERC20Token.approve(address,uint256)"></a><code class="function-signature">approve(address _spender, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

`msg.sender` approves `_spender` to spend `_value` tokens
 @param _spender The address of the account able to transfer the tokens
 @param _value The amount of wei to be approved for transfer
 @return Always true if the call has enough gas to complete execution



<h4><a class="anchor" aria-hidden="true" id="IERC20Token.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Query total supply of token
 @return Total supply of token



<h4><a class="anchor" aria-hidden="true" id="IERC20Token.balanceOf(address)"></a><code class="function-signature">balanceOf(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20Token.allowance(address,address)"></a><code class="function-signature">allowance(address _owner, address _spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IERC20Token.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address _from, address _to, uint256 _value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20Token.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address _owner, address _spender, uint256 _value)</code><span class="function-visibility"></span></h4>





### `PotLike`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#PotLike.chi()"><code class="function-signature">chi()</code></a></li><li><a href="#PotLike.rho()"><code class="function-signature">rho()</code></a></li><li><a href="#PotLike.drip()"><code class="function-signature">drip()</code></a></li><li><a href="#PotLike.join(uint256)"><code class="function-signature">join(uint256)</code></a></li><li><a href="#PotLike.exit(uint256)"><code class="function-signature">exit(uint256)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="PotLike.chi()"></a><code class="function-signature">chi() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PotLike.rho()"></a><code class="function-signature">rho() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PotLike.drip()"></a><code class="function-signature">drip() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PotLike.join(uint256)"></a><code class="function-signature">join(uint256)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PotLike.exit(uint256)"></a><code class="function-signature">exit(uint256)</code><span class="function-visibility">external</span></h4>







</div>