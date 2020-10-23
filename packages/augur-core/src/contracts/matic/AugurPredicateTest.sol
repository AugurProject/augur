pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import { IMarket } from "ROOT/reporting/IMarket.sol";
import { AugurPredicate } from "ROOT/matic/AugurPredicate.sol";

contract AugurPredicateTest is AugurPredicate {
    function claimShareBalanceFaucet(address to, address market, uint256 outcome, uint256 balance) external {
       uint256 exitId = getExitId(msg.sender);
        require(
            address(lookupExit[exitId].exitShareToken) != address(0x0),
            "Predicate.claimBalanceFaucet: Please call initializeForExit first"
        );
        address _rootMarket = _checkAndAddMaticMarket(exitId, market);
        lookupExit[exitId].exitPriority = now; // dummy
        setIsExecuting(exitId, true);
        // lookupExit[exitId].exitShareToken.mint(to, _rootMarket, outcome, balance);
        setIsExecuting(exitId, false);
    }

    function claimCashBalanceFaucet(uint256 amount, address participant) external {
        uint256 exitId = getExitId(msg.sender);
        require(
            address(lookupExit[exitId].exitShareToken) != address(0x0),
            "Predicate.claimCashBalance: Please call initializeForExit first"
        );
        lookupExit[exitId].exitPriority = now; // dummy
        setIsExecuting(exitId, true);
        // lookupExit[exitId].exitCash.joinMint(participant, amount);
        setIsExecuting(exitId, false);
    }

    // we could consider actually giving this option to the user
    function clearExit(address _exitor) public {
        delete lookupExit[getExitId(_exitor)];
    }

    function processExitForMarketTest(IMarket market, address exitor, uint256 exitId) public {
        processExitForMarket(market, exitor, exitId);
    }

    function processExitForFinalizedMarketTest(IMarket market, address exitor, uint256 exitId) public {
        processExitForFinalizedMarket(market, exitor, exitId);
    }
}
