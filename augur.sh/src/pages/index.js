import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useThemeContext from '@theme/hooks/useThemeContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = () => [
  {
    title: <>Predict</>,
    imageUrl: '/img/augur-logo/augur-logo-full/Vertical/Whiteblank.svg',
    description: (
      <>
      Augur is a fully decentralized prediction market platform built on
      Ethereum. Augur's Oracle will markets resolve properly, and its built in
      trading support makes it easier to prediction market support to your
      application.
      </>
    ),
  },
  {
    title: <>Learn</>,
    imageUrl: '/img/augur-logo/augur-logo-full/Vertical/Whiteblank.svg',
    description: (
      <>
      The Augur protocol is built to robustly handle many of the major needs for generic Yes/No, Categorical, and Scalar markets. Discover how this was accomplished and how your project can take advantage of these features.
      </>
    ),
  },
  {
    title: <>Build</>,  //center
    imageUrl: '/img/augur-logo/augur-logo-full/Vertical/Whiteblank.svg',
    description: (
      <>
      Interact with the Augur platform through typescript, javascript or directly via Solidity. With full SDKs, as well as support for The Graph and even native support for Layer2 chains there is a world of applications to build.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Header() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return <header className={clsx('hero hero--primary', styles.heroBanner)}>
    <div className="container">
      <h1 className="hero__title">{siteConfig.title}</h1>
      <p className="hero__subtitle">{siteConfig.tagline}</p>
      <div className={styles.buttons}>
        <Link
          className={clsx(
            'button button--outline button--secondary button--lg',
            styles.getStarted,
          )}
          to={useBaseUrl('docs/SUMMARY')}>
          Get Started
        </Link>
      </div>
    </div>
  </header>
}

function Main(){
  return <main>
    {features().length > 0 && (
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {features().map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    )}
  </main>
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <Header/>
      <Main/>
    </Layout>
  );
}

export default Home;
