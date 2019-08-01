import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { RadioCardGroup, TextInput } from "modules/common/form";
import { LargeSubheaders, ContentBlock, SmallHeaderLink } from "modules/create-market/components/common";
import { SecondaryButton } from "modules/common/buttons";
import { SCRATCH, TEMPLATE, MARKET_TEMPLATES } from "modules/create-market/constants";
import SavedDrafts from "modules/create-market/containers/saved-drafts";
import InitialLiquidity from "modules/create-market/containers/initial-liquidity";
import OrderBook from "modules/market-charts/containers/order-book";
import TradingForm from "modules/market/containers/trading-form";
import {
  BUY,
  YES_NO, 
  SCALAR,
  CATEGORICAL
} from "modules/common/constants";
import FilterSwitchBox from "modules/portfolio/containers/filter-switch-box";
import OpenOrdersHeader from "modules/portfolio/components/common/open-orders-header";
import MarketDepth from "modules/market-charts/containers/market-outcome-chart-depth";
import QuadBox from "modules/portfolio/components/common/quad-box";
import { Visibility } from "modules/create-market/components/visibility";

import Styles from "modules/create-market/fees-liquidity.styles";

interface FeesLiquidityProps {
  newMarket: Object;
  updateNewMarket: Function;
  address: String;
  updatePage: Function;
  clearNewMarket: Function;
  addOrderToNewMarket: Function;
  removeOrderFromNewMarket: Function;
  onChange: Function;
  onError: Function;
}

interface FeesLiquidityState {
  selectedOutcome: Number;
}

export default class FeesLiquidity extends React.Component<
  FeesLiquidityProps,
  FeesLiquidityState
> {
  state: FeesLiquidityState = {
    selectedOutcome: this.props.newMarket.marketType === CATEGORICAL ? 1 : 2
  };

  updateSelectedOrderProperties = (selectedOrderProperties) => {
  }

  updateSelectedOutcome = (value: Number) => {
    this.setState({selectedOutcome: value});
  }

  updateLiquidity = (selectedOutcome, s) => {
    const {
      addOrderToNewMarket,
      newMarket
    } = this.props;

     const { marketType, scalarDenomination } = newMarket;
      let outcomeName = selectedOutcome.description;
      if (marketType === SCALAR) {
        outcomeName = scalarDenomination;
      } 
      addOrderToNewMarket({
        outcomeName,
        outcome: this.state.selectedOutcome,
        type: s.selectedNav,
        price: s.orderPrice,
        quantity: s.orderQuantity,
        orderEstimate: s.orderEthEstimate
      });

      // todo: also call this when orders are cancelled
      // updateInitialLiquidityCosts({
      //   outcome: this.state.selectedOutcome,
      //   type: s.selectedNav,
      //   price: s.orderPrice,
      //   quantity: s.orderQuantity,
      //   selectedOutcome: this.state.selectedOutcome
      // });
  }

  renderRows = (data) => {
    const {
      newMarket
    } = this.props;

    if (!(newMarket.orderBook[this.state.selectedOutcome] && newMarket.orderBook[this.state.selectedOutcome][data.id])) return;

    return (
      <InitialLiquidity
        key={"order-"+data.id}
        order={newMarket.orderBook[this.state.selectedOutcome][data.id]}
        selectedOutcome={this.state.selectedOutcome}
      />
    );
  }

  updateHoveredDepth(hoveredDepth) { 
  }

  updateHoveredPrice(hoveredPrice) {
  }


  render() {
    const {
      updatePage,
      newMarket,
      onChange
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
            type="number"
            value={settlementFee}
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
            type="number"
            placeholder="0"
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
              hoveredPrice={null}
              hoveredDepth={[]}
              updateHoveredDepth={this.updateHoveredDepth}
              updateHoveredPrice={this.updateHoveredPrice}
            />
          }
        />
      </div>
    );
  }
}
