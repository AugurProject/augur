module.exports = {
  title: 'Augur Docs',
  tagline: 'Augur Documentation',
  url: 'https://docs.augur.sh',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'augurproject', // Usually your GitHub org/user name.
  projectName: 'augur', // Usually your repo name.
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css',
      type: 'text/css',
      integrity:
      'sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X',
      crossorigin: 'anonymous',
    },
  ],
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
      copyright: `Copyright © ${new Date().getFullYear()} Forecast Foundation OU. Built with Docusaurus.`,
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
            'https://github.com/AugurProject/augur/edit/documentation/augur.sh/',
          remarkPlugins: [
            require('remark-math')
          ],
          rehypePlugins: [
            require('rehype-katex')
          ]
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
