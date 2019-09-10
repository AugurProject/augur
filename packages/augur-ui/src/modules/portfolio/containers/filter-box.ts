import { connect } from 'react-redux';

import FilterBox from 'modules/portfolio/components/common/filter-box';

import { createMarketsStateObject } from 'modules/portfolio/helpers/create-markets-state-object';
// TODO: refactor the need to use this function.
function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

const mapStateToProps = state => ({
  currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
});

const mapDispatchToProps = dispatch => ({});

const mergeProps = (sP, dP, oP) => {
  const marketsObj = oP.markets.reduce((obj, market) => {
    obj[market.id] = market;
    return obj;
  }, {});

  const marketsPick =
    oP.markets &&
    oP.markets.map((
      market // when these things change then component will re-render/re-sort
    ) => pick(market, oP.pickVariables));

  const marketsByState = createMarketsStateObject(marketsPick);

  return {
    ...oP,
    ...sP,
    dataObj: marketsObj,
    data: marketsByState,
  };
};

const FilterBoxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FilterBox);

export default FilterBoxContainer;
