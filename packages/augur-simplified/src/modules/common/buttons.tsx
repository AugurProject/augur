import React, { ReactNode, useEffect, useState } from 'react';
import Styles from 'modules/common/buttons.styles.less';
import classNames from 'classnames';
import { Arrow } from './icons';
import { approveERC20Contract, approveERC1155Contract, checkAllowance, isERC1155ContractApproved} from '../hooks/use-approval-callback';
import { useAppStatusStore } from '../stores/app-status';
import { ApprovalAction, ApprovalState, ETH } from '../constants';
import { AmmExchange, Cash } from '../types';

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
  target = '_blank',
  rel = 'noopener noreferrer',
}: ButtonProps) => {
  return href ? (
    <a
      href={href}
      className={classNames(
        Styles.Button,
        {
          [Styles.TextAndIcon]: text && icon,
          [Styles.Disabled]: disabled,
          [Styles.Selected]: selected,
          [Styles.Error]: error && error !== ''
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
      className={classNames(
        Styles.Button,
        {
          [Styles.TextAndIcon]: text && icon,
          [Styles.Disabled]: disabled,
          [Styles.Selected]: selected,
          [Styles.Error]: error && error !== ''
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
    className={classNames(Styles.PrimaryButton, props.className)}
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

export const ApprovalButton = ({ amm, cash, actionType }: { amm?: AmmExchange, cash: Cash, actionType: ApprovalAction}) => {
  const [isPendingTx, setIsPendingTx] = useState(false);
  const [isApproved, setIsApproved] = useState(ApprovalState.UNKNOWN);

  const {
    loginAccount,
    approvals,
    paraConfig,
    transactions,
    actions: { addTransaction, setApprovals, updateTransaction }
  } = useAppStatusStore();

  const marketCashType = cash?.name;
  const tokenAddress = cash?.address
  const approvingName = cash?.name;
  const marketDescription =  amm?.market?.description;
  const { shareToken } = cash;
  const { addresses } = paraConfig;
  const { AMMFactory, WethWrapperForAMMExchange } = addresses;
  const isETH = cash?.name === ETH;

  const approve = async () => {
    if (actionType === ApprovalAction.ADD_LIQUIDITY) {
      try {
        setIsPendingTx(true);
        const tx = await approveERC20Contract(cash?.address, `Liquidity (${approvingName})`, AMMFactory, loginAccount);
        tx.marketDescription = marketDescription;
        addTransaction(tx);
      } catch (error) {
        setIsPendingTx(false);
        console.error(error);
      }
    } else if (actionType === ApprovalAction.REMOVE_LIQUIDITY) {
      try {
        setIsPendingTx(true);
        const tx = await approveERC20Contract(amm.id, `Liquidity (${approvingName})`, WethWrapperForAMMExchange, loginAccount);
        tx.marketDescription = marketDescription;
        addTransaction(tx);
      } catch (error) {
        setIsPendingTx(false);
        console.error(error);
      }
    } else if (actionType === ApprovalAction.ENTER_POSITION) {
      try {
        setIsPendingTx(true);
        const tx = await approveERC1155Contract(shareToken, `To Buy (${approvingName})`, AMMFactory, loginAccount);
        tx.marketDescription = marketDescription;
        addTransaction(tx);
      } catch (error) {
        setIsPendingTx(false);
        console.error(error);
      }
    } else if (actionType === ApprovalAction.EXIT_POSITION) {
      try {
        setIsPendingTx(true);
        let tx = null;
        if (isETH) {
          tx = await approveERC1155Contract(shareToken, `To Sell (${approvingName})`, WethWrapperForAMMExchange, loginAccount);
        } else {
          tx = await approveERC1155Contract(shareToken, `To Sell (${approvingName})`, AMMFactory, loginAccount);
        }
        tx.marketDescription = marketDescription;
        addTransaction(tx);
      } catch (error) {
        setIsPendingTx(false);
        console.error(error);
      }
    }
  }

  useEffect(() => {
    const checkIfApproved = async () => {
      let approvalCheck = ApprovalState.UNKNOWN;

      if (actionType === ApprovalAction.ENTER_POSITION) {
        if (isETH) {
          setIsApproved(ApprovalState.APPROVED);
        } else {
          approvalCheck = await isERC1155ContractApproved(shareToken, AMMFactory, loginAccount, transactions, updateTransaction);
          setIsApproved(approvalCheck);
        }
      }

      else if (actionType === ApprovalAction.EXIT_POSITION) {
        if (isETH) {
          approvalCheck = await isERC1155ContractApproved(shareToken, WethWrapperForAMMExchange, loginAccount, transactions, updateTransaction);
        } else {
          approvalCheck = await isERC1155ContractApproved(shareToken, AMMFactory, loginAccount, transactions, updateTransaction);
        }
        setIsApproved(approvalCheck);
      }

      else if (actionType === ApprovalAction.ADD_LIQUIDITY) {
        if (isETH) {
          setIsApproved(ApprovalState.APPROVED);
        } else {
          approvalCheck = await checkAllowance(cash?.address, AMMFactory, loginAccount, transactions, updateTransaction)
          setIsApproved(approvalCheck);
        }
      }

      else if (actionType === ApprovalAction.REMOVE_LIQUIDITY) {
        if (!isETH) {
          setIsApproved(ApprovalState.APPROVED);
        } else {
          approvalCheck = await checkAllowance(amm.id, WethWrapperForAMMExchange, loginAccount, transactions, updateTransaction)
          setIsApproved(approvalCheck);
        }
      }

      if (approvalCheck === ApprovalState.PENDING) {
        setIsPendingTx(true);
      } else if (approvalCheck === ApprovalState.APPROVED) {
        setIsPendingTx(false);
      }
    }

    if (isApproved !== ApprovalState.APPROVED && loginAccount) {
      checkIfApproved();
    } else {
      if (approvals
        && ((actionType === ApprovalAction.ENTER_POSITION && !approvals?.trade?.enter[marketCashType])
        || (actionType === ApprovalAction.EXIT_POSITION && !approvals?.trade?.exit[marketCashType])
        || (actionType === ApprovalAction.ADD_LIQUIDITY && !approvals?.liquidity?.add[marketCashType])
        || (actionType === ApprovalAction.REMOVE_LIQUIDITY && !approvals?.liquidity?.remove[marketCashType])
      )) {
        let newState = approvals;

        if (actionType === ApprovalAction.ENTER_POSITION) {
          newState.trade.enter[marketCashType] = true;
        }
        else if (actionType === ApprovalAction.EXIT_POSITION) {
          newState.trade.exit[marketCashType] = true;
        }
        else if (actionType === ApprovalAction.ADD_LIQUIDITY) {
          newState.liquidity.add[marketCashType] = true;
        }
        else if (actionType === ApprovalAction.REMOVE_LIQUIDITY) {
          newState.liquidity.remove[marketCashType] = true;
        }
        setApprovals(newState);
      }
    }
  }, [setApprovals, loginAccount, isApproved, actionType, amm, paraConfig, tokenAddress, approvals, transactions, AMMFactory, WethWrapperForAMMExchange, cash?.address, isETH, marketCashType, shareToken, updateTransaction]);


  if (!loginAccount) {
    return null;
  }

  if (isApproved === ApprovalState.APPROVED) {
    return null;
  }

  let buttonText = '';

  if (actionType === ApprovalAction.ENTER_POSITION) {
    buttonText = 'Approve to Buy';
  } else if (actionType === ApprovalAction.EXIT_POSITION) {
    buttonText = 'Approve to Sell';
  } else if (actionType === ApprovalAction.ADD_LIQUIDITY || actionType === ApprovalAction.REMOVE_LIQUIDITY) {
    buttonText = `Approve ${marketCashType}`;
  }

  return (
    <ApproveButton
      disabled={isPendingTx}
      text={isPendingTx ? 'Approving...' : buttonText}
      action={() => approve()}
    />
  )
}
