import React, { Component } from "react";
import { Link } from "react-router-dom";

import Wrapper from "modules/trading/components/wrapper/wrapper";
import { ACCOUNT_DEPOSIT } from "modules/routes/constants/views";
import makePath from "modules/routes/helpers/make-path";
import Styles from "modules/market/components/trading-form/trading-form.styles";

import { PrimaryButton } from "modules/common/buttons";
import { MarketData } from "modules/types";

interface TradingFormProps {
  availableFunds: Object;
  isLogged: Boolean;
  isConnectionTrayOpen: Boolean;
  market: MarketData;
  marketReviewTradeSeen: Boolean;
  marketReviewTradeModal: Function;
  selectedOrderProperties: Object;
  selectedOutcome: number;
  updateSelectedOrderProperties: Function;
  handleFilledOnly: Function;
  gasPrice: Number;
  updateSelectedOutcome: Function;
  updateTradeCost: Function;
  updateTradeShares: Function;
  toggleConnectionTray: Function;
  onSubmitPlaceTrade: Function;
}

interface TradingFormState {
  showForm: Boolean;
  selectedOutcome: number;
}

class TradingForm extends Component<TradingFormProps, TradingFormState> {
  static defaultProps = {
    selectedOutcome: 0
  };

  state: TradingFormState = {
    showForm: false,
    selectedOutcome:
      this.props.market.outcomes
        ? this.props.market.outcomes.find(
            outcome => outcome.id === this.props.selectedOutcome
          )
        : 0
  };

  componentWillReceiveProps(nextProps: TradingFormProps) {
    const { selectedOutcome } = this.props;
    const { market } = nextProps;
    if (
      (selectedOutcome !== nextProps.selectedOutcome)
    ) {
      if (nextProps.selectedOutcome !== null) {
        this.setState({
          selectedOutcome: market.outcomes.find(
            outcome => outcome.id === nextProps.selectedOutcome
          )
        });
      } else {
        this.setState({ selectedOutcome: null });
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

    let initialMessage = "";

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
