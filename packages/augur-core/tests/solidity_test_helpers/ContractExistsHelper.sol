pragma solidity ^0.5.4;

import 'ROOT/libraries/ContractExists.sol';


contract ContractExistsHelper {
    using ContractExists for address;

    function doesContractExist(address _address) public view returns (bool) {
        return _address.exists();
    }
}
