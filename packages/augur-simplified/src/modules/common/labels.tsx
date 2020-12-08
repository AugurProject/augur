import React from 'react';
import Styles from 'modules/common/labels.styles.less';
import classNames from 'classnames';

interface ValueLabelProps {
  large?: boolean;
  icon?: Object;
  label?: string;
  sublabel?: string;
  value: string|number;
}

export const ValueLabel = ({
  large,
  icon,
  label,
  sublabel,
  value,
}: ValueLabelProps) => {
  return (
    <div
      className={classNames(Styles.ValueLabel, {
        [Styles.large]: large,
        [Styles.icon]: icon,
      })}
    >
      <span>
        {label ? label : icon}
        <span>{sublabel}</span>
      </span>
      <span>{value}</span>
    </div>
  );
};
