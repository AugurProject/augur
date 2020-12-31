pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/sidechain/interfaces/IAugurPushBridge.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/sidechain/arbitrum/IGlobalInbox.sol';

contract ArbitrumBridge {

    private IAugurPushBridge augurPushBridge;
    public address owner;

    struct ArbChainData {
        address inboxAddress;
        address marketGetterAddress;
    }

    mapping(address => ArbChainData ) private arbChainsRegistry;

    constructor(address _pushBridgeAddress) public {
        augurPushBridge = IAugurPushBridge(_pushBridgeAddress);
    }

    function registerArbchain(address arbChainAddress, address inboxAddress, address marketGetterAddress) external isOwner returns(bool) {
        arbChainsRegistry[arbChainAddress] = ArbChainData({
            inboxAddress: inboxAddress,
            marketGetterAddress: marketGetterAddress
        });
        return true;
    }


    function pushBridgeData (address marketAddress, address arbChainAddress, uint arbGasPrice) external returns(bool){
        ArbChainData memory arbChainData = arbChainsRegistry[arbChainAddress];
        require(arbChainData.inboxAddress != address(0), "Arbchain not registered");

        IMarket market = IMarket(marketAddress);
        require(market.owner != address(0), "Market doesn't exist");

        IAugurPushBridge.MarketData memory marketData = augurPushBridge.bridgeMarket(market);
        bytes memory marketDataPayload = abi.encodeWithSignature("receiveMarketData(bytes,address)",marketData, marketAddress);
        // todo: gas limit
        bytes memory l2MessagePayload = abi.encode(1000000, arbGasPrice, arbChainData.marketGetterAddress, 0, marketDataPayload);
        IGlobalInbox(arbChainData.inboxAddress).sendL2Message(arbChainAddress, l2MessagePayload);
        return true;
    }

    function pushFeeData (address universeAddress, address arbChainAddress, uint arbGasPrice) external returns(bool){
        ArbChainData memory arbChainData = arbChainsRegistry[arbChainAddress];
        require(arbChainData.exists, "Arbchain not registered");

        IUniverse universe = IUniverse(universeAddress);
        uint256 fee = augurPushBridge.bridgeReportingFee(universe);
        bytes memory feeData = abi.encodeWithSignature("receiveFeeData(bytes)", fee);
        // todo: gas limit
        bytes memory l2MessagePayload = abi.encode(1000000, arbGasPrice, arbChainData.marketGetterAddress, 0, feeData);
        IGlobalInbox(arbChainData.inboxAddress).sendL2Message(arbChainAddress,l2MessagePayload);
        return true;
    }

    function transferOwnership(address newOwner) public isOwner {
        require(newOwner != address(0));
        owner = newOwner;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
}
