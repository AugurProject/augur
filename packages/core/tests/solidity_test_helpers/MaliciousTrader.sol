pragma solidity 0.5.4;

import 'ROOT/trading/ICash.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/trading/ICreateOrder.sol';
import 'ROOT/libraries/token/ERC20Token.sol';


contract MaliciousTrader {
    bool evil = false;

    function approveAugur(ICash _cash, address _augur) public returns (bool) {
        _cash.approve(_augur, 2**254);
        return true;
    }

    function makeOrder(ICreateOrder _createOrder, Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, uint256 _outcome, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId) external payable returns (bytes32) {

        return _createOrder.publicCreateOrder(_type, _attoshares, _price, _market, _outcome, _betterOrderId, _worseOrderId, _tradeGroupId, false, ERC20Token(0));
    }

    function setEvil(bool _evil) public returns (bool) {
        evil = _evil;
    }

    function () external payable {
        if (evil) {
            revert();
        }
    }
}
