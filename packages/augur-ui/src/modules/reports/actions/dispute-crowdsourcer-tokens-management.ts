export const UPDATE_DISPUTE_CROWDSOURCERS_DATA =
  "UPDATE_DISPUTE_CROWDSOURCERS_DATA";
export const UPDATE_DISPUTE_CROWDSOURCERS_BALANCE =
  "UPDATE_DISPUTE_CROWDSOURCERS_BALANCE";

export const updateDisputeCrowdsourcersData = (
  disputeCrowdsourcersDataUpdated: any
) => ({
  type: UPDATE_DISPUTE_CROWDSOURCERS_DATA,
  data: { disputeCrowdsourcersDataUpdated }
});

export const updateDisputeCrowdsourcersBalance = (
  disputeCrowdsourcerID: string,
  balance: string
) => ({
  type: UPDATE_DISPUTE_CROWDSOURCERS_BALANCE,
  data: {
    disputeCrowdsourcerID,
    balance
  }
});
