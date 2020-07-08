pragma solidity 0.5.15;

import 'ROOT/Cash.sol';


/**
 * @title USDT
 * @dev Test contract for USDT
 */
contract USDT is Cash {
    string constant public name = "USDT";
    string constant public symbol = "USDT";

    function getTypeName() public view returns (bytes32) {
        return "USDT";
    }
}
