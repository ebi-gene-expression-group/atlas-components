import React from 'react'
import ReactDOM from 'react-dom'

import FacetedSearchContainer from '../src/FacetedSearchContainer'
import EpisodeCard from './EpisodeCard'

const render = (target) => {
  const episodes =  [
    {
      element: {
        title: `Raising Gazorpazorp`
      },
      facets: [
        {
          group: `Planet`,
          value: `gazorpazorp`,
          label: `Gazorpazorp`
        },
        {
          group: `Guest character`,
          value: `gwendolyn`,
          label: `Gwendolyn`
        },
        {
          group: `Guest character`,
          value: `ma-sha`,
          label: `Ma-Sha`
        },
        {
          group: `Season`,
          value: `1`,
          label: `1`
        }
      ]
    },
    {
      element: {
        title: `The wedding squanchers`
      },
      facets: [
        {
          group: `Planet`,
          value: `squanch`,
          label: `Squanch`
        },
        {
          group: `Guest character`,
          value: `birdperson`,
          label: `Birdperson`
        },
        {
          group: `Guest character`,
          value: `squanchy`,
          label: `Squanchy`
        },
        {
          group: `Season`,
          value: `2`,
          label: `2`
        }
      ]
    },
    {
      element: {
        title: `The Rickshank redemption`
      },
      facets: [
        {
          group: `Guest character`,
          value: `birdperson`,
          label: `Birdperson`
        },
        {
          group: `Planet`,
          value: `buttworld`,
          label: `Buttworld`
        },
        {
          group: `Season`,
          value: `3`,
          label: `3`
        }
      ]
    },
    {
      element: {
        title: `Ricksy business`
      },
      facets: [
        {
          group: `Guest character`,
          value: `squanchy`,
          label: `Squanchy`
        },
        {
          group: `Guest character`,
          value: `abradolf_lincler`,
          label: `Abradolf Lincler`
        },
        {
          group: `Season`,
          value: `1`,
          label: `1`
        }
      ]
    },
    {
      element: {
        title: `Close Rick-counters of the Rick kind`
      },
      facets: [
        {
          group: `Guest character`,
          value: `ricktiminus_sancheziminius`,
          label: `Ricktiminus Sancheziminius`
        },
        {
          group: `Guest character`,
          value: `abradolf_lincler`,
          label: `Abradolf Lincler`
        },
        {
          group: `Planet`,
          value: `buttworld`,
          label: `Buttworld`
        },
        {
          group: `Season`,
          value: `1`,
          label: `1`
        }
      ]
    }
  ]

  ReactDOM.render(
    <FacetedSearchContainer results={episodes}
                            ResultElementClass={EpisodeCard}
                            checkboxFacetGroups={[`Season`]}
                            resultsMessage={`Search results`}/>,
    document.getElementById(target))
}

export {render}
