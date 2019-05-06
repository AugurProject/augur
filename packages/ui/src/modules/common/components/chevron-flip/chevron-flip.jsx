import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import {
  ChevronFlipIcon,
  ChevronFlipFilledIcon
} from "src/modules/common/components/icons";
import Styles from "modules/common/components/chevron-flip/chevron-flip.styles";

const ChevronFlip = ({
  filledInIcon,
  className,
  pointDown,
  big,
  quick,
  stroke,
  hover,
  containerClassName
}) => (
  <span className={containerClassName}>
    {filledInIcon
      ? ChevronFlipFilledIcon(
          classNames(Styles.ChevronFlip, className, {
            [Styles.pointDown]: pointDown,
            [Styles.big]: big,
            [Styles.quick]: quick,
            [Styles.hover]: hover
          }),
          stroke
        )
      : ChevronFlipIcon(
          classNames(Styles.ChevronFlip, className, {
            [Styles.pointDown]: pointDown,
            [Styles.big]: big,
            [Styles.quick]: quick,
            [Styles.hover]: hover
          }),
          stroke
        )}
  </span>
);

ChevronFlip.propTypes = {
  className: PropTypes.string,
  pointDown: PropTypes.bool,
  stroke: PropTypes.string,
  big: PropTypes.bool,
  filledInIcon: PropTypes.bool,
  quick: PropTypes.bool,
  hover: PropTypes.bool,
  containerClassName: PropTypes.string
};

ChevronFlip.defaultProps = {
  className: undefined,
  pointDown: false,
  stroke: undefined,
  big: undefined,
  filledInIcon: undefined,
  quick: false,
  hover: false,
  containerClassName: undefined
};

export default ChevronFlip;
