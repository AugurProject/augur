import React, { ReactNode, useEffect, useState } from 'react';
import Styles from './buttons.styles.less';
import classNames from 'classnames';
import { Arrow, SearchIcon, ViewIcon } from './icons';

interface ButtonProps {
  text?: string;
  subText?: string | null;
  className?: string;
  disabled?: boolean;
  action?: Function;
  icon?: ReactNode;
  selected?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  error?: string;
  title?: string;
  darkTheme?: boolean;
}

const Button = ({
  text,
  subText,
  className,
  disabled,
  action,
  icon,
  selected,
  href,
  error,
  title,
  target = '_blank',
  rel = 'noopener noreferrer',
}: ButtonProps) => {
  useEffect(() => {
    console.log('butto');
  }, [])
  return href ? (
    <a
      title={title}
      href={href}
      className={classNames(
        Styles.Button,
        {
          [Styles.TextAndIcon]: text && icon,
          [Styles.Disabled]: disabled,
          [Styles.Selected]: selected,
          [Styles.Error]: error && error !== '',
        },
        className
      )}
      onClick={(e) => action && action(e)}
      target={target}
      rel={rel}
    >
      {error && error !== '' ? error : text}
      {icon && icon}
      {subText && <span>{subText}</span>}
    </a>
  ) : (
    <button
      title={title}
      className={classNames(
        Styles.Button,
        {
          [Styles.TextAndIcon]: text && icon,
          [Styles.Disabled]: disabled,
          [Styles.Selected]: selected,
          [Styles.Error]: error && error !== '',
        },
        className
      )}
      onClick={(e) => action && action(e)}
    >
      {error && error !== '' ? error : text}
      {icon && icon}
      {subText && <span>{subText}</span>}
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.PrimaryButton, props.className, {[Styles.Dark]: props.darkTheme})}
  />
);
export const SecondaryButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.SecondaryButton, props.className)}
  />
);
export const TinyButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.TinyButton, props.className)}
  />
);
export const BuySellButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.BuySellButton, props.className)}
  />
);
export const ApproveButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.ApproveButton, props.className)}
  />
);
export const WalletButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.WalletButton, props.className)}
  />
);
export const TextButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.TextButton, props.className)}
  />
);

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

export const SearchButton = (props) => (
  <Button
    {...props}
    icon={SearchIcon}
    className={classNames(Styles.SearchButton, props.className)}
  />
);

export interface ExternalLinkButtonProps {
  label: string;
  URL?: string;
}

export const ExternalLinkButton = ({
  label,
  URL,
}: ExternalLinkButtonProps) => (
  <button className={Styles.ExternalLinkButton}>
    {URL && (
      <a href={URL} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )}
    {ViewIcon}
  </button>
);