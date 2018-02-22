export const UPDATE_DISPUTE_CROWDSOURCERS_DATA = 'UPDATE_DISPUTE_CROWDSOURCERS_DATA'
export const UPDATE_DISPUTE_CROWDSOURCERS_ESCAPE_HATCH_GAS_COST = 'UPDATE_DISPUTE_CROWDSOURCERS_ESCAPE_HATCH_GAS_COST'
export const UPDATE_DISPUTE_CROWDSOURCERS_BALANCE = 'UPDATE_DISPUTE_CROWDSOURCERS_BALANCE'

export const updateDisputeCrowdsourcersData = disputeCrowdsourcersData => ({ type: UPDATE_DISPUTE_CROWDSOURCERS_DATA, disputeCrowdsourcersData })
export const updateDisputeCrowdsourcersEscapeHatchGasCost = (disputeCrowdsourcerID, escapeHatchGasCost) => ({ type: UPDATE_DISPUTE_CROWDSOURCERS_ESCAPE_HATCH_GAS_COST, disputeCrowdsourcerID, escapeHatchGasCost })
export const updateDisputeCrowdsourcersBalance = (disputeCrowdsourcerID, balance) => ({ type: UPDATE_DISPUTE_CROWDSOURCERS_BALANCE, disputeCrowdsourcerID, balance })
