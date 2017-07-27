import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import parseQuery from 'modules/app/helpers/parse-query';
import makeQuery from 'modules/app/helpers/make-query';

import { PAGINATION_PARAM_NAME } from 'modules/app/constants/param-names';

// TODO -- refactored reusable structure
// Props:
//  items
//  Items Per Page
//  Location (full obj)
//  update method (setSegment)
//  Hero Size (optional) - TODO

class Paginator extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    setSegment: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      currentPage: null,
      upperBound: null,
      lowerBound: null,
      backQuery: null,
      forwardQuery: null,
      totalItems: null
    };

    this.setCurrentSegment = this.setCurrentSegment.bind(this);
  }

  componentWillMount() {
    this.setCurrentSegment({
      items: this.props.items,
      itemsPerPage: this.props.itemsPerPage,
      location: this.props.location,
      setSegment: this.props.setSegment
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.items !== nextProps.items) {
      this.setCurrentSegment({
        items: nextProps.items,
        itemsPerPage: nextProps.itemsPerPage,
        location: nextProps.location,
        setSegment: nextProps.setSegment
      });
    }
  }

  setCurrentSegment(options) {
    if (!options.items.length) return options.setSegment([]);

    const currentPage = parseInt(parseQuery(options.location.search)[PAGINATION_PARAM_NAME] || 1, 10);

    // Segment Bounds
    // NOTE -- Bounds are one based

    // Scenarios:

    // Full List is less than itemsPerPage
    // Segment is less than length
    // Segement is bounded by currentPage

    //  Upper Bound
    let upperBound;
    if (options.items.length < options.itemsPerPage || currentPage * options.itemsPerPage > options.items.length) {
      upperBound = options.items.length;
    } else {
      upperBound = currentPage * options.itemsPerPage;
    }
    //  Lower Bound
    let lowerBound;
    if (upperBound - options.itemsPerPage < 0) {
      lowerBound = 1;
    } else {
      lowerBound = (upperBound - options.itemsPerPage) + 1;
    }

    //  Link Query Params
    //    Back
    let backQuery;
    if (currentPage === 1) {
      const queryParams = parseQuery(options.location.search);
      delete queryParams[PAGINATION_PARAM_NAME];
      backQuery = makeQuery(queryParams);
    } else {
      const queryParams = parseQuery(options.location.search);
      queryParams[PAGINATION_PARAM_NAME] = currentPage - 1;
      backQuery = makeQuery(queryParams);
    }
    //    Forward
    let forwardQuery;
    if (currentPage * options.itemsPerPage >= totalItems) {
      const queryParams = parseQuery(options.location.search);
      queryParams[PAGINATION_PARAM_NAME] = currentPage;
      forwardQuery = makeQuery(queryParams);
    } else {
      const queryParams = parseQuery(options.location.search);
      queryParams[PAGINATION_PARAM_NAME] = currentPage + 1;
      forwardQuery = makeQuery(queryParams);
    }

    const marketsPaginated = options.items.slice(lowerBound - 1, upperBound);
    const totalItems = options.items.length;

    options.setSegment(marketsPaginated);

    this.setState({
      currentPage,
      upperBound,
      lowerBound,
      backQuery,
      forwardQuery,
      totalItems
    });
  }

  render() {
    const p = this.props;
    const s = this.state;

    console.log('currentPage -- ', s.currentPage);

    return (
      <article className="paginator">
        <div className="paginator-controls">
          <div className="paginator-back">
            {s.currentPage !== 1 &&
              <Link
                className="button"
                to={{
                  ...p.location,
                  search: s.backQuery
                }}
              >
                <i className="fa fa-angle-left" />
              </Link>
            }
          </div>

          <div className="paginator-location">
            <span>
              {s.lowerBound}{!!s.upperBound && s.upperBound > 1 && ` - ${s.upperBound}`} <strong>of</strong> {s.totalItems}
            </span>
          </div>

          <div className="paginator-forward">
            {s.currentPage * p.itemsPerPage < s.totalItems &&
              <Link
                className="button"
                to={{
                  ...p.location,
                  search: s.forwardQuery
                }}
              >
                <i className="fa fa-angle-right" />
              </Link>
            }
          </div>
        </div>
      </article>
    );
  }
}

export default Paginator;
