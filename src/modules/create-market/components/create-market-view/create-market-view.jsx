import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import CreateMarketForm from "modules/create-market/components/create-market-form/create-market-form";

import Styles from "modules/create-market/components/create-market-view/create-market-view.styles";

const CreateMarketView = p => (
  <section className={Styles.CreateMarketView}>
    <Helmet>
      <title>Create Market</title>
    </Helmet>
    <div>
      <CreateMarketForm {...p} />
    </div>
  </section>
);

CreateMarketView.propTypes = {
  categories: PropTypes.array.isRequired,
  isMobileSmall: PropTypes.bool.isRequired,
  currentTimestamp: PropTypes.number.isRequired,
  gasPrice: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  newMarket: PropTypes.object.isRequired,
  universe: PropTypes.object.isRequired,
  addOrderToNewMarket: PropTypes.func.isRequired,
  estimateSubmitNewMarket: PropTypes.func.isRequired,
  removeOrderFromNewMarket: PropTypes.func.isRequired,
  submitNewMarket: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired,
  meta: PropTypes.object.isRequired,
  availableEth: PropTypes.string,
  availableRep: PropTypes.string
};

CreateMarketView.defaultProps = {
  availableEth: "0",
  availableRep: "0"
};

export default CreateMarketView;
