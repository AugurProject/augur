import {
  UPDATE_INITIAL_REPORTERS_DATA,
  UPDATE_INITIAL_REPORTER_REP_BALANCE
} from "modules/reports/actions/update-initial-reporters";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(initialReportersData = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_INITIAL_REPORTERS_DATA: {
      const { initialReportersDataUpdated } = data;
      const updatedInitialReporters = Object.keys(
        initialReportersDataUpdated
      ).reduce((p, initialReporterID) => {
        p[initialReporterID] = {
          ...initialReportersData[initialReporterID],
          ...initialReportersDataUpdated[initialReporterID]
        };
        return p;
      }, {});

      return {
        ...initialReportersData,
        ...updatedInitialReporters
      };
    }
    case UPDATE_INITIAL_REPORTER_REP_BALANCE: {
      const { initialReporterID, repBalance } = data;
      if (!initialReporterID) return initialReportersData;
      return {
        ...initialReportersData,
        [initialReporterID]: {
          ...initialReportersData[initialReporterID],
          repBalance
        }
      };
    }
    case RESET_STATE:
    default:
      return initialReportersData;
  }
}
