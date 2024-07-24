import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeWheel from '../src/index'

import cancer from './data/cancer.json'
import covid19 from './data/covid-19.json'
import lung from './data/lung.json'
import pancreas from './data/pancreas.json'
import leukocyte from './data/leukocyte.json'
import tcell from './data/t_cell.json'
import musmusculus from './data/mus-musculus.json'

const data = {
  lung: lung,
  pancreas: pancreas,
  "COVID-19": covid19,
  leukocyte: leukocyte,
  cancer: cancer,
  "T cell": tcell,
  "Mus musculus": musmusculus
}

const allSpecies = [
    `Meeseek`,
    `Gromflomite`,
    `Cromulon`,
    `Zigerion`,
    `Moopian`,
    `Bliznarvian`,
    `Greebybobe`,
    `Mus musculus`
]

const render = (options, dataKey, target) => {
  ReactDOM.render(
      <CellTypeWheel
          {...options}
          searchTerm={dataKey}
          data={data[dataKey]}
          allSpecies={allSpecies}
          onCellTypeWheelClick={
            (name, species, experimentAccessions) => console.log(name, species, experimentAccessions)}
      />, document.getElementById(target))
}

export { render }
