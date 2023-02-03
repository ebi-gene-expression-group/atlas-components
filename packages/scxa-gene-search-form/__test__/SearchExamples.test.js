/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen } from '@testing-library/react'

import SearchExamples from '../src/SearchExamples'
import searchExamples from './utils/searchExamples'

const props = {
  links: searchExamples.filter(() => Math.random() > 0.5)
}

describe(`SearchExamples`, () => {
  test(`renders one link per element`, () => {
    render(<SearchExamples {...props} />)
    props.links.forEach(link => {
      expect(screen.getByText(link.text)).toBeInTheDocument()
    })
  })

  test(`matches snapshot`, () => {
    const { container } = render(<SearchExamples links={searchExamples} />)
    expect(container).toMatchSnapshot()
  })
})
