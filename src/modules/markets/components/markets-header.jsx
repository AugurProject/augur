import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FilterSortView from 'modules/filter-sort/components/filter-sort-view';
import classNames from 'classnames';

import makePath from 'modules/app/helpers/make-path';

import parseQuery from 'modules/app/helpers/parse-query';
import parsePath from 'modules/app/helpers/parse-path';

import { CREATE_MARKET, MARKETS } from 'modules/app/constants/views';
import { TOPIC_PARAM_NAME } from 'modules/app/constants/param-names';

export default class MarketsHeader extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    updateFilteredItems: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      headerTitle: null,
      capitalizeTitle: false
    };

    this.setHeaderTitle = this.setHeaderTitle.bind(this);
  }

  componentWillMount() {
    this.setHeaderTitle(this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) this.setHeaderTitle(nextProps.location);
    // console.log('props -- ', nextProps);
  }

  setHeaderTitle(location) {
    const searchParams = parseQuery(location.search);

    if (searchParams[TOPIC_PARAM_NAME]) {
      this.setState({
        headerTitle: searchParams[TOPIC_PARAM_NAME],
        capitalizeTitle: false
      });
    } else {
      const path = parsePath(location.pathname);

      if (path[0] === MARKETS) {
        this.setState({
          headerTitle: path[0],
          capitalizeTitle: true
        });
      }
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article>
        <div className="view-header">
          <div className="view-header-group">
            <h2 className={classNames({ capitalized: s.capitalizeTitle })}>
              {s.headerTitle}
            </h2>
          </div>
          <div className="view-header-group">
            {p.isLogged &&
              <Link
                to={makePath(CREATE_MARKET)}
                className="button imperative navigational"
                disabled={!p.isLogged}
              >
                + Create New Market
              </Link>
            }
          </div>
        </div>
        <FilterSortView
          items={p.markets}
          location={p.location}
          history={p.history}
          updateFilteredItems={p.updateFilteredItems}
        />
      </article>
    );
  }
}


// <MarketsFilterSort
//   keywords={p.keywords}
//   onChangeKeywords={p.onChangeKeywords}
//   {...p.filterSort}
// />
