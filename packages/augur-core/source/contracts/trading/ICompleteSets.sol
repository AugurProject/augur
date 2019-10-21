pragma solidity 0.5.10;


import 'ROOT/reporting/IMarket.sol';


contract ICompleteSets {
    function publicBuyCompleteSets(IMarket _market, uint256 _amount) external returns (bool);
    function buyCompleteSets(address _sender, IMarket _market, uint256 _amount) external returns (bool);
    function sellCompleteSets(address _sender, IMarket _market, uint256 _amount, address _affiliateAddress) external returns (uint256, uint256);
    function jointBuyCompleteSets(IMarket _market, uint256 _amount, address _longParticipant, address _shortParticipant, uint256 _longOutcome, address _longRecipient, address _shortRecipient, uint256 _price) external;
    function jointSellCompleteSets(IMarket _market, uint256 _shortOutcome, address _shortParticipant, address _longParticipant, uint256 _amount, address _shortRecipient, address _longRecipient, uint256 _price, address _affiliateAddress) external returns (uint256 _creatorFee, uint256 _reportingFee);
}
