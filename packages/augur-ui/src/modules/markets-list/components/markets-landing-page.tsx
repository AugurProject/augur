import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import MarketsList from 'modules/markets-list/components/markets-list';
import Styles from 'modules/markets-list/components/markets-landing-page.styles.less';
import {
  TYPE_TRADE,
  MARKET_CARD_FORMATS,
} from 'modules/common/constants';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { PrimaryButton, CategoryButtons } from 'modules/common/buttons';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { CategorySelector } from 'modules/common/selection';

interface MarketsViewProps {
  isLogged: boolean;
  markets: MarketData[];
  location: object;
  history: object;
  isConnected: boolean;
  toggleFavorite: (...args: any[]) => any;
  loadMarketsInfoIfNotLoaded: (...args: any[]) => any;
  isMobile: boolean;
  loadMarketsByFilter: Function;
  isSearching: boolean;
  setLoadMarketsPending: Function;
  updateMarketsListMeta: Function;
  categoryData: object;
  signupModal: Function;
}

interface MarketsViewState {
  marketCategory: string;
  filterSortedMarkets: string[];
  marketStats: object;
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
      marketStats: null,
    };
  }

  componentDidMount() {
    const { isConnected } = this.props;
    if (isConnected) {
      this.updateFilteredMarkets();
    }
  }

  componentDidUpdate(prevProps) {
    const { isConnected, categoryData, isSearching } = this.props;

    if (isConnected !== prevProps.isConnected) {
      this.updateFilteredMarkets();
    }

    if (prevProps.isSearching && !isSearching && this.state.marketCategory === 'all') {
      this.setState({
        marketStats: categoryData
      });
    }
  }

  updateFilteredMarkets() {
    const { marketCategory } = this.state;

    this.props.setLoadMarketsPending(true);
    this.props.loadMarketsByFilter(
      {
        categories: marketCategory && marketCategory !== 'all' ? [marketCategory] : [],
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
          this.props.updateMarketsListMeta(result.meta);
          this.props.setLoadMarketsPending(false);
        }
      }
    );
  }

  render() {
    const {
      history,
      isLogged,
      isMobile,
      loadMarketsInfoIfNotLoaded,
      location,
      markets,
      toggleFavorite,
      signupModal,
      isSearching,
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

        <div>
          The world’s most accessible, no-limit betting platform.
        </div>

        {!isLogged ? <div>
          <PrimaryButton
            action={() => signupModal()}
            text='Signup to start betting'
          />
        </div> : <div />}

        <CategoryButtons
          action={(categoryName) => {
            history.push({
              pathname: makePath(MARKETS, null),
              search: `category=${categoryName}`,
            });
          }}
          categoryData={this.state.marketStats}
        />

        <div>
          Popular markets
        </div>

        <CategorySelector
          action={(marketCategory) => {
            this.setState({ marketCategory }, () => {
              this.updateFilteredMarkets()
            });
          }}
          selected={this.state.marketCategory}
        />

        <MarketsList
          testid='markets'
          isLogged={isLogged}
          markets={markets}
          showPagination={false}
          filteredMarkets={this.state.filterSortedMarkets}
          location={location}
          history={history}
          toggleFavorite={toggleFavorite}
          loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
          linkType={TYPE_TRADE}
          isMobile={isMobile}
          isSearchingMarkets={isSearching}
          marketCardFormat={MARKET_CARD_FORMATS.COMPACT}
        />
      </section>
    );
  }
}
