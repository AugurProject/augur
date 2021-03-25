import React from 'react';
import { Helmet } from 'react-helmet';

export interface ReactHelmetConfig {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogSiteName?: string;
  ogUrl?: string;
  ogImage?: string;
  ogLocale?: string;
  ogType?: string;
  articleTag?: string[];
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  ogUpdatedTime?: string;
  articlePublisher?: string;
  articleSection?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageAlt?: string;
  twitterCardType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

export const SEO = ({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogSiteName,
  ogUrl,
  ogImage,
  ogLocale,
  ogType,
  articleTag,
  articlePublishedTime,
  articleModifiedTime,
  ogUpdatedTime,
  articlePublisher,
  articleSection,
  ogImageWidth,
  ogImageHeight,
  ogImageAlt,
  twitterCardType,
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterImageAlt,
  twitterSite,
  twitterCreator,
}: ReactHelmetConfig) => (
  <Helmet
    defaultTitle="Augur"
    titleTemplate="%s | Augur"
  >
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    {ogTitle && <meta property="og:title" content={ogTitle} />}
    {ogDescription && (
      <meta property="og:description" content={ogDescription} />
    )}
    {ogSiteName && <meta property="og:site_name" content={ogSiteName} />}
    {ogUrl && <meta property="og:url" content={ogUrl} />}
    {ogImage && <meta property="og:image" content={ogImage} />}
    {ogLocale && <meta property="og:locale" content={ogLocale} />}
    {ogImageWidth && (
      <meta property="og:image:width" content={ogImageWidth} />
    )}
    {ogImageHeight && (
      <meta property="og:image:height" content={ogImageHeight} />
    )}
    {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
    {ogType && <meta property="og:type" content={ogType} />}
    {articleTag?.length > 0 &&
    articleTag.map(tag => <meta property="article:tag" content={tag} key={tag} />)}
    {articlePublishedTime && (
      <meta
        property="article:published_time"
        content={articlePublishedTime}
      />
    )}
    {articleModifiedTime && (
      <meta property="article:modified_time" content={articleModifiedTime} />
    )}
    {ogUpdatedTime && (
      <meta property="og:updated_time" content={ogUpdatedTime} />
    )}
    {articlePublisher && (
      <meta property="article:publisher" content={articlePublisher} />
    )}
    {articleSection && (
      <meta property="article:section" content={articleSection} />
    )}
    {twitterCardType && (
      <meta name="twitter:card" content={twitterCardType} />
    )}
    {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
    {twitterDescription && (
      <meta name="twitter:description" content={twitterDescription} />
    )}
    {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    {twitterImageAlt && (
      <meta name="twitter:image:alt" content={twitterImageAlt} />
    )}
    {twitterSite && <meta name="twitter:site" content={twitterSite} />}
    {twitterCreator && (
      <meta name="twitter:creator" content={twitterCreator} />
    )}
  </Helmet>
);

export default SEO;
