import React from 'react'
import ReactDOM from 'react-dom'
import ExperimentPageView from '../src/index'

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      k: 2,
      perplexity: 1,
      geneId: ``,
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
            <label>Highlight clusters (cluster integer IDs separated by commas):</label>
            <input type={`text`} onChange={this._handleChange} value={this.state.inputHighlightClusters}/>
            <input className={`button`} type="submit" value="Submit" />
          </form>
        </div>

        <ExperimentPageView atlasUrl={`http://localhost:8080/gxa_sc/`}
                            suggesterEndpoint={`json/suggestions`}
                            experimentAccession={`E-MTAB-4388`}
                            perplexities={[1, 2, 3, 4, 5, 6]}
                            perplexity={this.state.perplexity}
                            ks={[2, 3, 4, 5, 6, 7, 8, 9, 10]}
                            k={this.state.k}
                            highlightClusters={this.state.highlightClusters}
                            geneId={this.state.geneId}
                            onChangePerplexity={
                              (perplexity) => { this.setState({perplexity: perplexity}) }
                            }
                            onChangeK={
                              (k) => { this.setState({k: k}) }
                            }
                            onSelectGeneId={
                              (geneId) => { this.setState({geneId: geneId}) }
                            }
        />
      </div>
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}
