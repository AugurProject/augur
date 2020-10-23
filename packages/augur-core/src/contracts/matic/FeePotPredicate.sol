pragma solidity 0.5.15;

import 'ROOT/libraries/Ownable.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';

import 'ROOT/matic/plasma/IWithdrawManager.sol';
import 'ROOT/matic/libraries/ProofReader.sol';
import 'ROOT/matic/libraries/BytesLib.sol';
import 'ROOT/matic/plasma/IErc20Predicate.sol';
import 'ROOT/matic/IAugurPredicate.sol';

contract FeePotPredicate is Ownable, Initializable {
    using RLPReader for bytes;
    using RLPReader for RLPReader.RLPItem;
    using SafeMathUint256 for uint256;

    uint256 public constant FEE_PRECISION = 1000; // 0.1%

    event ExitFinalized(uint256 indexed exitId, address indexed exitor, uint256 feesDeposited, uint256 exitorReward);
    
    uint256 public exitorFee;
    address public childFeePot;
    IWithdrawManager public withdrawManager;
    IErc20Predicate public erc20Predicate;
    IAugurPredicate public augurPredicate;

    function initialize(
        IWithdrawManager _withdrawManager, 
        IErc20Predicate _erc20Predicate, 
        address _childFeePot,
        IAugurPredicate _augurPredicate
    )
        public
        beforeInitialized
    {
        endInitialization();

        augurPredicate = _augurPredicate;
        childFeePot = _childFeePot;
        erc20Predicate = _erc20Predicate;
        withdrawManager = _withdrawManager;
    }

    function onTransferOwnership(address, address) internal {}

    function setExitorFee(uint256 _fee) public onlyOwner {
        exitorFee = _fee;
    }

    function startExitWithBurntFees(bytes calldata data) external {
        bytes memory _preState = erc20Predicate.interpretStateUpdate(
            abi.encode(
                data,
                childFeePot,
                true, /* verifyInclusionInCheckpoint */
                false /* isChallenge */
            )
        );

        (uint256 exitAmount, uint256 age, address childToken, address rootToken) = abi.decode(
            _preState,
            (uint256, uint256, address, address)
        );

        RLPReader.RLPItem[] memory log = ProofReader.getLog(
            ProofReader.convertToExitPayload(data)
        );
        exitAmount = BytesLib.toUint(log[2].toBytes(), 0);

        withdrawManager.addExitToQueue(
            msg.sender,
            childToken,
            rootToken,
            exitAmount,
            bytes32(0x0),
            true, /* isRegularExit */
            age << 1
        );
    }

    function onFinalizeExit(bytes calldata data) external {
      require(
          msg.sender == address(withdrawManager),
          'only withdraw manager'
      );

        (
            uint256 exitId
            ,
            ,
            address exitor,
            uint256 exitAmount,
        ) = abi.decode(data, (uint256, address, address, uint256, bool));

        // reward exitor
        uint256 reward = exitAmount.mul(exitorFee).div(FEE_PRECISION);

        augurPredicate.trustedTransfer(exitor, reward);
        // deposit the rest
        augurPredicate.depositToFeePot(exitAmount - reward);

        emit ExitFinalized(exitId, exitor, exitAmount.sub(reward), reward);
    }
}
