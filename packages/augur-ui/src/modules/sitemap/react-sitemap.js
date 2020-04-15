require('@babel/register'); // 1.

const router = require('./routes').default;
const Sitemap = require('react-router-sitemap').default;

(
  new Sitemap(router)
    .build('http://localhost:8080/')
    .save('./sitemap.xml')
); // 2.

console.log("The sitemap was built."); // Only shows this message after everything works well.
