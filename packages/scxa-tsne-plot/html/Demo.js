import React from 'react'
import ReactDOM from 'react-dom'
import ExperimentPageView from '../src/index'

class Demo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <ExperimentPageView atlasUrl={`https://localhost:8443/gxa_sc/`}
                          suggesterEndpoint={`json/suggestions`}
                          experimentAccession={`E-MTAB-4388`}
                          availableClusters={[`2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`]}/>
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}
