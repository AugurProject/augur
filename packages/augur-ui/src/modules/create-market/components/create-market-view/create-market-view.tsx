import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { Getters } from '@augurproject/sdk';

import { LANDING, SCRATCH, TEMPLATE } from "modules/create-market/constants";
import Form from "modules/create-market/containers/form";
import Landing from "modules/create-market/containers/landing";
import Styles from "modules/create-market/components/create-market-view/create-market-view.styles.less";
import { Universe } from "@augurproject/sdk/src/state/getter";
import { CategoryStats } from "@augurproject/sdk/src/state/getter/Markets";

interface CreateMarketViewProps {
  universe: Universe;
  getCategoryStats: Function;
}

interface CreateMarketViewState {
  selected: number;
  page: number;
  categoryStats: CategoryStats | null;
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

  componentDidMount() {
    window.scrollTo(0,0);
      this.props.getCategoryStats(
        this.props.universe.id,
        (err, result: Getters.Markets.CategoryStats) => {
          if (err) return console.log('Error getCategoryStats:', err);
          this.setState({
            categoryStats: result,
          });
        }
      );
  }

  render() {
    const { page } = this.state;

    return (
      <section className={Styles.CreateMarketView}>
        <Helmet>
          <title>Create Market</title>
        </Helmet>
        {page === LANDING &&
          <Landing updatePage={this.updatePage} categoryStats={this.state.categoryStats} />
        }
        {page === TEMPLATE && <Form {...this.props} template updatePage={this.updatePage} categoryStats={this.state.categoryStats} />}
        {page === SCRATCH && <Form {...this.props} updatePage={this.updatePage} />}
      </section>
    );
  }
}

CreateMarketView.propTypes = {
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
  availableEth: 0,
  availableRep: 0
};
