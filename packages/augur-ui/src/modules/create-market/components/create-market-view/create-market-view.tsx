import React from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router-dom";

import { LANDING, SCRATCH, TEMPLATE } from "modules/create-market/constants";

import Form from "modules/create-market/containers/form";
import Landing from "modules/create-market/containers/landing";
import Styles from "modules/create-market/components/create-market-view/create-market-view.styles.less";
import { NewMarket, UIOrder, NodeStyleCallback, LoginAccountMeta, Universe } from "modules/types";

interface CreateMarketViewProps extends RouteComponentProps<{}> {
  isMobileSmall: boolean;
  currentTimestamp: number;
  gasPrice: number;
  newMarket: NewMarket;
  universe: Universe;
  addOrderToNewMarket: (order: UIOrder) => void;
  estimateSubmitNewMarket: (
    newMarket: NewMarket,
    callback?: NodeStyleCallback,
  ) => void;
  removeOrderFromNewMarket: (order: UIOrder) => void;
  submitNewMarket: (
    market: NewMarket,
    callback?: NodeStyleCallback
  ) => void;
  updateNewMarket: (data: NewMarket) => void;
  meta: LoginAccountMeta;
  availableEth?: number;
  availableRep?: number;
}

interface CreateMarketViewState {
  page: string;
}

export default class CreateMarketView extends React.Component<
  CreateMarketViewProps,
  CreateMarketViewState
  > {
  static defaultProps = {
    availableEth: 0,
    availableRep: 0
  };

  state = {
    page: this.props.history.location.state || LANDING
  };

  updatePage = (page: string) => {
    this.setState({ page });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
