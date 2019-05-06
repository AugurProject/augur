import {
  UPDATE_DISPUTE_CROWDSOURCERS_DATA,
  UPDATE_DISPUTE_CROWDSOURCERS_BALANCE
} from "modules/reports/actions/dispute-crowdsourcer-tokens-management";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(
  disputeCrowdsourcersData = DEFAULT_STATE,
  { type, data }
) {
  switch (type) {
    case UPDATE_DISPUTE_CROWDSOURCERS_DATA: {
      const { disputeCrowdsourcersDataUpdated } = data;
      const updatedDisputeCrowdsourcers = Object.keys(
        disputeCrowdsourcersDataUpdated
      ).reduce((p, disputeCrowdsourcerID) => {
        p[disputeCrowdsourcerID] = {
          ...disputeCrowdsourcersData[disputeCrowdsourcerID],
          ...disputeCrowdsourcersDataUpdated[disputeCrowdsourcerID]
        };
        return p;
      }, {});

      return {
        ...disputeCrowdsourcersData,
        ...updatedDisputeCrowdsourcers
      };
    }
    case UPDATE_DISPUTE_CROWDSOURCERS_BALANCE: {
      const { disputeCrowdsourcerID, balance } = data;
      if (!disputeCrowdsourcerID) return disputeCrowdsourcersData;
      return {
        ...disputeCrowdsourcersData,
        [disputeCrowdsourcerID]: {
          ...disputeCrowdsourcersData[disputeCrowdsourcerID],
          balance
        }
      };
    }
    case RESET_STATE:
    default:
      return disputeCrowdsourcersData;
  }
}
