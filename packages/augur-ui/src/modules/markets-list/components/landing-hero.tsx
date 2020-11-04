import React from 'react';

import Styles from 'modules/markets-list/components/landing-hero.styles.less';
import { ExternalLinkButton, PrimaryButton } from 'modules/common/buttons';
import { MODAL_SIGNUP, THEMES } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { Slider } from 'modules/markets-list/components/slider';
import noop from 'utils/noop';

const imagesBase = [
  {
    alignment: 'center',
    noOverlay: false,
    image: {
      mobile: "images/banner-desktop-1920x456.png",
      tablet: "images/banner-desktop-1920x456.png",
      medium: "images/banner-desktop-1920x456.png",
      big: "images/banner-desktop-1920x456.png",
    },
    text: 'No Limits. Lower Fees.\nBet on anything you want.',
    button: {
      text: 'Sign up to start betting',
      action: noop,
    },
  },
  {
    alignment: 'right',
    noOverlay: false,
    image: {
      mobile: "images/american-football.png",
      tablet: "images/american-football.png",
      medium: "images/american-football.png",
      big: "images/american-football.png",
    },
    text: '+1000\nMarkets',
    button: {
      text: 'Explore Betting Exchange',
      secondary: true,
      action: noop,
    },
  },
  {
    alignment: 'center',
    noOverlay: true,
    image: {
      mobile: 'images/banner-3-1011x741.png',
      tablet: 'images/banner-3-1486x494.png',
      medium: 'images/banner-3-1522x456.png',
      big: 'images/banner-3-1920x456.png',
    },
    text: '',
    button: {
      text: 'Trade Now',
      action: noop,
    },
  },
];

export const LandingHero = () => {
  const {
    theme,
    actions: { setModal, setTheme },
  } = useAppStatusStore();
  const images = imagesBase;
  const isTrading = theme === THEMES.TRADING;
  const signup = () => setModal({ type: MODAL_SIGNUP });
  images[0].button.action = signup;
  images[1].button.action = () => {
    if (theme !== THEMES.BETTING) setTheme(THEMES.BETTING);
  };
  images[2].button.action = () => {
    if (!isTrading) setTheme(THEMES.TRADING);
  };
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
                action={signup}
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
          <div style={{ backgroundImage: `url(images/sportsbook-banner.png)` }}>
            <h2>
              No Limits. Lower Fees.
              <br />
              Bet on anything you want.
            </h2>
            {images[0].button && (
              <PrimaryButton
                text="Sign up to start betting"
                action={signup}
              />
            )}
          </div>
        </section>
      )}
    </>
  );
};
