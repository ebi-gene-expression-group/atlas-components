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
            label: `Gazorpazorp`,
            description: `Planet Tooltip`
          },
          {
            group: `Guest character`,
            value: `gwendolyn`,
            label: `Gwendolyn`,
            description: `The “Guest character” tooltip is very long so we can make sure that the tooltip text is conveniently broken into several lines to improve readability and it doesn’t overflow or cover elements in the view that we might want to read at the same time that the tooltip is being shown`
          },
          {
            group: `Guest character`,
            value: `ma-sha`,
            label: `Ma-Sha`,
            description: `The “Guest character” tooltip is very long so we can make sure that the tooltip text is conveniently broken into several lines to improve readability and it doesn’t overflow or cover elements in the view that we might want to read at the same time that the tooltip is being shown`
          },
          {
            group: `Season`,
            value: `1`,
            label: `1`,
            description: `Season Tooltip`
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
            label: `Squanch`,
            description: `Planet Tooltip`
          },
          {
            group: `Guest character`,
            value: `birdperson`,
            label: `Birdperson`,
            description: `The “Guest character” tooltip is very long so we can make sure that the tooltip text is conveniently broken into several lines to improve readability and it doesn’t overflow or cover elements in the view that we might want to read at the same time that the tooltip is being shown`
          },
          {
            group: `Guest character`,
            value: `squanchy`,
            label: `Squanchy`,
            description: `The “Guest character” tooltip is very long so we can make sure that the tooltip text is conveniently broken into several lines to improve readability and it doesn’t overflow or cover elements in the view that we might want to read at the same time that the tooltip is being shown`
          },
          {
            group: `Season`,
            value: `2`,
            label: `2`,
            description: `Season Tooltip`
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
            label: `Birdperson`,
            description: `The “Guest character” tooltip is very long so we can make sure that the tooltip text is conveniently broken into several lines to improve readability and it doesn’t overflow or cover elements in the view that we might want to read at the same time that the tooltip is being shown`
          },
          {
            group: `Planet`,
            value: `buttworld`,
            label: `Buttworld`,
            description: `Planet Tooltip`
          },
          {
            group: `Season`,
            value: `3`,
            label: `3`,
            description: `Season Tooltip`
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
            label: `Squanchy`,
            description: `The “Guest character” tooltip is very long so we can make sure that the tooltip text is conveniently broken into several lines to improve readability and it doesn’t overflow or cover elements in the view that we might want to read at the same time that the tooltip is being shown`
          },
          {
            group: `Guest character`,
            value: `abradolf_lincler`,
            label: `Abradolf Lincler`,
            description: `The “Guest character” tooltip is very long so we can make sure that the tooltip text is conveniently broken into several lines to improve readability and it doesn’t overflow or cover elements in the view that we might want to read at the same time that the tooltip is being shown`
          },
          {
            group: `Season`,
            value: `1`,
            label: `1`,
            description: `Season Tooltip`
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
            label: `Ricktiminus Sancheziminius`,
            description: `The “Guest character” tooltip is very long so we can make sure that the tooltip text is conveniently broken into several lines to improve readability and it doesn’t overflow or cover elements in the view that we might want to read at the same time that the tooltip is being shown`
          },
          {
            group: `Guest character`,
            value: `abradolf_lincler`,
            label: `Abradolf Lincler`,
            description: `The “Guest character” tooltip is very long so we can make sure that the tooltip text is conveniently broken into several lines to improve readability and it doesn’t overflow or cover elements in the view that we might want to read at the same time that the tooltip is being shown`
          },
          {
            group: `Planet`,
            value: `buttworld`,
            label: `Buttworld`,
            description: `Planet Tooltip`
          },
          {
            group: `Season`,
            value: `1`,
            label: `1`,
            description: `Season Tooltip`
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
