import React from 'react'

export const MarketStatusOpen = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g fill="none" fillRule="evenodd"><g id="Markets/Card/Binary" stroke="#9B8BF5"><g id="Icon/Open"><circle id="Oval-5" cx="12" cy="12" r="4" /><circle id="Oval-5" cx="12" cy="12" r="11" /></g></g></g>
  </svg>
)

export const MarketStatusReported = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g id="Symbols" fill="none" fillRule="evenodd"><g id="Markets/Card/Multi" stroke="#412468"><g id="Icon/Reporting"><g id="Group" transform="translate(1 1)"><path id="Page-1" strokeLinecap="round" strokeLinejoin="round" d="M5 11.43l4.708 3.44L17 7" /><circle id="Oval-2" cx="11" cy="11" r="11" /></g></g></g></g>
  </svg>
)

export const MarketStatusClosed = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g fill="none" fillRule="evenodd"><g id="Markets/Card/Multi-Long" stroke="#A7A2B2"><g id="Icon/Closed"><g id="Group" transform="translate(1 1)"><circle id="Oval-2" cx="11" cy="11" r="11" /><path d="M3 4l15.5 14.5" id="Line" strokeLinecap="square" /></g></g></g></g>
  </svg>
)

export const Ledger = (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="a" d="M0 40h40V0H0z" />
    </defs>
    <g transform="translate(4 4)" fill="none" fillRule="evenodd">
      <path d="M31.7647059 30.5882353v8.8235294h6.4705882c.6494118 0 1.1764706-.5270588 1.1764706-1.1764706v-7.6470588h-7.6470588z" stroke="#FFF" />
      <mask id="b" fill="#fff">
        <use href="#a" />
      </mask>
      <path stroke="#FFF" mask="url(#b)" d="M17.0588235 39.4117647h7.6470589v-8.8235294h-7.6470589zm0-15.8823529h22.3529412V1.76470588c0-.64941176-.5270588-1.1764706-1.1764706-1.1764706H17.0588235V23.5294118zm-16.4705882 0H10v-5.882353H.5882353zM10 10.5882353v-10H1.76470588c-.64941176 0-1.1764706.52705882-1.1764706 1.17647058v8.82352942H10zm0 20H.5882353v7.6470588c0 .6494118.52705882 1.1764706 1.17647058 1.1764706H10v-8.8235294z" />
    </g>
  </svg>
)
