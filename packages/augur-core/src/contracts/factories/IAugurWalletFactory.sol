pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/IAugurWallet.sol';


contract IAugurWalletFactory {
    function getCreate2WalletAddress(address _owner) external view returns (address);
    function createAugurWallet(address _owner, address _referralAddress, bytes32 _fingerprint) public returns (IAugurWallet);
}
