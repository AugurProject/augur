pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';


interface IParaUniverseFactory {
    function createParaUniverse(IParaAugur _paraAugur, IUniverse _originUniverse) external returns (IParaUniverse);
}