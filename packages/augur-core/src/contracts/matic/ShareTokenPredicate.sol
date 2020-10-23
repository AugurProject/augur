pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/matic/PredicateRegistry.sol';
import 'ROOT/matic/libraries/BytesLib.sol';
import 'ROOT/matic/libraries/RLPEncode.sol';
import 'ROOT/matic/libraries/RLPReader.sol';
import 'ROOT/matic/plasma/IWithdrawManager.sol';

import 'ROOT/matic/IExitShareToken.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/Initializable.sol';

contract ShareTokenPredicate is Initializable {
    using RLPReader for bytes;
    using RLPReader for RLPReader.RLPItem;

    event ExitFinalized(uint256 indexed exitId, address indexed exitor);

    // event ShareTokenBalanceChanged(address indexed universe, address indexed account, address indexed market, uint256 outcome, uint256 balance);
    bytes32
        internal constant SHARE_TOKEN_BALANCE_CHANGED_EVENT_SIG = 0x350ea32dc29530b9557420816d743c436f8397086f98c96292138edd69e01cb3;
    uint256 internal constant MAX_LOGS = 100;

    PredicateRegistry public predicateRegistry;
    IWithdrawManager public withdrawManager;

    // keccak256('unsafeTransferFrom(address,address,uint256,uint256)').slice(0, 4)
    bytes4 constant UNSAFE_TRANSFER_FROM_FUNC_SIG = 0xa9059cbb; // @todo write the correct sig
    // keccak256('unsafeBatchTransferFrom(address,address,uint256[],uint256[])').slice(0, 4)
    bytes4 constant UNSAFE_BATCH_TRANSFER_FROM_FUNC_SIG = 0xa9059cbb; // @todo write the correct sig

    function initialize(
        PredicateRegistry _predicateRegistry,
        IWithdrawManager _withdrawManager
    ) public // IErc20Predicate _erc20Predicate
    {
        endInitialization();
        predicateRegistry = _predicateRegistry;
        withdrawManager = _withdrawManager;
        // erc20Predicate = _erc20Predicate;
    }

    /**
     * @notice Proof receipt and index of the log (ShareTokenBalanceChanged) in the receipt to claim balance from Matic
     * @param data RLP encoded data of the reference tx (proof-of-funds) that encodes the following fields
     * headerNumber Header block number of which the reference tx was a part of
     * blockProof Proof that the block header (in the child chain) is a leaf in the submitted merkle root
     * blockNumber Block number of which the reference tx is a part of
     * blockTime Reference tx block time
     * blocktxRoot Transactions root of block
     * blockReceiptsRoot Receipts root of block
     * receipt Receipt of the reference transaction
     * receiptProof Merkle proof of the reference receipt
     * branchMask Merkle proof branchMask for the receipt
     * logIndex Log Index to read from the receipt
     */
    function parseData(bytes calldata data)
        external
        view
        returns (
            address account,
            address market,
            uint256 outcome,
            uint256 balance,
            uint256 age
        )
    {
        RLPReader.RLPItem[] memory referenceTxData = data.toRlpItem().toList();
        bytes memory receipt = referenceTxData[6].toBytes();
        RLPReader.RLPItem[] memory inputItems = receipt.toRlpItem().toList();
        uint256 logIndex = referenceTxData[9].toUint();
        require(logIndex < MAX_LOGS, 'Supporting a max of 100 logs');
        age = withdrawManager.verifyInclusion(
            data,
            0, /* offset */
            false /* verifyTxInclusion */
        );
        inputItems = inputItems[3].toList()[logIndex].toList(); // select log based on given logIndex
        bytes memory logData = inputItems[2].toBytes();
        inputItems = inputItems[1].toList(); // topics
        // now, inputItems[i] refers to i-th (0-based) topic in the topics array
        require(
            bytes32(inputItems[0].toUint()) ==
                SHARE_TOKEN_BALANCE_CHANGED_EVENT_SIG,
            'ShareTokenPredicate.parseData: Not ShareTokenBalanceChanged event signature'
        );
        // inputItems[1] is the universe
        account = address(inputItems[2].toUint());
        market = address(inputItems[3].toUint());
        outcome = BytesLib.toUint(logData, 0);
        balance = BytesLib.toUint(logData, 32);
    }

    function executeInFlightTransaction(
        bytes memory txData,
        address signer,
        IExitShareToken exitShareToken
    ) public returns (int256 nonce) {
        RLPReader.RLPItem[] memory txList = txData.toRlpItem().toList();
        nonce = int256(txList[0].toUint());
        txData = RLPReader.toBytes(txList[5]);
        bytes4 funcSig = BytesLib.toBytes4(BytesLib.slice(txData, 0, 4));
        if (funcSig == UNSAFE_TRANSFER_FROM_FUNC_SIG) {
            (address from, address to, uint256 id, uint256 value) = abi.decode(
                BytesLib.slice(txData, 4, txData.length - 4),
                (address, address, uint256, uint256)
            );
            require(signer == from, 'signer != from');
            exitShareToken.unsafeTransferFrom(
                from,
                to,
                repackageTokenId(id),
                value
            );
        } else if (funcSig == UNSAFE_BATCH_TRANSFER_FROM_FUNC_SIG) {
            (
                address from,
                address to,
                uint256[] memory id,
                uint256[] memory value
            ) = abi.decode(
                BytesLib.slice(txData, 4, txData.length - 4),
                (address, address, uint256[], uint256[])
            );
            require(signer == from, 'signer != from');
            exitShareToken.unsafeBatchTransferFrom(
                from,
                to,
                repackageTokenIds(id),
                value
            );
        } else {
            revert('Inflight tx type not supported');
        }
    }

    function isValidDeprecation(bytes memory txData)
        public
        pure
        returns (bool)
    {
        bytes4 funcSig = BytesLib.toBytes4(BytesLib.slice(txData, 0, 4));
        if (
            funcSig == UNSAFE_TRANSFER_FROM_FUNC_SIG ||
            funcSig == UNSAFE_BATCH_TRANSFER_FROM_FUNC_SIG
        ) {
            return true;
        }
    }

    function repackageTokenIds(uint256[] memory _tokenIds)
        internal
        view
        returns (uint256[] memory tokenIds)
    {
        tokenIds = new uint256[](_tokenIds.length);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            tokenIds[i] = repackageTokenId(_tokenIds[i]);
        }
    }

    function repackageTokenId(uint256 _tokenId)
        internal
        view
        returns (
            uint256 /* tokenId */
        )
    {
        (address _market, uint256 _outcome) = unpackTokenId(_tokenId);
        (address _rootMarket, , ) = predicateRegistry.childToRootMarket(
            _market
        );
        require(
            _rootMarket != address(0x0),
            'repackageTokenId: Market does not exist'
        );
        return getTokenId(IMarket(_rootMarket), _outcome);
    }

    function getTokenId(IMarket _market, uint256 _outcome)
        internal
        pure
        returns (uint256 _tokenId)
    {
        bytes memory _tokenIdBytes = abi.encodePacked(_market, uint8(_outcome));
        assembly {
            _tokenId := mload(add(_tokenIdBytes, add(0x20, 0)))
        }
    }

    function unpackTokenId(uint256 _tokenId)
        internal
        pure
        returns (address _market, uint256 _outcome)
    {
        assembly {
            _market := shr(
                96,
                and(
                    _tokenId,
                    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000000
                )
            )
            _outcome := shr(
                88,
                and(
                    _tokenId,
                    0x0000000000000000000000000000000000000000FF0000000000000000000000
                )
            )
        }
    }
}
