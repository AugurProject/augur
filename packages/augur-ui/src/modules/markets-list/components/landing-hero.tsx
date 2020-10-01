import React from 'react';

import Styles from 'modules/markets-list/components/landing-hero.styles.less';
import { ExternalLinkButton, PrimaryButton } from 'modules/common/buttons';
import { MODAL_SIGNUP, THEMES } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { Slider } from 'modules/markets-list/components/slider';
import Image2Mobile from '../../../assets/images/banner-2-1011x741.png';
import Image2Tablet from '../../../assets/images/banner-2-1486x494.png';
import Image2Medium from '../../../assets/images/banner-2-1522x456.png';
import Image2Big from '../../../assets/images/banner-2-1920x456.png';
import Image3Mobile from '../../../assets/images/banner-3-1011x741.png';
import Image3Tablet from '../../../assets/images/banner-3-1486x494.png';
import Image3Medium from '../../../assets/images/banner-3-1522x456.png';
import Image3Big from '../../../assets/images/banner-3-1920x456.png';
import SportsbookBanner from 'assets/images/sportsbook-banner.png';
import ImageDesktop from '../../../assets/images/banner-desktop-1920x456.png';
import AmericanFootball from '../../../assets/images/american-football.png';
import noop from 'utils/noop';

const images = [
  {
    alignment: 'center',
    noOverlay: false,
    image: {
      mobile: ImageDesktop,
      tablet: ImageDesktop,
      medium: ImageDesktop,
      big: ImageDesktop,
    },
    text: 'No Limits. Lower Fees.\nBet on anything you want.',
    button: {
      text: 'Sign up to start betting',
      link: 'https://dev.augur.net/',
    },
  },
  {
    alignment: 'right',
    noOverlay: false,
    image: {
      mobile: AmericanFootball,
      tablet: AmericanFootball,
      medium: AmericanFootball,
      big: AmericanFootball,
    },
    text: '+1000\nMarkets',
    button: {
      text: 'Explore Betting Exchange',
      link: 'https://dev.augur.net/',
      secondary: true,
    },
  },
  {
    alignment: 'center',
    noOverlay: true,
    image: {
      mobile: Image3Mobile,
      tablet: Image3Tablet,
      medium: Image3Medium,
      big: Image3Big,
    },
    text: 'No Limits. Lower Fees.\nBet on anything you want. 3',
    button: {
      text: 'Sign up to start betting',
      link: 'https://dev.augur.net/',
    },
  },
];

export const LandingHero = () => {
  const {
    theme,
    actions: { setModal },
  } = useAppStatusStore();

  return (
    <>
      {theme === THEMES.TRADING ? (
        <section className={Styles.LandingHero}>
          <div>
            <h1>
              Augur v2
              <br />
              <span>Your global, no-limit betting platform</span>
            </h1>
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
      ) : (
        <section className={Styles.LandingHeroSlider}>
          <Slider images={images} />
          <div style={{ backgroundImage: `url(${SportsbookBanner})` }}>
            <h2>
              No Limits. Lower Fees.
              <br />
              Bet on anything you want.
            </h2>
            {images[0].button && (
              <PrimaryButton
                URL="https://dev.augur.net/"
                text="Sign up to start betting"
                action={noop}
              />
            )}
          </div>
        </section>
      )}
    </>
  );
};
