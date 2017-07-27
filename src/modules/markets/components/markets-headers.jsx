import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MarketsFilterSort from 'modules/markets/components/markets-filter-sort';
import classNames from 'classnames';

import makePath from 'modules/app/helpers/make-path';

import parseQuery from 'modules/app/helpers/parse-query';
import parsePath from 'modules/app/helpers/parse-path';

import { CREATE_MARKET, MARKETS } from 'modules/app/constants/views';
import { TOPIC_PARAM_NAME } from 'modules/app/constants/param-names';

export default class MarketsHeader extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    filterSort: PropTypes.object.isRequired,
    keywords: PropTypes.string.isRequired,
    onChangeKeywords: PropTypes.func.isRequired,
    loginAccount: PropTypes.object
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
            {p.loginAccount && p.loginAccount.address &&
              <Link
                to={makePath(CREATE_MARKET)}
                className="button imperative navigational"
                disabled={!p.loginAccount.address}
              >
                + Create New Market
              </Link>
            }
          </div>
        </div>
        <MarketsFilterSort
          keywords={p.keywords}
          onChangeKeywords={p.onChangeKeywords}
          {...p.filterSort}
        />
      </article>
    );
  }
}
