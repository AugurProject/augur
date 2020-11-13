pragma solidity 0.5.15;

import 'ROOT/libraries/token/ERC1155.sol';
import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/sidechain/interfaces/ISideChainAugur.sol';
import 'ROOT/libraries/TokenId.sol';
import 'ROOT/sidechain/IMarketGetter.sol';
import 'ROOT/reporting/IAffiliates.sol';
import 'ROOT/reporting/Reporting.sol';


/**
 * @title Side Chain Share Token
 * @notice ERC1155 contract to hold all Augur share token balances
 */
contract SideChainShareToken is ITyped, Initializable, ERC1155, ReentrancyGuard {

    string constant public name = "Shares";
    string constant public symbol = "SHARE";

    ISideChainAugur public augur;
    ICash public cash;
    IAffiliates public affiliates;
    IMarketGetter public marketGetter;
    address public repFeeTarget;

    mapping(address => uint256) marketOI; // Market => total funds
    mapping(address => uint256) marketCreatorFees; // Market => creator fees
    uint256 public repFees;

    function initialize(ISideChainAugur _augur) external beforeInitialized {
        endInitialization();
        augur = _augur;
        cash = ICash(_augur.lookup("Cash"));
        marketGetter = IMarketGetter(_augur.lookup("MarketGetter"));
        affiliates = IAffiliates(_augur.lookup("Affiliates"));
        repFeeTarget = _augur.lookup("RepFeeTarget");
        require(marketGetter != IMarketGetter(0));
        require(affiliates != IAffiliates(0));
        require(cash != ICash(0));
        require(repFeeTarget != address(0));
    }

    /**
        @dev Transfers `value` amount of an `id` from the `from` address to the `to` address specified.
        Caller must be approved to manage the tokens being transferred out of the `from` account.
        Regardless of if the desintation is a contract or not this will not call `onERC1155Received` on `to`
        @param _from Source address
        @param _to Target address
        @param _id ID of the token type
        @param _value Transfer amount
    */
    function unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value) public {
        _transferFrom(_from, _to, _id, _value, bytes(""), false);
    }

    /**
        @dev Transfers `values` amount(s) of `ids` from the `from` address to the
        `to` address specified. Caller must be approved to manage the tokens being
        transferred out of the `from` account. Regardless of if the desintation is
        a contract or not this will not call `onERC1155Received` on `to`
        @param _from Source address
        @param _to Target address
        @param _ids IDs of each token type
        @param _values Transfer amounts per token type
    */
    function unsafeBatchTransferFrom(address _from, address _to, uint256[] memory _ids, uint256[] memory _values) public {
        _batchTransferFrom(_from, _to, _ids, _values, bytes(""), false);
    }

    /**
     * @notice Buy some amount of complete sets for a market
     * @param _market The market to purchase complete sets in
     * @param _amount The number of complete sets to purchase
     * @return Bool True
     */
    function publicBuyCompleteSets(address _market, uint256 _amount) external returns (bool) {
        buyCompleteSetsInternal(_market, msg.sender, _amount);
        augur.logCompleteSetsPurchased(marketGetter.getUniverse(_market), _market, msg.sender, _amount);
        return true;
    }

    /**
     * @notice Buy some amount of complete sets for a market
     * @param _market The market to purchase complete sets in
     * @param _account The account receiving the complete sets
     * @param _amount The number of complete sets to purchase
     * @return Bool True
     */
    function buyCompleteSets(address _market, address _account, uint256 _amount) external returns (bool) {
        buyCompleteSetsInternal(_market, _account, _amount);
        return true;
    }

    function buyCompleteSetsInternal(address _market, address _account, uint256 _amount) internal returns (bool) {
        uint256 _numOutcomes = marketGetter.getNumberOfOutcomes(_market);
        uint256 _numTicks = marketGetter.getNumTicks(_market);

        require(_numOutcomes != 0, "Invalid Market provided");

        IUniverse _universe = marketGetter.getUniverse(_market);

        uint256 _cost = _amount.mul(_numTicks);
        deposit(msg.sender, _cost, _market);

        uint256[] memory _tokenIds = new uint256[](_numOutcomes);
        uint256[] memory _values = new uint256[](_numOutcomes);

        for (uint256 _i = 0; _i < _numOutcomes; _i++) {
            _tokenIds[_i] = TokenId.getTokenId(_market, _i);
            _values[_i] = _amount;
        }

        _mintBatch(_account, _tokenIds, _values, bytes(""), false);

        augur.logMarketOIChanged(_universe, _market, marketOI[_market]);

        return true;
    }

    /**
     * @notice Buy some amount of complete sets for a market and distribute the shares according to the positions of two accounts
     * @param _market The market to purchase complete sets in
     * @param _amount The number of complete sets to purchase
     * @param _longOutcome The outcome for the trade being fulfilled
     * @param _longRecipient The account which should recieve the _longOutcome shares
     * @param _shortRecipient The account which should recieve shares of every outcome other than _longOutcome
     * @return Bool True
     */
    function buyCompleteSetsForTrade(address _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient) external returns (bool) {
        uint256 _numOutcomes = marketGetter.getNumberOfOutcomes(_market);

        require(_numOutcomes != 0, "Invalid Market provided");
        require(_longOutcome < _numOutcomes);

        IUniverse _universe = marketGetter.getUniverse(_market);

        {
            uint256 _numTicks = marketGetter.getNumTicks(_market);
            uint256 _cost = _amount.mul(_numTicks);
            deposit(msg.sender, _cost, _market);
        }

        {
        uint256[] memory _tokenIds = new uint256[](_numOutcomes - 1);
        uint256[] memory _values = new uint256[](_numOutcomes - 1);
        uint256 _outcome = 0;

        for (uint256 _i = 0; _i < _numOutcomes - 1; _i++) {
            if (_outcome == _longOutcome) {
                _outcome++;
            }
            _tokenIds[_i] = TokenId.getTokenId(_market, _outcome);
            _values[_i] = _amount;
            _outcome++;
        }

        _mintBatch(_shortRecipient, _tokenIds, _values, bytes(""), false);
        _mint(_longRecipient, TokenId.getTokenId(_market, _longOutcome), _amount, bytes(""), false);
        }

        augur.logMarketOIChanged(_universe, _market, marketOI[_market]);

        return true;
    }

    /**
     * @notice Sell some amount of complete sets for a market
     * @param _market The market to sell complete sets in
     * @param _amount The number of complete sets to sell
     * @return (uint256 _creatorFee, uint256 _reportingFee) The fees taken for the market creator and reporting respectively
     */
    function publicSellCompleteSets(address _market, uint256 _amount) external returns (uint256 _creatorFee, uint256 _reportingFee) {
        (uint256 _payout, uint256 _creatorFee, uint256 _reportingFee) = burnCompleteSets(_market, msg.sender, _amount, msg.sender);

        require(cash.transfer(msg.sender, _payout));

        IUniverse _universe = marketGetter.getUniverse(_market);
        augur.logCompleteSetsSold(_universe, _market, msg.sender, _amount, _creatorFee.add(_reportingFee));

        return (_creatorFee, _reportingFee);
    }

    /**
     * @notice Sell some amount of complete sets for a market
     * @param _market The market to sell complete sets in
     * @param _holder The holder of the complete sets
     * @param _recipient The recipient of funds from the sale
     * @param _amount The number of complete sets to sell
     * @return (uint256 _creatorFee, uint256 _reportingFee) The fees taken for the market creator and reporting respectively
     */
    function sellCompleteSets(address _market, address _holder, address _recipient, uint256 _amount) external returns (uint256 _creatorFee, uint256 _reportingFee) {
        require(_holder == msg.sender || isApprovedForAll(_holder, msg.sender) == true, "ERC1155: need operator approval to sell complete sets");
        
        (uint256 _payout, uint256 _creatorFee, uint256 _reportingFee) = burnCompleteSets(_market, _holder, _amount, _holder);

        require(cash.transfer(_recipient, _payout));

        return (_creatorFee, _reportingFee);
    }

    /**
     * @notice Sell some amount of complete sets for a market
     * @param _market The market to sell complete sets in
     * @param _amount The number of complete sets to sell
     * @param _shortParticipant The account which should provide the short party portion of shares
     * @param _longParticipant The account which should provide the long party portion of shares
     * @param _longRecipient The account which should receive the remaining payout for providing the matching shares to the short recipients shares
     * @param _shortRecipient The account which should recieve the (price * shares provided) payout for selling their side of the sale
     * @param _price The price of the trade being done. This determines how much each recipient recieves from the sale proceeds
     * @return (uint256 _creatorFee, uint256 _reportingFee) The fees taken for the market creator and reporting respectively
     */
    function sellCompleteSetsForTrade(address _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _sourceAccount) external returns (uint256 _creatorFee, uint256 _reportingFee) {
        require(isApprovedForAll(_shortParticipant, msg.sender) == true, "ERC1155: need operator approval to burn short account shares");
        require(isApprovedForAll(_longParticipant, msg.sender) == true, "ERC1155: need operator approval to burn long account shares");

        _internalTransferFrom(_shortParticipant, _longParticipant, getTokenId(_market, _outcome), _amount, bytes(""), false);

        // NOTE: burnCompleteSets will validate the market provided is legitimate
        (uint256 _payout, uint256 _creatorFee, uint256 _reportingFee) = burnCompleteSets(_market, _longParticipant, _amount, _sourceAccount);

        doCompleteSetPayout(_market, _longRecipient, _shortRecipient, _price, _payout);

        return (_creatorFee, _reportingFee);
    }

    function doCompleteSetPayout(address _market, address _longRecipient, address _shortRecipient, uint256 _price, uint256 _payout) private {
        uint256 _longPayout = _payout.mul(_price) / marketGetter.getNumTicks(_market);
        require(cash.transfer(_longRecipient, _longPayout));
        require(cash.transfer(_shortRecipient, _payout.sub(_longPayout)));
    }

    function burnCompleteSets(address _market, address _account, uint256 _amount, address _sourceAccount) private returns (uint256 _payout, uint256 _creatorFee, uint256 _reportingFee) {
        uint256 _numOutcomes = marketGetter.getNumberOfOutcomes(_market);
        uint256 _numTicks = marketGetter.getNumTicks(_market);

        require(_numOutcomes != 0, "Invalid Market provided");

        // solium-disable indentation
        {
            uint256[] memory _tokenIds = new uint256[](_numOutcomes);
            uint256[] memory _values = new uint256[](_numOutcomes);

            for (uint256 i = 0; i < _numOutcomes; i++) {
                _tokenIds[i] = TokenId.getTokenId(_market, i);
                _values[i] = _amount;
            }

            _burnBatch(_account, _tokenIds, _values, bytes(""), false);
        }
        // solium-enable indentation

        _payout = _amount.mul(_numTicks);
        IUniverse _universe = marketGetter.getUniverse(_market);

        _creatorFee = deriveMarketCreatorFeeAmount(_market, _payout);
        {
        uint256 _reportingFeeDivisor = marketGetter.getOrCacheReportingFeeDivisor();
        _reportingFee = _payout.div(_reportingFeeDivisor);
        }
        _payout = _payout.sub(_creatorFee).sub(_reportingFee);

        if (_creatorFee != 0) {
            recordMarketCreatorFees(_market, _creatorFee, _sourceAccount);
        }

        if (_reportingFee != 0) {
            repFees = repFees.add(_reportingFee);
        }

        augur.logMarketOIChanged(_universe, _market, marketOI[_market]);
    }

    /**
     * @notice Claims winnings for a market and for a particular shareholder
     * @param _market The market to claim winnings for
     * @param _shareHolder The account to claim winnings for
     * @return Bool True
     */
    function claimTradingProceeds(address _market, address _shareHolder) external nonReentrant returns (uint256[] memory _outcomeFees) {
        return claimTradingProceedsInternal(_market, _shareHolder);
    }

    function claimTradingProceedsInternal(address _market, address _shareHolder) internal returns (uint256[] memory _outcomeFees) {
        require(augur.isKnownMarket(_market));
        require(marketGetter.isFinalized(_market));
        _outcomeFees = new uint256[](8);
        for (uint256 _outcome = 0; _outcome < marketGetter.getNumberOfOutcomes(_market); ++_outcome) {
            uint256 _numberOfShares = balanceOfMarketOutcome(_market, _outcome, _shareHolder);

            if (_numberOfShares > 0) {
                uint256 _proceeds;
                uint256 _shareHolderShare;
                uint256 _creatorShare;
                uint256 _reporterShare;
                uint256 _tokenId = TokenId.getTokenId(_market, _outcome);
                (_proceeds, _shareHolderShare, _creatorShare, _reporterShare) = divideUpWinnings(_market, _outcome, _numberOfShares);

                // always destroy shares as it gives a minor gas refund and is good for the network
                _burn(_shareHolder, _tokenId, _numberOfShares, bytes(""), false);
                logTradingProceedsClaimed(_market, _outcome, _shareHolder, _numberOfShares, _shareHolderShare, _creatorShare.add(_reporterShare));

                if (_proceeds > 0) {
                    distributeProceeds(_market, _shareHolder, _shareHolderShare, _creatorShare, _reporterShare);
                }
                _outcomeFees[_outcome] = _creatorShare.add(_reporterShare);
            }
        }

        return _outcomeFees;
    }

    function distributeProceeds(address _market, address _shareHolder, uint256 _shareHolderShare, uint256 _creatorShare, uint256 _reporterShare) private {
        if (_shareHolderShare > 0) {
            require(cash.transfer(_shareHolder, _shareHolderShare));
        }
        if (_creatorShare > 0) {
            recordMarketCreatorFees(_market, _creatorShare, _shareHolder);
        }
        if (_reporterShare > 0) {
            repFees = repFees.add(_reporterShare);
        }
    }

    function logTradingProceedsClaimed(address _market, uint256 _outcome, address _sender, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) private {
        augur.logTradingProceedsClaimed(marketGetter.getUniverse(_market), _sender, _market, _outcome, _numShares, _numPayoutTokens, _fees);
    }

    function divideUpWinnings(address _market, uint256 _outcome, uint256 _numberOfShares) public view returns (uint256 _proceeds, uint256 _shareHolderShare, uint256 _creatorShare, uint256 _reporterShare) {
        _proceeds = calculateProceeds(_market, _outcome, _numberOfShares);
        _creatorShare = calculateCreatorFee(_market, _proceeds);
        _reporterShare = calculateReportingFee(_market, _proceeds);
        _shareHolderShare = _proceeds.sub(_creatorShare).sub(_reporterShare);
        return (_proceeds, _shareHolderShare, _creatorShare, _reporterShare);
    }

    function calculateProceeds(address _market, uint256 _outcome, uint256 _numberOfShares) public view returns (uint256) {
        uint256 _payoutNumerator = marketGetter.getWinningPayoutNumerator(_market, _outcome);
        return _numberOfShares.mul(_payoutNumerator);
    }

    function calculateReportingFee(address _market, uint256 _amount) public view returns (uint256) {
        uint256 _reportingFeeDivisor = marketGetter.getOrCacheReportingFeeDivisor();
        return _amount.div(_reportingFeeDivisor);
    }

    function calculateCreatorFee(address _market, uint256 _amount) public view returns (uint256) {
        return deriveMarketCreatorFeeAmount(_market, _amount);
    }

    function getTypeName() public view returns(bytes32) {
        return "ShareToken";
    }

    /**
     * @return The market associated with this Share Token ID
     */
    function getMarket(uint256 _tokenId) external pure returns(address) {
        (address _market, uint256 _outcome) = TokenId.unpackTokenId(_tokenId);
        return _market;
    }

    function deriveMarketCreatorFeeAmount(address _market, uint256 _amount) public view returns (uint256) {
        uint256 _marketCreatorFeeDivisor = marketGetter.getCreatorFee(_market);
        return _marketCreatorFeeDivisor == 0 ? 0 : _amount / _marketCreatorFeeDivisor;
    }

    /**
     * @return The outcome associated with this Share Token ID
     */
    function getOutcome(uint256 _tokenId) external pure returns(uint256) {
        (address _market, uint256 _outcome) = TokenId.unpackTokenId(_tokenId);
        return _outcome;
    }

    function totalSupplyForMarketOutcome(address _market, uint256 _outcome) public view returns (uint256) {
        uint256 _tokenId = TokenId.getTokenId(_market, _outcome);
        return totalSupply(_tokenId);
    }

    function balanceOfMarketOutcome(address _market, uint256 _outcome, address _account) public view returns (uint256) {
        uint256 _tokenId = TokenId.getTokenId(_market, _outcome);
        return balanceOf(_account, _tokenId);
    }

    function lowestBalanceOfMarketOutcomes(address _market, uint256[] memory _outcomes, address _account) public view returns (uint256) {
        uint256 _lowest = SafeMathUint256.getUint256Max();
        for (uint256 _i = 0; _i < _outcomes.length; ++_i) {
            uint256 _tokenId = TokenId.getTokenId(_market, _outcomes[_i]);
            _lowest = balanceOf(_account, _tokenId).min(_lowest);
        }
        return _lowest;
    }

    function deposit(address _sender, uint256 _amount, address _market) private returns (bool) {
        augur.trustedCashTransfer(_sender, address(this), _amount);
        marketOI[_market] = marketOI[_market].add(_amount);
        return true;
    }

    function withdraw(address _recipient, uint256 _amount, address _market) private returns (bool) {
        if (_amount == 0) {
            return true;
        }
        marketOI[_market] = marketOI[_market].sub(_amount);
        require(cash.transfer(_recipient, _amount));
        return true;
    }

    function recordMarketCreatorFees(address _market, uint256 _marketCreatorFees, address _sourceAccount) private {
        uint256 _affiliateFeeDivisor = marketGetter.getAffiliateFeeDivisor(_market);
        if (_affiliateFeeDivisor != 0) {
            address _affiliateAddress = affiliates.getAndValidateReferrer(_sourceAccount, IAffiliateValidator(0));

            if (_affiliateAddress != address(0)) {
                uint256 _totalAffiliateFees = _marketCreatorFees / _affiliateFeeDivisor;
                uint256 _sourceCut = _totalAffiliateFees / Reporting.getAffiliateSourceCutDivisor();
                uint256 _affiliateFees = _totalAffiliateFees.sub(_sourceCut);
                withdraw(_sourceAccount, _sourceCut, _market);
                distributeAffiliateFees(_market, _affiliateAddress, _affiliateFees);
                _marketCreatorFees = _marketCreatorFees.sub(_totalAffiliateFees);
            }
        }

        marketCreatorFees[_market] = marketCreatorFees[_market].add(_marketCreatorFees);

        if (marketGetter.isFinalized(_market)) {
            distributeMarketCreatorFees(_market);
        }
    }

    function distributeMarketCreatorFees(address _market) public {
        uint256 _marketCreatorFeesAttoCash = marketCreatorFees[_market];
        marketCreatorFees[_market] = 0;
        if (!marketGetter.isFinalizedAsInvalid(_market)) {
            address _owner = marketGetter.getOwner(_market);
            withdraw(_owner, _marketCreatorFeesAttoCash, _market);
        } else {
            repFees = repFees.add(_marketCreatorFeesAttoCash);
        }
    }

    function distributeAffiliateFees(address _market, address _affiliate, uint256 _affiliateBalance) private returns (bool) {
        if (_affiliateBalance == 0) {
            return true;
        }
        if ((marketGetter.isFinalized(_market) && marketGetter.isFinalizedAsInvalid(_market))) {
            repFees = repFees.add(_affiliateBalance);
        } else {
            withdraw(_affiliate, _affiliateBalance, _market);
        }
        return true;
    }

    function pushRepFees() public returns (bool) {
        uint256 _repFees = repFees;
        repFees = 0;
        require(cash.transfer(repFeeTarget, _repFees));
        return true;
    }

    function getTokenId(address _market, uint256 _outcome) public pure returns (uint256 _tokenId) {
        return TokenId.getTokenId(_market, _outcome);
    }

    function getTokenIds(address _market, uint256[] memory _outcomes) public pure returns (uint256[] memory _tokenIds) {
        return TokenId.getTokenIds(IMarket(_market), _outcomes);
    }

    function unpackTokenId(uint256 _tokenId) public pure returns (address _market, uint256 _outcome) {
        return TokenId.unpackTokenId(_tokenId);
    }

    function onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value) internal {
        (address _marketAddress, uint256 _outcome) = TokenId.unpackTokenId(_tokenId);
        augur.logShareTokensBalanceChanged(_from, address(_marketAddress), _outcome, balanceOf(_from, _tokenId));
        augur.logShareTokensBalanceChanged(_to, address(_marketAddress), _outcome, balanceOf(_to, _tokenId));
    }

    function onMint(uint256 _tokenId, address _target, uint256 _amount) internal {
        (address _marketAddress, uint256 _outcome) = TokenId.unpackTokenId(_tokenId);
        augur.logShareTokensBalanceChanged(_target, address(_marketAddress), _outcome, balanceOf(_target, _tokenId));
    }

    function onBurn(uint256 _tokenId, address _target, uint256 _amount) internal {
        (address _marketAddress, uint256 _outcome) = TokenId.unpackTokenId(_tokenId);
        augur.logShareTokensBalanceChanged(_target, address(_marketAddress), _outcome, balanceOf(_target, _tokenId));
    }
}
