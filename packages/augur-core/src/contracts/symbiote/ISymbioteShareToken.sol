pragma solidity 0.5.15;


interface ISymbioteShareToken {
    function trustedTransfer(address _from, address _to, uint256 _amount) external;
    function trustedMint(address _target, uint256 _amount) external;
    function trustedBurn(address _target, uint256 _amount) external;
    function trustedBurnAll(address _target) external returns (uint256);
}