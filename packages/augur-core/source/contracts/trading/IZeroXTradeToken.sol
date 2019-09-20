
pragma solidity 0.5.10;


contract IZeroXTradeToken {
    function initialize(address _augur, address _market) external;
    function setTransferFromAllowed(bool _isAllowed) public;
    function getMarket() public view returns (address);
}
