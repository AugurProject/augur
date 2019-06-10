UI Conventions
====================

Numbers
-------
Mathematical operations, such as addition, multiplication, greater-than/less-than comparisions, etc., should only ever be performed within the UI using the [BigNumber](https://github.com/MikeMcl/bignumber.js) data type.

When outputting decimal numbers to the UI, the following rules should be adhered to:

1. By default, 4 decimal places should be shown.
2. Scientific notation should never be shown.
3. If the number can be rounded to a number that's visible in the 4 decimal places, it should be (e.g., 0.000998 should be rounded to 0.0010).
4. If a number, when rounded, results in nothing being shown in the first 4 decimals, it should be displayed to the first two significant digits. Anything smaller than 0.00005 should be treated this way. Significant digits include all non-zero digits, and any zeroes that are between two non-zero digits. For example:
   * 0.00000101 should be displayed as 0.0000010.
   * 0.000034052400 should be displayed as 0.000034.
   * 0.00000021034 should be displayed as 0.00000021.
5. At most, only 8 decimals should ever be displayed. Any number not containing significant digits in the first 8 decimals should just be displayed as 0.0000.

Dates/Timestamps
----- 
In general, the current timestamp should only ever be obtained using the value `blockchain.currentAugurTimestamp` (as opposed to calling the JavaScript function `Date.now`). This value can be obtained using the selectors `getCurrentTimestampInSeconds` (which returns the timestamp of the latest block on the Ethereum blockchain) or `getCurrentTimestamp` (which returns the same timestamp, in milliseconds). This means that `Date.now()` should not be used, and `moment()` and `new Date()` should not be used for getting the current timestamp.

Modules
-------
```javascript
  // Modules Conventions
  // Import Conventions
  // Order: 3rd party modules > services > components/selectors/reducers/actions
  // > constants > utils
  import React, { Component } from 'react';
  import { augur } from 'services/augurjs';
  import Input from 'modules/common/components/input';
  import { BUY, SELL } from 'modules/trade/constants/types';
  import trimString from 'utils/trim-string';

  // Export conventions
  // single constant export
  export default const BUY = 'buy';
  // or for a single function
  export default (args) => {
    // do something...
  };
```
Modules import paths for `assets`, `modules`, `utils`, and `services` are aliased, so avoid relative paths. <b>Always</b> traverse from the aliases. Import requirements in the following order:

1. 3rd party modules
2. services
3. components/selectors/reducers/actions
4. constants
5. utils

Modules with a single export should have that denoted as `default`.
If the export is a function, it should be anonymous.

Components
----------
All components should be semantically tagged, highly reusable, and DRY. Components should have comments for functionality that may be non-obvious, depend on other methods, requires a complex mutation/filer, etc.

To help ensure this, the following conventions have been employed:

#### Layout Conventions:

```html
<!-- JSX Layout Conventions -->
<!-- Example Component tree (after rendering)-->
<!-- only one main tag in the whole app, currently in app.jsx -->
<main id="app">
<!-- each view has it's own section component -->
  <section id="create-market-view" >
  <!-- each view has reusable components which should be articles
  unless they are specifically a button, list, link, etc.-->
    <article>
      <!-- more reusable components may be inside -->
    </article>
    <!-- ....more reusable components -->
  </section>
</main>
```

There is only one `main` tag, which is currently employed in the [app.jsx](https://github.com/AugurProject/augur-ui/blob/master/src/modules/app/components/app/app.jsx) component, to contain all view content. All top-level components (i.e. - views) should be contained within a `section` tag. Though valid, `section` should only be used for view level components. All `section` tags should have an accompanying `id` attribute (excluding unique semantic tags (main, header, footer, etc.)). All reusable components should be contained within an `article` tag unless this use would be semantically incorrect; in which case, use whatever tag is appropriate. All components should be standard HTML5 elements with their default behaviors intact. (*Note: Due to some implementation constraints, there may be a reason to deviate from this, but it should be dialoged over prior to implementation.*)

```jsx
// React Conventions:
// required propTypes should come first.
static propTypes = {
  importantProp: PropTypes.object.isRequired,
  optionalProp: PropTypes.string,
}

// top level component (ie Views) example:
const marketsView = p => (
  <section id="markets-view">
    <MarketsList
      loginAccount={p.loginAccount}
      markets={p.markets}
      pagination={p.pagination}
      scalarShareDenomination={p.scalarShareDenomination}
    />
  </section>
);

marketsView.propTypes = {
  loginAccount: PropTypes.object,
  scalarShareDenomination: PropTypes.object,
  markets: PropTypes.array,
  pagination: PropTypes.object,
};

export default marketsView;

// re-usable component example:
const MarketsList = (p) => {
  const nullMessage = 'No Markets Available';

  return (
    <article className="markets-list">
      {p.markets.length ? p.markets.map((market) => {
        const selectedShareDenomination = getValue(p, `scalarShareDenomination.markets.${market.id}`);
        const shareDenominations = getValue(p, 'scalarShareDenomination.denominations');

        return (
          <MarketPreview
            key={market.id}
            loginAccount={p.loginAccount}
            {...market}
            selectedShareDenomination={selectedShareDenomination}
            shareDenominations={shareDenominations}
          />
        );
      }) : <NullStateMessage message={nullMessage} /> }
      {!!p.pagination && !!p.pagination.numUnpaginated &&
        <Paginator {...p.pagination} />
      }
    </article>
  );
};

MarketsList.propTypes = {
  loginAccount: PropTypes.object,
  scalarShareDenomination: PropTypes.object,
  markets: PropTypes.array,
  pagination: PropTypes.object
};

export default MarketsList;
```

#### React Conventions
Props that are being passed to a component should be explicit from both ends and Prop validations should have required props first, optional props after.

Null component states (ex: 'no markets', 'no tags', etc.) should always be shown as the `false` value for a conditional display. Conditional display should occur as far down the component tree as possible.


#### Detailed Component Conventions
Not all conventions are detailed above, but rather just the main points.
For a full review of the breadth of the conventions employed, reference:

- `.eslintrc` - JS linting rules are found [here](https://github.com/AugurProject/augur-ui/blob/master/.eslintrc).
- `.editorconfig` - Editor focused rules to keep coding styles consistent. Can be found [here](https://github.com/AugurProject/augur-ui/blob/master/.editorconfig).
- Optional and primarily for convenience, but the linting enforces many of these conventions

Styles
------
<!-- this seems to work better than just css highlighting. less isn't available. -->
```scss
// Less Variable exposed for JS example:
@animation-speed-very-fast: 200ms;

// For accessibility w/in JS
body {
  --animation-speed-very-fast: unit(@animation-speed-very-fast);
}
```
```javascript
// access less variable using JS
updateAnimationSpeedValue() {
    this.setState({
      animationSpeed: parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-very-fast'), 10)
    });
  }
```

All styles should be contextual such that styling rules are only directly applied to the immediately relevant component(s), with the ultimate goal always being consistency and maintainability. This is seen reflected in the overall structure of the stylesheets -- generally a 1-to-1 between a component and a stylesheet.

The full breadth of Less's functionality is permissible. If you need a Less variable to be accessible during runtime, create a rule set for `body` and with identically named custom properties which have their values as the respective less variables.  You can then get these values by calling `getComputedStyle` and `getPropertyValue` on `document.body`.

Following are some of the conventions that have been employed:

#### Mixin Conventions

```scss
  /* Mixin Conventions */
  // BORDER Constants
  // Defaults
  @border-all: 'all sides';
  @border-default-chroma: @border-normal;
  @border-default-width: 1px;
  // Sides
  @border-top: border-top;
  @border-right: border-right;
  @border-bottom: border-bottom;
  @border-left: border-left;
  // Chroma
  @border-normal: @color-border;
  @border-muted: @color-border-muted;
  @border-light: @color-border-light;
  @border-faded: fadeout(@color-border, @amount-extra-light);
  // Style
  @border-solid: solid;
  @border-dotted: dotted;
  @border-dashed: dashed;
  @border-double: double;
  // Width
  @border-width-2: 2px;
  @border-width-3: 3px;
  // define mixin
  .border(@side: false; @property: @border-all; @chroma: @border-default-chroma; @width: @border-default-width; @style: @border-solid;) {
    & when (@side) {
      & when (@property = @border-all) {
        border: @width @style @chroma;
      }

      @{property}: @width @style @chroma;
    }

    & when not (@side) {
      border: none;
    }
  }

  /* Component Style Conventions: */

  .example-widget-viewer {
    // mixins come first and in alphabetical order
    .border(true);

    align-items: center;
    background-color: @color-white;
    display: flex;
    flex: 1;
    min-width: 22em;
  }
```

Use mixins where provided. If an identical style is to be applied to multiple elements, that declaration block should probably be abstracted to a mixin. Comments should be employed for mixins to help inform the utilization. This can be seen in the way (not exhaustive) [typography](https://github.com/AugurProject/augur-ui/blob/master/src/assets/styles/_typography.less) and [borders](https://github.com/AugurProject/augur-ui/blob/master/src/assets/styles/_borders.less) are employed. Some notable mixins include:
- [animations](https://github.com/AugurProject/augur-ui/blob/master/src/assets/styles/_animations.less),
- [borders](https://github.com/AugurProject/augur-ui/blob/master/src/assets/styles/_borders.less),
- [colors](https://github.com/AugurProject/augur-ui/blob/master/src/assets/styles/_colors.less), and
- [typography](https://github.com/AugurProject/augur-ui/blob/master/src/assets/styles/_typography.less).

#### Component Style Conventions

Every component should have the minimum amount of styling required (helps maintain contextualization). This allows for stylesheets of parent components that employ a component to apply any additional 'chrome' required.

Things to remember about Component Less styling include:

- Mixin inclusions should always come first within a declaration block and be alphabetical.
- Classnames should be contextual, non-generic, and should be discrete words delimited by a `-` (dash).
- IDs should be discrete words delimited by an `_` (underscore).
- Flexbox should be utilized for all layout (exceptions would be something like a fixed element, but that should be very rare).
- Avoid the use of `!important` unless absolutely necessary.
- All external borders (parent level components within a view) should be the normal border color. All internal borders should be either muted or light (depending on the application).
- When utilizing `CSSTransitionGroup`, styling of this wrapper should be housed within the rendered child's stylesheet

#### Detailed Style Conventions
Above are the main points, but additional structural and styling conventions of the stylesheets themselves are enforced through linting.
For a full review of all conventions, reference:

- `.stylelintrc` - Less linting rules can be found [here](https://github.com/AugurProject/augur-ui/blob/master/.stylelintrc).

#### Running Tests

To execute a specific UI test, run:

`npm run test <path_to_test>`

#### Fixing Linting Errors

To fix many of the low-hanging-fruit linting errors, run:

`npm run lint --fix`

#### CSS Units

When deciding whether to use `rem` or `em`, it is helpful to ask, "In relation to what element should this size be derived?"

If it is local to that element or it’s siblings, then it’s most likely `em`. If it doesn’t matter or is relative to the view/general layout, then it’s most likely `rem`. It’s highly contextual as to when/how to apply, but if a component’s layout can scale based on root font size, then `rem` is fine. However, if the layout needs to scale in relation to itself or its peers, it is probably better leverage `em`.