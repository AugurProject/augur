import React, { Component } from "react";
import { Link } from "react-router-dom";

import Wrapper from "modules/trading/components/wrapper/wrapper";
import { ACCOUNT_DEPOSIT } from "modules/routes/constants/views";
import makePath from "modules/routes/helpers/make-path";
import Styles from "modules/market/components/trading-form/trading-form.styles.less";

import { PrimaryButton } from "modules/common/buttons";
import { MarketData } from "modules/types";
import { MarketInfoOutcome } from "@augurproject/sdk/build/state/getter/Markets";

interface TradingFormProps {
  availableFunds: BigNumber;
  isLogged: boolean;
  isConnectionTrayOpen: boolean;
  market: MarketData;
  marketReviewTradeSeen: boolean;
  marketReviewTradeModal: Function;
  selectedOrderProperties: Object;
  selectedOutcomeId: string;
  updateSelectedOrderProperties: Function;
  handleFilledOnly: Function;
  gasPrice: number;
  updateSelectedOutcome: Function;
  updateTradeCost: Function;
  updateTradeShares: Function;
  toggleConnectionTray: Function;
  onSubmitPlaceTrade: Function;
}

interface TradingFormState {
  showForm: boolean;
  selectedOutcome: MarketInfoOutcome | undefined;
}

class TradingForm extends Component<TradingFormProps, TradingFormState> {
  static defaultProps = {
    selectedOutcomeId: "1"
  };

  state: TradingFormState = {
    showForm: false,
    selectedOutcome:
    this.props.market && this.props.market.outcomes && this.props.market.outcomes.find(
            outcome => outcome.id === this.props.selectedOutcomeId
          )
  };

  componentWillReceiveProps(nextProps: TradingFormProps) {
    const { selectedOutcomeId } = this.props;
    const { market } = nextProps;
    if (
      (selectedOutcomeId !== nextProps.selectedOutcomeId)
    ) {
      if (nextProps.selectedOutcomeId !== null) {
        const selectedOutcome = market && market.outcomes && market.outcomes.find(
          outcome => outcome.id === nextProps.selectedOutcomeId
        );
        this.setState({ selectedOutcome });
      }
    }
  }

  toggleForm = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  render() {
    const {
      availableFunds,
      isLogged,
      isConnectionTrayOpen,
      market,
      selectedOrderProperties,
      gasPrice,
      handleFilledOnly,
      updateSelectedOutcome,
      updateTradeCost,
      updateTradeShares,
      toggleConnectionTray,
      onSubmitPlaceTrade,
      marketReviewTradeSeen,
      marketReviewTradeModal
    } = this.props;
    const s = this.state;

    const hasFunds = availableFunds && availableFunds.gt(0);
    const hasSelectedOutcome = s.selectedOutcome !== null;

    let initialMessage: string | boolean = "";

    switch (true) {
      case !isLogged:
        initialMessage = "Connect a wallet to place an order.";
        break;
      case isLogged && !hasFunds:
        initialMessage = "Add funds to begin trading.";
        break;
      case isLogged && hasFunds && !hasSelectedOutcome:
        initialMessage = "Select an outcome to begin placing an order.";
        break;
      default:
        initialMessage = false;
    }

    return (
      <section className={Styles.TradingForm}>
        <Wrapper
          market={market}
          isLogged={isLogged}
          selectedOutcome={s.selectedOutcome}
          selectedOrderProperties={selectedOrderProperties}
          toggleForm={this.toggleForm}
          availableFunds={availableFunds}
          updateSelectedOrderProperties={
            this.props.updateSelectedOrderProperties
          }
          gasPrice={gasPrice}
          handleFilledOnly={handleFilledOnly}
          updateSelectedOutcome={updateSelectedOutcome}
          updateTradeCost={updateTradeCost}
          updateTradeShares={updateTradeShares}
          onSubmitPlaceTrade={onSubmitPlaceTrade}
          marketReviewTradeModal={marketReviewTradeModal}
          marketReviewTradeSeen={marketReviewTradeSeen}
        />
        {initialMessage && (
          <div>
            {initialMessage && <p>{initialMessage}</p>}
            {!isLogged && (
              <PrimaryButton
                id="login-button"
                action={() => toggleConnectionTray(!isConnectionTrayOpen)}
                text="Connect a Wallet"
              />
            )}
            {!hasFunds && isLogged && (
              <Link to={makePath(ACCOUNT_DEPOSIT)}>
                <PrimaryButton
                  id="add-funds"
                  action={() => {}}
                  text="Add Funds"
                />
              </Link>
            )}
          </div>
        )}
      </section>
    );
  }
}

export default TradingForm;
