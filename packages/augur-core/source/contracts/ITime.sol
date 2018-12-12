pragma solidity 0.4.24;

import 'libraries/ITyped.sol';


contract ITime is ITyped {
    function getTimestamp() external view returns (uint256);
}
