import React from "react";
import classNames from "classnames";

import Styles from "modules/common/chevron-flip.styles";

const ChevronFlipIcon = (className = "", fillColor = "#A7A2B2") => (
  <svg className={className} viewBox="0 0 16 16">
    <g
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
        <polyline
          transform="translate(8.156854, 11.156854) scale(1, -1) rotate(-225.000000) translate(-8.156854, -11.156854) "
          points="3.65685425 6.65685425 12.6568542 6.65685425 12.6568542 15.6568542"
        />
      </g>
    </g>
  </svg>
);

const ChevronFlipFilledIcon = (className = "", fillColor = "#FFF") => (
  <svg
    className={className}
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
  >
    <path
      d="M9 1L5 5L1 1"
      stroke={fillColor}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ChevronFlipProps {
  className?: string;
  pointDown?: boolean;
  stroke?: string;
  big?: boolean;
  filledInIcon?: boolean;
  quick?: boolean;
  instant?: boolean;
  hover?: boolean;
  containerClassName?: string;
}

const ChevronFlip: React.FC<ChevronFlipProps> = ({
  filledInIcon,
  className,
  pointDown,
  big,
  quick,
  instant,
  stroke,
  hover,
  containerClassName,
}) => (
    <span className={containerClassName}>
      {filledInIcon
        ? ChevronFlipFilledIcon(
          classNames(Styles.ChevronFlip, className, {
            [Styles.pointDown]: pointDown,
            [Styles.big]: big,
            [Styles.quick]: quick,
            [Styles.instant]: instant,
            [Styles.hover]: hover
          }),
          stroke
        )
        : ChevronFlipIcon(
          classNames(Styles.ChevronFlip, className, {
            [Styles.pointDown]: pointDown,
            [Styles.big]: big,
            [Styles.quick]: quick,
            [Styles.instant]: instant,
            [Styles.hover]: hover
          }),
          stroke
        )}
    </span>
  );

ChevronFlip.defaultProps = {
  className: undefined,
  pointDown: false,
  stroke: undefined,
  big: undefined,
  filledInIcon: undefined,
  quick: false,
  instant: false,
  hover: false,
  containerClassName: undefined
};

export default ChevronFlip;
