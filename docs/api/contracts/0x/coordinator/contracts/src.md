---
title: Src
---

<div class="contracts">

## Contracts

### `Coordinator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Coordinator.constructor(address,uint256)"><code class="function-signature">constructor(address exchange, uint256 chainId)</code></a></li><li class="inherited"><a href="src#MixinCoordinatorCore.fallback()"><code class="function-signature">fallback()</code></a></li><li class="inherited"><a href="src#MixinCoordinatorCore.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code></a></li><li class="inherited"><a href="src#MixinCoordinatorApprovalVerifier.assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"><code class="function-signature">assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code></a></li><li class="inherited"><a href="src#MixinCoordinatorApprovalVerifier.decodeOrdersFromFillData(bytes)"><code class="function-signature">decodeOrdersFromFillData(bytes data)</code></a></li><li class="inherited"><a href="src#MixinCoordinatorApprovalVerifier._assertValidTransactionOrdersApproval(struct LibZeroExTransaction.ZeroExTransaction,struct LibOrder.Order[],address,bytes,bytes[])"><code class="function-signature">_assertValidTransactionOrdersApproval(struct LibZeroExTransaction.ZeroExTransaction transaction, struct LibOrder.Order[] orders, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code></a></li><li class="inherited"><a href="src#MixinSignatureValidator.getSignerAddress(bytes32,bytes)"><code class="function-signature">getSignerAddress(bytes32 hash, bytes signature)</code></a></li><li class="inherited"><a href="src#LibConstants.constructor(address)"><code class="function-signature">constructor(address exchange)</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalanceIfEnabled()"><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalance()"><code class="function-signature">_refundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._disableRefund()"><code class="function-signature">_disableRefund()</code></a></li><li class="inherited"><a href="src#Refundable._enableAndRefundNonZeroBalance()"><code class="function-signature">_enableAndRefundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._areRefundsDisabled()"><code class="function-signature">_areRefundsDisabled()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li><li class="inherited"><a href="src#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#LibCoordinatorApproval.getCoordinatorApprovalHash(struct LibCoordinatorApproval.CoordinatorApproval)"><code class="function-signature">getCoordinatorApprovalHash(struct LibCoordinatorApproval.CoordinatorApproval approval)</code></a></li><li class="inherited"><a href="src#LibCoordinatorApproval._hashCoordinatorApproval(struct LibCoordinatorApproval.CoordinatorApproval)"><code class="function-signature">_hashCoordinatorApproval(struct LibCoordinatorApproval.CoordinatorApproval approval)</code></a></li><li class="inherited"><a href="src#LibEIP712CoordinatorDomain._hashEIP712CoordinatorMessage(bytes32)"><code class="function-signature">_hashEIP712CoordinatorMessage(bytes32 hashStruct)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Coordinator.constructor(address,uint256)"></a><code class="function-signature">constructor(address exchange, uint256 chainId)</code><span class="function-visibility">public</span></h4>







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





### `ICoordinatorApprovalVerifier`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ICoordinatorApprovalVerifier.assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"><code class="function-signature">assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code></a></li><li><a href="#ICoordinatorApprovalVerifier.decodeOrdersFromFillData(bytes)"><code class="function-signature">decodeOrdersFromFillData(bytes data)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ICoordinatorApprovalVerifier.assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"></a><code class="function-signature">assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code><span class="function-visibility">public</span></h4>

Validates that the 0x transaction has been approved by all of the feeRecipients
      that correspond to each order in the transaction&#x27;s Exchange calldata.
 @param transaction 0x transaction containing salt, signerAddress, and data.
 @param txOrigin Required signer of Ethereum transaction calling this function.
 @param transactionSignature Proof that the transaction has been signed by the signer.
 @param approvalSignatures Array of signatures that correspond to the feeRecipients of each
        order in the transaction&#x27;s Exchange calldata.



<h4><a class="anchor" aria-hidden="true" id="ICoordinatorApprovalVerifier.decodeOrdersFromFillData(bytes)"></a><code class="function-signature">decodeOrdersFromFillData(bytes data) <span class="return-arrow">→</span> <span class="return-type">struct LibOrder.Order[]</span></code><span class="function-visibility">public</span></h4>

Decodes the orders from Exchange calldata representing any fill method.
 @param data Exchange calldata representing a fill method.
 @return orders The orders from the Exchange calldata.





### `ICoordinatorCore`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ICoordinatorCore.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ICoordinatorCore.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"></a><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code><span class="function-visibility">public</span></h4>

Executes a 0x transaction that has been signed by the feeRecipients that correspond to
      each order in the transaction&#x27;s Exchange calldata.
 @param transaction 0x transaction containing salt, signerAddress, and data.
 @param txOrigin Required signer of Ethereum transaction calling this function.
 @param transactionSignature Proof that the transaction has been signed by the signer.
 @param approvalSignatures Array of signatures that correspond to the feeRecipients of each
        order in the transaction&#x27;s Exchange calldata.





### `ICoordinatorSignatureValidator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ICoordinatorSignatureValidator.getSignerAddress(bytes32,bytes)"><code class="function-signature">getSignerAddress(bytes32 hash, bytes signature)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ICoordinatorSignatureValidator.getSignerAddress(bytes32,bytes)"></a><code class="function-signature">getSignerAddress(bytes32 hash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>

Recovers the address of a signer given a hash and signature.
 @param hash Any 32 byte hash.
 @param signature Proof that the hash has been signed by signer.
 @return signerAddress Address of the signer. 





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





### `LibAddressArray`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibAddressArray.append(address[],address)"><code class="function-signature">append(address[] addressArray, address addressToAppend)</code></a></li><li><a href="#LibAddressArray.contains(address[],address)"><code class="function-signature">contains(address[] addressArray, address target)</code></a></li><li><a href="#LibAddressArray.indexOf(address[],address)"><code class="function-signature">indexOf(address[] addressArray, address target)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibAddressArray.append(address[],address)"></a><code class="function-signature">append(address[] addressArray, address addressToAppend) <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">internal</span></h4>

Append a new address to an array of addresses.
      The `addressArray` may need to be reallocated to make space
      for the new address. Because of this we return the resulting
      memory location of `addressArray`.
 @param addressArray Array of addresses.
 @param addressToAppend  Address to append.
 @return Array of addresses: [... addressArray, addressToAppend]



<h4><a class="anchor" aria-hidden="true" id="LibAddressArray.contains(address[],address)"></a><code class="function-signature">contains(address[] addressArray, address target) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>

Checks if an address array contains the target address.
 @param addressArray Array of addresses.
 @param target Address to search for in array.
 @return True if the addressArray contains the target.



<h4><a class="anchor" aria-hidden="true" id="LibAddressArray.indexOf(address[],address)"></a><code class="function-signature">indexOf(address[] addressArray, address target) <span class="return-arrow">→</span> <span class="return-type">bool,uint256</span></code><span class="function-visibility">internal</span></h4>

Finds the index of an address within an array.
 @param addressArray Array of addresses.
 @param target Address to search for in array.
 @return Existence and index of the target in the array.





### `LibAddressArrayRichErrors`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibAddressArrayRichErrors.MismanagedMemoryError(uint256,uint256)"><code class="function-signature">MismanagedMemoryError(uint256 freeMemPtr, uint256 addressArrayEndPtr)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibAddressArrayRichErrors.MismanagedMemoryError(uint256,uint256)"></a><code class="function-signature">MismanagedMemoryError(uint256 freeMemPtr, uint256 addressArrayEndPtr) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>







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





### `LibConstants`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibConstants.constructor(address)"><code class="function-signature">constructor(address exchange)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibConstants.constructor(address)"></a><code class="function-signature">constructor(address exchange)</code><span class="function-visibility">public</span></h4>







### `LibCoordinatorApproval`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibCoordinatorApproval.getCoordinatorApprovalHash(struct LibCoordinatorApproval.CoordinatorApproval)"><code class="function-signature">getCoordinatorApprovalHash(struct LibCoordinatorApproval.CoordinatorApproval approval)</code></a></li><li><a href="#LibCoordinatorApproval._hashCoordinatorApproval(struct LibCoordinatorApproval.CoordinatorApproval)"><code class="function-signature">_hashCoordinatorApproval(struct LibCoordinatorApproval.CoordinatorApproval approval)</code></a></li><li class="inherited"><a href="src#LibEIP712CoordinatorDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#LibEIP712CoordinatorDomain._hashEIP712CoordinatorMessage(bytes32)"><code class="function-signature">_hashEIP712CoordinatorMessage(bytes32 hashStruct)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibCoordinatorApproval.getCoordinatorApprovalHash(struct LibCoordinatorApproval.CoordinatorApproval)"></a><code class="function-signature">getCoordinatorApprovalHash(struct LibCoordinatorApproval.CoordinatorApproval approval) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>

Calculates the EIP712 hash of the Coordinator approval mesasage using the domain
      separator of this contract.
 @param approval Coordinator approval message containing the transaction hash, and transaction
        signature.
 @return approvalHash EIP712 hash of the Coordinator approval message with the domain
         separator of this contract.



<h4><a class="anchor" aria-hidden="true" id="LibCoordinatorApproval._hashCoordinatorApproval(struct LibCoordinatorApproval.CoordinatorApproval)"></a><code class="function-signature">_hashCoordinatorApproval(struct LibCoordinatorApproval.CoordinatorApproval approval) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>







### `LibCoordinatorRichErrors`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibCoordinatorRichErrors.SignatureError(enum LibCoordinatorRichErrors.SignatureErrorCodes,bytes32,bytes)"><code class="function-signature">SignatureError(enum LibCoordinatorRichErrors.SignatureErrorCodes errorCode, bytes32 hash, bytes signature)</code></a></li><li><a href="#LibCoordinatorRichErrors.InvalidOriginError(address)"><code class="function-signature">InvalidOriginError(address expectedOrigin)</code></a></li><li><a href="#LibCoordinatorRichErrors.InvalidApprovalSignatureError(bytes32,address)"><code class="function-signature">InvalidApprovalSignatureError(bytes32 transactionHash, address approverAddress)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibCoordinatorRichErrors.SignatureError(enum LibCoordinatorRichErrors.SignatureErrorCodes,bytes32,bytes)"></a><code class="function-signature">SignatureError(enum LibCoordinatorRichErrors.SignatureErrorCodes errorCode, bytes32 hash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibCoordinatorRichErrors.InvalidOriginError(address)"></a><code class="function-signature">InvalidOriginError(address expectedOrigin) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibCoordinatorRichErrors.InvalidApprovalSignatureError(bytes32,address)"></a><code class="function-signature">InvalidApprovalSignatureError(bytes32 transactionHash, address approverAddress) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>







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





### `LibEIP712CoordinatorDomain`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibEIP712CoordinatorDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li><a href="#LibEIP712CoordinatorDomain._hashEIP712CoordinatorMessage(bytes32)"><code class="function-signature">_hashEIP712CoordinatorMessage(bytes32 hashStruct)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibEIP712CoordinatorDomain.constructor(uint256,address)"></a><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="LibEIP712CoordinatorDomain._hashEIP712CoordinatorMessage(bytes32)"></a><code class="function-signature">_hashEIP712CoordinatorMessage(bytes32 hashStruct) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">internal</span></h4>

Calculates EIP712 encoding for a hash struct in the EIP712 domain
      of this contract.
 @param hashStruct The EIP712 hash struct.
 @return result EIP712 hash applied to this EIP712 Domain.





### `LibEIP712ExchangeDomain`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibEIP712ExchangeDomain.constructor(uint256,address)"></a><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code><span class="function-visibility">public</span></h4>







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





### `LibReentrancyGuardRichErrors`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#LibReentrancyGuardRichErrors.IllegalReentrancyError()"><code class="function-signature">IllegalReentrancyError()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="LibReentrancyGuardRichErrors.IllegalReentrancyError()"></a><code class="function-signature">IllegalReentrancyError() <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">internal</span></h4>







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





### `MixinCoordinatorApprovalVerifier`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinCoordinatorApprovalVerifier.assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"><code class="function-signature">assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code></a></li><li><a href="#MixinCoordinatorApprovalVerifier.decodeOrdersFromFillData(bytes)"><code class="function-signature">decodeOrdersFromFillData(bytes data)</code></a></li><li><a href="#MixinCoordinatorApprovalVerifier._assertValidTransactionOrdersApproval(struct LibZeroExTransaction.ZeroExTransaction,struct LibOrder.Order[],address,bytes,bytes[])"><code class="function-signature">_assertValidTransactionOrdersApproval(struct LibZeroExTransaction.ZeroExTransaction transaction, struct LibOrder.Order[] orders, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code></a></li><li class="inherited"><a href="src#ICoordinatorSignatureValidator.getSignerAddress(bytes32,bytes)"><code class="function-signature">getSignerAddress(bytes32 hash, bytes signature)</code></a></li><li class="inherited"><a href="src#LibEIP712ExchangeDomain.constructor(uint256,address)"><code class="function-signature">constructor(uint256 chainId, address verifyingContractAddressIfExists)</code></a></li><li class="inherited"><a href="src#LibCoordinatorApproval.getCoordinatorApprovalHash(struct LibCoordinatorApproval.CoordinatorApproval)"><code class="function-signature">getCoordinatorApprovalHash(struct LibCoordinatorApproval.CoordinatorApproval approval)</code></a></li><li class="inherited"><a href="src#LibCoordinatorApproval._hashCoordinatorApproval(struct LibCoordinatorApproval.CoordinatorApproval)"><code class="function-signature">_hashCoordinatorApproval(struct LibCoordinatorApproval.CoordinatorApproval approval)</code></a></li><li class="inherited"><a href="src#LibEIP712CoordinatorDomain._hashEIP712CoordinatorMessage(bytes32)"><code class="function-signature">_hashEIP712CoordinatorMessage(bytes32 hashStruct)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinCoordinatorApprovalVerifier.assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"></a><code class="function-signature">assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code><span class="function-visibility">public</span></h4>

Validates that the 0x transaction has been approved by all of the feeRecipients
      that correspond to each order in the transaction&#x27;s Exchange calldata.
 @param transaction 0x transaction containing salt, signerAddress, and data.
 @param txOrigin Required signer of Ethereum transaction calling this function.
 @param transactionSignature Proof that the transaction has been signed by the signer.
 @param approvalSignatures Array of signatures that correspond to the feeRecipients of each
        order in the transaction&#x27;s Exchange calldata.



<h4><a class="anchor" aria-hidden="true" id="MixinCoordinatorApprovalVerifier.decodeOrdersFromFillData(bytes)"></a><code class="function-signature">decodeOrdersFromFillData(bytes data) <span class="return-arrow">→</span> <span class="return-type">struct LibOrder.Order[]</span></code><span class="function-visibility">public</span></h4>

Decodes the orders from Exchange calldata representing any fill method.
 @param data Exchange calldata representing a fill method.
 @return orders The orders from the Exchange calldata.



<h4><a class="anchor" aria-hidden="true" id="MixinCoordinatorApprovalVerifier._assertValidTransactionOrdersApproval(struct LibZeroExTransaction.ZeroExTransaction,struct LibOrder.Order[],address,bytes,bytes[])"></a><code class="function-signature">_assertValidTransactionOrdersApproval(struct LibZeroExTransaction.ZeroExTransaction transaction, struct LibOrder.Order[] orders, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code><span class="function-visibility">internal</span></h4>

Validates that the feeRecipients of a batch of order have approved a 0x transaction.
 @param transaction 0x transaction containing salt, signerAddress, and data.
 @param orders Array of order structs containing order specifications.
 @param txOrigin Required signer of Ethereum transaction calling this function.
 @param transactionSignature Proof that the transaction has been signed by the signer.
 @param approvalSignatures Array of signatures that correspond to the feeRecipients of each order.





### `MixinCoordinatorCore`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinCoordinatorCore.fallback()"><code class="function-signature">fallback()</code></a></li><li><a href="#MixinCoordinatorCore.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code></a></li><li class="inherited"><a href="src#ICoordinatorApprovalVerifier.assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"><code class="function-signature">assertValidCoordinatorApprovals(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code></a></li><li class="inherited"><a href="src#ICoordinatorApprovalVerifier.decodeOrdersFromFillData(bytes)"><code class="function-signature">decodeOrdersFromFillData(bytes data)</code></a></li><li class="inherited"><a href="src#LibConstants.constructor(address)"><code class="function-signature">constructor(address exchange)</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalanceIfEnabled()"><code class="function-signature">_refundNonZeroBalanceIfEnabled()</code></a></li><li class="inherited"><a href="src#Refundable._refundNonZeroBalance()"><code class="function-signature">_refundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._disableRefund()"><code class="function-signature">_disableRefund()</code></a></li><li class="inherited"><a href="src#Refundable._enableAndRefundNonZeroBalance()"><code class="function-signature">_enableAndRefundNonZeroBalance()</code></a></li><li class="inherited"><a href="src#Refundable._areRefundsDisabled()"><code class="function-signature">_areRefundsDisabled()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._lockMutexOrThrowIfAlreadyLocked()"><code class="function-signature">_lockMutexOrThrowIfAlreadyLocked()</code></a></li><li class="inherited"><a href="src#ReentrancyGuard._unlockMutex()"><code class="function-signature">_unlockMutex()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinCoordinatorCore.fallback()"></a><code class="function-signature">fallback()</code><span class="function-visibility">external</span></h4>

A payable fallback function that makes this contract &quot;payable&quot;. This is necessary to allow
      this contract to gracefully handle refunds from the Exchange.



<h4><a class="anchor" aria-hidden="true" id="MixinCoordinatorCore.executeTransaction(struct LibZeroExTransaction.ZeroExTransaction,address,bytes,bytes[])"></a><code class="function-signature">executeTransaction(struct LibZeroExTransaction.ZeroExTransaction transaction, address txOrigin, bytes transactionSignature, bytes[] approvalSignatures)</code><span class="function-visibility">public</span></h4>

Executes a 0x transaction that has been signed by the feeRecipients that correspond to
      each order in the transaction&#x27;s Exchange calldata.
 @param transaction 0x transaction containing salt, signerAddress, and data.
 @param txOrigin Required signer of Ethereum transaction calling this function.
 @param transactionSignature Proof that the transaction has been signed by the signer.
 @param approvalSignatures Array of signatures that correspond to the feeRecipients of each
        order in the transaction&#x27;s Exchange calldata.





### `MixinSignatureValidator`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#MixinSignatureValidator.getSignerAddress(bytes32,bytes)"><code class="function-signature">getSignerAddress(bytes32 hash, bytes signature)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="MixinSignatureValidator.getSignerAddress(bytes32,bytes)"></a><code class="function-signature">getSignerAddress(bytes32 hash, bytes signature) <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>

Recovers the address of a signer given a hash and signature.
 @param hash Any 32 byte hash.
 @param signature Proof that the hash has been signed by signer.
 @return signerAddress Address of the signer.





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