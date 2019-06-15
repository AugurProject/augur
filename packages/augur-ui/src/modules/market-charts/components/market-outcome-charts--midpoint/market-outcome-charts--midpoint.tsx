import React from "react";
import Styles from "modules/market-charts/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint.styles.less";

interface MidpointProps {
  orderBookKeys: {
    mid: number;
  };
  hasOrders: boolean;
  pricePrecision: number;
}

const Midpoint = ({ orderBookKeys, pricePrecision, hasOrders }: MidpointProps) => (
  <section>
    {hasOrders && (
      <div className={Styles.MarketOutcomeMidpoint}>
        <div className={Styles.MarketOutcomeMidpointLine} />
        <div className={Styles.MarketOutcomeMidpointValue}>
          {`${orderBookKeys.mid.toFixed(pricePrecision)} DAI`}
        </div>
      </div>
    )}
    {!hasOrders && (
      <div className={Styles.MarketOutcomeMidpointNullState}>
        No Open Orders
      </div>
    )}
  </section>
);

export default Midpoint;
