import React from 'react';
import Styles from 'modules/common/labels.styles.less';
import classNames from 'classnames';

interface ValueLabelProps {
  large?: boolean;
  label?: string;
  sublabel?: string;
  value: string|number;
}

export const ValueLabel = ({
  large,
  label,
  sublabel,
  value,
}: ValueLabelProps) => {
  return (
    <div
      className={classNames(Styles.ValueLabel, {
        [Styles.large]: large,
      })}
    >
      <span>
        {label}
        {sublabel && <span>{sublabel}</span>}
      </span>
      <span>{value}</span>
    </div>
  );
};


interface IconLabelProps {
  icon: Object;
  value: string|number;
}

export const IconLabel = ({
  icon,
  value,
}: IconLabelProps) => {
  return (
    <div
      className={classNames(Styles.IconLabel)}
    >
      <span>
        {icon}
      </span>
      <span>{value}</span>
    </div>
  );
};