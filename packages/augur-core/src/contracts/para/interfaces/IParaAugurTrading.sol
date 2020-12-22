pragma solidity 0.5.15;

import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';

contract IParaAugurTrading {
    function doApprovals() public returns (bool);
    function registerContract(bytes32 _key, address _address) external returns (bool);
    function lookup(bytes32 _key) external view returns (address);
}