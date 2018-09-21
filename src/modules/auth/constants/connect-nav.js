import {
  Ledger,
  Edge,
  MetaMask,
  Trezor
} from "modules/common/components/icons";
import { DEFAULT_DERIVATION_PATH } from "modules/auth/helpers/derivation-path";

export const PARAMS = {
  EDGE: "edge",
  LEDGER: "ledger",
  METAMASK: "metamask",
  TREZOR: "trezor"
};

export const WALLET_TYPE = {
  SOFTWARE: "software",
  HARDWARE: "hardware"
};

export const ERROR_TYPES = {
  UNABLE_TO_CONNECT: {
    header: "Unable To Connect",
    subheader: "Please install the MetaMask browser plug-in from Metamask.io"
  },
  NOT_SIGNED_IN: {
    header: "Unable To Connect",
    subheader: "Please make sure you are signed in to your account."
  },
  INCORRECT_FORMAT: {
    header: "Incorrect Format",
    subheader:
      'Please enter a derivative path with the format "' +
      DEFAULT_DERIVATION_PATH +
      '"'
  }
};

const DEFAULT_ITEM_INDEX = 0;

export const ITEMS = [
  {
    param: PARAMS.METAMASK,
    title: "Metamask / Web 3 Provider",
    icon: MetaMask,
    type: WALLET_TYPE.SOFTWARE
  },
  {
    param: PARAMS.TREZOR,
    title: "Trezor",
    icon: Trezor,
    type: WALLET_TYPE.HARDWARE
  },
  {
    param: PARAMS.LEDGER,
    title: "Ledger",
    icon: Ledger,
    type: WALLET_TYPE.HARDWARE
  }
];

if (!process.env.AUGUR_HOSTED) {
  ITEMS.unshift({
    param: PARAMS.EDGE,
    title: "Edge",
    icon: Edge,
    type: WALLET_TYPE.SOFTWARE
  });
}

ITEMS[DEFAULT_ITEM_INDEX].default = true;
