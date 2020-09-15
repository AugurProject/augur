pragma solidity 0.5.15;

import 'ROOT/para/ParaUniverse.sol';
import 'ROOT/para/interfaces/IParaUniverseFactory.sol';


contract ParaUniverseFactory is IParaUniverseFactory {
    function createParaUniverse(IParaAugur _paraAugur, IUniverse _originUniverse) external returns (IParaUniverse) {
        ParaUniverse _paraUniverse = new ParaUniverse();
        _paraUniverse.initialize(_paraAugur, _originUniverse);
        return IParaUniverse(_paraUniverse);
    }
}