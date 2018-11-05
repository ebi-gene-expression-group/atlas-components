import React from 'react'
import ReactDOM from 'react-dom'

import FetchLoader from '../src/index.js'

const ks = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      experimentAccession: `E-MTAB-5061`,
      // experimentAccession: `E-GEOD-99058`,
      selectedK: ks[0]
      // selectedK: 17
    }
  }

  render() {
    return (
      <FetchLoader
        resource={`json/experiments/${this.state.experimentAccession}/marker-genes/${this.state.selectedK}`}
        host={`http://localhost:8080/gxa/sc/`}
        selectedK={this.state.selectedK}
      />
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}