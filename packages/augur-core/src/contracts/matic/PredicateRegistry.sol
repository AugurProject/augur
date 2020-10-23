pragma solidity 0.5.15;
import "ROOT/libraries/Ownable.sol";

contract PredicateRegistry is Ownable {
    struct Market {
        address rootMarket;
        uint256 numOutcomes;
        uint256 numTicks;
    }

    enum ContractType {
        Unknown,
        ZeroXTrade,
        ShareToken,
        Cash
    }

    enum DeprecationType {
        Unknown,
        Default,
        ShareToken,
        Cash
    }

    mapping(address => Market) public childToRootMarket;
    mapping(address => address) public zeroXExchange;

    // matic contracts
    address public zeroXTrade;
    address public defaultExchange;
    address public cash;
    address public shareToken;

    // predicate contracts
    address public rootZeroXTrade;


    function mapMarket(address childMarket, address rootMarket, uint256 numOutcomes, uint256 numTicks) public onlyOwner {
        childToRootMarket[childMarket] = Market(rootMarket, numOutcomes, numTicks);
    }

    function setZeroXTrade(address _zeroXTrade) public onlyOwner{
        zeroXTrade = _zeroXTrade;
    }

    function setRootZeroXTrade(address _zeroXTrade) public onlyOwner {
        rootZeroXTrade = _zeroXTrade;
    }

    function setZeroXExchange(address childExchange, address rootExchange, bool isDefaultExchange) public onlyOwner {
        zeroXExchange[childExchange] = rootExchange;
        if (isDefaultExchange) {
            defaultExchange = childExchange;
        }
    }

    function setCash(address _cash) public onlyOwner  {
        cash = _cash;
    }

    function setShareToken(address _shareToken) public onlyOwner {
        shareToken = _shareToken;
    }

    function getDeprecationType(address addr) public view returns(DeprecationType) {
        if (addr == zeroXTrade || addr == defaultExchange) {
            return DeprecationType.Default;
        } else if (addr == cash) {
            return DeprecationType.Cash;
        } else if (addr == shareToken) {
            return DeprecationType.ShareToken;
        }

        return DeprecationType.Unknown;
    }

    function getContractType(address addr) public view returns(ContractType) {
        if (addr == cash) {
            return ContractType.Cash;
        } else if (addr == shareToken) {
            return ContractType.ShareToken;
        } else if (addr == zeroXTrade) {
            return ContractType.ZeroXTrade;
        }

        return ContractType.Unknown;
    }

    function onTransferOwnership(address, address) internal {}
}
