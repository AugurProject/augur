pragma solidity 0.5.15;

import 'ROOT/matic/plasma/IStateReceiver.sol';
import 'ROOT/matic/plasma/BaseStateSyncVerifier.sol';
import 'ROOT/matic/TradingCash.sol';

contract AugurRegistry is BaseStateSyncVerifier, IStateReceiver {
    uint256 private constant SYNC_MARKET_INFO_CMD = 1;
    uint256 private constant SYNC_REPORTING_FEE_CMD = 2;
    uint256 private constant SYNC_MARKET_MIGRATION_CMD = 3;
    uint256 private constant SYNC_MARKET_FINALIZE_CMD = 4;

    struct MarketInfo {
        bool finalized;
        bool isInvalid;
        address universe;
        address owner;
        uint256 numTicks;
        uint256 numberOfOutcomes;
        uint256 endTime;
        uint256 creatorFee;
        uint256 affiliateFeeDivisor;
        uint256[] payoutNumerators;
    }

    struct UniverseInfo {
        address addr;
        uint256 reportingFee;
    }

    mapping(address => MarketInfo) public markets;

    UniverseInfo public universe;
    TradingCash public feesToken;
    uint256 public minimumFeesForWithdrawal;

    constructor(TradingCash _feesToken) public {
        feesToken = _feesToken;
    }

    function setMinimumFeesForWithdrawal(uint256 _minFees) public onlyOwner {
        minimumFeesForWithdrawal = _minFees;
    }

    function onStateReceive(
        uint256, /* id */
        bytes calldata stateData
    ) external onlyStateSyncer {
        (uint256 cmd, bytes memory data) = abi.decode(stateData, (uint256, bytes));

    if (cmd == SYNC_MARKET_INFO_CMD) {
            _syncMarketInfo(data);
        } else if (cmd == SYNC_REPORTING_FEE_CMD) {
            _syncReportingFee(data);
        } else if (cmd == SYNC_MARKET_MIGRATION_CMD) {
            _syncMarketMigration(data);
        } else if (cmd == SYNC_MARKET_FINALIZE_CMD) {
            _syncMarketFinalization(data);
        }
    }

    function _syncMarketFinalization(bytes memory data) private {
        (
            address market,
            bool isInvalid,
            uint256[] memory payoutNumerators
        ) = abi.decode(data, (address, bool, uint256[]));

        require(markets[market].endTime != 0 && !markets[market].finalized);

        markets[market].isInvalid = isInvalid;
        markets[market].payoutNumerators = payoutNumerators;
    }

    function _syncMarketMigration(bytes memory data) private {
        (
            address universeAddr,
            uint256 fee,
            address market
        ) = abi.decode(data, (address, uint256, address));

        // sync reporting fee too
        markets[market].universe = universeAddr;
        universe.reportingFee = fee;
    }

    function _syncReportingFee(bytes memory data) private {
        (
            address universeAddr,
            uint256 fee
        ) = abi.decode(data, (address, uint256));

        universe.reportingFee = fee;
    }

    function _syncMarketInfo(bytes memory data) private {
        (
            address universe,
            address market,
            address owner,
            uint256 endTime,
            uint256 creatorFee,
            uint256 numTicks,
            uint256 numberOfOutcomes,
            uint256 affiliateFeeDivisor
        ) = abi.decode(data, (address, address, address, uint256, uint256, uint256, uint256, uint256));

        require(markets[market].endTime == 0);

        markets[market] = MarketInfo({
            finalized: false,
            isInvalid: false,
            owner: owner,
            universe: universe,
            numTicks: numTicks,
            numberOfOutcomes: numberOfOutcomes,
            endTime: endTime,
            creatorFee: creatorFee,
            affiliateFeeDivisor: affiliateFeeDivisor,
            payoutNumerators: new uint256[](0)
        });
    }

    function isValid(address market) external view returns (bool) {
        return !markets[market].isInvalid;
    }

    function isFinalized(address market) external view returns (bool) {
        return markets[market].finalized;
    }

    function isFinalizedAsInvalid(address market) external view returns(bool) { 
        return markets[market].isInvalid;
    }

    function getOwner(address market) external view returns(address) {
        return markets[market].owner;
    }

    function getCreatorFee(address market) external view returns (uint256) {
        return markets[market].creatorFee;
    }

    function getUniverse(address market) external view returns (address) {
        return markets[market].universe;
    }

    function getNumTicks(address market) external view returns (uint256) {
        return markets[market].numTicks;
    }

    function getNumberOfOutcomes(address market) external view returns (uint256) {
        return markets[market].numberOfOutcomes;
    }

    function getWinningPayoutNumerator(address market, uint256 outcome)
        external
        view
        returns (uint256)
    {
      return markets[market].payoutNumerators[outcome];
    }

    function getAffiliateFeeDivisor(address market) external view returns (uint256) {
        return markets[market].affiliateFeeDivisor;
    }

    function getOrCacheReportingFeeDivisor() external view returns (uint256) {
        return universe.reportingFee;
    }

    function withdrawFees() public {
        uint256 withdrawalAmount = feesToken.balanceOf(address(this));
        require(minimumFeesForWithdrawal <= withdrawalAmount);

        feesToken.withdraw(withdrawalAmount);
    }
}
