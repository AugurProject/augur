import React from "react";

import Styles from "modules/market-charts/components/order-header/order-header.styles.less";
import { ToggleExtendButton } from "modules/common/buttons";

interface OrderHeaderProps {
  title: string;
  headers: Array<any>;
  toggle: any;
  hide: boolean;
}

const OrderHeader = ({
  title,
  headers,
  toggle,
  hide
}: OrderHeaderProps) => (
  <section className={Styles.OrderHeader}>
    <span>
      {title}
      <ToggleExtendButton toggle={toggle} />
    </span>
    {!hide && (
      <ul>
        <li>{headers[0]}</li>
        <li>{headers[1]}</li>
        <li>{headers[2]}</li>
      </ul>
    )}
  </section>
);

export default OrderHeader;
