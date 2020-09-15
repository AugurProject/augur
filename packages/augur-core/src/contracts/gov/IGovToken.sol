pragma solidity 0.5.15;


interface IGovToken {
    function totalSupply() external view returns (uint256);
    function getPriorVotes(address account, uint blockNumber) external view returns (uint256);
    function mintAllowance(address account) external view returns (uint256);
    function mint(address _target, uint256 _amount) external returns (bool);
}