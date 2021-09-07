import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import '@babel/polyfill'
import fetchMock from 'fetch-mock'

import TSnePlotView from '../src/TSnePlotView'

describe(`TSnePlotView`, () => {

  beforeEach(() => {
    fetchMock.restore()
  })

  const testExperiment = {
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
    plotTypesAndOptions: {
      "tsne": [{ "perplexity": 40 }, { "perplexity": 25 }, { "perplexity": 45 },{ "perplexity": 1 },{ "perplexity": 30 },
        {"perplexity": 10 },{ "perplexity": 15 },{ "perplexity": 50 },{ "perplexity": 35 },{ "perplexity": 20 },{ "perplexity": 5 }],
      "umap": [{"n_neighbors": 5},{"n_neighbors": 100},{"n_neighbors": 50},{"n_neighbors": 10},{"n_neighbors": 30},{"n_neighbors": 15},{"n_neighbors": 3}]
    }
  }

  const { accession, accessKey, ks, metadata, species, plotTypesAndOptions } = testExperiment

  const plotTypeDropdown =  [
    {
      plotType: `UMAP`,
      plotOptions: plotTypesAndOptions.umap
    },
    {
      plotType: `tSNE`,
      plotOptions: plotTypesAndOptions.tsne
    }
  ]

  test(`matches snapshot`, () => {
    const tree = renderer
      .create(<TSnePlotView
        atlasUrl={``}
        metadata={metadata}
        accessKey={accessKey}
        suggesterEndpoint={``}
        ks={ks}
        geneId={``}
        selectedPlotType={`umap`}
        species={species}
        experimentAccession={accession}
        selectedPlotOption={5}
        plotTypeDropdown={plotTypeDropdown}
        selectedPlotOptionLabel={``}
      />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  test(`whether accessKey prop is passed or not`, async () => {
    const payload = {
      series: []
    }

    fetchMock.get(`/foo/json/cell-plots/` + accession + `/clusters/metadata/20?accessKey=` + accessKey + `&` , JSON.stringify(payload))

    const wrapper = shallow(
      <TSnePlotView
        atlasUrl={`foo/`}
        metadata={metadata}
        accessKey={accessKey}
        suggesterEndpoint={`json/suggestions`}
        ks={ks}
        selectedColourBy={`20`}
        selectedPlotType={`umap`}
        species={species}
        experimentAccession={accession}
        selectedPlotOption={5}
        plotTypeDropdown={plotTypeDropdown}
        selectedPlotOptionLabel={``}
      />
    )

    await wrapper.instance().componentDidMount()

    expect(wrapper.state(`cellClustersData`)).toEqual(payload)
  })

})