import React from 'react';

import {
  DepositButton,
  TransferButton,
  ViewTransactionsButton,
  REPFaucetButton,
  ParaTokenFaucetButton,
  ExternalLinkButton,
  TransferButton,
  WrapUnwrapEthAddfunds,
} from 'modules/common/buttons';
import {
  THEMES,
  NETWORK_IDS,
  ZERO,
  MODAL_TRANSACTIONS,
  MODAL_ADD_FUNDS,
  MODAL_TRANSFER,
  MODAL_CASHOUT,
  MODAL_REP_FAUCET,
  MODAL_TOKEN_FAUCET,
  ETH,
  WETH,
  DEFAULT_PARA_TOKEN,
} from 'modules/common/constants';
import { AccountAddressDisplay } from 'modules/modal/common';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { toChecksumAddress } from 'ethereumjs-util';
import Styles from 'modules/account/components/transactions.styles.less';
import { getNetworkId, getLegacyRep } from 'modules/contracts/actions/contractCalls';
import { createBigNumber } from 'utils/create-big-number';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import classNames from 'classnames';

export const Transactions = () => {
  const {
    theme,
    loginAccount: { meta, balances },
    paraTokenName,
    actions: { setModal },
  } = useAppStatusStore();
  const showWrapEther = paraTokenName === 'WETH';
  const isTrading = theme === THEMES.TRADING;
  const networkId = getNetworkId();
  const targetAddress = meta.signer?._address;
  const showFaucets = networkId !== NETWORK_IDS.Mainnet;
  const localLabel =
    networkId !== NETWORK_IDS.Kovan
      ? 'Use flash to transfer ETH to address'
      : null;
  const walletNoEth = createBigNumber(balances?.eth || 0).lte(ZERO);

  return (
    <QuadBox
      title={isTrading ? 'Transactions' : 'Your funds'}
      customClass={classNames({
        [Styles.ShowHeaderOnMobile]: !isTrading,
      })}
      headerComplement={
        <div className={Styles.RightContent}>
          <ViewTransactionsButton
            action={() => setModal({ type: MODAL_TRANSACTIONS })}
          />
        </div>
      }
      content={
        <div className={Styles.Content}>
          <div>
            <h4>Your transactions history</h4>
            <ViewTransactionsButton
              action={() => setModal({ type: MODAL_TRANSACTIONS })}
            />
          </div>
          <div>
            <h4>Your funds</h4>
            <DepositButton action={() => setModal({ type: MODAL_ADD_FUNDS })} />
            <TransferButton action={() => setModal({ type: MODAL_TRANSFER })} />
            {showWrapEther && <WrapUnwrapEthAddfunds action={() => setModal({type: MODAL_ADD_FUNDS, toToken: WETH, fromToken: ETH })} />}
          </div>
          {showFaucets && (
            <>
              <div>
                <h4>REPv2 for test net</h4>
                <h4>{paraTokenName} for test net</h4>
                <REPFaucetButton
                  action={() => setModal({ type: MODAL_REP_FAUCET })}
                />
                <ParaTokenFaucetButton
                  title={`${paraTokenName} Faucet`}
                  action={() => setModal({ token: paraTokenName, type: MODAL_TOKEN_FAUCET })}
                />
              </div>
              <div>
                <h4>Legacy REP</h4>
                <REPFaucetButton
                  title="Legacy REP Faucet"
                  action={() => getLegacyRep()}
                />
              </div>
            </>
          )}
          {walletNoEth && (
            <div>
              <ExternalLinkButton
                URL={!localLabel ? 'https://faucet.kovan.network/' : null}
                showNonLink={!!localLabel}
                label={localLabel ? localLabel : 'faucet.kovan.network'}
              />
              <AccountAddressDisplay
                copyable
                address={
                  targetAddress
                    ? toChecksumAddress(targetAddress)
                    : 'loading...'
                }
              />
            </div>
          )}
        </div>
      }
    />
  );
};

export default Transactions;
