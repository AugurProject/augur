import React, { useState } from 'react';

import { Title } from 'modules/modal/common';
import { Checkbox } from 'modules/common/form';
import { PrimaryButton, ExternalLinkButton } from 'modules/common/buttons';
import { MarketTypeLabel } from 'modules/common/labels';
import { HELP_CENTER_SCALAR_MARKETS, SCALAR } from 'modules/common/constants';
import Styles from 'modules/modal/modal.styles';

interface ScalarProps {
  closeAction: Function;
  cb?: Function;
}

// Used n Betting UI
export const Scalar = ({ closeAction, cb = () => {} }: ScalarProps) => {
  const [checked, setChecked] = useState(false);
  const handleclose = e => {
    e && e.preventDefault();
    closeAction(checked);
    cb();
  };
  return (
    <div className={Styles.Scalar}>
      <Title
        title={'A note on Scalar Markets'}
        closeAction={handleclose}
      />
      <main>
        <MarketTypeLabel marketType={SCALAR} />
        <h4>
          A Scalar market is one where outcomes vary within a range. They differ
          from other Augur markets for a few reasons.
        </h4>
        <ul>
          <li>
            Unlike Yes/No or Multiple Choice markets, Scalars are not winner
            takes all.
          </li>
          <li>
            Yes/No or Multiple Choice markets will always have a 0-1 range,
            meaning the winning outcome will settle at 1 and all losing outcomes
            will settle at 0.
          </li>
          <li>
            An example Scalar market could be, "What will price of Apple Stock
            be at the end of 2019?" with a range between $200 and $300. Imagine
            the current price is trading around $260. If you believe the price
            will go up, you may buy 1 share at $260, to go "Long". If Apple
            settles anywhere above your purchase price of $260 you will win the
            difference between the settlement price and your purchase price. If
            Apple closes the year at $290. you will win $30/share purchased.
          </li>
          <li>
            The same is true If you believe the price will go down. If you think
            Apple stock is overvalued at $260 you can sell "Short". If it
            settles below your Sale price you win the difference.{' '}
            <ExternalLinkButton
              label="Learn More"
              URL={HELP_CENTER_SCALAR_MARKETS}
            />
          </li>
        </ul>
      </main>
      <div>
        <label
          htmlFor="checkbox-dismiss"
          onClick={e => {
            e.preventDefault();
            setChecked(!checked);
          }}
        >
          <Checkbox
            id="checkbox-dismiss"
            value={checked}
            isChecked={checked}
            onClick={e => {
              e.preventDefault();
              setChecked(!checked);
            }}
          />
          Don't show this again
        </label>
        <PrimaryButton
          text="Ok"
          action={handleclose}
        />
      </div>
    </div>
  );
};
