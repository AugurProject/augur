pragma solidity 0.5.15;

import 'ROOT/ICash.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/trading/ICreateOrder.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/token/IERC1155.sol';


contract MaliciousTrader {
    bool evil = false;

    function doApprovals(ICash _cash, IAugur _augur, IAugurTrading _augurTrading) public returns (bool) {
        IERC1155 _shareToken = IERC1155(_augur.lookup("ShareToken"));

        _cash.approve(address(_augur), 2**254);
        _shareToken.setApprovalForAll(address(_augur), true);

        address _fillOrder = _augurTrading.lookup("FillOrder");
        _cash.approve(_fillOrder, 2**254);
        _shareToken.setApprovalForAll(_fillOrder, true);

        address _createOrder = _augurTrading.lookup("CreateOrder");
        _cash.approve(_createOrder, 2**254);
        _shareToken.setApprovalForAll(_createOrder, true);
        return true;
    }

    function makeOrder(ICreateOrder _createOrder, Order.Types _type, uint256 _attoshares, uint256 _price, IMarket _market, uint256 _outcome, bytes32 _betterOrderId, bytes32 _worseOrderId, bytes32 _tradeGroupId) external payable returns (bytes32) {
        return _createOrder.publicCreateOrder(_type, _attoshares, _price, _market, _outcome, _betterOrderId, _worseOrderId, _tradeGroupId);
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
