import React from "react";
import PropTypes from "prop-types";

import ModalTableRow from "modules/modal/components/common/modal-table-row";
import Styles from "modules/modal/components/common/common.styles";

const ModalTable = ({ rows }) => (
  <div className={Styles.ModalTable}>
    {rows.map(row => (
      <ModalTableRow key={row.rowNumber} {...row} />
    ))}
  </div>
);

ModalTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      rowAction: PropTypes.func,
      columnLabels: PropTypes.array,
      isHeading: PropTypes.bool,
      rowNumber: PropTypes.number
    })
  )
};

ModalTable.defaultProps = {
  rows: []
};

export default ModalTable;
