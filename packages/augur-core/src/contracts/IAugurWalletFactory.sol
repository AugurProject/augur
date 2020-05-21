pragma solidity 0.5.15;

import 'ROOT/IAugurWallet.sol';


interface IAugurWalletFactory {
    function getCreate2WalletAddress(address _owner) external view returns (address);
    function trustedCreateAugurWallet(address _owner, address _referralAddress, bytes32 _fingerprint) external returns (IAugurWallet);
}