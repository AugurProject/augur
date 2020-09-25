pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';


contract IParaAugurFactory {
    function createParaAugur(IAugur _augur) public returns (IParaAugur);
}