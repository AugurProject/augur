import React from 'react'
import { ExternalLink } from './'

export const IconWrapper = ({ children }) => (
  <div style={{
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {children}
  </div>
)

const OptionCardLeft = ({ children }) => (
  <div style={{
    justifyContent: 'center',
    height: '100%'
  }}>
    {children}
  </div>
)

const OptionCardClickable = ({ disabled, active, clickable, onClick, darkMode, children }) => (
  <div
    onClick={onClick}
    style={{
    marginTop: 0,
    opacity: `${disabled ? '0.5' : '1'}`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: `${active ? darkMode ? '#40444F' : '#EDEEF2' : darkMode ? '#2C2F36' : '#F7F8FA'}`,
    outline: 'none',
    border: '1px solid',
    borderRadius: '12px',
    width: '100% !important',
    cursor: 'pointer',
    // ':focus': {
    //   boxShadow: `0 0 0 1px ${darkMode ? '#2172E5' : '#2172E5'}`,
    // },
    //   &:hover {
    //     cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
    //     border: ${({ clickable, darkMode }) => (clickable ? `1px solid ${darkMode ? '#2172E5' : '#2172E5'}` : ``)};
    //   }
    borderColor: `${active ? 'transparent' : darkMode ? '#40444F' : '#EDEEF2'}`,
  }}>
    {children}
  </div>
)


const GreenCircle = ({ children }) => (
  <div style={{
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    {children}
  </div>
)

const CircleWrapper = ({ children }) => (
  <div style={{
    color: '#27AE60',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
    }}>
    {children}
  </div>
)


const HeaderText = ({ color, darkMode, children }) => (
  <div style={{
    color: `${color === 'blue' ? darkMode ? '#2172E5' : '#2172E5' : darkMode ? '#FAFAFA' : '#1F1F1F'}`,
    fontSize: '1rem',
    fontWeight: 500
  }}>
    {children}
  </div>
)

const SubHeader = ({ darkMode, children }) => (
  <div style={{
    color: `${darkMode ?  '#FAFAFA' : '#1F1F1F'}`,
    marginTop: '10px',
    fontSize: '12px'
  }}>
      {children}
  </div>
)


export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
  darkMode
}: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: null | (() => void)
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
  darkMode: boolean
}) {
  const content = (
    <OptionCardClickable disabled={false} darkMode={darkMode} onClick={() => onClick()} clickable={clickable && !active} active={active}>
      <OptionCardLeft>
        <HeaderText darkMode={darkMode} color={color}>
          {active ? (
            <CircleWrapper>
              <GreenCircle>
                <div style={{
                  height: '8px',
                  width: '8px',
                  marginRight: '8px',
                  backgroundColor: '#27AE60',
                  borderRadius: '50%'
                }}/>
              </GreenCircle>
            </CircleWrapper>
          ) : (
            ''
          )}
          {header}
        </HeaderText>
        {subheader && <SubHeader darkMode={darkMode}>{subheader}</SubHeader>}
      </OptionCardLeft>
      <IconWrapper>
        <img height={'24px'} src={icon} alt={'Icon'} />
      </IconWrapper>
    </OptionCardClickable>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}
