import React from 'react';
// @ts-ignore
import Styles from 'modules/market-charts/components/order-header/order-header.styles.less';
import { ToggleExtendButton } from 'modules/common/buttons';
import { ZEROX_STATUSES_TOOLTIP } from 'modules/common/constants';
import { StatusDotTooltip } from 'modules/common/labels';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface OrderHeaderProps {
  title: string;
  headers: string[];
  toggle: Function;
  hide: boolean;
}

const OrderHeader = ({
  title,
  headers,
  toggle,
  hide,
}: OrderHeaderProps) => {
  const { zeroXStatus } = useAppStatusStore();
  return (
    <section className={Styles.OrderHeader}>
      <span
        className={Styles.WithStatus}
      >
        <StatusDotTooltip
          status={zeroXStatus}
          tooltip={ZEROX_STATUSES_TOOLTIP[zeroXStatus]}
          title={title}
        />
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
}
export default OrderHeader;
