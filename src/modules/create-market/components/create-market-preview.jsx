import React, { PropTypes } from 'react';

// NOTE --  Discrete component due to vastly different functionality as compared to `market-preview.jsx`
const CreateMarketPreview = p => (
  <article className="create-market-preview">
    <div className="create-market-details">
      <div className="create-market-tags"></div>
      <span className="create-market-description"></span>
      <div className="create-market-properties"></div>
    </div>
    <ul className="create-market-outcomes">
    </ul>
  </article>
);

export default CreateMarketPreview;

CreateMarketPreview.propTypes = {
  newMarket: PropTypes.object.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
