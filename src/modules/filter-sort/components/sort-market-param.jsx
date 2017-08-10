import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SortMarketParam extends Component {
  constructor(props) {
    super(props);

    this.defaultMarketParam = 'TODO';
    this.defaultSort = 'TDOO';

    this.state = {
      selectedMarketParam: this.defaultMarketParam,
      selectedSort: this.defaultSort
    };
  }

  render() {
    return (
      <article className="market-sort-param">
        <span>Market Sort</span>
      </article>
    );
  }
}
