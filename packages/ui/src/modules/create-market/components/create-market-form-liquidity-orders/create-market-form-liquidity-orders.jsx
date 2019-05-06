import React from "react";
import PropTypes from "prop-types";
import { CATEGORICAL } from "modules/common-elements/constants";
import MarketLiquidityTable from "modules/market/components/market-liquidity-table/market-liquidity-table";

import StylesForm from "modules/create-market/components/create-market-form/create-market-form.styles";
import Styles from "modules/create-market/components/create-market-form-liquidity-orders/create-market-form-liquidity-orders.styles";

const CreateMarketLiquidityOrders = props => {
  const { newMarket, liquidityState, removeOrderFromNewMarket } = props;
  const defaultOutcome = newMarket.type !== CATEGORICAL ? 1 : "";
  const selectedOutcome =
    liquidityState && liquidityState.selectedOutcome
      ? liquidityState.selectedOutcome
      : defaultOutcome;
  const outcomeOrders = newMarket.orderBook[selectedOutcome];
  const isNullState = !(outcomeOrders && outcomeOrders.length);

  return (
    <div className={StylesForm.CreateMarketForm_form_inner_wrapper}>
      <h1 className={Styles.LiquidityOrders__Header}>
        Initial Liquidity Orders
      </h1>
      <div className={Styles.LiquidityOrders__Container}>
        {isNullState && (
          <div className={Styles.LiquidityOrders__NullState}>
            It appears you have not created any orders for this outcome. You
            will be able to view and cancel your orders here once you have
            created some.
          </div>
        )}
        {!isNullState && (
          <div className={Styles.LiquidityOrders__TableWrapper}>
            <ul className={Styles.LiquidityOrders__TableHeader}>
              <li>Type</li>
              <li>Outcome</li>
              <li>Quantity</li>
              <li>Limit Price</li>
              <li>Cost</li>
              <li />
            </ul>
            <MarketLiquidityTable
              marketType={newMarket.type}
              outcomeOrders={outcomeOrders}
              removeOrderFromNewMarket={removeOrderFromNewMarket}
              selectedOutcome={selectedOutcome}
            />
          </div>
        )}
      </div>
    </div>
  );
};

CreateMarketLiquidityOrders.propTypes = {
  liquidityState: PropTypes.object.isRequired,
  newMarket: PropTypes.object.isRequired,
  removeOrderFromNewMarket: PropTypes.func.isRequired
};

export default CreateMarketLiquidityOrders;
