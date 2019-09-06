import React, { Component } from 'react';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import FilterDropDowns from 'modules/filter-sort/containers/filter-dropdowns';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKETS } from 'modules/routes/constants/views';
import { CATEGORY_PARAM_NAME } from 'modules/common/constants';
import Styles from 'modules/markets-list/components/markets-header.styles.less';
import classNames from 'classnames';
import { Compact, Classic, Expanded } from 'modules/common/icons';

interface MarketsHeaderProps {
  location: object;
  filter: string;
  sort: string;
  updateFilter: Function;
  history: object;
  isSearchingMarkets: boolean;
  selectedCategory: string[];
  search: string;
  updateMarketsListCardFormat: Function;
  marketCardFormat: string;
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
      filter,
      sort,
      updateFilter,
      history,
      isSearchingMarkets,
      updateMarketsListCardFormat,
      marketCardFormat,
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
        <FilterSearch isSearchingMarkets={isSearchingMarkets} />
        <div>
          <h1>{headerTitle}</h1>

          <div>
            <div className={Styles.MarketCardsFormat}>
              View
              <ViewSwitcher
                handleClick={() => updateMarketsListCardFormat('classic')}
                type={Classic}
                selected={marketCardFormat === 'classic'}
              />
              <ViewSwitcher
                handleClick={() => updateMarketsListCardFormat('expanded')}
                type={Expanded}
                selected={marketCardFormat === 'expanded'}
              />

              <ViewSwitcher
                handleClick={() => updateMarketsListCardFormat('compact')}
                type={Compact}
                selected={marketCardFormat === 'compact'}
              />
            </div>

            <FilterDropDowns
              filter={filter}
              sort={sort}
              updateFilter={updateFilter}
              history={history}
              location={location}
            />
          </div>
        </div>
      </article>
    );
  }
}
