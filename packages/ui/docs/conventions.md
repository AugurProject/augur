# Augur | Conventions

## Modules

* Modules with a single export should have that denoted as `default`
  * If the export is a function, it should be anonymous

## Components
All components should be semantically tagged, highly reusable, and DRY.

To help ensure this, the following conventions have been employed:
* Only one `main` tag
  * Currently employed in the `router.jsx` component to contain all view content.
* All top-level components (i.e. - views) should be contained within a `section` tag.
  * Though valid, `section` should only be used for view level components.
* All `section` tags should have an accompanying ID attribute (excluding unique semantic tags (main, header, footer, etc.)).
* All reusable components should be contained within an `article` tag unless this use would be semantically incorrect; in which case, use whatever tag is appropriate.
* All components should be standard HTML5 elements with their default behaviors intact.
  * Due to some implementation constraints, there may be a reason to deviate from this, but it should be dialoged over prior to implementation.
* Do leave comments for functionality that may be non-obvious
  * Dependence on other methods, complex mutations/filters, etc.
* Font Awesome characters are used directly in the components -- in order to render these inside your text editors/IDEs, reference the [typography](../src/modules/common/less/typography.less) stylesheet.
* Import paths for `assets`, `modules`, and `utils` are aliased, so avoid relative paths.
  * Always traverse from the aliases.
* Null component states (ex: 'no markets', 'no tags', etc.) should always come first in the component.
* Conditional display should occur as far down the component tree as possible.
* Props that are being passed to a component should be explicit from both ends
* Prop validations should have required props first, optional props after
* TODO -- convention re: import order

### Other Conventions
Not all conventions are detailed above, but rather just the main points.
For a full review of the breadth of the conventions employed, reference:

* `.eslintrc` - JS linting rules
* `.editorconfig` - Editor focused rules to keep coding styles consistent
  * Optional and primarily for convenience, but the linting enforces many of these conventions

## Styles
All styles should be contextual such that styling rules are only directly applied to the immediately relevant component(s), with the ultimate goal always being consistency and maintainability.

This is seen reflected in the overall structure of the stylesheets -- generally a 1-to-1 between a component and a stylesheet.

To help ensure this, the following conventions have been employed:
* All styles should be contextual and housed within their relevant files (1-to-1 component to stylesheet)
* If an identical style is to be applied to multiple elements, that declaration block should probably be abstracted to a mixin.
  * This can be seen in the way (not exhaustive) typography (`common/less/typography.less`) and borders (`common/less/borders.less`) are employed.
* Do use mixins where provided
  * Notable ones available: animations/transitions, borders, colors, and typography.
* Mixin inclusions should always come first within a declaration block and be alphabetical.
* Every component should have the minimum amount of styling required (helps maintain contextualization).
   * This allows for stylesheets of parent components that employ a component to apply any additional 'chrome' required.
* Classnames should be contextual + non-generic.
* Classnames should be discrete words delimited by a `-` (dash).
* IDs should be discrete words delimited by an `_` (underscore).
* Flexbox should be utilized for all layout (exceptions would be something like a fixed element, but that should be very rare).
* Comments should be employed for mixins to help inform the utilization.
* Avoid the use of `!important` unless absolutely necessary
* The full breadth of Less's functionality is permissible.
* All external borders (parent level components within a view) should be the normal border color
* All internal borders should be either muted or light (depending on the application)
* When utilizing `CSSTransitionGroup`, styling of this wrapper should be housed within the rendered child's stylesheet
* If you need a less variable to be accessible during runtime, create a rule set for `body` and with identically
  named custom properties which have their values as the respective less variables.  You can then get these values by calling `getComputedStyle` and `getPropertyValue` on `document.body`.

### Other Conventions
Above are the main points, but additional structural and styling conventions of the stylesheets themselves are enforced through linting.
For a full review of all conventions, reference:

* `.stylelintrc` - Less linting rules
