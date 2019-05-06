import {
  UPDATE_PARTICIPATION_TOKENS_DATA,
  UPDATE_PARTICIPATION_TOKENS_BALANCE
} from "modules/reports/actions/participation-tokens-management";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(
  participationTokensData = DEFAULT_STATE,
  { type, data }
) {
  switch (type) {
    case UPDATE_PARTICIPATION_TOKENS_DATA: {
      const { participationTokensDataUpdated } = data;
      const updatedParticipationTokens = Object.keys(
        participationTokensDataUpdated
      ).reduce((p, feeWindowID) => {
        p[feeWindowID] = {
          ...participationTokensData[feeWindowID],
          ...participationTokensDataUpdated[feeWindowID]
        };
        return p;
      }, {});

      return {
        ...participationTokensData,
        ...updatedParticipationTokens
      };
    }
    case UPDATE_PARTICIPATION_TOKENS_BALANCE: {
      const { feeWindowID, balance } = data;
      if (!feeWindowID) return participationTokensData;
      return {
        ...participationTokensData,
        [feeWindowID]: {
          ...participationTokensData[feeWindowID],
          balance
        }
      };
    }
    case RESET_STATE:
    default:
      return participationTokensData;
  }
}
