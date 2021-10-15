import React from 'react'
import PropTypes from 'prop-types'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import highchartsSunburst from 'highcharts/modules/sunburst'

highchartsSunburst(Highcharts)

// SUPER HACK!
// https://github.com/highcharts/highcharts/issues/4994
window.Highcharts = Highcharts

class CellTypeWheel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      chartOptions: {
        credits: {
          enabled: false
        },

        chart: {
          height: `100%`
        },

        // Let the center circle be transparent
        colors: [
          `transparent`,
          `#7cb5ec`,
          `#90ed7d`,
          `#8085e9`,
          `#f7a35c`,
          `#f15c80`,
          `#e4d354`,
          `#2b908f`,
          `#f45b5b`,
          `#91e8e1`
        ],

        title: {
          text: `Cell type results of ${props.searchTerm}`,
          widthAdjust: -250,
          style: {
            fontSize: `25px`,
            fontWeight: `bold`
          }
        },

        series: [{
          type: `sunburst`,
          data: props.data,
          allowDrillToNode: true,
          cursor: `pointer`,
          point: {
            events: {
              click: function () {
                let clickedLevel = this.node.level
                if (clickedLevel === 4)
                  props.onCellTypeWheelClick(this.name)
              }
            }
          },
          dataLabels: {
            format: `{point.name}`,
            rotationMode: `circular`
          },
          levels: [{
            level: 2,
            colorByPoint: true
          }, {
            level: 3,
            colorVariation: {
              key: `brightness`,
              to: -0.25
            }
          }, {
            level: 4,
            colorVariation: {
              key: `brightness`,
              to: 0.35
            }
          }]
        }]
      }
    }
  }

  render() {
    const { chartOptions } = this.state

    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
    )
  }
}

CellTypeWheel.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onCellTypeWheelClick: PropTypes.func
}

export default CellTypeWheel
