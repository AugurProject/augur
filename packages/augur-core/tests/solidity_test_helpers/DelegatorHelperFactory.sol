pragma solidity 0.5.15;


import 'ROOT/libraries/CloneFactory.sol';
import 'TEST/DelegatorHelper.sol';
import 'ROOT/IAugur.sol';


contract DelegatorHelperFactory is CloneFactory {
    function createDelegatorHelper(IAugur _augur) public payable returns (DelegatorHelper) {
        return DelegatorHelper(createClone(_augur.lookup("DelegatorHelper")));
    }
}
