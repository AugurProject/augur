pragma solidity 0.5.10;

import 'ROOT/libraries/Ownable.sol';
import 'ROOT/external/IAffiliateValidator.sol';


contract AffiliateValidator is Ownable, IAffiliateValidator {
    // Mapping of keys to affiliate address
    mapping (bytes32 => address) keys;

    mapping (address => bool) operators;

    function addOperator(address _operator) external onlyOwner {
        operators[_operator] = true;
    }

    function removeOperator(address _operator) external onlyOwner {
        operators[_operator] = false;
    }

    function addKey(address _account, bytes32 _key, bytes calldata _signature) external {
        // XXX validate signature
        keys[_key] = _account;
    }

    function isValidKey(address _account, bytes32 _key) external returns (bool) {
        return keys[_key] == _account;
    }

    function onTransferOwnership(address, address) internal {
        
    }
}