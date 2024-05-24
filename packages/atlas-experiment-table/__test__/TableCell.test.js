import React from 'react'
import { shallow, mount } from 'enzyme'

import { Table, Text } from 'evergreen-ui'

import TableCell from '../src/TableCell'

import randomString from 'random-string'
import { getRandomInt } from './TestUtils'

describe(`TableCell`, () => {
  const MAX_DATA_ROW_ARRAY_LENGTH = 20

  const props = {
    dataRow: {
      string: randomString(),
      experimentAccession: randomString(),
      number: getRandomInt(0, 9001),
      arrayOfStrings:
        Array.apply(0, Array(getRandomInt(1, MAX_DATA_ROW_ARRAY_LENGTH)))
          .map(() => randomString()),
      arrayOfNumbers:
        Array.apply(0, Array(getRandomInt(1, MAX_DATA_ROW_ARRAY_LENGTH)))
          .map(() => getRandomInt(0, 9001)),
      arrayOfStringsAndNumbers:
        Array.apply(0, Array(getRandomInt(1, MAX_DATA_ROW_ARRAY_LENGTH)))
          .map(() => Math.random() < 0.5 ? randomString() : getRandomInt(0, 9001))
    }
  }

  test(`is a plain text field if keyed row value is a string`, () =>{
    const wrapper = shallow(<TableCell {...props} dataKey={`string`}/>)

    expect(wrapper.find(Table.Cell).find(Text).children()).toHaveText(props.dataRow.string)
  })

  test(`is a plain text field if keyed row value is a number`, () =>{
    const wrapper = shallow(<TableCell {...props} dataKey={`number`}/>)

    expect(wrapper.find(Table.Cell).find(Text).children()).toHaveText(props.dataRow.number.toString())
  })

  test.each(
    [`arrayOfStrings`, `arrayOfNumbers`, `arrayOfStringsAndNumbers`]
  )(`is an unordered-list if keyed row value is an array`, (arrayDataKey) => {
    const wrapper = shallow(<TableCell {...props} dataKey={arrayDataKey}/>)

    expect(wrapper.find(Table.Cell).find(`li`)).toHaveLength(props.dataRow[arrayDataKey].length)
    expect(wrapper.find(Table.Cell).find(`li`).first()).toHaveText(props.dataRow[arrayDataKey][0].toString())
    expect(wrapper.find(Table.Cell).find(`li`).last())
      .toHaveText(props.dataRow[arrayDataKey][props.dataRow[arrayDataKey].length - 1].toString())
  })

  test(`is an image if a dictionary of images is passed as prop`, () => {
    const image = {
      [props.dataRow.string]: {
        src: `imageUrl`,
        alt: `altText`
      }
    }
    const wrapper = shallow(<TableCell {...props} image={image} dataKey={`string`}/>)

    expect(wrapper.find(Table.Cell)).toContainExactlyOneMatchingElement(`img`)
    expect(wrapper.find(Table.Cell).find(`img`)).toHaveProp({src: `imageUrl`, alt: `altText`})
  })

  test.each(
      [`E-ANND-12`, `testExperimentAccession`, `E-MTAB-12`]
  )(`contains an icon and check if it is an Anndata experiment or no icons for others`, (arrayDataKey) => {
    props.dataRow.experimentAccession = arrayDataKey

    const wrapper = shallow(<TableCell {...props} label={`Title`} dataKey={`string`} />)
    0
    if (arrayDataKey.startsWith(`E-ANND`)) {
      // If it's an Anndata experiment, there should be an icon
      expect(wrapper.find('.icon').length).toBe(1);
    } else {
      // For other types, there should be no icon
      expect(wrapper.find('.icon').length).toBe(0);
    }
  })

  test(`defaults to a fallback icon if a suitable image can’t be found`, () => {
    const image = {}
    const wrapper = shallow(<TableCell {...props} image={image} dataKey={`string`}/>)

    expect(wrapper.find(Table.Cell).find(`img`)).not.toExist()
    expect(wrapper.find(Table.Cell).find(Text).children()).toHaveText(`❔`)
  })

  test(`shows a link if a linkTo function has been passed`, () => {
    const linkTo = dataRow => `https://some.domain/${dataRow.string}/someResource`
    const wrapper = shallow(<TableCell {...props} linkTo={linkTo} dataKey={`number`}/>)

    expect(wrapper.find(Table.Cell)).toContainExactlyOneMatchingElement(`a`)
    expect(wrapper.find(Table.Cell).find(`a`)).toHaveProp({ href: linkTo(props.dataRow) })
  })

  test(`matches snapshot (sring)`, () => {
    const dataRow = {
      string: `foobar`
    }
    const wrapper = mount(<TableCell dataRow={dataRow} dataKey={`string`}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (number)`, () => {
    const dataRow = {
      number: 9001
    }
    const wrapper = mount(<TableCell dataRow={dataRow} dataKey={`number`}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (array of strings)`, () => {
    const dataRow = {
      arrayOfStrings: [
        `I mean, why would a Pop-Tart want to live inside a toaster, Rick?`,
        `I mean, that would be like the scariest place for them to live.`,
        `You know what I mean?`]
    }
    const wrapper = mount(<TableCell dataRow={dataRow} dataKey={`arrayOfStrings`}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (array of numbers)`, () => {
    const dataRow = {
      arrayOfNumbers: [42, 9001]
    }
    const wrapper = mount(<TableCell dataRow={dataRow} dataKey={`arrayOfNumbers`}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (array of strings and numbers)`, () => {
    const dataRow = {
      arrayOfStringsAndNumbers: [
        `Answer to the ultimate question of life, the Universe, and everything`,
        42,
        `Vegeta, what does the scouter say about his power level?`,
        9001]
    }
    const wrapper = mount(<TableCell dataRow={dataRow} dataKey={`arrayOfStringsAndNumbers`}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (image)`, () => {
    const dataRow = {
      string: `foobar`
    }
    const image={
      [dataRow.string]: {
        src: `https://imgs.xkcd.com/comics/ringtone_timeline_2x.png`,
        alt: `Ringtone Timeline`,
        title: `No one likes my novelty ringtone, an audio recording of a phone on vibrate sitting on a hard surface.`
      }
    }
    const wrapper = mount(<TableCell dataRow={dataRow} image={image} dataKey={`string`}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (missing image)`, () => {
    const dataRow = {
      string: `foobar`
    }
    const image = {}
    const wrapper = mount(<TableCell dataRow={dataRow} image={image} dataKey={`string`}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (text link)`, () => {
    const dataRow = {
      string: `foobar`
    }
    const toLink = dataRow => `https://go.to/${dataRow.string}`
    const wrapper = mount(<TableCell dataRow={dataRow} toLink={toLink} dataKey={`string`}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (image link)`, () => {
    const dataRow = {
      string: `foobar`
    }
    const image={
      [dataRow.string]: {
        src: `https://imgs.xkcd.com/comics/ringtone_timeline_2x.png`,
        alt: `Ringtone Timeline`,
        title: `No one likes my novelty ringtone, an audio recording of a phone on vibrate sitting on a hard surface.`
      }
    }
    const toLink = dataRow => `https://go.to/${dataRow.string}`
    const wrapper = mount(<TableCell dataRow={dataRow} image={image} toLink={toLink} dataKey={`string`}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
