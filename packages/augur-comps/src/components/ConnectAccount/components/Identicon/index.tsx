import React, { useEffect, useRef } from 'react'
import Jazzicon from 'jazzicon'

export default function Identicon({ account }) {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
    }
  }, [account])

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return <div ref={ref as any} />
}
