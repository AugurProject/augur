pragma solidity 0.5.15;

import 'ROOT/para/FeePot.sol';
import 'ROOT/para/interfaces/IFeePotFactory.sol';


contract FeePotFactory is IFeePotFactory {
    function createFeePot(IParaAugur _paraAugur) external returns (IFeePot) {
        FeePot _feePot = new FeePot();
        _feePot.initialize(_paraAugur, IParaUniverse(msg.sender));
        return IFeePot(_feePot);
    }
}