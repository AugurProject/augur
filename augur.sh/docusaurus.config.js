module.exports = {
  title: 'Augur Docs',
  tagline: 'Augur Documentation',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'augur', // Usually your GitHub org/user name.
  projectName: 'augur', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Augur Docs',
      logo: {
        alt: 'My Site Logo',
        src: 'img/augur-logo/Glyph/Color.svg',
        srcDark: 'img/augur-logo/Glyph/White.svg',
      },
      items: [
        {
          to: 'docs/SUMMARY',
          activeBasePath: '/',
          label: 'Overview',
          position: 'left',
        },
        {
          href: 'https://github.com/AugurProject/augur',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://invite.augur.net/',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/AugurProject',
            },
            {
              label: 'Reddit',
              href: 'https://www.reddit.com/r/Augur/',
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/augurproject/',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              href: 'https://augur.net/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/AugurProject',
            },
            {
              label: 'Bug Bounty',
              href: 'https://augur.net/developers',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PM Research LTD. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'Summary',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/AugurProject/augur/edit/v2/augur.sh/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
