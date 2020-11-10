import { Analytics } from 'modules/types';
import { sendAnalytic } from 'services/analytics/helpers';
import { AppStatus } from '../store/app-status';

export const SEND_DELAY_SECONDS = 30;

export const loadAnalytics = (analytics: Analytics, prevCurrentAugurTimestamp) => {
  if (prevCurrentAugurTimestamp === 0) {
    Object.keys(analytics).map(id => {
        const analytic = analytics[id];
        const { blockchain: { currentAugurTimestamp }} = AppStatus.get();
        const { addAnalytic, removeAnalytic } = AppStatus.actions;
        if ((currentAugurTimestamp - analytic.payload.addedTimestamp) > SEND_DELAY_SECONDS) {
          sendAnalytic(analytic);
          removeAnalytic(id);
        } else {
          addAnalytic(id, analytic);
        }
    });
  }
};
