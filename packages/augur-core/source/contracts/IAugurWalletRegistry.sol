pragma solidity 0.5.15;


interface IAugurWalletRegistry {
    function walletTransferedOwnership(address _oldOwner, address _newOwner) external;
}