/**
 * @jest-environment jsdom
 */

import React from 'react'
import URI from 'urijs'

import { render, screen } from '@testing-library/react'
import { getDefaultNormalizer } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { server, waitForRequest } from './fetch-mocks/server'
import Autocomplete from '../src/Autocomplete'

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))

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

const props = {
  host: `gxa/sc/`,
  suggesterEndpoint: `suggest`,
  allSpecies: [
    `Meeseek`,
    `Gromflomite`,
    `Cromulon`,
    `Zigerion`,
    `Moopian`,
    `Bliznarvian`,
    `Greebybobe`
  ],
  onChange: () => {},
  labelText: `Foobar`
}

describe(`Autocomplete`, () => {
  test(`displays term of default value`, () => {
    const defaultValue = {
      term: `Morty`,
      category: `Main characters`
    }

    render(
      <Autocomplete
        {...props}
        defaultValue={defaultValue}
      />)
    expect(screen.getByText(defaultValue.term)).toBeInTheDocument()
  })

  // MSW advises against request assertions in https://mswjs.io/docs/recipes/request-assertions, but testing the proper
  // display of the options in React Select is something that falls under the latter’s responsibility and shouldn’t be
  // our concern. Another (better?) option could be to export _asyncFetchOptions and test the function in isolation.
  test(`uses entered text as query for suggestions`, async () => {
    const user = userEvent.setup()
    render(
      <Autocomplete
        {...props}
      />)
    const input = await screen.findByRole(`combobox`)
    input.focus()

    const query = [`f`, `o`, `o`, `b`, `a`, `r`]
    // Unfortunately and unexpectedly, forEach doesn’t work and the request ends up having the whole word in the first
    // iteration, probably beacuse the function is explictly async
    for (let i = 0; i < query.length; i++) {
      const keystroke = query[i]
      const pendingRequest = waitForRequest(`GET`, URI(props.suggesterEndpoint, props.host).toString())
      user.keyboard(`{${keystroke}}`)
      const request = await pendingRequest
      expect(URI(request.url.toString()).query(true)).toHaveProperty(`query`, query.slice(0, i + 1).join(``))
    }
  })

  test(`uses selected species as a request parameter to filter suggestions`, async () => {
    const user = userEvent.setup()
    const randomSpecies = props.allSpecies[getRandomInt(props.allSpecies.length)]
    render(
      <Autocomplete
        {...props}
        selectedSpecies = {randomSpecies}
      />)
    const input = await screen.findByRole(`combobox`)
    input.focus()

    const pendingRequest = waitForRequest(`GET`, URI(props.suggesterEndpoint, props.host).toString())
    user.keyboard(`{a}`)
    const request = await pendingRequest
    expect(URI(request.url.toString()).query(true)).toHaveProperty(`species`, randomSpecies)
  })

  test(`uses all species to filter suggestions if no species is selected`, async () => {
    const user = userEvent.setup()
    render(
      <Autocomplete
        {...props}
      />)
    const input = await screen.findByRole(`combobox`)
    input.focus()

    const pendingRequest = waitForRequest(`GET`, URI(props.suggesterEndpoint, props.host).toString())
    user.keyboard(`{a}`)
    const request = await pendingRequest
    expect(URI(request.url.toString()).query(true)).toHaveProperty(`species`, props.allSpecies.join(`,`))
  })

  test(`shows an empty label if it’s explicitly set to an empty string`, () => {
    render(
      <Autocomplete
        {...props}
        labelText={``}
      />)

    expect(
      screen.getByLabelText(
        ` `,
        { normalizer: getDefaultNormalizer({ trim: false }) }
      )
    ).toBeInTheDocument()
  })

  test(`can customise the label to any non-empty text`, () => {
    const labelText = `Elvis has left the building`
    render(
      <Autocomplete
        {...props}
        labelText={labelText}
      />)

    expect(screen.getByLabelText(labelText)).toBeInTheDocument()
  })

  test(`renders correctly`, () => {
    const { container } = render(<Autocomplete {...props} />)
    expect(container).toMatchSnapshot()
  })
})
