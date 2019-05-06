pragma solidity 0.5.4;

import 'ROOT/trading/Orders.sol';
import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/libraries/token/ERC20Token.sol';


contract TestOrders is Orders {
    using ContractExists for address;

    address private constant FOUNDATION_REP_ADDRESS = address(0x1985365e9f78359a9B6AD760e32412f4a445E862);

    constructor() public {
        // This is to confirm we are not on foundation network
        require(!FOUNDATION_REP_ADDRESS.exists());
    }

    function testSaveOrder(Order.Types _type, IMarket _market, uint256 _amount, uint256 _price, address _sender, uint256 _outcome, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId, ERC20Token _kycToken) public returns (bytes32 _orderId) {
        return this.saveOrder(_type, _market, _amount, _price, _sender, _outcome, _moneyEscrowed, _sharesEscrowed, _betterOrderId, _worseOrderId, _tradeGroupId, _kycToken);
    }

    function testRemoveOrder(bytes32 _orderId) public returns (bool) {
        return this.removeOrder(_orderId);
    }

    function testRecordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill) public returns (bool) {
        return this.recordFillOrder(_orderId, _sharesFilled, _tokensFilled, _fill);
    }
}
