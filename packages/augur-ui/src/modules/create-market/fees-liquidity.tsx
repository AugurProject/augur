import React, { useState } from 'react';

import { TextInput, FormDropdown } from "modules/common/form";
import { LargeSubheaders } from "modules/create-market/components/common";
import InitialLiquidity from "modules/create-market/containers/initial-liquidity";
import OrderBook from "modules/market-charts/containers/order-book";
import TradingForm from "modules/trading/components/trading-form";
import {
  BUY,
  CATEGORICAL
} from "modules/common/constants";
import FilterSwitchBox from "modules/portfolio/containers/filter-switch-box";
import OpenOrdersHeader from "modules/portfolio/components/common/open-orders-header";
import DepthChart from "modules/market-charts/containers/depth";
import QuadBox from "modules/portfolio/components/common/quad-box";
import Visibility from "modules/create-market/containers/visibility";

import Styles from "modules/create-market/fees-liquidity.styles.less";
import { OutcomeFormatted, NewMarket, FormattedNumber, ValueLabelPair } from "modules/types";
import { MARKET_COPY_LIST } from "modules/create-market/constants";
import { formatOrderBook } from "modules/create-market/helpers/format-order-book";
import { DefaultOrderPropertiesMap } from "modules/market/components/market-view/market-view";
import { getReportingFeePercentage } from "modules/contracts/actions/contractCalls";
import { formatPercent } from 'utils/format-number';
import { NameValuePair } from 'modules/common/selection';

interface FeesLiquidityProps {
  newMarket: NewMarket;
  address: String;
  updatePage: Function;
  clearNewMarket: Function;
  addOrderToNewMarket: Function;
  removeOrderFromNewMarket: Function;
  onChange: Function;
  onError: Function;
}

interface FeesLiquidityState {
  selectedOutcome: number;
  hoveredDepth: any;
  hoveredPrice: any;
  selectedOrderProperties: DefaultOrderPropertiesMap;
  reportingFeePercent: FormattedNumber;
  creatorFeePercent: FormattedNumber;
  affiliateFeeOptions: NameValuePair[];
  affiliateFeeOptionsDefault: NameValuePair;
}

export default class FeesLiquidity extends React.Component<
  FeesLiquidityProps,
  FeesLiquidityState
> {
  DEFAULT_ORDER_PROPERTIES = {
    orderPrice: '',
    orderQuantity: '',
    selectedNav: BUY,
  };
  state: FeesLiquidityState = {
    selectedOutcome: this.props.newMarket.marketType === CATEGORICAL ? 1 : 2,
    hoveredDepth: [],
    hoveredPrice: null,
    selectedOrderProperties: this.DEFAULT_ORDER_PROPERTIES,
    reportingFeePercent: formatPercent(0),
    creatorFeePercent: formatPercent(0),
    affiliateFeeOptions: [{
      label: '100 %',
      value: '100'
    }, {
      label: '50 %',
      value: '50'
    },
    {
      label: '33 %',
      value: '33'
    },
    {
      label: '25 %',
      value: '25'
    },
    {
      label: '20 %',
      value: '20'
    },
    {
      label: '10 %',
      value: '10'
    },
    {
      label: '5 %',
      value: '5'
    },
    {
      label: '0 %',
      value: '0'
    }]
  };

  getReportingFeePct = async () => {
    const reportingFeePercent = await getReportingFeePercentage();
    this.setState({ reportingFeePercent });
    if (this.props.newMarket.settlementFee) {
      const creatorFee = Number(this.props.newMarket.settlementFee) - reportingFeePercent.value
      this.setState({ creatorFeePercent: formatPercent((!isNaN(creatorFee) && creatorFee < 0) ? 0 : creatorFee) });
    }
  }

  componentDidMount() {
    this.getReportingFeePct();
  }

  localSettlementFeeChange = value => {
    const fee = this.state.reportingFeePercent.value
    let creatorFee = value;
    if (!isNaN(value)) {
      creatorFee = Number(value) - fee;
      this.setState({ creatorFeePercent: formatPercent(creatorFee < 0 ? 0 : creatorFee) });
    }
    value === "0" ?
      this.props.onChange("settlementFee", 0)
    :
      this.props.onChange("settlementFee", creatorFee)

    this.props.onChange('settlementFeePercent', formatPercent((fee + creatorFee), {
      positiveSign: false,
      decimals: 4,
      decimalsRounded: 4,
    }));
  }

  updateSelectedOrderProperties = (selectedOrderProperties) => {
    this.setState({selectedOrderProperties})
  }

  updateSelectedOutcome = (value: number) => {
    this.setState({
      selectedOutcome: value,
      selectedOrderProperties: {
        ...this.DEFAULT_ORDER_PROPERTIES,
      },
    });
  }

  updateLiquidity = (selectedOutcome: OutcomeFormatted, s) => {
    const {
      addOrderToNewMarket
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
  }

  renderRows = (data) => {
    const { newMarket } = this.props;
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
    } = newMarket;

    const marketTradingFee =
      !isNaN(settlementFee) && settlementFee !== 0
        ? s.reportingFeePercent.value + Number(settlementFee)
        : settlementFee;
    return (
      <div
        className={Styles.FeesLiquidity}
      >
        <div>
          <LargeSubheaders
            link
            smallSubheader
            copyType={MARKET_COPY_LIST.CREATOR_FEE}
            header="Market OI fee"
            subheader={`Market OI fee is made up of market creator fee and reporting fee combined. Currently the reporting fee is ${s.reportingFeePercent.formatted}%. Set Market OI fee to 2% or less in order for your market to show up to traders, by default.`}
          />
          <LargeSubheaders
            smallSubheader
            header=""
            subheader={`The Market Creator fee is the percentage amount the market creator receives whenever market shares are settled, either during trading or upon market resolution. This fee will be ${s.creatorFeePercent.formatted}%.`}
          />
          <TextInput
            value={String(marketTradingFee)}
            type="number"
            placeholder="0"
            innerLabel="%"
            errorMessage={validations.settlementFee}
            onChange={(value: string) => this.localSettlementFeeChange(value)}
          />
        </div>

        <div>
          <LargeSubheaders
            link
            smallSubheader
            header="Affiliate fee"
            copyType={MARKET_COPY_LIST.AFFILIATE_FEE}
            subheader="You have the option of assigning a percentage of the market creator fee to anyone who helps to promote your market (affiliates)."
          />
          <FormDropdown
            onChange={(value: string) => onChange("affiliateFee", value)}
            defaultValue={'0'}
            options={this.state.affiliateFeeOptions}
            staticLabel={'Select Affiliate Fee'}
          />
        </div>

        <LargeSubheaders
          link
          smallSubheader
          copyType={MARKET_COPY_LIST.INITIAL_LIQUIDITY}
          header="Add initial market liquidity"
          subheader="Initial liquidity is the first batch of orders added to a new maket. It is essential to add initial liquidity to your market so users see it. It’s required that at least one outcome have orders such that the difference between the ask and bid is less than 15% of the range (max minus min), inclusive of fees, of the market. So in a binary or categorical market an ask of .65 and bid of .57 would be 8% and show up, an ask of .76 and bid of .55 would be 21% and not show up to users, and so on. If you do this for more outcomes and add more liquidity, your market will rank higher."
        />

        <div>
          <TradingForm
            market={newMarket}
            selectedOrderProperties={s.selectedOrderProperties}
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
            orderBook={formatOrderBook(orderBook[s.selectedOutcome] || [])}
            selectedOutcomeId={s.selectedOutcome}
            initialLiquidity
          />
        </div>

        <Visibility />
        <FilterSwitchBox
          title="Initial liquidity"
          filterLabel="orders"
          data={orderBook[s.selectedOutcome] || []}
          bottomBarContent={<OpenOrdersHeader showTotalCost noRightMargin initialLiquidity/>}
          renderRows={this.renderRows}
          showHeaderOnMobile
        />
        <QuadBox
          title="Depth chart"
          noBorders
          normalOnMobile
          content={
            <DepthChart
              market={newMarket}
              orderBook={formatOrderBook(orderBook[s.selectedOutcome] || [])}
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
