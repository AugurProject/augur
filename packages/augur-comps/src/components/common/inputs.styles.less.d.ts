declare namespace InputsStylesLessNamespace {
  export interface IInputsStylesLess {
    AmountInput: string;
    AmountInputField: string;
    CurrencyLabel: string;
    Edited: string;
    Error: string;
    Invalid: string;
    InvalidSelected: string;
    Outcome: string;
    Outcomes: string;
    Rate: string;
    RateLabel: string;
    SearchInput: string;
    Selected: string;
    SelectedBorders: string;
    SharesLabel: string;
    ShowAllHighlighted: string;
    TextInput: string;
    Yes: string;
    YesNo: string;
    amountInput: string;
    amountInputField: string;
    currencyLabel: string;
    disabled: string;
    edited: string;
    error: string;
    faded: string;
    invalid: string;
    invalidSelected: string;
    loggedOut: string;
    nonSelectable: string;
    outcome: string;
    outcomes: string;
    rate: string;
    rateLabel: string;
    searchInput: string;
    selected: string;
    selectedBorders: string;
    sharesLabel: string;
    showAllHighlighted: string;
    showAsButton: string;
    showAsButtons: string;
    textInput: string;
    yes: string;
    yesNo: string;
  }
}

declare const InputsStylesLessModule: InputsStylesLessNamespace.IInputsStylesLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InputsStylesLessNamespace.IInputsStylesLess;
};

export = InputsStylesLessModule;
