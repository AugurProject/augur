import React from "react";
import Media from "react-media";

import MyPositions from "modules/portfolio/containers/positions";
import MyMarkets from "modules/portfolio/containers/my-markets";
import OpenOrders from "modules/portfolio/containers/open-orders";
import FilledOrders from "modules/portfolio/containers/filled-orders";
import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import { SMALL_MOBILE, LARGE_DESKTOP } from "modules/common-elements/constants";

import Styles from "modules/portfolio/components/portfolio-view/portfolio-view.styles";

export interface PortfolioPageProps {}

const PortfolioPage = (props: PortfolioPageProps) => (
  <div>
    <Media query={SMALL_MOBILE}>
      {matches =>
        matches ? (
          <ModuleTabs selected={0} fillWidth noBorder>
            <ModulePane label="Positions">
              <MyPositions />
            </ModulePane>
            <ModulePane label="Open Orders">
              <OpenOrders />
            </ModulePane>
            <ModulePane label="Filled Orders">
              <FilledOrders />
            </ModulePane>
            <ModulePane label="My Created Markets">
              <MyMarkets />
            </ModulePane>
          </ModuleTabs>
        ) : (
          <section className={Styles.PortfolioView}>
            <Media query={LARGE_DESKTOP}>
              {matches =>
                matches ? (
                  <>
                    <div>
                      <OpenOrders />
                      <MyMarkets />
                    </div>
                    <div>
                      <FilledOrders />
                      <MyPositions />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <MyPositions />
                      <MyMarkets />
                    </div>
                    <div>
                      <OpenOrders />
                      <FilledOrders />
                    </div>
                  </>
                )
              }
            </Media>
          </section>
        )
      }
    </Media>
  </div>
);

export default PortfolioPage;
