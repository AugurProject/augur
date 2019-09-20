import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Media from "react-media";

import MarketsInDispute from 'modules/reporting/containers/markets-in-dispute';
import DisputeWindowProgress from 'modules/reporting/containers/disputing-window-progress';
import UserRepDisplay from 'modules/reporting/containers/user-rep-display';
import { ReportingModalButton } from 'modules/reporting/common';
import ParticipationTokensView from 'modules/reporting/containers/participation-tokens-view';
import { TABLET_MAX } from "modules/common/constants";
import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";

import Styles from 'modules/reporting/disputing.styles.less';

interface DisputingProps {
  isConnected: boolean;
  loadDisputeWindow: Function;
}

export default class Disputing extends Component<DisputingProps> {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    const { isConnected, loadDisputeWindow } = this.props;
    if (isConnected) {
      loadDisputeWindow();
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { isConnected, loadDisputeWindow } = this.props;
    if (nextProps.isConnected !== isConnected) {
      loadDisputeWindow();
    }
  }

  render() {
    return (
      <section className={Styles.Disputing}>
        <Helmet>
          <title>Disputing</title>
        </Helmet>
        <Media query={TABLET_MAX}>
          {(matches) =>
            matches ? (
              <ModuleTabs selected={0} fillWidth noBorder>
                <ModulePane label="disputing overview">
                  <UserRepDisplay />
                  <ParticipationTokensView />
                  <DisputeWindowProgress />
                  <ReportingModalButton
                    text="Need Help? Disputing Quick Guide"
                    action={() => console.log('TODO add popup')}
                  />
                </ModulePane>
                <ModulePane label="markets in dispute">
                  <MarketsInDispute />
                  <ReportingModalButton
                    text="Need Help? Disputing Quick Guide"
                    action={() => console.log('TODO add popup')}
                  />
                </ModulePane>
              </ModuleTabs>
            ) : (
            <>
              <MarketsInDispute />
              <div>
                <ReportingModalButton
                  text="Need Help? Disputing Quick Guide"
                  action={() => console.log('TODO add popup')}
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
  }
}
