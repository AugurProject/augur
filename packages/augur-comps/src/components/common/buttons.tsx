import React, { ReactNode, useEffect, useState } from 'react';
import Styles from './buttons.styles.less';
import classNames from 'classnames';
import { Arrow, SearchIcon, ViewIcon } from './icons';
import { Spinner } from './spinner';
import { ApprovalAction, ApprovalState, ETH } from '../../utils/constants';
import { AmmExchange, Cash } from '../../utils/types';
import { PARA_CONFIG } from '../../stores/constants';
import { useUserStore } from '../../stores/user';
import * as ApprovalHooks from '../../stores/use-approval-callback';
const {
  approveERC20Contract,
  approveERC1155Contract,
  checkAllowance,
  isERC1155ContractApproved,
} = ApprovalHooks;

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
  pending
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

export const {
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  ENTER_POSITION,
  EXIT_POSITION,
  TRANSFER_LIQUIDITY,
} = ApprovalAction;

export const {
  UNKNOWN,
  PENDING,
  APPROVED,
} = ApprovalState;

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
  const [isApproved, setIsApproved] = useState(UNKNOWN);
  const {
    loginAccount,
    transactions,
    actions: { addTransaction, updateTransaction }
  } = useUserStore();

  const marketCashType = cash?.name;
  const tokenAddress = cash?.address;
  const approvingName = cash?.name;
  const marketDescription = amm?.market?.description;
  const { shareToken } = cash;
  const { addresses } = PARA_CONFIG;
  const { AMMFactory, WethWrapperForAMMExchange } = addresses;
  const isETH = cash?.name === ETH;

  const approve = async () => {
    try {
      setIsPendingTx(true);
      switch (actionType) {
        case EXIT_POSITION: {
          let tx = null;
          if (isETH) {
            tx = await approveERC1155Contract(
              shareToken,
              `To Sell (${approvingName})`,
              WethWrapperForAMMExchange,
              loginAccount
            );
          } else {
            tx = await approveERC1155Contract(
              shareToken,
              `To Sell (${approvingName})`,
              AMMFactory,
              loginAccount
            );
          }
          tx.marketDescription = marketDescription;
          addTransaction(tx);
          break;
        }
        case ENTER_POSITION: {
          const tx = await approveERC20Contract(
            cash?.address,
            `To Buy (${approvingName})`,
            AMMFactory,
            loginAccount
          );
          tx.marketDescription = marketDescription;
          addTransaction(tx);
          break;
        }
        case REMOVE_LIQUIDITY: {
          const tx = await approveERC20Contract(
            amm?.invalidPool?.id,
            `Liquidity (${approvingName})`,
            AMMFactory,
            loginAccount
          );
          tx.marketDescription = marketDescription;
          addTransaction(tx);
          break;
        }
        case TRANSFER_LIQUIDITY: {
          const tx = await approveERC20Contract(
            amm?.id,
            `Transfer Liquidity`,
            AMMFactory,
            loginAccount
          );
          tx.marketDescription = marketDescription;
          addTransaction(tx);
          break;
        }
        case ADD_LIQUIDITY:
        default: {
          // add liquidity
          const tx = await approveERC20Contract(
            cash?.address,
            `Liquidity (${approvingName})`,
            AMMFactory,
            loginAccount
          );
          tx.marketDescription = marketDescription;
          addTransaction(tx);
          break;
        }
      }
    } catch (error) {
      setIsPendingTx(false);
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const checkIfApproved = async () => {
      let approvalCheck = UNKNOWN;
      if (isETH) {
        switch (actionType) {
          case EXIT_POSITION: {
            approvalCheck = await isERC1155ContractApproved(
              shareToken,
              WethWrapperForAMMExchange,
              loginAccount,
              transactions
            );
            break;
          }
          case REMOVE_LIQUIDITY: {
            approvalCheck = await checkAllowance(
              amm?.invalidPool?.id,
              AMMFactory,
              loginAccount,
              transactions
            );
            break;
          }
          case TRANSFER_LIQUIDITY: {
            approvalCheck = await checkAllowance(
              amm?.id,
              AMMFactory,
              loginAccount,
              transactions
            );
            break;
          }
          case ENTER_POSITION:
          case ADD_LIQUIDITY: {
            approvalCheck = APPROVED;
            break;
          }
          default: {
            break;
          }
        }
        approvalCheck !== UNKNOWN && isMounted && setIsApproved(approvalCheck);
      } else {
        switch (actionType) {
          case EXIT_POSITION: {
            approvalCheck = await isERC1155ContractApproved(
              shareToken,
              AMMFactory,
              loginAccount,
              transactions
            );
            break;
          }
          case REMOVE_LIQUIDITY: {
            approvalCheck = await checkAllowance(
              amm?.invalidPool?.id,
              AMMFactory,
              loginAccount,
              transactions
            );
            break;
          }
          case TRANSFER_LIQUIDITY: {
            approvalCheck = await checkAllowance(
              amm?.id,
              AMMFactory,
              loginAccount,
              transactions
            );
            break;
          }
          case ENTER_POSITION:
          case ADD_LIQUIDITY: {
            approvalCheck = await checkAllowance(
              cash?.address,
              AMMFactory,
              loginAccount,
              transactions
            );
            break;
          }
          default: {
            break;
          }
        }
        approvalCheck !== UNKNOWN && isMounted && setIsApproved(approvalCheck);
      }
      if (approvalCheck === PENDING) {
        isMounted && setIsPendingTx(true);
      } else if (approvalCheck === APPROVED) {
        isMounted && setIsPendingTx(false);
      }
    };

    if (isApproved !== APPROVED && loginAccount?.account) {
      checkIfApproved();
    }
    return () => {
      isMounted = false;
    }
  }, [loginAccount, isApproved, actionType, amm, PARA_CONFIG, tokenAddress, transactions, AMMFactory, WethWrapperForAMMExchange, cash?.address, isETH, marketCashType, shareToken, updateTransaction]);


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
