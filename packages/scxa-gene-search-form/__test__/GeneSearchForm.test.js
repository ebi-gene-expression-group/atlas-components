/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { server } from './fetch-mocks/server'

import GeneSearchForm from '../src/GeneSearchForm'

import * as species from './utils/species'
import searchExamples from './utils/searchExamples'

const props = {
  host: `gxa/sc/`,
  actionEndpoint: `search`,
  suggesterEndpoint: `suggest`,
  enableSpeciesSelect: true,
  allSpecies: species.getAll(),
  topSpecies: species.getRandomSet(),
  searchExamples: searchExamples
}

const defaultValue = {
  term: `foo`,
  category: `bar`
}

const generateEmptyString = () => {
  const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))
  const randomSpaceChar = () => [``, `\t`, ` `, `\n`][getRandomInt(4)]

  let decreasingThreshold = 0.9
  let blankString = ``
  while (Math.random() < decreasingThreshold) {
    blankString = blankString + randomSpaceChar()
    decreasingThreshold = decreasingThreshold * decreasingThreshold
  }

  return blankString
}

beforeAll(() => {
  // Enable the mocking in tests
  server.listen()
})

afterEach(() => {
  // Reset any runtime handlers tests may use
  server.resetHandlers()
})

afterAll(() => {
  // Clean up once the tests are done
  server.close()
})

describe(`GeneSearchForm`, () => {
  test(`search button is initially disabled`, () => {
    render(<GeneSearchForm {...props}/>)
    const button = screen.getByRole(`button`)
    expect(button).toBeDisabled()
  })

  test(`search button with invalid default value (i.e. empty term) is disabled`, () => {
    const emptyString = generateEmptyString()
    expect(emptyString).toMatch(/\s*/)

    render(
      <GeneSearchForm
        {...props}
        defaultValue={{ term: emptyString, category: `q` }}/>)
    const button = screen.getByRole(`button`)
    expect(button).toBeDisabled()
  })

  test(`search button with valid default value is enabled`, () => {
    render(
      <GeneSearchForm
        {...props}
        defaultValue={defaultValue}/>)
    const button = screen.getByRole(`button`)
    expect(button).toBeEnabled()
  })

  test(`runs onSubmit when the Search button is clicked and the query is passed as arg`, async () => {
    const user = userEvent.setup()
    const onSubmitMock = jest.fn()
    const searchTerm = `some search term`

    render(
      <GeneSearchForm
        {...props}
        onSubmit={onSubmitMock}
      />)

    const autocomplete = screen.getAllByRole(`combobox`)[0]
    autocomplete.focus()
    // Pressing Enter bypasses the suggestions and sets the value of the input to the typed text as-is
    await user.keyboard(`${searchTerm}[Enter]`)

    const button = screen.getByRole(`button`)
    await user.click(button)

    // onSubmitMock.mock.calls[0][0] is the event, passed as first argument to onSubmit
    expect(onSubmitMock.mock.calls[0][1]).toEqual({ term: searchTerm, category: `q` })
  })

  // TODO Rewrite this test modifying handlers.js and verifying you get a filtered list of suggestions
  test(`runs onSubmit when the Search button is clicked and the selected species is passed as arg`, async () => {
    const user = userEvent.setup()
    const onSubmitMock = jest.fn()
    const searchTerm = `some search term`
    const selectedSpecies = species.getRandom()

    render(
      <GeneSearchForm
        {...props}
        onSubmit={onSubmitMock}
      />)

    const autocomplete = screen.getAllByRole(`combobox`)[0]
    autocomplete.focus()
    // Pressing Enter bypasses the suggestions and sets the value of the input to the typed text as-is
    await user.keyboard(`${searchTerm}[Enter]`)

    const speciesSelect = screen.getAllByRole(`combobox`)[1]
    await user.click(speciesSelect)
    await user.click(screen.getAllByText(selectedSpecies)[0])

    const button = screen.getByRole(`button`)
    await user.click(button)

    console.log(onSubmitMock.mock.calls)
    // onSubmitMock.mock.calls[0][0] is the event, passed as first argument to onSubmit
    expect(onSubmitMock.mock.calls[0][2]).toEqual(selectedSpecies)
  })

  test(`defaults to category 'q' (after 'query') if the default value doesn’t have the category field`, async () => {
    const user = userEvent.setup()
    const onSubmitMock = jest.fn()

    const defaultValue = { term: `foo` }
    render(
      <GeneSearchForm
        {...props}
        defaultValue={defaultValue}
        onSubmit={onSubmitMock}
      />)
    const button = screen.getByRole(`button`)
    await user.click(button)

    // onSubmitMock.mock.calls[0][0] is the event, passed as first argument to onSubmit
    expect(onSubmitMock.mock.calls[0][1]).toEqual({ term: defaultValue.term, category: `q` })
  })

  test(`defaults to category 'q' (after 'query') if the default value has an empty category`, async () => {
    const user = userEvent.setup()
    const onSubmitMock = jest.fn()

    const emptyString = generateEmptyString()
    expect(emptyString).toMatch(/\s*/)
    const defaultValue = { term: `foo`, category: emptyString }
    render(
      <GeneSearchForm
        {...props}
        defaultValue={defaultValue}
        onSubmit={onSubmitMock}
      />)
    const button = screen.getByRole(`button`)
    await user.click(button)

    // onSubmitMock.mock.calls[0][0] is the event, passed as first argument to onSubmit
    expect(onSubmitMock.mock.calls[0][1]).toEqual({ term: defaultValue.term, category: `q` })
  })

  test(`renders correctly`, () => {
    // The randomised set in topSpecies doesn’t affect the snapshot because the drop-down is initially closed
    const tree = render(<GeneSearchForm {...props}/>)
    expect(tree).toMatchSnapshot()
  })
})
