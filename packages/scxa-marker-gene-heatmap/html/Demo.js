import React from 'react'
import ReactDOM from 'react-dom'

import HeatmapView from '../src/index.js'

// K values for E-MTAB-5061
const ks = [3, 7, 8, 9, 11, 19, 25, 26, 30]

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
      experimentAccession: `E-ENAD-27`,
      // experimentAccession: `E-EHCA-2`,
      // experimentAccession: `E-ENAD-19`,
      // experimentAccession: `E-GEOD-93593`,
      ks: ks,
      ksWithMarkers: [3, 7, 8, 9, 11, 19, 25, 26, 30],
      // ksWithMarkers: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      // ksWithMarkers: [4, 7, 9],
      // ksWithMarkers: [36, 37, 38, 39, 40, 41, 42, 42, 43, 44, 45, 46],
      selectedK: ks[3].toString()
      // selectedK: 17
    }
  }

  render() {
    return (
      <div style={{paddingBottom: `25px`}}>
        <HeatmapView
          wrapperClassName={`row expanded`}
          resource={`json/experiments/${this.state.experimentAccession}/marker-genes/${this.state.selectedK}`}
          host={`http://ves-hx-76:8080/gxa/sc/`}
          ks={this.state.ks}
          ksWithMarkers={this.state.ksWithMarkers}
          selectedK={this.state.selectedK}
          onSelectK={
            (k) => {
              this.setState({
                selectedK: parseInt(k)
              })
            }
          }
          species={`Homo sapiens`}
          hasDynamicHeight={true}
          heatmapRowHeight={20}
        />
      </div>
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}
