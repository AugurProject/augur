import React, { useState, useEffect } from 'react';

import { TextInput } from 'modules/common/form';
import { LargeSubheaders } from 'modules/create-market/components/common';
import InitialLiquidity from 'modules/create-market/initial-liquidity';
import OrderBook from 'modules/market-charts/components/order-book/order-book';
import TradingForm from 'modules/trading/components/trading-form';
import { BUY, CATEGORICAL } from 'modules/common/constants';
import FilterSwitchBox from 'modules/portfolio/components/common/filter-switch-box';
import OpenOrdersHeader from 'modules/portfolio/components/common/open-orders-header';
import DepthChart from 'modules/market-charts/components/depth/depth';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import Visibility from 'modules/create-market/components/visibility';

import Styles from 'modules/create-market/fees-liquidity.styles.less';
import { OutcomeFormatted } from 'modules/types';
import { MARKET_COPY_LIST } from 'modules/create-market/constants';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import { DefaultOrderPropertiesMap } from "modules/market/components/market-view/market-view";
import { getReportingFeePercentage } from 'modules/contracts/actions/contractCalls';
import { formatPercent } from 'utils/format-number';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface FeesLiquidityProps {
  onChange: Function;
}

const DEFAULT_ORDER_PROPERTIES = {
  orderPrice: '',
  orderQuantity: '',
  selectedNav: BUY,
};

export const FeesLiquidity = ({ onChange }: FeesLiquidityProps) => {
  const {
    newMarket,
    actions: { addOrderToNewMarket },
  } = useAppStatusStore();
  const [selectedOutcome, setSelectedOutcome] = useState(
    newMarket.marketType === CATEGORICAL ? 1 : 2
  );
  const [selectedOrderProperties, setSelectedOrderProperties] = useState({
    ...DEFAULT_ORDER_PROPERTIES,
  });
  const [hoveredDepth, setHoveredDepth] = useState([]);
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [reportingFeePercent, setReportingFeePercent] = useState(
    formatPercent(0)
  );
  const [creatorFeePercent, setCreatorFeePercent] = useState(formatPercent(0));

  useEffect(() => {
    getReportingFeePct();
  }, [true]);

  const { settlementFee, affiliateFee, orderBook, validations } = newMarket;

  const getReportingFeePct = async () => {
    const newReportingFeePercent = await getReportingFeePercentage();
    setReportingFeePercent(newReportingFeePercent);
    if (settlementFee) {
      const creatorFee = Number(settlementFee) - newReportingFeePercent.value;
      const newCreatorFeePercent = formatPercent(
        !isNaN(creatorFee) && creatorFee < 0 ? 0 : creatorFee
      );
      setCreatorFeePercent(newCreatorFeePercent);
    }
  };

  const updateLiquidity = (outcome: OutcomeFormatted, TradeObj) =>
    addOrderToNewMarket({
      outcomeName: outcome.description,
      outcome,
      outcomeId: outcome.id,
      type: TradeObj.selectedNav,
      price: TradeObj.orderPrice,
      quantity: TradeObj.orderQuantity,
      orderEstimate: TradeObj.orderDaiEstimate,
    });

  const localSettlementFeeChange = value => {
    const fee = reportingFeePercent.value;
    let creatorFee = value;
    if (!isNaN(value)) {
      creatorFee = Number(value) - fee;
      setCreatorFeePercent(formatPercent(creatorFee < 0 ? 0 : creatorFee));
    }
    value === '0'
      ? onChange('settlementFee', 0)
      : onChange('settlementFee', creatorFee);
    
    onChange('settlementFeePercent', formatPercent((fee + creatorFee), {
      positiveSign: false,
      decimals: 4,
      decimalsRounded: 4,
    }))
  };

  const renderRows = data => {
    const outcomeOrders = newMarket.orderBook[selectedOutcome];

    if (!outcomeOrders) {
      return null; // no rows to render
    }

    const orderId = outcomeOrders.find(order => order.id === data.id);
    if (!orderId) return null;

    const id = Math.random()
      .toString(16)
      .substr(4, 6);
    return (
      <InitialLiquidity
        key={'order-' + orderId.id + id}
        order={orderId}
        selectedOutcome={selectedOutcome}
      />
    );
  };

  const marketTradingFee =
  !isNaN(settlementFee) && settlementFee !== 0
    ? reportingFeePercent.value + Number(settlementFee)
    : settlementFee;

  return (
    <div className={Styles.FeesLiquidity}>
      <div>
        <LargeSubheaders
          link
          smallSubheader
          copyType={MARKET_COPY_LIST.CREATOR_FEE}
          header="Market trading fee"
          subheader={`Market Trading fee is made up of market creator fee and reporting fee combined. Currently the reporting fee is ${reportingFeePercent.formatted}%. Set market trading fee to 2% or less in order for your market to show up to traders, by default.`}
        />
        <LargeSubheaders
          smallSubheader
          header=""
          subheader={`The Market Creator Fee is the percentage amount the market creator receives whenever market shares are settled, either during trading or upon market resolution. This fee will be ${creatorFeePercent.formatted}%.`}
        />
        <TextInput
          value={String(marketTradingFee)}
          type="number"
          placeholder="0"
          innerLabel="%"
          errorMessage={validations.settlementFee}
          onChange={(value: string) => localSettlementFeeChange(value)}
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
        <TextInput
          placeholder="0"
          type="number"
          onChange={(value: string) => onChange('affiliateFee', value)}
          value={String(affiliateFee)}
          innerLabel="%"
          trailingLabel="of market creator fees"
          errorMessage={validations.affiliateFee}
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
          selectedOrderProperties={selectedOrderProperties}
          selectedOutcomeId={selectedOutcome}
          updateSelectedOrderProperties={value =>
            setSelectedOrderProperties(value)
          }
          updateLiquidity={updateLiquidity}
          updateSelectedOutcome={value => {
            setSelectedOutcome(value);
            setSelectedOrderProperties({ ...DEFAULT_ORDER_PROPERTIES });
          }}
        />
        <OrderBook
          updateSelectedOrderProperties={value =>
            setSelectedOrderProperties(value)
          }
          market={newMarket}
          orderBook={formatOrderBook(orderBook[selectedOutcome] || [])}
          initialLiquidity
        />
      </div>

      <Visibility />
      <FilterSwitchBox
        title="Initial liquidity"
        filterLabel="orders"
        data={orderBook[selectedOutcome] || []}
        bottomBarContent={
          <OpenOrdersHeader showTotalCost noRightMargin initialLiquidity />
        }
        renderRows={renderRows}
        showHeaderOnMobile
      />
      <QuadBox
        title="Depth chart"
        noBorders
        normalOnMobile
        content={
          <DepthChart
            market={newMarket}
            orderBook={formatOrderBook(orderBook[selectedOutcome] || [])}
            initialLiquidity
            updateSelectedOrderProperties={value =>
              setSelectedOrderProperties(value)
            }
            hoveredPriceProp={hoveredPrice}
            hoveredDepth={hoveredDepth}
            updateHoveredDepth={price => setHoveredDepth(price)}
            updateHoveredPrice={price => setHoveredPrice(price)}
          />
        }
      />
    </div>
  );
};

export default FeesLiquidity;
