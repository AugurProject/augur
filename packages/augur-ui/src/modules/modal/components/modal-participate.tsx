import React, { useState, useEffect } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import { TextInput } from 'modules/common/form';
import Styles from 'modules/modal/components/common/common.styles.less';
import { formatRep, formatGasCostToEther } from 'utils/format-number';
import {
  BUY_PARTICIPATION_TOKENS_GAS_LIMIT,
  REP,
  GWEI_CONVERSION,
} from 'modules/common/constants';
import ModalActions from './common/modal-actions';
import {
  Title,
  DescriptionMessage,
  AlertMessageProps,
  Breakdown, ButtonsRow,
} from '../common';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { InitializeWalletModalNotice } from 'modules/common/labels';

interface ModalParticipateProps {
  rep: string;
  gasPrice: number;
  closeModal: (...args: any[]) => any;
  purchaseParticipationTokens: Function;
  messages: AlertMessageProps[];
  title: string;
  GsnEnabled: boolean;
  gsnWalletInfoSeen: boolean;
  gsnUnavailable: boolean;
  initializeGsnWallet: Function;
  transactionLabel: string;
}

export const ModalParticipate = (props: ModalParticipateProps) => {
  const {
    closeModal,
    gasPrice,
    messages,
    title,
    GsnEnabled,
    transactionLabel,
  } = props;

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
    props.purchaseParticipationTokens(1, true, (err, gasLimit) => {
      if (!err && gasLimit) {
        setGasLimit(gasLimit);
      }
    });
  }, []);

  const submitForm = () => {
    const { initializeGsnWallet, gsnUnavailable, gsnWalletInfoSeen, purchaseParticipationTokens } = props;
    if (gsnUnavailable && !gsnWalletInfoSeen) {
      initializeGsnWallet(() => {
        purchaseParticipationTokens(quantity, false, err => {
          if (err) console.log('ERR for purchaseParticipationTokens', err);
          props.closeModal();
        });
      })
    } else {
      purchaseParticipationTokens(quantity, false, err => {
        if (err) console.log('ERR for purchaseParticipationTokens', err);
        props.closeModal();
      });
    }
  };

  const validateForm = quantity => {
    const { rep } = props;
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
      value: GsnEnabled
        ? displayGasInDai(gasLimit)
        : gasEstimateInEth,
      denomination: GsnEnabled ? 'DAI' : 'ETH',
      showDenomination: true,
    },
  ];

  const buttons = [{
    text: 'Buy',
    action: () => submitForm(),
    disabled: !isValid,
  }, {
    text: 'Cancel',
    action: () => closeModal(),
  }];

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
        <ButtonsRow buttons={buttons}/>
      </div>
    </section>
  );
};
