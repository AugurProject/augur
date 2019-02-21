pragma solidity 0.5.4;


import 'libraries/CloneFactory.sol';
import 'TEST/DelegatorHelper.sol';
import 'IAugur.sol';


contract DelegatorHelperFactory is CloneFactory {
    function createDelegatorHelper(IAugur _augur) public payable returns (DelegatorHelper) {
        return DelegatorHelper(createClone(_augur.lookup("DelegatorHelper")));
    }
}
