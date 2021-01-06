import React, {ReactNode} from 'react';
import Styles from 'modules/common/buttons.styles.less';
import classNames from 'classnames';
import { Arrow } from './icons';

interface ButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
  action?: Function;
  icon?: ReactNode;
  selected?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const Button = ({
  text,
  className,
  disabled,
  action,
  icon,
  selected,
  href,
  target = '_blank',
  rel = 'noopener noreferrer'
}: ButtonProps) => {
  return href ? (
    <a
      href={href}
      className={classNames(Styles.Button, {
        [Styles.TextAndIcon]: text && icon,
        [Styles.Disabled]: disabled,
        [Styles.Selected]: selected,
      }, className)}
      onClick={(e) => action && action(e)}
      target={target}
      rel={rel}
    >
      {text}
      {icon && icon}
    </a>
  ) : (
    <button
      className={classNames(Styles.Button, {
        [Styles.TextAndIcon]: text && icon,
        [Styles.Disabled]: disabled,
        [Styles.Selected]: selected,
      }, className)}
      onClick={(e) => action && action(e)}
    >
      {text}
      {icon && icon}
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => <Button {...props} className={classNames(Styles.PrimaryButton, props.className)} />;
export const SecondaryButton = (props: ButtonProps) => <Button {...props} className={classNames(Styles.SecondaryButton, props.className)} />;
export const TinyButton = (props: ButtonProps) => <Button {...props} className={classNames(Styles.TinyButton, props.className)} />;

export interface DirectionButtonProps {
  action: Function;
  disabled?: boolean;
  title?: string;
  left?: boolean;
}

export const DirectionButton = ({
  action,
  disabled,
  title,
  left,
}: DirectionButtonProps) => (
  <button
    onClick={(e) => action(e)}
    className={classNames(Styles.DirectionButton, {
      [Styles.Left]: left,
    })}
    disabled={disabled}
    title={title}
  >
    {Arrow}
  </button>
);
