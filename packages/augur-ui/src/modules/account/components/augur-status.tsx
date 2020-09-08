import React from 'react';

import SyncStatus from 'modules/account/components/sync-status';
import Activity from 'modules/account/components/activity';
import { AUGUR_STATUS_TITLE } from 'modules/common/constants';

import Styles from 'modules/account/components/status.styles.less';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import classNames from 'classnames';

export interface AugurStatusProps {
  hideHeader?: boolean;
}

const AugurStatus = ({
  hideHeader,
}: AugurStatusProps) => (
  <QuadBox
    title={AUGUR_STATUS_TITLE}
    customClass={classNames(Styles.ShowHeaderOnMobile, {
      [Styles.HideHeader]: hideHeader,
    })}
    content={
      <div className={Styles.AugurStatusContent}>
        <SyncStatus />
        <Activity />
      </div>
    }
  />
);

export default AugurStatus;
