import React from 'react'
import renderer from 'react-test-renderer'

import smileyData from '../src/smileyData'
import SmileyDiv from '../src/SmileyDiv'

describe(`SmileyDiv`, () => {
  // Unfortunately, Enzyme doesn’t support pseudoelement selection so we can’t test any property of the emoji or the
  // label, snapshots will need to suffice for now
  test(`matches snapshot`, () => {
    const tree = renderer.create(
      <div>
        { smileyData.map((smiley, idx) => <SmileyDiv key={idx} {...smiley} selected={true} onClick={() => {}}/>) }
        { smileyData.map((smiley, idx) => <SmileyDiv key={idx} {...smiley} selected={false} onClick={() => {}}/>) }
      </div>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
