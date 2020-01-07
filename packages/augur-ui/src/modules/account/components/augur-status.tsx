import React from 'react';

import SyncStatus from 'modules/account/containers/sync-status';
import Activity from 'modules/account/containers/activity';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import { AUGUR_STATUS_TITLE } from 'modules/common/constants';

import Styles from 'modules/account/components/status.styles.less';

const AugurStatus = () => (
  <QuadBox
    title={AUGUR_STATUS_TITLE}
    hideHeader
    content={
      <div className={Styles.AugurStatusContent}>
        <SyncStatus />
        <Activity />
      </div>
    }
  />
);

export default AugurStatus;
