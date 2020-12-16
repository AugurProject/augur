module.exports = {
  title: 'Augur Docs',
  tagline: 'Augur Documentation',
  url: 'https://docs.augur.sh',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'augurproject', // Usually your GitHub org/user name.
  projectName: 'augur', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Augur Docs',
      logo: {
        alt: 'Augur',
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
