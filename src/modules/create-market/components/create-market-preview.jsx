import React, { PropTypes } from 'react';

import MarketPreview from 'modules/market/components/market-preview';

const CreateMarketPreview = p => (
  <article className="create-market-preview">
    <MarketPreview
      {...p}
      isCreatingMarket
    />
  </article>
);

export default CreateMarketPreview;

CreateMarketPreview.propTypes = {
  newMarket: PropTypes.object.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
