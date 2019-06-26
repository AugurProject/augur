pragma solidity 0.5.4;

import 'ROOT/libraries/IERC1820Registry.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/reporting/IInitialReporter.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/BaseReportingParticipant.sol';
import 'ROOT/libraries/Ownable.sol';
import 'ROOT/IAugur.sol';


contract InitialReporter is Ownable, BaseReportingParticipant, Initializable, IInitialReporter {
    address private designatedReporter;
    address private actualReporter;
    uint256 private reportTimestamp;

    function initialize(IAugur _augur, IMarket _market, address _designatedReporter) public beforeInitialized {
        endInitialization();
        augur = _augur;
        market = _market;
        reputationToken = market.getUniverse().getReputationToken();
        designatedReporter = _designatedReporter;
    }

    function redeem(address) public returns (bool) {
        bool _isDisavowed = isDisavowed();
        if (!_isDisavowed && !market.isFinalized()) {
            market.finalize();
        }
        uint256 _repBalance = reputationToken.balanceOf(address(this));
        require(reputationToken.transfer(owner, _repBalance));
        if (!_isDisavowed) {
            augur.logInitialReporterRedeemed(market.getUniverse(), owner, address(market), size, _repBalance, payoutNumerators);
        }
        return true;
    }

    function report(address _reporter, bytes32 _payoutDistributionHash, uint256[] memory _payoutNumerators, uint256 _initialReportStake) public {
        require(IMarket(msg.sender) == market);
        require(reportTimestamp == 0, "InitialReporter.report: Report has already been placed");
        uint256 _timestamp = augur.getTimestamp();
        bool _isDesignatedReporter = _reporter == getDesignatedReporter();
        bool _designatedReportingExpired = _timestamp > market.getDesignatedReportingEndTime();
        require(_designatedReportingExpired || _isDesignatedReporter, "InitialReporter.report: Reporting time not started");
        actualReporter = _reporter;
        owner = _reporter;
        payoutDistributionHash = _payoutDistributionHash;
        reportTimestamp = _timestamp;
        payoutNumerators = _payoutNumerators;
        size = _initialReportStake;
    }

    function returnRepFromDisavow() public {
        require(IMarket(msg.sender) == market);
        require(reputationToken.transfer(owner, reputationToken.balanceOf(address(this))));
        reportTimestamp = 0;
    }

    function migrateToNewUniverse(address _designatedReporter) public {
        require(IMarket(msg.sender) == market);
        designatedReporter = _designatedReporter;
        reputationToken = market.getUniverse().getReputationToken();
    }

    function forkAndRedeem() public returns (bool) {
        if (!isDisavowed()) {
            augur.logInitialReporterRedeemed(market.getUniverse(), owner, address(market), size, reputationToken.balanceOf(address(this)), payoutNumerators);
        }
        fork();
        redeem(msg.sender);
        return true;
    }

    function getStake() public view returns (uint256) {
        return size;
    }

    function getDesignatedReporter() public view returns (address) {
        return designatedReporter;
    }

    function getReportTimestamp() public view returns (uint256) {
        return reportTimestamp;
    }

    function designatedReporterShowed() public view returns (bool) {
        return actualReporter == designatedReporter;
    }

    function getReputationToken() public view returns (IReputationToken) {
        return reputationToken;
    }

    function designatedReporterWasCorrect() public view returns (bool) {
        return payoutDistributionHash == market.getWinningPayoutDistributionHash();
    }

    function onTransferOwnership(address _owner, address _newOwner) internal {
        augur.logInitialReporterTransferred(market.getUniverse(), market, _owner, _newOwner);
    }
}
