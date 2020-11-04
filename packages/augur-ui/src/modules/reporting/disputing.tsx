import React, { useEffect } from 'react';
import Media from 'react-media';

import MarketsInDispute from 'modules/reporting/components/markets-in-dispute';
import { WindowProgress } from 'modules/common/progress';
import { UserRepDisplay } from 'modules/reporting/common';
import { ReportingModalButton } from 'modules/reporting/common';
import { ParticipationTokensView } from 'modules/reporting/common';
import { HEADER_TYPE, SMALL_MOBILE, MODAL_DR_QUICK_GUIDE } from 'modules/common/constants';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
// @ts-ignore
import Styles from 'modules/reporting/disputing.styles.less';
import { DISPUTING_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { loadDisputeWindow } from "modules/auth/actions/load-dispute-window";

const Disputing = () => {
  const { isConnected, actions: { setModal } } = useAppStatusStore();
  useEffect(() => {
    if (isConnected) {
      loadDisputeWindow();
    }
  }, [isConnected]);

  return (
    <section className={Styles.Disputing}>
      <HelmetTag {...DISPUTING_HEAD_TAGS} />
      <Media query={SMALL_MOBILE}>
        {matches =>
          matches ? (
            <ModuleTabs selected={0} fillWidth noBorder>
              <ModulePane label="disputing overview">
                <ReportingModalButton
                  highlightedText='Need Help?'
                  text="Disputing Quick Guide"
                  action={() => setModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'disputing' })}
                />
                <UserRepDisplay />
                <ParticipationTokensView />
                <WindowProgress />
              </ModulePane>
              <ModulePane label="markets in dispute" headerType={HEADER_TYPE.H1}>
                <MarketsInDispute />
              </ModulePane>
            </ModuleTabs>
          ) : (
            <>
              <MarketsInDispute />
              <div>
                <ReportingModalButton
                  highlightedText='Need Help?'
                  text="Disputing Quick Guide"
                  action={() => setModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'disputing' })}
                />
                <UserRepDisplay />
              </div>
              <WindowProgress />
              <ParticipationTokensView />
            </>
          )
        }
      </Media>
    </section>
  );
};

export default Disputing;
