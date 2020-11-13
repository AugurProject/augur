pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';


contract IParaAugurFactory {
    function createParaAugur(IAugur _augur, uint256 _tradeIntervalModifier) public returns (IParaAugur);
}