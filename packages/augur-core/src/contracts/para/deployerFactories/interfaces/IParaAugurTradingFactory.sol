pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/para/interfaces/IParaAugurTrading.sol';


contract IParaAugurTradingFactory {
    function createParaAugurTrading(IAugur _augur) public returns (IParaAugurTrading);
}