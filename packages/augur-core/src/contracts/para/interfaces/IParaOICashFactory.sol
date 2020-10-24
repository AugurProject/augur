pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IParaOICash.sol';


contract IParaOICashFactory {
    function createParaOICash(IParaAugur _augur) external returns (IParaOICash);
}
