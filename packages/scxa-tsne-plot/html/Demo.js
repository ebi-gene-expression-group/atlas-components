import React from 'react'
import ReactDOM from 'react-dom'
import TsnePlotView from '../src/index'
import {find as _find} from "lodash"

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
  ks: [8, 14, 17, 19, 26, 35, 44, 53, 60],
  metadata: [
    {
      value: `genotype`,
      label: `Genotype`
    }
  ]
}

//Image export fails for the large experiments
// Number of cells: 32,369
const experiment5 = {
  accession: `E-HCAD-14`,
  species: `Mus musculus`,
  perplexities: [25],
  ks: [11],
  metadata: [
    {
      value: `lung`,
      label: `Organism part`
    }
  ]
}

// Big chunk of Not Available points
// Number of cells: 101,843
const experiment6 = {
  accession: `E-MTAB-5061`,
  accessKey: `f60a21b8-990a-49d9-95aa-623c10865faa`,
  species: `Homo sapiens`,
  ks: [20],
  metadata: [
    {
      value: `inferred cell type - authors labels`,
      label: `inferred cell type - authors labels`
    },
    {
      value: `inferred cell type - ontology labels`,
      label: `inferred cell type - ontology labels`
    }
  ],
  defaultPlotMethodAndParameterisation: {"t-SNE": {"perplexity": 50}, "UMAP": {"n_neighbors": 100}},
  plotTypesAndOptions: {
    "t-SNE": [{ "perplexity": 40 }, { "perplexity": 25 }, { "perplexity": 45 },{ "perplexity": 1 },{ "perplexity": 30 },
    {"perplexity": 10 },{ "perplexity": 15 },{ "perplexity": 50 },{ "perplexity": 35 },{ "perplexity": 20 },{ "perplexity": 5 }],
    "UMAP": [{"n_neighbors": 5},{"n_neighbors": 100},{"n_neighbors": 50},{"n_neighbors": 10},{"n_neighbors": 30},{"n_neighbors": 15},{"n_neighbors": 3}]
  }
}

const experimentOmega = {
  accession: `E-HCAD-4`,
  species: `Homo sapiens`,
  perplexities: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  ks: [9, 13, 16, 36, 51],
  metadata: [
    {
      value: `characteristic_cell_type`,
      label: `Cell type`
    },
    {
      value: `characteristic_developmental_stage`,
      label: `Developmental stage`
    },
    {
      value: `characteristic_sex`,
      label: `Sex`
    }
  ]
}

const { accession, accessKey, ks, metadata, species, plotTypesAndOptions, defaultPlotMethodAndParameterisation} = experiment6

const plotTypeDropdown =  [
  {
    plotType: Object.keys(defaultPlotMethodAndParameterisation)[0],
    plotOptions: plotTypesAndOptions[Object.keys(defaultPlotMethodAndParameterisation)[0]]
  },
  {
    plotType: Object.keys(defaultPlotMethodAndParameterisation)[1],
    plotOptions: plotTypesAndOptions[Object.keys(defaultPlotMethodAndParameterisation)[1]]
  }
]

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedPlotType: Object.keys(defaultPlotMethodAndParameterisation)[0],
      geneId: ``,
      selectedPlotOption: Object.values(Object.values(defaultPlotMethodAndParameterisation)[0])[0],
      selectedPlotOptionLabel: Object.keys(Object.values(defaultPlotMethodAndParameterisation)[0])[0] + ": " + Object.values(Object.values(defaultPlotMethodAndParameterisation)[0])[0],
      selectedColourBy: ks[Math.round((ks.length -1) / 2)].toString(),
      highlightClusters: [],
      experimentAccession: accession,
      selectedColourByCategory: `clusters`
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

  /*
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
   */

  render() {
    return(
      <div className={`row column expanded`}>
        <TsnePlotView
          atlasUrl={`https://wwwdev.ebi.ac.uk/gxa/sc/`}
          suggesterEndpoint={`json/suggestions`}
          experimentAccession={this.state.experimentAccession}
          accessKey={accessKey}
          wrapperClassName={`row expanded`}
          clusterPlotClassName={`small-12 large-6 columns`}
          expressionPlotClassName={`small-12 large-6 columns`}
          selectedPlotOption={this.state.selectedPlotOption}
          selectedPlotType={this.state.selectedPlotType}
          ks={ks}
          metadata={metadata}
          selectedColourByCategory={this.state.selectedColourByCategory}
          plotTypeDropdown={plotTypeDropdown}
          selectedPlotOptionLabel={this.state.selectedPlotOptionLabel}
          onChangePlotTypes={
              (plotOption) => {
                this.setState({
                  selectedPlotType: plotOption.value,
                  selectedPlotOption: defaultPlotMethodAndParameterisation[plotOption.value],
                  selectedPlotOptionLabel: Object.keys(defaultPlotMethodAndParameterisation[plotOption.value])[0]
                      + ": " + Object.values(defaultPlotMethodAndParameterisation[plotOption.value])[0],
                })}
          }
          onChangePlotOptions={
            (plotOption) => {
              this.setState({
                selectedPlotOption: plotOption.value,
                selectedPlotOptionLabel: plotOption.label
              })}
          }
          selectedColourBy={this.state.selectedColourBy}
          highlightClusters={this.state.highlightClusters}
          geneId={this.state.geneId}
          speciesName={species}
          onChangeColourBy={
            (colourByCategory, colourByValue) => {
              this.setState({
                selectedColourBy : colourByValue,
                selectedColourByCategory : colourByCategory

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
