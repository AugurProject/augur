export const UPDATE_DISPUTE_CROWDSOURCERS_DATA =
  "UPDATE_DISPUTE_CROWDSOURCERS_DATA";
export const UPDATE_DISPUTE_CROWDSOURCERS_BALANCE =
  "UPDATE_DISPUTE_CROWDSOURCERS_BALANCE";

export const updateDisputeCrowdsourcersData = disputeCrowdsourcersDataUpdated => ({
  type: UPDATE_DISPUTE_CROWDSOURCERS_DATA,
  data: { disputeCrowdsourcersDataUpdated }
});

export const updateDisputeCrowdsourcersBalance = (
  disputeCrowdsourcerID,
  balance
) => ({
  type: UPDATE_DISPUTE_CROWDSOURCERS_BALANCE,
  data: {
    disputeCrowdsourcerID,
    balance
  }
});
