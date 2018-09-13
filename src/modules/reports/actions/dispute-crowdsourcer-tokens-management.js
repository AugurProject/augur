export const UPDATE_DISPUTE_CROWDSOURCERS_DATA =
  "UPDATE_DISPUTE_CROWDSOURCERS_DATA";
export const UPDATE_DISPUTE_CROWDSOURCERS_BALANCE =
  "UPDATE_DISPUTE_CROWDSOURCERS_BALANCE";

export const updateDisputeCrowdsourcersData = disputeCrowdsourcersData => ({
  type: UPDATE_DISPUTE_CROWDSOURCERS_DATA,
  disputeCrowdsourcersData
});

export const updateDisputeCrowdsourcersBalance = (
  disputeCrowdsourcerID,
  balance
) => ({
  type: UPDATE_DISPUTE_CROWDSOURCERS_BALANCE,
  disputeCrowdsourcerID,
  balance
});
