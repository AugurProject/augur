import React, { PropTypes } from 'react';

import EmDash from 'modules/common/components/em-dash';

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';

const CreateMarketMainTitle = (p) => {
  const initialTitleClass = () => {
    if (p.validations.length) {
      if (p.type) {
        return 'hide-title';
      }
      return 'display-title';
    }
    return '';
  };

  const previewTitleClass = () => {
    if (p.validations.length) {
      if (p.type) {
        return 'display-title';
      }
      return 'hide-title';
    }
    return '';
  };

  const marketType = () => {
    switch (p.type) {
      case BINARY:
        return 'Yes/No';
      case CATEGORICAL:
        return 'Multiple Choice';
      case SCALAR:
        return 'Numerical';
      default:
        return '';
    }
  };

  return (
    <article className="create-market-main-title">
      <h1 className={`title-animation-helper ${previewTitleClass()}`} />
      <h1 className={`initial-title ${initialTitleClass()}`}>Create Market</h1>
      <h1 className={`preview-title ${previewTitleClass()}`}>Market Preview <EmDash /> {marketType()}</h1>
    </article>
  );
};

CreateMarketMainTitle.propTypes = {
  type: PropTypes.string.isRequired,
  validations: PropTypes.array.isRequired
};

export default CreateMarketMainTitle;
