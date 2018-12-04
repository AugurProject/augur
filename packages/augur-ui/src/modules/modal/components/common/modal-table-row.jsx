import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import noop from "utils/noop";

import Styles from "modules/modal/components/common/common.styles";

const ModalTableRow = ({ rowAction, rowNumber, columnLabels, isHeading }) => (
  <button
    className={classNames(Styles.ModalTableRow, {
      [`${Styles.ModalTableRow__header}`]: isHeading
    })}
    onClick={rowAction}
  >
    {columnLabels.map(columnLabel => (
      <div
        key={`${columnLabel}${rowNumber}`}
        className={Styles.ModalTableColumn}
      >
        {columnLabel}
      </div>
    ))}
  </button>
);

ModalTableRow.propTypes = {
  rowAction: PropTypes.func,
  columnLabels: PropTypes.arrayOf(PropTypes.any).isRequired,
  isHeading: PropTypes.bool,
  rowNumber: PropTypes.number.isRequired
};

ModalTableRow.defaultProps = {
  rowAction: noop,
  isHeading: false
};

export default ModalTableRow;
