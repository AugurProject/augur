declare namespace TooltipStylesLessNamespace {
  export interface ITooltipStylesLess {
    Container: string;
    Tooltip: string;
    TooltipHint: string;
    __react_component_tooltip: string;
    container: string;
    'place-bottom': string;
    'place-left': string;
    'place-right': string;
    'place-top': string;
    placeBottom: string;
    placeLeft: string;
    placeRight: string;
    placeTop: string;
    reactComponentTooltip: string;
    show: string;
    tooltip: string;
    tooltipHint: string;
    'type-light': string;
    typeLight: string;
  }
}

declare const TooltipStylesLessModule: TooltipStylesLessNamespace.ITooltipStylesLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TooltipStylesLessNamespace.ITooltipStylesLess;
};

export = TooltipStylesLessModule;
