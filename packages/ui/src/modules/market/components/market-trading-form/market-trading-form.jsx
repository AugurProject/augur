import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import TradingWrapper from "modules/trading/components/trading--wrapper/trading--wrapper";
import { isEqual } from "lodash";
import classNames from "classnames";
import { ACCOUNT_DEPOSIT } from "modules/routes/constants/views";
import { BigNumber } from "utils/create-big-number";
import makePath from "modules/routes/helpers/make-path";
import Styles from "modules/market/components/market-trading-form/market-trading-form.styles";

import { PrimaryButton } from "modules/common-elements/buttons";

class MarketTradingForm extends Component {
  static propTypes = {
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isConnectionTrayOpen: PropTypes.bool.isRequired,
    market: PropTypes.object.isRequired,
    marketReviewTradeSeen: PropTypes.bool.isRequired,
    marketReviewTradeModal: PropTypes.func.isRequired,
    selectedOrderProperties: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.string,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    handleFilledOnly: PropTypes.func.isRequired,
    gasPrice: PropTypes.number.isRequired,
    updateSelectedOutcome: PropTypes.func.isRequired,
    updateTradeCost: PropTypes.func.isRequired,
    updateTradeShares: PropTypes.func.isRequired,
    showSelectOutcome: PropTypes.func.isRequired,
    toggleConnectionTray: PropTypes.func.isRequired,
    onSubmitPlaceTrade: PropTypes.func.isRequired
  };

  static defaultProps = {
    selectedOutcome: null
  };

  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      selectedOutcome:
        props.selectedOutcome !== null && props.market.outcomes
          ? props.market.outcomes.find(
              outcome => outcome.id === props.selectedOutcome
            )
          : null
    };

    this.toggleForm = this.toggleForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { market, selectedOutcome } = this.props;
    if (
      (!isEqual(selectedOutcome, nextProps.selectedOutcome) ||
        !isEqual(market.outcomes, nextProps.market.outcomes)) &&
      (nextProps.market && nextProps.market.outcomes)
    ) {
      if (nextProps.selectedOutcome !== null) {
        this.setState({
          selectedOutcome: nextProps.market.outcomes.find(
            outcome => outcome.id === nextProps.selectedOutcome
          )
        });
      } else {
        this.setState({ selectedOutcome: null });
      }
    }
  }

  toggleForm() {
    this.setState({ showForm: !this.state.showForm });
  }

  render() {
    const {
      availableFunds,
      isLogged,
      isMobile,
      isConnectionTrayOpen,
      market,
      selectedOrderProperties,
      gasPrice,
      handleFilledOnly,
      updateSelectedOutcome,
      updateTradeCost,
      updateTradeShares,
      showSelectOutcome,
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
      <section className={classNames(Styles.MarketTradingForm)}>
        <TradingWrapper
          market={market}
          isLogged={isLogged}
          selectedOutcome={s.selectedOutcome}
          selectedOrderProperties={selectedOrderProperties}
          isMobile={isMobile}
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
          showSelectOutcome={showSelectOutcome}
          onSubmitPlaceTrade={onSubmitPlaceTrade}
          marketReviewTradeModal={marketReviewTradeModal}
          marketReviewTradeSeen={marketReviewTradeSeen}
        />
        {initialMessage && (
          <div className={Styles["MarketTradingForm__initial-message"]}>
            {initialMessage && <p>{initialMessage}</p>}
            {!isLogged && (
              <PrimaryButton
                id="login-button"
                action={() => toggleConnectionTray(!isConnectionTrayOpen)}
                text="Connect a Wallet"
              />
            )}
            {!hasFunds &&
              isLogged && (
                <Link to={makePath(ACCOUNT_DEPOSIT)}>
                  <span className={Styles["MarketTradingForm__deposit-button"]}>
                    Add Funds
                  </span>
                </Link>
              )}
          </div>
        )}
      </section>
    );
  }
}

export default MarketTradingForm;
