import React from "react";

import Styles from "modules/market-charts/components/order-header/order-header.styles.less";
import { ToggleExtendButton } from "modules/common/buttons";

interface OrderHeaderProps {
  title: string;
  headers: Array<any>;
  extended: boolean;
  toggle: any;
  hide: boolean;
}

const OrderHeader = ({
  title,
  headers,
  extended,
  toggle,
  hide
}: OrderHeaderProps) => (
  <section className={Styles.OrderHeader}>
    <span>
      {title}
      <ToggleExtendButton toggle={toggle} />
    </span>
    {!hide && (
      <div>
        <div>
          {headers[0]}
        </div>
        <div>
          {headers[1]}
        </div>
        <div>
          {headers[2]}
        </div>
      </div>
    )}
  </section>
);

export default OrderHeader;
