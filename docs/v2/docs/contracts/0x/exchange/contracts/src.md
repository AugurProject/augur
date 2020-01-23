---
title: Src
---

<div class="contracts">

## Contracts

### `Exchange`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Exchange.constructor(uint256)"><code class="function-signature">constructor(uint256 chainId)</code></a></li><li><a href="#Exchange.isValidSignature(struct LibOrder.Order,bytes32,bytes)"><code class="function-signature">isValidSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransferSimulator.simulateDispatchTransferFromCalls(bytes[],address[],address[],uint256[])"><code class="function-signature">simulateDispatchTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions.fillOrKillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrKillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions.batchFillOrders(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions.batchFillOrKillOrders(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrKillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions.batchFillOrdersNoThrow(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrdersNoThrow(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions.marketSellOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketSellOrdersNoThrow(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions.marketBuyOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketBuyOrdersNoThrow(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions.marketSellOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketSellOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions.marketBuyOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketBuyOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions.batchCancelOrders(struct LibOrder.Order[])"><code class="function-signature">batchCancelOrders(struct LibOrder.Order[] orders)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions._fillOrKillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">_fillOrKillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinWrapperFunctions._fillOrderNoThrow(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">_fillOrderNoThrow(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinMatchOrders.batchMatchOrders(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"><code class="function-signature">batchMatchOrders(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures)</code></a></li><li class="inherited"><a href="src#MixinMatchOrders.batchMatchOrdersWithMaximalFill(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"><code class="function-signature">batchMatchOrdersWithMaximalFill(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures)</code></a></li><li class="inherited"><a href="src#MixinMatchOrders.matchOrders(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"><code class="function-signature">matchOrders(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature)</code></a></li><li class="inherited"><a href="src#MixinMatchOrders.matchOrdersWithMaximalFill(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"><code class="function-signature">matchOrdersWithMaximalFill(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature)</code></a></li><li class="inherited"><a href="src#MixinMatchOrders._assertValidMatch(struct LibOrder.Order,struct LibOrder.Order,bytes32,bytes32)"><code class="function-signature">_assertValidMatch(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes32 leftOrderHash, bytes32 rightOrderHash)</code></a></li><li class="inherited"><a href="src#MixinMatchOrders._batchMatchOrders(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[],bool)"><code class="function-signature">_batchMatchOrders(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures, bool shouldMaximallyFillOrders)</code></a></li><li class="inherited"><a href="src#MixinMatchOrders._matchOrders(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes,bool)"><code class="function-signature">_matchOrders(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature, bool shouldMaximallyFillOrders)</code></a></li><li class="inherited"><a href="src#MixinMatchOrders._settleMatchedOrders(bytes32,bytes32,struct LibOrder.Order,struct LibOrder.Order,address,struct LibFillResults.MatchedFillResults)"><code class="function-signature">_settleMatchedOrders(bytes32 leftOrderHash, bytes32 rightOrderHash, struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, address takerAddress, struct LibFillResults.MatchedFillResults matchedFillResults)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.cancelOrdersUpTo(uint256)"><code class="function-signature">cancelOrdersUpTo(uint256 targetOrderEpoch)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.cancelOrder(struct LibOrder.Order)"><code class="function-signature">cancelOrder(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.getOrderInfo(struct LibOrder.Order)"><code class="function-signature">getOrderInfo(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">_fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._cancelOrder(struct LibOrder.Order)"><code class="function-signature">_cancelOrder(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._updateFilledState(struct LibOrder.Order,address,bytes32,uint256,struct LibFillResults.FillResults)"><code class="function-signature">_updateFilledState(struct LibOrder.Order order, address takerAddress, bytes32 orderHash, uint256 orderTakerAssetFilledAmount, struct LibFillResults.FillResults fillResults)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._updateCancelledState(struct LibOrder.Order,bytes32)"><code class="function-signature">_updateCancelledState(struct LibOrder.Order order, bytes32 orderHash)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._assertFillableOrder(struct LibOrder.Order,struct LibOrder.OrderInfo,address,bytes)"><code class="function-signature">_assertFillableOrder(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo, address takerAddress, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._assertValidCancel(struct LibOrder.Order,struct LibOrder.OrderInfo)"><code class="function-signature">_assertValidCancel(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._settleOrder(bytes32,struct LibOrder.Order,address,struct LibFillResults.FillResults)"><code class="function-signature">_settleOrder(bytes32 orderHash, struct LibOrder.Order order, address takerAddress, struct LibFillResults.FillResults fillResults)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._getOrderHashAndFilledAmount(struct LibOrder.Order)"><code class="function-signature">_getOrderHashAndFilledAmount(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.preSign(bytes32)"><code class="function-signature">preSign(bytes32 hash)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.setSignatureValidatorApproval(address,bool)"><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidHashSignature(bytes32,address,bytes)"><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinTransactions._executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">_executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions._assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes,bytes32)"><code class="function-signature">_assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature, bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#MixinTransactions._setCurrentContextAddressIfRequired(address,address)"><code class="function-signature">_setCurrentContextAddressIfRequired(address signerAddress, address contextAddress)</code></a></li><li class="inherited"><a href="src#MixinTransactions._getCurrentContextAddress()"><code class="function-signature">_getCurrentContextAddress()</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.setProtocolFeeMultiplier(uint256)"><code class="function-signature">setProtocolFeeMultiplier(uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.setProtocolFeeCollectorAddress(address)"><code class="function-signature">setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.detachProtocolFeeCollector()"><code class="function-signature">detachProtocolFeeCollector()</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._setProtocolFeeCollectorAddress(address)"><code class="function-signature">_setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._paySingleProtocolFee(bytes32,uint256,address,address)"><code class="function-signature">_paySingleProtocolFee(bytes32 orderHash, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._payTwoProtocolFees(bytes32,bytes32,uint256,address,address,address)"><code class="function-signature">_payTwoProtocolFees(bytes32 orderHash1, bytes32 orderHash2, uint256 protocolFee, address makerAddress1, address makerAddress2, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._payProtocolFeeToFeeCollector(bytes32,address,uint256,uint256,address,address)"><code class="function-signature">_payProtocolFeeToFeeCollector(bytes32 orderHash, address feeCollector, uint256 exchangeBalance, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher._dispatchTransferFrom(bytes32,bytes,address,address,uint256)"><code class="function-signature">_dispatchTransferFrom(bytes32 orderHash, bytes assetData, address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="src#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalanceIfEnabled()"><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalance()"><code class="function-signature">_refundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._disableRefund()"><code class="function-signature">_disableRefund()</code></a></li><li class="inherited"><a href="src#Refundable._enableAndRefundNonZeroBalance()"><code class="function-signature">_enableAndRefundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._areRefundsDisabled()"><code class="function-signature">_areRefundsDisabled()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li><li class="inherited"><a href="src#Ownable._assertSenderIsOwner()"><code class="function-signature">_assertSenderIsOwner()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeMultiplier()"><code class="function-signature">protocolFeeMultiplier()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeCollector()"><code class="function-signature">protocolFeeCollector()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#ITransactions.TransactionExecution(bytes32)"><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.SignatureValidatorApproval(address,address,bool)"><code class="function-signature">SignatureValidatorApproval(address signerAddress, address validatorAddress, bool isApproved)</code></a></li><li class="inherited"><a href="src#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeMultiplier(uint256,uint256)"><code class="function-signature">ProtocolFeeMultiplier(uint256 oldProtocolFeeMultiplier, uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeCollectorAddress(address,address)"><code class="function-signature">ProtocolFeeCollectorAddress(address oldProtocolFeeCollector, address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Fill(address,address,bytes,bytes,bytes,bytes,bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">Fill(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, bytes makerFeeAssetData, bytes takerFeeAssetData, bytes32 orderHash, address takerAddress, address senderAddress, uint256 makerAssetFilledAmount, uint256 takerAssetFilledAmount, uint256 makerFeePaid, uint256 takerFeePaid, uint256 protocolFeePaid)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Cancel(address,address,bytes,bytes,address,bytes32)"><code class="function-signature">Cancel(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, address senderAddress, bytes32 orderHash)</code></a></li><li class="inherited"><a href="src#IExchangeCore.CancelUpTo(address,address,uint256)"><code class="function-signature">CancelUpTo(address makerAddress, address orderSenderAddress, uint256 orderEpoch)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Exchange.constructor(uint256)"></a><code class="function-signature">constructor(uint256 chainId)</code><span class="function-visibility">public</span></h4>

Mixins are instantiated in the order they are inherited
 @param chainId Chain ID of the network this contract is deployed on.



<h4><a class="anchor" aria-hidden="true" id="Exchange.isValidSignature(struct LibOrder.Order,bytes32,bytes)"></a><code class="function-signature">isValidSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







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





### `IEIP1271Data`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IEIP1271Data.OrderWithHash(struct LibOrder.Order,bytes32)"><code class="function-signature">OrderWithHash(struct LibOrder.Order order, bytes32 orderHash)</code></a></li><li><a href="#IEIP1271Data.ZeroExTransactionWithHash(struct LibZeroExTransaction.ZeroExTransaction,bytes32)"><code class="function-signature">ZeroExTransactionWithHash(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IEIP1271Data.OrderWithHash(struct LibOrder.Order,bytes32)"></a><code class="function-signature">OrderWithHash(struct LibOrder.Order order, bytes32 orderHash)</code><span class="function-visibility">external</span></h4>

This function&#x27;s selector is used when ABI encoding the order
      and hash into a byte array before calling `isValidSignature`.
      This function serves no other purpose.



<h4><a class="anchor" aria-hidden="true" id="IEIP1271Data.ZeroExTransactionWithHash(struct LibZeroExTransaction.ZeroExTransaction,bytes32)"></a><code class="function-signature">ZeroExTransactionWithHash(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash)</code><span class="function-visibility">external</span></h4>

This function&#x27;s selector is used when ABI encoding the transaction
      and hash into a byte array before calling `isValidSignature`.
      This function serves no other purpose.





### `IEIP1271Wallet`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IEIP1271Wallet.isValidSignature(bytes,bytes)"><code class="function-signature">isValidSignature(bytes data, bytes signature)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IEIP1271Wallet.isValidSignature(bytes,bytes)"></a><code class="function-signature">isValidSignature(bytes data, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Verifies that a signature is valid.
 @param data Arbitrary signed data.
 @param signature Proof that data has been signed.
 @return magicValue bytes4(0x20c13b0b) if the signature check succeeds.





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





### `IEtherToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IEtherToken.deposit()"><code class="function-signature">deposit()</code></a></li><li><a href="#IEtherToken.withdraw(uint256)"><code class="function-signature">withdraw(uint256 amount)</code></a></li><li class="inherited"><a href="src#IERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _value)</code></a></li><li class="inherited"><a href="src#IERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="src#IERC20Token.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _value)</code></a></li><li class="inherited"><a href="src#IERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="src#IERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address _owner)</code></a></li><li class="inherited"><a href="src#IERC20Token.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="src#IERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address _owner, address _spender, uint256 _value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IEtherToken.deposit()"></a><code class="function-signature">deposit()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IEtherToken.withdraw(uint256)"></a><code class="function-signature">withdraw(uint256 amount)</code><span class="function-visibility">public</span></h4>







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





### `IOwnable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOwnable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address newOwner)</code><span class="function-visibility">public</span></h4>

Transfers ownership of the contract to a new address.
 @param newOwner The address that will become the owner.





<h4><a class="anchor" aria-hidden="true" id="IOwnable.OwnershipTransferred(address,address)"></a><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code><span class="function-visibility"></span></h4>

Emitted by Ownable when ownership is transferred.
 @param previousOwner The previous owner of the contract.
 @param newOwner The new owner of the contract.



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





### `IStaking`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IStaking.addExchangeAddress(address)"><code class="function-signature">addExchangeAddress(address addr)</code></a></li><li><a href="#IStaking.createStakingPool(uint32,bool)"><code class="function-signature">createStakingPool(uint32 operatorShare, bool addOperatorAsMaker)</code></a></li><li><a href="#IStaking.decreaseStakingPoolOperatorShare(bytes32,uint32)"><code class="function-signature">decreaseStakingPoolOperatorShare(bytes32 poolId, uint32 newOperatorShare)</code></a></li><li><a href="#IStaking.endEpoch()"><code class="function-signature">endEpoch()</code></a></li><li><a href="#IStaking.finalizePool(bytes32)"><code class="function-signature">finalizePool(bytes32 poolId)</code></a></li><li><a href="#IStaking.init()"><code class="function-signature">init()</code></a></li><li><a href="#IStaking.joinStakingPoolAsMaker(bytes32)"><code class="function-signature">joinStakingPoolAsMaker(bytes32 poolId)</code></a></li><li><a href="#IStaking.moveStake(struct IStructs.StakeInfo,struct IStructs.StakeInfo,uint256)"><code class="function-signature">moveStake(struct IStructs.StakeInfo from, struct IStructs.StakeInfo to, uint256 amount)</code></a></li><li><a href="#IStaking.payProtocolFee(address,address,uint256)"><code class="function-signature">payProtocolFee(address makerAddress, address payerAddress, uint256 protocolFee)</code></a></li><li><a href="#IStaking.removeExchangeAddress(address)"><code class="function-signature">removeExchangeAddress(address addr)</code></a></li><li><a href="#IStaking.setParams(uint256,uint32,uint256,uint32,uint32)"><code class="function-signature">setParams(uint256 _epochDurationInSeconds, uint32 _rewardDelegatedStakeWeight, uint256 _minimumPoolStake, uint32 _cobbDouglasAlphaNumerator, uint32 _cobbDouglasAlphaDenominator)</code></a></li><li><a href="#IStaking.stake(uint256)"><code class="function-signature">stake(uint256 amount)</code></a></li><li><a href="#IStaking.unstake(uint256)"><code class="function-signature">unstake(uint256 amount)</code></a></li><li><a href="#IStaking.withdrawDelegatorRewards(bytes32)"><code class="function-signature">withdrawDelegatorRewards(bytes32 poolId)</code></a></li><li><a href="#IStaking.computeRewardBalanceOfDelegator(bytes32,address)"><code class="function-signature">computeRewardBalanceOfDelegator(bytes32 poolId, address member)</code></a></li><li><a href="#IStaking.computeRewardBalanceOfOperator(bytes32)"><code class="function-signature">computeRewardBalanceOfOperator(bytes32 poolId)</code></a></li><li><a href="#IStaking.getCurrentEpochEarliestEndTimeInSeconds()"><code class="function-signature">getCurrentEpochEarliestEndTimeInSeconds()</code></a></li><li><a href="#IStaking.getGlobalStakeByStatus(enum IStructs.StakeStatus)"><code class="function-signature">getGlobalStakeByStatus(enum IStructs.StakeStatus stakeStatus)</code></a></li><li><a href="#IStaking.getOwnerStakeByStatus(address,enum IStructs.StakeStatus)"><code class="function-signature">getOwnerStakeByStatus(address staker, enum IStructs.StakeStatus stakeStatus)</code></a></li><li><a href="#IStaking.getParams()"><code class="function-signature">getParams()</code></a></li><li><a href="#IStaking.getStakeDelegatedToPoolByOwner(address,bytes32)"><code class="function-signature">getStakeDelegatedToPoolByOwner(address staker, bytes32 poolId)</code></a></li><li><a href="#IStaking.getStakingPool(bytes32)"><code class="function-signature">getStakingPool(bytes32 poolId)</code></a></li><li><a href="#IStaking.getStakingPoolStatsThisEpoch(bytes32)"><code class="function-signature">getStakingPoolStatsThisEpoch(bytes32 poolId)</code></a></li><li><a href="#IStaking.getTotalStakeDelegatedToPool(bytes32)"><code class="function-signature">getTotalStakeDelegatedToPool(bytes32 poolId)</code></a></li><li><a href="#IStaking.getWethContract()"><code class="function-signature">getWethContract()</code></a></li><li><a href="#IStaking.getZrxVault()"><code class="function-signature">getZrxVault()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IStaking.addExchangeAddress(address)"></a><code class="function-signature">addExchangeAddress(address addr)</code><span class="function-visibility">external</span></h4>

Adds a new exchange address
 @param addr Address of exchange contract to add



<h4><a class="anchor" aria-hidden="true" id="IStaking.createStakingPool(uint32,bool)"></a><code class="function-signature">createStakingPool(uint32 operatorShare, bool addOperatorAsMaker) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>

Create a new staking pool. The sender will be the operator of this pool.
 Note that an operator must be payable.
 @param operatorShare Portion of rewards owned by the operator, in ppm.
 @param addOperatorAsMaker Adds operator to the created pool as a maker for convenience iff true.
 @return poolId The unique pool id generated for this pool.



<h4><a class="anchor" aria-hidden="true" id="IStaking.decreaseStakingPoolOperatorShare(bytes32,uint32)"></a><code class="function-signature">decreaseStakingPoolOperatorShare(bytes32 poolId, uint32 newOperatorShare)</code><span class="function-visibility">external</span></h4>

Decreases the operator share for the given pool (i.e. increases pool rewards for members).
 @param poolId Unique Id of pool.
 @param newOperatorShare The newly decreased percentage of any rewards owned by the operator.



<h4><a class="anchor" aria-hidden="true" id="IStaking.endEpoch()"></a><code class="function-signature">endEpoch() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Begins a new epoch, preparing the prior one for finalization.
      Throws if not enough time has passed between epochs or if the
      previous epoch was not fully finalized.
 @return numPoolsToFinalize The number of unfinalized pools.



<h4><a class="anchor" aria-hidden="true" id="IStaking.finalizePool(bytes32)"></a><code class="function-signature">finalizePool(bytes32 poolId)</code><span class="function-visibility">external</span></h4>

Instantly finalizes a single pool that earned rewards in the previous
      epoch, crediting it rewards for members and withdrawing operator&#x27;s
      rewards as WETH. This can be called by internal functions that need
      to finalize a pool immediately. Does nothing if the pool is already
      finalized or did not earn rewards in the previous epoch.
 @param poolId The pool ID to finalize.



<h4><a class="anchor" aria-hidden="true" id="IStaking.init()"></a><code class="function-signature">init()</code><span class="function-visibility">external</span></h4>

Initialize storage owned by this contract.
      This function should not be called directly.
      The StakingProxy contract will call it in `attachStakingContract()`.



<h4><a class="anchor" aria-hidden="true" id="IStaking.joinStakingPoolAsMaker(bytes32)"></a><code class="function-signature">joinStakingPoolAsMaker(bytes32 poolId)</code><span class="function-visibility">external</span></h4>

Allows caller to join a staking pool as a maker.
 @param poolId Unique id of pool.



<h4><a class="anchor" aria-hidden="true" id="IStaking.moveStake(struct IStructs.StakeInfo,struct IStructs.StakeInfo,uint256)"></a><code class="function-signature">moveStake(struct IStructs.StakeInfo from, struct IStructs.StakeInfo to, uint256 amount)</code><span class="function-visibility">external</span></h4>

Moves stake between statuses: &#x27;undelegated&#x27; or &#x27;delegated&#x27;.
      Delegated stake can also be moved between pools.
      This change comes into effect next epoch.
 @param from status to move stake out of.
 @param to status to move stake into.
 @param amount of stake to move.



<h4><a class="anchor" aria-hidden="true" id="IStaking.payProtocolFee(address,address,uint256)"></a><code class="function-signature">payProtocolFee(address makerAddress, address payerAddress, uint256 protocolFee)</code><span class="function-visibility">external</span></h4>

Pays a protocol fee in ETH.
 @param makerAddress The address of the order&#x27;s maker.
 @param payerAddress The address that is responsible for paying the protocol fee.
 @param protocolFee The amount of protocol fees that should be paid.



<h4><a class="anchor" aria-hidden="true" id="IStaking.removeExchangeAddress(address)"></a><code class="function-signature">removeExchangeAddress(address addr)</code><span class="function-visibility">external</span></h4>

Removes an existing exchange address
 @param addr Address of exchange contract to remove



<h4><a class="anchor" aria-hidden="true" id="IStaking.setParams(uint256,uint32,uint256,uint32,uint32)"></a><code class="function-signature">setParams(uint256 _epochDurationInSeconds, uint32 _rewardDelegatedStakeWeight, uint256 _minimumPoolStake, uint32 _cobbDouglasAlphaNumerator, uint32 _cobbDouglasAlphaDenominator)</code><span class="function-visibility">external</span></h4>

Set all configurable parameters at once.
 @param _epochDurationInSeconds Minimum seconds between epochs.
 @param _rewardDelegatedStakeWeight How much delegated stake is weighted vs operator stake, in ppm.
 @param _minimumPoolStake Minimum amount of stake required in a pool to collect rewards.
 @param _cobbDouglasAlphaNumerator Numerator for cobb douglas alpha factor.
 @param _cobbDouglasAlphaDenominator Denominator for cobb douglas alpha factor.



<h4><a class="anchor" aria-hidden="true" id="IStaking.stake(uint256)"></a><code class="function-signature">stake(uint256 amount)</code><span class="function-visibility">external</span></h4>

Stake ZRX tokens. Tokens are deposited into the ZRX Vault.
      Unstake to retrieve the ZRX. Stake is in the &#x27;Active&#x27; status.
 @param amount of ZRX to stake.



<h4><a class="anchor" aria-hidden="true" id="IStaking.unstake(uint256)"></a><code class="function-signature">unstake(uint256 amount)</code><span class="function-visibility">external</span></h4>

Unstake. Tokens are withdrawn from the ZRX Vault and returned to
      the staker. Stake must be in the &#x27;undelegated&#x27; status in both the
      current and next epoch in order to be unstaked.
 @param amount of ZRX to unstake.



<h4><a class="anchor" aria-hidden="true" id="IStaking.withdrawDelegatorRewards(bytes32)"></a><code class="function-signature">withdrawDelegatorRewards(bytes32 poolId)</code><span class="function-visibility">external</span></h4>

Withdraws the caller&#x27;s WETH rewards that have accumulated
      until the last epoch.
 @param poolId Unique id of pool.



<h4><a class="anchor" aria-hidden="true" id="IStaking.computeRewardBalanceOfDelegator(bytes32,address)"></a><code class="function-signature">computeRewardBalanceOfDelegator(bytes32 poolId, address member) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Computes the reward balance in ETH of a specific member of a pool.
 @param poolId Unique id of pool.
 @param member The member of the pool.
 @return totalReward Balance in ETH.



<h4><a class="anchor" aria-hidden="true" id="IStaking.computeRewardBalanceOfOperator(bytes32)"></a><code class="function-signature">computeRewardBalanceOfOperator(bytes32 poolId) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Computes the reward balance in ETH of the operator of a pool.
 @param poolId Unique id of pool.
 @return totalReward Balance in ETH.



<h4><a class="anchor" aria-hidden="true" id="IStaking.getCurrentEpochEarliestEndTimeInSeconds()"></a><code class="function-signature">getCurrentEpochEarliestEndTimeInSeconds() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns the earliest end time in seconds of this epoch.
      The next epoch can begin once this time is reached.
      Epoch period = [startTimeInSeconds..endTimeInSeconds)
 @return Time in seconds.



<h4><a class="anchor" aria-hidden="true" id="IStaking.getGlobalStakeByStatus(enum IStructs.StakeStatus)"></a><code class="function-signature">getGlobalStakeByStatus(enum IStructs.StakeStatus stakeStatus) <span class="return-arrow">→</span> <span class="return-type">struct IStructs.StoredBalance</span></code><span class="function-visibility">external</span></h4>

Gets global stake for a given status.
 @param stakeStatus UNDELEGATED or DELEGATED
 @return Global stake for given status.



<h4><a class="anchor" aria-hidden="true" id="IStaking.getOwnerStakeByStatus(address,enum IStructs.StakeStatus)"></a><code class="function-signature">getOwnerStakeByStatus(address staker, enum IStructs.StakeStatus stakeStatus) <span class="return-arrow">→</span> <span class="return-type">struct IStructs.StoredBalance</span></code><span class="function-visibility">external</span></h4>

Gets an owner&#x27;s stake balances by status.
 @param staker Owner of stake.
 @param stakeStatus UNDELEGATED or DELEGATED
 @return Owner&#x27;s stake balances for given status.



<h4><a class="anchor" aria-hidden="true" id="IStaking.getParams()"></a><code class="function-signature">getParams() <span class="return-arrow">→</span> <span class="return-type">uint256,uint32,uint256,uint32,uint32</span></code><span class="function-visibility">external</span></h4>

Retrieves all configurable parameter values.
 @return _epochDurationInSeconds Minimum seconds between epochs.
 @return _rewardDelegatedStakeWeight How much delegated stake is weighted vs operator stake, in ppm.
 @return _minimumPoolStake Minimum amount of stake required in a pool to collect rewards.
 @return _cobbDouglasAlphaNumerator Numerator for cobb douglas alpha factor.
 @return _cobbDouglasAlphaDenominator Denominator for cobb douglas alpha factor.



<h4><a class="anchor" aria-hidden="true" id="IStaking.getStakeDelegatedToPoolByOwner(address,bytes32)"></a><code class="function-signature">getStakeDelegatedToPoolByOwner(address staker, bytes32 poolId) <span class="return-arrow">→</span> <span class="return-type">struct IStructs.StoredBalance</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStaking.getStakingPool(bytes32)"></a><code class="function-signature">getStakingPool(bytes32 poolId) <span class="return-arrow">→</span> <span class="return-type">struct IStructs.Pool</span></code><span class="function-visibility">external</span></h4>

Returns a staking pool
 @param poolId Unique id of pool.



<h4><a class="anchor" aria-hidden="true" id="IStaking.getStakingPoolStatsThisEpoch(bytes32)"></a><code class="function-signature">getStakingPoolStatsThisEpoch(bytes32 poolId) <span class="return-arrow">→</span> <span class="return-type">struct IStructs.PoolStats</span></code><span class="function-visibility">external</span></h4>

Get stats on a staking pool in this epoch.
 @param poolId Pool Id to query.
 @return PoolStats struct for pool id.



<h4><a class="anchor" aria-hidden="true" id="IStaking.getTotalStakeDelegatedToPool(bytes32)"></a><code class="function-signature">getTotalStakeDelegatedToPool(bytes32 poolId) <span class="return-arrow">→</span> <span class="return-type">struct IStructs.StoredBalance</span></code><span class="function-visibility">external</span></h4>

Returns the total stake delegated to a specific staking pool,
      across all members.
 @param poolId Unique Id of pool.
 @return Total stake delegated to pool.



<h4><a class="anchor" aria-hidden="true" id="IStaking.getWethContract()"></a><code class="function-signature">getWethContract() <span class="return-arrow">→</span> <span class="return-type">contract IEtherToken</span></code><span class="function-visibility">external</span></h4>

An overridable way to access the deployed WETH contract.
      Must be view to allow overrides to access state.
 @return wethContract The WETH contract instance.



<h4><a class="anchor" aria-hidden="true" id="IStaking.getZrxVault()"></a><code class="function-signature">getZrxVault() <span class="return-arrow">→</span> <span class="return-type">contract IZrxVault</span></code><span class="function-visibility">external</span></h4>

An overridable way to access the deployed zrxVault.
      Must be view to allow overrides to access state.
 @return zrxVault The zrxVault contract.





### `IStructs`



<div class="contract-index"></div>





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
 @return Signer of 0x transaction if entry point is [`executeTransaction`](#ITransactions.executeTransaction(struct%20LibZeroExTransaction.ZeroExTransaction,bytes)).
         `msg.sender` if entry point is any other function.





<h4><a class="anchor" aria-hidden="true" id="ITransactions.TransactionExecution(bytes32)"></a><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code><span class="function-visibility"></span></h4>





### `IWallet`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IWallet.isValidSignature(bytes32,bytes)"><code class="function-signature">isValidSignature(bytes32 hash, bytes signature)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IWallet.isValidSignature(bytes32,bytes)"></a><code class="function-signature">isValidSignature(bytes32 hash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bytes4</span></code><span class="function-visibility">external</span></h4>

Validates a hash with the `Wallet` signature type.
 @param hash Message hash that is signed.
 @param signature Proof of signing.
 @return magicValue `bytes4(0xb0671381)` if the signature check succeeds.





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





### `IZrxVault`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IZrxVault.setStakingProxy(address)"><code class="function-signature">setStakingProxy(address _stakingProxyAddress)</code></a></li><li><a href="#IZrxVault.enterCatastrophicFailure()"><code class="function-signature">enterCatastrophicFailure()</code></a></li><li><a href="#IZrxVault.setZrxProxy(address)"><code class="function-signature">setZrxProxy(address zrxProxyAddress)</code></a></li><li><a href="#IZrxVault.depositFrom(address,uint256)"><code class="function-signature">depositFrom(address staker, uint256 amount)</code></a></li><li><a href="#IZrxVault.withdrawFrom(address,uint256)"><code class="function-signature">withdrawFrom(address staker, uint256 amount)</code></a></li><li><a href="#IZrxVault.withdrawAllFrom(address)"><code class="function-signature">withdrawAllFrom(address staker)</code></a></li><li><a href="#IZrxVault.balanceOf(address)"><code class="function-signature">balanceOf(address staker)</code></a></li><li><a href="#IZrxVault.balanceOfZrxVault()"><code class="function-signature">balanceOfZrxVault()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IZrxVault.StakingProxySet(address)"><code class="function-signature">StakingProxySet(address stakingProxyAddress)</code></a></li><li><a href="#IZrxVault.InCatastrophicFailureMode(address)"><code class="function-signature">InCatastrophicFailureMode(address sender)</code></a></li><li><a href="#IZrxVault.Deposit(address,uint256)"><code class="function-signature">Deposit(address staker, uint256 amount)</code></a></li><li><a href="#IZrxVault.Withdraw(address,uint256)"><code class="function-signature">Withdraw(address staker, uint256 amount)</code></a></li><li><a href="#IZrxVault.ZrxProxySet(address)"><code class="function-signature">ZrxProxySet(address zrxProxyAddress)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.setStakingProxy(address)"></a><code class="function-signature">setStakingProxy(address _stakingProxyAddress)</code><span class="function-visibility">external</span></h4>

Sets the address of the StakingProxy contract.
 Note that only the contract staker can call this function.
 @param _stakingProxyAddress Address of Staking proxy contract.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.enterCatastrophicFailure()"></a><code class="function-signature">enterCatastrophicFailure()</code><span class="function-visibility">external</span></h4>

Vault enters into Catastrophic Failure Mode.
 *** WARNING - ONCE IN CATOSTROPHIC FAILURE MODE, YOU CAN NEVER GO BACK! ***
 Note that only the contract staker can call this function.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.setZrxProxy(address)"></a><code class="function-signature">setZrxProxy(address zrxProxyAddress)</code><span class="function-visibility">external</span></h4>

Sets the Zrx proxy.
 Note that only the contract staker can call this.
 Note that this can only be called when *not* in Catastrophic Failure mode.
 @param zrxProxyAddress Address of the 0x Zrx Proxy.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.depositFrom(address,uint256)"></a><code class="function-signature">depositFrom(address staker, uint256 amount)</code><span class="function-visibility">external</span></h4>

Deposit an `amount` of Zrx Tokens from `staker` into the vault.
 Note that only the Staking contract can call this.
 Note that this can only be called when *not* in Catastrophic Failure mode.
 @param staker of Zrx Tokens.
 @param amount of Zrx Tokens to deposit.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.withdrawFrom(address,uint256)"></a><code class="function-signature">withdrawFrom(address staker, uint256 amount)</code><span class="function-visibility">external</span></h4>

Withdraw an `amount` of Zrx Tokens to `staker` from the vault.
 Note that only the Staking contract can call this.
 Note that this can only be called when *not* in Catastrophic Failure mode.
 @param staker of Zrx Tokens.
 @param amount of Zrx Tokens to withdraw.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.withdrawAllFrom(address)"></a><code class="function-signature">withdrawAllFrom(address staker) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Withdraw ALL Zrx Tokens to `staker` from the vault.
 Note that this can only be called when *in* Catastrophic Failure mode.
 @param staker of Zrx Tokens.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.balanceOf(address)"></a><code class="function-signature">balanceOf(address staker) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns the balance in Zrx Tokens of the `staker`
 @return Balance in Zrx.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.balanceOfZrxVault()"></a><code class="function-signature">balanceOfZrxVault() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>

Returns the entire balance of Zrx tokens in the vault.





<h4><a class="anchor" aria-hidden="true" id="IZrxVault.StakingProxySet(address)"></a><code class="function-signature">StakingProxySet(address stakingProxyAddress)</code><span class="function-visibility"></span></h4>

Emmitted whenever a StakingProxy is set in a vault.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.InCatastrophicFailureMode(address)"></a><code class="function-signature">InCatastrophicFailureMode(address sender)</code><span class="function-visibility"></span></h4>

Emitted when the Staking contract is put into Catastrophic Failure Mode
 @param sender Address of sender (`msg.sender`)



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.Deposit(address,uint256)"></a><code class="function-signature">Deposit(address staker, uint256 amount)</code><span class="function-visibility"></span></h4>

Emitted when Zrx Tokens are deposited into the vault.
 @param staker of Zrx Tokens.
 @param amount of Zrx Tokens deposited.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.Withdraw(address,uint256)"></a><code class="function-signature">Withdraw(address staker, uint256 amount)</code><span class="function-visibility"></span></h4>

Emitted when Zrx Tokens are withdrawn from the vault.
 @param staker of Zrx Tokens.
 @param amount of Zrx Tokens withdrawn.



<h4><a class="anchor" aria-hidden="true" id="IZrxVault.ZrxProxySet(address)"></a><code class="function-signature">ZrxProxySet(address zrxProxyAddress)</code><span class="function-visibility"></span></h4>

Emitted whenever the ZRX AssetProxy is set.



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





### `LibEIP1271`



<div class="contract-index"></div>





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





### `LibOwnableRichErrors`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibOwnableRichErrors.OnlyOwnerError(address,address)"><code class="function-signature">OnlyOwnerError(address sender, address owner)</code></a></li><li><a href="#LibOwnableRichErrors.TransferOwnerToZeroError()"><code class="function-signature">TransferOwnerToZeroError()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibOwnableRichErrors.OnlyOwnerError(address,address)"></a><code class="function-signature">OnlyOwnerError(address sender, address owner) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibOwnableRichErrors.TransferOwnerToZeroError()"></a><code class="function-signature">TransferOwnerToZeroError() <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>







### `LibReentrancyGuardRichErrors`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibReentrancyGuardRichErrors.IllegalReentrancyError()"><code class="function-signature">IllegalReentrancyError()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibReentrancyGuardRichErrors.IllegalReentrancyError()"></a><code class="function-signature">IllegalReentrancyError() <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>







### `LibRichErrors`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibRichErrors.StandardError(string)"><code class="function-signature">StandardError(string message)</code></a></li><li><a href="#LibRichErrors.rrevert(bytes)"><code class="function-signature">rrevert(bytes errorData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibRichErrors.StandardError(string)"></a><code class="function-signature">StandardError(string message) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>

ABI encode a standard, string revert error payload.
      This is the same payload that would be included by a `revert(string)`
      solidity statement. It has the function signature `Error(string)`.
 @param message The error string.
 @return The ABI encoded error.



<h4><a class="anchor" aria-hidden="true" id="LibRichErrors.rrevert(bytes)"></a><code class="function-signature">rrevert(bytes errorData)</code><span class="function-visibility">internal</span></h4>

Reverts an encoded rich revert reason `errorData`.
 @param errorData ABI encoded error data.





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





### `MixinAssetProxyDispatcher`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li><a href="#MixinAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li><li><a href="#MixinAssetProxyDispatcher._dispatchTransferFrom(bytes32,bytes,address,address,uint256)"><code class="function-signature">_dispatchTransferFrom(bytes32 orderHash, bytes assetData, address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li><li class="inherited"><a href="src#Ownable._assertSenderIsOwner()"><code class="function-signature">_assertSenderIsOwner()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinAssetProxyDispatcher.registerAssetProxy(address)"></a><code class="function-signature">registerAssetProxy(address assetProxy)</code><span class="function-visibility">external</span></h4>

Registers an asset proxy to its asset proxy id.
      Once an asset proxy is registered, it cannot be unregistered.
 @param assetProxy Address of new asset proxy to register.



<h4><a class="anchor" aria-hidden="true" id="MixinAssetProxyDispatcher.getAssetProxy(bytes4)"></a><code class="function-signature">getAssetProxy(bytes4 assetProxyId) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">external</span></h4>

Gets an asset proxy.
 @param assetProxyId Id of the asset proxy.
 @return assetProxy The asset proxy address registered to assetProxyId. Returns 0x0 if no proxy is registered.



<h4><a class="anchor" aria-hidden="true" id="MixinAssetProxyDispatcher._dispatchTransferFrom(bytes32,bytes,address,address,uint256)"></a><code class="function-signature">_dispatchTransferFrom(bytes32 orderHash, bytes assetData, address from, address to, uint256 amount)</code><span class="function-visibility">internal</span></h4>

Forwards arguments to assetProxy and calls `transferFrom`. Either succeeds or throws.
 @param orderHash Hash of the order associated with this transfer.
 @param assetData Byte array encoded for the asset.
 @param from Address to transfer token from.
 @param to Address to transfer token to.
 @param amount Amount of token to transfer.





### `MixinExchangeCore`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinExchangeCore.cancelOrdersUpTo(uint256)"><code class="function-signature">cancelOrdersUpTo(uint256 targetOrderEpoch)</code></a></li><li><a href="#MixinExchangeCore.fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li><a href="#MixinExchangeCore.cancelOrder(struct LibOrder.Order)"><code class="function-signature">cancelOrder(struct LibOrder.Order order)</code></a></li><li><a href="#MixinExchangeCore.getOrderInfo(struct LibOrder.Order)"><code class="function-signature">getOrderInfo(struct LibOrder.Order order)</code></a></li><li><a href="#MixinExchangeCore._fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">_fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li><a href="#MixinExchangeCore._cancelOrder(struct LibOrder.Order)"><code class="function-signature">_cancelOrder(struct LibOrder.Order order)</code></a></li><li><a href="#MixinExchangeCore._updateFilledState(struct LibOrder.Order,address,bytes32,uint256,struct LibFillResults.FillResults)"><code class="function-signature">_updateFilledState(struct LibOrder.Order order, address takerAddress, bytes32 orderHash, uint256 orderTakerAssetFilledAmount, struct LibFillResults.FillResults fillResults)</code></a></li><li><a href="#MixinExchangeCore._updateCancelledState(struct LibOrder.Order,bytes32)"><code class="function-signature">_updateCancelledState(struct LibOrder.Order order, bytes32 orderHash)</code></a></li><li><a href="#MixinExchangeCore._assertFillableOrder(struct LibOrder.Order,struct LibOrder.OrderInfo,address,bytes)"><code class="function-signature">_assertFillableOrder(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo, address takerAddress, bytes signature)</code></a></li><li><a href="#MixinExchangeCore._assertValidCancel(struct LibOrder.Order,struct LibOrder.OrderInfo)"><code class="function-signature">_assertValidCancel(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo)</code></a></li><li><a href="#MixinExchangeCore._settleOrder(bytes32,struct LibOrder.Order,address,struct LibFillResults.FillResults)"><code class="function-signature">_settleOrder(bytes32 orderHash, struct LibOrder.Order order, address takerAddress, struct LibFillResults.FillResults fillResults)</code></a></li><li><a href="#MixinExchangeCore._getOrderHashAndFilledAmount(struct LibOrder.Order)"><code class="function-signature">_getOrderHashAndFilledAmount(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.preSign(bytes32)"><code class="function-signature">preSign(bytes32 hash)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.setSignatureValidatorApproval(address,bool)"><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidHashSignature(bytes32,address,bytes)"><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinTransactions._executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">_executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions._assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes,bytes32)"><code class="function-signature">_assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature, bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#MixinTransactions._setCurrentContextAddressIfRequired(address,address)"><code class="function-signature">_setCurrentContextAddressIfRequired(address signerAddress, address contextAddress)</code></a></li><li class="inherited"><a href="src#MixinTransactions._getCurrentContextAddress()"><code class="function-signature">_getCurrentContextAddress()</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.setProtocolFeeMultiplier(uint256)"><code class="function-signature">setProtocolFeeMultiplier(uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.setProtocolFeeCollectorAddress(address)"><code class="function-signature">setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.detachProtocolFeeCollector()"><code class="function-signature">detachProtocolFeeCollector()</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._setProtocolFeeCollectorAddress(address)"><code class="function-signature">_setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._paySingleProtocolFee(bytes32,uint256,address,address)"><code class="function-signature">_paySingleProtocolFee(bytes32 orderHash, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._payTwoProtocolFees(bytes32,bytes32,uint256,address,address,address)"><code class="function-signature">_payTwoProtocolFees(bytes32 orderHash1, bytes32 orderHash2, uint256 protocolFee, address makerAddress1, address makerAddress2, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._payProtocolFeeToFeeCollector(bytes32,address,uint256,uint256,address,address)"><code class="function-signature">_payProtocolFeeToFeeCollector(bytes32 orderHash, address feeCollector, uint256 exchangeBalance, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher._dispatchTransferFrom(bytes32,bytes,address,address,uint256)"><code class="function-signature">_dispatchTransferFrom(bytes32 orderHash, bytes assetData, address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="src#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalanceIfEnabled()"><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalance()"><code class="function-signature">_refundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._disableRefund()"><code class="function-signature">_disableRefund()</code></a></li><li class="inherited"><a href="src#Refundable._enableAndRefundNonZeroBalance()"><code class="function-signature">_enableAndRefundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._areRefundsDisabled()"><code class="function-signature">_areRefundsDisabled()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li><li class="inherited"><a href="src#Ownable._assertSenderIsOwner()"><code class="function-signature">_assertSenderIsOwner()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeMultiplier()"><code class="function-signature">protocolFeeMultiplier()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeCollector()"><code class="function-signature">protocolFeeCollector()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#ITransactions.TransactionExecution(bytes32)"><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.SignatureValidatorApproval(address,address,bool)"><code class="function-signature">SignatureValidatorApproval(address signerAddress, address validatorAddress, bool isApproved)</code></a></li><li class="inherited"><a href="src#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeMultiplier(uint256,uint256)"><code class="function-signature">ProtocolFeeMultiplier(uint256 oldProtocolFeeMultiplier, uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeCollectorAddress(address,address)"><code class="function-signature">ProtocolFeeCollectorAddress(address oldProtocolFeeCollector, address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Fill(address,address,bytes,bytes,bytes,bytes,bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">Fill(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, bytes makerFeeAssetData, bytes takerFeeAssetData, bytes32 orderHash, address takerAddress, address senderAddress, uint256 makerAssetFilledAmount, uint256 takerAssetFilledAmount, uint256 makerFeePaid, uint256 takerFeePaid, uint256 protocolFeePaid)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Cancel(address,address,bytes,bytes,address,bytes32)"><code class="function-signature">Cancel(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, address senderAddress, bytes32 orderHash)</code></a></li><li class="inherited"><a href="src#IExchangeCore.CancelUpTo(address,address,uint256)"><code class="function-signature">CancelUpTo(address makerAddress, address orderSenderAddress, uint256 orderEpoch)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore.cancelOrdersUpTo(uint256)"></a><code class="function-signature">cancelOrdersUpTo(uint256 targetOrderEpoch)</code><span class="function-visibility">external</span></h4>

Cancels all orders created by makerAddress with a salt less than or equal to the targetOrderEpoch
      and senderAddress equal to msg.sender (or null address if msg.sender == makerAddress).
 @param targetOrderEpoch Orders created with a salt less or equal to this value will be cancelled.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore.fillOrder(struct LibOrder.Order,uint256,bytes)"></a><code class="function-signature">fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Fills the input order.
 @param order Order struct containing order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signature Proof that order has been created by maker.
 @return fillResults Amounts filled and fees paid by maker and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore.cancelOrder(struct LibOrder.Order)"></a><code class="function-signature">cancelOrder(struct LibOrder.Order order)</code><span class="function-visibility">public</span></h4>

After calling, the order can not be filled anymore.
 @param order Order struct containing order specifications.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore.getOrderInfo(struct LibOrder.Order)"></a><code class="function-signature">getOrderInfo(struct LibOrder.Order order) <span class="return-arrow">→</span> <span class="return-type">struct LibOrder.OrderInfo</span></code><span class="function-visibility">public</span></h4>

Gets information about an order: status, hash, and amount filled.
 @param order Order to gather information on.
 @return orderInfo Information about the order and its state.
         See LibOrder.OrderInfo for a complete description.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore._fillOrder(struct LibOrder.Order,uint256,bytes)"></a><code class="function-signature">_fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">internal</span></h4>

Fills the input order.
 @param order Order struct containing order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signature Proof that order has been created by maker.
 @return fillResults Amounts filled and fees paid by maker and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore._cancelOrder(struct LibOrder.Order)"></a><code class="function-signature">_cancelOrder(struct LibOrder.Order order)</code><span class="function-visibility">internal</span></h4>

After calling, the order can not be filled anymore.
      Throws if order is invalid or sender does not have permission to cancel.
 @param order Order to cancel. Order must be OrderStatus.FILLABLE.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore._updateFilledState(struct LibOrder.Order,address,bytes32,uint256,struct LibFillResults.FillResults)"></a><code class="function-signature">_updateFilledState(struct LibOrder.Order order, address takerAddress, bytes32 orderHash, uint256 orderTakerAssetFilledAmount, struct LibFillResults.FillResults fillResults)</code><span class="function-visibility">internal</span></h4>

Updates state with results of a fill order.
 @param order that was filled.
 @param takerAddress Address of taker who filled the order.
 @param orderTakerAssetFilledAmount Amount of order already filled.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore._updateCancelledState(struct LibOrder.Order,bytes32)"></a><code class="function-signature">_updateCancelledState(struct LibOrder.Order order, bytes32 orderHash)</code><span class="function-visibility">internal</span></h4>

Updates state with results of cancelling an order.
      State is only updated if the order is currently fillable.
      Otherwise, updating state would have no effect.
 @param order that was cancelled.
 @param orderHash Hash of order that was cancelled.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore._assertFillableOrder(struct LibOrder.Order,struct LibOrder.OrderInfo,address,bytes)"></a><code class="function-signature">_assertFillableOrder(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo, address takerAddress, bytes signature)</code><span class="function-visibility">internal</span></h4>

Validates context for fillOrder. Succeeds or throws.
 @param order to be filled.
 @param orderInfo OrderStatus, orderHash, and amount already filled of order.
 @param takerAddress Address of order taker.
 @param signature Proof that the orders was created by its maker.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore._assertValidCancel(struct LibOrder.Order,struct LibOrder.OrderInfo)"></a><code class="function-signature">_assertValidCancel(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo)</code><span class="function-visibility">internal</span></h4>

Validates context for cancelOrder. Succeeds or throws.
 @param order to be cancelled.
 @param orderInfo OrderStatus, orderHash, and amount already filled of order.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore._settleOrder(bytes32,struct LibOrder.Order,address,struct LibFillResults.FillResults)"></a><code class="function-signature">_settleOrder(bytes32 orderHash, struct LibOrder.Order order, address takerAddress, struct LibFillResults.FillResults fillResults)</code><span class="function-visibility">internal</span></h4>

Settles an order by transferring assets between counterparties.
 @param orderHash The order hash.
 @param order Order struct containing order specifications.
 @param takerAddress Address selling takerAsset and buying makerAsset.
 @param fillResults Amounts to be filled and fees paid by maker and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinExchangeCore._getOrderHashAndFilledAmount(struct LibOrder.Order)"></a><code class="function-signature">_getOrderHashAndFilledAmount(struct LibOrder.Order order) <span class="return-arrow">→</span> <span class="return-type">bytes32,uint256</span></code><span class="function-visibility">internal</span></h4>

Gets the order&#x27;s hash and amount of takerAsset that has already been filled.
 @param order Order struct containing order specifications.
 @return The typed data hash and amount filled of the order.





### `MixinMatchOrders`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinMatchOrders.batchMatchOrders(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"><code class="function-signature">batchMatchOrders(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures)</code></a></li><li><a href="#MixinMatchOrders.batchMatchOrdersWithMaximalFill(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"><code class="function-signature">batchMatchOrdersWithMaximalFill(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures)</code></a></li><li><a href="#MixinMatchOrders.matchOrders(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"><code class="function-signature">matchOrders(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature)</code></a></li><li><a href="#MixinMatchOrders.matchOrdersWithMaximalFill(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"><code class="function-signature">matchOrdersWithMaximalFill(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature)</code></a></li><li><a href="#MixinMatchOrders._assertValidMatch(struct LibOrder.Order,struct LibOrder.Order,bytes32,bytes32)"><code class="function-signature">_assertValidMatch(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes32 leftOrderHash, bytes32 rightOrderHash)</code></a></li><li><a href="#MixinMatchOrders._batchMatchOrders(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[],bool)"><code class="function-signature">_batchMatchOrders(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures, bool shouldMaximallyFillOrders)</code></a></li><li><a href="#MixinMatchOrders._matchOrders(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes,bool)"><code class="function-signature">_matchOrders(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature, bool shouldMaximallyFillOrders)</code></a></li><li><a href="#MixinMatchOrders._settleMatchedOrders(bytes32,bytes32,struct LibOrder.Order,struct LibOrder.Order,address,struct LibFillResults.MatchedFillResults)"><code class="function-signature">_settleMatchedOrders(bytes32 leftOrderHash, bytes32 rightOrderHash, struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, address takerAddress, struct LibFillResults.MatchedFillResults matchedFillResults)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.cancelOrdersUpTo(uint256)"><code class="function-signature">cancelOrdersUpTo(uint256 targetOrderEpoch)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.cancelOrder(struct LibOrder.Order)"><code class="function-signature">cancelOrder(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.getOrderInfo(struct LibOrder.Order)"><code class="function-signature">getOrderInfo(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">_fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._cancelOrder(struct LibOrder.Order)"><code class="function-signature">_cancelOrder(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._updateFilledState(struct LibOrder.Order,address,bytes32,uint256,struct LibFillResults.FillResults)"><code class="function-signature">_updateFilledState(struct LibOrder.Order order, address takerAddress, bytes32 orderHash, uint256 orderTakerAssetFilledAmount, struct LibFillResults.FillResults fillResults)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._updateCancelledState(struct LibOrder.Order,bytes32)"><code class="function-signature">_updateCancelledState(struct LibOrder.Order order, bytes32 orderHash)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._assertFillableOrder(struct LibOrder.Order,struct LibOrder.OrderInfo,address,bytes)"><code class="function-signature">_assertFillableOrder(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo, address takerAddress, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._assertValidCancel(struct LibOrder.Order,struct LibOrder.OrderInfo)"><code class="function-signature">_assertValidCancel(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._settleOrder(bytes32,struct LibOrder.Order,address,struct LibFillResults.FillResults)"><code class="function-signature">_settleOrder(bytes32 orderHash, struct LibOrder.Order order, address takerAddress, struct LibFillResults.FillResults fillResults)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._getOrderHashAndFilledAmount(struct LibOrder.Order)"><code class="function-signature">_getOrderHashAndFilledAmount(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.preSign(bytes32)"><code class="function-signature">preSign(bytes32 hash)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.setSignatureValidatorApproval(address,bool)"><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidHashSignature(bytes32,address,bytes)"><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinTransactions._executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">_executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions._assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes,bytes32)"><code class="function-signature">_assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature, bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#MixinTransactions._setCurrentContextAddressIfRequired(address,address)"><code class="function-signature">_setCurrentContextAddressIfRequired(address signerAddress, address contextAddress)</code></a></li><li class="inherited"><a href="src#MixinTransactions._getCurrentContextAddress()"><code class="function-signature">_getCurrentContextAddress()</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.setProtocolFeeMultiplier(uint256)"><code class="function-signature">setProtocolFeeMultiplier(uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.setProtocolFeeCollectorAddress(address)"><code class="function-signature">setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.detachProtocolFeeCollector()"><code class="function-signature">detachProtocolFeeCollector()</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._setProtocolFeeCollectorAddress(address)"><code class="function-signature">_setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._paySingleProtocolFee(bytes32,uint256,address,address)"><code class="function-signature">_paySingleProtocolFee(bytes32 orderHash, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._payTwoProtocolFees(bytes32,bytes32,uint256,address,address,address)"><code class="function-signature">_payTwoProtocolFees(bytes32 orderHash1, bytes32 orderHash2, uint256 protocolFee, address makerAddress1, address makerAddress2, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._payProtocolFeeToFeeCollector(bytes32,address,uint256,uint256,address,address)"><code class="function-signature">_payProtocolFeeToFeeCollector(bytes32 orderHash, address feeCollector, uint256 exchangeBalance, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher._dispatchTransferFrom(bytes32,bytes,address,address,uint256)"><code class="function-signature">_dispatchTransferFrom(bytes32 orderHash, bytes assetData, address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="src#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalanceIfEnabled()"><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalance()"><code class="function-signature">_refundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._disableRefund()"><code class="function-signature">_disableRefund()</code></a></li><li class="inherited"><a href="src#Refundable._enableAndRefundNonZeroBalance()"><code class="function-signature">_enableAndRefundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._areRefundsDisabled()"><code class="function-signature">_areRefundsDisabled()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li><li class="inherited"><a href="src#Ownable._assertSenderIsOwner()"><code class="function-signature">_assertSenderIsOwner()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeMultiplier()"><code class="function-signature">protocolFeeMultiplier()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeCollector()"><code class="function-signature">protocolFeeCollector()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#ITransactions.TransactionExecution(bytes32)"><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.SignatureValidatorApproval(address,address,bool)"><code class="function-signature">SignatureValidatorApproval(address signerAddress, address validatorAddress, bool isApproved)</code></a></li><li class="inherited"><a href="src#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeMultiplier(uint256,uint256)"><code class="function-signature">ProtocolFeeMultiplier(uint256 oldProtocolFeeMultiplier, uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeCollectorAddress(address,address)"><code class="function-signature">ProtocolFeeCollectorAddress(address oldProtocolFeeCollector, address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Fill(address,address,bytes,bytes,bytes,bytes,bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">Fill(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, bytes makerFeeAssetData, bytes takerFeeAssetData, bytes32 orderHash, address takerAddress, address senderAddress, uint256 makerAssetFilledAmount, uint256 takerAssetFilledAmount, uint256 makerFeePaid, uint256 takerFeePaid, uint256 protocolFeePaid)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Cancel(address,address,bytes,bytes,address,bytes32)"><code class="function-signature">Cancel(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, address senderAddress, bytes32 orderHash)</code></a></li><li class="inherited"><a href="src#IExchangeCore.CancelUpTo(address,address,uint256)"><code class="function-signature">CancelUpTo(address makerAddress, address orderSenderAddress, uint256 orderEpoch)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinMatchOrders.batchMatchOrders(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"></a><code class="function-signature">batchMatchOrders(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.BatchMatchedFillResults</span></code><span class="function-visibility">public</span></h4>

Match complementary orders that have a profitable spread.
      Each order is filled at their respective price point, and
      the matcher receives a profit denominated in the left maker asset.
 @param leftOrders Set of orders with the same maker / taker asset.
 @param rightOrders Set of orders to match against `leftOrders`
 @param leftSignatures Proof that left orders were created by the left makers.
 @param rightSignatures Proof that right orders were created by the right makers.
 @return batchMatchedFillResults Amounts filled and profit generated.



<h4><a class="anchor" aria-hidden="true" id="MixinMatchOrders.batchMatchOrdersWithMaximalFill(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[])"></a><code class="function-signature">batchMatchOrdersWithMaximalFill(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.BatchMatchedFillResults</span></code><span class="function-visibility">public</span></h4>

Match complementary orders that have a profitable spread.
      Each order is maximally filled at their respective price point, and
      the matcher receives a profit denominated in either the left maker asset,
      right maker asset, or a combination of both.
 @param leftOrders Set of orders with the same maker / taker asset.
 @param rightOrders Set of orders to match against `leftOrders`
 @param leftSignatures Proof that left orders were created by the left makers.
 @param rightSignatures Proof that right orders were created by the right makers.
 @return batchMatchedFillResults Amounts filled and profit generated.



<h4><a class="anchor" aria-hidden="true" id="MixinMatchOrders.matchOrders(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"></a><code class="function-signature">matchOrders(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.MatchedFillResults</span></code><span class="function-visibility">public</span></h4>

Match two complementary orders that have a profitable spread.
      Each order is filled at their respective price point. However, the calculations are
      carried out as though the orders are both being filled at the right order&#x27;s price point.
      The profit made by the left order goes to the taker (who matched the two orders).
 @param leftOrder First order to match.
 @param rightOrder Second order to match.
 @param leftSignature Proof that order was created by the left maker.
 @param rightSignature Proof that order was created by the right maker.
 @return matchedFillResults Amounts filled and fees paid by maker and taker of matched orders.



<h4><a class="anchor" aria-hidden="true" id="MixinMatchOrders.matchOrdersWithMaximalFill(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes)"></a><code class="function-signature">matchOrdersWithMaximalFill(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.MatchedFillResults</span></code><span class="function-visibility">public</span></h4>

Match two complementary orders that have a profitable spread.
      Each order is maximally filled at their respective price point, and
      the matcher receives a profit denominated in either the left maker asset,
      right maker asset, or a combination of both.
 @param leftOrder First order to match.
 @param rightOrder Second order to match.
 @param leftSignature Proof that order was created by the left maker.
 @param rightSignature Proof that order was created by the right maker.
 @return matchedFillResults Amounts filled by maker and taker of matched orders.



<h4><a class="anchor" aria-hidden="true" id="MixinMatchOrders._assertValidMatch(struct LibOrder.Order,struct LibOrder.Order,bytes32,bytes32)"></a><code class="function-signature">_assertValidMatch(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes32 leftOrderHash, bytes32 rightOrderHash)</code><span class="function-visibility">internal</span></h4>

Validates context for matchOrders. Succeeds or throws.
 @param leftOrder First order to match.
 @param rightOrder Second order to match.
 @param leftOrderHash First matched order hash.
 @param rightOrderHash Second matched order hash.



<h4><a class="anchor" aria-hidden="true" id="MixinMatchOrders._batchMatchOrders(struct LibOrder.Order[],struct LibOrder.Order[],bytes[],bytes[],bool)"></a><code class="function-signature">_batchMatchOrders(struct LibOrder.Order[] leftOrders, struct LibOrder.Order[] rightOrders, bytes[] leftSignatures, bytes[] rightSignatures, bool shouldMaximallyFillOrders) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.BatchMatchedFillResults</span></code><span class="function-visibility">internal</span></h4>

Match complementary orders that have a profitable spread.
      Each order is filled at their respective price point, and
      the matcher receives a profit denominated in the left maker asset.
      This is the reentrant version of [`batchMatchOrders`](#MixinMatchOrders.batchMatchOrders(struct%20LibOrder.Order[],struct%20LibOrder.Order[],bytes[],bytes[])) and [`batchMatchOrdersWithMaximalFill`](#MixinMatchOrders.batchMatchOrdersWithMaximalFill(struct%20LibOrder.Order[],struct%20LibOrder.Order[],bytes[],bytes[])).
 @param leftOrders Set of orders with the same maker / taker asset.
 @param rightOrders Set of orders to match against `leftOrders`
 @param leftSignatures Proof that left orders were created by the left makers.
 @param rightSignatures Proof that right orders were created by the right makers.
 @param shouldMaximallyFillOrders A value that indicates whether or not the order matching
                        should be done with maximal fill.
 @return batchMatchedFillResults Amounts filled and profit generated.



<h4><a class="anchor" aria-hidden="true" id="MixinMatchOrders._matchOrders(struct LibOrder.Order,struct LibOrder.Order,bytes,bytes,bool)"></a><code class="function-signature">_matchOrders(struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, bytes leftSignature, bytes rightSignature, bool shouldMaximallyFillOrders) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.MatchedFillResults</span></code><span class="function-visibility">internal</span></h4>

Match two complementary orders that have a profitable spread.
      Each order is filled at their respective price point. However, the calculations are
      carried out as though the orders are both being filled at the right order&#x27;s price point.
      The profit made by the left order goes to the taker (who matched the two orders). This
      function is needed to allow for reentrant order matching (used by [`batchMatchOrders`](#MixinMatchOrders.batchMatchOrders(struct%20LibOrder.Order[],struct%20LibOrder.Order[],bytes[],bytes[])) and
      [`batchMatchOrdersWithMaximalFill`](#MixinMatchOrders.batchMatchOrdersWithMaximalFill(struct%20LibOrder.Order[],struct%20LibOrder.Order[],bytes[],bytes[]))).
 @param leftOrder First order to match.
 @param rightOrder Second order to match.
 @param leftSignature Proof that order was created by the left maker.
 @param rightSignature Proof that order was created by the right maker.
 @param shouldMaximallyFillOrders Indicates whether or not the maximal fill matching strategy should be used
 @return matchedFillResults Amounts filled and fees paid by maker and taker of matched orders.



<h4><a class="anchor" aria-hidden="true" id="MixinMatchOrders._settleMatchedOrders(bytes32,bytes32,struct LibOrder.Order,struct LibOrder.Order,address,struct LibFillResults.MatchedFillResults)"></a><code class="function-signature">_settleMatchedOrders(bytes32 leftOrderHash, bytes32 rightOrderHash, struct LibOrder.Order leftOrder, struct LibOrder.Order rightOrder, address takerAddress, struct LibFillResults.MatchedFillResults matchedFillResults)</code><span class="function-visibility">internal</span></h4>

Settles matched order by transferring appropriate funds between order makers, taker, and fee recipient.
 @param leftOrderHash First matched order hash.
 @param rightOrderHash Second matched order hash.
 @param leftOrder First matched order.
 @param rightOrder Second matched order.
 @param takerAddress Address that matched the orders. The taker receives the spread between orders as profit.
 @param matchedFillResults Struct holding amounts to transfer between makers, taker, and fee recipients.





### `MixinProtocolFees`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinProtocolFees.setProtocolFeeMultiplier(uint256)"><code class="function-signature">setProtocolFeeMultiplier(uint256 updatedProtocolFeeMultiplier)</code></a></li><li><a href="#MixinProtocolFees.setProtocolFeeCollectorAddress(address)"><code class="function-signature">setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li><a href="#MixinProtocolFees.detachProtocolFeeCollector()"><code class="function-signature">detachProtocolFeeCollector()</code></a></li><li><a href="#MixinProtocolFees._setProtocolFeeCollectorAddress(address)"><code class="function-signature">_setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li><a href="#MixinProtocolFees._paySingleProtocolFee(bytes32,uint256,address,address)"><code class="function-signature">_paySingleProtocolFee(bytes32 orderHash, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li><a href="#MixinProtocolFees._payTwoProtocolFees(bytes32,bytes32,uint256,address,address,address)"><code class="function-signature">_payTwoProtocolFees(bytes32 orderHash1, bytes32 orderHash2, uint256 protocolFee, address makerAddress1, address makerAddress2, address takerAddress)</code></a></li><li><a href="#MixinProtocolFees._payProtocolFeeToFeeCollector(bytes32,address,uint256,uint256,address,address)"><code class="function-signature">_payProtocolFeeToFeeCollector(bytes32 orderHash, address feeCollector, uint256 exchangeBalance, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li><li class="inherited"><a href="src#Ownable._assertSenderIsOwner()"><code class="function-signature">_assertSenderIsOwner()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeMultiplier()"><code class="function-signature">protocolFeeMultiplier()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeCollector()"><code class="function-signature">protocolFeeCollector()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeMultiplier(uint256,uint256)"><code class="function-signature">ProtocolFeeMultiplier(uint256 oldProtocolFeeMultiplier, uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeCollectorAddress(address,address)"><code class="function-signature">ProtocolFeeCollectorAddress(address oldProtocolFeeCollector, address updatedProtocolFeeCollector)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinProtocolFees.setProtocolFeeMultiplier(uint256)"></a><code class="function-signature">setProtocolFeeMultiplier(uint256 updatedProtocolFeeMultiplier)</code><span class="function-visibility">external</span></h4>

Allows the owner to update the protocol fee multiplier.
 @param updatedProtocolFeeMultiplier The updated protocol fee multiplier.



<h4><a class="anchor" aria-hidden="true" id="MixinProtocolFees.setProtocolFeeCollectorAddress(address)"></a><code class="function-signature">setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code><span class="function-visibility">external</span></h4>

Allows the owner to update the protocolFeeCollector address.
 @param updatedProtocolFeeCollector The updated protocolFeeCollector contract address.



<h4><a class="anchor" aria-hidden="true" id="MixinProtocolFees.detachProtocolFeeCollector()"></a><code class="function-signature">detachProtocolFeeCollector()</code><span class="function-visibility">external</span></h4>

Sets the protocolFeeCollector contract address to 0.
      Only callable by owner.



<h4><a class="anchor" aria-hidden="true" id="MixinProtocolFees._setProtocolFeeCollectorAddress(address)"></a><code class="function-signature">_setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code><span class="function-visibility">internal</span></h4>

Sets the protocolFeeCollector address and emits an event.
 @param updatedProtocolFeeCollector The updated protocolFeeCollector contract address.



<h4><a class="anchor" aria-hidden="true" id="MixinProtocolFees._paySingleProtocolFee(bytes32,uint256,address,address)"></a><code class="function-signature">_paySingleProtocolFee(bytes32 orderHash, uint256 protocolFee, address makerAddress, address takerAddress) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Pays a protocol fee for a single fill.
 @param orderHash Hash of the order being filled.
 @param protocolFee Value of the fee being paid (equal to protocolFeeMultiplier

tx.gasPrice).
 @param makerAddress Address of maker of order being filled.
 @param takerAddress Address filling order.



<h4><a class="anchor" aria-hidden="true" id="MixinProtocolFees._payTwoProtocolFees(bytes32,bytes32,uint256,address,address,address)"></a><code class="function-signature">_payTwoProtocolFees(bytes32 orderHash1, bytes32 orderHash2, uint256 protocolFee, address makerAddress1, address makerAddress2, address takerAddress) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Pays a protocol fee for two orders (used when settling functions in MixinMatchOrders)
 @param orderHash1 Hash of the first order being filled.
 @param orderHash2 Hash of the second order being filled.
 @param protocolFee Value of the fee being paid (equal to protocolFeeMultiplier

tx.gasPrice).
 @param makerAddress1 Address of maker of first order being filled.
 @param makerAddress2 Address of maker of second order being filled.
 @param takerAddress Address filling orders.



<h4><a class="anchor" aria-hidden="true" id="MixinProtocolFees._payProtocolFeeToFeeCollector(bytes32,address,uint256,uint256,address,address)"></a><code class="function-signature">_payProtocolFeeToFeeCollector(bytes32 orderHash, address feeCollector, uint256 exchangeBalance, uint256 protocolFee, address makerAddress, address takerAddress) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>

Pays a single protocol fee.
 @param orderHash Hash of the order being filled.
 @param feeCollector Address of protocolFeeCollector contract.
 @param exchangeBalance Assumed ETH balance of Exchange contract (in wei).
 @param protocolFee Value of the fee being paid (equal to protocolFeeMultiplier

tx.gasPrice).
 @param makerAddress Address of maker of order being filled.
 @param takerAddress Address filling order.





### `MixinSignatureValidator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinSignatureValidator.preSign(bytes32)"><code class="function-signature">preSign(bytes32 hash)</code></a></li><li><a href="#MixinSignatureValidator.setSignatureValidatorApproval(address,bool)"><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code></a></li><li><a href="#MixinSignatureValidator.isValidHashSignature(bytes32,address,bytes)"><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature)</code></a></li><li><a href="#MixinSignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature)</code></a></li><li><a href="#MixinSignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li><a href="#MixinSignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature)</code></a></li><li><a href="#MixinSignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinTransactions._executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">_executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions._assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes,bytes32)"><code class="function-signature">_assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature, bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#MixinTransactions._setCurrentContextAddressIfRequired(address,address)"><code class="function-signature">_setCurrentContextAddressIfRequired(address signerAddress, address contextAddress)</code></a></li><li class="inherited"><a href="src#MixinTransactions._getCurrentContextAddress()"><code class="function-signature">_getCurrentContextAddress()</code></a></li><li class="inherited"><a href="src#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalanceIfEnabled()"><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalance()"><code class="function-signature">_refundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._disableRefund()"><code class="function-signature">_disableRefund()</code></a></li><li class="inherited"><a href="src#Refundable._enableAndRefundNonZeroBalance()"><code class="function-signature">_enableAndRefundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._areRefundsDisabled()"><code class="function-signature">_areRefundsDisabled()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#ITransactions.TransactionExecution(bytes32)"><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.SignatureValidatorApproval(address,address,bool)"><code class="function-signature">SignatureValidatorApproval(address signerAddress, address validatorAddress, bool isApproved)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinSignatureValidator.preSign(bytes32)"></a><code class="function-signature">preSign(bytes32 hash)</code><span class="function-visibility">external</span></h4>

Approves a hash on-chain.
      After presigning a hash, the preSign signature type will become valid for that hash and signer.
 @param hash Any 32-byte hash.



<h4><a class="anchor" aria-hidden="true" id="MixinSignatureValidator.setSignatureValidatorApproval(address,bool)"></a><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code><span class="function-visibility">external</span></h4>

Approves/unnapproves a Validator contract to verify signatures on signer&#x27;s behalf
      using the `Validator` signature type.
 @param validatorAddress Address of Validator contract.
 @param approval Approval or disapproval of  Validator contract.



<h4><a class="anchor" aria-hidden="true" id="MixinSignatureValidator.isValidHashSignature(bytes32,address,bytes)"></a><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Verifies that a hash has been signed by the given signer.
 @param hash Any 32-byte hash.
 @param signerAddress Address that should have signed the given hash.
 @param signature Proof that the hash has been signed by signer.
 @return isValid `true` if the signature is valid for the given hash and signer.



<h4><a class="anchor" aria-hidden="true" id="MixinSignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"></a><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Verifies that a signature for an order is valid.
 @param order The order.
 @param signature Proof that the order has been signed by signer.
 @return isValid `true` if the signature is valid for the given order and signer.



<h4><a class="anchor" aria-hidden="true" id="MixinSignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"></a><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Verifies that a signature for a transaction is valid.
 @param transaction The transaction.
 @param signature Proof that the order has been signed by signer.
 @return isValid `true` if the signature is valid for the given transaction and signer.



<h4><a class="anchor" aria-hidden="true" id="MixinSignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"></a><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Verifies that an order, with provided order hash, has been signed
      by the given signer.
 @param order The order.
 @param orderHash The hash of the order.
 @param signature Proof that the hash has been signed by signer.
 @return isValid True if the signature is valid for the given order and signer.



<h4><a class="anchor" aria-hidden="true" id="MixinSignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"></a><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Verifies that a transaction, with provided order hash, has been signed
      by the given signer.
 @param transaction The transaction.
 @param transactionHash The hash of the transaction.
 @param signature Proof that the hash has been signed by signer.
 @return isValid True if the signature is valid for the given transaction and signer.





### `MixinTransactions`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinTransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li><a href="#MixinTransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures)</code></a></li><li><a href="#MixinTransactions._executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">_executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li><a href="#MixinTransactions._assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes,bytes32)"><code class="function-signature">_assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature, bytes32 transactionHash)</code></a></li><li><a href="#MixinTransactions._setCurrentContextAddressIfRequired(address,address)"><code class="function-signature">_setCurrentContextAddressIfRequired(address signerAddress, address contextAddress)</code></a></li><li><a href="#MixinTransactions._getCurrentContextAddress()"><code class="function-signature">_getCurrentContextAddress()</code></a></li><li class="inherited"><a href="src#ISignatureValidator.preSign(bytes32)"><code class="function-signature">preSign(bytes32 hash)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.setSignatureValidatorApproval(address,bool)"><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.isValidHashSignature(bytes32,address,bytes)"><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#ISignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature)</code></a></li><li class="inherited"><a href="src#ISignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature)</code></a></li><li class="inherited"><a href="src#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalanceIfEnabled()"><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalance()"><code class="function-signature">_refundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._disableRefund()"><code class="function-signature">_disableRefund()</code></a></li><li class="inherited"><a href="src#Refundable._enableAndRefundNonZeroBalance()"><code class="function-signature">_enableAndRefundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._areRefundsDisabled()"><code class="function-signature">_areRefundsDisabled()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#ITransactions.TransactionExecution(bytes32)"><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.SignatureValidatorApproval(address,address,bool)"><code class="function-signature">SignatureValidatorApproval(address signerAddress, address validatorAddress, bool isApproved)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinTransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"></a><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>

Executes an Exchange method call in the context of signer.
 @param transaction 0x transaction structure.
 @param signature Proof that transaction has been signed by signer.
 @return ABI encoded return data of the underlying Exchange function call.



<h4><a class="anchor" aria-hidden="true" id="MixinTransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"></a><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">bytes[]</span></code><span class="function-visibility">public</span></h4>

Executes a batch of Exchange method calls in the context of signer(s).
 @param transactions Array of 0x transaction structures.
 @param signatures Array of proofs that transactions have been signed by signer(s).
 @return returnData Array containing ABI encoded return data for each of the underlying Exchange function calls.



<h4><a class="anchor" aria-hidden="true" id="MixinTransactions._executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"></a><code class="function-signature">_executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>

Executes an Exchange method call in the context of signer.
 @param transaction 0x transaction structure.
 @param signature Proof that transaction has been signed by signer.
 @return ABI encoded return data of the underlying Exchange function call.



<h4><a class="anchor" aria-hidden="true" id="MixinTransactions._assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes,bytes32)"></a><code class="function-signature">_assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature, bytes32 transactionHash)</code><span class="function-visibility">internal</span></h4>

Validates context for executeTransaction. Succeeds or throws.
 @param transaction 0x transaction structure.
 @param signature Proof that transaction has been signed by signer.
 @param transactionHash EIP712 typed data hash of 0x transaction.



<h4><a class="anchor" aria-hidden="true" id="MixinTransactions._setCurrentContextAddressIfRequired(address,address)"></a><code class="function-signature">_setCurrentContextAddressIfRequired(address signerAddress, address contextAddress)</code><span class="function-visibility">internal</span></h4>

Sets the currentContextAddress if the current context is not msg.sender.
 @param signerAddress Address of the transaction signer.
 @param contextAddress The current context address.



<h4><a class="anchor" aria-hidden="true" id="MixinTransactions._getCurrentContextAddress()"></a><code class="function-signature">_getCurrentContextAddress() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">internal</span></h4>

The current function will be called in the context of this address (either 0x transaction signer or `msg.sender`).
      If calling a fill function, this address will represent the taker.
      If calling a cancel function, this address will represent the maker.
 @return Signer of 0x transaction if entry point is [`executeTransaction`](#MixinTransactions.executeTransaction(struct%20LibZeroExTransaction.ZeroExTransaction,bytes)).
         `msg.sender` if entry point is any other function.





### `MixinTransferSimulator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinTransferSimulator.simulateDispatchTransferFromCalls(bytes[],address[],address[],uint256[])"><code class="function-signature">simulateDispatchTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher._dispatchTransferFrom(bytes32,bytes,address,address,uint256)"><code class="function-signature">_dispatchTransferFrom(bytes32 orderHash, bytes assetData, address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li><li class="inherited"><a href="src#Ownable._assertSenderIsOwner()"><code class="function-signature">_assertSenderIsOwner()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinTransferSimulator.simulateDispatchTransferFromCalls(bytes[],address[],address[],uint256[])"></a><code class="function-signature">simulateDispatchTransferFromCalls(bytes[] assetData, address[] fromAddresses, address[] toAddresses, uint256[] amounts)</code><span class="function-visibility">public</span></h4>

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





### `MixinWrapperFunctions`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinWrapperFunctions.fillOrKillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrKillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li><a href="#MixinWrapperFunctions.batchFillOrders(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li><a href="#MixinWrapperFunctions.batchFillOrKillOrders(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrKillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li><a href="#MixinWrapperFunctions.batchFillOrdersNoThrow(struct LibOrder.Order[],uint256[],bytes[])"><code class="function-signature">batchFillOrdersNoThrow(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures)</code></a></li><li><a href="#MixinWrapperFunctions.marketSellOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketSellOrdersNoThrow(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures)</code></a></li><li><a href="#MixinWrapperFunctions.marketBuyOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketBuyOrdersNoThrow(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures)</code></a></li><li><a href="#MixinWrapperFunctions.marketSellOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketSellOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures)</code></a></li><li><a href="#MixinWrapperFunctions.marketBuyOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"><code class="function-signature">marketBuyOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures)</code></a></li><li><a href="#MixinWrapperFunctions.batchCancelOrders(struct LibOrder.Order[])"><code class="function-signature">batchCancelOrders(struct LibOrder.Order[] orders)</code></a></li><li><a href="#MixinWrapperFunctions._fillOrKillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">_fillOrKillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li><a href="#MixinWrapperFunctions._fillOrderNoThrow(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">_fillOrderNoThrow(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.cancelOrdersUpTo(uint256)"><code class="function-signature">cancelOrdersUpTo(uint256 targetOrderEpoch)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.cancelOrder(struct LibOrder.Order)"><code class="function-signature">cancelOrder(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore.getOrderInfo(struct LibOrder.Order)"><code class="function-signature">getOrderInfo(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._fillOrder(struct LibOrder.Order,uint256,bytes)"><code class="function-signature">_fillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._cancelOrder(struct LibOrder.Order)"><code class="function-signature">_cancelOrder(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._updateFilledState(struct LibOrder.Order,address,bytes32,uint256,struct LibFillResults.FillResults)"><code class="function-signature">_updateFilledState(struct LibOrder.Order order, address takerAddress, bytes32 orderHash, uint256 orderTakerAssetFilledAmount, struct LibFillResults.FillResults fillResults)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._updateCancelledState(struct LibOrder.Order,bytes32)"><code class="function-signature">_updateCancelledState(struct LibOrder.Order order, bytes32 orderHash)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._assertFillableOrder(struct LibOrder.Order,struct LibOrder.OrderInfo,address,bytes)"><code class="function-signature">_assertFillableOrder(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo, address takerAddress, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._assertValidCancel(struct LibOrder.Order,struct LibOrder.OrderInfo)"><code class="function-signature">_assertValidCancel(struct LibOrder.Order order, struct LibOrder.OrderInfo orderInfo)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._settleOrder(bytes32,struct LibOrder.Order,address,struct LibFillResults.FillResults)"><code class="function-signature">_settleOrder(bytes32 orderHash, struct LibOrder.Order order, address takerAddress, struct LibFillResults.FillResults fillResults)</code></a></li><li class="inherited"><a href="src#MixinExchangeCore._getOrderHashAndFilledAmount(struct LibOrder.Order)"><code class="function-signature">_getOrderHashAndFilledAmount(struct LibOrder.Order order)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.preSign(bytes32)"><code class="function-signature">preSign(bytes32 hash)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.setSignatureValidatorApproval(address,bool)"><code class="function-signature">setSignatureValidatorApproval(address validatorAddress, bool approval)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidHashSignature(bytes32,address,bytes)"><code class="function-signature">isValidHashSignature(bytes32 hash, address signerAddress, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidOrderSignature(struct LibOrder.Order,bytes)"><code class="function-signature">isValidOrderSignature(struct LibOrder.Order order, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">isValidTransactionSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator._isValidOrderWithHashSignature(struct LibOrder.Order,bytes32,bytes)"><code class="function-signature">_isValidOrderWithHashSignature(struct LibOrder.Order order, bytes32 orderHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator._isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction,bytes32,bytes)"><code class="function-signature">_isValidTransactionWithHashSignature(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes32 transactionHash, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions.batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[],bytes[])"><code class="function-signature">batchExecuteTransactions(struct LibZeroExTransaction.ZeroExTransaction[] transactions, bytes[] signatures)</code></a></li><li class="inherited"><a href="src#MixinTransactions._executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes)"><code class="function-signature">_executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature)</code></a></li><li class="inherited"><a href="src#MixinTransactions._assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction,bytes,bytes32)"><code class="function-signature">_assertExecutableTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, bytes signature, bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#MixinTransactions._setCurrentContextAddressIfRequired(address,address)"><code class="function-signature">_setCurrentContextAddressIfRequired(address signerAddress, address contextAddress)</code></a></li><li class="inherited"><a href="src#MixinTransactions._getCurrentContextAddress()"><code class="function-signature">_getCurrentContextAddress()</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.setProtocolFeeMultiplier(uint256)"><code class="function-signature">setProtocolFeeMultiplier(uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.setProtocolFeeCollectorAddress(address)"><code class="function-signature">setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees.detachProtocolFeeCollector()"><code class="function-signature">detachProtocolFeeCollector()</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._setProtocolFeeCollectorAddress(address)"><code class="function-signature">_setProtocolFeeCollectorAddress(address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._paySingleProtocolFee(bytes32,uint256,address,address)"><code class="function-signature">_paySingleProtocolFee(bytes32 orderHash, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._payTwoProtocolFees(bytes32,bytes32,uint256,address,address,address)"><code class="function-signature">_payTwoProtocolFees(bytes32 orderHash1, bytes32 orderHash2, uint256 protocolFee, address makerAddress1, address makerAddress2, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinProtocolFees._payProtocolFeeToFeeCollector(bytes32,address,uint256,uint256,address,address)"><code class="function-signature">_payProtocolFeeToFeeCollector(bytes32 orderHash, address feeCollector, uint256 exchangeBalance, uint256 protocolFee, address makerAddress, address takerAddress)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.registerAssetProxy(address)"><code class="function-signature">registerAssetProxy(address assetProxy)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher.getAssetProxy(bytes4)"><code class="function-signature">getAssetProxy(bytes4 assetProxyId)</code></a></li><li class="inherited"><a href="src#MixinAssetProxyDispatcher._dispatchTransferFrom(bytes32,bytes,address,address,uint256)"><code class="function-signature">_dispatchTransferFrom(bytes32 orderHash, bytes assetData, address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="src#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalanceIfEnabled()"><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalance()"><code class="function-signature">_refundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._disableRefund()"><code class="function-signature">_disableRefund()</code></a></li><li class="inherited"><a href="src#Refundable._enableAndRefundNonZeroBalance()"><code class="function-signature">_enableAndRefundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._areRefundsDisabled()"><code class="function-signature">_areRefundsDisabled()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li><li class="inherited"><a href="src#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="src#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li><li class="inherited"><a href="src#Ownable._assertSenderIsOwner()"><code class="function-signature">_assertSenderIsOwner()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeMultiplier()"><code class="function-signature">protocolFeeMultiplier()</code></a></li><li class="inherited"><a href="src#IProtocolFees.protocolFeeCollector()"><code class="function-signature">protocolFeeCollector()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#ITransactions.TransactionExecution(bytes32)"><code class="function-signature">TransactionExecution(bytes32 transactionHash)</code></a></li><li class="inherited"><a href="src#ISignatureValidator.SignatureValidatorApproval(address,address,bool)"><code class="function-signature">SignatureValidatorApproval(address signerAddress, address validatorAddress, bool isApproved)</code></a></li><li class="inherited"><a href="src#IAssetProxyDispatcher.AssetProxyRegistered(bytes4,address)"><code class="function-signature">AssetProxyRegistered(bytes4 id, address assetProxy)</code></a></li><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeMultiplier(uint256,uint256)"><code class="function-signature">ProtocolFeeMultiplier(uint256 oldProtocolFeeMultiplier, uint256 updatedProtocolFeeMultiplier)</code></a></li><li class="inherited"><a href="src#IProtocolFees.ProtocolFeeCollectorAddress(address,address)"><code class="function-signature">ProtocolFeeCollectorAddress(address oldProtocolFeeCollector, address updatedProtocolFeeCollector)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Fill(address,address,bytes,bytes,bytes,bytes,bytes32,address,address,uint256,uint256,uint256,uint256,uint256)"><code class="function-signature">Fill(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, bytes makerFeeAssetData, bytes takerFeeAssetData, bytes32 orderHash, address takerAddress, address senderAddress, uint256 makerAssetFilledAmount, uint256 takerAssetFilledAmount, uint256 makerFeePaid, uint256 takerFeePaid, uint256 protocolFeePaid)</code></a></li><li class="inherited"><a href="src#IExchangeCore.Cancel(address,address,bytes,bytes,address,bytes32)"><code class="function-signature">Cancel(address makerAddress, address feeRecipientAddress, bytes makerAssetData, bytes takerAssetData, address senderAddress, bytes32 orderHash)</code></a></li><li class="inherited"><a href="src#IExchangeCore.CancelUpTo(address,address,uint256)"><code class="function-signature">CancelUpTo(address makerAddress, address orderSenderAddress, uint256 orderEpoch)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions.fillOrKillOrder(struct LibOrder.Order,uint256,bytes)"></a><code class="function-signature">fillOrKillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Fills the input order. Reverts if exact `takerAssetFillAmount` not filled.
 @param order Order struct containing order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signature Proof that order has been created by maker.
 @return fillResults Amounts filled and fees paid.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions.batchFillOrders(struct LibOrder.Order[],uint256[],bytes[])"></a><code class="function-signature">batchFillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults[]</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrder.
 @param orders Array of order specifications.
 @param takerAssetFillAmounts Array of desired amounts of takerAsset to sell in orders.
 @param signatures Proofs that orders have been created by makers.
 @return fillResults Array of amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions.batchFillOrKillOrders(struct LibOrder.Order[],uint256[],bytes[])"></a><code class="function-signature">batchFillOrKillOrders(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults[]</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrKillOrder.
 @param orders Array of order specifications.
 @param takerAssetFillAmounts Array of desired amounts of takerAsset to sell in orders.
 @param signatures Proofs that orders have been created by makers.
 @return fillResults Array of amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions.batchFillOrdersNoThrow(struct LibOrder.Order[],uint256[],bytes[])"></a><code class="function-signature">batchFillOrdersNoThrow(struct LibOrder.Order[] orders, uint256[] takerAssetFillAmounts, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults[]</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrder. If any fill reverts, the error is caught and ignored.
 @param orders Array of order specifications.
 @param takerAssetFillAmounts Array of desired amounts of takerAsset to sell in orders.
 @param signatures Proofs that orders have been created by makers.
 @return fillResults Array of amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions.marketSellOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"></a><code class="function-signature">marketSellOrdersNoThrow(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrder until total amount of takerAsset is sold by taker.
      If any fill reverts, the error is caught and ignored.
      NOTE: This function does not enforce that the takerAsset is the same for each order.
 @param orders Array of order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signatures Proofs that orders have been signed by makers.
 @return fillResults Amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions.marketBuyOrdersNoThrow(struct LibOrder.Order[],uint256,bytes[])"></a><code class="function-signature">marketBuyOrdersNoThrow(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Executes multiple calls of fillOrder until total amount of makerAsset is bought by taker.
      If any fill reverts, the error is caught and ignored.
      NOTE: This function does not enforce that the makerAsset is the same for each order.
 @param orders Array of order specifications.
 @param makerAssetFillAmount Desired amount of makerAsset to buy.
 @param signatures Proofs that orders have been signed by makers.
 @return fillResults Amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions.marketSellOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"></a><code class="function-signature">marketSellOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 takerAssetFillAmount, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Calls marketSellOrdersNoThrow then reverts if &lt; takerAssetFillAmount has been sold.
      NOTE: This function does not enforce that the takerAsset is the same for each order.
 @param orders Array of order specifications.
 @param takerAssetFillAmount Minimum amount of takerAsset to sell.
 @param signatures Proofs that orders have been signed by makers.
 @return fillResults Amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions.marketBuyOrdersFillOrKill(struct LibOrder.Order[],uint256,bytes[])"></a><code class="function-signature">marketBuyOrdersFillOrKill(struct LibOrder.Order[] orders, uint256 makerAssetFillAmount, bytes[] signatures) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">public</span></h4>

Calls marketBuyOrdersNoThrow then reverts if &lt; makerAssetFillAmount has been bought.
      NOTE: This function does not enforce that the makerAsset is the same for each order.
 @param orders Array of order specifications.
 @param makerAssetFillAmount Minimum amount of makerAsset to buy.
 @param signatures Proofs that orders have been signed by makers.
 @return fillResults Amounts filled and fees paid by makers and taker.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions.batchCancelOrders(struct LibOrder.Order[])"></a><code class="function-signature">batchCancelOrders(struct LibOrder.Order[] orders)</code><span class="function-visibility">public</span></h4>

Executes multiple calls of cancelOrder.
 @param orders Array of order specifications.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions._fillOrKillOrder(struct LibOrder.Order,uint256,bytes)"></a><code class="function-signature">_fillOrKillOrder(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">internal</span></h4>

Fills the input order. Reverts if exact takerAssetFillAmount not filled.
 @param order Order struct containing order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param fillResults ignature Proof that order has been created by maker.



<h4><a class="anchor" aria-hidden="true" id="MixinWrapperFunctions._fillOrderNoThrow(struct LibOrder.Order,uint256,bytes)"></a><code class="function-signature">_fillOrderNoThrow(struct LibOrder.Order order, uint256 takerAssetFillAmount, bytes signature) <span class="return-arrow">→</span> <span class="return-type">struct LibFillResults.FillResults</span></code><span class="function-visibility">internal</span></h4>

Fills the input order.
      Returns a null FillResults instance if the transaction would otherwise revert.
 @param order Order struct containing order specifications.
 @param takerAssetFillAmount Desired amount of takerAsset to sell.
 @param signature Proof that order has been created by maker.
 @return fillResults Amounts filled and fees paid by maker and taker.





### `Ownable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address newOwner)</code></a></li><li><a href="#Ownable._assertSenderIsOwner()"><code class="function-signature">_assertSenderIsOwner()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="src#IOwnable.OwnershipTransferred(address,address)"><code class="function-signature">OwnershipTransferred(address previousOwner, address newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Ownable.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Ownable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address newOwner)</code><span class="function-visibility">public</span></h4>

Change the owner of this contract.
 @param newOwner New owner address.



<h4><a class="anchor" aria-hidden="true" id="Ownable._assertSenderIsOwner()"></a><code class="function-signature">_assertSenderIsOwner()</code><span class="function-visibility">internal</span></h4>







### `ReentrancyGuard`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li><a href="#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"></a><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ReentrancyGuard._unlockMutex()"></a><code class="function-signature">_unlockMutex()</code><span class="function-visibility">internal</span></h4>







### `Refundable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Refundable._refundNonZeroBalanceIfEnabled()"><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code></a></li><li><a href="#Refundable._refundNonZeroBalance()"><code class="function-signature">_refundNonZeroBalance()</code></a></li><li><a href="#Refundable._disableRefund()"><code class="function-signature">_disableRefund()</code></a></li><li><a href="#Refundable._enableAndRefundNonZeroBalance()"><code class="function-signature">_enableAndRefundNonZeroBalance()</code></a></li><li><a href="#Refundable._areRefundsDisabled()"><code class="function-signature">_areRefundsDisabled()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Refundable._refundNonZeroBalanceIfEnabled()"></a><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Refundable._refundNonZeroBalance()"></a><code class="function-signature">_refundNonZeroBalance()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Refundable._disableRefund()"></a><code class="function-signature">_disableRefund()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Refundable._enableAndRefundNonZeroBalance()"></a><code class="function-signature">_enableAndRefundNonZeroBalance()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Refundable._areRefundsDisabled()"></a><code class="function-signature">_areRefundsDisabled() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







</div>