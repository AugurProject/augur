import React from 'react'
import classNames from 'classnames'

const Toggler = p => (
  <button
    className={classNames('clickable', 'toggler', p.className)}
    onClick={(e) => {
      e.persist()
      p.onClick(findNextOption(p.selected, p.options), e)
    }}
  >
    {p.selected.label}
  </button>
)

const findNextOption = (selected, options) => {
  const currentSelectedIndex = options.indexOf(selected)
  let nextSelectedInex = currentSelectedIndex + 1
  if (nextSelectedInex >= options.length) {
    nextSelectedInex = 0
  }
  return options[nextSelectedInex]
}

// TODO -- Prop Validations
// Toggler.propTypes = {
// 	className: PropTypes.string,
// 	selected: PropTypes.object,
// 	options: PropTypes.array,
// 	onClick: PropTypes.func
// };

export default Toggler
