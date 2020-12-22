pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IFeePot.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';


interface IFeePotFactory {
    function createFeePot(IParaAugur _paraAugur) external returns (IFeePot);
}