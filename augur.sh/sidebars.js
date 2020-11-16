module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Overview',
      items: [
        'SUMMARY',
        'overview/whatisaugur',
        'overview/concepts',
        {
          type: 'category',
          label: 'Dev Guide',
          items: [
            'overview/monorepoOverview',
            'overview/testnetdevGuide',
            'overview/localdevGuide',
            'overview/Tools',
          ]
        }

      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/contractOverview',
        'architecture/middlewareOverview',
        'architecture/uiOverview'
      ],
    },
    {
      type: 'category',
      label: 'API',
      items:['api/contracts/index',
      'api/augurSDK',
        'api/sdk/theGraph',
      ],
    },
  ],
};
