import React from 'react';
import Styles from './labels.styles.less';
import classNames from 'classnames';
import { CATEGORIES_ICON_MAP } from './category-icons-map';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from './tooltip.styles.less';
import {
  HelpIcon,
  AugurBlankIcon,
  EthIcon,
  UsdIcon,
  WarningIcon,
  XIcon,
  InvalidFlagIcon,
} from './icons';
import {
  MARKET_STATUS
} from '../../utils/constants';
import { FormattedNumber } from '../../utils/types';

export interface ValueLabelProps {
  large?: boolean;
  label?: string;
  sublabel?: string;
  value: string | number;
  light?: boolean;
  small?: boolean;
}

export const ValueLabel = ({
  large,
  label,
  sublabel,
  value,
  light,
  small
}: ValueLabelProps) => {
  return (
    <div
      className={classNames(Styles.ValueLabel, {
        [Styles.large]: large,
        [Styles.Sublabel]: sublabel,
        [Styles.light]: light,
        [Styles.small]: small
      })}
    >
      <span>{label}</span>
      {sublabel && <span>{sublabel}</span>}
      <span>{value}</span>
    </div>
  );
};

export interface IconLabelProps {
  icon: Object;
  value: string | number;
  label: string;
  small?: boolean;
}

export const IconLabel = ({ icon, value, label, small }: IconLabelProps) => {
  return (
    <div className={classNames(Styles.IconLabel, {[Styles.small]: small})}>
      <span>{label}</span>
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
};

interface CategoriesProps {
  categories: Array<string>;
  big?: boolean;
}

export const CategoryLabel = ({ categories, big = false }: CategoriesProps) => (
  <div data-big={big} className={Styles.CategoryLabel}>
    {!!categories[1] ? categories[1] : categories[0]}
  </div>
);

export const CategoryIcon = ({ categories, big = false }: CategoriesProps) => {
  const prime = CATEGORIES_ICON_MAP[categories[0].toLowerCase()];
  const secondary = prime?.subOptions[categories[1].toLowerCase()];
  const icon = secondary?.icon ? secondary.icon : prime?.icon;
  return (
    <div
      data-big={big}
      className={classNames(
        Styles.CategoryIcon,
        Styles[`${categories[0].toLowerCase()}`]
      )}
    >
      {!!icon ? icon : AugurBlankIcon}
    </div>
  );
};

const AMM_MAP = {
  ETH: {
    icon: EthIcon,
    label: 'ETH Market',
  },
  USDC: {
    icon: UsdIcon,
    label: 'USDC Market',
  },
};

const getInfo = (name) =>
  AMM_MAP[name] ? AMM_MAP[name] : { label: 'Add Liquidity', icon: null };

export const CurrencyTipIcon = ({ name, marketId }) => {
  const { label, icon } = getInfo(name);
  return (
    <span
      className={classNames(Styles.CurrencyTipIcon, TooltipStyles.Container)}
    >
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for={`currencyTipIcon-${marketId}-${name}`}
        data-iscapture={true}
      >
        {icon}
      </label>
      <ReactTooltip
        id={`currencyTipIcon-${marketId}-${name}`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <p>{label}</p>
      </ReactTooltip>
    </span>
  );
};

export const CurrencyLabel = ({ name }) => {
  let content = <>Add Liquidity</>;
  const { label, icon } = getInfo(name);
  if (icon) {
    content = (
      <>
        <span>{label}</span> {icon}
      </>
    );
  }
  return <span className={Styles.CurrencyLabel}>{content}</span>;
};

export const ReportingStateLabel = ({ reportingState, big = false }) => {
  let content;
  switch (reportingState) {
    case MARKET_STATUS.FINALIZED:
    case MARKET_STATUS.SETTLED: {
      content = (
        <div data-big={big} className={Styles.Resolved}>
          Resolved
        </div>
      );
      break;
    }
    case MARKET_STATUS.REPORTING:
    case MARKET_STATUS.DISPUTING: {
      content = (
        <div data-big={big} className={Styles.InSettlement}>
          In Settlement
        </div>
      );
      break;
    }
    default:
      break;
  }
  return <>{content}</>;
};

export const InvalidFlagTipIcon = ({ market, big = false }) => {
  let content;
  if (market.isInvalid) content = (
    <span
      data-big={big}
      className={classNames(Styles.InvalidFlagTipIcon, TooltipStyles.Container)}
    >
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for={`invalidFlag-${market.marketId}`}
        data-iscapture={true}
      >
        {InvalidFlagIcon}
      </label>
      <ReactTooltip
        id={`invalidFlag-${market.marketId}`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <p>High probabilty of resolving Invalid</p>
      </ReactTooltip>
    </span>
  );
  return (<>{content}</>);
};

export const ErrorBlock = ({ text }) => {
  return <div className={Styles.ErrorBlock}>{text}</div>;
};

export const generateTooltip = (tipText: string, key: string) => {
  return (
    <span className={TooltipStyles.Container}>
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for={key}
        data-iscapture={true}
      >
        {HelpIcon}
      </label>
      <ReactTooltip
        id={key}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <p>{tipText}</p>
      </ReactTooltip>
    </span>
  );
};

export interface WarningBannerProps {
  title: string;
  subtitle: string;
  className: string;
  onClose: Function;
}

export const WarningBanner = ({
  title,
  subtitle,
  className,
  onClose,
}: WarningBannerProps) => {
  return (
    <section className={classNames(Styles.WarningBanner, className)}>
      {WarningIcon}
      <div>
        <span>{title}</span>
        <span>{subtitle}</span>
      </div>
      <div onClick={() => onClose()}>{XIcon}</div>
    </section>
  );
};

export interface MovementLabelProps {
  value: FormattedNumber;
  numberValue: number;
}

export const MovementLabel = ({ value, numberValue }: MovementLabelProps) => {
  const getTextColorStyles: Function = (val: number): string =>
    classNames({
      [Styles.MovementLabel_Text_positive]: val > 0,
      [Styles.MovementLabel_Text_negative]: val < 0,
    });
  const textColorStyle = getTextColorStyles(numberValue);

  const handlePlusMinus: Function = (label: string): string => {
    if (numberValue >= 0.01) {
      return '+'.concat(label);
    }
    return label;
  };
  const formattedString = handlePlusMinus(value.full);

  return <div className={`${textColorStyle}`}>{formattedString}</div>;
};
