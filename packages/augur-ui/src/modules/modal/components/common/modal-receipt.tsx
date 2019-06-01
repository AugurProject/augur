import React from "react";

import Styles from "modules/modal/components/common/common.styles.less";

interface ItemProp {
  label: string;
  value: string;
  denomination: string;
}

interface ModalReceiptProps {
  items: Array<ItemProp>;
}

const ModalReceipt = ({ items }: ModalReceiptProps) => (
  <ul className={Styles.Receipt}>
    {items.map((item) => (
      <li key={item.label}>
        <label>{item.label}</label>
        <span>
          {item.value}
          {item.denomination !== "" && <span>{item.denomination}</span>}
        </span>
      </li>
    ))}
  </ul>
);

export default ModalReceipt;
