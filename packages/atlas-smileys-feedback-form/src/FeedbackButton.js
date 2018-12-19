import React from 'react'
import styled from 'styled-components'
import Popup from 'react-popup'

import Prompt from './Prompt'
import ReactGA from 'react-ga'

ReactGA.initialize('UA-131036461-1')
ReactGA.pageview(window.location.pathname + window.location.search)

const FeedbackButtonDiv = styled.button`
  position:fixed;
  bottom:40%;
  right:0px;
  display: inline-block;
  border-radius: 0px;
  background-color: #3497c5;
  border: none;
  color: white;
  text-align: center;
  font-size: 18px;
  padding: 2px;
  width: 120px;
  height: 30px;
  transition: all 0.2s;
  margin: -40px;
  &:hover {
    background-color: #2f5767;
    cursor: pointer;
  }
  box-shadow: 2px 2px 3px #999;
  -ms-transform: rotate(-90deg); /* IE 9 */
  -webkit-transform: rotate(-90deg); /* Safari 3-8 */
  transform: rotate(-90deg);
`

const FeedbackButton = () =>
  <div>
    <Popup/>
    <FeedbackButtonDiv onClick={onClick}>
      <i className="icon icon-common icon-comment-alt"></i> Feedback
    </FeedbackButtonDiv>
  </div>

const onClick = () => {
  Popup.registerPlugin(`prompt`, function (defaultValue, placeholder, callback) {
    let promptValue, smiley = null

    const promptChange = function (inputValue) {
      promptValue = inputValue
    }

    const smileyChange = function (smileyValue) {
      smiley = smileyValue
    }

    this.create({
      title: `Your feedback`,
      content: <Prompt onChange={promptChange} onSelect={smileyChange} placeholder={placeholder} value={defaultValue} />,
      buttons: {
        left: [`cancel`],
        right: [{
          text: `Save`,
          key: `⌘+s`,
          className: `success`,
          action: function () {
            callback(promptValue)
            smiley && ReactGA.event({
              category: `Satisfaction`,
              action: `smiley`
            })
            smiley && Popup.close()
          }
        }]
      }
    })
  })

  Popup.plugins().prompt(``, `Type your comment`, function (value) {
    Popup.alert(`Thank you for submitting your feedback.`)

    ReactGA.event({
      category: 'Comments',
      action: value
    })
  })

}

export default FeedbackButton
