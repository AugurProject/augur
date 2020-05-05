import { connect } from 'react-redux';

import {
  ZERO,
} from 'modules/common/constants';
import { AppState } from 'appStore';
import { DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';
import { DismissableNotice } from 'modules/reporting/common';
import { createBigNumber } from 'utils/create-big-number';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { loginAccount } = state;
  const { universe: { forkingInfo }} = AppStatus.get();
  let hasStakedRep = false;
  const hasForked = !!forkingInfo;
  let show = false;
  if (hasForked) {
    const { reporting } = loginAccount;
    if (reporting) {
      if (
        (reporting.reporting &&
          createBigNumber(reporting.reporting.totalStaked).gt(ZERO)) ||
        (reporting.disputing &&
          createBigNumber(reporting.disputing.totalStaked).gt(ZERO)) ||
        (reporting.participationTokens &&
          createBigNumber(reporting.participationTokens.totalStaked).gt(ZERO))
      )
        hasStakedRep = true;
    }
  }
  if (hasForked  && hasStakedRep) show = true;

  if (!show) return {};

  return {
    show,
    buttonType: DISMISSABLE_NOTICE_BUTTON_TYPES.NONE,
    title: 'You Still have REP locked up in dispute Bonds and Participation Tokens.',
    description: 'Please follow the instructions given in the banner at the top of this site or the notification in your account summary.',
  };
};

const ReleasableRepNotice = connect(mapStateToProps)(DismissableNotice);

export default ReleasableRepNotice;
