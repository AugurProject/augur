pragma solidity 0.5.10;


import 'ROOT/reporting/IMarket.sol';


contract ICompleteSets {
    function buyCompleteSets(address _sender, IMarket _market, uint256 _amount) external returns (bool);
    function sellCompleteSets(address _sender, IMarket _market, uint256 _amount, address _affiliateAddress) external returns (uint256, uint256);
}
