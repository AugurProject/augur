import React from 'react';
import Styles from 'modules/market-charts/components/order-header/order-header.styles.less';
import { ToggleExtendButton } from 'modules/common/buttons';
import { ZEROX_STATUSES_TOOLTIP } from 'modules/common/constants';
import { StatusDotTooltip } from 'modules/common/labels';
import classNames from 'classnames';

interface OrderHeaderProps {
  title: string;
  headers: string[];
  toggle: any;
  hide: boolean;
  status?: string;
}

const OrderHeader = ({
  title,
  headers,
  toggle,
  hide,
  status,
}: OrderHeaderProps) => (
  <section className={Styles.OrderHeader}>
    <span
      className={classNames({
        [Styles.WithStatus]: !!status,
      })}
    >
      <StatusDotTooltip
        status={status}
        tooltip={ZEROX_STATUSES_TOOLTIP[status]}
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

export default OrderHeader;
