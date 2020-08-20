pragma solidity 0.5.15;


interface IGovToken {
    function totalSupply() external view returns (uint96);
    function getPriorVotes(address account, uint blockNumber) external view returns (uint96);
    function mintAllowance(address account) external view returns (uint96);
    function mint(address _target, uint96 _amount) external returns (bool);
}