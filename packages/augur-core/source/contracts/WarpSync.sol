pragma solidity 0.5.10;

import 'ROOT/IWarpSync.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/external/IAffiliateValidator.sol';
import 'ROOT/libraries/Initializable.sol';


contract WarpSync is IWarpSync, Initializable {

    struct Data {
        uint256 warpSyncHash;
        uint256 timestamp;
    }

    IAugur public augur;
    mapping(address => address) public markets;
    mapping(address => Data) public data;

    uint256 private constant MARKET_LENGTH = 1 days;
    uint256 private constant MAX_NUM_TICKS = 2 ** 256 - 2;
    int256[] private PRICES = [0, 1 ether];
    string private constant EXTRA_INFO = '{"description":"What will the next Augur Warp Sync hash be?","longDescription":"What will the Augur SDK warp sync hash be for the last block with a timestamp less than the reporting start timestamp for this market?"}';

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        return true;
    }

    function doInitialReport(IUniverse _universe, uint256[] memory _payoutNumerators, string memory _description, uint256 _additionalStake) public returns (bool) {
        IMarket _market = IMarket(markets[address(_universe)]);
        _market.doInitialReport(_payoutNumerators, _description, _additionalStake);
        _market.getInitialReporter().transferOwnership(msg.sender);
    }

    function initializeUniverse(IUniverse _universe) public {
        require(augur.isKnownUniverse(_universe));
        require(markets[address(_universe)] == address(0));
        awardRep(_universe, getCreationReward(_universe));
        createMarket(_universe);
    }

    function notifyMarketFinalized() public {
        IMarket _market = IMarket(msg.sender);
        IUniverse _universe = _market.getUniverse();

        // NOTE: This validates that the market is legitimate. A malicious market has no way of modifying this mapping to pass here.
        if (markets[address(_universe)] != address(_market)) {
            return;
        }

        recordMarketFinalized(_market, _universe);

        if (!_universe.isForking()) {
            createMarket(_universe);
        }
    }

    function recordMarketFinalized(IMarket _market, IUniverse _universe) private {
        awardRep(_universe, getFinalizationReward(_market));
        data[address(_universe)].warpSyncHash = _market.getWinningPayoutNumerator(2);
        data[address(_universe)].timestamp = _market.getEndTime();
    }

    function getFinalizationReward(IMarket _market) public view returns (uint256) {
        return getRepReward(_market.getDisputeWindow().getEndTime());
    }

    function getCreationReward(IUniverse _universe) public view returns (uint256) {
        return getRepReward(_universe.creationTime());
    }

    function getRepReward(uint256 _theoreticalTime) private view returns (uint256) {
        uint256 _currentTime = augur.getTimestamp();
        uint256 _timeSinceTheoreticalCreationInSeconds = _currentTime - _theoreticalTime;
        return (_timeSinceTheoreticalCreationInSeconds ** 3) * 1000;
    }

    function awardRep(IUniverse _universe, uint256 _amount) private returns (bool) {
        IV2ReputationToken _reputationToken = _universe.getReputationToken();
        // Whoever was responsible for this tx occuring gets REP.
        // solium-disable-next-line security/no-tx-origin
        _reputationToken.mintForWarpSync(_amount, tx.origin);
        return true;
    }

    function createMarket(IUniverse _universe) private {
        IV2ReputationToken _reputationToken = _universe.getReputationToken();
        uint256 _repBond = _universe.getOrCacheMarketRepBond();
        _reputationToken.mintForWarpSync(_repBond, address(this));
        uint256 _endTime = augur.getTimestamp() + MARKET_LENGTH;
        IMarket _market = _universe.createScalarMarket(_endTime, 0, IAffiliateValidator(0), 0, address(this), PRICES, MAX_NUM_TICKS, EXTRA_INFO);
        markets[address(_universe)] = address(_market);
    }
}