declare namespace GetWalletIconStylesLessNamespace {
  export interface IGetWalletIconStylesLess {
    WalletIcon: string;
    walletIcon: string;
  }
}

declare const GetWalletIconStylesLessModule: GetWalletIconStylesLessNamespace.IGetWalletIconStylesLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GetWalletIconStylesLessNamespace.IGetWalletIconStylesLess;
};

export = GetWalletIconStylesLessModule;
