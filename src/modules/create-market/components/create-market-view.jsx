import React, { PropTypes } from 'react';
import CreateMarketForm from 'modules/create-market/components/create-market-form';

const CreateMarketPage = p => (
  <section id="create_market_view">
    <CreateMarketForm
      className="create-market-content"
      {...p.createMarketForm}
      scalarShareDenomination={p.scalarShareDenomination}
    />
  </section>
);

CreateMarketPage.propTypes = {
  className: PropTypes.string,
  createMarketForm: PropTypes.object
};

export default CreateMarketPage;
