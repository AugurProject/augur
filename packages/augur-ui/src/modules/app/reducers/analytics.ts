import {
  REMOVE_ANALYTIC,
  UPDATE_ANALYTIC,
  ADD_ANALYTIC,
} from 'modules/app/actions/analytics-management';
import { Analytics, Analytic, BaseAction } from 'modules/types';

const DEFAULT_STATE: Analytics = {};

export default function(
  analytics: Analytics = DEFAULT_STATE,
  { type, data }: BaseAction
): Analytics {
  switch (type) {
    case UPDATE_ANALYTIC:
      return {
        ...analytics,
        [data.id]: data.draft,
      };
    case ADD_ANALYTIC:
      return {
        ...analytics,
        [data.id]: data.draft,
      };
    case REMOVE_ANALYTIC: {
      delete analytics[data.id];
      return {
        ...analytics,
      };
    }
    default:
      return analytics;
  }
}
