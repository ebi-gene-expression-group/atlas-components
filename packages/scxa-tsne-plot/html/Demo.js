import React from 'react'
import ReactDOM from 'react-dom'
import TsnePlotView from '../src/index'

// Tabula Muris: 53 759 cells
const experiment1 = {
  accession: `E-ENAD-15`,
  species: `Mus musculus`,
  perplexities: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  ks: [16, 28, 35, 50, 65, 73],
  metadata: [
    {
      value: `characteristic_inferred_cell_type`,
      label: `Inferred cell type`
    }
  ]
}

// 48 001 cells
const experiment2 = {
  accession: `E-MTAB-6701`,
  species: `Homo sapiens`,
  perplexities: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  ks: [8, 21, 43, 53, 63],
  metadata: [
    {
      value: `characteristic_inferred_cell_type`,
      label: `Inferred cell type`
    }
  ]
}

// 12 362 cells
const experiment3 = {
  accession: `E-MTAB-7376`,
  species: `Mus musculus`,
  perplexities: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  ks: [3, 7, 8, 9, 14, 24, 35, 48, 59],
  metadata: [
    {
      value: `characteristic_inferred_cell_type`,
      label: `Inferred cell type`
    }
  ]
}

// 8 740 cells, Boost off
const experiment4 = {
  accession: `E-MTAB-7324`,
  species: `Mus musculus`,
  perplexities: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  ks: [8, 12, 15, 18, 29, 37, 48, 50],
  metadata: [
    {
      value: `characteristic_inferred_cell_type`,
      label: `Inferred cell type`
    }
  ]
}

const { accession, perplexities, ks, metadata, species } = experiment1

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      perplexity: perplexities[Math.round((perplexities.length - 1) / 2)],
      geneId: ``,
      selectedColourBy: ks[Math.round((ks.length -1) / 2)].toString(),
      selectedColourByCategory: `clusters`,
      highlightClusters: [],
      experimentAccession: accession
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
            <label className={`margin-bottom-large`}>Experiment accession:
              <input name={`inputExperimentAccession`} type={`text`} ref={this.experimentAccessionInput} defaultValue={this.state.experimentAccession}/>
            </label>
            <button className={`button`} type="submit">Submit</button>
          </form>
        </div>

        <TsnePlotView
          atlasUrl={`http://ves-hx-76:8080/gxa/sc/`}
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
          speciesName={species}
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
              this.setState({ geneId: geneId })
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
