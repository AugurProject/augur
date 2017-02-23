import React, { PropTypes } from 'react';
// import CreateMarketForm from 'modules/create-market/components/create-market-form';

const CreateMarketPage = p => (
  <section id="create_market_view">
    <div className="create-market-form">
      <span>Create Market</span>
    </div>
  </section>
);


CreateMarketPage.propTypes = {
  newMarket: PropTypes.object.isRequired,
  scalarMarketsShareDenomination: PropTypes.object.isRequired
};

export default CreateMarketPage;


// <CreateMarketForm
//   className="create-market-content"
//   {...p.createMarketForm}
//   scalarShareDenomination={p.scalarShareDenomination}
// />
