import React from 'react'
import renderer from 'react-test-renderer'
import { cleanup, render, screen } from '@testing-library/react'

import { lookUpIcon, allSpecies } from '../src/mapping'
import EbiSpeciesIcon from '../src/EbiSpeciesIconBare'

const strToRegExp = str =>
  new RegExp(
    str
      .replace(/\(/g, `\\(`)
      .replace(/\)/g, `\\)`),
    `i`
  )

const altGroupColors = {
  mammals: `brown`,
  plants: `orange`,
  other: `yellow`
}

describe(`EbiSpeciesIcon with classes`, () => {
  allSpecies.forEach(species => {
    test(`Icon of mapped species ${species} matches snapshot`, () => {
      const tree = renderer
        .create(<EbiSpeciesIcon species={species} />)
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  test(`Icon of unknown species matches snapshot`, () => {
    const tree = renderer
      .create(<EbiSpeciesIcon species={`crocubot`} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  test(`doesn’t use EBI VF class names`, () => {
    render(<EbiSpeciesIcon species={`crocubot`} />)
    const ebiSpeciesIcon = screen.getByTitle(strToRegExp(`crocubot`))
    expect(ebiSpeciesIcon).not.toHaveClass(`icon icon-species`)
  })

  test(`Warm-blooded species are red, violets are blue`, () => {
    const mappedMammals = allSpecies.filter(species => lookUpIcon(species)[0] === `mammals`)

    mappedMammals.forEach(warmBloodedAnimal => {
      render(<EbiSpeciesIcon species={warmBloodedAnimal} />)
      const ebiSpeciesIcon = screen.getByTitle(strToRegExp(warmBloodedAnimal))
      expect(ebiSpeciesIcon).toHaveStyle({ color: `red` })
    })

    cleanup()

    mappedMammals.forEach(warmBloodedAnimal => {
      render(<EbiSpeciesIcon species={warmBloodedAnimal} groupColors={altGroupColors} />)
      const ebiSpeciesIcon = screen.getByTitle(strToRegExp(warmBloodedAnimal))
      expect(ebiSpeciesIcon).toHaveStyle({color: altGroupColors.mammals})
    })
  })

  test(`Plants are green`, () => {
    const mappedPlants = allSpecies.filter(species => lookUpIcon(species)[0] === `plants`)

    mappedPlants.forEach(plant => {
      render(<EbiSpeciesIcon species={plant} />)
      const ebiSpeciesIcon = screen.getByTitle(strToRegExp(plant))
      // We’re happy if the colour is green-like
      expect(ebiSpeciesIcon.style.getPropertyValue(`color`)).toMatch(`green`)
    })

    cleanup()

    mappedPlants.forEach(plant => {
      render(<EbiSpeciesIcon species={plant} groupColors={altGroupColors} />)
      const ebiSpeciesIcon = screen.getByTitle(strToRegExp(plant))
      expect(ebiSpeciesIcon).toHaveStyle({ color: altGroupColors.plants })
    })
  })

  test(`Roses are red, others are blue`, () => {
    const mappedOthers = allSpecies.filter(species => lookUpIcon(species)[0] === `other`)

    mappedOthers.forEach(other => {
      render(<EbiSpeciesIcon species={other} />)
      const ebiSpeciesIcon = screen.getByTitle(strToRegExp(other))
      // We’re happy if the colour is blue-like
      expect(ebiSpeciesIcon.style.getPropertyValue(`color`)).toMatch(`blue`)
    })

    cleanup()

    mappedOthers.forEach(other => {
      render(<EbiSpeciesIcon species={other} groupColors={altGroupColors} />)
      const ebiSpeciesIcon = screen.getByTitle(strToRegExp(other))
      expect(ebiSpeciesIcon).toHaveStyle({ color: altGroupColors.other })
    })
  })

  test(`admits a colour prop`, () => {
    const species = `homo sapiens`
    const customColour = `yellow`
    render(<EbiSpeciesIcon species={species} color={customColour} />)
    const ebiSpeciesIcon = screen.getByTitle(strToRegExp(species))
    expect(ebiSpeciesIcon).toHaveStyle({ color: customColour })
  })

  test(`admits a colour prop that has precedence over custom group colouring`, () => {
    const species = `homo sapiens`
    const customColour = `yellow`
    render(<EbiSpeciesIcon species={species} color={customColour} groupColors={altGroupColors} />)
    const ebiSpeciesIcon = screen.getByTitle(strToRegExp(species))
    expect(ebiSpeciesIcon).toHaveStyle({ color: customColour })
  })
})
