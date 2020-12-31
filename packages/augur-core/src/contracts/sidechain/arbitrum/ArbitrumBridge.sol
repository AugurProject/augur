pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/ICash.sol';
import 'ROOT/sidechain/arbitrum/IGlobalInbox.sol';
import 'ROOT/sidechain/interfaces/IAugurPushBridge.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IParaOICash.sol';
import 'ROOT/para/ParaUniverse.sol';
import 'ROOT/para/ParaDeployer.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IUniverse.sol';


contract ArbitrumBridge {
    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    IAugurPushBridge private augurPushBridge;
    IAugur private augur;
    ParaDeployer private paraDeployer;
    address public owner;

    struct ArbChainData {
        IGlobalInbox inboxAddress;
        address marketGetterAddress;
    }

    // arbChainAddress => ArbChainData
    mapping(address => ArbChainData) private arbChainsRegistry;

    constructor(address _pushBridgeAddress, IAugur _augur, ParaDeployer _paraDeployer) public {
        augurPushBridge = IAugurPushBridge(_pushBridgeAddress);
        augur = _augur;
        paraDeployer = _paraDeployer;
        owner = msg.sender;
    }

    function registerArbchain(address _arbChainAddress, address _inboxAddress, address _marketGetterAddress) external isOwner returns (bool) {
        arbChainsRegistry[_arbChainAddress] = ArbChainData({
            inboxAddress: IGlobalInbox(_inboxAddress),
            marketGetterAddress: _marketGetterAddress
        });
        return true;
    }

    function pushBridgeData(address _marketAddress, address _arbChainAddress, uint256 _arbGasPrice, uint256 _arbGasLimit) external {
        ArbChainData memory _arbChainData = arbChainsRegistry[_arbChainAddress];
        require(_arbChainData.inboxAddress != IGlobalInbox(0), "Arbchain not registered");

        IMarket _market = IMarket(_marketAddress);
        require(augur.isKnownMarket(_market), "Market doesn't exist");

        IAugurPushBridge.MarketData memory _marketData = augurPushBridge.bridgeMarket(_market);
        bytes memory _blob = abi.encode(_marketData);
        bytes memory _marketDataPayload = abi.encodeWithSignature("receiveMarketData(bytes,address)", _blob, _marketAddress);
        bytes memory _l2MessagePayload = abi.encodePacked(uint8(1), _arbGasLimit, _arbGasPrice, uint256(uint160(bytes20(_arbChainData.marketGetterAddress))), uint256(0), _marketDataPayload);
        _arbChainData.inboxAddress.sendL2Message(_arbChainAddress, _l2MessagePayload);
    }

    function pushFeeData(IUniverse _universe, address _arbChainAddress, uint256 _arbGasPrice, uint256 _arbGasLimit) external {
        ArbChainData memory _arbChainData = arbChainsRegistry[_arbChainAddress];
        require(_arbChainData.inboxAddress != IGlobalInbox(0), "Arbchain not registered");

        uint256 _fee = augurPushBridge.bridgeReportingFee(_universe);
        bytes memory _feeData = abi.encodeWithSignature("receiveFeeData(uint256)", _fee);
        bytes memory _l2MessagePayload = abi.encodePacked(uint8(1), _arbGasLimit, _arbGasPrice, uint256(uint160(bytes20(_arbChainData.marketGetterAddress))), uint256(0), _feeData);
        _arbChainData.inboxAddress.sendL2Message(_arbChainAddress, _l2MessagePayload);
    }

    function depositOICash(address _arbChainAddress, ParaUniverse _universe, address _to, uint256 _value) external {
        ArbChainData memory _arbChainData = arbChainsRegistry[_arbChainAddress];
        require(_arbChainData.inboxAddress != IGlobalInbox(0), "Arbchain not registered");

        IERC20 _cash = _universe.cash();
        IParaOICash _oiCash = _universe.openInterestCash();
        IParaAugur _paraAugur = _universe.augur();

        _cash.transferFrom(msg.sender, address(this), _value); // get collateral from user
        _cash.approve(address(address(_paraAugur)), _value); // approve depositing collateral, to make oicash
        _oiCash.deposit(_value); // turn that collateral into OICash
        _oiCash.approve(address(_arbChainData.inboxAddress), _value); // approve the inbox to bridge the oicash
        _arbChainData.inboxAddress.depositERC20Message(_arbChainAddress, address(_oiCash), _to, _value); // send that oiCash to arbitrum, wherever the user wants it to go
    }

    // Bridges over any ERC20, including OICash
    function bridgeCash(address _arbChainAddress, IERC20 _cash, address _to, uint256 _value) public {
        ArbChainData memory _arbChainData = arbChainsRegistry[_arbChainAddress];
        require(_arbChainData.inboxAddress != IGlobalInbox(0), "Arbchain not registered");

        _cash.transferFrom(msg.sender, address(this), _value); // get tokens from user
        _cash.approve(address(_arbChainData.inboxAddress), _value);
        _arbChainData.inboxAddress.depositERC20Message(_arbChainAddress, address(_cash), _to, _value); // send cash to arbitrum, wherever the user wants it to go
    }

    function transferOwnership(address _newOwner) public isOwner {
        require(_newOwner != address(0));
        owner = _newOwner;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
}
