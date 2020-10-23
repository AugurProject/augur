pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import "ROOT/external/IExchange.sol";

contract IExitZeroXTrade {
    function trade(
        uint256 _requestedFillAmount,
        bytes32 _fingerprint,
        bytes32 _tradeGroupId,
        uint256 _maxProtocolFeeDai,
        uint256 _maxTrades,
        IExchange.Order[] memory _orders,
        bytes[] memory _signatures,
        address _taker,
        bytes memory _exitTokensPacked
    ) public payable returns (uint256);

    function getExchange() external view returns(IExchange);
}
