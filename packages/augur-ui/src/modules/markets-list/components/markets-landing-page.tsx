import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import MarketsList from 'modules/markets-list/components/markets-list';
import Styles from 'modules/markets-list/components/markets-landing-page.styles.less';
import { TYPE_TRADE, MARKET_CARD_FORMATS } from 'modules/common/constants';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { PrimaryButton, CategoryButtons } from 'modules/common/buttons';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { CategorySelector } from 'modules/common/selection';
import { AppStatus } from 'modules/app/store/app-status';

interface MarketsViewProps {
  isLogged: boolean;
  restoredAccount: boolean;
  markets: MarketData[];
  location: object;
  history: History;
  isConnected: boolean;
  loadMarketsByFilter: Function;
  isSearching: boolean;
  categoryData: object;
  signupModal: Function;
  categoryStats: Getters.Markets.CategoryStats;
}

interface MarketsViewState {
  marketCategory: string;
  filterSortedMarkets: string[];
}

export default class MarketsView extends Component<
  MarketsViewProps,
  MarketsViewState
> {
  private componentWrapper!: HTMLElement | null;

  constructor(props) {
    super(props);

    this.state = {
      marketCategory: 'all',
      filterSortedMarkets: [],
    };
  }

  componentDidMount() {
    const { isConnected } = this.props;
    if (isConnected) {
      this.updateFilteredMarkets();
    }
  }

  componentDidUpdate(prevProps) {
    const { isConnected } = this.props;

    if (isConnected !== prevProps.isConnected) {
      this.updateFilteredMarkets();
    }
  }

  updateFilteredMarkets() {
    const {
      loadMarketsByFilter,
    } = this.props;
    const { marketCategory } = this.state;
    AppStatus.actions.updateMarketsList({ isSearching: true });
    loadMarketsByFilter(
      {
        categories:
          marketCategory && marketCategory !== 'all' ? [marketCategory] : [],
        offset: 1,
        limit: 25,
      },
      (err, result: Getters.Markets.MarketList) => {
        if (err) return console.log('Error loadMarketsFilter:', err);
        if (this.componentWrapper) {
          const filterSortedMarkets = result.markets.map(m => m.id);
          this.setState({
            filterSortedMarkets,
          });
          AppStatus.actions.updateMarketsList({ isSearching: false, meta: result.meta });
        }
      }
    );
  }

  render() {
    const {
      history,
      isLogged,
      restoredAccount,
      location,
      markets,
      signupModal,
      isSearching,
      categoryStats,
    } = this.props;

    return (
      <section
        className={Styles.LandingPage}
        ref={componentWrapper => {
          this.componentWrapper = componentWrapper;
        }}
      >
        <Helmet>
          <title>Markets</title>
        </Helmet>

        <div>The world’s most accessible, no-limit betting exchange.</div>

        {!isLogged && !restoredAccount ? (
          <div>
            <PrimaryButton
              action={() => signupModal()}
              text="Signup to start betting"
            />
          </div>
        ) : (
          <div />
        )}

        <CategoryButtons
          action={categoryName => {
            history.push({
              pathname: makePath(MARKETS, null),
              search: `category=${categoryName}`,
            });
          }}
          categoryStats={categoryStats}
        />

        <div>Popular markets</div>

        <CategorySelector
          action={marketCategory => {
            this.setState({ marketCategory }, () => {
              this.updateFilteredMarkets();
            });
          }}
          selected={this.state.marketCategory}
        />

        <MarketsList
          testid="markets"
          markets={markets}
          showPagination={false}
          filteredMarkets={this.state.filterSortedMarkets}
          location={location}
          history={history}
          linkType={TYPE_TRADE}
          isSearchingMarkets={isSearching}
          marketCardFormat={MARKET_CARD_FORMATS.COMPACT}
        />
      </section>
    );
  }
}
