import React from 'react';
import { Helmet } from 'react-helmet';

interface HelmetConfig {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  ogSiteName?: string;
  ogType?: string;
}

export const HelmetTag = ({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage,
  ogSiteName,
  ogType,
}: HelmetConfig) => {
  return (
    <Helmet
      defaultTitle="Decentralized Prediction Markets"
      titleTemplate="%s | Augur"
    >
      {title && <title>{title}</title>}
      {description && <meta
        name="description"
        content={description}
      />}
      {canonicalUrl && <link rel="canonical" href="http://v2.augur.net/" />}

      {(ogTitle || title) && <meta property="og:title" content={ogTitle || title} />}
      {(ogDescription || description) && <meta
        property="og:description"
        content={ogDescription || description}
      />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content={ogSiteName || "Augur"} />
      <meta property="og:type" content={ogType || "article"} />
    </Helmet>
  );
};
