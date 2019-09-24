import React from "react";
import { Helmet } from "react-helmet";

import { LANDING, SCRATCH, TEMPLATE } from "modules/create-market/constants";

import Form from "modules/create-market/containers/form";
import Landing from "modules/create-market/containers/landing";
import Styles from "modules/create-market/components/create-market-view/create-market-view.styles.less";

interface CreateMarketViewProps {
  isMobileSmall: Boolean;
  currentTimestamp: number;
  gasPrice: number;
  history: Object;
  newMarket: Object;
  universe: Object;
  addOrderToNewMarket: Function;
  estimateSubmitNewMarket: Function;
  removeOrderFromNewMarket: Function;
  submitNewMarket: Function;
  updateNewMarket: Function;
  meta: Object;
  availableEth?: number;
  availableRep?: number;
}

interface CreateMarketViewState {
  selected: number;
  page: number;
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

CreateMarketView.defaultProps = {
  availableEth: 0,
  availableRep: 0
};
