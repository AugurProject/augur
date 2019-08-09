pragma solidity 0.5.10;

import 'ROOT/libraries/ITyped.sol';


contract ITime is ITyped {
    function getTimestamp() external view returns (uint256);
}
