import React, { Component } from 'react';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import parseQuery from 'modules/routes/helpers/parse-query';
import { MARKETS } from 'modules/routes/constants/views';
import { CATEGORY_PARAM_NAME, MOBILE_MENU_STATES } from 'modules/common/constants';
import Styles from 'modules/markets-list/components/markets-header.styles.less';
import classNames from 'classnames';
import { FilterButton } from 'modules/common/buttons';

interface MarketsHeaderProps {
  location: object;
  filter: string;
  sort: string;
  history: object;
  isSearchingMarkets: boolean;
  selectedCategory: string[];
  search: string;
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
      updateMobileMenuState,
    } = this.props;
    const { headerTitle } = this.state;

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
        </div>
      </article>
    );
  }
}
