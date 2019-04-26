import PropTypes from 'prop-types'
import styled from 'styled-components'

const SmileyDiv = styled.div`
  transition: all 0.5s;
  text-align: center;
  display: grid;
  flex: 1;
  cursor: pointer;
  ::before {
    font-size: 2.5rem;
    transition: inherit;
    font-family: Segoe UI Emoji;
    content: '${props => props.emoji}';
    opacity: ${props => props.selected ? 1.0 : 0.2};
    display: inline-block;
  }
  :hover::before {
    opacity: 1.0
  }

  ::after {
    font-size: 1rem;
    transition: inherit;
    content: '${props => props.label}';
    opacity: ${props => props.selected ? 1.0 : 0.0};
     display: inline-block;
  }
  :hover::after {
    opacity: 1.0
  }

`

SmileyDiv.propTypes = {
  emoji: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired
}

export default SmileyDiv
