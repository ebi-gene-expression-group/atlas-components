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
          geneId={``}
          selectedColourBy={`0`}
          onChangeColourBy={onChangeColourBy}
          perplexities={[]}
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
                geneId={``}
                geneIds={geneIds}
                selectedColourBy={`0`}
                onChangeColourBy={onChangeColourBy}
                perplexities={[]}
                onChangePerplexity={onChangePerplexity}
                loading={true}
                plotData={plotData}/>)

    const tSnePlotView = wrapper.find(TSnePlotView)

    expect(tSnePlotView.props().geneIds.length).toEqual(2)
  })

  //We are doing a shallow debug test here because the styled-component version 5+ being used in TSnePlotView
  //causes the test to fail otherwise with react-test-renderer. An issue has been opened with Styled-Component
  //repo here https://github.com/styled-components/styled-components/issues/3342
  //If a solution to the issue has been found then this test would be updated.

  test(`matches snapshot`, () => {
    const experimentAccession = `E-MTAB-5061`
    const speciesName = `Homo Sapiens`

    const onChangeColourBy = () => {}
    const onChangePerplexity = () => {}
    const plotData = {
      series: []
    }

    const tree = shallow(
        <TSnePlotWidget
          speciesName={speciesName}
          experimentAccession={experimentAccession}
          ks={[]}
          geneId={``}
          selectedColourBy={`0`}
          onChangeColourBy={onChangeColourBy}
          perplexities={[]}
          onChangePerplexity={onChangePerplexity}
          loading={true}
          plotData={plotData}/>)
      .debug()

    expect(tree).toMatchSnapshot()
  })*/
})
