import React from "react";

import { TextInput } from "modules/common/form";
import { LargeSubheaders } from "modules/create-market/components/common";
import InitialLiquidity from "modules/create-market/containers/initial-liquidity";
import OrderBook from "modules/market-charts/containers/order-book";
import TradingForm from "modules/market/containers/trading-form";
import {
  BUY,
  SCALAR,
  YES_NO
} from "modules/common/constants";
import FilterSwitchBox from "modules/portfolio/containers/filter-switch-box";
import OpenOrdersHeader from "modules/portfolio/components/common/open-orders-header";
import MarketDepth from "modules/market-charts/containers/market-outcome-chart-depth";
import QuadBox from "modules/portfolio/components/common/quad-box";
import { Visibility } from "modules/create-market/components/visibility";

import Styles from "modules/create-market/fees-liquidity.styles.less";
import { OutcomeFormatted, NewMarket } from "modules/types";

interface FeesLiquidityProps {
  newMarket: NewMarket;
  updateNewMarket: Function;
  address: String;
  updatePage: Function;
  clearNewMarket: Function;
  addOrderToNewMarket: Function;
  removeOrderFromNewMarket: Function;
  onChange: Function;
  onError: Function;
  updateInitialLiquidityCosts: Function;
}

interface FeesLiquidityState {
  selectedOutcome: Number;
  hoveredDepth: any;
  hoveredPrice: any;
}

export default class FeesLiquidity extends React.Component<
  FeesLiquidityProps,
  FeesLiquidityState
> {
  state: FeesLiquidityState = {
    selectedOutcome: this.props.newMarket.marketType === YES_NO ? 2 : 1,
    hoveredDepth: [],
    hoveredPrice: null,
  };

  updateSelectedOrderProperties = (selectedOrderProperties) => {
  }

  updateSelectedOutcome = (value: Number) => {
    this.setState({selectedOutcome: value});
  }

  updateLiquidity = (selectedOutcome: OutcomeFormatted, s) => {
    const {
      addOrderToNewMarket,
      updateInitialLiquidityCosts
    } = this.props;

      const outcomeName = selectedOutcome.description;
      addOrderToNewMarket({
        outcomeName,
        outcome: this.state.selectedOutcome,
        outcomeId: selectedOutcome.id,
        type: s.selectedNav,
        price: s.orderPrice,
        quantity: s.orderQuantity,
        orderEstimate: s.orderDaiEstimate,
      });

      updateInitialLiquidityCosts({
        outcome: this.state.selectedOutcome,
        type: s.selectedNav,
        price: s.orderPrice,
        quantity: s.orderQuantity,
        selectedOutcome: this.state.selectedOutcome
      });
  }

  renderRows = (data) => {
    const { newMarket, updateInitialLiquidityCosts } = this.props;
    const outcomeOrders = newMarket.orderBook[this.state.selectedOutcome];

    if (!outcomeOrders) {
      return null; // no rows to render
    }

    const orderId = outcomeOrders.find(order => order.id === data.id);
    if (!orderId) return null;

    const id = Math.random().toString(16).substr(4,6);
    return (
      <InitialLiquidity
        key={"order-" + orderId.id + id}
        order={orderId}
        selectedOutcome={this.state.selectedOutcome}
        updateInitialLiquidityCosts={updateInitialLiquidityCosts}
      />
    );
  }

  updateHoveredDepth(hoveredDepth) {
    this.setState({
      hoveredDepth,
    });
  }

  updateHoveredPrice(hoveredPrice) {
    this.setState({
      hoveredPrice,
    });
  }


  render() {
    const {
      newMarket,
      onChange,
    } = this.props;
    const s = this.state;

    const {
      settlementFee,
      affiliateFee,
      orderBook,
      validations,
      currentStep
    } = newMarket;

    return (
      <div
        className={Styles.FeesLiquidity}
      >
        <div>
          <LargeSubheaders
            link
            smallSubheader
            header="Market creator fee"
            subheader="You have the option of setting a fee on your market. It is a percentage amount you get whenever shares are redeemed for ETH. Fees are typically set below 2%."
          />
          <TextInput
            value={settlementFee}
            type="number"
            placeholder="0"
            innerLabel="%"
            errorMessage={validations[currentStep].settlementFee}
            onChange={(value: string) => onChange("settlementFee", value)}
          />
        </div>

        <div>
          <LargeSubheaders
            link
            smallSubheader
            header="Affiliate fee"
            subheader="You have the option of assigning a percentage of the market creator fee to anyone who helps to promote your market (affiliiates)."
          />
          <TextInput
            placeholder="0"
            type="number"
            onChange={(value: string) => onChange("affiliateFee", value)}
            value={affiliateFee}
            innerLabel="%"
            trailingLabel="of market creator fees"
            errorMessage={validations[currentStep].affiliateFee}
          />
        </div>

        <LargeSubheaders
          link
          smallSubheader
          header="Add initial market liquidity"
          subheader="Initial liquidity is the first batch of orders added to a new maket. It is essential to add initial liquidity to your market so users see it. It’s required that at least one outcome have orders such that the difference between the ask and bid is less than 15% of the range (max minus min), inclusive of fees, of the market. So in a binary or categorical market an ask of .65 and bid of .57 would be 8% and show up, an ask of .76 and bid of .55 would be 21% and not show up to users, and so on. If you do this for more outcomes and add more liquidity, your market will rank higher."
        />

        <div>
          <TradingForm
            market={newMarket}
            selectedOrderProperties={{ orderPrice: "", orderQuantity: "", selectedNav: BUY}}
            selectedOutcomeId={s.selectedOutcome}
            updateSelectedOrderProperties={this.updateSelectedOrderProperties}
            updateLiquidity={this.updateLiquidity}
            initialLiquidity
            updateSelectedOutcome={this.updateSelectedOutcome}
          />
          <OrderBook
            updateSelectedOrderProperties={
              this.updateSelectedOrderProperties
            }
            market={newMarket}
            selectedOutcomeId={s.selectedOutcome}
            initialLiquidity
          />
        </div>

        <Visibility />
        <FilterSwitchBox
          title="Initial liquidity"
          filterLabel="orders"
          data={orderBook[s.selectedOutcome] || []}
          bottomBarContent={<OpenOrdersHeader showTotalCost />}
          renderRows={this.renderRows}
        />
        <QuadBox
          title="Depth chart"
          noBorders
          normalOnMobile
          content={
            <MarketDepth
              market={newMarket}
              initialLiquidity
              selectedOutcomeId={s.selectedOutcome}
              updateSelectedOrderProperties={this.updateSelectedOrderProperties}
              hoveredPrice={s.hoveredPrice}
              hoveredDepth={s.hoveredDepth}
              updateHoveredDepth={(price) => this.updateHoveredDepth(price)}
              updateHoveredPrice={(price) => this.updateHoveredPrice(price)}
            />
          }
        />
      </div>
    );
  }
}
