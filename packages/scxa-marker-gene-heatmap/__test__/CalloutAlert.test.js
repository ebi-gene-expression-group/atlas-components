import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom' // for matcher like toBeInTheDocument
import renderer from 'react-test-renderer'
import CalloutAlert from '../src/CalloutAlert'

describe(`CalloutAlert`, () => {
  const props = {
    error: {
      description: `A human-readable description of the error, hopefully useful to the user`,
      name: `Error name`,
      message: `Error message`
    }
  }

  it(`prints all the relevant error information`, () => {
    render(<CalloutAlert {...props} />)

    expect(screen.getByText((content, element) => {
      return content.includes(props.error.description)
    })).toBeInTheDocument()

    expect(screen.getByText((content, element) => {
      return content.includes(props.error.name)
    })).toBeInTheDocument()

    expect(screen.getByText((content, element) => {
      return content.includes(props.error.message)
    })).toBeInTheDocument()
  })

  it(`matches snapshot`, () => {
    const tree = renderer.create(<CalloutAlert {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
