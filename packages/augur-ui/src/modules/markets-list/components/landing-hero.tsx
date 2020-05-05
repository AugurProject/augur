import React from 'react';

import Styles from 'modules/markets-list/components/landing-hero.styles.less';
import { PrimaryButton, ExternalLinkButton } from 'modules/common/buttons';
import { MODAL_SIGNUP } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

export const LandingHero = () => {
  const { actions: { setModal }} = useAppStatusStore();
  return (
    <section className={Styles.LandingHero}>
      <img src="images/BGImages.png" />
      <div>
        <h1>The world’s most accessible, no-limit betting platform</h1>
        <span>
          Bet how much you want, from anywhere in the world, on sports,
          politics, finance and more.
        </span>
        <div>
          <PrimaryButton
            text="Sign up to start trading"
            action={() => setModal({ type: MODAL_SIGNUP })}
          />
          <ExternalLinkButton
            light
            URL={'http://www.augur.net'}
            label={'Learn more on augur.net'}
          />
        </div>
      </div>
      <div>
        <img src="images/Hero_cards.png" />
      </div>
    </section>
  );
};
