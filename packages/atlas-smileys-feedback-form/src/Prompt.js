import React from 'react'
import { Emoji } from 'emoji-mart'
import styled from 'styled-components'

const SmileyFace = styled.div`
  transition: all 0.5s;
  cursor: pointer;
  opacity: ${props => props.status ? 1.0 : 0.2};
  &:hover {
    opacity: 1.0
  };
`

const SmileyContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

class Prompt extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.defaultValue,
      smileyDescription: ``,
      chosenSmiley: ``,
      required: this.props.required
    }

    this.onChange = (e) => this._onChange(e)
    this.onClick = this.onClick.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.required !== state.required) {
      return {
        required: props.required
      }
    }
    // No state update necessary
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.props.onChange(this.state.value, this.state.chosenSmiley)
    }
  }

  _onChange(e) {
    let value = e.target.value
    this.setState({value: value})
  }

  onClick(description){
    this.setState({
      chosenSmiley: description
    })
    this.props.onSelect(description)
  }

  render() {
    const {smileyDescription, chosenSmiley, value} = this.state
    const smileyScale = [`Terrible`, `Bad`, `Okay`, `Good`, `Great`]
    const smileyId = [`disappointed`, `slightly_frowning_face`, `neutral_face`, `grin`, `satisfied`]

    return[
      <p>How satisfied are you ?</p>,
      <br/>,
      <SmileyContainer>
        {
          smileyScale.map((scale, idx) =>
            <SmileyFace key={scale} status={chosenSmiley === scale}>
              <Emoji emoji={{id: smileyId[idx], skin: 3}} size={40} set={`emojione`}
                onLeave={() => this.setState({smileyDescription: ``})}
                onOver={() => this.setState({smileyDescription: scale})}
                onClick={() => this.onClick(scale, idx)}/>
            </SmileyFace>
          )
        }
      </SmileyContainer>,
      <p id={`scale`} style={{visibility: chosenSmiley || smileyDescription ? `visible` : `hidden`, textAlign: `center`}}>
        {chosenSmiley || smileyDescription ?
          smileyDescription ? smileyDescription : chosenSmiley
          :
          `empty`}
      </p>,
      <p style={{visibility: value && !chosenSmiley ? `visible` : `hidden`, color: `red`}}>This is required field.</p>,
      <br/>,
      <p>Would you like to add a comment ?</p>,
      <input type="text" placeholder={this.props.placeholder} className="mm-popup__input" value={this.state.value} onChange={this.onChange} />
    ]
  }
}

export default Prompt