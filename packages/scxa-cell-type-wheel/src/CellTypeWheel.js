import React from 'react'
import PropTypes from 'prop-types'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import highchartsSunburst from 'highcharts/modules/sunburst'
import HighchartsNoData from 'highcharts/modules/no-data-to-display'

import _ from 'lodash'

async function addModules () {
  HighchartsNoData(Highcharts)
  highchartsSunburst(Highcharts)
}

addModules()

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

        lang: {
          noData: `There are no results for this search: ${props.searchTerm} for ${props.species}.`
        },
        noData: {
          style: {
            fontWeight: `bold`,
            fontSize: `16px`,
            color: `#000000`
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
                if (props.allSpecies && props.allSpecies.includes(props.searchTerm) && this.node.level === 3) {
                  props.onCellTypeWheelClick(this.name, props.searchTerm, this.experimentAccessions)
                }
                if (this.node.level === 4) {
                  const species = _.split(this.id, `#`, 1)
                  props.onCellTypeWheelClick(this.name, species[0], this.experimentAccessions)
                }
              }
            }
          },
          dataLabels: {
            format: `{point.name}`
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
  allSpecies: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      parent: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      experimentAccessions: PropTypes.arrayOf(PropTypes.string)
    })).isRequired,
  species: PropTypes.string.isRequired,
  onCellTypeWheelClick: PropTypes.func
}

export default CellTypeWheel
