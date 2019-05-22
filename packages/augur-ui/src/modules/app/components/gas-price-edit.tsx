import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import {
  MODAL_GAS_PRICE,
  GAS_SPEED_LABELS
} from "modules/common-elements/constants";

import Styles from "modules/app/components/gas-price-edit.styles";

const { STANDARD } = GAS_SPEED_LABELS;

interface GasPriceEditProps {
  userDefinedGasPrice: number;
  gasPriceSpeed: string;
  updateModal: Function;
  className?: string;
}
  
const GasPriceEdit = ({
  userDefinedGasPrice,
  gasPriceSpeed,
  updateModal,
  className
}: GasPriceEditProps) => (
  <div className={classNames(Styles.GasPriceEdit, className)}>
    <button
      onClick={(e: any) => updateModal({
        type: MODAL_GAS_PRICE
      })}
      tabIndex={-1}
    >
      <h3>
        Gas Price <span>(GWEI)</span>
      </h3>
      <div>
        <span>
          {userDefinedGasPrice}
        </span>
        <span
          className={classNames(Styles.description, {
            [Styles.nonStandard]:
              gasPriceSpeed !== STANDARD
          })}
        >
          ({gasPriceSpeed})
        </span>
        <span>Edit</span>
      </div>
    </button>
  </div>
);

GasPriceEdit.propTypes = {
  updateModal: PropTypes.func.isRequired,
  userDefinedGasPrice: PropTypes.number.isRequired,
  gasPriceSpeed: PropTypes.string.isRequired,
  className: PropTypes.string
};

GasPriceEdit.defaultProps = {
  className: undefined
};

export default GasPriceEdit;
