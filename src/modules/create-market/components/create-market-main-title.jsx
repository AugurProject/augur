import React, { PropTypes } from 'react';

import EmDash from 'modules/common/components/em-dash';

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

  return (
    <article className="create-market-main-title">
      <h1 className={`title-animation-helper ${previewTitleClass()}`} />
      <h1 className={`initial-title ${initialTitleClass()}`}>Create Market</h1>
      <h1 className={`preview-title ${previewTitleClass()}`}>Market Preview <EmDash /></h1>
    </article>
  );
};

CreateMarketMainTitle.propTypes = {
  type: PropTypes.string.isRequired,
  validations: PropTypes.array.isRequired
};

export default CreateMarketMainTitle;
