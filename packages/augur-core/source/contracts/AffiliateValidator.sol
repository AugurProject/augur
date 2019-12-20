pragma solidity 0.5.10;

import 'ROOT/libraries/Ownable.sol';
import 'ROOT/external/IAffiliateValidator.sol';


contract AffiliateValidator is Ownable, IAffiliateValidator {
    // Mapping of affiliate address to their key
    mapping (address => bytes32) public keys;

    mapping (address => bool) public operators;

    mapping (uint256 => bool) public usedSalts;

    function addOperator(address _operator) external onlyOwner {
        operators[_operator] = true;
    }

    function removeOperator(address _operator) external onlyOwner {
        operators[_operator] = false;
    }

    function addKey(bytes32 _key, uint256 _salt, bytes32 _r, bytes32 _s, uint8 _v) external {
        require(!usedSalts[_salt], "Salt already used");
        bytes32 _hash = getKeyHash(_key, _salt);
        require(isValidSignature(_hash, _r, _s, _v), "Signature invalid");
        usedSalts[_salt] = true;
        keys[msg.sender] = _key;
    }

    function getKeyHash(bytes32 _key, uint256 _salt) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_key, _salt));
    }

    function isValidSignature(bytes32 _hash, bytes32 _r, bytes32 _s, uint8 _v) public view returns (bool) {
        address recovered = ecrecover(
            keccak256(abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                _hash
            )),
            _v,
            _r,
            _s
        );
        return operators[recovered];
    }

    function validateReference(address _account, address _referrer) external view {
        bytes32 _accountKey = keys[_account];
        bytes32 _referralKey = keys[_referrer];
        if (_accountKey == bytes32(0) || _referralKey == bytes32(0)) {
            revert("Key must be registered for both accounts");
        }
        require(_accountKey != _referralKey, "Key must not be equal for both accounts");
    }

    function onTransferOwnership(address, address) internal {}
}