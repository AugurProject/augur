pragma solidity 0.5.4;

import 'libraries/ITyped.sol';


contract ITime is ITyped {
    function getTimestamp() external view returns (uint256);
}
