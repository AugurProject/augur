import React, { Component } from 'react';
import FilterBox from "modules/portfolio/components/common/filter-box";

interface MarketsInDisputeProps {
  markets: any;
  sortByOptions: any;
}

function filterComp(input, market) {
  if (!market) return false;
  return true;
}

export default class MarketsInDispute extends Component<MarketsInDisputeProps> {
  constructor(props) {
    super(props);
  }

  render() {
    
    const { markets, sortByOptions } = this.props;

    return (
      <FilterBox
        title="Markets In Dispute"
        sortByOptions={sortByOptions}
        markets={[markets]}
        filterComp={filterComp}
        filterLabel="hello world"
        currentAugurTimestamp={Date.now() / 1000}
      />
    );
  }
}
