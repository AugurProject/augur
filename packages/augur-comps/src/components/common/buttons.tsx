import React, { ReactNode, useEffect, useState } from 'react';
import Styles from './buttons.styles.less';
import classNames from 'classnames';
import { Arrow, SearchIcon, ViewIcon } from './icons';
import { Spinner } from './spinner';
import { ApprovalAction, ApprovalState, ETH } from '../../utils/constants';
import { AmmExchange, Cash } from '../../utils/types';
import { PARA_CONFIG } from '../../stores/constants';
import { useUserStore } from '../../stores/user';
import {
  approveERC20Contract,
  approveERC1155Contract,
  checkAllowance,
  isERC1155ContractApproved,
} from '../../stores/use-approval-callback';
import { useApprovalStatus } from '../../stores/utils';

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
  pending?: boolean;
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
  pending,
}: ButtonProps) => {
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
          [Styles.Disabled]: disabled || pending,
          [Styles.Selected]: selected,
          [Styles.Error]: error && error !== '',
        },
        className
      )}
      onClick={(e) => action && action(e)}
    >
      {pending && <Spinner />}
      {!pending && (error && error !== '' ? error : text)}
      {!pending && icon && icon}
      {!pending && subText && <span>{subText}</span>}
    </button>
  );
};

export const PrimaryButton = (props: ButtonProps) => (
  <Button
    {...props}
    className={classNames(Styles.PrimaryButton, props.className, {
      [Styles.Dark]: props.darkTheme,
    })}
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

export const {
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  ENTER_POSITION,
  EXIT_POSITION,
  TRANSFER_LIQUIDITY,
} = ApprovalAction;

export const { UNKNOWN, PENDING, APPROVED } = ApprovalState;

export const ApprovalButton = ({
  amm,
  cash,
  actionType,
}: {
  amm?: AmmExchange;
  cash: Cash;
  actionType: ApprovalAction;
}) => {
  const [isPendingTx, setIsPendingTx] = useState(false);
  const {
    loginAccount,
    actions: { addTransaction },
  } = useUserStore();
  const isApproved = useApprovalStatus({ amm, cash, actionType });
  const marketCashType = cash?.name;
  const marketDescription = amm?.market?.description;
  const { shareToken } = cash;
  const { addresses } = PARA_CONFIG;
  const { AMMFactory, WethWrapperForAMMExchange } = addresses;
  const isETH = marketCashType === ETH;
  
  const approve = async () => {
    try {
      setIsPendingTx(true);
      // defaults for ADD_LIQUIDITY/most used values.
      let ApprovalAction = approveERC20Contract;
      let address = cash?.address;
      let spender = AMMFactory;
      let text = `Liquidity (${marketCashType})`;
      switch (actionType) {
        case EXIT_POSITION: {
          ApprovalAction = approveERC1155Contract;
          address = shareToken;
          text = `To Sell (${marketCashType})`;
          spender = isETH ? WethWrapperForAMMExchange : AMMFactory;
          break;
        }
        case ENTER_POSITION: {
          text = `To Buy (${marketCashType})`;
          break;
        }
        case REMOVE_LIQUIDITY: {
          address = amm?.invalidPool?.id;
          text = `Liquidity (${marketCashType})`;
          break;
        }
        case TRANSFER_LIQUIDITY: {
          address = amm?.id;
          text = `Transfer Liquidity`;
          break;
        }
        case ADD_LIQUIDITY:
        default: {
          break;
        }
      }
      const tx = await ApprovalAction(address, text, spender, loginAccount);
      tx.marketDescription = marketDescription;
      addTransaction(tx);
    } catch (error) {
      setIsPendingTx(false);
      console.error(error);
    }
  };
  
  if (!loginAccount || isApproved === APPROVED) {
    return null;
  }

  let buttonText = '';
  switch (actionType) {
    case ENTER_POSITION: {
      buttonText = 'Approve to Buy';
      break;
    }
    case EXIT_POSITION: {
      buttonText = 'Approve to Sell';
      break;
    }
    case REMOVE_LIQUIDITY: {
      buttonText = 'Approve Removal';
      break;
    }
    case TRANSFER_LIQUIDITY: {
      buttonText = 'Approve Transfer';
      break;
    }
    default:
      buttonText = `Approve ${marketCashType}`;
      break;
  }

  return (
    <ApproveButton
      disabled={isPendingTx}
      text={isPendingTx ? 'Approving...' : buttonText}
      action={() => approve()}
    />
  );
};

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

export const ExternalLinkButton = ({ label, URL }: ExternalLinkButtonProps) => (
  <button className={Styles.ExternalLinkButton}>
    {URL && (
      <a href={URL} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )}
    {ViewIcon}
  </button>
);
