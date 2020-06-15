import React, { useState, useEffect } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import { TextInput } from 'modules/common/form';
import Styles from 'modules/modal/common.styles.less';
import { formatRep, formatGasCostToEther } from 'utils/format-number';
import {
  BUY_PARTICIPATION_TOKENS_GAS_LIMIT,
  REP,
  GWEI_CONVERSION,
  GSN_WALLET_SEEN,
  MODAL_INITIALIZE_ACCOUNT,
} from 'modules/common/constants';
import {
  Title,
  DescriptionMessage,
  AlertMessageProps,
  Breakdown,
} from '../common';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { InitializeWalletModalNotice } from 'modules/common/labels';
import getValueFromlocalStorage from 'utils/get-local-storage-value';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import { getTransactionLabel } from 'modules/auth/helpers/get-gas-price';
import { purchaseParticipationTokens } from 'modules/reporting/actions/participation-tokens-management';

export const ModalParticipate = () => {
  const gsnWalletInfoSeen =
    getValueFromlocalStorage(GSN_WALLET_SEEN) === 'true' ? true : false;
  const {
    loginAccount: {
      balances: { rep },
    },
    modal,
    gsnEnabled: GsnEnabled,
    gasPriceInfo,
    actions: { closeModal, setModal }
  } = useAppStatusStore();

  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  const messages = [
    {
      key: 'quant',
      preText: 'Quantity (1 token @ 1 REP)',
    },
  ];
  const title = 'Buy Participation Tokens';
  const gsnUnavailable = isGSNUnavailable();
  const transactionLabel = getTransactionLabel();

  const initializeGsnWallet = (customAction = null) =>
    setModal({
      customAction,
      type: MODAL_INITIALIZE_ACCOUNT,
    });
  const [isValid, setIsValid] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [gasLimit, setGasLimit] = useState(BUY_PARTICIPATION_TOKENS_GAS_LIMIT);
  const [errors, setErrors] = useState([]);

  const formattedQuantity = formatRep(quantity || 0);

  const gasEstimateInEth = formatGasCostToEther(
    gasLimit,
    { decimalsRounded: 4 },
    createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
  );

  useEffect(() => {
    purchaseParticipationTokens(1, true, (err, gasLimit) => {
      if (!err && gasLimit) {
        setGasLimit(gasLimit);
      }
    });
  }, []);

  const submitForm = () => {
    if (gsnUnavailable && !gsnWalletInfoSeen) {
      initializeGsnWallet(() => {
        purchaseParticipationTokens(quantity, false, err => {
          if (err) console.log('ERR for purchaseParticipationTokens', err);
          closeModal();
        });
      });
    } else {
      purchaseParticipationTokens(quantity, false, err => {
        if (err) console.log('ERR for purchaseParticipationTokens', err);
        closeModal();
      });
    }
  };

  const validateForm = quantity => {
    const bnRep = createBigNumber(rep, 10);
    const errors: string[] = [];
    let isValid = true;

    if (quantity === '') {
      isValid = false;
      // exit early, as the other check doesn't matter.
      return { errors, isValid };
    }
    const bnQuantity = createBigNumber(quantity, 10);

    if (bnQuantity.lte(0)) {
      errors.push('Quantity must greater than 0.');
      isValid = false;
      // exit early, as the other check doesn't matter.
      return { errors, isValid };
    }

    if (bnQuantity.gt(bnRep)) {
      errors.push(`Value is bigger than REP balance: ${rep} REP`);
      isValid = false;
    }

    if (isNaN(quantity)) {
      errors.push('Value not a number');
      isValid = false;
    }

    return { errors, isValid };
  };

  const updateQuantity = quantity => {
    const { errors, isValid } = validateForm(quantity);
    setQuantity(quantity);
    setIsValid(isValid);
    setErrors(errors);
  };

  const items = [
    {
      label: 'quantity',
      value: formattedQuantity,
      denomination: '',
    },
    {
      label: 'price',
      value: formattedQuantity,
      denomination: 'REP',
      showDenomination: true,
    },
    {
      label: transactionLabel,
      value: GsnEnabled ? displayGasInDai(gasLimit) : gasEstimateInEth,
      denomination: GsnEnabled ? 'DAI' : 'ETH',
      showDenomination: true,
    },
  ];

  return (
    <section className={Styles.ModalContainer}>
      <Title title={title} closeAction={() => closeModal()} />
      <div className={Styles.ModalParticipation}>
        <DescriptionMessage messages={messages} />
        <TextInput
          placeholder={'0.0000'}
          value={quantity}
          onChange={value => updateQuantity(value)}
          errorMessage={errors[0]}
          innerLabel={REP}
        />
        <Breakdown rows={items} />
        <InitializeWalletModalNotice />
      </div>
      <div className={Styles.ActionButtons}>
        <button className={Styles.Secondary} onClick={() => closeModal()}>
          cancel
        </button>
        <button
          className={Styles.Primary}
          disabled={!isValid}
          onClick={() => submitForm()}
        >
          buy
        </button>
      </div>
    </section>
  );
};
