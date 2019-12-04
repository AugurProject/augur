import React, { Component } from 'react';
import { SelectedOrderProperties } from 'modules/trading/components/wrapper';
import Wrapper from 'modules/trading/containers/wrapper';
import Styles from 'modules/trading/components/trading-form.styles.less';
import { MarketData, OutcomeOrderBook, OutcomeFormatted } from 'modules/types';

interface TradingFormProps {
  market: MarketData;
  selectedOrderProperties: SelectedOrderProperties;
  selectedOutcomeId: number;
  updateSelectedOrderProperties: Function;
  updateSelectedOutcome: Function;
  updateLiquidity?: Function;
  initialLiquidity?: boolean;
  orderBook: OutcomeOrderBook;
  tradingTutorial?: boolean;
  tutorialNext?: Function;
}

interface TradingFormState {
  selectedOutcome: OutcomeFormatted | undefined;
}

class TradingForm extends Component<TradingFormProps, TradingFormState> {
  static defaultProps = {
    selectedOutcomeId: 2,
  };

  state: TradingFormState = {
    selectedOutcome:
      this.props.market &&
      this.props.market.outcomesFormatted &&
      this.props.market.outcomesFormatted.find(
        outcome => outcome.id === this.props.selectedOutcomeId
      )
  };

  componentDidUpdate(prevProps: TradingFormProps) {
    const { selectedOutcomeId } = prevProps;
    const { market } = this.props;
    if (
      selectedOutcomeId !== this.props.selectedOutcomeId ||
      market.outcomes !== prevProps.market.outcomes
    ) {
      if (this.props.selectedOutcomeId !== null) {
        const selectedOutcome =
          market &&
          market.outcomesFormatted &&
          market.outcomesFormatted.find(
            outcome => outcome.id === this.props.selectedOutcomeId
          );
        this.setState({ selectedOutcome });
      }
    }
  }

  render() {
    const {
      market,
      selectedOrderProperties,
      updateSelectedOutcome,
      updateLiquidity,
      initialLiquidity,
      tradingTutorial,
      tutorialNext,
      updateSelectedOrderProperties,
    } = this.props;
    const { selectedOutcome } = this.state;

    return (
      <section className={Styles.TradingForm}>
        <Wrapper
          market={market}
          selectedOutcome={selectedOutcome}
          selectedOrderProperties={selectedOrderProperties}
          updateSelectedOrderProperties={updateSelectedOrderProperties}
          updateSelectedOutcome={updateSelectedOutcome}
          updateLiquidity={updateLiquidity}
          initialLiquidity={initialLiquidity}
          tradingTutorial={tradingTutorial}
          tutorialNext={tutorialNext}
        />
      </section>
    );
  }
}

export default TradingForm;
