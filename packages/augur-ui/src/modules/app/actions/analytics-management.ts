import { Analytics, Analytic } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export const ADD_ANALYTIC = 'ADD_ANALYTIC';
export const REMOVE_ANALYTIC = 'REMOVE_ANALYTIC';
export const UPDATE_ANALYTIC = 'UPDATE_ANALYTIC';

export const loadAnalytics = (analytics: Analytics) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  Object.keys(analytics).map(id => {
    addAnalytic(analytics[id], id);
  });
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
