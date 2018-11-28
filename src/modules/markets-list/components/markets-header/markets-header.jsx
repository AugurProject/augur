import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterSearch from "modules/filter-sort/containers/filter-search";
import FilterDropDowns from "modules/filter-sort/containers/filter-dropdowns";

import parseQuery from "modules/routes/helpers/parse-query";
import parsePath from "modules/routes/helpers/parse-path";

import { MARKETS } from "modules/routes/constants/views";
import { CATEGORY_PARAM_NAME } from "modules/filter-sort/constants/param-names";

import Styles from "modules/markets-list/components/markets-header/markets-header.styles";

// NOTE -- commented out state due to temp lack of utilization + linting
export default class MarketsHeader extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
    maxFee: PropTypes.string.isRequired,
    updateFilter: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      headerTitle: null
    };

    this.setHeaderTitle = this.setHeaderTitle.bind(this);
  }

  componentWillMount() {
    const { location } = this.props;
    this.setHeaderTitle(location);
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    if (location !== nextProps.location) {
      this.setHeaderTitle(nextProps.location);
    }
  }

  setHeaderTitle(location) {
    const searchParams = parseQuery(location.search);

    if (searchParams[CATEGORY_PARAM_NAME]) {
      this.setState({
        headerTitle: searchParams[CATEGORY_PARAM_NAME]
      });
    } else {
      const path = parsePath(location.pathname);

      if (path[0] === MARKETS) {
        this.setState({
          headerTitle: path[0]
        });
      }
    }
  }

  render() {
    const { filter, sort, maxFee, updateFilter, history } = this.props;
    const s = this.state;

    return (
      <article className={Styles.MarketsHeader}>
        <h1 className={Styles.MarketsHeader__heading}>{s.headerTitle}</h1>
        <div className={Styles.MarketsHeader__wrapper}>
          <div className={Styles.MarketsHeader__filters}>
            <FilterDropDowns
              filter={filter}
              sort={sort}
              maxFee={maxFee}
              updateFilter={updateFilter}
              history={history}
              location={location}
            />
          </div>
          <div className={Styles.MarketsHeader__search}>
            <FilterSearch />
          </div>
        </div>
      </article>
    );
  }
}
