import React from 'react'
import ReactDOM from 'react-dom'
import ExperimentPageView from '../src/index'

const perplexities = [1, 5, 10, 15, 20]
const ks = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      k: ks[Math.round((ks.length -1) / 2)],
      perplexity: perplexities[Math.round((perplexities.length - 1) / 2)],
      geneId: ``,
      inputHighlightClusters: ``,
      highlightClusters: [],
      inputExperimentAccession: `E-ENAD-14`,
      experimentAccession: `E-ENAD-14`
    }

    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleInputChange(event) {
    const name = event.target.name

    this.setState({
      [name]: event.target.value
    })
  }

  _handleSubmit(event) {
    event.preventDefault()

    this.setState({
      experimentAccession: this.state.inputExperimentAccession,
      highlightClusters: this.state.inputHighlightClusters.split(`,`).map((e) => parseInt(e.trim())).filter((e) => !isNaN(e))
    })
  }

  render() {
    return(
      <div className={`row column`}>
        <div className={`row column`}>
          <form onSubmit={this._handleSubmit}>
            <label>Highlight clusters (cluster integer IDs separated by commas):</label>
            <input name={`inputHighlightClusters`} type={`text`} onChange={this._handleInputChange} value={this.state.inputHighlightClusters}/>
            <label>Experiment accession:</label>
            <input name={`inputExperimentAccession`} type={`text`} onChange={this._handleInputChange} value={this.state.inputExperimentAccession}/>
            <input className={`button`} type="submit" value="Submit" />
          </form>
        </div>

        <ExperimentPageView atlasUrl={`http://localhost:8080/gxa/sc/`}
                            suggesterEndpoint={`json/suggestions`}
                            experimentAccession={this.state.experimentAccession}
                            perplexities={perplexities}
                            selectedPerplexity={this.state.perplexity}
                            ks={ks}
                            selectedK={this.state.k}
                            highlightClusters={this.state.highlightClusters}
                            geneId={this.state.geneId}
                            speciesName={'Mus musculus'}
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
