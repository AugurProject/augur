import React from 'react';
import { Helmet } from 'react-helmet';
import Media from 'react-media';

import MarketsInDispute from 'modules/reporting/containers/markets-in-dispute';
import DisputeWindowProgress from 'modules/reporting/containers/disputing-window-progress';
import UserRepDisplay from 'modules/reporting/containers/user-rep-display';
import { ReportingModalButton } from 'modules/reporting/common';
import ParticipationTokensView from 'modules/reporting/containers/participation-tokens-view';
import { SMALL_MOBILE } from 'modules/common/constants';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';

import Styles from 'modules/reporting/disputing.styles.less';
import { ButtonActionType } from 'modules/types';

interface DisputingProps {
  isConnected: boolean;
  loadDisputeWindow: () => void;
  openDisputingModal: ButtonActionType;
}

const Disputing: React.FC<DisputingProps> = ({
  isConnected,
  loadDisputeWindow,
  openDisputingModal,
}) => {
  React.useEffect(() => {
    if (isConnected) {
      loadDisputeWindow();
    }
  }, [isConnected]);

  return (
    <section className={Styles.Disputing}>
      <Helmet>
        <title>Disputing</title>
      </Helmet>
      <Media query={SMALL_MOBILE}>
        {matches =>
          matches ? (
            <ModuleTabs selected={0} fillWidth noBorder>
              <ModulePane label="disputing overview">
                <ReportingModalButton
                  text="Need Help? Disputing Quick Guide"
                  action={openDisputingModal}
                />
                <UserRepDisplay />
                <ParticipationTokensView />
                <DisputeWindowProgress />
              </ModulePane>
              <ModulePane label="markets in dispute">
                <MarketsInDispute />
              </ModulePane>
            </ModuleTabs>
          ) : (
            <>
              <MarketsInDispute />
              <div>
                <ReportingModalButton
                  text="Need Help? Disputing Quick Guide"
                  action={openDisputingModal}
                />
                <UserRepDisplay />
              </div>
              <DisputeWindowProgress />
              <ParticipationTokensView />
            </>
          )
        }
      </Media>
    </section>
  );
};

export default Disputing;
