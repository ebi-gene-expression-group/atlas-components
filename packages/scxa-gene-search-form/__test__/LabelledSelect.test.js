/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import LabelledSelect from '../src/LabelledSelect'

import * as species from './utils/species'

const props = {
  name: `Species`,
  topGroup: species.getRandomSet(),
  bottomGroup: species.getAll(),
  bottomGroupLabel: `All species`,
  statusMessage: null,
  onChange: () => {}
}

describe(`LabelledSelect`, () => {
  test(`is disabled when a statusMessage (i.e. an error message) is passed in and it is displayed`, () => {
    const errorMessage = `Any schwifty, non-empty string`
    render(
      <LabelledSelect
        {...props}
        statusMessage={errorMessage}
      />)

    const input = screen.getByRole(`combobox`)
    expect(input).toBeDisabled()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test(`is enabled when statusMessage is null`, () => {
    render(
      <LabelledSelect
        {...props}
      />)

    const input = screen.getByRole(`combobox`)
    expect(input).toBeEnabled()
  })

  test(`selects Any by default`, () => {
    render(
      <LabelledSelect
        {...props}
      />)

    expect(screen.getByText(`Any`)).toBeInTheDocument()
    species.getAll().forEach(_species => expect(screen.queryByText(_species)).not.toBeInTheDocument())
  })

  test(`can select an option via props`, () => {
    const selectedSpecies = species.getRandom()
    render(
      <LabelledSelect
        {...props}
        value={selectedSpecies}/>)

    expect(screen.getByText(selectedSpecies)).toBeInTheDocument()
  })

  test(`selects Any if value doesn’t match any in option in topGroup or bottomGroup`, () => {
    render(
      <LabelledSelect
        {...props}
        value={`Human`}/>)

    expect(screen.getByText(`Any`)).toBeInTheDocument()
    expect(screen.queryByText(`Human`)).not.toBeInTheDocument()
  })

  test(`changing the value in the React Select component fires the onChange prop function`, async () => {
    const user = userEvent.setup()
    const onChangeMock = jest.fn()

    render(
      <LabelledSelect
        {...props}
        onChange={onChangeMock} />
    )

    // Open the selection with all the options
    const input = screen.getByRole(`combobox`)
    await user.click(input)

    // Choose a random species
    const speciesToSelect = species.getRandom()
    // We nedd to use findAllByText because an option can appear twice: in the top group and in all below
    const options = await screen.findAllByText(speciesToSelect)
    await user.click(options[0])

    expect(onChangeMock.mock.calls).toHaveLength(1)
    expect(onChangeMock.mock.calls[0][0]).toEqual({ value: speciesToSelect, label: speciesToSelect })
  })
})
