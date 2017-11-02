import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import BioentityInformation from '../src/BioentityInformation.js'

Enzyme.configure({ adapter: new Adapter() })

const bioentityData = [{
    "type": "go",
    "name": "Gene Ontology",
    "values": [

        {
            "text": "Link of relevance 1",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0000978",
            "relevance": 1
        },
        {
            "text": "a Link of relevance 2",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0000978",
            "relevance": 2
        },
        {
            "text": "Link of relevance 3",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0000978",
            "relevance": 3
        },
        {
            "text": "b Link of relevance 2",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0000978",
            "relevance": 2
        },
        {
            "text": "Link of relevance 3- another",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0000978",
            "relevance": 3
        },
        {
            "text": "RNA polymerase II core promoter proximal region sequence-specific DNA binding",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0000978",
            "relevance": 0
        }, {
            "text": "nucleic acid binding",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0003676",
            "relevance": 0
        }, {
            "text": "intracellular",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0005622",
            "relevance": 0
        }, {
            "text": "nucleus",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0005634",
            "relevance": 0
        }, {
            "text": "transcription, DNA-templated",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0006351",
            "relevance": 0
        }, {
            "text": "regulation of transcription, DNA-templated",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0006355",
            "relevance": 0
        }, {
            "text": "zinc ion binding",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0008270",
            "relevance": 0
        }, {
            "text": "metal ion binding",
            "url": "http://amigo.geneontology.org/amigo/term/GO%3A0046872",
            "relevance": 0
        }]
    }, {
    "type": "pathway",
    "name": "Reactome Pathways",
    "values": []
}];

describe(`BioentityInformation`, () => {
  test(`should render without throwing an error`, () => {
      expect(mount(<BioentityInformation bioentityProperties={bioentityData} />)).toHaveLength(1)
  })

  test('render props lenght', () => {
      const wrapper = shallow(<BioentityInformation bioentityProperties={bioentityData}/>);
      expect(wrapper.find('BioentityProperty')).toHaveLength(2)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<BioentityInformation bioentityProperties={bioentityData} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
