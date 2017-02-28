import React, { Component, PropTypes } from 'react';

import InputList from 'modules/common/components/input-list';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_KEYWORDS } from 'modules/create-market/constants/new-market-creation-steps';
import { KEYWORDS_MAX_NUM, TAGS_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints';

export default class CreateMarketFormKeywords extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep &&
        newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_KEYWORDS
    ) {
      nextProps.updateValidity(true);
    }
  }

  render() {
    const p = this.props;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <h2>Keywords</h2>
        <InputList
          list={p.keywords}
          listMaxElements={KEYWORDS_MAX_NUM}
          itemMaxLength={TAGS_MAX_LENGTH}
          onChange={keywords => p.updateNewMarket({ keywords })}
        />
      </article>
    );
  }
}

CreateMarketFormKeywords.propTypes = {
  currentStep: PropTypes.number.isRequired,
  keywords: PropTypes.array.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
