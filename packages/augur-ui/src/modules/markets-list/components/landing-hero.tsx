import React from 'react';

import Styles from 'modules/markets-list/components/landing-hero.styles.less';
import { PrimaryButton, ExternalLinkButton } from 'modules/common/buttons';
import { MODAL_SIGNUP } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';

export const LandingHero = () => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  return (
    <section className={Styles.LandingHero}>
      <div>
        <h1>Augur v2<br /><span>Your global, no-limit betting platform</span></h1>
        <span>
          Bet how much you want, on sports, finance, world events and more.
        </span>
        <div>
          <PrimaryButton
            text="Sign up to start trading"
            action={() => setModal({ type: MODAL_SIGNUP })}
          />
          <ExternalLinkButton
            light
            URL="http://www.augur.net"
            label="Learn more on augur.net"
          />
        </div>
      </div>
      <div>
        <img src="images/hero-primary.png" />
        <img src="images/hero-secondary-bitcoin.png" />
        <img src="images/hero-tertiary.png" />
      </div>
    </section>
  );
};
