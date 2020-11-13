pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/libraries/token/IERC20.sol';


contract IParaOICash is IERC20 {
    function initialize(IParaAugur _augur, IParaUniverse _universe) external;
    function approveFeePot() external;
}
