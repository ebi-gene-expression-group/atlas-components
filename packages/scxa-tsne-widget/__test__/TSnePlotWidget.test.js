import '@babel/polyfill'
import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import TSnePlotWidget from '../src/TSnePlotWidget'
import TSnePlotView from '@ebi-gene-expression-group/scxa-tsne-plot'

describe(`TSnePlotWidget`, () => {

  test(`whether showControl prop is true or false`, () => {
    const experimentAccession = `E-MTAB-5061`
    const speciesName = `Homo Sapiens`

    const onChangeColourBy = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }

    const wrapper =
      shallow(
        <TSnePlotWidget
          speciesName={speciesName}
          experimentAccession={experimentAccession}
          ks={[]}
          metadata={[]}
          selectedColourBy={`0`}
          onChangeColourBy={onChangeColourBy}
          perplexities={[]}
          selectedPerplexity={0}
          onChangePerplexity={onChangePerplexity}
          loading={true}
          plotData={plotData}/>)

    const tSnePlotView = wrapper.find(TSnePlotView)

    expect(tSnePlotView.props().showControls).toBe(false)
  })

  test(`whether geneIds prop is passed or not`, () => {
    const experimentAccession = `E-MTAB-5061`
    const speciesName = `Homo Sapiens`

    const onChangeColourBy = () => {}
    const onChangePerplexity = () => {}
    const geneIds = [`foo`, `bar`]
    const plotData = {
      series: []
    }

    const wrapper =
        shallow(
            <TSnePlotWidget
                speciesName={speciesName}
                experimentAccession={experimentAccession}
                ks={[]}
                metadata={[]}
                geneIds={geneIds}
                selectedColourBy={`0`}
                onChangeColourBy={onChangeColourBy}
                perplexities={[]}
                selectedPerplexity={0}
                onChangePerplexity={onChangePerplexity}
                loading={true}
                plotData={plotData}/>)

    const tSnePlotView = wrapper.find(TSnePlotView)

    expect(tSnePlotView.props().geneIds.length).toEqual(2)
  })

  /*test(`matches snapshot`, () => {
    const experimentAccession = `E-MTAB-5061`
    const speciesName = `Homo Sapiens`

    const onChangeColourBy = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }

    const tree = renderer
      .create(
        <TSnePlotWidget
          speciesName={speciesName}
          experimentAccession={experimentAccession}
          ks={[]}
          geneId={``}
          metadata={[]}
          selectedColourBy={`0`}
          onChangeColourBy={onChangeColourBy}
          perplexities={[]}
          selectedPerplexity={0}
          onChangePerplexity={onChangePerplexity}
          loading={true}
          plotData={plotData}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })*/
})
