'use strict'

import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

function DelayRender ({ children, visible, startDelay = 200, stopDelay = 1000 }) {
  const [render1, setRender1] = useState(false)
  const [render2, setRender2] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setRender1(visible), visible ? startDelay : 0)
    return () => clearTimeout(id)
  }, [visible, startDelay])

  useEffect(() => {
    const id = setTimeout(() => setRender2(render1), render1 ? 0 : stopDelay)
    return () => clearTimeout(id)
  }, [render1, stopDelay])

  return render2 ? children : null
}

DelayRender.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  visible: PropTypes.bool,
  startDelay: PropTypes.number,
  stopDelay: PropTypes.number
}

export default DelayRender
