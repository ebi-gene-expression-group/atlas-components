import React from 'react'
import renderer from 'react-test-renderer'
import fetchMock from 'fetch-mock'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import BioentityInformation from '../src/BioentityInformation.js'
import Loading from '../src/Loading'
import {mockBioentityProperties} from './Utils'

Enzyme.configure({ adapter: new Adapter() })

describe(`BioentityInformation`, () => {
  const defaultProps = {
    atlasUrl: `https://www.ebi.ac.uk/gxa/sc/`,
    geneId: `ENS0001`
  }

  const dummyBioentityData = [
    {
      type: `go`,
      name: `Gene ontology`,
      values: [
        {
          text: `response to glucocorticoid`,
          url: `http://www.ebi.ac.uk/ols/ontologies/go/terms?iri=http://purl.obolibrary.org/obo/GO_0051384`,
          relevance: 7
        },
        {
          text: `cellular response to nitric oxide`,
          url: `http://www.ebi.ac.uk/ols/ontologies/go/terms?iri=http://purl.obolibrary.org/obo/GO_0071732`,
          relevance: 7
        }]
    },
    {
      type: `interpro`,
      name: `InterPro`,
      values: [
        {
          text: `C-type lectin-like (domain)`,
          url: `http://www.ebi.ac.uk/interpro/entry/IPR016186`,
          relevance: 0
        },
        {
          text: `C-type lectin fold (domain)`,
          url: `http://www.ebi.ac.uk/interpro/entry/IPR016187`,
          relevance: 0
        }]
    }
  ]

  const atlasEndpoint = `json/bioentity_information/`

  beforeEach(() => {
    fetchMock.restore()
  })


  test(`with no data matches snapshot`, () => {
    const tree = renderer.create(<BioentityInformation atlasUrl={``} geneId={``} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test(`should show loading screen by default`, () => {
    const wrapper = mount(<BioentityInformation atlasUrl={``} geneId={defaultProps.geneId} />)

    expect((wrapper).find(Loading).exists()).toBe(true)
  })

  test(`should not render if gene ID is empty`, () => {
    const wrapper = mount(<BioentityInformation atlasUrl={``} geneId={``} />)

    expect(wrapper.find(`table`)).toHaveLength(0)
    expect((wrapper).find(Loading).exists()).toBe(false)
  })

  test(`changes in gene ID change state`, async() => {
    const url = defaultProps.atlasUrl + atlasEndpoint + defaultProps.geneId

    // New gene ID passed to component
    const newGeneID = `ENSG0002`
    const newUrl = defaultProps.atlasUrl + atlasEndpoint + newGeneID

    fetchMock.get(url, JSON.stringify(mockBioentityProperties()))

    const wrapper = shallow(<BioentityInformation atlasUrl={defaultProps.atlasUrl} geneId={defaultProps.geneId}/>)
    await wrapper.instance().componentDidMount()

    wrapper.update()

    expect(wrapper.state(`bioentityProperties`)).toHaveLength(mockBioentityProperties().length)

    fetchMock.get(newUrl, JSON.stringify(dummyBioentityData))

    await wrapper.instance().componentWillReceiveProps({
      atlasUrl: defaultProps.atlasUrl,
      geneId: newGeneID
    })

    expect(wrapper.state(`bioentityProperties`)).toHaveLength(dummyBioentityData.length)
  })

  test(`error boundary sets error messgae state`, () => {
    const errorMessage = `This is an error message!`
    const error = {
      toString: () => errorMessage
    }

    const wrapper = shallow(<BioentityInformation atlasUrl={defaultProps.atlasUrl} geneId={defaultProps.geneId}/>)
    wrapper.instance().componentDidCatch(error)

    expect(wrapper.state(`errorMessage`)).toBe(errorMessage)
  })

  test(`sets error message if fetch fails`, async() => {
    const url = defaultProps.atlasUrl + atlasEndpoint + defaultProps.geneId

    fetchMock.get(url, { throws: `Server unreachable` })
    const wrapper = shallow(<BioentityInformation atlasUrl={defaultProps.atlasUrl} geneId={defaultProps.geneId}/>)
    await wrapper.instance().componentDidMount()

    expect(wrapper.state(`errorMessage`)).not.toBe(null)
  })
})
