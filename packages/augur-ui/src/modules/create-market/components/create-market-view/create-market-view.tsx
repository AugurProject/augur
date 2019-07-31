import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { LANDING, SCRATCH, TEMPLATE } from "modules/create-market/constants";

import Form from "modules/create-market/containers/form";
import Landing from "modules/create-market/containers/landing";
import Styles from "modules/create-market/components/create-market-view/create-market-view.styles";

interface CreateMarketViewProps {
}

interface CreateMarketViewPState {
  selected: number;
}

export default class CreateMarketView extends React.Component<
  CreateMarketViewProps,
  CreateMarketViewState
> {
  state: FormState = {
    page: this.props.history.location.state || LANDING
  };

  updatePage = (page: string) => {
    this.setState({page});
  }

  render() {
    const { page } = this.state;

    return (
      <section className={Styles.CreateMarketView}>
        <Helmet>
          <title>Create Market</title>
        </Helmet>
        {page === LANDING &&
          <Landing updatePage={this.updatePage} />
        }
        {page === TEMPLATE && <Form {...this.props} template updatePage={this.updatePage} />}
        {page === SCRATCH && <Form {...this.props} updatePage={this.updatePage} />}
      </section>
    );
  }
}

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
  availableEth: PropTypes.number,
  availableRep: PropTypes.number
};

CreateMarketView.defaultProps = {
  availableEth: "0",
  availableRep: "0"
};
