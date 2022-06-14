import React from 'react'
import PropTypes from 'prop-types'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import highchartsSunburst from 'highcharts/modules/sunburst'

import _ from 'lodash'

highchartsSunburst(Highcharts)

class CellTypeWheel extends React.Component {
  constructor (props) {
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

        tooltip: {
          formatter: function () {
            return this.point.name
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
                if (this.node.level === 4) {
                  const species = _.split(this.id, `#`, 1)
                  props.onCellTypeWheelClick(this.name, species[0], this.experimentAccessions)
                }
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

  render () {
    const { chartOptions } = this.state

    return (
      <figure>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
        <figcaption style={ { visibility: `hidden` } }>
          {this.state.chartOptions.title.text}
        </figcaption>
      </figure>
    )
  }
}

CellTypeWheel.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      parent: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      experimentAccessions: PropTypes.arrayOf(PropTypes.string)
    })).isRequired,
  onCellTypeWheelClick: PropTypes.func
}

export default CellTypeWheel
