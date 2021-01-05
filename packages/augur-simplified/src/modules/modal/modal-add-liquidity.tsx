import React, { useState } from 'react';

import Styles from 'modules/modal/modal.styles.less';
import { Header } from './common';
import { YES_NO, BUY } from '../constants';
import {
  OutcomesGrid,
  fakeYesNoOutcomes,
  AmountInput,
  InfoNumbers,
} from '../market/trading-form';
import { BuySellButton, SecondaryButton } from '../common/buttons';
import { ErrorBlock } from '../common/labels';

const ModalAddLiquidity = ({market}) => {
  const [selectedOutcome, setSelectedOutcome] = useState(fakeYesNoOutcomes[0]);
  const createLiquidity = !market.amm;
  return (
    <section className={Styles.ModalAddLiquidity}>
      <Header title={"Add liquidity"} />
      <AmountInput />
      {createLiquidity && <ErrorBlock text='Initial liquidity providers are required to set the odds before creating market liquidity.'/>}
      <span className={Styles.SmallLabel}>{createLiquidity ? 'Set the odds' : 'Current Odds'}</span>
      <OutcomesGrid
        outcomes={fakeYesNoOutcomes}
        selectedOutcome={selectedOutcome}
        setSelectedOutcome={setSelectedOutcome}
        marketType={YES_NO}
        orderType={BUY}
      />
      <span className={Styles.SmallLabel}>You'll receive</span>
      <InfoNumbers
        infoNumbers={[
          {
            label: 'yes shares',
            value: '0',
          },
          {
            label: 'no shares',
            value: '0',
          },
          {
            label: 'liquidity shares',
            value: '0',
          },
        ]}
      />
      <BuySellButton text='approve USDC' />
      <SecondaryButton text='Add' />
      <div className={Styles.FooterText}>
        By adding liquidity you'll earn 1.0% of all trades on this this market proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
      </div>
    </section>
  );
};

export default ModalAddLiquidity;
