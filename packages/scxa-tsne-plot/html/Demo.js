import React from 'react'
import ReactDOM from 'react-dom'
import TsnePlotView from '../src/index'

const perplexities = [1, 5, 10, 15, 20]
const ks = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const metadata = [
  {
    value: `characteristic_inferred_cell_type`,
    label: `Inferred cell type`
  },
  {
    value: `factor_sampling_site`,
    label: `Sampling site`
  },
  {
    value: `factor_time`,
    label: `Time`
  }]

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      perplexity: perplexities[Math.round((perplexities.length - 1) / 2)],
      geneId: `ENSG00000111640`,
      selectedColourBy: ks[Math.round((ks.length -1) / 2)].toString(),
      selectedColourByCategory: `clusters`,
      highlightClusters: [],
      experimentAccession: `E-EHCA-2`
    }

    this.experimentAccessionInput = React.createRef()
    this.highlightClustersInput = React.createRef()

    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleSubmit(event) {
    this.setState({
      experimentAccession: this.experimentAccessionInput.current.value,
      highlightClusters: this.highlightClustersInput.current.value.split(`,`).map((e) => parseInt(e.trim())).filter((e) => !isNaN(e))
    })

    event.preventDefault()
  }

  _resetHighlightClusters() {
    this.setState({
      highlightClusters: [] // reset highlight clusters
    })
    this.highlightClustersInput.current.value = `` // reset the form field
  }

  render() {
    return(
      <div className={`row column expanded`}>
        <div className={`row column expanded`}>
          <form onSubmit={this._handleSubmit}>
            <label>Highlight clusters (cluster integer IDs separated by commas):
              <input name={`inputHighlightClusters`} type={`text`} ref={this.highlightClustersInput} defaultValue={``}/>
            </label>
            <label>Experiment accession:
              <input name={`inputExperimentAccession`} type={`text`} ref={this.experimentAccessionInput} defaultValue={this.state.experimentAccession}/>
            </label>
            <button className={`button`} type="submit">Submit</button>
          </form>
        </div>

        <TsnePlotView
          atlasUrl={`http://localhost:8080/gxa/sc/`}
          suggesterEndpoint={`json/suggestions`}
          experimentAccession={this.state.experimentAccession}
          wrapperClassName={`row expanded`}
          clusterPlotClassName={`small-12 large-6 columns`}
          expressionPlotClassName={`small-12 large-6 columns`}
          perplexities={perplexities}
          selectedPerplexity={this.state.perplexity}
          ks={ks}
          metadata={metadata}
          selectedColourBy={this.state.selectedColourBy}
          selectedColourByCategory={this.state.selectedColourByCategory} // Is the plot coloured by clusters or metadata
          highlightClusters={this.state.highlightClusters}
          geneId={this.state.geneId}
          speciesName={`Homo sapiens`}
          onChangePerplexity={
            (perplexity) => { this.setState({perplexity: perplexity}) }
          }
          onChangeColourBy={
            (colourByCategory, colourByValue) => {
              this.setState({
                selectedColourBy : colourByValue,
                selectedColourByCategory : colourByCategory,
              })
              this._resetHighlightClusters()
            }
          }
          onSelectGeneId={
            (geneId) => {
              this.setState({
                geneId: geneId,
              })
              this._resetHighlightClusters()
            }
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
