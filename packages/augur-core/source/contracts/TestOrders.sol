pragma solidity 0.5.10;

import 'ROOT/trading/Orders.sol';
import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/libraries/token/IERC20.sol';


contract TestOrders is Orders {
    using ContractExists for address;

    address private constant FOUNDATION_REP_ADDRESS = address(0x1985365e9f78359a9B6AD760e32412f4a445E862);

    constructor() public {
        // This is to confirm we are not on foundation network
        require(!FOUNDATION_REP_ADDRESS.exists(), "TestOrders: Deploying test contract to production");
    }

    function testSaveOrder(uint256[] memory _uints, bytes32[] memory _bytes32s, Order.Types _type, IMarket _market, address _sender, IERC20 _kycToken) public returns (bytes32 _orderId) {
        uint256[5] memory _wtfUints;
        _wtfUints[0] = _uints[0];
        _wtfUints[1] = _uints[1];
        _wtfUints[2] = _uints[2];
        _wtfUints[3] = _uints[3];
        _wtfUints[4] = _uints[4];
        bytes32[3] memory _wtfBytes32s;
        _wtfBytes32s[0] = _bytes32s[0];
        _wtfBytes32s[1] = _bytes32s[1];
        _wtfBytes32s[2] = _bytes32s[2];
        return this.saveOrder(_wtfUints, _wtfBytes32s, _type, _market, _sender, _kycToken);
    }

    function testRemoveOrder(bytes32 _orderId) public returns (bool) {
        return this.removeOrder(_orderId);
    }

    function testRecordFillOrder(bytes32 _orderId, uint256 _sharesFilled, uint256 _tokensFilled, uint256 _fill) public returns (bool) {
        return this.recordFillOrder(_orderId, _sharesFilled, _tokensFilled, _fill);
    }
}
