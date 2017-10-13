import React from 'react'
import ReactDOM from 'react-dom'
import ExperimentPageView from '../src/index'

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputHighlightClusters: ``,
      highlightClusters: []
    }

    this._handleChange = this._handleChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleChange(event) {
    this.setState({
      inputHighlightClusters: event.target.value
    })
  }

  _handleSubmit(event) {
    event.preventDefault()

    this.setState({
      highlightClusters: this.state.inputHighlightClusters.split(`,`).map((e) => e.trim()).filter((e) => e.length)
    })
  }

  render() {
    return(
      <div className={`row column`}>
        <div className={`row column`}>
          <form onSubmit={this._handleSubmit}>
            <label>Highlight clusters (cluster names separated by commas):</label>
            <input type={`text`} onChange={this._handleChange} value={this.state.inputHighlightClusters}/>
            <input className={`button`} type="submit" value="Submit" />
          </form>
        </div>

        <ExperimentPageView atlasUrl={`http://localhost:9090/gxa_sc/`}
                            suggesterEndpoint={`json/suggestions`}
                            experimentAccession={`E-MTAB-4388`}
                            availableClusters={[`2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`]}
                            perplexityArray={[`1`, `2`, `3`, `4`, `5`, `6`]}
                            highlightClusters={this.state.highlightClusters}
        />
      </div>
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}
