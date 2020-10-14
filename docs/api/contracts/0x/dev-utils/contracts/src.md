---
title: Src
---

<div class="contracts">

## Contracts

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

An overridable way to retrieve the 0x [`DevUtils`](#devutils) contract address.
 @return devUtils The 0x [`DevUtils`](#devutils) contract address.



<h4><a class="anchor" aria-hidden="true" id="DeploymentConstants._getDydxAddress()"></a><code class="function-signature">_getDydxAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

Overridable way to get the DyDx contract.
 @return exchange The DyDx exchange contract.





### `DevUtils`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#DevUtils.constructor(address,address)"><code class="function-signature">constructor(address _exchange, address _chaiBridge)</code></a></li><li><a href="#DevUtils.getOrderHash(struct LibOrder.Order,uint256,address)"><code class="function-signature">getOrderHash(struct LibOrder.Order order, uint256 chainId, address exchange)</code></a></li><li><a href="#DevUtils.getTransactionHash(struct LibZeroExTransaction.ZeroExTransaction,uint256,address)"><code class="function-signature">getTransactionHash(struct LibZeroExTransaction.ZeroExTransaction transaction, uint256 chainId, address exchange)</code></a></li><li class="inherited"><a href="src#EthBalanceChecker.getEthBalances(address[])"><code class="function-signature">getEthBalances(address[] addresses)</code></a></li><li class="inherited"><a href="src#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#OrderValidationUtils.getOrderRelevantState(struct LibOrder.Order,bytes)"><code class="function-signature">getOrderRelevantState(struct LibOrder.Order order, bytes signature)</code></a></li><li class="inherited"><a href="src#OrderValidationUtils.getOrderRelevantStates(struct LibOrder.Order[],bytes[])"><code class="function-signature">getOrderRelevantStates(struct LibOrder.Order[] orders, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#OrderValidationUtils.getTransferableAssetAmount(address,bytes)"><code class="function-signature">getTransferableAssetAmount(address ownerAddress, bytes assetData)</code></a></li><li class="inherited"><a href="src#OrderValidationUtils._isAssetDataValid(bytes)"><code class="function-signature">_isAssetDataValid(bytes assetData)</code></a></li><li class="inherited"><a href="src#OrderValidationUtils._isAssetDataDuplicated(bytes[],uint256)"><code class="function-signature">_isAssetDataDuplicated(bytes[] nestedAssetData, uint256 startIdx)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils.constructor(address)"><code class="function-signature">constructor(address _exchange)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils.getSimulatedOrderMakerTransferResults(struct LibOrder.Order,address,uint256)"><code class="function-signature">getSimulatedOrderMakerTransferResults(struct LibOrder.Order order, address takerAddress, uint256 takerAssetFillAmount)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils.getSimulatedOrderTransferResults(struct LibOrder.Order,address,uint256)"><code class="function-signature">getSimulatedOrderTransferResults(struct LibOrder.Order order, address takerAddress, uint256 takerAssetFillAmount)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils.getSimulatedOrdersTransferResults(struct LibOrder.Order[],address[],uint256[])"><code class="function-signature">getSimulatedOrdersTransferResults(struct LibOrder.Order[] orders, address[] takerAddresses, uint256[] takerAssetFillAmounts)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils._simulateTransferFromCalls(bytes[],address[],address[],uint256[])"><code class="function-signature">_simulateTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeSignatureError(bytes)"><code class="function-signature">decodeSignatureError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeEIP1271SignatureError(bytes)"><code class="function-signature">decodeEIP1271SignatureError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeSignatureValidatorNotApprovedError(bytes)"><code class="function-signature">decodeSignatureValidatorNotApprovedError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeSignatureWalletError(bytes)"><code class="function-signature">decodeSignatureWalletError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeOrderStatusError(bytes)"><code class="function-signature">decodeOrderStatusError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeExchangeInvalidContextError(bytes)"><code class="function-signature">decodeExchangeInvalidContextError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeFillError(bytes)"><code class="function-signature">decodeFillError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeOrderEpochError(bytes)"><code class="function-signature">decodeOrderEpochError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeAssetProxyExistsError(bytes)"><code class="function-signature">decodeAssetProxyExistsError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeAssetProxyDispatchError(bytes)"><code class="function-signature">decodeAssetProxyDispatchError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeAssetProxyTransferError(bytes)"><code class="function-signature">decodeAssetProxyTransferError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeNegativeSpreadError(bytes)"><code class="function-signature">decodeNegativeSpreadError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeTransactionError(bytes)"><code class="function-signature">decodeTransactionError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeTransactionExecutionError(bytes)"><code class="function-signature">decodeTransactionExecutionError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeIncompleteFillError(bytes)"><code class="function-signature">decodeIncompleteFillError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBalance(address,bytes)"><code class="function-signature">getBalance(address ownerAddress, bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBatchBalances(address,bytes[])"><code class="function-signature">getBatchBalances(address ownerAddress, bytes[] assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getAssetProxyAllowance(address,bytes)"><code class="function-signature">getAssetProxyAllowance(address ownerAddress, bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBatchAssetProxyAllowances(address,bytes[])"><code class="function-signature">getBatchAssetProxyAllowances(address ownerAddress, bytes[] assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBalanceAndAssetProxyAllowance(address,bytes)"><code class="function-signature">getBalanceAndAssetProxyAllowance(address ownerAddress, bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBatchBalancesAndAssetProxyAllowances(address,bytes[])"><code class="function-signature">getBatchBalancesAndAssetProxyAllowances(address ownerAddress, bytes[] assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeAssetProxyId(bytes)"><code class="function-signature">decodeAssetProxyId(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeERC20AssetData(address)"><code class="function-signature">encodeERC20AssetData(address tokenAddress)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeERC20AssetData(bytes)"><code class="function-signature">decodeERC20AssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeERC721AssetData(address,uint256)"><code class="function-signature">encodeERC721AssetData(address tokenAddress, uint256 tokenId)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeERC721AssetData(bytes)"><code class="function-signature">decodeERC721AssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeERC1155AssetData(address,uint256[],uint256[],bytes)"><code class="function-signature">encodeERC1155AssetData(address tokenAddress, uint256[] tokenIds, uint256[] tokenValues, bytes callbackData)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeERC1155AssetData(bytes)"><code class="function-signature">decodeERC1155AssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeMultiAssetData(uint256[],bytes[])"><code class="function-signature">encodeMultiAssetData(uint256[] amounts, bytes[] nestedAssetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeMultiAssetData(bytes)"><code class="function-signature">decodeMultiAssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeStaticCallAssetData(address,bytes,bytes32)"><code class="function-signature">encodeStaticCallAssetData(address staticCallTargetAddress, bytes staticCallData, bytes32 expectedReturnDataHash)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeStaticCallAssetData(bytes)"><code class="function-signature">decodeStaticCallAssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeERC20BridgeAssetData(bytes)"><code class="function-signature">decodeERC20BridgeAssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.revertIfInvalidAssetData(bytes)"><code class="function-signature">revertIfInvalidAssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData._erc20BalanceOf(address,address)"><code class="function-signature">_erc20BalanceOf(address tokenAddress, address ownerAddress)</code></a></li><li class="inherited"><a href="src#LibAssetData._convertChaiToDaiAmount(uint256)"><code class="function-signature">_convertChaiToDaiAmount(uint256 chaiAmount)</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getKyberNetworkProxyAddress()"><code class="function-signature">_getKyberNetworkProxyAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getWethAddress()"><code class="function-signature">_getWethAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getUniswapExchangeFactoryAddress()"><code class="function-signature">_getUniswapExchangeFactoryAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getEth2DaiAddress()"><code class="function-signature">_getEth2DaiAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getERC20BridgeProxyAddress()"><code class="function-signature">_getERC20BridgeProxyAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getDaiAddress()"><code class="function-signature">_getDaiAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getChaiAddress()"><code class="function-signature">_getChaiAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getDevUtilsAddress()"><code class="function-signature">_getDevUtilsAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getDydxAddress()"><code class="function-signature">_getDydxAddress()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="DevUtils.constructor(address,address)"></a><code class="function-signature">constructor(address _exchange, address _chaiBridge)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DevUtils.getOrderHash(struct LibOrder.Order,uint256,address)"></a><code class="function-signature">getOrderHash(struct LibOrder.Order order, uint256 chainId, address exchange) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="DevUtils.getTransactionHash(struct LibZeroExTransaction.ZeroExTransaction,uint256,address)"></a><code class="function-signature">getTransactionHash(struct LibZeroExTransaction.ZeroExTransaction transaction, uint256 chainId, address exchange) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>







### `EthBalanceChecker`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#EthBalanceChecker.getEthBalances(address[])"><code class="function-signature">getEthBalances(address[] addresses)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="EthBalanceChecker.getEthBalances(address[])"></a><code class="function-signature">getEthBalances(address[] addresses) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>

Batch fetches ETH balances
 @param addresses Array of addresses.
 @return Array of ETH balances.





### `IAssetData`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IAssetData.ERC20Token(address)"><code class="function-signature">ERC20Token(address tokenAddress)</code></a></li><li><a href="#IAssetData.ERC721Token(address,uint256)"><code class="function-signature">ERC721Token(address tokenAddress, uint256 tokenId)</code></a></li><li><a href="#IAssetData.ERC1155Assets(address,uint256[],uint256[],bytes)"><code class="function-signature">ERC1155Assets(address tokenAddress, uint256[] tokenIds, uint256[] values, bytes callbackData)</code></a></li><li><a href="#IAssetData.MultiAsset(uint256[],bytes[])"><code class="function-signature">MultiAsset(uint256[] values, bytes[] nestedAssetData)</code></a></li><li><a href="#IAssetData.StaticCall(address,bytes,bytes32)"><code class="function-signature">StaticCall(address staticCallTargetAddress, bytes staticCallData, bytes32 expectedReturnDataHash)</code></a></li><li><a href="#IAssetData.ERC20Bridge(address,address,bytes)"><code class="function-signature">ERC20Bridge(address tokenAddress, address bridgeAddress, bytes bridgeData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IAssetData.ERC20Token(address)"></a><code class="function-signature">ERC20Token(address tokenAddress)</code><span class="function-visibility">external</span></h4>

Function signature for encoding ERC20 assetData.
 @param tokenAddress Address of ERC20Token contract.



<h4><a class="anchor" aria-hidden="true" id="IAssetData.ERC721Token(address,uint256)"></a><code class="function-signature">ERC721Token(address tokenAddress, uint256 tokenId)</code><span class="function-visibility">external</span></h4>

Function signature for encoding ERC721 assetData.
 @param tokenAddress Address of ERC721 token contract.
 @param tokenId Id of ERC721 token to be transferred.



<h4><a class="anchor" aria-hidden="true" id="IAssetData.ERC1155Assets(address,uint256[],uint256[],bytes)"></a><code class="function-signature">ERC1155Assets(address tokenAddress, uint256[] tokenIds, uint256[] values, bytes callbackData)</code><span class="function-visibility">external</span></h4>

Function signature for encoding ERC1155 assetData.
 @param tokenAddress Address of ERC1155 token contract.
 @param tokenIds Array of ids of tokens to be transferred.
 @param values Array of values that correspond to each token id to be transferred.
        Note that each value will be multiplied by the amount being filled in the order before transferring.
 @param callbackData Extra data to be passed to receiver&#x27;s `onERC1155Received` callback function.



<h4><a class="anchor" aria-hidden="true" id="IAssetData.MultiAsset(uint256[],bytes[])"></a><code class="function-signature">MultiAsset(uint256[] values, bytes[] nestedAssetData)</code><span class="function-visibility">external</span></h4>

Function signature for encoding MultiAsset assetData.
 @param values Array of amounts that correspond to each asset to be transferred.
        Note that each value will be multiplied by the amount being filled in the order before transferring.
 @param nestedAssetData Array of assetData fields that will be be dispatched to their correspnding AssetProxy contract.



<h4><a class="anchor" aria-hidden="true" id="IAssetData.StaticCall(address,bytes,bytes32)"></a><code class="function-signature">StaticCall(address staticCallTargetAddress, bytes staticCallData, bytes32 expectedReturnDataHash)</code><span class="function-visibility">external</span></h4>

Function signature for encoding StaticCall assetData.
 @param staticCallTargetAddress Address that will execute the staticcall.
 @param staticCallData Data that will be executed via staticcall on the staticCallTargetAddress.
 @param expectedReturnDataHash Keccak-256 hash of the expected staticcall return data.



<h4><a class="anchor" aria-hidden="true" id="IAssetData.ERC20Bridge(address,address,bytes)"></a><code class="function-signature">ERC20Bridge(address tokenAddress, address bridgeAddress, bytes bridgeData)</code><span class="function-visibility">external</span></h4>

Function signature for encoding ERC20Bridge assetData.
 @param tokenAddress Address of token to transfer.
 @param bridgeAddress Address of the bridge contract.
 @param bridgeData Arbitrary data to be passed to the bridge contract.





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





### `IChai`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IChai.draw(address,uint256)"><code class="function-signature">draw(address src, uint256 wad)</code></a></li><li><a href="#IChai.dai(address)"><code class="function-signature">dai(address usr)</code></a></li><li><a href="#IChai.pot()"><code class="function-signature">pot()</code></a></li><li><a href="#IChai.join(address,uint256)"><code class="function-signature">join(address dst, uint256 wad)</code></a></li><li class="inherited"><a href="src#IERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _value)</code></a></li><li class="inherited"><a href="src#IERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="src#IERC20Token.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _value)</code></a></li><li class="inherited"><a href="src#IERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="src#IERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address _owner)</code></a></li><li class="inherited"><a href="src#IERC20Token.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="src#IERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address _owner, address _spender, uint256 _value)</code></a></li></ul></div>



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





### `IERC721Token`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC721Token.safeTransferFrom(address,address,uint256,bytes)"><code class="function-signature">safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data)</code></a></li><li><a href="#IERC721Token.safeTransferFrom(address,address,uint256)"><code class="function-signature">safeTransferFrom(address _from, address _to, uint256 _tokenId)</code></a></li><li><a href="#IERC721Token.approve(address,uint256)"><code class="function-signature">approve(address _approved, uint256 _tokenId)</code></a></li><li><a href="#IERC721Token.setApprovalForAll(address,bool)"><code class="function-signature">setApprovalForAll(address _operator, bool _approved)</code></a></li><li><a href="#IERC721Token.balanceOf(address)"><code class="function-signature">balanceOf(address _owner)</code></a></li><li><a href="#IERC721Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _tokenId)</code></a></li><li><a href="#IERC721Token.ownerOf(uint256)"><code class="function-signature">ownerOf(uint256 _tokenId)</code></a></li><li><a href="#IERC721Token.getApproved(uint256)"><code class="function-signature">getApproved(uint256 _tokenId)</code></a></li><li><a href="#IERC721Token.isApprovedForAll(address,address)"><code class="function-signature">isApprovedForAll(address _owner, address _operator)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC721Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address _from, address _to, uint256 _tokenId)</code></a></li><li><a href="#IERC721Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address _owner, address _approved, uint256 _tokenId)</code></a></li><li><a href="#IERC721Token.ApprovalForAll(address,address,bool)"><code class="function-signature">ApprovalForAll(address _owner, address _operator, bool _approved)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC721Token.safeTransferFrom(address,address,uint256,bytes)"></a><code class="function-signature">safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC721Token.safeTransferFrom(address,address,uint256)"></a><code class="function-signature">safeTransferFrom(address _from, address _to, uint256 _tokenId)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC721Token.approve(address,uint256)"></a><code class="function-signature">approve(address _approved, uint256 _tokenId)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC721Token.setApprovalForAll(address,bool)"></a><code class="function-signature">setApprovalForAll(address _operator, bool _approved)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC721Token.balanceOf(address)"></a><code class="function-signature">balanceOf(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC721Token.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address _from, address _to, uint256 _tokenId)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC721Token.ownerOf(uint256)"></a><code class="function-signature">ownerOf(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC721Token.getApproved(uint256)"></a><code class="function-signature">getApproved(uint256 _tokenId) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC721Token.isApprovedForAll(address,address)"></a><code class="function-signature">isApprovedForAll(address _owner, address _operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IERC721Token.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address _from, address _to, uint256 _tokenId)</code><span class="function-visibility"></span></h4>

This emits when ownership of any NFT changes by any mechanism.
      This event emits when NFTs are created (`from` == 0) and destroyed
      (`to` == 0). Exception: during contract creation, any number of NFTs
      may be created and assigned without emitting Transfer. At the time of
      any transfer, the approved address for that NFT (if any) is reset to none.



<h4><a class="anchor" aria-hidden="true" id="IERC721Token.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address _owner, address _approved, uint256 _tokenId)</code><span class="function-visibility"></span></h4>

This emits when the approved address for an NFT is changed or
      reaffirmed. The zero address indicates there is no approved address.
      When a Transfer event emits, this also indicates that the approved
      address for that NFT (if any) is reset to none.



<h4><a class="anchor" aria-hidden="true" id="IERC721Token.ApprovalForAll(address,address,bool)"></a><code class="function-signature">ApprovalForAll(address _owner, address _operator, bool _approved)</code><span class="function-visibility"></span></h4>

This emits when an operator is enabled or disabled for an owner.
      The operator can manage all NFTs of the owner.



### `IExchange`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li class="inherited"><a href="src#IWrapperFunctions.fillOrKillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrKillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#IWrapperFunctions.batchFillOrders(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#IWrapperFunctions.batchFillOrKillOrders(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrKillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#IWrapperFunctions.batchFillOrdersNoThrow(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrdersNoThrow(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#IWrapperFunctions.marketSellOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketSellOrdersNoThrow(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#IWrapperFunctions.marketBuyOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketBuyOrdersNoThrow(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#IWrapperFunctions.marketSellOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketSellOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#IWrapperFunctions.marketBuyOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketBuyOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#IWrapperFunctions.batchCancelOrders(struct LibOrder.Order[])"><code class="function-signature">batchCancelOrders(struct LibOrder.Order[] orders)</code></a></li><li class="inherited"><a href="src#ITransferSimulator.simulateDispatchTransferFromCalls(bytes[],address[],address[],uint256[])"><code class="function-signature">simulateDispatchTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts)</code></a></li><li class="inherited"><a href="src#IAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li class="inherited"><a href="src#IAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li><li class="inherited"><a href="src#ITransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#ITransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#ITransactions._getCurrentContextAddress()"><code class="function-signature">_getCurrentContextAddress()</code></a></li><li class="inherited"><a href="src#ISignatureValidator.preSign(bytes32)"><code class="function-signature">preSign(bytes32 hash)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.setSignatureValidatorApproval(address,bool)"><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.isValidHashSignature(bytes32,address,bytes)"><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#ISignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature)</code></a></li><li class="inherited"><a href="src#ISignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature)</code></a></li><li class="inherited"><a href="src#IMatchOrders.batchMatchOrders(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"><code class="function-signature">batchMatchOrders(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures)</code></a></li><li class="inherited"><a href="src#IMatchOrders.batchMatchOrdersWithMaximalFill(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"><code class="function-signature">batchMatchOrdersWithMaximalFill(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures)</code></a></li><li class="inherited"><a href="src#IMatchOrders.matchOrders(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"><code class="function-signature">matchOrders(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature)</code></a></li><li class="inherited"><a href="src#IMatchOrders.matchOrdersWithMaximalFill(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"><code class="function-signature">matchOrdersWithMaximalFill(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature)</code></a></li><li class="inherited"><a href="src#IExchangeCore.cancelOrdersUpTo(uint256)"><code class="function-signature">cancelOrdersUpTo(uint256 targetOrderEpoch)</code></a></li><li class="inherited"><a href="src#IExchangeCore.fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#IExchangeCore.cancelOrder(struct LibOrder.Order)"><code class="function-signature">cancelOrder(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#IExchangeCore.getOrderInfo(struct LibOrder.Order)"><code class="function-signature">getOrderInfo(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#IProtocolFees.setProtocolFeeMultiplier(uint256)"><code class="function-signature">setProtocolFeeMultiplier(uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#IProtocolFees.setProtocolFeeCollectorAddress(address)"><code class="function-signature">setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeMultiplier()"><code class="function-signature">protocolFeeMultiplier()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeCollector()"><code class="function-signature">protocolFeeCollector()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li><li class="inherited"><a href="src#ITransactions.TransactionExecution(bytes32)"><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.SignatureValidatorApproval(address,address,bool)"><code class="function-signature">SignatureValidatorApproval(address signerAddress, address validatorAddress, bool isApproved)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Fill(address,address,bytes,bytes,bytes,bytes,bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">Fill(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, bytes makerFeeAssetData, bytes takerFeeAssetData, bytes32 orderHash, address takerAddress, address senderAddress, uint256 makerAssetFilledAmount, uint256 takerAssetFilledAmount, uint256 makerFeePaid, uint256 takerFeePaid, uint256 protocolFeePaid)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Cancel(address,address,bytes,bytes,address,bytes32)"><code class="function-signature">Cancel(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, address senderAddress, bytes32 orderHash)</code></a></li><li class="inherited"><a href="src#IExchangeCore.CancelUpTo(address,address,uint256)"><code class="function-signature">CancelUpTo(address makerAddress, address orderSenderAddress, uint256 orderEpoch)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeMultiplier(uint256,uint256)"><code class="function-signature">ProtocolFeeMultiplier(uint256 oldProtocolFeeMultiplier, uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeCollectorAddress(address,address)"><code class="function-signature">ProtocolFeeCollectorAddress(address oldProtocolFeeCollector, address updatedProtocolFeeCollector)</code></a></li></ul></div>





### `IExchangeCore`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IExchangeCore.cancelOrdersUpTo(uint256)"><code class="function-signature">cancelOrdersUpTo(uint256 targetOrderEpoch)</code></a></li><li><a href="#IExchangeCore.fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li><a href="#IExchangeCore.cancelOrder(struct LibOrder.Order)"><code class="function-signature">cancelOrder(struct LibOrder.Order order)</code></a></li><li><a href="#IExchangeCore.getOrderInfo(struct LibOrder.Order)"><code class="function-signature">getOrderInfo(struct LibOrder.Order order)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IExchangeCore.Fill(address,address,bytes,bytes,bytes,bytes,bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">Fill(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, bytes makerFeeAssetData, bytes takerFeeAssetData, bytes32 orderHash, address takerAddress, address senderAddress, uint256 makerAssetFilledAmount, uint256 takerAssetFilledAmount, uint256 makerFeePaid, uint256 takerFeePaid, uint256 protocolFeePaid)</code></a></li><li><a href="#IExchangeCore.Cancel(address,address,bytes,bytes,address,bytes32)"><code class="function-signature">Cancel(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, address senderAddress, bytes32 orderHash)</code></a></li><li><a href="#IExchangeCore.CancelUpTo(address,address,uint256)"><code class="function-signature">CancelUpTo(address makerAddress, address orderSenderAddress, uint256 orderEpoch)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IExchangeCore.cancelOrdersUpTo(uint256)"></a><code class="function-signature">cancelOrdersUpTo(uint256 targetOrderEpoch)</code><span class="function-visibility">external</span></h4>

Cancels all orders created by makerAddress with a salt less than or equal to the targetOrderEpoch
      and senderAddress equal to msg.sender (or null address if msg.sender == makerAddress).
 @param targetOrderEpoch Orders created with a salt less or equal to this value will be cancelled.



<h4><a class="anchor" aria-hidden="true" id="IExchangeCore.fillOrder(struct LibOrder.Order,uint256,bytes)"></a><code class="function-signature">fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Fills the input order.
 @param order Order struct containing order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signature Proof that order has been created by maker.
 @return Amounts filled and fees paid by maker and taker.



<h4><a class="anchor" aria-hidden="true" id="IExchangeCore.cancelOrder(struct LibOrder.Order)"></a><code class="function-signature">cancelOrder(struct LibOrder.Order order)</code><span class="function-visibility">public</span></h4>

After calling, the order can not be filled anymore.
 @param order Order struct containing order specifications.



<h4><a class="anchor" aria-hidden="true" id="IExchangeCore.getOrderInfo(struct LibOrder.Order)"></a><code class="function-signature">getOrderInfo(struct LibOrder.Order order) <span class="return-arrow">→</span> <span class="return-type">struct LibOrder.OrderInfo</span></code><span class="function-visibility">public</span></h4>

Gets information about an order: status, hash, and amount filled.
 @param order Order to gather information on.
 @return OrderInfo Information about the order and its state.
                   See LibOrder.OrderInfo for a complete description.





<h4><a class="anchor" aria-hidden="true" id="IExchangeCore.Fill(address,address,bytes,bytes,bytes,bytes,bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"></a><code class="function-signature">Fill(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, bytes makerFeeAssetData, bytes takerFeeAssetData, bytes32 orderHash, address takerAddress, address senderAddress, uint256 makerAssetFilledAmount, uint256 takerAssetFilledAmount, uint256 makerFeePaid, uint256 takerFeePaid, uint256 protocolFeePaid)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IExchangeCore.Cancel(address,address,bytes,bytes,address,bytes32)"></a><code class="function-signature">Cancel(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, address senderAddress, bytes32 orderHash)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IExchangeCore.CancelUpTo(address,address,uint256)"></a><code class="function-signature">CancelUpTo(address makerAddress, address orderSenderAddress, uint256 orderEpoch)</code><span class="function-visibility"></span></h4>





### `IMatchOrders`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IMatchOrders.batchMatchOrders(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"><code class="function-signature">batchMatchOrders(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures)</code></a></li><li><a href="#IMatchOrders.batchMatchOrdersWithMaximalFill(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"><code class="function-signature">batchMatchOrdersWithMaximalFill(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures)</code></a></li><li><a href="#IMatchOrders.matchOrders(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"><code class="function-signature">matchOrders(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature)</code></a></li><li><a href="#IMatchOrders.matchOrdersWithMaximalFill(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"><code class="function-signature">matchOrdersWithMaximalFill(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IMatchOrders.batchMatchOrders(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"></a><code class="function-signature">batchMatchOrders(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.BatchMatchedFillResults</span></code><span class="function-visibility">public</span></h4>

Match complementary orders that have a profitable spread.
      Each order is filled at their respective price point, and
      the matcher receives a profit denominated in the left maker asset.
 @param leftOrders Set of orders with the same maker / taker asset.
 @param rightOrders Set of orders to match against `leftOrders`
 @param leftSignatures Proof that left orders were created by the left makers.
 @param rightSignatures Proof that right orders were created by the right makers.
 @return batchMatchedFillResults Amounts filled and profit generated.



<h4><a class="anchor" aria-hidden="true" id="IMatchOrders.batchMatchOrdersWithMaximalFill(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"></a><code class="function-signature">batchMatchOrdersWithMaximalFill(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.BatchMatchedFillResults</span></code><span class="function-visibility">public</span></h4>

Match complementary orders that have a profitable spread.
      Each order is maximally filled at their respective price point, and
      the matcher receives a profit denominated in either the left maker asset,
      right maker asset, or a combination of both.
 @param leftOrders Set of orders with the same maker / taker asset.
 @param rightOrders Set of orders to match against `leftOrders`
 @param leftSignatures Proof that left orders were created by the left makers.
 @param rightSignatures Proof that right orders were created by the right makers.
 @return batchMatchedFillResults Amounts filled and profit generated.



<h4><a class="anchor" aria-hidden="true" id="IMatchOrders.matchOrders(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"></a><code class="function-signature">matchOrders(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.MatchedFillResults</span></code><span class="function-visibility">public</span></h4>

Match two complementary orders that have a profitable spread.
      Each order is filled at their respective price point. However, the calculations are
      carried out as though the orders are both being filled at the right order&#x27;s price point.
      The profit made by the left order goes to the taker (who matched the two orders).
 @param leftOrder First order to match.
 @param rightOrder Second order to match.
 @param leftSignature Proof that order was created by the left maker.
 @param rightSignature Proof that order was created by the right maker.
 @return matchedFillResults Amounts filled and fees paid by maker and taker of matched orders.



<h4><a class="anchor" aria-hidden="true" id="IMatchOrders.matchOrdersWithMaximalFill(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"></a><code class="function-signature">matchOrdersWithMaximalFill(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.MatchedFillResults</span></code><span class="function-visibility">public</span></h4>

Match two complementary orders that have a profitable spread.
      Each order is maximally filled at their respective price point, and
      the matcher receives a profit denominated in either the left maker asset,
      right maker asset, or a combination of both.
 @param leftOrder First order to match.
 @param rightOrder Second order to match.
 @param leftSignature Proof that order was created by the left maker.
 @param rightSignature Proof that order was created by the right maker.
 @return matchedFillResults Amounts filled by maker and taker of matched orders.





### `IProtocolFees`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IProtocolFees.setProtocolFeeMultiplier(uint256)"><code class="function-signature">setProtocolFeeMultiplier(uint256 updatedProtocolFeeMultiplier)</code></a></li><li><a href="#IProtocolFees.setProtocolFeeCollectorAddress(address)"><code class="function-signature">setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li><a href="#IProtocolFees.protocolFeeMultiplier()"><code class="function-signature">protocolFeeMultiplier()</code></a></li><li><a href="#IProtocolFees.protocolFeeCollector()"><code class="function-signature">protocolFeeCollector()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IProtocolFees.ProtocolFeeMultiplier(uint256,uint256)"><code class="function-signature">ProtocolFeeMultiplier(uint256 oldProtocolFeeMultiplier, uint256 updatedProtocolFeeMultiplier)</code></a></li><li><a href="#IProtocolFees.ProtocolFeeCollectorAddress(address,address)"><code class="function-signature">ProtocolFeeCollectorAddress(address oldProtocolFeeCollector, address updatedProtocolFeeCollector)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IProtocolFees.setProtocolFeeMultiplier(uint256)"></a><code class="function-signature">setProtocolFeeMultiplier(uint256 updatedProtocolFeeMultiplier)</code><span class="function-visibility">external</span></h4>

Allows the owner to update the protocol fee multiplier.
 @param updatedProtocolFeeMultiplier The updated protocol fee multiplier.



<h4><a class="anchor" aria-hidden="true" id="IProtocolFees.setProtocolFeeCollectorAddress(address)"></a><code class="function-signature">setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code><span class="function-visibility">external</span></h4>

Allows the owner to update the protocolFeeCollector address.
 @param updatedProtocolFeeCollector The updated protocolFeeCollector contract address.



<h4><a class="anchor" aria-hidden="true" id="IProtocolFees.protocolFeeMultiplier()"></a><code class="function-signature">protocolFeeMultiplier() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns the protocolFeeMultiplier



<h4><a class="anchor" aria-hidden="true" id="IProtocolFees.protocolFeeCollector()"></a><code class="function-signature">protocolFeeCollector() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Returns the protocolFeeCollector address





<h4><a class="anchor" aria-hidden="true" id="IProtocolFees.ProtocolFeeMultiplier(uint256,uint256)"></a><code class="function-signature">ProtocolFeeMultiplier(uint256 oldProtocolFeeMultiplier, uint256 updatedProtocolFeeMultiplier)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IProtocolFees.ProtocolFeeCollectorAddress(address,address)"></a><code class="function-signature">ProtocolFeeCollectorAddress(address oldProtocolFeeCollector, address updatedProtocolFeeCollector)</code><span class="function-visibility"></span></h4>





### `ISignatureValidator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ISignatureValidator.preSign(bytes32)"><code class="function-signature">preSign(bytes32 hash)</code></a></li><li><a href="#ISignatureValidator.setSignatureValidatorApproval(address,bool)"><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code></a></li><li><a href="#ISignatureValidator.isValidHashSignature(bytes32,address,bytes)"><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature)</code></a></li><li><a href="#ISignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature)</code></a></li><li><a href="#ISignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li><a href="#ISignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature)</code></a></li><li><a href="#ISignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ISignatureValidator.SignatureValidatorApproval(address,address,bool)"><code class="function-signature">SignatureValidatorApproval(address signerAddress, address validatorAddress, bool isApproved)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ISignatureValidator.preSign(bytes32)"></a><code class="function-signature">preSign(bytes32 hash)</code><span class="function-visibility">external</span></h4>

Approves a hash on-chain.
      After presigning a hash, the preSign signature type will become valid for that hash and signer.
 @param hash Any 32-byte hash.



<h4><a class="anchor" aria-hidden="true" id="ISignatureValidator.setSignatureValidatorApproval(address,bool)"></a><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code><span class="function-visibility">external</span></h4>

Approves/unnapproves a Validator contract to verify signatures on signer&#x27;s behalf.
 @param validatorAddress Address of Validator contract.
 @param approval Approval or disapproval of  Validator contract.



<h4><a class="anchor" aria-hidden="true" id="ISignatureValidator.isValidHashSignature(bytes32,address,bytes)"></a><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Verifies that a hash has been signed by the given signer.
 @param hash Any 32-byte hash.
 @param signature Proof that the hash has been signed by signer.
 @return isValid `true` if the signature is valid for the given hash and signer.



<h4><a class="anchor" aria-hidden="true" id="ISignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"></a><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Verifies that a signature for an order is valid.
 @param order The order.
 @param signature Proof that the order has been signed by signer.
 @return isValid true if the signature is valid for the given order and signer.



<h4><a class="anchor" aria-hidden="true" id="ISignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"></a><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Verifies that a signature for a transaction is valid.
 @param transaction The transaction.
 @param signature Proof that the order has been signed by signer.
 @return isValid true if the signature is valid for the given transaction and signer.



<h4><a class="anchor" aria-hidden="true" id="ISignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"></a><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Verifies that an order, with provided order hash, has been signed
      by the given signer.
 @param order The order.
 @param orderHash The hash of the order.
 @param signature Proof that the hash has been signed by signer.
 @return isValid True if the signature is valid for the given order and signer.



<h4><a class="anchor" aria-hidden="true" id="ISignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"></a><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Verifies that a transaction, with provided order hash, has been signed
      by the given signer.
 @param transaction The transaction.
 @param transactionHash The hash of the transaction.
 @param signature Proof that the hash has been signed by signer.
 @return isValid True if the signature is valid for the given transaction and signer.





<h4><a class="anchor" aria-hidden="true" id="ISignatureValidator.SignatureValidatorApproval(address,address,bool)"></a><code class="function-signature">SignatureValidatorApproval(address signerAddress, address validatorAddress, bool isApproved)</code><span class="function-visibility"></span></h4>





### `ITransactions`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li><a href="#ITransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures)</code></a></li><li><a href="#ITransactions._getCurrentContextAddress()"><code class="function-signature">_getCurrentContextAddress()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ITransactions.TransactionExecution(bytes32)"><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"></a><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Executes an Exchange method call in the context of signer.
 @param transaction 0x transaction containing salt, signerAddress, and data.
 @param signature Proof that transaction has been signed by signer.
 @return ABI encoded return data of the underlying Exchange function call.



<h4><a class="anchor" aria-hidden="true" id="ITransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"></a><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">bytes[]</span></code><span class="function-visibility">public</span></h4>

Executes a batch of Exchange method calls in the context of signer(s).
 @param transactions Array of 0x transactions containing salt, signerAddress, and data.
 @param signatures Array of proofs that transactions have been signed by signer(s).
 @return Array containing ABI encoded return data for each of the underlying Exchange function calls.



<h4><a class="anchor" aria-hidden="true" id="ITransactions._getCurrentContextAddress()"></a><code class="function-signature">_getCurrentContextAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

The current function will be called in the context of this address (either 0x transaction signer or `msg.sender`).
      If calling a fill function, this address will represent the taker.
      If calling a cancel function, this address will represent the maker.
 @return Signer of 0x transaction if entry point is [`executeTransaction`](../../exchange/contracts/src#ITransactions.executeTransaction(struct%20LibZeroExTransaction.ZeroExTransaction,bytes)).
         `msg.sender` if entry point is any other function.





<h4><a class="anchor" aria-hidden="true" id="ITransactions.TransactionExecution(bytes32)"></a><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code><span class="function-visibility"></span></h4>





### `ITransferSimulator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITransferSimulator.simulateDispatchTransferFromCalls(bytes[],address[],address[],uint256[])"><code class="function-signature">simulateDispatchTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITransferSimulator.simulateDispatchTransferFromCalls(bytes[],address[],address[],uint256[])"></a><code class="function-signature">simulateDispatchTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts)</code><span class="function-visibility">public</span></h4>

This function may be used to simulate any amount of transfers
 As they would occur through the Exchange contract. Note that this function
 will always revert, even if all transfers are successful. However, it may
 be used with eth_call or with a try/catch pattern in order to simulate
 the results of the transfers.
 @param assetData Array of asset details, each encoded per the AssetProxy contract specification.
 @param fromAddresses Array containing the `from` addresses that correspond with each transfer.
 @param toAddresses Array containing the `to` addresses that correspond with each transfer.
 @param amounts Array containing the amounts that correspond to each transfer.
 @return This function does not return a value. However, it will always revert with
 `Error(&quot;TRANSFERS_SUCCESSFUL&quot;)` if all of the transfers were successful.





### `IWrapperFunctions`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IWrapperFunctions.fillOrKillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrKillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li><a href="#IWrapperFunctions.batchFillOrders(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li><a href="#IWrapperFunctions.batchFillOrKillOrders(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrKillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li><a href="#IWrapperFunctions.batchFillOrdersNoThrow(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrdersNoThrow(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li><a href="#IWrapperFunctions.marketSellOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketSellOrdersNoThrow(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures)</code></a></li><li><a href="#IWrapperFunctions.marketBuyOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketBuyOrdersNoThrow(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures)</code></a></li><li><a href="#IWrapperFunctions.marketSellOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketSellOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures)</code></a></li><li><a href="#IWrapperFunctions.marketBuyOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketBuyOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures)</code></a></li><li><a href="#IWrapperFunctions.batchCancelOrders(struct LibOrder.Order[])"><code class="function-signature">batchCancelOrders(struct LibOrder.Order[] orders)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IWrapperFunctions.fillOrKillOrder(struct LibOrder.Order,uint256,bytes)"></a><code class="function-signature">fillOrKillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Fills the input order. Reverts if exact takerAssetFillAmount not filled.
 @param order Order struct containing order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signature Proof that order has been created by maker.



<h4><a class="anchor" aria-hidden="true" id="IWrapperFunctions.batchFillOrders(struct LibOrder.Order[],uint256[],bytes[])"></a><code class="function-signature">batchFillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults[]</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrder.
 @param orders Array of order specifications.
 @param takerAssetFillAmounts Array of desired amounts of takerAsset to sell in orders.
 @param signatures Proofs that orders have been created by makers.
 @return Array of amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="IWrapperFunctions.batchFillOrKillOrders(struct LibOrder.Order[],uint256[],bytes[])"></a><code class="function-signature">batchFillOrKillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults[]</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrKillOrder.
 @param orders Array of order specifications.
 @param takerAssetFillAmounts Array of desired amounts of takerAsset to sell in orders.
 @param signatures Proofs that orders have been created by makers.
 @return Array of amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="IWrapperFunctions.batchFillOrdersNoThrow(struct LibOrder.Order[],uint256[],bytes[])"></a><code class="function-signature">batchFillOrdersNoThrow(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults[]</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrder. If any fill reverts, the error is caught and ignored.
 @param orders Array of order specifications.
 @param takerAssetFillAmounts Array of desired amounts of takerAsset to sell in orders.
 @param signatures Proofs that orders have been created by makers.
 @return Array of amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="IWrapperFunctions.marketSellOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"></a><code class="function-signature">marketSellOrdersNoThrow(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrder until total amount of takerAsset is sold by taker.
      If any fill reverts, the error is caught and ignored.
      NOTE: This function does not enforce that the takerAsset is the same for each order.
 @param orders Array of order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signatures Proofs that orders have been signed by makers.
 @return Amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="IWrapperFunctions.marketBuyOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"></a><code class="function-signature">marketBuyOrdersNoThrow(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrder until total amount of makerAsset is bought by taker.
      If any fill reverts, the error is caught and ignored.
      NOTE: This function does not enforce that the makerAsset is the same for each order.
 @param orders Array of order specifications.
 @param makerAssetFillAmount Desired amount of makerAsset to buy.
 @param signatures Proofs that orders have been signed by makers.
 @return Amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="IWrapperFunctions.marketSellOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"></a><code class="function-signature">marketSellOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Calls marketSellOrdersNoThrow then reverts if &lt; takerAssetFillAmount has been sold.
      NOTE: This function does not enforce that the takerAsset is the same for each order.
 @param orders Array of order specifications.
 @param takerAssetFillAmount Minimum amount of takerAsset to sell.
 @param signatures Proofs that orders have been signed by makers.
 @return Amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="IWrapperFunctions.marketBuyOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"></a><code class="function-signature">marketBuyOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Calls marketBuyOrdersNoThrow then reverts if &lt; makerAssetFillAmount has been bought.
      NOTE: This function does not enforce that the makerAsset is the same for each order.
 @param orders Array of order specifications.
 @param makerAssetFillAmount Minimum amount of makerAsset to buy.
 @param signatures Proofs that orders have been signed by makers.
 @return Amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="IWrapperFunctions.batchCancelOrders(struct LibOrder.Order[])"></a><code class="function-signature">batchCancelOrders(struct LibOrder.Order[] orders)</code><span class="function-visibility">public</span></h4>

Executes multiple calls of cancelOrder.
 @param orders Array of order specifications.





### `LibAssetData`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibAssetData.constructor(address,address)"><code class="function-signature">constructor(address _exchange, address _chaiBridge)</code></a></li><li><a href="#LibAssetData.getBalance(address,bytes)"><code class="function-signature">getBalance(address ownerAddress, bytes assetData)</code></a></li><li><a href="#LibAssetData.getBatchBalances(address,bytes[])"><code class="function-signature">getBatchBalances(address ownerAddress, bytes[] assetData)</code></a></li><li><a href="#LibAssetData.getAssetProxyAllowance(address,bytes)"><code class="function-signature">getAssetProxyAllowance(address ownerAddress, bytes assetData)</code></a></li><li><a href="#LibAssetData.getBatchAssetProxyAllowances(address,bytes[])"><code class="function-signature">getBatchAssetProxyAllowances(address ownerAddress, bytes[] assetData)</code></a></li><li><a href="#LibAssetData.getBalanceAndAssetProxyAllowance(address,bytes)"><code class="function-signature">getBalanceAndAssetProxyAllowance(address ownerAddress, bytes assetData)</code></a></li><li><a href="#LibAssetData.getBatchBalancesAndAssetProxyAllowances(address,bytes[])"><code class="function-signature">getBatchBalancesAndAssetProxyAllowances(address ownerAddress, bytes[] assetData)</code></a></li><li><a href="#LibAssetData.decodeAssetProxyId(bytes)"><code class="function-signature">decodeAssetProxyId(bytes assetData)</code></a></li><li><a href="#LibAssetData.encodeERC20AssetData(address)"><code class="function-signature">encodeERC20AssetData(address tokenAddress)</code></a></li><li><a href="#LibAssetData.decodeERC20AssetData(bytes)"><code class="function-signature">decodeERC20AssetData(bytes assetData)</code></a></li><li><a href="#LibAssetData.encodeERC721AssetData(address,uint256)"><code class="function-signature">encodeERC721AssetData(address tokenAddress, uint256 tokenId)</code></a></li><li><a href="#LibAssetData.decodeERC721AssetData(bytes)"><code class="function-signature">decodeERC721AssetData(bytes assetData)</code></a></li><li><a href="#LibAssetData.encodeERC1155AssetData(address,uint256[],uint256[],bytes)"><code class="function-signature">encodeERC1155AssetData(address tokenAddress, uint256[] tokenIds, uint256[] tokenValues, bytes callbackData)</code></a></li><li><a href="#LibAssetData.decodeERC1155AssetData(bytes)"><code class="function-signature">decodeERC1155AssetData(bytes assetData)</code></a></li><li><a href="#LibAssetData.encodeMultiAssetData(uint256[],bytes[])"><code class="function-signature">encodeMultiAssetData(uint256[] amounts, bytes[] nestedAssetData)</code></a></li><li><a href="#LibAssetData.decodeMultiAssetData(bytes)"><code class="function-signature">decodeMultiAssetData(bytes assetData)</code></a></li><li><a href="#LibAssetData.encodeStaticCallAssetData(address,bytes,bytes32)"><code class="function-signature">encodeStaticCallAssetData(address staticCallTargetAddress, bytes staticCallData, bytes32 expectedReturnDataHash)</code></a></li><li><a href="#LibAssetData.decodeStaticCallAssetData(bytes)"><code class="function-signature">decodeStaticCallAssetData(bytes assetData)</code></a></li><li><a href="#LibAssetData.decodeERC20BridgeAssetData(bytes)"><code class="function-signature">decodeERC20BridgeAssetData(bytes assetData)</code></a></li><li><a href="#LibAssetData.revertIfInvalidAssetData(bytes)"><code class="function-signature">revertIfInvalidAssetData(bytes assetData)</code></a></li><li><a href="#LibAssetData._erc20BalanceOf(address,address)"><code class="function-signature">_erc20BalanceOf(address tokenAddress, address ownerAddress)</code></a></li><li><a href="#LibAssetData._convertChaiToDaiAmount(uint256)"><code class="function-signature">_convertChaiToDaiAmount(uint256 chaiAmount)</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getKyberNetworkProxyAddress()"><code class="function-signature">_getKyberNetworkProxyAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getWethAddress()"><code class="function-signature">_getWethAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getUniswapExchangeFactoryAddress()"><code class="function-signature">_getUniswapExchangeFactoryAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getEth2DaiAddress()"><code class="function-signature">_getEth2DaiAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getERC20BridgeProxyAddress()"><code class="function-signature">_getERC20BridgeProxyAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getDaiAddress()"><code class="function-signature">_getDaiAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getChaiAddress()"><code class="function-signature">_getChaiAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getDevUtilsAddress()"><code class="function-signature">_getDevUtilsAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getDydxAddress()"><code class="function-signature">_getDydxAddress()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.constructor(address,address)"></a><code class="function-signature">constructor(address _exchange, address _chaiBridge)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibAssetData.getBalance(address,bytes)"></a><code class="function-signature">getBalance(address ownerAddress, bytes assetData) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

Returns the owner&#x27;s balance of the assets(s) specified in
 assetData.  When the asset data contains multiple assets (eg in
 ERC1155 or Multi-Asset), the return value indicates how many
 complete &quot;baskets&quot; of those assets are owned by owner.
 @param ownerAddress Owner of the assets specified by assetData.
 @param assetData Details of asset, encoded per the AssetProxy contract specification.
 @return Number of assets (or asset baskets) held by owner.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.getBatchBalances(address,bytes[])"></a><code class="function-signature">getBatchBalances(address ownerAddress, bytes[] assetData) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>

Calls getBalance() for each element of assetData.
 @param ownerAddress Owner of the assets specified by assetData.
 @param assetData Array of asset details, each encoded per the AssetProxy contract specification.
 @return Array of asset balances from getBalance(), with each element
 corresponding to the same-indexed element in the assetData input.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.getAssetProxyAllowance(address,bytes)"></a><code class="function-signature">getAssetProxyAllowance(address ownerAddress, bytes assetData) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

Returns the number of asset(s) (described by assetData) that
 the corresponding AssetProxy contract is authorized to spend.  When the asset data contains
 multiple assets (eg for Multi-Asset), the return value indicates
 how many complete &quot;baskets&quot; of those assets may be spent by all of the corresponding
 AssetProxy contracts.
 @param ownerAddress Owner of the assets specified by assetData.
 @param assetData Details of asset, encoded per the AssetProxy contract specification.
 @return Number of assets (or asset baskets) that the corresponding AssetProxy is authorized to spend.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.getBatchAssetProxyAllowances(address,bytes[])"></a><code class="function-signature">getBatchAssetProxyAllowances(address ownerAddress, bytes[] assetData) <span class="return-arrow">→</span> <span class="return-type">uint256[]</span></code><span class="function-visibility">public</span></h4>

Calls getAssetProxyAllowance() for each element of assetData.
 @param ownerAddress Owner of the assets specified by assetData.
 @param assetData Array of asset details, each encoded per the AssetProxy contract specification.
 @return An array of asset allowances from getAllowance(), with each
 element corresponding to the same-indexed element in the assetData input.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.getBalanceAndAssetProxyAllowance(address,bytes)"></a><code class="function-signature">getBalanceAndAssetProxyAllowance(address ownerAddress, bytes assetData) <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">public</span></h4>

Calls getBalance() and getAllowance() for assetData.
 @param ownerAddress Owner of the assets specified by assetData.
 @param assetData Details of asset, encoded per the AssetProxy contract specification.
 @return Number of assets (or asset baskets) held by owner, and number
 of assets (or asset baskets) that the corresponding AssetProxy is authorized to spend.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.getBatchBalancesAndAssetProxyAllowances(address,bytes[])"></a><code class="function-signature">getBatchBalancesAndAssetProxyAllowances(address ownerAddress, bytes[] assetData) <span class="return-arrow">→</span> <span class="return-type">uint256[],uint256[]</span></code><span class="function-visibility">public</span></h4>

Calls getBatchBalances() and getBatchAllowances() for each element of assetData.
 @param ownerAddress Owner of the assets specified by assetData.
 @param assetData Array of asset details, each encoded per the AssetProxy contract specification.
 @return An array of asset balances from getBalance(), and an array of
 asset allowances from getAllowance(), with each element
 corresponding to the same-indexed element in the assetData input.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.decodeAssetProxyId(bytes)"></a><code class="function-signature">decodeAssetProxyId(bytes assetData) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">public</span></h4>

Decode AssetProxy identifier
 @param assetData AssetProxy-compliant asset data describing an ERC-20, ERC-721, ERC1155, or MultiAsset asset.
 @return The AssetProxy identifier



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.encodeERC20AssetData(address)"></a><code class="function-signature">encodeERC20AssetData(address tokenAddress) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Encode ERC-20 asset data into the format described in the AssetProxy contract specification.
 @param tokenAddress The address of the ERC-20 contract hosting the asset to be traded.
 @return AssetProxy-compliant data describing the asset.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.decodeERC20AssetData(bytes)"></a><code class="function-signature">decodeERC20AssetData(bytes assetData) <span class="return-arrow">→</span> <span class="return-type">bytes4,address</span></code><span class="function-visibility">public</span></h4>

Decode ERC-20 asset data from the format described in the AssetProxy contract specification.
 @param assetData AssetProxy-compliant asset data describing an ERC-20 asset.
 @return The AssetProxy identifier, and the address of the ERC-20
 contract hosting this asset.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.encodeERC721AssetData(address,uint256)"></a><code class="function-signature">encodeERC721AssetData(address tokenAddress, uint256 tokenId) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Encode ERC-721 asset data into the format described in the AssetProxy specification.
 @param tokenAddress The address of the ERC-721 contract hosting the asset to be traded.
 @param tokenId The identifier of the specific asset to be traded.
 @return AssetProxy-compliant asset data describing the asset.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.decodeERC721AssetData(bytes)"></a><code class="function-signature">decodeERC721AssetData(bytes assetData) <span class="return-arrow">→</span> <span class="return-type">bytes4,address,uint256</span></code><span class="function-visibility">public</span></h4>

Decode ERC-721 asset data from the format described in the AssetProxy contract specification.
 @param assetData AssetProxy-compliant asset data describing an ERC-721 asset.
 @return The ERC-721 AssetProxy identifier, the address of the ERC-721
 contract hosting this asset, and the identifier of the specific
 asset to be traded.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.encodeERC1155AssetData(address,uint256[],uint256[],bytes)"></a><code class="function-signature">encodeERC1155AssetData(address tokenAddress, uint256[] tokenIds, uint256[] tokenValues, bytes callbackData) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Encode ERC-1155 asset data into the format described in the AssetProxy contract specification.
 @param tokenAddress The address of the ERC-1155 contract hosting the asset(s) to be traded.
 @param tokenIds The identifiers of the specific assets to be traded.
 @param tokenValues The amounts of each asset to be traded.
 @param callbackData Data to be passed to receiving contracts when a transfer is performed.
 @return AssetProxy-compliant asset data describing the set of assets.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.decodeERC1155AssetData(bytes)"></a><code class="function-signature">decodeERC1155AssetData(bytes assetData) <span class="return-arrow">→</span> <span class="return-type">bytes4,address,uint256[],uint256[],bytes</span></code><span class="function-visibility">public</span></h4>

Decode ERC-1155 asset data from the format described in the AssetProxy contract specification.
 @param assetData AssetProxy-compliant asset data describing an ERC-1155 set of assets.
 @return The ERC-1155 AssetProxy identifier, the address of the ERC-1155
 contract hosting the assets, an array of the identifiers of the
 assets to be traded, an array of asset amounts to be traded, and
 callback data.  Each element of the arrays corresponds to the
 same-indexed element of the other array.  Return values specified as
 `memory` are returned as pointers to locations within the memory of
 the input parameter `assetData`.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.encodeMultiAssetData(uint256[],bytes[])"></a><code class="function-signature">encodeMultiAssetData(uint256[] amounts, bytes[] nestedAssetData) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Encode data for multiple assets, per the AssetProxy contract specification.
 @param amounts The amounts of each asset to be traded.
 @param nestedAssetData AssetProxy-compliant data describing each asset to be traded.
 @return AssetProxy-compliant data describing the set of assets.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.decodeMultiAssetData(bytes)"></a><code class="function-signature">decodeMultiAssetData(bytes assetData) <span class="return-arrow">→</span> <span class="return-type">bytes4,uint256[],bytes[]</span></code><span class="function-visibility">public</span></h4>

Decode multi-asset data from the format described in the AssetProxy contract specification.
 @param assetData AssetProxy-compliant data describing a multi-asset basket.
 @return The Multi-Asset AssetProxy identifier, an array of the amounts
 of the assets to be traded, and an array of the
 AssetProxy-compliant data describing each asset to be traded.  Each
 element of the arrays corresponds to the same-indexed element of the other array.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.encodeStaticCallAssetData(address,bytes,bytes32)"></a><code class="function-signature">encodeStaticCallAssetData(address staticCallTargetAddress, bytes staticCallData, bytes32 expectedReturnDataHash) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Encode StaticCall asset data into the format described in the AssetProxy contract specification.
 @param staticCallTargetAddress Target address of StaticCall.
 @param staticCallData Data that will be passed to staticCallTargetAddress in the StaticCall.
 @param expectedReturnDataHash Expected Keccak-256 hash of the StaticCall return data.
 @return AssetProxy-compliant asset data describing the set of assets.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.decodeStaticCallAssetData(bytes)"></a><code class="function-signature">decodeStaticCallAssetData(bytes assetData) <span class="return-arrow">→</span> <span class="return-type">bytes4,address,bytes,bytes32</span></code><span class="function-visibility">public</span></h4>

Decode StaticCall asset data from the format described in the AssetProxy contract specification.
 @param assetData AssetProxy-compliant asset data describing a StaticCall asset
 @return The StaticCall AssetProxy identifier, the target address of the StaticCAll, the data to be
 passed to the target address, and the expected Keccak-256 hash of the static call return data.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.decodeERC20BridgeAssetData(bytes)"></a><code class="function-signature">decodeERC20BridgeAssetData(bytes assetData) <span class="return-arrow">→</span> <span class="return-type">bytes4,address,address,bytes</span></code><span class="function-visibility">public</span></h4>

Decode ERC20Bridge asset data from the format described in the AssetProxy contract specification.
 @param assetData AssetProxy-compliant asset data describing an ERC20Bridge asset
 @return The ERC20BridgeProxy identifier, the address of the ERC20 token to transfer, the address
 of the bridge contract, and extra data to be passed to the bridge contract.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData.revertIfInvalidAssetData(bytes)"></a><code class="function-signature">revertIfInvalidAssetData(bytes assetData)</code><span class="function-visibility">public</span></h4>

Reverts if assetData is not of a valid format for its given proxy id.
 @param assetData AssetProxy compliant asset data.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData._erc20BalanceOf(address,address)"></a><code class="function-signature">_erc20BalanceOf(address tokenAddress, address ownerAddress) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Queries balance of an ERC20 token. Returns 0 if call was unsuccessful.
 @param tokenAddress Address of ERC20 token.
 @param ownerAddress Address of owner of ERC20 token.
 @return balance ERC20 token balance of owner.



<h4><a class="anchor" aria-hidden="true" id="LibAssetData._convertChaiToDaiAmount(uint256)"></a><code class="function-signature">_convertChaiToDaiAmount(uint256 chaiAmount) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Converts an amount of Chai into its equivalent Dai amount.
      Also accumulates Dai from DSR if called after the last time it was collected.
 @param chaiAmount Amount of Chai to converts.





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





### `LibEIP712`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibEIP712.hashEIP712Domain(string,string,uint256,address)"><code class="function-signature">hashEIP712Domain(string name, string version, uint256 chainId, address verifyingContract)</code></a></li><li><a href="#LibEIP712.hashEIP712Message(bytes32,bytes32)"><code class="function-signature">hashEIP712Message(bytes32 eip712DomainHash, bytes32 hashStruct)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibEIP712.hashEIP712Domain(string,string,uint256,address)"></a><code class="function-signature">hashEIP712Domain(string name, string version, uint256 chainId, address verifyingContract) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>

Calculates a EIP712 domain separator.
 @param name The EIP712 domain name.
 @param version The EIP712 domain version.
 @param verifyingContract The EIP712 verifying contract.
 @return EIP712 domain separator.



<h4><a class="anchor" aria-hidden="true" id="LibEIP712.hashEIP712Message(bytes32,bytes32)"></a><code class="function-signature">hashEIP712Message(bytes32 eip712DomainHash, bytes32 hashStruct) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>

Calculates EIP712 encoding for a hash struct with a given domain hash.
 @param eip712DomainHash Hash of the domain domain separator data, computed
                         with getDomainHash().
 @param hashStruct The EIP712 hash struct.
 @return EIP712 hash applied to the given EIP712 Domain.





### `LibEIP712ExchangeDomain`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibEIP712ExchangeDomain.constructor(uint256,address)"></a><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code><span class="function-visibility">public</span></h4>







### `LibExchangeRichErrorDecoder`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibExchangeRichErrorDecoder.decodeSignatureError(bytes)"><code class="function-signature">decodeSignatureError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeEIP1271SignatureError(bytes)"><code class="function-signature">decodeEIP1271SignatureError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeSignatureValidatorNotApprovedError(bytes)"><code class="function-signature">decodeSignatureValidatorNotApprovedError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeSignatureWalletError(bytes)"><code class="function-signature">decodeSignatureWalletError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeOrderStatusError(bytes)"><code class="function-signature">decodeOrderStatusError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeExchangeInvalidContextError(bytes)"><code class="function-signature">decodeExchangeInvalidContextError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeFillError(bytes)"><code class="function-signature">decodeFillError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeOrderEpochError(bytes)"><code class="function-signature">decodeOrderEpochError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeAssetProxyExistsError(bytes)"><code class="function-signature">decodeAssetProxyExistsError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeAssetProxyDispatchError(bytes)"><code class="function-signature">decodeAssetProxyDispatchError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeAssetProxyTransferError(bytes)"><code class="function-signature">decodeAssetProxyTransferError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeNegativeSpreadError(bytes)"><code class="function-signature">decodeNegativeSpreadError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeTransactionError(bytes)"><code class="function-signature">decodeTransactionError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeTransactionExecutionError(bytes)"><code class="function-signature">decodeTransactionExecutionError(bytes encoded)</code></a></li><li><a href="#LibExchangeRichErrorDecoder.decodeIncompleteFillError(bytes)"><code class="function-signature">decodeIncompleteFillError(bytes encoded)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeSignatureError(bytes)"></a><code class="function-signature">decodeSignatureError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">enum LibExchangeRichErrors.SignatureErrorCodes,bytes32,address,bytes</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded SignatureError.
 @param encoded ABI-encoded revert error.
 @return errorCode The error code.
 @return signerAddress The expected signer of the hash.
 @return signature The full signature.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeEIP1271SignatureError(bytes)"></a><code class="function-signature">decodeEIP1271SignatureError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">address,bytes,bytes,bytes</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded SignatureValidatorError.
 @param encoded ABI-encoded revert error.
 @return signerAddress The expected signer of the hash.
 @return signature The full signature bytes.
 @return errorData The revert data thrown by the validator contract.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeSignatureValidatorNotApprovedError(bytes)"></a><code class="function-signature">decodeSignatureValidatorNotApprovedError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">address,address</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded SignatureValidatorNotApprovedError.
 @param encoded ABI-encoded revert error.
 @return signerAddress The expected signer of the hash.
 @return validatorAddress The expected validator.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeSignatureWalletError(bytes)"></a><code class="function-signature">decodeSignatureWalletError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">bytes32,address,bytes,bytes</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded SignatureWalletError.
 @param encoded ABI-encoded revert error.
 @return errorCode The error code.
 @return signerAddress The expected signer of the hash.
 @return signature The full signature bytes.
 @return errorData The revert data thrown by the validator contract.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeOrderStatusError(bytes)"></a><code class="function-signature">decodeOrderStatusError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">bytes32,enum LibOrder.OrderStatus</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded OrderStatusError.
 @param encoded ABI-encoded revert error.
 @return orderHash The order hash.
 @return orderStatus The order status.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeExchangeInvalidContextError(bytes)"></a><code class="function-signature">decodeExchangeInvalidContextError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">enum LibExchangeRichErrors.ExchangeContextErrorCodes,bytes32,address</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded OrderStatusError.
 @param encoded ABI-encoded revert error.
 @return errorCode Error code that corresponds to invalid maker, taker, or sender.
 @return orderHash The order hash.
 @return contextAddress The maker, taker, or sender address



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeFillError(bytes)"></a><code class="function-signature">decodeFillError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">enum LibExchangeRichErrors.FillErrorCodes,bytes32</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded FillError.
 @param encoded ABI-encoded revert error.
 @return errorCode The error code.
 @return orderHash The order hash.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeOrderEpochError(bytes)"></a><code class="function-signature">decodeOrderEpochError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">address,address,uint256</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded OrderEpochError.
 @param encoded ABI-encoded revert error.
 @return makerAddress The order maker.
 @return orderSenderAddress The order sender.
 @return currentEpoch The current epoch for the maker.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeAssetProxyExistsError(bytes)"></a><code class="function-signature">decodeAssetProxyExistsError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">bytes4,address</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded AssetProxyExistsError.
 @param encoded ABI-encoded revert error.
 @return assetProxyId Id of asset proxy.
 @return assetProxyAddress The address of the asset proxy.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeAssetProxyDispatchError(bytes)"></a><code class="function-signature">decodeAssetProxyDispatchError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">enum LibExchangeRichErrors.AssetProxyDispatchErrorCodes,bytes32,bytes</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded AssetProxyDispatchError.
 @param encoded ABI-encoded revert error.
 @return errorCode The error code.
 @return orderHash Hash of the order being dispatched.
 @return assetData Asset data of the order being dispatched.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeAssetProxyTransferError(bytes)"></a><code class="function-signature">decodeAssetProxyTransferError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">bytes32,bytes,bytes</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded AssetProxyTransferError.
 @param encoded ABI-encoded revert error.
 @return orderHash Hash of the order being dispatched.
 @return assetData Asset data of the order being dispatched.
 @return errorData ABI-encoded revert data from the asset proxy.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeNegativeSpreadError(bytes)"></a><code class="function-signature">decodeNegativeSpreadError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">bytes32,bytes32</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded NegativeSpreadError.
 @param encoded ABI-encoded revert error.
 @return leftOrderHash Hash of the left order being matched.
 @return rightOrderHash Hash of the right order being matched.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeTransactionError(bytes)"></a><code class="function-signature">decodeTransactionError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">enum LibExchangeRichErrors.TransactionErrorCodes,bytes32</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded TransactionError.
 @param encoded ABI-encoded revert error.
 @return errorCode The error code.
 @return transactionHash Hash of the transaction.



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeTransactionExecutionError(bytes)"></a><code class="function-signature">decodeTransactionExecutionError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">bytes32,bytes</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded TransactionExecutionError.
 @param encoded ABI-encoded revert error.
 @return transactionHash Hash of the transaction.
 @return errorData Error thrown by exeucteTransaction().



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrorDecoder.decodeIncompleteFillError(bytes)"></a><code class="function-signature">decodeIncompleteFillError(bytes encoded) <span class="return-arrow">→</span> <span class="return-type">enum LibExchangeRichErrors.IncompleteFillErrorCode,uint256,uint256</span></code><span class="function-visibility">public</span></h4>

Decompose an ABI-encoded IncompleteFillError.
 @param encoded ABI-encoded revert error.
 @return orderHash Hash of the order being filled.





### `LibExchangeRichErrors`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibExchangeRichErrors.SignatureErrorSelector()"><code class="function-signature">SignatureErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.SignatureValidatorNotApprovedErrorSelector()"><code class="function-signature">SignatureValidatorNotApprovedErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.EIP1271SignatureErrorSelector()"><code class="function-signature">EIP1271SignatureErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.SignatureWalletErrorSelector()"><code class="function-signature">SignatureWalletErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.OrderStatusErrorSelector()"><code class="function-signature">OrderStatusErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.ExchangeInvalidContextErrorSelector()"><code class="function-signature">ExchangeInvalidContextErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.FillErrorSelector()"><code class="function-signature">FillErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.OrderEpochErrorSelector()"><code class="function-signature">OrderEpochErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.AssetProxyExistsErrorSelector()"><code class="function-signature">AssetProxyExistsErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.AssetProxyDispatchErrorSelector()"><code class="function-signature">AssetProxyDispatchErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.AssetProxyTransferErrorSelector()"><code class="function-signature">AssetProxyTransferErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.NegativeSpreadErrorSelector()"><code class="function-signature">NegativeSpreadErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.TransactionErrorSelector()"><code class="function-signature">TransactionErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.TransactionExecutionErrorSelector()"><code class="function-signature">TransactionExecutionErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.IncompleteFillErrorSelector()"><code class="function-signature">IncompleteFillErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.BatchMatchOrdersErrorSelector()"><code class="function-signature">BatchMatchOrdersErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.TransactionGasPriceErrorSelector()"><code class="function-signature">TransactionGasPriceErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.TransactionInvalidContextErrorSelector()"><code class="function-signature">TransactionInvalidContextErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.PayProtocolFeeErrorSelector()"><code class="function-signature">PayProtocolFeeErrorSelector()</code></a></li><li><a href="#LibExchangeRichErrors.BatchMatchOrdersError(enum LibExchangeRichErrors.BatchMatchOrdersErrorCodes)"><code class="function-signature">BatchMatchOrdersError(enum LibExchangeRichErrors.BatchMatchOrdersErrorCodes errorCode)</code></a></li><li><a href="#LibExchangeRichErrors.SignatureError(enum LibExchangeRichErrors.SignatureErrorCodes,bytes32,address,bytes)"><code class="function-signature">SignatureError(enum LibExchangeRichErrors.SignatureErrorCodes errorCode, bytes32 hash, address signerAddress, bytes signature)</code></a></li><li><a href="#LibExchangeRichErrors.SignatureValidatorNotApprovedError(address,address)"><code class="function-signature">SignatureValidatorNotApprovedError(address signerAddress, address validatorAddress)</code></a></li><li><a href="#LibExchangeRichErrors.EIP1271SignatureError(address,bytes,bytes,bytes)"><code class="function-signature">EIP1271SignatureError(address verifyingContractAddress, bytes data, bytes signature, bytes errorData)</code></a></li><li><a href="#LibExchangeRichErrors.SignatureWalletError(bytes32,address,bytes,bytes)"><code class="function-signature">SignatureWalletError(bytes32 hash, address walletAddress, bytes signature, bytes errorData)</code></a></li><li><a href="#LibExchangeRichErrors.OrderStatusError(bytes32,enum LibOrder.OrderStatus)"><code class="function-signature">OrderStatusError(bytes32 orderHash, enum LibOrder.OrderStatus orderStatus)</code></a></li><li><a href="#LibExchangeRichErrors.ExchangeInvalidContextError(enum LibExchangeRichErrors.ExchangeContextErrorCodes,bytes32,address)"><code class="function-signature">ExchangeInvalidContextError(enum LibExchangeRichErrors.ExchangeContextErrorCodes errorCode, bytes32 orderHash, address contextAddress)</code></a></li><li><a href="#LibExchangeRichErrors.FillError(enum LibExchangeRichErrors.FillErrorCodes,bytes32)"><code class="function-signature">FillError(enum LibExchangeRichErrors.FillErrorCodes errorCode, bytes32 orderHash)</code></a></li><li><a href="#LibExchangeRichErrors.OrderEpochError(address,address,uint256)"><code class="function-signature">OrderEpochError(address makerAddress, address orderSenderAddress, uint256 currentEpoch)</code></a></li><li><a href="#LibExchangeRichErrors.AssetProxyExistsError(bytes4,address)"><code class="function-signature">AssetProxyExistsError(bytes4 assetProxyId, address assetProxyAddress)</code></a></li><li><a href="#LibExchangeRichErrors.AssetProxyDispatchError(enum LibExchangeRichErrors.AssetProxyDispatchErrorCodes,bytes32,bytes)"><code class="function-signature">AssetProxyDispatchError(enum LibExchangeRichErrors.AssetProxyDispatchErrorCodes errorCode, bytes32 orderHash, bytes assetData)</code></a></li><li><a href="#LibExchangeRichErrors.AssetProxyTransferError(bytes32,bytes,bytes)"><code class="function-signature">AssetProxyTransferError(bytes32 orderHash, bytes assetData, bytes errorData)</code></a></li><li><a href="#LibExchangeRichErrors.NegativeSpreadError(bytes32,bytes32)"><code class="function-signature">NegativeSpreadError(bytes32 leftOrderHash, bytes32 rightOrderHash)</code></a></li><li><a href="#LibExchangeRichErrors.TransactionError(enum LibExchangeRichErrors.TransactionErrorCodes,bytes32)"><code class="function-signature">TransactionError(enum LibExchangeRichErrors.TransactionErrorCodes errorCode, bytes32 transactionHash)</code></a></li><li><a href="#LibExchangeRichErrors.TransactionExecutionError(bytes32,bytes)"><code class="function-signature">TransactionExecutionError(bytes32 transactionHash, bytes errorData)</code></a></li><li><a href="#LibExchangeRichErrors.TransactionGasPriceError(bytes32,uint256,uint256)"><code class="function-signature">TransactionGasPriceError(bytes32 transactionHash, uint256 actualGasPrice, uint256 requiredGasPrice)</code></a></li><li><a href="#LibExchangeRichErrors.TransactionInvalidContextError(bytes32,address)"><code class="function-signature">TransactionInvalidContextError(bytes32 transactionHash, address currentContextAddress)</code></a></li><li><a href="#LibExchangeRichErrors.IncompleteFillError(enum LibExchangeRichErrors.IncompleteFillErrorCode,uint256,uint256)"><code class="function-signature">IncompleteFillError(enum LibExchangeRichErrors.IncompleteFillErrorCode errorCode, uint256 expectedAssetFillAmount, uint256 actualAssetFillAmount)</code></a></li><li><a href="#LibExchangeRichErrors.PayProtocolFeeError(bytes32,uint256,address,address,bytes)"><code class="function-signature">PayProtocolFeeError(bytes32 orderHash, uint256 protocolFee, address makerAddress, address takerAddress, bytes errorData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.SignatureErrorSelector()"></a><code class="function-signature">SignatureErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.SignatureValidatorNotApprovedErrorSelector()"></a><code class="function-signature">SignatureValidatorNotApprovedErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.EIP1271SignatureErrorSelector()"></a><code class="function-signature">EIP1271SignatureErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.SignatureWalletErrorSelector()"></a><code class="function-signature">SignatureWalletErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.OrderStatusErrorSelector()"></a><code class="function-signature">OrderStatusErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.ExchangeInvalidContextErrorSelector()"></a><code class="function-signature">ExchangeInvalidContextErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.FillErrorSelector()"></a><code class="function-signature">FillErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.OrderEpochErrorSelector()"></a><code class="function-signature">OrderEpochErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.AssetProxyExistsErrorSelector()"></a><code class="function-signature">AssetProxyExistsErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.AssetProxyDispatchErrorSelector()"></a><code class="function-signature">AssetProxyDispatchErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.AssetProxyTransferErrorSelector()"></a><code class="function-signature">AssetProxyTransferErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.NegativeSpreadErrorSelector()"></a><code class="function-signature">NegativeSpreadErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.TransactionErrorSelector()"></a><code class="function-signature">TransactionErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.TransactionExecutionErrorSelector()"></a><code class="function-signature">TransactionExecutionErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.IncompleteFillErrorSelector()"></a><code class="function-signature">IncompleteFillErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.BatchMatchOrdersErrorSelector()"></a><code class="function-signature">BatchMatchOrdersErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.TransactionGasPriceErrorSelector()"></a><code class="function-signature">TransactionGasPriceErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.TransactionInvalidContextErrorSelector()"></a><code class="function-signature">TransactionInvalidContextErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.PayProtocolFeeErrorSelector()"></a><code class="function-signature">PayProtocolFeeErrorSelector() <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.BatchMatchOrdersError(enum LibExchangeRichErrors.BatchMatchOrdersErrorCodes)"></a><code class="function-signature">BatchMatchOrdersError(enum LibExchangeRichErrors.BatchMatchOrdersErrorCodes errorCode) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.SignatureError(enum LibExchangeRichErrors.SignatureErrorCodes,bytes32,address,bytes)"></a><code class="function-signature">SignatureError(enum LibExchangeRichErrors.SignatureErrorCodes errorCode, bytes32 hash, address signerAddress, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.SignatureValidatorNotApprovedError(address,address)"></a><code class="function-signature">SignatureValidatorNotApprovedError(address signerAddress, address validatorAddress) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.EIP1271SignatureError(address,bytes,bytes,bytes)"></a><code class="function-signature">EIP1271SignatureError(address verifyingContractAddress, bytes data, bytes signature, bytes errorData) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.SignatureWalletError(bytes32,address,bytes,bytes)"></a><code class="function-signature">SignatureWalletError(bytes32 hash, address walletAddress, bytes signature, bytes errorData) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.OrderStatusError(bytes32,enum LibOrder.OrderStatus)"></a><code class="function-signature">OrderStatusError(bytes32 orderHash, enum LibOrder.OrderStatus orderStatus) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.ExchangeInvalidContextError(enum LibExchangeRichErrors.ExchangeContextErrorCodes,bytes32,address)"></a><code class="function-signature">ExchangeInvalidContextError(enum LibExchangeRichErrors.ExchangeContextErrorCodes errorCode, bytes32 orderHash, address contextAddress) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.FillError(enum LibExchangeRichErrors.FillErrorCodes,bytes32)"></a><code class="function-signature">FillError(enum LibExchangeRichErrors.FillErrorCodes errorCode, bytes32 orderHash) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.OrderEpochError(address,address,uint256)"></a><code class="function-signature">OrderEpochError(address makerAddress, address orderSenderAddress, uint256 currentEpoch) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.AssetProxyExistsError(bytes4,address)"></a><code class="function-signature">AssetProxyExistsError(bytes4 assetProxyId, address assetProxyAddress) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.AssetProxyDispatchError(enum LibExchangeRichErrors.AssetProxyDispatchErrorCodes,bytes32,bytes)"></a><code class="function-signature">AssetProxyDispatchError(enum LibExchangeRichErrors.AssetProxyDispatchErrorCodes errorCode, bytes32 orderHash, bytes assetData) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.AssetProxyTransferError(bytes32,bytes,bytes)"></a><code class="function-signature">AssetProxyTransferError(bytes32 orderHash, bytes assetData, bytes errorData) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.NegativeSpreadError(bytes32,bytes32)"></a><code class="function-signature">NegativeSpreadError(bytes32 leftOrderHash, bytes32 rightOrderHash) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.TransactionError(enum LibExchangeRichErrors.TransactionErrorCodes,bytes32)"></a><code class="function-signature">TransactionError(enum LibExchangeRichErrors.TransactionErrorCodes errorCode, bytes32 transactionHash) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.TransactionExecutionError(bytes32,bytes)"></a><code class="function-signature">TransactionExecutionError(bytes32 transactionHash, bytes errorData) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.TransactionGasPriceError(bytes32,uint256,uint256)"></a><code class="function-signature">TransactionGasPriceError(bytes32 transactionHash, uint256 actualGasPrice, uint256 requiredGasPrice) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.TransactionInvalidContextError(bytes32,address)"></a><code class="function-signature">TransactionInvalidContextError(bytes32 transactionHash, address currentContextAddress) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.IncompleteFillError(enum LibExchangeRichErrors.IncompleteFillErrorCode,uint256,uint256)"></a><code class="function-signature">IncompleteFillError(enum LibExchangeRichErrors.IncompleteFillErrorCode errorCode, uint256 expectedAssetFillAmount, uint256 actualAssetFillAmount) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibExchangeRichErrors.PayProtocolFeeError(bytes32,uint256,address,address,bytes)"></a><code class="function-signature">PayProtocolFeeError(bytes32 orderHash, uint256 protocolFee, address makerAddress, address takerAddress, bytes errorData) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>







### `LibFillResults`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibFillResults.calculateFillResults(struct LibOrder.Order,uint256,uint256,uint256)"><code class="function-signature">calculateFillResults(struct LibOrder.Order order, uint256 takerAssetFilledAmount, uint256 protocolFeeMultiplier, uint256 gasPrice)</code></a></li><li><a href="#LibFillResults.calculateMatchedFillResults(struct LibOrder.Order,struct LibOrder.Order,uint256,uint256,uint256,uint256,bool)"><code class="function-signature">calculateMatchedFillResults(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, uint256 leftOrderTakerAssetFilledAmount, uint256 rightOrderTakerAssetFilledAmount, uint256 protocolFeeMultiplier, uint256 gasPrice, bool shouldMaximallyFillOrders)</code></a></li><li><a href="#LibFillResults.addFillResults(struct LibFillResults.FillResults,struct LibFillResults.FillResults)"><code class="function-signature">addFillResults(struct LibFillResults.FillResults fillResults1, struct LibFillResults.FillResults fillResults2)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibFillResults.calculateFillResults(struct LibOrder.Order,uint256,uint256,uint256)"></a><code class="function-signature">calculateFillResults(struct LibOrder.Order order, uint256 takerAssetFilledAmount, uint256 protocolFeeMultiplier, uint256 gasPrice) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">internal</span></h4>

Calculates amounts filled and fees paid by maker and taker.
 @param order to be filled.
 @param takerAssetFilledAmount Amount of takerAsset that will be filled.
 @param protocolFeeMultiplier The current protocol fee of the exchange contract.
 @param gasPrice The gasprice of the transaction. This is provided so that the function call can continue
        to be pure rather than view.
 @return fillResults Amounts filled and fees paid by maker and taker.



<h4><a class="anchor" aria-hidden="true" id="LibFillResults.calculateMatchedFillResults(struct LibOrder.Order,struct LibOrder.Order,uint256,uint256,uint256,uint256,bool)"></a><code class="function-signature">calculateMatchedFillResults(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, uint256 leftOrderTakerAssetFilledAmount, uint256 rightOrderTakerAssetFilledAmount, uint256 protocolFeeMultiplier, uint256 gasPrice, bool shouldMaximallyFillOrders) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.MatchedFillResults</span></code><span class="function-visibility">internal</span></h4>

Calculates fill amounts for the matched orders.
      Each order is filled at their respective price point. However, the calculations are
      carried out as though the orders are both being filled at the right order&#x27;s price point.
      The profit made by the leftOrder order goes to the taker (who matched the two orders).
 @param leftOrder First order to match.
 @param rightOrder Second order to match.
 @param leftOrderTakerAssetFilledAmount Amount of left order already filled.
 @param rightOrderTakerAssetFilledAmount Amount of right order already filled.
 @param protocolFeeMultiplier The current protocol fee of the exchange contract.
 @param gasPrice The gasprice of the transaction. This is provided so that the function call can continue
        to be pure rather than view.
 @param shouldMaximallyFillOrders A value that indicates whether or not this calculation should use
                                  the maximal fill order matching strategy.
 @param matchedFillResults Amounts to fill and fees to pay by maker and taker of matched orders.



<h4><a class="anchor" aria-hidden="true" id="LibFillResults.addFillResults(struct LibFillResults.FillResults,struct LibFillResults.FillResults)"></a><code class="function-signature">addFillResults(struct LibFillResults.FillResults fillResults1, struct LibFillResults.FillResults fillResults2) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">internal</span></h4>

Adds properties of both FillResults instances.
 @param fillResults1 The first FillResults.
 @param fillResults2 The second FillResults.
 @return The sum of both fill results.





### `LibMath`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibMath.safeGetPartialAmountFloor(uint256,uint256,uint256)"><code class="function-signature">safeGetPartialAmountFloor(uint256 numerator, uint256 denominator, uint256 target)</code></a></li><li><a href="#LibMath.safeGetPartialAmountCeil(uint256,uint256,uint256)"><code class="function-signature">safeGetPartialAmountCeil(uint256 numerator, uint256 denominator, uint256 target)</code></a></li><li><a href="#LibMath.getPartialAmountFloor(uint256,uint256,uint256)"><code class="function-signature">getPartialAmountFloor(uint256 numerator, uint256 denominator, uint256 target)</code></a></li><li><a href="#LibMath.getPartialAmountCeil(uint256,uint256,uint256)"><code class="function-signature">getPartialAmountCeil(uint256 numerator, uint256 denominator, uint256 target)</code></a></li><li><a href="#LibMath.isRoundingErrorFloor(uint256,uint256,uint256)"><code class="function-signature">isRoundingErrorFloor(uint256 numerator, uint256 denominator, uint256 target)</code></a></li><li><a href="#LibMath.isRoundingErrorCeil(uint256,uint256,uint256)"><code class="function-signature">isRoundingErrorCeil(uint256 numerator, uint256 denominator, uint256 target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibMath.safeGetPartialAmountFloor(uint256,uint256,uint256)"></a><code class="function-signature">safeGetPartialAmountFloor(uint256 numerator, uint256 denominator, uint256 target) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Calculates partial value given a numerator and denominator rounded down.
      Reverts if rounding error is &gt;= 0.1%
 @param numerator Numerator.
 @param denominator Denominator.
 @param target Value to calculate partial of.
 @return Partial value of target rounded down.



<h4><a class="anchor" aria-hidden="true" id="LibMath.safeGetPartialAmountCeil(uint256,uint256,uint256)"></a><code class="function-signature">safeGetPartialAmountCeil(uint256 numerator, uint256 denominator, uint256 target) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Calculates partial value given a numerator and denominator rounded down.
      Reverts if rounding error is &gt;= 0.1%
 @param numerator Numerator.
 @param denominator Denominator.
 @param target Value to calculate partial of.
 @return Partial value of target rounded up.



<h4><a class="anchor" aria-hidden="true" id="LibMath.getPartialAmountFloor(uint256,uint256,uint256)"></a><code class="function-signature">getPartialAmountFloor(uint256 numerator, uint256 denominator, uint256 target) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Calculates partial value given a numerator and denominator rounded down.
 @param numerator Numerator.
 @param denominator Denominator.
 @param target Value to calculate partial of.
 @return Partial value of target rounded down.



<h4><a class="anchor" aria-hidden="true" id="LibMath.getPartialAmountCeil(uint256,uint256,uint256)"></a><code class="function-signature">getPartialAmountCeil(uint256 numerator, uint256 denominator, uint256 target) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Calculates partial value given a numerator and denominator rounded down.
 @param numerator Numerator.
 @param denominator Denominator.
 @param target Value to calculate partial of.
 @return Partial value of target rounded up.



<h4><a class="anchor" aria-hidden="true" id="LibMath.isRoundingErrorFloor(uint256,uint256,uint256)"></a><code class="function-signature">isRoundingErrorFloor(uint256 numerator, uint256 denominator, uint256 target) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Checks if rounding error &gt;= 0.1% when rounding down.
 @param numerator Numerator.
 @param denominator Denominator.
 @param target Value to multiply with numerator/denominator.
 @return Rounding error is present.



<h4><a class="anchor" aria-hidden="true" id="LibMath.isRoundingErrorCeil(uint256,uint256,uint256)"></a><code class="function-signature">isRoundingErrorCeil(uint256 numerator, uint256 denominator, uint256 target) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Checks if rounding error &gt;= 0.1% when rounding up.
 @param numerator Numerator.
 @param denominator Denominator.
 @param target Value to multiply with numerator/denominator.
 @return Rounding error is present.





### `LibMathRichErrors`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibMathRichErrors.DivisionByZeroError()"><code class="function-signature">DivisionByZeroError()</code></a></li><li><a href="#LibMathRichErrors.RoundingError(uint256,uint256,uint256)"><code class="function-signature">RoundingError(uint256 numerator, uint256 denominator, uint256 target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibMathRichErrors.DivisionByZeroError()"></a><code class="function-signature">DivisionByZeroError() <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibMathRichErrors.RoundingError(uint256,uint256,uint256)"></a><code class="function-signature">RoundingError(uint256 numerator, uint256 denominator, uint256 target) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>







### `LibOrder`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibOrder.getTypedDataHash(struct LibOrder.Order,bytes32)"><code class="function-signature">getTypedDataHash(struct LibOrder.Order order, bytes32 eip712ExchangeDomainHash)</code></a></li><li><a href="#LibOrder.getStructHash(struct LibOrder.Order)"><code class="function-signature">getStructHash(struct LibOrder.Order order)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibOrder.getTypedDataHash(struct LibOrder.Order,bytes32)"></a><code class="function-signature">getTypedDataHash(struct LibOrder.Order order, bytes32 eip712ExchangeDomainHash) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>

Calculates the EIP712 typed data hash of an order with a given domain separator.
 @param order The order structure.
 @return EIP712 typed data hash of the order.



<h4><a class="anchor" aria-hidden="true" id="LibOrder.getStructHash(struct LibOrder.Order)"></a><code class="function-signature">getStructHash(struct LibOrder.Order order) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>

Calculates EIP712 hash of the order struct.
 @param order The order structure.
 @return EIP712 hash of the order struct.





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







### `LibZeroExTransaction`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibZeroExTransaction.getTypedDataHash(struct LibZeroExTransaction.ZeroExTransaction,bytes32)"><code class="function-signature">getTypedDataHash(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 eip712ExchangeDomainHash)</code></a></li><li><a href="#LibZeroExTransaction.getStructHash(struct LibZeroExTransaction.ZeroExTransaction)"><code class="function-signature">getStructHash(struct LibZeroExTransaction.ZeroExTransaction transaction)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibZeroExTransaction.getTypedDataHash(struct LibZeroExTransaction.ZeroExTransaction,bytes32)"></a><code class="function-signature">getTypedDataHash(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 eip712ExchangeDomainHash) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>

Calculates the EIP712 typed data hash of a transaction with a given domain separator.
 @param transaction 0x transaction structure.
 @return EIP712 typed data hash of the transaction.



<h4><a class="anchor" aria-hidden="true" id="LibZeroExTransaction.getStructHash(struct LibZeroExTransaction.ZeroExTransaction)"></a><code class="function-signature">getStructHash(struct LibZeroExTransaction.ZeroExTransaction transaction) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>

Calculates EIP712 hash of the 0x transaction struct.
 @param transaction 0x transaction structure.
 @return EIP712 hash of the transaction struct.





### `OrderTransferSimulationUtils`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#OrderTransferSimulationUtils.constructor(address)"><code class="function-signature">constructor(address _exchange)</code></a></li><li><a href="#OrderTransferSimulationUtils.getSimulatedOrderMakerTransferResults(struct LibOrder.Order,address,uint256)"><code class="function-signature">getSimulatedOrderMakerTransferResults(struct LibOrder.Order order, address takerAddress, uint256 takerAssetFillAmount)</code></a></li><li><a href="#OrderTransferSimulationUtils.getSimulatedOrderTransferResults(struct LibOrder.Order,address,uint256)"><code class="function-signature">getSimulatedOrderTransferResults(struct LibOrder.Order order, address takerAddress, uint256 takerAssetFillAmount)</code></a></li><li><a href="#OrderTransferSimulationUtils.getSimulatedOrdersTransferResults(struct LibOrder.Order[],address[],uint256[])"><code class="function-signature">getSimulatedOrdersTransferResults(struct LibOrder.Order[] orders, address[] takerAddresses, uint256[] takerAssetFillAmounts)</code></a></li><li><a href="#OrderTransferSimulationUtils._simulateTransferFromCalls(bytes[],address[],address[],uint256[])"><code class="function-signature">_simulateTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeSignatureError(bytes)"><code class="function-signature">decodeSignatureError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeEIP1271SignatureError(bytes)"><code class="function-signature">decodeEIP1271SignatureError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeSignatureValidatorNotApprovedError(bytes)"><code class="function-signature">decodeSignatureValidatorNotApprovedError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeSignatureWalletError(bytes)"><code class="function-signature">decodeSignatureWalletError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeOrderStatusError(bytes)"><code class="function-signature">decodeOrderStatusError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeExchangeInvalidContextError(bytes)"><code class="function-signature">decodeExchangeInvalidContextError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeFillError(bytes)"><code class="function-signature">decodeFillError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeOrderEpochError(bytes)"><code class="function-signature">decodeOrderEpochError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeAssetProxyExistsError(bytes)"><code class="function-signature">decodeAssetProxyExistsError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeAssetProxyDispatchError(bytes)"><code class="function-signature">decodeAssetProxyDispatchError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeAssetProxyTransferError(bytes)"><code class="function-signature">decodeAssetProxyTransferError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeNegativeSpreadError(bytes)"><code class="function-signature">decodeNegativeSpreadError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeTransactionError(bytes)"><code class="function-signature">decodeTransactionError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeTransactionExecutionError(bytes)"><code class="function-signature">decodeTransactionExecutionError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeIncompleteFillError(bytes)"><code class="function-signature">decodeIncompleteFillError(bytes encoded)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="OrderTransferSimulationUtils.constructor(address)"></a><code class="function-signature">constructor(address _exchange)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OrderTransferSimulationUtils.getSimulatedOrderMakerTransferResults(struct LibOrder.Order,address,uint256)"></a><code class="function-signature">getSimulatedOrderMakerTransferResults(struct LibOrder.Order order, address takerAddress, uint256 takerAssetFillAmount) <span class="return-arrow">→</span> <span class="return-type">enum OrderTransferSimulationUtils.OrderTransferResults</span></code><span class="function-visibility">public</span></h4>

Simulates the maker transfers within an order and returns the index of the first failed transfer.
 @param order The order to simulate transfers for.
 @param takerAddress The address of the taker that will fill the order.
 @param takerAssetFillAmount The amount of takerAsset that the taker wished to fill.
 @return The index of the first failed transfer (or 4 if all transfers are successful).



<h4><a class="anchor" aria-hidden="true" id="OrderTransferSimulationUtils.getSimulatedOrderTransferResults(struct LibOrder.Order,address,uint256)"></a><code class="function-signature">getSimulatedOrderTransferResults(struct LibOrder.Order order, address takerAddress, uint256 takerAssetFillAmount) <span class="return-arrow">→</span> <span class="return-type">enum OrderTransferSimulationUtils.OrderTransferResults</span></code><span class="function-visibility">public</span></h4>

Simulates all of the transfers within an order and returns the index of the first failed transfer.
 @param order The order to simulate transfers for.
 @param takerAddress The address of the taker that will fill the order.
 @param takerAssetFillAmount The amount of takerAsset that the taker wished to fill.
 @return The index of the first failed transfer (or 4 if all transfers are successful).



<h4><a class="anchor" aria-hidden="true" id="OrderTransferSimulationUtils.getSimulatedOrdersTransferResults(struct LibOrder.Order[],address[],uint256[])"></a><code class="function-signature">getSimulatedOrdersTransferResults(struct LibOrder.Order[] orders, address[] takerAddresses, uint256[] takerAssetFillAmounts) <span class="return-arrow">→</span> <span class="return-type">enum OrderTransferSimulationUtils.OrderTransferResults[]</span></code><span class="function-visibility">public</span></h4>

Simulates all of the transfers for each given order and returns the indices of each first failed transfer.
 @param orders Array of orders to individually simulate transfers for.
 @param takerAddresses Array of addresses of takers that will fill each order.
 @param takerAssetFillAmounts Array of amounts of takerAsset that will be filled for each order.
 @return The indices of the first failed transfer (or 4 if all transfers are successful) for each order.



<h4><a class="anchor" aria-hidden="true" id="OrderTransferSimulationUtils._simulateTransferFromCalls(bytes[],address[],address[],uint256[])"></a><code class="function-signature">_simulateTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts) <span class="return-arrow">→</span> <span class="return-type">enum OrderTransferSimulationUtils.OrderTransferResults</span></code><span class="function-visibility">internal</span></h4>

Makes the simulation call with information about the transfers and processes
      the returndata.
 @param assetData The assetdata to use to make transfers.
 @param fromAddresses The addresses to transfer funds.
 @param toAddresses The addresses that will receive funds
 @param amounts The amounts involved in the transfer.





### `OrderValidationUtils`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#OrderValidationUtils.constructor(address,address)"><code class="function-signature">constructor(address _exchange, address _chaiBridge)</code></a></li><li><a href="#OrderValidationUtils.getOrderRelevantState(struct LibOrder.Order,bytes)"><code class="function-signature">getOrderRelevantState(struct LibOrder.Order order, bytes signature)</code></a></li><li><a href="#OrderValidationUtils.getOrderRelevantStates(struct LibOrder.Order[],bytes[])"><code class="function-signature">getOrderRelevantStates(struct LibOrder.Order[] orders, bytes[] signatures)</code></a></li><li><a href="#OrderValidationUtils.getTransferableAssetAmount(address,bytes)"><code class="function-signature">getTransferableAssetAmount(address ownerAddress, bytes assetData)</code></a></li><li><a href="#OrderValidationUtils._isAssetDataValid(bytes)"><code class="function-signature">_isAssetDataValid(bytes assetData)</code></a></li><li><a href="#OrderValidationUtils._isAssetDataDuplicated(bytes[],uint256)"><code class="function-signature">_isAssetDataDuplicated(bytes[] nestedAssetData, uint256 startIdx)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils.constructor(address)"><code class="function-signature">constructor(address _exchange)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils.getSimulatedOrderMakerTransferResults(struct LibOrder.Order,address,uint256)"><code class="function-signature">getSimulatedOrderMakerTransferResults(struct LibOrder.Order order, address takerAddress, uint256 takerAssetFillAmount)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils.getSimulatedOrderTransferResults(struct LibOrder.Order,address,uint256)"><code class="function-signature">getSimulatedOrderTransferResults(struct LibOrder.Order order, address takerAddress, uint256 takerAssetFillAmount)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils.getSimulatedOrdersTransferResults(struct LibOrder.Order[],address[],uint256[])"><code class="function-signature">getSimulatedOrdersTransferResults(struct LibOrder.Order[] orders, address[] takerAddresses, uint256[] takerAssetFillAmounts)</code></a></li><li class="inherited"><a href="src#OrderTransferSimulationUtils._simulateTransferFromCalls(bytes[],address[],address[],uint256[])"><code class="function-signature">_simulateTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeSignatureError(bytes)"><code class="function-signature">decodeSignatureError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeEIP1271SignatureError(bytes)"><code class="function-signature">decodeEIP1271SignatureError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeSignatureValidatorNotApprovedError(bytes)"><code class="function-signature">decodeSignatureValidatorNotApprovedError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeSignatureWalletError(bytes)"><code class="function-signature">decodeSignatureWalletError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeOrderStatusError(bytes)"><code class="function-signature">decodeOrderStatusError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeExchangeInvalidContextError(bytes)"><code class="function-signature">decodeExchangeInvalidContextError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeFillError(bytes)"><code class="function-signature">decodeFillError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeOrderEpochError(bytes)"><code class="function-signature">decodeOrderEpochError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeAssetProxyExistsError(bytes)"><code class="function-signature">decodeAssetProxyExistsError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeAssetProxyDispatchError(bytes)"><code class="function-signature">decodeAssetProxyDispatchError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeAssetProxyTransferError(bytes)"><code class="function-signature">decodeAssetProxyTransferError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeNegativeSpreadError(bytes)"><code class="function-signature">decodeNegativeSpreadError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeTransactionError(bytes)"><code class="function-signature">decodeTransactionError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeTransactionExecutionError(bytes)"><code class="function-signature">decodeTransactionExecutionError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibExchangeRichErrorDecoder.decodeIncompleteFillError(bytes)"><code class="function-signature">decodeIncompleteFillError(bytes encoded)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBalance(address,bytes)"><code class="function-signature">getBalance(address ownerAddress, bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBatchBalances(address,bytes[])"><code class="function-signature">getBatchBalances(address ownerAddress, bytes[] assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getAssetProxyAllowance(address,bytes)"><code class="function-signature">getAssetProxyAllowance(address ownerAddress, bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBatchAssetProxyAllowances(address,bytes[])"><code class="function-signature">getBatchAssetProxyAllowances(address ownerAddress, bytes[] assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBalanceAndAssetProxyAllowance(address,bytes)"><code class="function-signature">getBalanceAndAssetProxyAllowance(address ownerAddress, bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.getBatchBalancesAndAssetProxyAllowances(address,bytes[])"><code class="function-signature">getBatchBalancesAndAssetProxyAllowances(address ownerAddress, bytes[] assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeAssetProxyId(bytes)"><code class="function-signature">decodeAssetProxyId(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeERC20AssetData(address)"><code class="function-signature">encodeERC20AssetData(address tokenAddress)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeERC20AssetData(bytes)"><code class="function-signature">decodeERC20AssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeERC721AssetData(address,uint256)"><code class="function-signature">encodeERC721AssetData(address tokenAddress, uint256 tokenId)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeERC721AssetData(bytes)"><code class="function-signature">decodeERC721AssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeERC1155AssetData(address,uint256[],uint256[],bytes)"><code class="function-signature">encodeERC1155AssetData(address tokenAddress, uint256[] tokenIds, uint256[] tokenValues, bytes callbackData)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeERC1155AssetData(bytes)"><code class="function-signature">decodeERC1155AssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeMultiAssetData(uint256[],bytes[])"><code class="function-signature">encodeMultiAssetData(uint256[] amounts, bytes[] nestedAssetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeMultiAssetData(bytes)"><code class="function-signature">decodeMultiAssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.encodeStaticCallAssetData(address,bytes,bytes32)"><code class="function-signature">encodeStaticCallAssetData(address staticCallTargetAddress, bytes staticCallData, bytes32 expectedReturnDataHash)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeStaticCallAssetData(bytes)"><code class="function-signature">decodeStaticCallAssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.decodeERC20BridgeAssetData(bytes)"><code class="function-signature">decodeERC20BridgeAssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData.revertIfInvalidAssetData(bytes)"><code class="function-signature">revertIfInvalidAssetData(bytes assetData)</code></a></li><li class="inherited"><a href="src#LibAssetData._erc20BalanceOf(address,address)"><code class="function-signature">_erc20BalanceOf(address tokenAddress, address ownerAddress)</code></a></li><li class="inherited"><a href="src#LibAssetData._convertChaiToDaiAmount(uint256)"><code class="function-signature">_convertChaiToDaiAmount(uint256 chaiAmount)</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getKyberNetworkProxyAddress()"><code class="function-signature">_getKyberNetworkProxyAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getWethAddress()"><code class="function-signature">_getWethAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getUniswapExchangeFactoryAddress()"><code class="function-signature">_getUniswapExchangeFactoryAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getEth2DaiAddress()"><code class="function-signature">_getEth2DaiAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getERC20BridgeProxyAddress()"><code class="function-signature">_getERC20BridgeProxyAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getDaiAddress()"><code class="function-signature">_getDaiAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getChaiAddress()"><code class="function-signature">_getChaiAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getDevUtilsAddress()"><code class="function-signature">_getDevUtilsAddress()</code></a></li><li class="inherited"><a href="src#DeploymentConstants._getDydxAddress()"><code class="function-signature">_getDydxAddress()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="OrderValidationUtils.constructor(address,address)"></a><code class="function-signature">constructor(address _exchange, address _chaiBridge)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="OrderValidationUtils.getOrderRelevantState(struct LibOrder.Order,bytes)"></a><code class="function-signature">getOrderRelevantState(struct LibOrder.Order order, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct LibOrder.OrderInfo,uint256,bool</span></code><span class="function-visibility">public</span></h4>

Fetches all order-relevant information needed to validate if the supplied order is fillable.
 @param order The order structure.
 @param signature Signature provided by maker that proves the order&#x27;s authenticity.
 `0x01` can always be provided if the signature does not need to be validated.
 @return The orderInfo (hash, status, and `takerAssetAmount` already filled for the given order),
 fillableTakerAssetAmount (amount of the order&#x27;s `takerAssetAmount` that is fillable given all on-chain state),
 and isValidSignature (validity of the provided signature).
 NOTE: If the `takerAssetData` encodes data for multiple assets, `fillableTakerAssetAmount` will represent a &quot;scaled&quot;
 amount, meaning it must be multiplied by all the individual asset amounts within the `takerAssetData` to get the final
 amount of each asset that can be filled.



<h4><a class="anchor" aria-hidden="true" id="OrderValidationUtils.getOrderRelevantStates(struct LibOrder.Order[],bytes[])"></a><code class="function-signature">getOrderRelevantStates(struct LibOrder.Order[] orders, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibOrder.OrderInfo[],uint256[],bool[]</span></code><span class="function-visibility">public</span></h4>

Fetches all order-relevant information needed to validate if the supplied orders are fillable.
 @param orders Array of order structures.
 @param signatures Array of signatures provided by makers that prove the authenticity of the orders.
 `0x01` can always be provided if a signature does not need to be validated.
 @return The ordersInfo (array of the hash, status, and `takerAssetAmount` already filled for each order),
 fillableTakerAssetAmounts (array of amounts for each order&#x27;s `takerAssetAmount` that is fillable given all on-chain state),
 and isValidSignature (array containing the validity of each provided signature).
 NOTE: If the `takerAssetData` encodes data for multiple assets, each element of `fillableTakerAssetAmounts`
 will represent a &quot;scaled&quot; amount, meaning it must be multiplied by all the individual asset amounts within
 the `takerAssetData` to get the final amount of each asset that can be filled.



<h4><a class="anchor" aria-hidden="true" id="OrderValidationUtils.getTransferableAssetAmount(address,bytes)"></a><code class="function-signature">getTransferableAssetAmount(address ownerAddress, bytes assetData) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

Gets the amount of an asset transferable by the owner.
 @param ownerAddress Address of the owner of the asset.
 @param assetData Description of tokens, per the AssetProxy contract specification.
 @return The amount of the asset tranferable by the owner.
 NOTE: If the `assetData` encodes data for multiple assets, the `transferableAssetAmount`
 will represent the amount of times the entire `assetData` can be transferred. To calculate
 the total individual transferable amounts, this scaled `transferableAmount` must be multiplied by
 the individual asset amounts located within the `assetData`.



<h4><a class="anchor" aria-hidden="true" id="OrderValidationUtils._isAssetDataValid(bytes)"></a><code class="function-signature">_isAssetDataValid(bytes assetData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

This function handles the edge cases around taker validation. This function
      currently attempts to find duplicate ERC721 token&#x27;s in the taker
      multiAssetData.
 @param assetData The asset data that should be validated.
 @return Whether or not the order should be considered valid.



<h4><a class="anchor" aria-hidden="true" id="OrderValidationUtils._isAssetDataDuplicated(bytes[],uint256)"></a><code class="function-signature">_isAssetDataDuplicated(bytes[] nestedAssetData, uint256 startIdx) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `PotLike`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#PotLike.chi()"><code class="function-signature">chi()</code></a></li><li><a href="#PotLike.rho()"><code class="function-signature">rho()</code></a></li><li><a href="#PotLike.drip()"><code class="function-signature">drip()</code></a></li><li><a href="#PotLike.join(uint256)"><code class="function-signature">join(uint256)</code></a></li><li><a href="#PotLike.exit(uint256)"><code class="function-signature">exit(uint256)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="PotLike.chi()"></a><code class="function-signature">chi() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PotLike.rho()"></a><code class="function-signature">rho() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PotLike.drip()"></a><code class="function-signature">drip() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PotLike.join(uint256)"></a><code class="function-signature">join(uint256)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="PotLike.exit(uint256)"></a><code class="function-signature">exit(uint256)</code><span class="function-visibility">external</span></h4>







</div>