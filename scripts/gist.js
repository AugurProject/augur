#!/usr/bin/env node

"use strict";

var request = require("request");

var metadata = {
  marketId: "0xdeadbeef",
  details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  links: [
    "http://www.lipsum.com/",
    "https://github.com/traviskaufman/node-lipsum"
  ]
};

request({
  method: "POST",
  headers: {"User-Agent": "request"},
  url: "https://api.github.com/gists",
  json: {
    "description": metadata.marketId,
    "public": true,
    "files": {"metadata.json": {content: JSON.stringify(metadata)}},
  }
}, function (e, res, body) {
  if (e) return console.error("error:", e);
  if (res.statusCode === 200) {
    console.log(body);
  }
});
