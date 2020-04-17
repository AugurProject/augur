require('@babel/register');
const fs = require('fs');

const router = require('./routes').default;
const Sitemap = require('react-router-sitemap').default;

const address =
  process.env.NODE_ENV === 'development'
    ? 'https://v2.augur.net/#!'
    : `https://cloudflare-eth.com/${process.env.IPFS_STABLE_LOADER_HASH ||
        'QmVfCcpugkz2WRCWJ75jnDSKAGXAQEgV8XEd839An6aXLE'}/#!`;

new Sitemap(router).build(address).save('./src/sitemap.xml');

const robotsFileData = `User-agent: *
Sitemap: ${address}/sitemap.xml
Disallow:
`;

fs.writeFile('./robots.txt', robotsFileData, error => {
  if (error) {
    console.log(error);
  } else {
    console.log('The robots.txt file was saved!');
  }
});

console.log('The sitemap was built.'); // Only shows this message after everything works well.
