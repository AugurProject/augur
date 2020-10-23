pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/Market.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/Universe.sol';
import 'ROOT/libraries/Ownable.sol';
import 'ROOT/matic/plasma/IStateSender.sol';
import 'ROOT/matic/plasma/IRegistry.sol';
import 'ROOT/matic/libraries/BytesLib.sol';

contract AugurSyncer is Ownable {
    uint256 private constant SYNC_MARKET_INFO_CMD = 1;
    uint256 private constant SYNC_REPORTING_FEE_CMD = 2;
    uint256 private constant SYNC_MARKET_MIGRATION_CMD = 3;
    uint256 private constant SYNC_MARKET_FINALIZE_CMD = 4;

    IStateSender public stateSender;
    IRegistry public registry;
    address public marketRegistry;

    function setMarketRegistry(address _marketRegistry) public onlyOwner {
        marketRegistry = _marketRegistry;
    }

    function setRegistry(IRegistry _registry) public onlyOwner {
        registry = _registry;
    }

    function updateChildChainAndStateSender() public {
        (, address _stateSender) = registry.getChildChainAndStateSender();
        stateSender = IStateSender(_stateSender);
    }

    function syncMarket(Market _market) public {
        syncWithCommand(
            SYNC_MARKET_INFO_CMD,
            encodeMarketArguments(
                _market.getUniverse(),
                _market,
                _market.getOwner(),
                _market.getEndTime(),
                _market.getMarketCreatorSettlementFeeDivisor(),
                _market.getNumTicks(),
                _market.getNumberOfOutcomes(),
                _market.affiliateFeeDivisor()
            )
        );
    }

    function migrateMarketIn(
        IUniverse _universe,
        IMarket _market,
        uint256 _cashBalance,
        uint256 _marketOI
    ) public onlyOwner {
        _universe.migrateMarketIn(_market, _cashBalance, _marketOI);
        syncWithCommand(
            SYNC_MARKET_MIGRATION_CMD,
            abi.encode(
                _universe,
                _universe.getOrCacheReportingFeeDivisor(),
                _market
            )
        );
    }

    function syncReportingFee(IUniverse _universe) public onlyOwner {
        syncWithCommand(
            SYNC_REPORTING_FEE_CMD,
            abi.encode(_universe, _universe.getOrCacheReportingFeeDivisor())
        );
    }

    function syncMarketFinalized(Market _market) public {
        require(_market.isFinalized(), "market is not finalized");

        syncWithCommand(
            SYNC_MARKET_FINALIZE_CMD,
            abi.encode(
                _market,
                _market.isFinalizedAsInvalid(),
                _market.getWinningReportingParticipant().getPayoutNumerators()
            )
        );
    }

    function syncWithCommand(uint256 cmd, bytes memory data) private {
        stateSender.syncState(marketRegistry, abi.encode(cmd, data));
    }

    function encodeMarketArguments(
        IUniverse universe,
        IMarket market,
        address owner,
        uint256 endTime,
        uint256 creatorFee,
        uint256 numTicks,
        uint256 numberOfOutcomes,
        uint256 affiliateFeeDivisor
    ) private pure returns (bytes memory) {
        return
            abi.encode(
                universe,
                market,
                owner,
                endTime,
                creatorFee,
                numTicks,
                numberOfOutcomes,
                affiliateFeeDivisor
            );
    }

    function onTransferOwnership(address, address) internal {}
}
