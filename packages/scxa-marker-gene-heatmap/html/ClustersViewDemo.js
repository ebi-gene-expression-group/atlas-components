import React from 'react'
import ReactDOM from 'react-dom'
import URI from 'urijs'

import HeatmapView from '../src/clustersView/ClustersHeatmapView'

// K values for E-MTAB-5061
const ks = ['8','11','19','21','25']

// K values for E-EHCA-2
// const ks = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

// K values for E-ENAD-19
// const ks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

// K values for E-GEOD-93593
// const ks = [36, 37, 38, 39, 40, 41, 42, 42, 43, 44, 45, 46]


class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      experimentAccession: `E-MTAB-5061`,
      // experimentAccession: `E-EHCA-2`,
      // experimentAccession: `E-ENAD-19`,
      // experimentAccession: `E-GEOD-93593`,
      ks: ks,
      //https://www.ebi.ac.uk/gxa/sc/json/experiments/E-MTAB-5061/metadata/tsneplot
      ksWithMarkers: ['8','11','19','21','25'],
      // ksWithMarkers: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      // ksWithMarkers: [4, 7, 9],
      // ksWithMarkers: [36, 37, 38, 39, 40, 41, 42, 42, 43, 44, 45, 46],
      selectedColourBy: 'inferred cell type - ontology labels',
      selectedColourByCategory: `metadata`,
      metadata: [
        {
          value:	"inferred cell type - ontology labels",
          label:	"Inferred cell type - ontology labels"
        },
        {
          value:    "inferred cell_type - authors labels",
          label:    "Inferred cell type - authors labels"
        },
        {
          value:    "individual",
          label:    "Individual"
        },
        {value:	"disease",
        label:	"Disease"}
      ],
      selectedClusterId: null
  }}

  render() {
    return (
      <div style={{paddingBottom: `25px`}}>
        <HeatmapView
          wrapperClassName={`row expanded`}
          resource={
            this.state.selectedColourByCategory == `metadata` ?
                URI(`json/experiments/${this.state.experimentAccession}/marker-genes-heatmap/cell-types`)
                    .search({cellGroupType: this.state.selectedColourBy})
                    .toString() :
                URI(`json/experiments/${this.state.experimentAccession}/marker-genes/clusters`)
                  .search({k: this.state.selectedColourBy})
                  .toString()
          }
          host={`http://localhost:8080/gxa/sc/`}
          ks={this.state.ks}
          ksWithMarkers={this.state.ksWithMarkers}
          selectedClusterCategory={this.state.selectedColourByCategory}
          selectedColourBy={this.state.selectedColourBy}
          selectedClusterId={this.state.selectedClusterId}
          cellTypes={this.state.cellTypes}
          onChangeClusterId={(colourByCategory, colourByValue) => {
            this.setState({
              selectedColourBy : colourByValue,
              selectedColourByCategory : colourByCategory,
              selectedClusterId: null
            })
          }}
          onChangeMarkerGeneFor={(selectedOption) => {
            this.setState((state) => ({
              selectedClusterId: selectedOption
            }))
          }}
          metadata={this.state.metadata}
          species={`Homo sapiens`}
        />
      </div>
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}
