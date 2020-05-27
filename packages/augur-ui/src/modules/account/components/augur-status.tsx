import React from 'react';

import SyncStatus from 'modules/account/components/sync-status';
import Activity from 'modules/account/components/activity';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import { AUGUR_STATUS_TITLE } from 'modules/common/constants';

import Styles from 'modules/account/components/status.styles.less';

export interface AugurStatusProps {
  hideHeader: boolean;
}

const AugurStatus = ({
  hideHeader,
}: AugurStatusProps) => (
  <QuadBox
    title={AUGUR_STATUS_TITLE}
    hideHeader={hideHeader}
    content={
      <div className={Styles.AugurStatusContent}>
        <SyncStatus />
        <Activity />
      </div>
    }
  />
);

export default AugurStatus;
