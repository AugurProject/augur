import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import {
  ChevronFlipIcon,
  ChevronFlipFilledIcon
} from "src/modules/common/components/icons";
import Styles from "modules/common/components/chevron-flip/chevron-flip.styles";

const ChevronFlip = p => (
  <span>
    {p.filledInIcon
      ? ChevronFlipFilledIcon(
          classNames(Styles.ChevronFlip, p.className, {
            [Styles.pointDown]: p.pointDown,
            [Styles.big]: p.big,
            [Styles.quick]: p.quick
          }),
          p.stroke
        )
      : ChevronFlipIcon(
          classNames(Styles.ChevronFlip, p.className, {
            [Styles.pointDown]: p.pointDown,
            [Styles.big]: p.big,
            [Styles.quick]: p.quick
          }),
          p.stroke
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

export default ChevronFlip;
