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
  stroke
}) => (
  <span>
    {filledInIcon
      ? ChevronFlipFilledIcon(
          classNames(Styles.ChevronFlip, className, {
            [Styles.pointDown]: pointDown,
            [Styles.big]: big,
            [Styles.quick]: quick
          }),
          stroke
        )
      : ChevronFlipIcon(
          classNames(Styles.ChevronFlip, className, {
            [Styles.pointDown]: pointDown,
            [Styles.big]: big,
            [Styles.quick]: quick
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
  quick: PropTypes.bool
};

ChevronFlip.defaultProps = {
  className: undefined,
  pointDown: false,
  stroke: undefined,
  big: undefined,
  filledInIcon: undefined,
  quick: false
};

export default ChevronFlip;
