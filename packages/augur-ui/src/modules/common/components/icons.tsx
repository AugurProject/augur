import React from "react";

export const collapseIcon = (
  <svg
    width="20"
    height="30"
    viewBox="0 0 20 30"
    fill="none"
   
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

export const RightChevron = (
  <svg
    width="7"
    height="14"
    viewBox="0 0 7 14"
    fill="none"
   
  >
    <path
      opacity="0.5"
      d="M0.65686 1.34315C0.65686 1.34315 4.10458 4.79086 6.31372 7L0.65686 12.6568"
      stroke="white"
    />
  </svg>
);

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

export const ChevronRight = (
  <svg viewBox="0 0 9 14">
    <g
      id="Symbols"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      opacity=".54"
      strokeLinejoin="round"
    >
      <g id="Selector/Calendar" stroke="#231A3A">
        <g id="Group-2">
          <g id="Icon/chevron-right">
            <path id="Stroke-3" d="M1.16 13.228l6.363-6.364L1.16.5" />
          </g>
        </g>
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

export const PaginationArrorw = (
  <svg
    width="6"
    height="10"
    viewBox="0 0 6 10"
    fill="none"
   
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
