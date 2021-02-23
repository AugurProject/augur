declare namespace ButtonsStylesLessNamespace {
  export interface IButtonsStylesLess {
    Approval: string;
    ApproveButton: string;
    Button: string;
    BuySellButton: string;
    DirectionButton: string;
    Disabled: string;
    Error: string;
    Focused: string;
    Left: string;
    Pending: string;
    PrimaryButton: string;
    SearchButton: string;
    SecondaryButton: string;
    Selected: string;
    TextAndIcon: string;
    TextButton: string;
    TinyButton: string;
    TinyTransparentButton: string;
    WalletButton: string;
    approval: string;
    approveButton: string;
    button: string;
    buySellButton: string;
    directionButton: string;
    disabled: string;
    error: string;
    focused: string;
    left: string;
    pending: string;
    primaryButton: string;
    searchButton: string;
    secondaryButton: string;
    selected: string;
    textAndIcon: string;
    textButton: string;
    tinyButton: string;
    tinyTransparentButton: string;
    walletButton: string;
  }
}

declare const ButtonsStylesLessModule: ButtonsStylesLessNamespace.IButtonsStylesLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ButtonsStylesLessNamespace.IButtonsStylesLess;
};

export = ButtonsStylesLessModule;
