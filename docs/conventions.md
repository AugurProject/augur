# Augur - UI Conventions

## Components
All components should be semantically tagged, highly reusable, and DRY.

To help ensure this, the following conventions have been employed:
* Only one `main` tag
  * Currently employed in the `router.jsx` component to contain all view content.
* All top-level components (i.e. - views) should be contained within a `section` tag.
* All `section` tags should have an accompanying ID attribute (excluding unique semantic tags (main, header, footer, etc.)).
* All reusable complex components should be contained with an `article` tag.
* Simpler components may be contained in either a `div` or some other semantically correct tag.
* All `section` or `article` tags should consume the `className` prop passed from a parent component.
  * This ensures that contextualized styling can be dictated from the parent component's stylesheet.
* All components should be standard HTML5 elements with their default behaviors intact.
  * Due to some implementation constraints, there may be a reason to deviate from this, but it should be dialoged over prior to implementation.
* **Do** leave comments for functionality that may be non-obvious
  * Dependence on other methods, complex mutations/filters, etc.

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
* Every component should have the **minimum** amount of styling required (helps maintain contextualization).
   * This allows for stylesheets of parent components that employ a component to apply any additional 'chrome' required.
   * This is also the reason why both the `section` and `article` components consume the `className` prop.
* Classnames should be contextual + non-generic.
* Classnames should be discrete words delimited by a `-` (dash).
* IDs should be discrete words delimited by an `_` (underscore).
* Flexbox should be utilized for component layout.
* Comments should be employed for mixins to help inform the utilization.
* The full breadth of Less's functionality is permissible.

### Other Conventions
Above are the main points, but additional structural and styling conventions of the stylesheets themselves are enforced through linting.
For a full review of all conventions, reference:

* `.stylelintrc` - Less linting rules
