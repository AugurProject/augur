---
title: Token
---

<div class="contracts">

## Contracts

### `ERC20Token`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC20Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#ERC20Token.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#ERC20Token.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li><a href="#ERC20Token.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li><a href="#ERC20Token.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li><a href="#ERC20Token.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li><a href="#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC20Token.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.allowance(address,address)"></a><code class="function-signature">allowance(address owner, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="ERC20Token.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC20Token.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





### `ContractExists`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ContractExists.exists(address)"><code class="function-signature">exists(address _address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ContractExists.exists(address)"></a><code class="function-signature">exists(address _address) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `ERC777BaseToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777BaseToken.initialize820InterfaceImplementations()"><code class="function-signature">initialize820InterfaceImplementations()</code></a></li><li><a href="#ERC777BaseToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#ERC777BaseToken.balanceOf(address)"><code class="function-signature">balanceOf(address _tokenHolder)</code></a></li><li><a href="#ERC777BaseToken.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li><a href="#ERC777BaseToken.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li><a href="#ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data)</code></a></li><li><a href="#ERC777BaseToken.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li><a href="#ERC777BaseToken.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li><a href="#ERC777BaseToken.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li><a href="#ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li><a href="#ERC777BaseToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks)</code></a></li><li><a href="#ERC777BaseToken.doBurn(address,address,uint256,bytes32,bytes32)"><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li><a href="#ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking)</code></a></li><li><a href="#ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="token#ERC820Implementer.setInterfaceImplementation(string,address)"><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl)</code></a></li><li class="inherited"><a href="token#ERC820Implementer.interfaceAddr(address,string)"><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="token#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="token#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li class="inherited"><a href="token#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="token#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.initialize820InterfaceImplementations()"></a><code class="function-signature">initialize820InterfaceImplementations() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.balanceOf(address)"></a><code class="function-signature">balanceOf(address _tokenHolder) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.defaultOperators()"></a><code class="function-signature">defaultOperators() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.send(address,uint256,bytes32)"></a><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"></a><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.authorizeOperator(address)"></a><code class="function-signature">authorizeOperator(address _operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.revokeOperator(address)"></a><code class="function-signature">revokeOperator(address _operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.isOperatorFor(address,address)"></a><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"></a><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.doBurn(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"></a><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `ERC777Token`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777Token.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#ERC777Token.balanceOf(address)"><code class="function-signature">balanceOf(address _owner)</code></a></li><li><a href="#ERC777Token.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li><a href="#ERC777Token.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li><a href="#ERC777Token.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li><a href="#ERC777Token.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li><a href="#ERC777Token.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li><a href="#ERC777Token.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li><a href="#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li><a href="#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li><a href="#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li><a href="#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777Token.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.balanceOf(address)"></a><code class="function-signature">balanceOf(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.defaultOperators()"></a><code class="function-signature">defaultOperators() <span class="return-arrow">→</span> <span class="return-type">address[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.isOperatorFor(address,address)"></a><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.authorizeOperator(address)"></a><code class="function-signature">authorizeOperator(address _operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.revokeOperator(address)"></a><code class="function-signature">revokeOperator(address _operator) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.send(address,uint256,bytes32)"></a><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.operatorSend(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.Minted(address,address,uint256,bytes32)"></a><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.AuthorizedOperator(address,address)"></a><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="ERC777Token.RevokedOperator(address,address)"></a><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code><span class="function-visibility"></span></h4>





### `ERC777TokensRecipient`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777TokensRecipient.tokensReceived(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">tokensReceived(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777TokensRecipient.tokensReceived(address,address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">tokensReceived(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code><span class="function-visibility">external</span></h4>







### `ERC777TokensSender`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ERC777TokensSender.tokensToSend(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">tokensToSend(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ERC777TokensSender.tokensToSend(address,address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">tokensToSend(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code><span class="function-visibility">external</span></h4>







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







### `SafeMathUint256`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMathUint256.mul(uint256,uint256)"><code class="function-signature">mul(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.div(uint256,uint256)"><code class="function-signature">div(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.sub(uint256,uint256)"><code class="function-signature">sub(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.add(uint256,uint256)"><code class="function-signature">add(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.min(uint256,uint256)"><code class="function-signature">min(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.max(uint256,uint256)"><code class="function-signature">max(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.getUint256Min()"><code class="function-signature">getUint256Min()</code></a></li><li><a href="#SafeMathUint256.getUint256Max()"><code class="function-signature">getUint256Max()</code></a></li><li><a href="#SafeMathUint256.isMultipleOf(uint256,uint256)"><code class="function-signature">isMultipleOf(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.fxpMul(uint256,uint256,uint256)"><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base)</code></a></li><li><a href="#SafeMathUint256.fxpDiv(uint256,uint256,uint256)"><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.mul(uint256,uint256)"></a><code class="function-signature">mul(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.div(uint256,uint256)"></a><code class="function-signature">div(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.add(uint256,uint256)"></a><code class="function-signature">add(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.min(uint256,uint256)"></a><code class="function-signature">min(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.max(uint256,uint256)"></a><code class="function-signature">max(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Min()"></a><code class="function-signature">getUint256Min() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Max()"></a><code class="function-signature">getUint256Max() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.isMultipleOf(uint256,uint256)"></a><code class="function-signature">isMultipleOf(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpMul(uint256,uint256,uint256)"></a><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpDiv(uint256,uint256,uint256)"></a><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `StandardToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#StandardToken.initialize820InterfaceImplementations()"><code class="function-signature">initialize820InterfaceImplementations()</code></a></li><li><a href="#StandardToken.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _amount)</code></a></li><li><a href="#StandardToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _amount)</code></a></li><li><a href="#StandardToken.internalTransfer(address,address,uint256,bool)"><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount, bool _callHooks)</code></a></li><li><a href="#StandardToken.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li><a href="#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li><a href="#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li><a href="#StandardToken.approveInternal(address,address,uint256)"><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance)</code></a></li><li><a href="#StandardToken.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li><a href="#StandardToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks)</code></a></li><li><a href="#StandardToken.doBurn(address,address,uint256,bytes32,bytes32)"><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li><a href="#StandardToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.balanceOf(address)"><code class="function-signature">balanceOf(address _tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="token#ERC820Implementer.setInterfaceImplementation(string,address)"><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl)</code></a></li><li class="inherited"><a href="token#ERC820Implementer.interfaceAddr(address,string)"><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="token#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="token#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li class="inherited"><a href="token#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="token#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="token#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="StandardToken.initialize820InterfaceImplementations()"></a><code class="function-signature">initialize820InterfaceImplementations() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.transfer(address,uint256)"></a><code class="function-signature">transfer(address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address _from, address _to, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.internalTransfer(address,address,uint256,bool)"></a><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount, bool _callHooks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.approve(address,uint256)"></a><code class="function-signature">approve(address _spender, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.increaseApproval(address,uint256)"></a><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.decreaseApproval(address,uint256)"></a><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.approveInternal(address,address,uint256)"></a><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.allowance(address,address)"></a><code class="function-signature">allowance(address _owner, address _spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"></a><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.doBurn(address,address,uint256,bytes32,bytes32)"></a><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="StandardToken.onTokenTransfer(address,address,uint256)"></a><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







### `VariableSupplyToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#VariableSupplyToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li><a href="#VariableSupplyToken.onMint(address,uint256)"><code class="function-signature">onMint(address, uint256)</code></a></li><li><a href="#VariableSupplyToken.onBurn(address,uint256)"><code class="function-signature">onBurn(address, uint256)</code></a></li><li class="inherited"><a href="token#StandardToken.initialize820InterfaceImplementations()"><code class="function-signature">initialize820InterfaceImplementations()</code></a></li><li class="inherited"><a href="token#StandardToken.transfer(address,uint256)"><code class="function-signature">transfer(address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="token#StandardToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address _from, address _to, uint256 _amount)</code></a></li><li class="inherited"><a href="token#StandardToken.internalTransfer(address,address,uint256,bool)"><code class="function-signature">internalTransfer(address _from, address _to, uint256 _amount, bool _callHooks)</code></a></li><li class="inherited"><a href="token#StandardToken.approve(address,uint256)"><code class="function-signature">approve(address _spender, uint256 _amount)</code></a></li><li class="inherited"><a href="token#StandardToken.increaseApproval(address,uint256)"><code class="function-signature">increaseApproval(address _spender, uint256 _addedValue)</code></a></li><li class="inherited"><a href="token#StandardToken.decreaseApproval(address,uint256)"><code class="function-signature">decreaseApproval(address _spender, uint256 _subtractedValue)</code></a></li><li class="inherited"><a href="token#StandardToken.approveInternal(address,address,uint256)"><code class="function-signature">approveInternal(address _owner, address _spender, uint256 _allowance)</code></a></li><li class="inherited"><a href="token#StandardToken.allowance(address,address)"><code class="function-signature">allowance(address _owner, address _spender)</code></a></li><li class="inherited"><a href="token#StandardToken.doSend(address,address,address,uint256,bytes32,bytes32,bool,bool)"><code class="function-signature">doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking, bool _callHooks)</code></a></li><li class="inherited"><a href="token#StandardToken.doBurn(address,address,uint256,bytes32,bytes32)"><code class="function-signature">doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="token#StandardToken.onTokenTransfer(address,address,uint256)"><code class="function-signature">onTokenTransfer(address _from, address _to, uint256 _value)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.balanceOf(address)"><code class="function-signature">balanceOf(address _tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.defaultOperators()"><code class="function-signature">defaultOperators()</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.send(address,uint256,bytes32)"><code class="function-signature">send(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.sendNoHooks(address,uint256,bytes32)"><code class="function-signature">sendNoHooks(address _to, uint256 _amount, bytes32 _data)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.authorizeOperator(address)"><code class="function-signature">authorizeOperator(address _operator)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.revokeOperator(address)"><code class="function-signature">revokeOperator(address _operator)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.isOperatorFor(address,address)"><code class="function-signature">isOperatorFor(address _operator, address _tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.operatorSend(address,address,uint256,bytes32,bytes32)"><code class="function-signature">operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.callRecipient(address,address,address,uint256,bytes32,bytes32,bool)"><code class="function-signature">callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking)</code></a></li><li class="inherited"><a href="token#ERC777BaseToken.callSender(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData)</code></a></li><li class="inherited"><a href="token#ERC820Implementer.setInterfaceImplementation(string,address)"><code class="function-signature">setInterfaceImplementation(string _ifaceLabel, address _impl)</code></a></li><li class="inherited"><a href="token#ERC820Implementer.interfaceAddr(address,string)"><code class="function-signature">interfaceAddr(address _address, string _ifaceLabel)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#VariableSupplyToken.Mint(address,uint256)"><code class="function-signature">Mint(address target, uint256 value)</code></a></li><li><a href="#VariableSupplyToken.Burn(address,uint256)"><code class="function-signature">Burn(address target, uint256 value)</code></a></li><li class="inherited"><a href="token#ERC777Token.Sent(address,address,address,uint256,bytes32,bytes32)"><code class="function-signature">Sent(address operator, address from, address to, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="token#ERC777Token.Minted(address,address,uint256,bytes32)"><code class="function-signature">Minted(address operator, address to, uint256 amount, bytes32 operatorData)</code></a></li><li class="inherited"><a href="token#ERC777Token.Burned(address,address,uint256,bytes32,bytes32)"><code class="function-signature">Burned(address operator, address from, uint256 amount, bytes32 data, bytes32 operatorData)</code></a></li><li class="inherited"><a href="token#ERC777Token.AuthorizedOperator(address,address)"><code class="function-signature">AuthorizedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC777Token.RevokedOperator(address,address)"><code class="function-signature">RevokedOperator(address operator, address tokenHolder)</code></a></li><li class="inherited"><a href="token#ERC20Token.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="token#ERC20Token.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.mint(address,uint256)"></a><code class="function-signature">mint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.burn(address,uint256)"></a><code class="function-signature">burn(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onMint(address,uint256)"></a><code class="function-signature">onMint(address, uint256) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.onBurn(address,uint256)"></a><code class="function-signature">onBurn(address, uint256) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.Mint(address,uint256)"></a><code class="function-signature">Mint(address target, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="VariableSupplyToken.Burn(address,uint256)"></a><code class="function-signature">Burn(address target, uint256 value)</code><span class="function-visibility"></span></h4>





</div>