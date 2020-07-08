pragma solidity 0.5.15;

import 'ROOT/Cash.sol';


/**
 * @title USDC
 * @dev Test contract for USDC
 */
contract USDC is Cash {
    string constant public name = "USDC";
    string constant public symbol = "USDC";

    function getTypeName() public view returns (bytes32) {
        return "USDC";
    }
}
