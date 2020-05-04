import { Analytics, Analytic } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { sendAnalytic } from 'services/analytics/helpers';
import { AppStatus } from '../store/app-status';

export const ADD_ANALYTIC = 'ADD_ANALYTIC';
export const REMOVE_ANALYTIC = 'REMOVE_ANALYTIC';
export const UPDATE_ANALYTIC = 'UPDATE_ANALYTIC';

export const SEND_DELAY_SECONDS = 30;

export const loadAnalytics = (analytics: Analytics, prevCurrentAugurTimestamp) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (prevCurrentAugurTimestamp === 0) {
    Object.keys(analytics).map(id => {
        const analytic = analytics[id];
        const { blockchain: { currentAugurTimestamp }} = AppStatus.get();
        if ((currentAugurTimestamp - analytic.properties.addedTimestamp) > SEND_DELAY_SECONDS) {
          dispatch(sendAnalytic(analytic));
          dispatch(removeAnalytic(id));
        } else {
          dispatch(addAnalytic(analytic, id));
        }
    });
  }

};

export const addAnalytic = (analytic: Analytic, id: string) => ({
  type: ADD_ANALYTIC,
  data: {
    analytic,
    id,
  },
});

export const updateAnalytic = (analytic: Analytic, id: string) => ({
  type: UPDATE_ANALYTIC,
  data: {
    analytic,
    id,
  },
});

export const removeAnalytic = (id: string) => ({
  type: REMOVE_ANALYTIC,
  data: { id },
});
