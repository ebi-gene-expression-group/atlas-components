import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Smiley = styled.div`
  transition: all 0.5s;
  text-align: center;
  cursor: pointer;
  ::before {
    font-size: 2.5rem;
    transition: inherit;
    content: '${props => props.emoji}';
    opacity: ${props => props.selected ? 1.0 : 0.2};
  }
  :hover::before {
    opacity: 1.0
  }

  ::after {
    font-size: 1rem;
    transition: inherit;
    content: '${props => props.label}';
    opacity: ${props => props.selected ? 1.0 : 0.0};
  }
  :hover::after {
    opacity: 1.0
  }

`

Smiley.propTypes = {
  emoji: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired
}

export default Smiley
