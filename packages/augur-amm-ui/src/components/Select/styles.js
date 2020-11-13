import theme from '../Theme/Theme'
const color = theme.colors

export const customStyles = {
  control: (styles, state) => ({
    ...styles,
    borderRadius: 20,
    backgroundColor: 'white',
    color: '#6C7284',
    maxHeight: '32px',
    margin: 0,
    padding: 0,
    border: 'none',
    boxShadow: 'none',
    ':hover': {
      borderColor: color.zircon,
      cursor: 'pointer',
      overflow: 'hidden'
    }
  }),
  placeholder: styles => ({
    ...styles,
    color: '#6C7284'
  }),
  input: styles => ({
    ...styles,
    color: '#6C7284',
    overflow: 'hidden'
  }),
  singleValue: styles => ({
    ...styles,
    color: '#6C7284',
    width: '100%',
    paddingRight: '8px'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: styles => ({
    ...styles,
    color: '#6C7284',
    paddingRight: 0
  }),
  valueContainer: styles => ({
    ...styles,
    paddingLeft: 16,
    textAlign: 'right',
    overflow: 'scroll'
  }),
  menuPlacer: styles => ({
    ...styles
  }),
  option: (styles, state) => ({
    ...styles,
    margin: '0px 0px',
    padding: 'calc(12px - 1px) calc(12px - 1px)',
    width: '',
    lineHeight: 1,
    color: state.isSelected ? '#000' : '',
    border: state.isSelected ? '1px solid var(--c-zircon)' : '1px solid transparent',
    borderRadius: state.isSelected && 30,
    backgroundColor: state.isSelected ? 'var(--c-alabaster)' : '',
    ':hover': {
      backgroundColor: 'var(--c-alabaster)',
      cursor: 'pointer'
    }
  }),
  menu: styles => ({
    ...styles,
    borderRadius: 16,
    boxShadow: '0 4px 8px 0 rgba(47, 128, 237, 0.1), 0 0 0 0.5px var(--c-zircon)',
    overflow: 'hidden',
    padding: 0
  }),
  menuList: styles => ({
    ...styles,
    color: color.text,
    padding: 0
  })
}

export const customStylesMobile = {
  control: (styles, state) => ({
    ...styles,
    borderRadius: 12,
    backgroundColor: 'white',
    color: '#6C7284',
    maxHeight: '32px',
    margin: 0,
    padding: 0,
    boxShadow: 'none',
    ':hover': {
      borderColor: color.zircon,
      cursor: 'pointer'
    }
  }),
  placeholder: styles => ({
    ...styles,
    color: '#6C7284'
  }),
  input: styles => ({
    ...styles,
    color: '6C7284',
    overflow: 'hidden'
  }),
  singleValue: styles => ({
    ...styles,
    color: '#6C7284'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: styles => ({
    ...styles,
    paddingRight: 0
  }),
  valueContainer: styles => ({
    ...styles,
    paddingLeft: 16
  }),
  menuPlacer: styles => ({
    ...styles
  }),
  option: (styles, state) => ({
    ...styles,
    margin: '20px 4px',
    padding: 'calc(16px - 1px) 16x',
    width: '',
    lineHeight: 1,
    color: state.isSelected ? '#000' : '',
    // border: state.isSelected ? '1px solid var(--c-zircon)' : '1px solid transparent',
    borderRadius: state.isSelected && 30,
    backgroundColor: state.isSelected ? 'var(--c-alabaster)' : '',
    ':hover': {
      backgroundColor: 'var(--c-alabaster)',
      cursor: 'pointer'
    }
  }),
  menu: styles => ({
    ...styles,
    borderRadius: 20,
    boxShadow: '0 4px 8px 0 rgba(47, 128, 237, 0.1), 0 0 0 0.5px var(--c-zircon)',
    overflow: 'hidden',
    paddingBottom: '12px'
  }),
  menuList: styles => ({
    ...styles,
    color: color.text,
    padding: '8px'
  })
}

export const customStylesTime = {
  control: (styles, state) => ({
    ...styles,
    borderRadius: 20,
    backgroundColor: 'white',
    color: '#6C7284',
    maxHeight: '32px',
    margin: 0,
    padding: 0,
    border: 'none',
    boxShadow: 'none',
    ':hover': {
      borderColor: color.zircon,
      cursor: 'pointer'
    }
  }),
  placeholder: styles => ({
    ...styles,
    color: '#6C7284'
  }),
  input: styles => ({
    ...styles,
    color: 'transparent'
  }),
  singleValue: styles => ({
    ...styles,
    color: '#6C7284',
    width: '100%',
    paddingRight: '8px'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: styles => ({
    ...styles,
    color: '#6C7284',
    paddingRight: 0
  }),
  valueContainer: styles => ({
    ...styles,
    paddingLeft: 16,
    overflow: 'visible',
    textAlign: 'right'
  }),
  menuPlacer: styles => ({
    ...styles
  }),
  option: (styles, state) => ({
    ...styles,
    margin: '0px 0px',
    padding: 'calc(12px - 1px) calc(24px - 1px)',
    width: '',
    lineHeight: 1,
    color: state.isSelected ? '#000' : '',
    border: state.isSelected ? '1px solid var(--c-zircon)' : '1px solid transparent',
    borderRadius: state.isSelected && 30,
    backgroundColor: state.isSelected ? 'var(--c-alabaster)' : '',
    ':hover': {
      backgroundColor: 'var(--c-alabaster)',
      cursor: 'pointer'
    }
  }),
  menu: styles => ({
    ...styles,
    borderRadius: 16,
    boxShadow: '0 4px 8px 0 rgba(47, 128, 237, 0.1), 0 0 0 0.5px var(--c-zircon)',
    overflow: 'hidden',
    padding: 0
  }),
  menuList: styles => ({
    ...styles,
    color: color.text,
    padding: 0
  })
}

export default customStyles
