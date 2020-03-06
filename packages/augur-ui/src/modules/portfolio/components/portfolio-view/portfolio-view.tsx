import React from 'react';
import Media from 'react-media';

import MyPositions from 'modules/portfolio/containers/positions';
import MyMarkets from 'modules/portfolio/containers/my-markets';
import OpenOrders from 'modules/portfolio/containers/open-orders';
import FilledOrders from 'modules/portfolio/containers/filled-orders';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import { SMALL_MOBILE } from 'modules/common/constants';
import Styles from 'modules/portfolio/components/portfolio-view/portfolio-view.styles.less';
import { PORTFOLIO_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { HelmetTag } from 'modules/seo/helmet-tag';
import parseQuery from 'modules/routes/helpers/parse-query';
import { CREATE_MARKET_PORTFOLIO } from 'modules/routes/constants/param-names';

interface PortfolioViewProps {
  location: Location;
}

interface PortfolioViewState {
  extendPositions: boolean;
  extendMarkets: boolean;
  extendOpenOrders: boolean;
  extendFilledOrders: boolean;
  initialPage: number;
}

export default class PortfolioView extends React.Component<
  PortfolioViewProps,
  PortfolioViewState
> {
  state: PortfolioViewState = {
    extendPositions: false,
    extendMarkets: false,
    extendOpenOrders: false,
    extendFilledOrders: false,
    initialPage: parseFloat(parseQuery(this.props.location.search)[CREATE_MARKET_PORTFOLIO]) || 0,
  };

  toggle = (extend: string, hide: string) => {
    if (!this.state[extend] && this.state[hide]) {
      this.setState({ [extend]: false, [hide]: false });
    } else {
      this.setState({
        [extend]: !this.state[extend],
        [hide]: false,
      });
    }
  };

  render() {
    const s = this.state;

    return (
      <div className={Styles.PortfolioView}>
        <HelmetTag {...PORTFOLIO_VIEW_HEAD_TAGS} />
        <Media query={SMALL_MOBILE}>
          {matches =>
            matches ? (
              <>
              <ModuleTabs selected={s.initialPage} fillWidth noBorder>
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
              </>
            ) : (
              <section>
                <div>
                  <MyPositions
                    toggle={() =>
                      this.toggle('extendPositions', 'extendMarkets')
                    }
                    extend={s.extendPositions}
                    hide={s.extendMarkets}
                  />
                  <MyMarkets
                    toggle={() =>
                      this.toggle('extendMarkets', 'extendPositions')
                    }
                    extend={s.extendMarkets}
                    hide={s.extendPositions}
                  />
                </div>
                <div>
                  <OpenOrders
                    toggle={() =>
                      this.toggle('extendOpenOrders', 'extendFilledOrders')
                    }
                    extend={s.extendOpenOrders}
                    hide={s.extendFilledOrders}
                  />
                  <FilledOrders
                    toggle={() =>
                      this.toggle('extendFilledOrders', 'extendOpenOrders')
                    }
                    extend={s.extendFilledOrders}
                    hide={s.extendOpenOrders}
                  />
                </div>
              </section>
            )
          }
        </Media>
      </div>
    );
  }
}
