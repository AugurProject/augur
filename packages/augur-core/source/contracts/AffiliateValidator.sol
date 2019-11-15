pragma solidity 0.5.10;

import 'ROOT/libraries/Ownable.sol';
import 'ROOT/external/IAffiliateValidator.sol';


contract AffiliateValidator is Ownable, IAffiliateValidator {
    // Mapping of affiliate address to their key
    mapping (address => bytes32) keys;

    mapping (address => bool) operators;

    function addOperator(address _operator) external onlyOwner {
        operators[_operator] = true;
    }

    function removeOperator(address _operator) external onlyOwner {
        operators[_operator] = false;
    }

    function addKey(bytes32 _key, bytes calldata _signature) external {
        // XXX validate signature
        keys[msg.sender] = _key;
    }

    function isValidReference(address _account, address _referrer) external returns (bool) {
        bytes32 _accountKey = keys[_account];
        bytes32 _referralKey = keys[_referrer];
        if (_accountKey == bytes32(0) || _referralKey == bytes32(0)) {
            return false;
        }
        return _accountKey != _referralKey;
    }

    function onTransferOwnership(address, address) internal {}
}