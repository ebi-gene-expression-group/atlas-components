import React from 'react'
import PropTypes from 'prop-types'

const emojiData ={
  smiley: `😃`,
  disappointed: `😞`,
  pensive: `😔`,
  neutral_face: `😐`,
  grin: `😁`,
  satisfied: `😆`
}

const Emoji = ({emoji, onLeave, onOver, onClick}) =>{
  return   <span
    onClick={(e) => onClick(e)}
    onMouseEnter={(e) => onOver(e)}
    onMouseLeave={(e) => onLeave(e)}
    id={emoji}
    style={{fontSize: `40px`}}
  >
    {emojiData[emoji]}
  </span>
}

Emoji.propTypes={
  emoji: PropTypes.string.isRequired,
  onLeave: PropTypes.func.isRequired,
  onOver: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Emoji