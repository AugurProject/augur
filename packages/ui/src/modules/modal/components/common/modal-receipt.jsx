import React from "react";
import PropTypes from "prop-types";

import Styles from "modules/modal/components/common/common.styles";

const ModalReceipt = ({ items }) => (
  <ul className={Styles.Receipt}>
    {items.map(item => (
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

ModalReceipt.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequried,
      value: PropTypes.string.isRequired,
      denomination: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ModalReceipt;
