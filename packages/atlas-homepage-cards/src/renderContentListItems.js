import React from 'react'

const renderContentListItems = (content) =>
  content.map((item, index) => {
    const key = `${item.text}-${index}`

    return item.url ?
      <li style={{marginBottom: `0.3rem`}} key={key}>
        <a href={item.url}>{item.text}</a>
      </li> :
      <li style={{marginBottom: `0.3rem`}} key={key}>{item.text}</li>
  })

export default renderContentListItems
