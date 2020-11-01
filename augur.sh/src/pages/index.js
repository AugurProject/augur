import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useThemeContext from '@theme/hooks/useThemeContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = (imageUrl) => [
  {
    title: <>Easy to Use</>,
    imageUrl: '/img/augur-logo/augur-logo-full/Vertical/Whiteblank.svg',
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: <>Focus on What Matters</>,  //center
    imageUrl,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: <>Powered by React</>,
    imageUrl: '/img/augur-logo/augur-logo-full/Vertical/Whiteblank.svg',
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
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
  const { isDarkTheme } = useThemeContext();
  const imageUrl= isDarkTheme ? '/img/augur-logo/augur-logo-full/Vertical/White.svg' : '/img/augur-logo/augur-logo-full/Vertical/Black.svg';
  return <main>
    {features(imageUrl).length > 0 && (
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {features(imageUrl).map((props, idx) => (
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
