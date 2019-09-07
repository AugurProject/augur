import React, { Component } from 'react';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import FilterDropDowns from 'modules/filter-sort/containers/filter-dropdowns';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKETS } from 'modules/routes/constants/views';
import { CATEGORY_PARAM_NAME, MOBILE_MENU_STATES, MARKET_CARD_FORMATS } from 'modules/common/constants';
import Styles from 'modules/markets-list/components/markets-header.styles.less';
import classNames from 'classnames';
import { Compact, Classic, Expanded } from 'modules/common/icons';
import { FilterButton } from 'modules/common/buttons';

interface MarketsHeaderProps {
  location: object;
  filter: string;
  sort: string;
  history: object;
  isSearchingMarkets: boolean;
  selectedCategory: string[];
  search: string;
  updateMarketsListCardFormat: Function;
  marketCardFormat: string;
  updateMobileMenuState: Function;
}

interface MarketsHeaderState {
  headerTitle: string | null;
}

export default class MarketsHeader extends Component<
  MarketsHeaderProps,
  MarketsHeaderState
> {
  constructor(props) {
    super(props);

    this.state = {
      headerTitle: null,
    };

    this.setHeaderTitle = this.setHeaderTitle.bind(this);
  }

  componentWillMount() {
    this.setHeaderTitle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { location, selectedCategory, search } = this.props;
    if (
      location !== nextProps.location ||
      selectedCategory !== nextProps.selectedCategory ||
      search !== nextProps.search
    ) {
      this.setHeaderTitle(nextProps);
    }
  }

  setHeaderTitle(props) {
    const searchParams = parseQuery(location.search);

    if (props.search) {
      this.setState({
        headerTitle: `Search: "${props.search}"`,
      });
      return;
    }

    if (searchParams[CATEGORY_PARAM_NAME]) {
      this.setState({
        headerTitle: searchParams[CATEGORY_PARAM_NAME],
      });
      return;
    }

    if (props.selectedCategory && props.selectedCategory.length > 0) {
      this.setState({
        headerTitle: props.selectedCategory[props.selectedCategory.length - 1],
      });
      return;
    }

    this.setState({
      headerTitle: MARKETS,
    });
  }

  render() {
    const {
      isSearchingMarkets,
      updateMarketsListCardFormat,
      marketCardFormat,
      updateMobileMenuState,
    } = this.props;
    const { headerTitle } = this.state;

    const ViewSwitcher = ({ handleClick, type, selected = false }) => (
      <span
        className={classNames(Styles.ViewSwitcher, {
          [Styles.selected]: selected,
        })}
        onClick={handleClick}>
        {type}
      </span>
    );

    return (
      <article
        className={classNames(Styles.MarketsHeader, {
          [Styles.DisableFilters]: isSearchingMarkets,
        })}
      >
        <div>
          <FilterSearch isSearchingMarkets={isSearchingMarkets} />
          {/* MOBILE FILTERS TOGGLE */}
          <FilterButton
            action={() =>
              updateMobileMenuState(MOBILE_MENU_STATES.FIRSTMENU_OPEN)
            }
          />
        </div>
        <div>
          <h1>{headerTitle}</h1>

          <div>
            <div className={Styles.MarketCardsFormat}>
              View
              <ViewSwitcher
                handleClick={() => updateMarketsListCardFormat(MARKET_CARD_FORMATS.COMPACT)}
                type={Compact}
                selected={marketCardFormat === MARKET_CARD_FORMATS.COMPACT}
              />
              <ViewSwitcher
                handleClick={() => updateMarketsListCardFormat(MARKET_CARD_FORMATS.CLASSIC)}
                type={Classic}
                selected={marketCardFormat === MARKET_CARD_FORMATS.CLASSIC}
              />

              <ViewSwitcher
                handleClick={() => updateMarketsListCardFormat(MARKET_CARD_FORMATS.EXPANDED)}
                type={Expanded}
                selected={marketCardFormat === MARKET_CARD_FORMATS.EXPANDED}
              />
            </div>

            <FilterDropDowns />
          </div>
        </div>
      </article>
    );
  }
}
