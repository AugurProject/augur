import React from 'react';

import Styles from 'modules/markets-list/components/landing-hero.styles.less';
import { PrimaryButton, ExternalLinkButton } from 'modules/common/buttons';

export interface LandingHeroProps {
  showSignup: Function;
}

export const LandingHero = ({showSignup}: LandingHeroProps) => {
  return (
    <section className={Styles.LandingHero}>
      <div>
        <h1>The world’s most accessible, no-limit betting platform</h1>
        <span>
          Bet how much you want, from anywhere in the world, on sports,
          politics, finance and more.
        </span>
        <div>
          <PrimaryButton
            text="Sign up to start trading"
            action={showSignup}
          />
          <ExternalLinkButton
            light
            URL={'http://www.augur.net'}
            label={'Learn more on augur.net'}
          />
        </div>
      </div>
      <div>
        <img src="images/hero-primary.png" />
        <img src="images/hero-secondary.png" />
        <img src="images/hero-bitcoin.png" />
      </div>
    </section>
  );
};
