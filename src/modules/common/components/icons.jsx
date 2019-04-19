import React from "react";

export const closeIcon = (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 1L9 9" stroke="white" strokeLinecap="round" />
    <path d="M9 1L1 9" stroke="white" strokeLinecap="round" />
  </svg>
);

export const collapseIcon = (
  <svg
    width="20"
    height="30"
    viewBox="0 0 20 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="1"
      width="18"
      height="28"
      rx="1"
      stroke="#484552"
      strokeLinecap="round"
    />
    <path
      d="M13 9L10 6L7 9"
      stroke="#484552"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 6.5L10 13.5" stroke="#484552" strokeLinecap="round" />
    <path
      d="M13 21L10 24L7 21"
      stroke="#484552"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 23.5L10 16.5" stroke="#484552" strokeLinecap="round" />
  </svg>
);

export const expandIcon = (
  <svg
    width="20"
    height="28"
    viewBox="0 0 20 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.87">
      <rect
        x="1"
        y="12"
        width="18"
        height="4"
        rx="1"
        stroke="#484552"
        strokeLinecap="round"
      />
      <path
        d="M13 6L10 9L7 6"
        stroke="#484552"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="0.5"
        y1="-0.5"
        x2="7.5"
        y2="-0.5"
        transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 9.5 8)"
        stroke="#484552"
        strokeLinecap="round"
      />
      <path
        d="M13 22L10 19L7 22"
        stroke="#484552"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="20.5"
        x2="10"
        y2="27.5"
        stroke="#484552"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const downChevron = (strokeWidth = 4) => (
  <svg
    width="18"
    height="9"
    viewBox="0 0 18 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.35355 0.146447C1.15829 -0.0488155 0.841709 -0.0488155 0.646447 0.146447C0.451184 0.341709 0.451184 0.658291 0.646447 0.853553L8.64562 8.85272C8.64589 8.853 8.64617 8.85328 8.64645 8.85355C8.84171 9.04882 9.15829 9.04882 9.35355 8.85355C9.35375 8.85336 9.35394 8.85316 9.35414 8.85297L17.3536 0.853553C17.5488 0.658291 17.5488 0.341709 17.3536 0.146447C17.1583 -0.0488155 16.8417 -0.0488155 16.6464 0.146447L9 7.79289L1.35355 0.146447Z"
      fill="white"
      stroke="white"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export const BackArrow = (
  <svg
    width="18"
    height="10"
    viewBox="0 0 18 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 1L1 5L5 9"
      stroke="white"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="2" y="4" width="16" height="2" rx="1" fill="white" />
  </svg>
);

export const twoArrows = (
  <svg
    width="60"
    height="40"
    viewBox="0 0 60 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M34 31L30 35L26 31"
      stroke="white"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34 23L30 19L26 23"
      stroke="white"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const threeDots = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="9.5" r="1.5" fill="#76737E" />
    <circle cx="16" cy="22.5" r="1.5" fill="#76737E" />
    <circle cx="16" cy="16" r="1.5" fill="#76737E" />
  </svg>
);

export const RightChevron = (
  <svg
    width="7"
    height="14"
    viewBox="0 0 7 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.5"
      d="M0.65686 1.34315C0.65686 1.34315 4.10458 4.79086 6.31372 7L0.65686 12.6568"
      stroke="white"
    />
  </svg>
);

export const CreateMarketEdit = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g id="Symbols" fill="none" fillRule="evenodd" strokeLinejoin="round">
      <g id="New-Market/Market-Card/2" stroke="#A7A2B2" fillRule="nonzero">
        <g id="Icon/Edit">
          <path
            d="M1 18.417V23h4.583l12.703-12.57-4.583-4.584L1 18.416zM22.643 5.94c.476-.476.476-1.246 0-1.723l-2.86-2.86c-.477-.476-1.247-.476-1.723 0l-2.237 2.237 4.583 4.583 2.237-2.237z"
            id="Shape"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const Check = (
  <svg viewBox="0 0 21 14" xmlns="http://www.w3.org/2000/svg">
    <g
      id="Trading"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g id="Trading_Limit-Order_Confirmed_5" stroke="#F6F6F8">
        <g id="Order-Placed-View">
          <g id="Icon/Check">
            <path id="Page-1" d="M0 7.385l7.846 5.733L20 0" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const IconSearch = (
  <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <g id="Symbols" fill="none" fillRule="evenodd" fillOpacity="1">
      <g id="Markets/Header" fill="#9592a4">
        <g id="Group-5">
          <path
            d="M8.337 7.402h-.494l-.172-.17c.608-.707.977-1.624.977-2.63C8.647 2.37 6.837.56 4.604.56 2.37.56.56 2.37.56 4.603s1.81 4.043 4.044 4.043c1.004 0 1.92-.368 2.628-.974l.17.17v.493l3.11 3.105.928-.928-3.103-3.11zm-3.733 0c-1.547 0-2.8-1.252-2.8-2.8 0-1.544 1.253-2.798 2.8-2.798 1.545 0 2.8 1.254 2.8 2.8 0 1.546-1.255 2.798-2.8 2.798z"
            id="Shape"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const NavReportingIcon = () => (
  <svg viewBox="0 0 23 15" xmlns="http://www.w3.org/2000/svg">
    <g
      id="Symbols"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g id="Navigation/Section/Left-Nav" stroke="#FFF">
        <g id="Icon/Reporting">
          <path id="Page-1" d="M0 8.124l8.63 6.306L22 0" />
        </g>
      </g>
    </g>
  </svg>
);

export const ExportIcon = (
  <svg viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg">
    <g
      id="Symbols"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g id="Portfolio/Head" stroke="#A7A2B2">
        <g id="Export">
          <g id="Icon/Export-Gray">
            <g id="Page-1">
              <path d="M8.08 11.347L8.03.08" id="Stroke-1" />
              <path id="Stroke-3" d="M5.263 2.737L8 0l2.737 2.737" />
              <path id="Stroke-5" d="M4.333 5.71H1v8h14v-8h-3.333" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Ledger = (
  <svg
    width="18px"
    height="18px"
    viewBox="0 0 18 18"
    version="1.1"
    xmlns="http://www.w3.org/1999/xlink"
  >
    <defs />
    <g
      id="Create/Connect-Account"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="SoftwareWalletDisconnectedActive"
        transform="translate(-24.000000, -239.000000)"
        fill="#FFFFFF"
        fillRule="nonzero"
      >
        <g id="dropdown" transform="translate(0.000000, 72.000000)">
          <g id="ledger" transform="translate(0.000000, 152.000000)">
            <g id="ledgerLogo" transform="translate(24.000000, 15.000000)">
              <path d="M15.1127835,0 L6.82994618,0 L6.82994618,11.1103292 L17.9461595,11.1103292 L17.9461475,2.89067605 C17.9506737,1.32998241 16.674302,1.60715874e-16 15.1127835,0 Z M4.28625516,0 L2.89672999,0 C1.33521148,0 0,1.27117366 0,2.8951998 L0,4.28399095 L4.28625516,4.28399095 L4.28625516,0 Z M0,6.88514702 L4.28625516,6.88514702 L4.28625516,11.169138 L0,11.169138 L0,6.88514702 Z M13.6644185,17.9954763 L15.0539437,17.9954763 C16.6154622,17.9954763 17.9506737,16.7243026 17.9506737,15.1002765 L17.9506737,13.716009 L13.6644185,13.716009 L13.6644185,17.9954763 Z M6.82994618,13.716009 L11.1162013,13.716009 L11.1162013,18 L6.82994618,18 L6.82994618,13.716009 Z M0,13.716009 L0,15.1048002 C0,16.6654938 1.27184551,18 2.89672999,18 L4.28625516,18 L4.28625516,13.716009 L0,13.716009 Z" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Edge = (
  <svg
    width="18px"
    height="18px"
    viewBox="0 0 18 18"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <g
      id="Create/Connect-Account"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="SoftwareWalletDisconnectedActive"
        transform="translate(-24.000000, -143.000000)"
        fill="#FFFFFF"
        fillRule="nonzero"
      >
        <g id="dropdown" transform="translate(0.000000, 72.000000)">
          <g id="edge" transform="translate(0.000000, 56.000000)">
            <path
              d="M26.7901934,15 L33.4904666,15 L30.5986628,22.673431 L24,22.673431 L26.7901934,15 Z M31.8857655,24.4729727 L34.4520286,17.5466409 L41.974343,17.5466409 L36.6694783,32.0513509 L24.2990517,32.0513509 L27.0278822,24.4155608 L31.8857655,24.4729727 Z"
              id="edgeLogo"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const uPort = (
  <svg
    id="d05ce26b-14ad-4d9e-84cb-0faf489e50ed"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 46 43.91"
  >
    <defs>
      <style>
        {`.c1e77bc5-3c90-498e-85ed-fc6667b0786b {
          fill: #fff;
          }`}
      </style>
    </defs>
    <title>uPort</title>
    <g id="e525033e-a215-4d86-bd7d-3d09aa3316c5" data-name="Symbols">
      <g id="0ea812fb-f990-460d-8a38-16623e033680" data-name="Icon/uPort">
        <path
          id="e50b6249-4d84-49dd-aa5b-80b6eca43cf7"
          data-name="Page-1"
          className="c1e77bc5-3c90-498e-85ed-fc6667b0786b"
          d="M35.93,34.16c1.32-.85,1.46-1.88.21-2.67a31.1,31.1,0,0,0-3.88-1.81,8.1,8.1,0,0,0-.92-.28c.27-.49.48-.92.74-1.31a.62.62,0,0,1,.44-.21h.07a11.53,11.53,0,0,1,5,2.41,3.15,3.15,0,0,1-.14,5.06,12.64,12.64,0,0,1-5.7,2.51,37,37,0,0,1-7.85.87,31.76,31.76,0,0,1-8.69-1.19,15.3,15.3,0,0,1-4.42-2.1c-2.06-1.42-2-3.7-.14-5.32a11.83,11.83,0,0,1,4.76-2.23h.06a.74.74,0,0,1,.5.26,9.19,9.19,0,0,1,.6,1c-1.63.78-3.23,1.4-4.67,2.27-1.27.77-1.13,1.84.17,2.66,1.8-1.84,4.23-2.08,6.58-2.48h.1a2.2,2.2,0,0,1,.89.34A9.34,9.34,0,0,0,24,33.15a8.25,8.25,0,0,0,3.49-.79,5.66,5.66,0,0,1,2.41-.6,5,5,0,0,1,1.27.17c1.74.46,3.52.79,4.78,2.22M24,31.33h0a7.21,7.21,0,1,1,0-14.41H24A7.21,7.21,0,1,1,24,31.33M24,2a1.55,1.55,0,0,0-.89.28,4.27,4.27,0,0,0-1,1.21Q11.84,19.05,1.65,34.63C.54,36.33.83,37.28,2.71,38l20.17,7.6c.36.14.74.21,1.11.32.38-.11.74-.17,1.07-.3l20.33-7.67c1.74-.66,2-1.65,1-3.19l-14-21.37Q29,8.19,25.63,3A2,2,0,0,0,24,2m5.81,28.05,1.25.37.37.1a3.4,3.4,0,0,1,.42.13l1.13.49a18,18,0,0,1,2.62,1.26,1.3,1.3,0,0,1,.36.3A10.37,10.37,0,0,0,32,31l-.53-.14a5.93,5.93,0,0,0-1.54-.21,5.7,5.7,0,0,0-.95.08,8.36,8.36,0,0,0,.85-.72m-11.9-.32a8.45,8.45,0,0,0,.91.84h-.08l-.28,0-.68.11a12.3,12.3,0,0,0-5.69,2,1.09,1.09,0,0,1,.36-.3,28.75,28.75,0,0,1,3.06-1.53l1.51-.7.89-.43M16.21,27a1.69,1.69,0,0,0-.77-.2,1.33,1.33,0,0,0-.34,0,12.94,12.94,0,0,0-5.18,2.45A4.59,4.59,0,0,0,8.14,33a4.31,4.31,0,0,0,2,3.31,16.24,16.24,0,0,0,4.74,2.25,32.94,32.94,0,0,0,9,1.24,38.19,38.19,0,0,0,8.07-.9,13.8,13.8,0,0,0,6.17-2.74,4.53,4.53,0,0,0,1.72-3.31,4.47,4.47,0,0,0-1.55-3.34,12.58,12.58,0,0,0-5.4-2.66,1.33,1.33,0,0,0-.36,0,1.74,1.74,0,0,0-.73.18,8.16,8.16,0,0,0,.51-2.83,8.33,8.33,0,0,0-8.25-8.32H24A8.28,8.28,0,0,0,16.21,27M24,3.07a1,1,0,0,1,.76.53q2.63,4,5.24,8L31.54,14l5.17,7.9,8.82,13.47c.46.7.41,1,.39,1s-.13.29-.91.59L24.68,44.61a5.62,5.62,0,0,1-.59.17l-.1,0-.09,0a6.28,6.28,0,0,1-.65-.19L3.09,37c-.89-.34-1-.6-1-.63S2,36,2.54,35.22l4.88-7.46Q15.18,15.92,22.94,4.07a3.47,3.47,0,0,1,.76-.91A.48.48,0,0,1,24,3.07"
          transform="translate(-1 -2)"
        />
      </g>
    </g>
  </svg>
);

export const Trezor = (
  <svg
    width="13px"
    height="18px"
    viewBox="0 0 13 18"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <g
      id="Create/Connect-Account"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="SoftwareWalletDisconnectedActive"
        transform="translate(-27.000000, -191.000000)"
        fill="#FFFFFF"
        fillRule="nonzero"
      >
        <g id="dropdown" transform="translate(0.000000, 72.000000)">
          <g id="trezor" transform="translate(0.000000, 104.000000)">
            <path
              d="M37.5237142,20.5296365 L39.326924,20.5296365 L39.326924,30.1125063 L39.3145205,30.1125063 L33.1636759,33 L27.0124035,30.1125063 L27,30.1125063 L27,20.5296365 L28.8040653,20.5296365 L28.8040653,19.1842878 C28.8040653,16.8773006 30.760394,15 33.1645313,15 C35.5673854,15 37.5237142,16.8773006 37.5237142,19.1842878 L37.5237142,20.5296365 Z M36.8462273,28.5187988 L36.8462273,22.7781863 L29.4806967,22.7781863 L29.4806967,28.5187988 L33.1636759,30.2435607 L36.8462273,28.5187988 Z M31.0405417,19.1842878 L31.0405417,20.5296365 L35.2872378,20.5296365 L35.2872378,19.1842878 C35.2872378,18.1165167 34.3343081,17.2476904 33.1645313,17.2476904 C31.9934714,17.2476904 31.0405417,18.1165167 31.0405417,19.1842878 Z"
              id="trezorLogo"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Keystore = (
  <svg
    id="d7c32dda-f36e-456a-9079-f98a93957648"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32.8 45.87"
  >
    <defs>
      <style>
        {`
          .\\34 c40df67-28a7-4a63-8b5b-b71b5465b1d2 {
            fill: #fff;
          }

          .b86f50e5-9448-4f13-acb3-2e5ce5cb5c88 {
            mask: url(#d745dd27-237d-4b73-8097-e409b9656b0d);
          }
        `}
      </style>
      <mask
        id="d745dd27-237d-4b73-8097-e409b9656b0d"
        x="0"
        y="0"
        width="32.8"
        height="45.87"
        maskUnits="userSpaceOnUse"
      >
        <g transform="translate(-7 -1)">
          <g id="4708e3e3-8419-4e42-93ac-d8099574375a" data-name="mask-2">
            <polygon
              id="d947e9fc-cd44-4d8e-82a8-25ea2ec44ef6"
              data-name="path-1"
              className="4c40df67-28a7-4a63-8b5b-b71b5465b1d2"
              points="39.8 46.87 39.8 1 7 1 7 46.87 39.8 46.87"
            />
          </g>
        </g>
      </mask>
    </defs>
    <title>Keystore</title>
    <g id="9a6727d5-4c46-4752-beaa-86185de6066c" data-name="Symbols">
      <g id="74dc2734-732e-49ba-a63f-42a6a6a5a65d" data-name="Icon/Keystore">
        <g id="81659e52-4b0a-43f3-af99-a2849a814b35" data-name="Page-1">
          <g className="b86f50e5-9448-4f13-acb3-2e5ce5cb5c88">
            <path
              id="739fafef-728f-4419-a199-b2c0392606ca"
              data-name="Fill-1"
              className="4c40df67-28a7-4a63-8b5b-b71b5465b1d2"
              d="M29.23,11.39h8.59L29.23,2.94Zm9.5,1.09H28.95c-.62,0-.78-.16-.78-.77q0-4.59,0-9.19V2.08H8.08v43.7H38.73ZM7,23.9V1.83c0-.68.15-.83.84-.83H28.41a1.15,1.15,0,0,1,.87.36q5.07,5,10.16,10a1.1,1.1,0,0,1,.36.86q0,16.91,0,33.82c0,.68-.14.82-.84.82H7.84c-.69,0-.84-.14-.84-.83Z"
              transform="translate(-7 -1)"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Key = (
  <svg
    id="986dc871-bd7c-4cd5-a999-a53f5690d6ab"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 44.93 32.02"
  >
    <defs>
      <style>
        {`
          .dcf9129a-67e1-4c58-a125-e1bb2403b70c {
            fill: #fff;
          }

          .\\30 1e2ccdd-4c3f-4d69-9ea0-7fda68f93707 {
            mask: url(#c9d7d845-6b4c-437b-973b-584e80f5db37);
          }
        `}
      </style>
      <mask
        id="c9d7d845-6b4c-437b-973b-584e80f5db37"
        x="-1.44"
        y="-0.62"
        width="47.7"
        height="32.89"
        maskUnits="userSpaceOnUse"
      >
        <g transform="translate(-1.5 -10.62)">
          <g id="bedc9bc9-7454-447f-ba14-70b9f3bc2325" data-name="mask-2">
            <polygon
              id="7d4e6d25-d732-4fea-8f25-dfda7a71fbd0"
              data-name="path-1"
              className="dcf9129a-67e1-4c58-a125-e1bb2403b70c"
              points="2.14 10 0.06 39.7 45.69 42.89 47.76 13.19 2.14 10"
            />
          </g>
        </g>
      </mask>
    </defs>
    <title>Key</title>
    <g id="68d4e0f8-a82b-4bc2-a984-abe467433c09" data-name="Symbols">
      <g id="da4ef49b-c5a5-4957-8f63-62f92d56d2ee" data-name="Icon/Key">
        <g id="2f65728b-36d5-460c-9c20-e0c82f228079" data-name="Page-1">
          <g className="01e2ccdd-4c3f-4d69-9ea0-7fda68f93707">
            <path
              id="9591d5cc-ef25-49b8-95f7-0379a74d07af"
              data-name="Fill-1"
              className="dcf9129a-67e1-4c58-a125-e1bb2403b70c"
              d="M18,16.25a8.2,8.2,0,0,0-10.7-3.91,7.72,7.72,0,0,0-4,10.33A8.21,8.21,0,0,0,14,26.6a7.7,7.7,0,0,0,4-10.35m27.25,16.5-8.09-3-.14.33-2.57,6.67a1.61,1.61,0,0,1-.15.33.51.51,0,0,1-.65.2.47.47,0,0,1-.32-.58,2.31,2.31,0,0,1,.12-.34L36,29.76a2.77,2.77,0,0,1,.17-.32L19,23.16A9.25,9.25,0,0,1,7,27.57,8.8,8.8,0,0,1,2,16.38,9.18,9.18,0,0,1,12.92,10.9a8.9,8.9,0,0,1,6.43,11.27,3.16,3.16,0,0,1,.43.1l26,9.49c.75.27.8.4.52,1.13L42.74,42a2.08,2.08,0,0,1-.14.33.51.51,0,0,1-.67.23.48.48,0,0,1-.31-.59,2.09,2.09,0,0,1,.12-.34L45,33.1c0-.12.12-.24.17-.35"
              transform="translate(-1.5 -10.62)"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const MetaMask = (
  <svg
    width="19px"
    height="20px"
    viewBox="0 0 19 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <g
      id="Create/Connect-Account"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="SoftwareWalletDisconnectedActive"
        transform="translate(-23.000000, -94.000000)"
        stroke="#FFFFFF"
      >
        <g id="dropdown" transform="translate(0.000000, 72.000000)">
          <g id="metaMask" transform="translate(0.000000, 8.000000)">
            <g id="metamaskLogo" transform="translate(23.909091, 15.000000)">
              <polygon
                id="Stroke-1"
                strokeLinecap="round"
                points="5.42289817 0.156604444 7.37789817 2.49299556 10.8538254 2.49299556 16.7192436 1.00627556 14.98128 5.46684444 15.6332255 6.10389332 15.1983164 6.52872888 15.6332255 6.74135112 15.1983164 7.16618668 15.4157709 7.80364444 14.8453709 8.97184 14.7638255 10.1400356 14.98128 11.6267556 14.98128 13.3260978 16.2847527 14.8128178 16.93628 15.2376533 16.5017891 16.2995378 15.1983164 17.7866667 12.8088254 17.7866667 7.31809816 15.9229511 1.72951637 17.7866667 0.209007273 13.9635556 2.38146182 9.07774224 1.51248 8.22807112 2.16442546 8.01585776 1.07798909 7.37880888 1.94697091 7.16618668 0.860952727 6.52872888 1.51248 6.31651556 1.51248 5.25463112 2.81595273 2.70561778"
              />
              <polyline
                id="Stroke-3"
                strokeLinecap="round"
                points="16.3932291 14.9191289 15.3072109 14.9191289 15.0897564 15.3439644 15.0897564 16.6184711 16.3719018 16.4267022"
              />
              <polygon
                id="Stroke-6"
                strokeLinecap="round"
                points="14.1816431 10.6363636 14.7272727 11.2907831 13.9090909 11.4545455"
              />
              <polygon
                id="Stroke-7"
                strokeLinecap="round"
                points="9.74372357 10.6363636 10.6363636 12.2727273 8.18181818 11.7272728"
              />
              <polyline
                id="Stroke-8"
                points="7.31079802 2.45454545 9 5.11343951 5.62159599 8.7952577 2.45454545 9"
              />
              <polyline
                id="Stroke-9"
                strokeLinecap="round"
                points="8.75830948 13.9090909 14.7272727 15.645097 7.36363636 16.3636364"
              />
              <polyline
                id="Stroke-10"
                strokeLinecap="round"
                points="9 13.0909091 6.38165021 10.6363637 5.72727273 9"
              />
              <polyline
                id="Stroke-11"
                strokeLinecap="round"
                points="14.7272727 14.7272727 11.6590768 11.802648 11.0452014 10.1314339 9 4.90909091"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Alert = (
  <svg
    id="a26f05d9-644c-4f17-afbc-46d4647e9dc7"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 37.48 37.48"
  >
    <defs>
      <style>
        {`
          .d4f2b59f-7178-4786-9bb7-fd6cf8b75d6d {
            fill: none;
            stroke: #fff;
          }

          .ce4ea548-02b7-4ef0-aceb-1c5c55ba77a5 {
            fill: #fff;
          }
        `}
      </style>
    </defs>
    <title>Alert</title>
    <g id="77f1ff9b-fa1c-4c5c-8c21-5153f0872de8" data-name="Symbols">
      <g id="20f98d0f-af34-46a2-9e12-54de87a1d961" data-name="Icon/Alert">
        <g id="4d653298-4d39-40cf-88e1-0ea89eb0f0a5" data-name="Page-1">
          <path
            id="c113668e-527a-4708-a6e6-731f7cebddbe"
            data-name="Stroke-1"
            className="d4f2b59f-7178-4786-9bb7-fd6cf8b75d6d"
            d="M18.78,2.54a1.31,1.31,0,0,1,2.41,0l8.43,16.65L38,35.84a1.6,1.6,0,0,1-1.2,2.38H3.13a1.6,1.6,0,0,1-1.2-2.38l8.42-16.65Z"
            transform="translate(-1.24 -1.24)"
          />
          <path
            id="2100dda0-6ebb-4d99-bf1e-7c24d4217c99"
            data-name="Fill-3"
            className="ce4ea548-02b7-4ef0-aceb-1c5c55ba77a5"
            d="M20.6,27.52H19.36l-.2-11.71h1.66ZM19.12,32.1h1.72V30.17H19.12Z"
            transform="translate(-1.24 -1.24)"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const darkBgExclamationCircle = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="7.5" fill="#1A1627" stroke="#443B59" />
    <rect x="7.55566" y="3.55554" width="1.15556" height="6.22222" />
    <path d="M7.57252 10.8973C7.44279 11.0463 7.37793 11.2313 7.37793 11.4523C7.37793 11.6685 7.44279 11.8487 7.57252 11.9928C7.70706 12.137 7.90886 12.209 8.17793 12.209C8.44219 12.209 8.64159 12.137 8.77613 11.9928C8.91066 11.8487 8.97793 11.6685 8.97793 11.4523C8.97793 11.2313 8.91066 11.0463 8.77613 10.8973C8.64159 10.7436 8.44219 10.6667 8.17793 10.6667C7.90886 10.6667 7.70706 10.7436 7.57252 10.8973Z" />
  </svg>
);

export const WarningExclamationCircle = () => ExclamationCircle("#00eaff");
export const ExclamationCircle = (c = "#ff2727") => (
  <svg viewBox="0 0 16 16">
    <g
      id="Updated-Screens"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="New-Market_11" transform="translate(-682.000000, -464.000000)">
        <g id="Icon/Error" transform="translate(682.000000, 464.000000)">
          <circle id="Oval" stroke={c} strokeWidth="1" cx="8" cy="8" r="7" />
          <text
            id="!"
            transform="translate(8.000000, 7.500000) scale(-1, 1) translate(-8.000000, -7.500000) "
            fontFamily=".AppleSystemUIFont"
            fontSize="10.5"
            fontWeight="normal"
            letterSpacing="0.262500018"
            fill={c}
          >
            <tspan x="6.7" y="11.5">
              !
            </tspan>
          </text>
        </g>
      </g>
    </g>
  </svg>
);

export const Hint = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="9"
      cy="9"
      r="8"
      fill="#1A1627"
      stroke="#2B2438"
      strokeWidth="2"
    />
    <path
      d="M6.5 6.30273H9.74023V11.7051H11.8086V12.6426H6.5V11.7051H8.65625V7.24609H6.5V6.30273ZM8.51562 4.63867C8.51562 4.45898 8.56836 4.30859 8.67383 4.1875C8.7832 4.0625 8.94727 4 9.16602 4C9.38086 4 9.54297 4.0625 9.65234 4.1875C9.76172 4.30859 9.81641 4.45898 9.81641 4.63867C9.81641 4.81445 9.76172 4.96094 9.65234 5.07812C9.54297 5.19531 9.38086 5.25391 9.16602 5.25391C8.94727 5.25391 8.7832 5.19531 8.67383 5.07812C8.56836 4.96094 8.51562 4.81445 8.51562 4.63867Z"
      fill="white"
    />
  </svg>
);

export const CheckboxOff = (
  <svg
    id="13de3723-afc4-43e5-966e-01b702ca5297"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21.16 21.16"
  >
    <defs>
      <style>
        {`
          .\\32 c905fc7-7c65-4dc2-9b42-80d0c16bf440 {
            fill: none;
            stroke: #dbdae1;
          }
        `}
      </style>
    </defs>
    <title>Checkbox off</title>
    <g id="6247de90-74a6-45ea-a21d-97996a0bbca7" data-name="Symbols">
      <g
        id="311a987f-edbc-411a-82a6-6412bd7ac823"
        data-name="Icon/Checkbox-off"
      >
        <path
          id="27769802-1472-48d7-b9ce-ebd8904a8e2b"
          data-name="Page-1"
          className="2c905fc7-7c65-4dc2-9b42-80d0c16bf440"
          d="M21.32,22H2.84A.84.84,0,0,1,2,21.16V2.68a.84.84,0,0,1,.84-.84H21.32a.84.84,0,0,1,.84.84V21.16A.84.84,0,0,1,21.32,22Z"
          transform="translate(-1.5 -1.34)"
        />
      </g>
    </g>
  </svg>
);

export const CheckboxOn = (
  <svg
    id="9777b652-807f-44b2-b0f5-08d8f20182df"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21.95 21.95"
  >
    <defs>
      <style>
        {`
          .ca26950d-c854-49b5-8612-bc2195287f01 {
            fill: #fff;
          }

          .b4f8e674-bfe0-4f87-834c-84e3e215014d {
            mask: url(#74980403-58c9-4bea-810f-348232e431af);
          }

          .f24bbc3a-6b13-49c2-b214-429ae7463706 {
            fill: #dbdae1;
          }
        `}
      </style>
      <mask
        id="74980403-58c9-4bea-810f-348232e431af"
        x="0"
        y="0"
        width="21.95"
        height="21.95"
        maskUnits="userSpaceOnUse"
      >
        <g transform="translate(-1 -1)">
          <g id="bee4a8b8-354e-4a0d-a6fa-c5b8ef851f5d" data-name="mask-2">
            <polygon
              id="b7cecb15-2e1f-4a3e-bfa1-d12baa16cf98"
              data-name="path-1"
              className="ca26950d-c854-49b5-8612-bc2195287f01"
              points="1 1 1 22.95 22.95 22.95 22.95 1 1 1"
            />
          </g>
        </g>
      </mask>
    </defs>
    <title>Checkbox on</title>
    <g id="67926e8a-f89e-418a-8b1c-59a389273db0" data-name="Symbols">
      <g id="baee6728-b48c-40bf-819c-51fbe34fc671" data-name="Icon/Checkbox-on">
        <g id="db803d01-815f-436a-8d94-24b56c85a525" data-name="Page-1">
          <g className="b4f8e674-bfe0-4f87-834c-84e3e215014d">
            <path
              id="ce747c73-65f8-49f8-841a-d76674045203"
              data-name="Fill-1"
              className="f24bbc3a-6b13-49c2-b214-429ae7463706"
              d="M20.54,6.89l-10,10.8a.46.46,0,0,1-.61.06L3.47,13A.46.46,0,1,1,4,12.29l6.13,4.48,9.73-10.5a.46.46,0,1,1,.67.62M22,1H1.91A.91.91,0,0,0,1,1.91V22a.91.91,0,0,0,.91.91H22A.91.91,0,0,0,23,22V1.91A.91.91,0,0,0,22,1"
              transform="translate(-1 -1)"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Export = (
  <svg
    id="953e0014-1cef-4429-aafa-e42c291ab42f"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22 21.56"
    width="22"
    height="21.56"
  >
    <defs>
      <style>
        {`
          .\\32 275d31d-f7ee-42a6-8027-90262a5b4750 {
            fill: none;
            stroke: #372e4b;
            strokeLinecap: round;
            strokeLinejoin: round;
          }
        `}
      </style>
    </defs>
    <title>Export</title>
    <g id="ed372e3a-954b-40ff-afe2-e288566f7a6d" data-name="Symbols">
      <g id="80e4e169-eff0-41bb-9bea-04faeddf2370" data-name="Icon/Export">
        <g id="c8ed4e46-376e-479a-9db9-b46166ee0f07" data-name="Page-1">
          <path
            id="1bdd6f72-b4f9-413d-ac0e-f8501b5edd93"
            data-name="Stroke-1"
            className="2275d31d-f7ee-42a6-8027-90262a5b4750"
            d="M12.12,19.52,12,2.62"
            transform="translate(-1 -2)"
          />
          <polyline
            id="16a19ee2-560a-4a11-903f-2c575013af1c"
            data-name="Stroke-3"
            className="2275d31d-f7ee-42a6-8027-90262a5b4750"
            points="6.89 4.61 11 0.5 15.11 4.61"
          />
          <polyline
            id="55f5846e-8998-413d-b85b-e148ec0042c5"
            data-name="Stroke-5"
            className="2275d31d-f7ee-42a6-8027-90262a5b4750"
            points="5.5 9.06 0.5 9.06 0.5 21.06 21.5 21.06 21.5 9.06 16.5 9.06"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const Deposit = (
  <svg width="26px" height="26px" viewBox="0 0 26 26">
    <g
      id="Account"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        id="Account_1"
        transform="translate(-575.000000, -448.000000)"
        stroke="#fff"
      >
        <g id="Icon/Deposit" transform="translate(574.000000, 447.000000)">
          <path
            d="M14.1394167,1.74976667 L14.0519167,21.4687667"
            id="Stroke-1"
          />
          <polyline
            id="Stroke-3"
            points="9.21071667 16.8168 13.9998833 21.6059667 18.78905 16.8168"
          />
          <polyline
            id="Stroke-4"
            points="7.58321667 11.7399333 1.74988333 11.7399333 1.74988333 25.7399333 26.2498833 25.7399333 26.2498833 11.7399333 20.41655 11.7399333"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const Withdraw = (
  <svg width="26px" height="20px" viewBox="0 0 26 20">
    <g
      id="Account"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        id="Account_2"
        transform="translate(-615.000000, -452.000000)"
        stroke="#fff"
      >
        <g id="Icon/Withdraw" transform="translate(614.000000, 448.000000)">
          <g id="Page-1" transform="translate(1.000000, 4.000000)">
            <polyline id="Stroke-1" points="0.52 6.5 25.48 6.5 16.12 0.5" />
            <polyline
              id="Stroke-3"
              points="25.48 13.25 0.52 13.25 9.88 19.25"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Copy = (
  <svg width="19px" height="24px" viewBox="0 0 19 24">
    <g
      id="Account"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinejoin="round"
    >
      <g
        id="Account_2"
        transform="translate(-1291.000000, -549.000000)"
        stroke="#fff"
      >
        <g id="Icon/Copy" transform="translate(1288.000000, 549.000000)">
          <g id="Page-1" transform="translate(3.428571, 0.857143)">
            <polygon
              id="Stroke-1"
              points="17.1428571 22.2857143 2.70676692 22.2857143 2.70676692 1.9378882 13.3064662 1.9378882 17.1428571 5.42221118"
            />
            <polyline
              id="Stroke-3"
              points="13.0827068 2.42236025 13.0827068 5.32919255 16.6917293 5.32919255"
            />
            <polygon
              id="Stroke-5"
              points="2.70676692 1.9378882 12.6505263 1.9378882 11.0508271 0.48447205 0.45112782 0.48447205 0.45112782 20.8322981 2.70676692 20.8322981"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Close = (
  <svg viewBox="0 0 24 24">
    <defs />
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
    >
      <g id="Icon/Close" stroke="#F6F6F8">
        <path
          d="M2.25937312,2.25937312 L21.7139306,21.7139306"
          id="CloseLine"
        />
        <path
          d="M21.8116947,2.3571372 L2.3571372,21.8116947 L21.8116947,2.3571372 Z"
          id="CloseLineJoinRound"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </svg>
);

export const CloseDark = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="23"
    viewBox="0 0 23 23"
  >
    <g fill="none" fillRule="nonzero" transform="translate(-5 -5)">
      <path
        fill="#DBDAE1"
        d="M8.721 24.278c-4.295-4.296-4.295-11.26 0-15.556 4.297-4.296 11.261-4.296 15.557 0 4.296 4.295 4.296 11.26 0 15.557-4.296 4.295-11.26 4.295-15.557-.001z"
      />
      <rect
        width="1"
        height="13"
        x="16"
        y="10"
        fill="#FFF"
        rx=".5"
        transform="rotate(135 16.5 16.5)"
      />
      <rect
        width="1"
        height="13"
        x="16"
        y="10"
        fill="#FFF"
        rx=".5"
        transform="rotate(-135 16.5 16.5)"
      />
    </g>
  </svg>
);

export const CloseBlack = (
  <svg viewBox="0 0 24 24">
    <defs />
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
    >
      <g id="Icon/Close" stroke="#000000">
        <path
          d="M2.25937312,2.25937312 L21.7139306,21.7139306"
          id="CloseBlackLine"
        />
        <path
          d="M21.8116947,2.3571372 L2.3571372,21.8116947 L21.8116947,2.3571372 Z"
          id="CloseBlackLineJoinRound"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </svg>
);

export const CloseWithCircle = (
  className = "",
  backgroundFillColor = "#DBDAE1",
  xFillColor = "#FFF"
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23 23"
    className={className}
  >
    <g fill="none" fillRule="nonzero" transform="translate(-5 -5)">
      <path
        fill={backgroundFillColor}
        d="M8.721 24.278c-4.295-4.296-4.295-11.26 0-15.556 4.297-4.296 11.261-4.296 15.557 0 4.296 4.295 4.296 11.26 0 15.557-4.296 4.295-11.26 4.295-15.557-.001z"
      />
      <rect
        width="1"
        height="13"
        x="16"
        y="10"
        fill={xFillColor}
        rx=".5"
        transform="rotate(135 16.5 16.5)"
      />
      <rect
        width="1"
        height="13"
        x="16"
        y="10"
        fill={xFillColor}
        rx=".5"
        transform="rotate(-135 16.5 16.5)"
      />
    </g>
  </svg>
);

export const ChevronFlipIcon = (className = "", fillColor = "#A7A2B2") => (
  <svg className={className} viewBox="0 0 16 16">
    <g
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g stroke={fillColor}>
        <polyline
          transform="translate(8.156854, 11.156854) scale(1, -1) rotate(-225.000000) translate(-8.156854, -11.156854) "
          points="3.65685425 6.65685425 12.6568542 6.65685425 12.6568542 15.6568542"
        />
      </g>
    </g>
  </svg>
);

export const ChevronFlipFilledIcon = (className = "", fillColor = "#FFF") => (
  <svg
    className={className}
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 1L5 5L1 1"
      stroke={fillColor}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Alerts = unseenCount => (
  <svg width="34" height="24" viewBox="0 0 34 24">
    <defs />
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Icon/Alert">
        <g
          id="Page-1"
          transform="translate(4.000000, 1.000000)"
          stroke="#FFFFFF"
          strokeWidth="0"
        >
          <path
            d="M7.9209 2.57172V1.94672C7.9209 1.12172 8.5959 0.446716 9.4209 0.446716C10.2459 0.446716 10.9209 1.12172 10.9209 1.94672V2.54672"
            stroke="#FFFFFF"
            strokeWidth="0.894"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.4209 20.4472C11.4209 21.5512 10.5249 22.4472 9.4209 22.4472C8.3169 22.4472 7.4209 21.5512 7.4209 20.4472"
            fill="#FFFFFF"
          />
          <path
            d="M11.4209 20.4472C11.4209 21.5512 10.5249 22.4472 9.4209 22.4472C8.3169 22.4472 7.4209 21.5512 7.4209 20.4472C7.4209 20.4472 8.63985 20.4472 9.4209 20.4472C10.2019 20.4472 11.4209 20.4472 11.4209 20.4472Z"
            stroke="#FFFFFF"
            strokeWidth="0.894"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.3387 17.4493C16.5787 14.4473 15.2627 11.4473 15.4207 8.44727C15.5787 5.44727 12.7347 2.44727 9.42066 2.44727C6.10666 2.44727 3.24666 5.13827 3.42066 8.44727C3.57866 11.4473 2.57866 14.4473 0.578663 17.4473C-1.42134 20.4473 20.0987 20.4503 18.3387 17.4493Z"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="0.894"
          />
        </g>
        {!!unseenCount && (
          <g
            id="Group-14"
            transform="translate(13.000000, 2.000000)"
            textAnchor="middle"
          >
            <rect
              id="Oval"
              x="0.5"
              y="0.5"
              width="21"
              height="13"
              rx="6.5"
              fill="#FD6266"
              stroke="#211A32"
            />
            <text
              id="1"
              fontFamily="roboto-Bold, roboto"
              fontSize="8"
              fontWeight="bold"
              fill="#FFFFFF"
            >
              <tspan x="11.01902362" y="10.0428031">
                {unseenCount}
              </tspan>
            </text>
          </g>
        )}
      </g>
    </g>
  </svg>
);

export const AlertCircle = (Styling, fill = "#FFFFFF") => (
  <svg viewBox="0 0 24 24" className={Styling}>
    <defs />
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Group-14" transform="translate(1.000000, 2.000000)">
        <ellipse
          id="Oval"
          fill={fill}
          cx="6.4591451"
          cy="7.00261291"
          rx="6.4591451"
          ry="6.43043779"
        />
      </g>
    </g>
  </svg>
);

export const ChevronUp = () => (
  <svg viewBox="0 0 16 16">
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g id="Icon/Dropdown" stroke="#A7A2B2">
        <polyline
          id="Stroke-3"
          transform="translate(8.156854, 11.156854) scale(1, -1) rotate(-225.000000) translate(-8.156854, -11.156854) "
          points="3.65685425 6.65685425 12.6568542 6.65685425 12.6568542 15.6568542"
        />
      </g>
    </g>
  </svg>
);

export const ChevronLeft = (
  <svg viewBox="0 0 16 16">
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g id="Icon/chevron-left" stroke="#231A3A">
        <polyline
          id="Stroke-3"
          transform="translate(11.156854, 7.863961) rotate(-135.000000) translate(-11.156854, -7.863961) "
          points="6.65685425 3.36396103 15.6568542 3.36396103 15.6568542 12.363961"
        />
      </g>
    </g>
  </svg>
);
export const ChevronDown = p => (
  <svg viewBox="0 0 16 16">
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g id="Icon/Dropdown-Down" stroke={p.stroke || "#A7A2B2"}>
        <polyline
          id="Stroke-3"
          transform="translate(8.156854, 6.156854) rotate(-225.000000) translate(-8.156854, -6.156854) "
          points="3.65685425 1.65685425 12.6568542 1.65685425 12.6568542 10.6568542"
        />
      </g>
    </g>
  </svg>
);

export const AugurLoadingLogo = (
  <svg viewBox="50 50 205 205">
    <path
      className="outer-lines"
      d="M66.3 199.1L152.8 55M152.8 251l-86.5-51.9M239.7 199.1L152.8 251M152.8 55l86.9 144.1"
    />
    <path
      className="inner-bottom-line"
      d="M152.8 250.5l.3-33.8c0-6.3 3.4-12.1 9-15.2l5.6-2.8c6-3 11.1-7.7 14.5-13.6l2.2-3.7"
    />
    <path
      className="inner-lines"
      d="M158.1 135.2s13.6 3.1 20.2 11c11.3 13.5 6.3 25.5 13.7 30.7 8.5 6 46.4 22.2 46.4 22.2m-118.7-30.8s.2-9.8 5.9-18.5c6.9-10.5 18-12.4 23.5-17.8 4.5-4.4 4-13 4-13l-.3-62.5m-4 144.5s-7.8-1-13.4-4.7c-7.3-4.9-12.5-15.1-17.6-17.1-5.5-2.1-11.4 1-11.4 1L66.3 199"
    />
    <path
      className="mask"
      d="M183.1 170.7s2.5 9 7.5 12.8c5 3.8-1.9 6.4-8.1.9s.6-13.7.6-13.7zm-22.2-33.9c4.5-6.9.9-13.4-2.1-7.8-3 5.5-11.5 9.4-11.5 9.4s9.1 5.4 13.6-1.6zm-41.5 29.4c-8.1-1.8-12.8 3.9-6.6 4.7s12.9 7.4 12.9 7.4 1.8-10.3-6.3-12.1zm34.6 36.4c3.3-7.5-1.3-13.3-3.4-7.4-2.1 6-9.8 11.2-9.8 11.2s9.9 3.8 13.2-3.8z"
    />
  </svg>
);

export const AppleAppStore = () => (
  <svg width="129px" height="41px" viewBox="0 0 129 40">
    <g
      id="Log-In-Modal"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="Login-Modal-Button"
        transform="translate(-170.000000, -319.000000)"
        fillRule="nonzero"
      >
        <g id="app-store-badge" transform="translate(170.000000, 319.000000)">
          <path
            d="M124.2,40 L4.2,40 C2,40 0.2,38.2 0.2,36 L0.2,4 C0.2,1.8 2,0 4.2,0 L124.2,0 C126.4,0 128.2,1.8 128.2,4 L128.2,36 C128.2,38.2 126.4,40 124.2,40 Z"
            id="AppleAppStoreShape1"
            fill="#000000"
          />
          <path
            d="M27.2,19.8 C27.2,16.7 29.8,15.2 29.9,15.1 C28.4,13 26.2,12.7 25.4,12.6 C23.5,12.4 21.6,13.7 20.7,13.7 C19.7,13.7 18.2,12.6 16.6,12.6 C14.5,12.6 12.6,13.8 11.5,15.7 C9.3,19.5 10.9,25.1 13,28.2 C14.1,29.7 15.3,31.4 16.9,31.3 C18.5,31.2 19.1,30.3 21,30.3 C22.9,30.3 23.4,31.3 25.1,31.3 C26.8,31.3 27.9,29.8 28.9,28.3 C30.1,26.6 30.6,24.9 30.6,24.8 C30.5,24.7 27.2,23.5 27.2,19.8 Z"
            id="AppleAppStoreShape2"
            fill="#FFFFFF"
          />
          <path
            d="M24.1,10.6 C24.9,9.5 25.5,8.1 25.4,6.6 C24.2,6.7 22.6,7.4 21.8,8.5 C21,9.4 20.3,10.9 20.5,12.3 C21.8,12.4 23.2,11.6 24.1,10.6 Z"
            id="AppleAppStoreShape3"
            fill="#FFFFFF"
          />
          <path
            d="M50,31.1 L47.8,31.1 L46.6,27.3 L42.4,27.3 L41.3,31.1 L39.2,31.1 L43.4,18.2 L46,18.2 L50,31.1 Z M46.2,25.7 L45.1,22.3 C45,22 44.8,21.1 44.4,19.9 L44.4,19.9 C44.3,20.4 44.1,21.3 43.8,22.3 L42.7,25.7 L46.2,25.7 Z"
            id="AppleAppStoreShape4"
            fill="#FFFFFF"
          />
          <path
            d="M60.7,26.4 C60.7,28 60.3,29.2 59.4,30.2 C58.6,31 57.7,31.4 56.5,31.4 C55.3,31.4 54.4,31 53.9,30.1 L53.9,30.1 L53.9,35 L51.8,35 L51.8,25 C51.8,24 51.8,23 51.7,21.9 L53.5,21.9 L53.6,23.4 L53.6,23.4 C54.3,22.3 55.3,21.7 56.7,21.7 C57.8,21.7 58.7,22.1 59.4,23 C60.3,23.8 60.7,24.9 60.7,26.4 Z M58.6,26.4 C58.6,25.5 58.4,24.7 58,24.2 C57.6,23.6 57,23.3 56.2,23.3 C55.7,23.3 55.2,23.5 54.8,23.8 C54.4,24.1 54.1,24.6 54,25.1 C53.9,25.4 53.9,25.6 53.9,25.7 L53.9,27.3 C53.9,28 54.1,28.5 54.5,29 C54.9,29.5 55.5,29.7 56.1,29.7 C56.9,29.7 57.5,29.4 57.9,28.8 C58.4,28.2 58.6,27.4 58.6,26.4 Z"
            id="AppleAppStoreShape5"
            fill="#FFFFFF"
          />
          <path
            d="M71.4,26.4 C71.4,28 71,29.2 70.1,30.2 C69.3,31 68.4,31.4 67.2,31.4 C66,31.4 65.1,31 64.6,30.1 L64.6,30.1 L64.6,35 L62.5,35 L62.5,25 C62.5,24 62.5,23 62.4,21.9 L64.2,21.9 L64.3,23.4 L64.3,23.4 C65,22.3 66,21.7 67.4,21.7 C68.5,21.7 69.4,22.1 70.1,23 C71,23.8 71.4,24.9 71.4,26.4 Z M69.3,26.4 C69.3,25.5 69.1,24.7 68.7,24.2 C68.3,23.6 67.7,23.3 66.9,23.3 C66.4,23.3 65.9,23.5 65.5,23.8 C65.1,24.1 64.8,24.6 64.7,25.1 C64.6,25.4 64.6,25.6 64.6,25.7 L64.6,27.3 C64.6,28 64.8,28.5 65.2,29 C65.6,29.5 66.2,29.7 66.8,29.7 C67.6,29.7 68.2,29.4 68.6,28.8 C69.1,28.2 69.3,27.4 69.3,26.4 Z"
            id="AppleAppStoreShape6"
            fill="#FFFFFF"
          />
          <path
            d="M83.4,27.5 C83.4,28.6 83,29.5 82.3,30.2 C81.5,31 80.3,31.3 78.8,31.3 C77.4,31.3 76.3,31 75.5,30.5 L76,28.8 C76.9,29.3 77.9,29.6 79,29.6 C79.8,29.6 80.4,29.4 80.8,29.1 C81.2,28.7 81.4,28.3 81.4,27.7 C81.4,27.2 81.2,26.7 80.9,26.4 C80.5,26 79.9,25.7 79.1,25.4 C76.8,24.6 75.7,23.3 75.7,21.7 C75.7,20.6 76.1,19.8 76.9,19.1 C77.7,18.4 78.7,18.1 80.1,18.1 C81.3,18.1 82.2,18.3 83,18.7 L82.5,20.4 C81.8,20 81,19.8 80,19.8 C79.3,19.8 78.7,20 78.3,20.3 C78,20.6 77.8,21 77.8,21.5 C77.8,22 78,22.4 78.4,22.8 C78.7,23.1 79.4,23.4 80.3,23.8 C81.4,24.2 82.2,24.8 82.8,25.4 C83.1,25.9 83.4,26.6 83.4,27.5 Z"
            id="AppleAppStoreShape7"
            fill="#FFFFFF"
          />
          <path
            d="M90.2,23.4 L87.9,23.4 L87.9,27.9 C87.9,29 88.3,29.6 89.1,29.6 C89.5,29.6 89.8,29.6 90,29.5 L90.1,31.1 C89.7,31.3 89.2,31.3 88.5,31.3 C87.7,31.3 87,31.1 86.6,30.6 C86.1,30.1 85.9,29.3 85.9,28.1 L85.9,23.4 L84.5,23.4 L84.5,21.8 L85.9,21.8 L85.9,20.1 L87.9,19.5 L87.9,21.8 L90.2,21.8 L90.2,23.4 Z"
            id="AppleAppStoreShape8"
            fill="#FFFFFF"
          />
          <path
            d="M100.5,26.4 C100.5,27.8 100.1,29 99.3,29.9 C98.4,30.8 97.3,31.3 95.9,31.3 C94.5,31.3 93.4,30.8 92.6,29.9 C91.8,29 91.4,27.9 91.4,26.5 C91.4,25.1 91.8,23.9 92.7,23 C93.5,22.1 94.7,21.6 96.1,21.6 C97.5,21.6 98.6,22.1 99.4,23 C100.1,23.9 100.5,25 100.5,26.4 Z M98.3,26.5 C98.3,25.6 98.1,24.9 97.7,24.3 C97.3,23.6 96.6,23.2 95.8,23.2 C95,23.2 94.3,23.6 93.9,24.3 C93.5,24.9 93.3,25.7 93.3,26.5 C93.3,27.4 93.5,28.1 93.9,28.7 C94.3,29.4 95,29.8 95.8,29.8 C96.6,29.8 97.2,29.4 97.7,28.7 C98.1,28.1 98.3,27.3 98.3,26.5 Z"
            id="AppleAppStoreShape9"
            fill="#FFFFFF"
          />
          <path
            d="M107.2,23.6 C107,23.6 106.8,23.5 106.5,23.5 C105.8,23.5 105.2,23.8 104.8,24.3 C104.5,24.8 104.3,25.4 104.3,26.1 L104.3,31 L102.2,31 L102.2,24.6 C102.2,23.5 102.2,22.6 102.1,21.7 L103.9,21.7 L104,23.5 L104.1,23.5 C104.3,22.9 104.7,22.4 105.1,22 C105.6,21.7 106.1,21.5 106.6,21.5 C106.8,21.5 107,21.5 107.1,21.5 L107.1,23.6 L107.2,23.6 Z"
            id="AppleAppStoreShape10"
            fill="#FFFFFF"
          />
          <path
            d="M116.4,26 C116.4,26.4 116.4,26.7 116.3,26.9 L110.1,26.9 C110.1,27.8 110.4,28.5 111,29 C111.5,29.4 112.2,29.7 113,29.7 C113.9,29.7 114.8,29.6 115.5,29.3 L115.8,30.7 C114.9,31.1 113.9,31.3 112.7,31.3 C111.3,31.3 110.1,30.9 109.3,30 C108.5,29.2 108.1,28 108.1,26.6 C108.1,25.2 108.5,24 109.2,23.1 C110,22.1 111.1,21.6 112.5,21.6 C113.8,21.6 114.9,22.1 115.5,23.1 C116.2,23.9 116.4,24.9 116.4,26 Z M114.5,25.5 C114.5,24.9 114.4,24.4 114.1,23.9 C113.7,23.3 113.2,23 112.5,23 C111.8,23 111.3,23.3 110.9,23.8 C110.6,24.2 110.4,24.8 110.3,25.4 L114.5,25.4 L114.5,25.5 Z"
            id="AppleAppStoreShape11"
            fill="#FFFFFF"
          />
          <path
            d="M45.6,10.3 C45.6,11.4 45.3,12.3 44.6,12.9 C44,13.4 43.1,13.7 41.9,13.7 C41.3,13.7 40.8,13.7 40.4,13.6 L40.4,7.4 C40.9,7.3 41.5,7.3 42.2,7.3 C43.3,7.3 44.1,7.5 44.7,8 C45.2,8.5 45.6,9.3 45.6,10.3 Z M44.5,10.3 C44.5,9.6 44.3,9 43.9,8.6 C43.5,8.2 42.9,8 42.2,8 C41.9,8 41.6,8 41.4,8.1 L41.4,12.8 C41.5,12.8 41.8,12.8 42.1,12.8 C42.9,12.8 43.5,12.6 43.9,12.2 C44.3,11.8 44.5,11.1 44.5,10.3 Z"
            id="AppleAppStoreShape12"
            fill="#FFFFFF"
          />
          <path
            d="M51.2,11.3 C51.2,12 51,12.6 50.6,13 C50.2,13.5 49.6,13.7 48.9,13.7 C48.2,13.7 47.7,13.5 47.3,13 C46.9,12.6 46.7,12 46.7,11.3 C46.7,10.6 46.9,10 47.3,9.6 C47.7,9.1 48.3,8.9 49,8.9 C49.7,8.9 50.2,9.1 50.6,9.6 C51,10 51.2,10.6 51.2,11.3 Z M50.2,11.3 C50.2,10.9 50.1,10.5 49.9,10.2 C49.7,9.8 49.4,9.7 49,9.7 C48.6,9.7 48.3,9.9 48.1,10.2 C47.9,10.5 47.8,10.9 47.8,11.3 C47.8,11.7 47.9,12.1 48.1,12.4 C48.3,12.8 48.6,12.9 49,12.9 C49.4,12.9 49.7,12.7 49.9,12.3 C50.1,12.1 50.2,11.7 50.2,11.3 Z"
            id="AppleAppStoreShape13"
            fill="#FFFFFF"
          />
          <path
            d="M58.9,9 L57.5,13.6 L56.6,13.6 L56,11.6 C55.8,11.1 55.7,10.6 55.6,10.1 L55.6,10.1 C55.5,10.6 55.4,11.1 55.2,11.6 L54.6,13.6 L53.7,13.6 L52.2,9 L53.2,9 L53.7,11.2 C53.8,11.7 53.9,12.2 54,12.7 L54,12.7 C54.1,12.3 54.2,11.8 54.4,11.2 L55,9 L55.8,9 L56.4,11.1 C56.6,11.6 56.7,12.1 56.8,12.6 L56.8,12.6 C56.9,12.1 57,11.6 57.1,11.1 L57.7,9 L58.9,9 Z"
            id="AppleAppStoreShape14"
            fill="#FFFFFF"
          />
          <path
            d="M64.1,13.6 L63.1,13.6 L63.1,11 C63.1,10.2 62.8,9.8 62.2,9.8 C61.9,9.8 61.7,9.9 61.5,10.1 C61.3,10.3 61.2,10.6 61.2,10.9 L61.2,13.6 L60.2,13.6 L60.2,10.3 C60.2,9.9 60.2,9.5 60.2,9 L61.1,9 L61.1,9.7 L61.1,9.7 C61.2,9.5 61.4,9.3 61.6,9.1 C61.9,8.9 62.2,8.8 62.5,8.8 C62.9,8.8 63.3,8.9 63.6,9.2 C64,9.5 64.1,10 64.1,10.7 L64.1,13.6 Z"
            id="AppleAppStoreShape15"
            fill="#FFFFFF"
          />
          <polygon
            id="AppleAppStoreShape16"
            fill="#FFFFFF"
            points="66.9 13.6 65.9 13.6 65.9 6.9 66.9 6.9"
          />
          <path
            d="M72.9,11.3 C72.9,12 72.7,12.6 72.3,13 C71.9,13.5 71.3,13.7 70.6,13.7 C69.9,13.7 69.4,13.5 69,13 C68.6,12.6 68.4,12 68.4,11.3 C68.4,10.6 68.6,10 69,9.6 C69.4,9.2 70,8.9 70.7,8.9 C71.4,8.9 71.9,9.1 72.3,9.6 C72.7,10 72.9,10.6 72.9,11.3 Z M71.9,11.3 C71.9,10.9 71.8,10.5 71.6,10.2 C71.4,9.8 71.1,9.7 70.7,9.7 C70.3,9.7 70,9.9 69.8,10.2 C69.6,10.5 69.5,10.9 69.5,11.3 C69.5,11.7 69.6,12.1 69.8,12.4 C70,12.8 70.3,12.9 70.7,12.9 C71.1,12.9 71.4,12.7 71.6,12.3 C71.8,12.1 71.9,11.7 71.9,11.3 Z"
            id="AppleAppStoreShape17"
            fill="#FFFFFF"
          />
          <path
            d="M77.8,13.6 L76.9,13.6 L76.8,13.1 L76.8,13.1 C76.5,13.5 76,13.7 75.5,13.7 C75.1,13.7 74.7,13.6 74.5,13.3 C74.3,13 74.1,12.7 74.1,12.4 C74.1,11.8 74.3,11.4 74.8,11.1 C75.3,10.8 75.9,10.7 76.8,10.7 L76.8,10.6 C76.8,10 76.5,9.7 75.9,9.7 C75.4,9.7 75.1,9.8 74.7,10 L74.5,9.3 C74.9,9 75.4,8.9 76.1,8.9 C77.3,8.9 77.9,9.5 77.9,10.8 L77.9,12.5 C77.8,13 77.8,13.3 77.8,13.6 Z M76.8,12 L76.8,11.3 C75.7,11.3 75.1,11.6 75.1,12.2 C75.1,12.4 75.2,12.6 75.3,12.7 C75.4,12.8 75.6,12.9 75.8,12.9 C76,12.9 76.2,12.8 76.4,12.7 C76.6,12.6 76.7,12.4 76.8,12.2 C76.8,12.2 76.8,12.1 76.8,12 Z"
            id="AppleAppStoreShape18"
            fill="#FFFFFF"
          />
          <path
            d="M83.6,13.6 L82.7,13.6 L82.7,12.9 L82.7,12.9 C82.4,13.5 81.9,13.7 81.2,13.7 C80.6,13.7 80.2,13.5 79.8,13.1 C79.4,12.7 79.3,12.1 79.3,11.4 C79.3,10.7 79.5,10.1 79.9,9.6 C80.3,9.2 80.8,9 81.3,9 C81.9,9 82.3,9.2 82.6,9.6 L82.6,9.6 L82.6,7 L83.6,7 L83.6,12.4 C83.6,12.8 83.6,13.2 83.6,13.6 Z M82.6,11.7 L82.6,10.9 C82.6,10.8 82.6,10.7 82.6,10.6 C82.5,10.4 82.4,10.2 82.2,10 C82,9.8 81.8,9.8 81.5,9.8 C81.1,9.8 80.8,10 80.6,10.3 C80.4,10.6 80.3,11 80.3,11.5 C80.3,12 80.4,12.3 80.6,12.6 C80.8,12.9 81.1,13.1 81.5,13.1 C81.8,13.1 82.1,13 82.3,12.7 C82.5,12.3 82.6,12 82.6,11.7 Z"
            id="AppleAppStoreShape19"
            fill="#FFFFFF"
          />
          <path
            d="M92.3,11.3 C92.3,12 92.1,12.6 91.7,13 C91.3,13.5 90.7,13.7 90,13.7 C89.3,13.7 88.8,13.5 88.4,13 C88,12.6 87.8,12 87.8,11.3 C87.8,10.6 88,10 88.4,9.6 C88.8,9.1 89.4,8.9 90.1,8.9 C90.8,8.9 91.3,9.1 91.7,9.6 C92.1,10 92.3,10.6 92.3,11.3 Z M91.2,11.3 C91.2,10.9 91.1,10.5 90.9,10.2 C90.7,9.8 90.4,9.7 90,9.7 C89.6,9.7 89.3,9.9 89.1,10.2 C88.9,10.5 88.8,10.9 88.8,11.3 C88.8,11.7 88.9,12.1 89.1,12.4 C89.3,12.8 89.6,12.9 90,12.9 C90.4,12.9 90.7,12.7 90.9,12.3 C91.1,12.1 91.2,11.7 91.2,11.3 Z"
            id="AppleAppStoreShape20"
            fill="#FFFFFF"
          />
          <path
            d="M97.8,13.6 L96.8,13.6 L96.8,11 C96.8,10.2 96.5,9.8 95.9,9.8 C95.6,9.8 95.4,9.9 95.2,10.1 C95,10.3 94.9,10.6 94.9,10.9 L94.9,13.6 L93.9,13.6 L93.9,10.3 C93.9,9.9 93.9,9.5 93.9,9 L94.8,9 L94.8,9.7 L94.8,9.7 C94.9,9.5 95.1,9.3 95.3,9.1 C95.6,8.9 95.9,8.8 96.2,8.8 C96.6,8.8 97,8.9 97.3,9.2 C97.7,9.5 97.8,10 97.8,10.7 L97.8,13.6 Z"
            id="AppleAppStoreShape21"
            fill="#FFFFFF"
          />
          <path
            d="M104.6,9.8 L103.5,9.8 L103.5,12 C103.5,12.6 103.7,12.8 104.1,12.8 C104.3,12.8 104.4,12.8 104.6,12.8 L104.6,13.6 C104.4,13.7 104.1,13.7 103.8,13.7 C103.4,13.7 103.1,13.6 102.9,13.3 C102.7,13.1 102.6,12.6 102.6,12.1 L102.6,9.8 L101.9,9.8 L101.9,9 L102.6,9 L102.6,8.2 L103.6,7.9 L103.6,9 L104.7,9 L104.7,9.8 L104.6,9.8 Z"
            id="AppleAppStoreShape22"
            fill="#FFFFFF"
          />
          <path
            d="M110,13.6 L109,13.6 L109,11 C109,10.2 108.7,9.8 108.1,9.8 C107.6,9.8 107.3,10 107.1,10.5 C107.1,10.6 107.1,10.7 107.1,10.9 L107.1,13.6 L106.1,13.6 L106.1,6.9 L107.1,6.9 L107.1,9.7 L107.1,9.7 C107.4,9.2 107.9,8.9 108.5,8.9 C108.9,8.9 109.3,9 109.5,9.3 C109.8,9.6 110,10.2 110,10.8 L110,13.6 Z"
            id="AppleAppStoreShape23"
            fill="#FFFFFF"
          />
          <path
            d="M115.5,11.1 C115.5,11.3 115.5,11.4 115.5,11.6 L112.5,11.6 C112.5,12.1 112.7,12.4 112.9,12.6 C113.2,12.8 113.5,12.9 113.9,12.9 C114.4,12.9 114.8,12.8 115.1,12.7 L115.3,13.4 C114.9,13.6 114.4,13.7 113.8,13.7 C113.1,13.7 112.5,13.5 112.1,13.1 C111.7,12.7 111.5,12.1 111.5,11.4 C111.5,10.7 111.7,10.1 112.1,9.7 C112.5,9.2 113,9 113.7,9 C114.4,9 114.9,9.2 115.2,9.7 C115.4,10 115.5,10.5 115.5,11.1 Z M114.6,10.8 C114.6,10.5 114.5,10.2 114.4,10 C114.2,9.7 114,9.6 113.6,9.6 C113.3,9.6 113,9.7 112.8,10 C112.6,10.2 112.5,10.5 112.5,10.8 L114.6,10.8 Z"
            id="AppleAppStoreShape24"
            fill="#FFFFFF"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const GooglePlayStore = () => (
  <svg width="129px" height="41px" viewBox="0 0 129 41">
    <defs>
      <linearGradient
        x1="29.5315068%"
        y1="-6.0957265%"
        x2="55.0940639%"
        y2="92.1559829%"
        id="linearGradient-1"
      >
        <stop stopColor="#006884" offset="0%" />
        <stop stopColor="#8AD1D0" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="-7.52792208%"
        y1="15.7589744%"
        x2="91.537013%"
        y2="86.2504274%"
        id="linearGradient-2"
      >
        <stop stopColor="#24BBB6" offset="0%" />
        <stop stopColor="#DBE692" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="49.9404255%"
        y1="105.754795%"
        x2="49.9404255%"
        y2="-3.12739726%"
        id="linearGradient-3"
      >
        <stop stopColor="#FCC072" offset="0%" />
        <stop stopColor="#F58A5B" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="11.1493421%"
        y1="117.837069%"
        x2="90.4368421%"
        y2="12.1025862%"
        id="linearGradient-4"
      >
        <stop stopColor="#712B8F" offset="0%" />
        <stop stopColor="#EA1D27" offset="100%" />
      </linearGradient>
    </defs>
    <g
      id="Log-In-Modal"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="Login-Modal-Button"
        transform="translate(-308.000000, -318.000000)"
      >
        <g id="google-play-badge" transform="translate(308.000000, 318.000000)">
          <path
            d="M124.5,40.5 L4.5,40.5 C2.3,40.5 0.5,38.7 0.5,36.5 L0.5,4.5 C0.5,2.3 2.3,0.5 4.5,0.5 L124.5,0.5 C126.7,0.5 128.5,2.3 128.5,4.5 L128.5,36.5 C128.5,38.7 126.7,40.5 124.5,40.5 Z"
            id="GooglePlayStoreShape1"
            fill="#000000"
            fillRule="nonzero"
          />
          <path
            d="M10.3,20.1 L10.3,9.6 C10.3,9 10.8,8.5 11.3,8.5 C11.8,8.5 12,8.6 12.3,8.8 L31.6,19.4 C32,19.6 32.2,19.9 32.2,20.2 C32.2,20.5 32,20.8 31.6,21 L12.3,31.6 C12.1,31.7 11.8,31.9 11.3,31.9 C10.8,31.9 10.3,31.4 10.3,30.8 L10.3,20.1 Z"
            id="GooglePlayStoreShape2"
            fill="url(#linearGradient-1)"
          />
          <path
            d="M22.8,20.2 L11.1,8.5 C11.2,8.5 11.2,8.5 11.3,8.5 C11.8,8.5 12,8.6 12.3,8.8 L26.5,16.6 L22.8,20.2 Z"
            id="GooglePlayStoreShape3"
            fill="url(#linearGradient-2)"
          />
          <path
            d="M26.4,23.7 L22.8,20.1 L26.5,16.4 L31.6,19.2 C32,19.4 32.2,19.7 32.2,20 C32.2,20.3 32,20.6 31.6,20.8 L26.4,23.7 Z"
            id="GooglePlayStoreShape4"
            fill="url(#linearGradient-3)"
          />
          <path
            d="M11.2,31.7 L11.2,31.7 L22.8,20.1 L26.4,23.7 L12.3,31.4 C12,31.6 11.8,31.7 11.2,31.7 C11.3,31.7 11.3,31.7 11.2,31.7 Z"
            id="GooglePlayStoreShape5"
            fill="url(#linearGradient-4)"
          />
          <path
            d="M71.6,34.4 C71.1,34 70.7,33.3 70.5,32.9 L72.1,32.2 C72.2,32.4 72.4,32.7 72.6,33 C73,33.4 73.6,33.8 74.2,33.8 C74.8,33.8 75.5,33.5 75.9,33 C76.2,32.5 76.4,32 76.4,31.3 L76.4,30.7 C75.2,32.2 72.7,32 71.3,30.4 C69.8,28.8 69.8,26.1 71.3,24.5 C72.8,23 75,22.8 76.3,24.2 C76.3,24.2 76.3,24.2 76.3,24.2 L76.3,23.5 L78,23.5 L78,31 C78,32.9 77.3,34 76.4,34.7 C75.8,35.2 74.9,35.4 74.1,35.4 C73.2,35.3 72.3,35 71.6,34.4 L71.6,34.4 Z M113.5,34.8 L113.5,34.8 L115.2,30.8 L112.2,23.9 L113.9,23.9 L116,28.8 L118.1,23.9 L119.8,23.9 L115.2,34.8 L113.5,34.8 L113.5,34.8 Z M105.4,31 L105.4,31 C104.9,30.5 104.7,29.8 104.7,29.1 C104.7,28.5 104.9,27.9 105.3,27.5 C106,26.8 107,26.5 108.1,26.5 C108.8,26.5 109.4,26.6 109.9,26.9 C109.9,25.7 108.9,25.2 108.1,25.2 C107.4,25.2 106.7,25.6 106.4,26.3 L104.9,25.7 C105.2,25 106,23.7 108,23.7 C109,23.7 110,24 110.6,24.7 C111.2,25.4 111.4,26.2 111.4,27.3 L111.4,31.5 L109.7,31.5 L109.7,30.8 C109.5,31.1 109.1,31.3 108.8,31.5 C108.4,31.7 107.9,31.8 107.4,31.8 C106.8,31.7 105.9,31.5 105.4,31 L105.4,31 Z M52.1,27.4 L52.1,27.4 C52.1,25.4 53.6,23.2 56.3,23.2 C58.9,23.2 60.5,25.4 60.5,27.4 C60.5,29.4 59,31.6 56.3,31.6 C53.6,31.6 52.1,29.4 52.1,27.4 L52.1,27.4 Z M61.1,27.4 L61.1,27.4 C61.1,25.4 62.6,23.2 65.3,23.2 C67.9,23.2 69.5,25.4 69.5,27.4 C69.5,29.4 68,31.6 65.3,31.6 C62.7,31.6 61.1,29.4 61.1,27.4 L61.1,27.4 Z M40.8,29.6 L40.8,29.6 C38.3,27.1 38.4,23 40.9,20.4 C42.2,19.1 43.8,18.5 45.5,18.5 C47.1,18.5 48.7,19.1 49.9,20.3 L48.7,21.6 C46.9,19.8 44,19.9 42.3,21.7 C40.5,23.6 40.5,26.5 42.3,28.4 C44.1,30.3 47.1,30.4 48.9,28.5 C49.5,27.9 49.7,27.1 49.8,26.3 L45.6,26.3 L45.6,24.5 L51.5,24.5 C51.6,24.9 51.6,25.4 51.6,25.9 C51.6,27.4 51,28.9 50,29.9 C48.9,31 47.3,31.6 45.7,31.6 C43.9,31.5 42.1,30.9 40.8,29.6 L40.8,29.6 Z M83.1,30.3 L83.1,30.3 C81.6,28.7 81.6,26 83.1,24.3 C84.6,22.7 87.1,22.7 88.5,24.3 C89,24.8 89.3,25.5 89.6,26.2 L84.1,28.5 C84.4,29.2 85.1,29.8 86.1,29.8 C87,29.8 87.6,29.5 88.2,28.6 L89.7,29.6 L89.7,29.6 C89.5,29.8 89.3,30 89.2,30.2 C87.5,31.9 84.6,31.9 83.1,30.3 L83.1,30.3 Z M93.5,31.5 L93.5,31.5 L93.5,20.4 L97.1,20.4 C99.2,20.4 100.9,21.9 100.9,23.7 C100.9,25.5 99.4,27 97.5,27 L95.3,27 L95.3,31.4 L93.5,31.4 L93.5,31.5 Z M101.9,31.5 L101.9,31.5 L101.9,20.4 L103.6,20.4 L103.6,31.5 L101.9,31.5 L101.9,31.5 Z M79.3,31.3 L79.3,31.3 L79.3,18.9 L81.1,18.9 L81.1,31.3 L79.3,31.3 L79.3,31.3 Z M109.8,28.2 L109.8,28.2 C109.4,27.9 108.8,27.8 108.2,27.8 C107,27.8 106.3,28.4 106.3,29.1 C106.3,29.8 107,30.2 107.7,30.2 C108.7,30.2 109.8,29.4 109.8,28.2 L109.8,28.2 Z M58.6,27.4 L58.6,27.4 C58.6,26.2 57.8,24.9 56.3,24.9 C54.8,24.9 54,26.2 54,27.4 C54,28.6 54.8,29.9 56.3,29.9 C57.7,29.9 58.6,28.6 58.6,27.4 L58.6,27.4 Z M67.6,27.4 L67.6,27.4 C67.6,26.2 66.8,24.9 65.3,24.9 C63.8,24.9 63,26.2 63,27.4 C63,28.6 63.8,29.9 65.3,29.9 C66.8,29.9 67.6,28.6 67.6,27.4 L67.6,27.4 Z M76.5,28.1 L76.5,28.1 C76.5,28 76.5,27.9 76.6,27.8 C76.6,27.8 76.6,27.8 76.6,27.8 C76.6,27.7 76.6,27.5 76.6,27.4 C76.6,27.3 76.6,27.1 76.6,27 C76.6,27 76.6,26.9 76.6,26.9 C76.6,26.8 76.5,26.6 76.5,26.5 C76.2,25.5 75.3,24.8 74.4,24.8 C73.2,24.8 72.2,26 72.2,27.3 C72.2,28.7 73.2,29.8 74.5,29.8 C75.3,29.9 76.1,29.2 76.5,28.1 L76.5,28.1 Z M83.8,27.2 L83.8,27.2 L87.5,25.6 C87.1,24.9 86.5,24.7 86,24.7 C84.5,24.8 83.6,26.4 83.8,27.2 L83.8,27.2 Z M99.1,23.8 L99.1,23.8 C99.1,22.8 98.3,22.1 97.2,22.1 L95.2,22.1 L95.2,25.6 L97.3,25.6 C98.3,25.6 99.1,24.8 99.1,23.8 Z"
            id="GooglePlayStoreShape6"
            fill="#FFFFFF"
          />
          <polygon
            id="GooglePlayStoreShape7"
            fill="#FFFFFF"
            points="114.8 32.8 114.8 32.8 114.7 32.8 114.7 32.8 114.7 32.7 114.7 32.7 114.8 32.7 114.8 32.7 114.7 32.7 114.7 32.7 114.7 32.8 114.7 32.8"
          />
          <path
            d="M114.8,32.8 L114.8,32.8 C114.8,32.7 114.8,32.7 114.8,32.8 L114.8,32.8 C114.8,32.7 114.8,32.7 114.8,32.8 L114.8,32.8 L114.8,32.8 L114.8,32.8 L114.8,32.8 L114.8,32.8 L114.8,32.8 L114.8,32.8 L114.8,32.8 Z"
            id="GooglePlayStoreShape8"
            fill="#FFFFFF"
          />
          <polygon
            id="GooglePlayStoreShape9"
            fill="#FFFFFF"
            points="114.8 32.8 114.8 32.8 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.8"
          />
          <polygon
            id="GooglePlayStoreShape10"
            fill="#FFFFFF"
            points="114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.8 114.8 32.8 114.8 32.7"
          />
          <polygon
            id="GooglePlayStoreShape11"
            fill="#FFFFFF"
            points="114.8 32.8 114.8 32.8 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.7 114.8 32.8"
          />
          <path
            d="M114.8,32.8 L114.8,32.8 C114.8,32.7 114.8,32.7 114.8,32.8 L114.8,32.8 L114.8,32.8 L114.8,32.8 C114.8,32.8 114.8,32.8 114.8,32.8 L114.8,32.8 Z M114.8,32.8 L114.8,32.8 C114.8,32.8 114.8,32.8 114.8,32.8 L114.8,32.8 L114.8,32.8 L114.8,32.8 C114.8,32.7 114.8,32.7 114.8,32.8 L114.8,32.8 Z"
            id="GooglePlayStoreShape12"
            fill="#FFFFFF"
          />
          <path
            d="M114.9,32.8 L114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 L114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 L114.9,32.8 L114.9,32.8 L114.9,32.8 C114.9,32.8 114.9,32.8 114.9,32.8 L114.9,32.8 Z M114.9,32.8 L114.9,32.8 C114.9,32.8 114.9,32.8 114.9,32.8 L114.9,32.8 L114.9,32.8 L114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 L114.9,32.8 Z"
            id="GooglePlayStoreShape13"
            fill="#FFFFFF"
          />
          <polygon
            id="GooglePlayStoreShape14"
            fill="#FFFFFF"
            points="114.9 32.7 114.9 32.7 114.9 32.7 114.9 32.7 114.9 32.7 114.9 32.7 114.9 32.7 114.9 32.7 114.9 32.8 114.9 32.8"
          />
          <polygon
            id="GooglePlayStoreShape15"
            fill="#FFFFFF"
            points="114.9 32.8 114.9 32.8 114.9 32.7 114.9 32.7 114.9 32.8"
          />
          <path
            d="M114.9,32.8 L114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 L114.9,32.8 C114.9,32.8 114.9,32.8 114.9,32.8 C114.9,32.8 114.9,32.8 114.9,32.8 L114.9,32.8 Z M114.9,32.7 L114.9,32.7 C114.9,32.8 114.9,32.8 114.9,32.7 C114.9,32.8 114.9,32.8 114.9,32.7 L114.9,32.7 C114.9,32.7 114.9,32.7 114.9,32.7 C114.9,32.7 114.9,32.7 114.9,32.7 L114.9,32.7 Z"
            id="GooglePlayStoreShape16"
            fill="#FFFFFF"
          />
          <path
            d="M114.9,32.8 L114.9,32.8 L114.9,32.8 L114.9,32.8 L114.9,32.8 L114.9,32.8 C114.9,32.8 114.9,32.8 114.9,32.8 C114.9,32.8 114.9,32.8 114.9,32.8 L114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 L114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 C114.9,32.7 114.9,32.7 114.9,32.8 L114.9,32.8 C114.9,32.8 114.9,32.8 114.9,32.8 C114.9,32.8 114.9,32.8 114.9,32.8 L114.9,32.8 Z"
            id="GooglePlayStoreShape17"
            fill="#FFFFFF"
          />
          <path
            d="M115,32.8 L115,32.8 C115,32.7 115,32.7 115,32.8 C114.9,32.7 114.9,32.7 115,32.8 L115,32.8 C114.9,32.8 114.9,32.8 115,32.8 C115,32.8 115,32.8 115,32.8 L115,32.8 Z M115,32.7 L115,32.7 C115,32.8 115,32.8 115,32.7 C115,32.8 114.9,32.8 115,32.7 L115,32.7 C114.9,32.7 115,32.7 115,32.7 C115,32.7 115,32.7 115,32.7 L115,32.7 Z"
            id="GooglePlayStoreShape18"
            fill="#FFFFFF"
          />
          <polygon
            id="GooglePlayStoreShape19"
            fill="#FFFFFF"
            points="115 32.8 115 32.7 115 32.7 115 32.7 115 32.7 115 32.7 115 32.8 115 32.8 115 32.7 115 32.7 115 32.8 115 32.8 115 32.7 115 32.7"
          />
          <path
            d="M115,32.8 C115,32.7 115,32.7 115,32.8 C115,32.7 115,32.7 115,32.8 C115,32.7 115,32.7 115,32.8 C115,32.7 115,32.7 115,32.8 L115,32.8 C115,32.7 115,32.7 115,32.8 C115,32.7 115,32.7 115,32.8 C115,32.7 115,32.7 115,32.8 C115,32.7 115,32.7 115,32.8 C115,32.8 115,32.8 115,32.8 C115,32.8 115,32.8 115,32.8 L115,32.8 C115,32.8 115,32.8 115,32.8 C115,32.8 115,32.8 115,32.8 Z"
            id="GooglePlayStoreShape20"
            fill="#FFFFFF"
          />
          <polygon
            id="GooglePlayStoreShape21"
            fill="#FFFFFF"
            points="115.1 32.7 115 32.7 115 32.7 115.1 32.7 115.1 32.8 115.1 32.8 115.1 32.7"
          />
          <polygon
            id="GooglePlayStoreShape22"
            fill="#FFFFFF"
            points="115.1 32.8 115.1 32.8 115.1 32.7 115.1 32.7 115.1 32.7 115.1 32.7 115.1 32.7 115.1 32.7 115.1 32.7 115.1 32.7 115.1 32.8"
          />
          <path
            d="M115.1,32.8 L115.1,32.8 C115.1,32.7 115.1,32.7 115.1,32.8 L115.1,32.8 C115.1,32.7 115.1,32.7 115.1,32.8 L115.1,32.8 L115.1,32.8 L115.1,32.8 L115.1,32.8 L115.1,32.8 L115.1,32.8 L115.1,32.8 L115.1,32.8 Z"
            id="GooglePlayStoreShape23"
            fill="#FFFFFF"
          />
          <path
            d="M39.4,10.6 C39.4,8.8 40.7,7.7 42.3,7.7 C43.4,7.7 44.1,8.2 44.6,8.9 L43.8,9.4 C43.5,9 43,8.7 42.3,8.7 C41.2,8.7 40.4,9.5 40.4,10.7 C40.4,11.9 41.2,12.7 42.3,12.7 C42.9,12.7 43.4,12.4 43.6,12.2 L43.6,11.3 L42,11.3 L42,10.4 L44.7,10.4 L44.7,12.5 C44.2,13.1 43.4,13.5 42.4,13.5 C40.7,13.5 39.4,12.3 39.4,10.6 Z"
            id="GooglePlayStoreShape24"
            fill="#FFFFFF"
            fillRule="nonzero"
          />
          <polygon
            id="GooglePlayStoreShape25"
            fill="#FFFFFF"
            fillRule="nonzero"
            points="45.9 13.4 45.9 7.8 49.7 7.8 49.7 8.7 46.8 8.7 46.8 10.1 49.6 10.1 49.6 11 46.8 11 46.8 12.6 49.7 12.6 49.7 13.5"
          />
          <polygon
            id="GooglePlayStoreShape26"
            fill="#FFFFFF"
            fillRule="nonzero"
            points="52.5 13.4 52.5 8.7 50.8 8.7 50.8 7.8 55.2 7.8 55.2 8.7 53.5 8.7 53.5 13.4"
          />
          <path
            d="M58.6,13.4 L58.6,7.8 L59.6,7.8 L59.6,13.4 C59.6,13.4 58.6,13.4 58.6,13.4 Z"
            id="GooglePlayStoreShape27"
            fill="#FFFFFF"
            fillRule="nonzero"
          />
          <polygon
            id="GooglePlayStoreShape28"
            fill="#FFFFFF"
            fillRule="nonzero"
            points="62.3 13.4 62.3 8.7 60.6 8.7 60.6 7.8 65 7.8 65 8.7 63.3 8.7 63.3 13.4"
          />
          <path
            d="M68.2,10.6 C68.2,8.9 69.4,7.7 71.1,7.7 C72.8,7.7 74,8.9 74,10.6 C74,12.3 72.8,13.5 71.1,13.5 C69.4,13.5 68.2,12.2 68.2,10.6 Z M72.9,10.6 C72.9,9.4 72.2,8.6 71,8.6 C69.9,8.6 69.1,9.5 69.1,10.6 C69.1,11.8 69.8,12.6 71,12.6 C72.2,12.6 72.9,11.7 72.9,10.6 Z"
            id="GooglePlayStoreShape29"
            fill="#FFFFFF"
            fillRule="nonzero"
          />
          <polygon
            id="GooglePlayStoreShape30"
            fill="#FFFFFF"
            fillRule="nonzero"
            points="79 13.4 76.1 9.4 76.1 13.4 75.1 13.4 75.1 7.8 76.1 7.8 79 11.7 79 7.8 80 7.8 80 13.4"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const Participate = (
  <svg width="32px" height="34px" viewBox="0 0 32 34">
    <defs />
    <g
      id="Reporting_1228"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="Reporting_TokenBuy_Pop-up"
        transform="translate(-1261.000000, -163.000000)"
        stroke="#FFFFFF"
      >
        <g id="Participate-Icon" transform="translate(1262.000000, 164.000000)">
          <path
            d="M24.9113288,32 C24.9694022,31.6058031 25,31.2029362 25,30.7937113 C25,25.9373447 20.7469024,22 15.4996878,22 C10.2530976,22 6,25.9373447 6,30.7937113 C6,31.1879082 6.02810004,31.5757471 6.08242679,31.9560719"
            id="Stroke-4"
          />
          <path
            d="M0.357142857,32 L29.6428571,32"
            id="Line"
            strokeLinecap="round"
          />
          <g
            id="Group-2"
            transform="translate(8.500000, 0.000000)"
            strokeLinecap="round"
          >
            <polyline
              id="Stroke-8"
              strokeLinejoin="round"
              points="0 10.625 6.42662749 17 13 10.625"
            />
            <path d="M6.5,16.1019345 L6.5,0.164434524" id="Line-Copy" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const SigningPen = (
  <svg width="24px" height="24px" viewBox="0 0 24 24">
    <defs />
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinejoin="round"
    >
      <g id="Icon/Edit-White" fillRule="nonzero" stroke="#FFFFFF">
        <path
          d="M1,18.4173032 L1,23 L5.58269685,23 L18.2857143,10.4285714 L13.7030174,5.84587458 L1,18.4173032 Z M22.6425496,5.9401472 C23.1191501,5.46354673 23.1191501,4.69365366 22.6425496,4.21705319 L19.7829468,1.35745035 C19.3063463,0.880849882 18.5364533,0.880849882 18.0598528,1.35745035 L15.8234967,3.59380642 L20.4061936,8.17650326 L22.6425496,5.9401472 Z"
          id="Shape"
        />
      </g>
    </g>
  </svg>
);

export const showMore = (
  <svg width="14px" height="14px" viewBox="0 0 14 14">
    <defs />
    <g
      id="Reporting:-Dispute"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Reporting_Dispute" transform="translate(-297.000000, -247.000000)">
        <g
          id="Reporting/Header:-Dispute"
          transform="translate(73.000000, 40.000000)"
        >
          <g id="Group-7" transform="translate(39.000000, 166.000000)">
            <g id="show-more" transform="translate(186.000000, 42.000000)">
              <circle id="Oval" stroke="#A7A2B2" cx="6" cy="6" r="6" />
              <circle
                id="Oval-2"
                fill="#A7A2B2"
                fillRule="nonzero"
                cx="3"
                cy="6"
                r="1"
              />
              <circle
                id="Oval-3"
                fill="#A7A2B2"
                fillRule="nonzero"
                cx="6"
                cy="6"
                r="1"
              />
              <circle
                id="Oval-4"
                fill="#A7A2B2"
                fillRule="nonzero"
                cx="9"
                cy="6"
                r="1"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const errorIcon = (
  <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
    <defs />
    <g id="Design" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Error-Message" transform="translate(-24.000000, -607.000000)">
        <g id="error" transform="translate(24.000000, 607.000000)">
          <g id="Icon/Error">
            <g>
              <circle id="Oval" fill="#FF0050" cx="8" cy="8" r="8" />
              <path
                d="M8.87821659,10.1462941 L6.93119318,10.1462941 L6.62451916,3.05 L9.1848906,3.05 L8.87821659,10.1462941 Z M6.55319962,12.3571998 C6.55319962,12.005355 6.68038486,11.7165137 6.93475916,11.4906674 C7.18913345,11.2648211 7.50650222,11.1518996 7.886875,11.1518996 C8.26724777,11.1518996 8.58461655,11.2648211 8.83899084,11.4906674 C9.09336513,11.7165137 9.22055037,12.005355 9.22055037,12.3571998 C9.22055037,12.7090446 9.09336513,12.9978859 8.83899084,13.2237322 C8.58461655,13.4495785 8.26724777,13.5625 7.886875,13.5625 C7.50650222,13.5625 7.18913345,13.4495785 6.93475916,13.2237322 C6.68038486,12.9978859 6.55319962,12.7090446 6.55319962,12.3571998 Z"
                id="!"
                fill="#FFFFFF"
                transform="translate(7.886875, 8.306250) scale(-1, 1) translate(-7.886875, -8.306250) "
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const prevIcon = (
  <svg
    width="7px"
    height="11px"
    viewBox="0 0 7 11"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <g
      id="Create/Connect-Account"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="hardWareWalletDisconnectedAddressesLoadedHover"
        transform="translate(-24.000000, -406.000000)"
        fill="#FFFFFF"
        fillRule="nonzero"
      >
        <g id="dropdown" transform="translate(-1.000000, 72.000000)">
          <g id="derivationPath" transform="translate(0.000000, 152.000000)">
            <g id="previous" transform="translate(25.000000, 179.000000)">
              <polygon
                id="TrianglePrevious"
                transform="translate(3.333333, 8.083333) rotate(-90.000000) translate(-3.333333, -8.083333) "
                points="3.33333333 4.75 8.33333333 11.4166667 -1.66666667 11.4166667"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const nextIcon = (
  <svg
    width="7px"
    height="11px"
    viewBox="0 0 7 11"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <g
      id="Create/Connect-Account"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="hardWareWalletDisconnectedAddressesLoadedHover"
        transform="translate(-156.000000, -406.000000)"
        fill="#FFFFFF"
        fillRule="nonzero"
      >
        <g id="dropdown" transform="translate(-1.000000, 72.000000)">
          <g id="derivationPath" transform="translate(0.000000, 152.000000)">
            <g id="next" transform="translate(119.000000, 179.000000)">
              <polygon
                id="TriangleNext"
                transform="translate(41.333333, 8.083333) scale(-1, 1) rotate(-90.000000) translate(-41.333333, -8.083333) "
                points="41.3333333 4.75 46.3333333 11.4166667 36.3333333 11.4166667"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const yellowAlertIcon = (
  <svg viewBox="0 0 23 23">
    <g
      id="Core-Stats-Bar"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="gasPriceModuleToHigh"
        transform="translate(-593.000000, -398.000000)"
      >
        <g id="gasPrice" transform="translate(570.000000, 311.000000)">
          <g id="Group-9" transform="translate(24.000000, 84.000000)">
            <g id="alert" transform="translate(0.000000, 4.000000)">
              <path
                d="M9.66956376,0.449701198 C9.97324687,-0.149900399 10.7324546,-0.149900399 11.035275,0.449701198 L15.8174213,9.90270077 L20.5987048,19.3548376 C20.9023879,19.9553019 20.522784,20.7058824 19.9154178,20.7058824 L10.3528508,20.7058824 L0.790283701,20.7058824 C0.182054742,20.7058824 -0.19668641,19.9553019 0.106996701,19.3548376 L4.88828023,9.90270077 L9.66956376,0.449701198 Z"
                id="Stroke-1"
                stroke="#FFD500"
              />
              <text
                id="!"
                fontFamily="Roboto-Bold, Roboto"
                fontSize="13"
                fontWeight="bold"
                fill="#FFD500"
              >
                <tspan x="8.41176471" y="17.0882353">
                  !
                </tspan>
              </text>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const logoutIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
  >
    <g fill="#FFF" fillRule="nonzero">
      <path d="M14.16 10.123H5.624a1.125 1.125 0 0 1 0-2.25h8.534l-1.454-1.455a1.125 1.125 0 0 1 1.59-1.59l3.375 3.374a1.125 1.125 0 0 1 0 1.591l-3.375 3.375a1.125 1.125 0 1 1-1.59-1.59l1.454-1.455z" />
      <path d="M9 15.5v-2a1 1 0 0 1 2 0v4H0V0h11v4a1 1 0 0 1-2 0V2H2v13.5h7z" />
    </g>
  </svg>
);

export const infoIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="9"
      cy="9"
      r="8"
      fill="#1A1627"
      stroke="#2B2438"
      strokeWidth="2"
    />
    <path
      d="M6.5 6.30273H9.74023V11.7051H11.8086V12.6426H6.5V11.7051H8.65625V7.24609H6.5V6.30273ZM8.51562 4.63867C8.51562 4.45898 8.56836 4.30859 8.67383 4.1875C8.7832 4.0625 8.94727 4 9.16602 4C9.38086 4 9.54297 4.0625 9.65234 4.1875C9.76172 4.30859 9.81641 4.45898 9.81641 4.63867C9.81641 4.81445 9.76172 4.96094 9.65234 5.07812C9.54297 5.19531 9.38086 5.25391 9.16602 5.25391C8.94727 5.25391 8.7832 5.19531 8.67383 5.07812C8.56836 4.96094 8.51562 4.81445 8.51562 4.63867Z"
      fill="white"
    />
  </svg>
);

export const PaginationArrorw = (
  <svg
    width="6"
    height="10"
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 9L1 5L5 1"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
