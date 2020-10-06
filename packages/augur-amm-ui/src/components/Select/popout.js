import React, { Component } from 'react'
import { Button } from 'rebass'
import styled from 'styled-components'

import Select from 'react-select'

const selectStyles = {
  control: styles => ({
    ...styles,
    padding: '1rem',
    border: 'none',
    backgroundColor: 'transparent',
    borderBottom: '1px solid #e1e1e1',
    boxShadow: 'none',
    borderRadius: 0,
    ':hover': {
      borderColor: '#e1e1e1'
    }
  }),
  valueContainer: styles => ({
    ...styles,
    padding: 0
  }),
  menu: () => null
}

export default class Popout extends Component {
  state = { isOpen: false, value: undefined }
  toggleOpen = () => {
    this.setState(state => ({ isOpen: !state.isOpen }))
  }

  onSelectChange = value => {
    this.toggleOpen()
    this.setState({ value })
  }

  render() {
    const { isOpen, value } = this.state
    return (
      <Dropdown
        isOpen={isOpen}
        onClose={this.toggleOpen}
        target={
          <Button
            border="text"
            color="text"
            variant="outline"
            onClick={this.toggleOpen}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {value ? value.label : 'Select...'}
          </Button>
        }
      >
        <Select
          autoFocus
          backspaceRemovesValue={false}
          components={{ DropdownIndicator, IndicatorSeparator: null }}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          isClearable={false}
          menuIsOpen
          onChange={this.onSelectChange}
          options={this.props.data}
          placeholder="Search..."
          styles={selectStyles}
          tabSelectsValue={false}
          value={value}
        />
      </Dropdown>
    )
  }
}

// styled components
const Wrapper = styled.div`
  @media only screen and (min-width: 768px) {
    max-width: 560px;
    max-height: 768px;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    border-radius: 1rem;
    padding-bottom: 1rem;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin-top: 4rem;
  }

  background-color: #fff;
  position: relative;
  bottom: 21rem;
  width: 100%;
  height: 21rem;
  z-index: 2000;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  transition: 0.25s ease-in-out;
`

const Menu = props => <Wrapper {...props} />

const Blanket = props => (
  <div
    style={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      position: 'fixed',
      zIndex: 1
    }}
    {...props}
  />
)

const Dropdown = ({ children, isOpen, target, onClose }) => (
  <>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </>
)

const DropdownIndicator = () => (
  <span role="img" aria-label="Search">
    🔎
  </span>
)
